
const {ObjectId} = require('mongodb');
var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');

Todo.findByIdAndRemove('5a26d409e29fb2d0d041de26').then ((todo) => {
    console.log(todo);
});