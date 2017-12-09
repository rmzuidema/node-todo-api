const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');
var {todos, populateTodos, users, populateUsers} = require('./seed/seed');



beforeEach(populateUsers);
beforeEach(populateTodos);

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
        var hexId = todos[0]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect( (res)=> {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end( (err, res) => {
            if(err) {
               return done(err);
            }

        Todo.findById(hexId).then( (todo) => {
            expect(todo).toNotExist();
            done();
        }).catch((err) => done(err));
    });
});
  
it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
});


    it('Should return a 404  if not found', (done) => {
         request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });
 });

// describe('DELETE /todos/:id', () => {
//     it('should remove a todo', (done) => {
//       var hexId = todos[1]._id.toHexString();
  
//       request(app)
//         .delete(`/todos/${hexId}`)
//         .expect(200)
//         .expect( (res) => {
//           expect(res.body.todo._id).toBe(hexId);
//         })
//         .end( (err, res) => {
//           if (err) {
//             return done(err);
//           }
  
//           Todo.findById(hexId).then((todo) => {
//             expect(todo).toNotExist();
//             done();
//           }).catch((e) => done(e));
//         });
//     });
  
//     it('should return 404 if todo not found', (done) => {
//       var hexId = new ObjectID().toHexString();
  
//       request(app)
//         .delete(`/todos/${hexId}`)
//         .expect(404)
//         .end(done);
//     });
  
//     it('should return 404 if object id is invalid', (done) => {
//       request(app)
//         .delete('/todos/123abc')
//         .expect(404)
//         .end(done);
//     });
//   });

// describe('Get users/me', () => {
//     it('Should return a user if authenticated')

// });


