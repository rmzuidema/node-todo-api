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

    db.collection('Todos').find().count().then((count) => {
        console.log(`Found ${count}`);
    }, (err) => {
        console.log(`Something failed ${err} `);
    });




db.close();

});