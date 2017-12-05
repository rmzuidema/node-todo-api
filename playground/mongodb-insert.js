const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB Server');
    }

    console.log('Connected to MongoDb Server');

    // db.collection('Todos').insertOne({
    //     text: "Study NodeJS",
    //     completed: false
    // },(err, result) => {
    //     if (err) {
    //         return console.log('Insert one failed', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
        name: "Isa",
        age: 21,
        location: "Miramar"
    },(err, result) => {
        if (err) {
            return console.log('Insert one failed', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.close();

});