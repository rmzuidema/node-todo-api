var mongoose = require('mongoose');

// Use the built in Promise that comes with current JS
mongoose.Promise = global.Promise;
// Connect to database

// Run in Mlab ==> remove comments from line below
mongoose.connect('mongodb://todouser:todouser58@ds129966.mlab.com:29966/newtodoapp');

// Run local ==> remove comments from line below
//mongoose.connect('mongodb://localhost:27017/NewTodoApp',{ useMongoClient: true});

module.exports = {
    mongoose: mongoose
}