
const {ObjectId} = require('mongodb');
var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');

var id = '5a230170361f202020194dab';
//console.log('Todo ', Todo);

// if (!ObjectId.isValid(id)) {
//     return console.log('Object id is not valid ', id);
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo){
//         return console.log('Todo not found');
//     }
//     console.log('Todo by id', todo);
    
// }).catch((error) => {
//     console.log(error);
// });

User.findById(id).then((user) => {
    if (!user){
        return console.log('User not found');
    }
    console.log(JSON.stringify(user, undefined, 2));
    
}).catch((error) => {
    console.log(error);
});