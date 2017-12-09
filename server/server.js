require('./config/config');

const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose'); 
const {ObjectID} = require('mongodb');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

mongoose.Promise = global.Promise;

var app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;


app.post('/todos', (req, res) => {
    //console.log(req.body);
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

// tried using a then with error
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

app.delete('/todos/:id', (req,res) => {
       var id = req.params.id;
       if (!ObjectID.isValid(id)) {
           console.log('In obj id failed', id);
           return res.status(404).send();
       }
       Todo.findByIdAndRemove(id).then( (todo) => {
           if(todo){
               console.log('In found');
               return res.send({todo: todo});
           }
           else {
               console.log('In not found');
               return res.status(404).send({todos: todo});
           }
       }).catch( (error) => {
           return res.status(400).send();
       });

      
   });


   app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        //console.log('In obj id failed');
        return res.status(404).send();
    }
    var body = _.pick(req.body, ["text", "completed"]);

    if (_.isBoolean(body.completed) && (body.completed)){
        //console.log("If -- body.completed", _.isBoolean(body.completed));
        body.completedAt = new Date().getTime();
        body.completed = true;
    } else {
        //console.log("Else -- body.completed", _.isBoolean(body.completed));
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});

    }).catch((err) => {
        return res.status(400).send();
    });

});


app.post('/users', (req, res) => {
    //console.log(req.body);
    var body = _.pick(req.body, ["email", "password"]);
    //console.log(body);
    
    // Method below is easier
    // var user = new User({
    //     email: body.email,
    //     password: body.password
    // });
  
    var user = new User(body);
    user.generateAuthToken();
    //console.log(user);
    var token = _.find(user.tokens, { access: 'auth'}).token;
    //var token = user.tokens[0].token;
    //console.log('Token ', token);

    user.save().then(
        (doc) => 
        {
          res.header('x-auth', token).send(doc);
        }, 
        (error) => 
        {
            res.status(400).send(error);
        });
});

// function auth( res, next) {
//     console.log(req);
// }

// This works - funny
// app.post('/users/me', 
//     function(req, res, next){
//     console.log(req);
//     }, 
//     function(req, res)  {
//        res.send(req.user);
// });

app.get('/users/me', authenticate, (req, res) => {
       res.send(req.user);
});

app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});

module.exports = { app };