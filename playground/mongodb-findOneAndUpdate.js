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

  // find one and update  

  db.collection('Todos').findOneAndUpdate(
      {
          _id: new ObjectID('5a22d87d5f596afbe0aa987d')
      },
      {
          $set: { completed: true}
      },
      {
          returnOriginal: false
      }
  ).then( (result) => {
      console.log(result);
  });



db.close();

});