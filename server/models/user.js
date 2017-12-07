const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

// new way
var User = mongoose.model('User', UserSchema);



module.exports = { User };