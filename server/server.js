require('./config/config');

const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
//const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose'); 
const {ObjectID} = require('mongodb');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

mongoose.Promise = global.Promise;

var app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;


app.post('/todos', authenticate, (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
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

app.get('/todos', authenticate, (req,res) => {
    Todo.find({_creator: req.user._id }).then((todos) => {
        res.send({todos: todos});
    },(error)=>{
        res.status(400).send(error);
    });
});

app.get('/todos/:id', authenticate, (req,res) => {
 //   res.send(req.params);
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        //console.log('In obj id failed');
        return res.status(404).send();
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todos) => {
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

app.delete('/todos/:id', authenticate, (req,res) => {
       var id = req.params.id;
       if (!ObjectID.isValid(id)) {
           //console.log('In obj id failed', id);
           return res.status(404).send();
       }
       Todo.findOneAndRemove({
           _id: id,
           _creator: req.user._id
       }).then( (todo) => {
           if(todo){
               //console.log('In found');
               return res.send({todo: todo});
           }
           else {
               //console.log('In not found');
               return res.status(404).send({todos: todo});
           }
       }).catch( (error) => {
           return res.status(400).send();
       });

      
   });


   app.patch('/todos/:id', authenticate, (req,res) => {
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
    //console.log("_id ", id);
    //console.log("_creator ", req.user._id);
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
        }, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});

    }).catch((err) => {
        return res.status(400).send(err);
    });

});


app.post('/users', (req, res) => {
    //console.log(req.body);
    var body = _.pick(req.body, ["email", "password"]);
    var user = new User(body);
    user.generateAuthToken(user._id);
    //console.log(user);
    var token = _.find(user.tokens, { access: 'auth'}).token;
  
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


app.post('/users/login', (req, res)=> {
    var body = _.pick(req.body, ["email", "password"]);
    //console.log('Email ', body.email);
    //res.send(body);
    User.findByCredentials(body.email, body.password).then((user)=> {
        user.generateAuthToken(user._id);

        res.header('x-auth', user.tokens[0].token).send(user);
    }).catch((error)=>{
        res
        .status(400)
        .send();
    });
    
});


app.delete('/users/me/token', authenticate, (req, res) => {
    // if we get here the user is authnticated

    // the req has the user
    //        
        // User.findByToken(token).then((user)=> {
        // if (!user) {
        //     return Promise.reject();
        // }
        // req.user = user;
        // req.token= token;
        // next();
    // must then remove the token from the user
    req.user.removeToken(req.token).then((user) => {
        res.send(req.user);
        
    }).catch((error) => {
        res
        .status(400)
        .send();
    });

 });


app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});

module.exports = { app };