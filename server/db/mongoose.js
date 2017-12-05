var mongoose = require('mongoose');

// Use the built in Promise that comes with current JS
mongoose.Promise = global.Promise;
// Connect to database
mongoose.connect('mongodb://localhost:27017/NewTodoApp',{ useMongoClient: true});

module.exports = {
    mongoose: mongoose
}