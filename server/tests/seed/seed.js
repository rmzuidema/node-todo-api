const jwt = require('jsonwebtoken');

const {ObjectID} = require('mongodb')

var {Todo} = require('./../../models/todo');
var {User} = require('./../../models/user');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'bobone@one.com',
    password: 'userOnePass',
    tokens : [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId.toHexString(), access: 'auth'}, 'saltSecret').toString(),
        _id: userOneId}
    ]
}, {
    _id: userTwoId,
    email: 'bobtwo@two.com',
    password: 'userTwoPass'
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
},{
    _id: new ObjectID(),
    text: 'Second test todo'
}];

var populateTodos = (done) => {
    //console.log('Removing all data');
    // format has to be Todo.remove({}).then(() => {}).then(() => {});
    Todo.remove({}).then( () => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
     });
}

var populateUsers = (done) => {
    //console.log('Removing all data');
    User.remove({}).then( () => {
        // this will not call the save .pre we wrote
        //return User.insertMany(users).then((docs) => done());
        // So we will get the individual users
        var userOne = new User(users[0]).save();
        // this is a promise and so is this
        var userTwo = new User(users[1]).save();
        
        // This method waits for the promises in the array to both finish before continuing
        return Promise.all([userOne, userTwo])
    }). then( () => done());
};

module.exports = {
    todos, populateTodos, users, populateUsers
}