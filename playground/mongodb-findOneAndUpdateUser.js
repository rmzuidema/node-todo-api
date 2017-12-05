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

  db.collection('Users').findOneAndUpdate(
      {
          _id: new ObjectID('5a22be13539d781738dc685b')
      },
      {
          $set: { name: 'Maria de Fatima'},
          $inc: { age: -4}
      },
      {
          returnOriginal: false
      }
  ).then( (result) => {
      console.log(result);
  });



db.close();

});