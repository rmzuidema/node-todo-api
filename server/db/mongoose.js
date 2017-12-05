var mongoose = require('mongoose');

// Use the built in Promise that comes with current JS
mongoose.Promise = global.Promise;
// Connect to database

mongoose.connect('mongodb://todouser:todouser58@ds129966.mlab.com:29966/newtodoapp');
//mongoose.connect('mongodb://localhost:27017/newtodoapp',{ useMongoClient: true});

module.exports = {
    mongoose: mongoose
}