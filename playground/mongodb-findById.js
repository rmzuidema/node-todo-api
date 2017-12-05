const {MongoClient, ObjectID} = require('mongodb');

var objectID = new ObjectID();
console.log(objectID);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB');
    // Find by Object Id
    var keyId = new ObjectID('5a22be8c8c237b1c9c0a79af');
    db.collection('Todos').find( {_id: keyId } ).toArray().then ((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Run into an Error ', err);
    });

    db.close();

});