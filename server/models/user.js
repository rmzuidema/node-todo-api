const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// Creating a schema 
var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    },
    password: {
      type: String,
      require: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
  });

// filter out some of the fields in the return object to the client
UserSchema.methods.toJSON = function() {
    var user = this;
    // convert the user to a usable object
    var userObject = user.toObject();

    return _.pick( userObject, ['email', '_id']);

};

UserSchema.methods.generateAuthToken = function (id) {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: id, access: 'auth'},  process.env.JWT_SECRET).toString();
    //console.log('In generateAuthToken ', user._id.toHexString());
    //console.log('In push ', token);
    user.tokens.push({access, token});

};

UserSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: {
                token:token
            }
        }
    });
};


// Create a static method
// Will return a promise
UserSchema.statics.findByToken = function(token){
    // the "this" object is the model User
    var User = this;
    var decoded; // set to undefined

    try {
        decoded = jwt.verify(token,  process.env.JWT_SECRET);
        //console.log('Decoded ', decoded);
    } catch(e) {
        return new Promise((resolve, reject) => {
            // Failed so reject
            reject();
        });
    }

    return User.findOne({
        '_id' : decoded._id,
        'tokens.token' : token,
        'tokens.access': 'auth'
        });
};

UserSchema.statics.findByCredentials = function(email, password){
    // the "this" object is the model User
    var User = this;
    // returning a promise that can be rejected or chained to a then
    return User.findOne({email}).then((user)=> {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject)=> {
            bcrypt.compare(password, user.password).then((res)=> {
                if (res) {
                    resolve(user);
                }
                else {
                    reject();
                }
            });
        });
    });

}

UserSchema.pre('save', function(next) {
    // not sure why in this case the this is the instance and not the Schema
    var user = this;
    // existing method in the user -- provided by mongoose
    if (user.isModified('password')) {
        //console.log('User is modified');
        // must encrypt the password
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, function (err, hash) {
                //console.log('User is modified and hash = ', hash);
                // Store hash in user and in the DB. 
               user.password=hash;
               next();
            });
        });
        // this else is required here as the process is 
        // async and the next can be called beore the value is set in the user
    } else{
        next();
    };

});

// new way
var User = mongoose.model('User', UserSchema);



module.exports = { User };