var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose'); 
const {ObjectID} = require('mongodb');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

mongoose.Promise = global.Promise;

var app = express();
app.use(bodyParser.json());

var PORT = 3000;

app.post('/todos', (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then(
        (doc) => 
        {
          res.send(doc);
        }, 
        (error) => 
        {
            res.status(400).send(error);
        });
});

app.get('/todos', (req,res) => {
    Todo.find().then((todos) => {
        res.send({todos: todos});
    },(error)=>{
        res.status(400).send(error);
    });
});

app.get('/todos/:id', (req,res) => {
 //   res.send(req.params);
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        //console.log('In obj id failed');
        return res.status(404).send();
    }
    Todo.findById(id).then((todos) => {
        if(todos){
            //console.log('In found');
            return res.send({todos: todos});
        }
        else {
            //console.log('In not found');
            return res.status(404).send({todos: todos});
        }
    }).catch((error) => {
        return res.status(400).send();
    });
});


// app.get('/todos/:id', (req,res) => {
//     //   res.send(req.params);
//        var id = req.params.id;
//        if (!ObjectID.isValid(id)) {
//            console.log('In obj id failed');
//            return res.status(404).send();
//        }
//        Todo.findById(id).then((todos) => {
//            if(todos){
//                console.log('In found');
//                return res.send({todos: todos});
//            }
//            else {
//                console.log('In not found');
//                return res.status(404).send({todos: todos});
//            }
//        }, (error) => {
//         return res.status(400).send();  
//        });
//    });

app.listen(PORT||3000, () => {
    console.log(`Server started in port ${PORT}`);
});

module.exports = { app };