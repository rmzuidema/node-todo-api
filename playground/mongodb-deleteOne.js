const { MongoClient, ObjectID } = require('mongodb');

var objectID = new ObjectID();
console.log(objectID);

// Find all
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB');
    // Notice the then function -- async call

  // delete many

  db.collection('Todos').deleteOne({ text: 'Something to do'}).then( (result) => {
      console.log(result);
      console.log(`Result ${result}`);
  })




db.close();

});