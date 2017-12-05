const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
},{
    _id: new ObjectID(),
    text: 'Second test todo'
}];

beforeEach((done) => {
    //console.log('Removing all data');
    Todo.remove({}).then( () => {
        return Todo.insertMany(todos).then((docs) => done());
    });
});

describe('POST todos', () => {
    it('Should create a new todo', (done) => {
        var text = 'Todo test';

        request(app)
            .post('/todos')
            .send({text: text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((error, res) => {
                if (error) {
                    return done(error);
                }
                Todo.find({text: text}).then((todos) => {
                    //console.log('Todos ', todos);
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('Get todos', () => {
    it('Should retrieve a todo', (done) => {
        request(app)
        .get('/todos')
        .send()
        .expect(200)
        .expect((res) => {
            //console.log(res);
            expect(res.body.todos.length).toBe(2);
            done();
        }).catch ((e) => {
            done(e);
        });
    });
});

describe('Get todos/:id', () => {
    it('Should return a todo', (done) => {
        console.log(`/todos/${todos[0]._id.toHexString()}`)
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=> {
            console.log(res.body.todos.text);
            expect(res.body.todos.text).toBe('First test todo');
        })
        .end(done);
    });

    it('Should return not return a todo', (done) => {
        console.log(`/todos/123`)
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    });
});

describe('Delete todos/:id', () => {
    it('Should delete a todo', (done) => {
        console.log(`/todos/${todos[0]._id.toHexString()}`)
        request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=> {
            console.log(res.body.todos.text);
            expect(res.body.todos._d).toBe(todos[0]._id.toHexString());
        })
        .end( (err, res) => {
            if(err) {
               return done(err);
            }
        } );

        Todo.findById(todos[0]._id.toHexString()).then((todo) => {
            expect(todo).toNotExist();
            done();
        }).catch((err) => done(err));
    });

    it('Should return a 404  if not found', (done) => {
        console.log(`/todos/123`)
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });
});


