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
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
               return validator.isEmail(value);
            },
            message: "{VALUE} is not a valid email"
        }
    },
    password: {
        type: String,
        required: true,
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

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access: access
    }, 'saltSecret').toString();

    user.tokens.push({access: access, token: token});

};


// Create a static method
// Will return a promise
UserSchema.statics.findByToken = function(token){
    // the "this" object is the model User
    var User = this;
    var decoded; // set to undefined

    try {
        decoded = jwt.verify(token, 'saltSecret');
        console.log('Decoded ', decoded);
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

UserSchema.pre('save', function(next) {
    // not sure why in this case the this is the instance and not the Schema
    var user = this;
    // existing method in the user -- provided by mongoose
    if (user.isModified('password')) {
        console.log('User is modified');
        // must encrypt the password
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, function (err, hash) {
                console.log('User is modified and hash = ', hash);
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