const {MongoClient, ObjectID} = require('mongodb');

var objectID = new ObjectID();
console.log(objectID);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB');
    // Pass an object to handle complex queries
    db.collection('Users').find( {name: 'Isa'} ).toArray().then ((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Run into an Error ', err);
    });

    db.close();

});