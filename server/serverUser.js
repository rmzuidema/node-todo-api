var mongoose = require('mongoose');

// Use the built in Promise that comes with current JS
mongoose.Promise = global.Promise;
// Connect to database
mongoose.connect('mongodb://localhost:27017/NewTodoApp',{ useMongoClient: true});

// Define a model
// Means all objects have the same structure

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        validate: {
            validator: (value)=> {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(value);
            }
        }
    }
});

var newUser = new User({
    email: 'someOtherEmail@<>email.com'
});

newUser.save().then( (doc) => {
    console.log('Result is ', doc);
}, (error) => {
    console.log(error);
});