const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');
var {todos, populateTodos, users, populateUsers} = require('./seed/seed');


// Seems to work as before each describe these befor run...
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



describe('Get users/me', () => {
    it('Should return a user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect ( (res)=> {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('Should return a 401 user if not authenticated authenticated', (done) => {
        request(app)
        .get('/users/me')
//        .set('x-auth', users[1].tokens[0].token)
        .expect(401)
        .end(done);  
    });
});

describe('Post users', () => {
    var email ='mytestemail@one.com';
    var password = 'abcttrt!';

    it('Should create a user', (done) => {
        request(app)
        .post('/users')
        .send ({email, password})
        .expect(200)
        .expect( (res)=> {
            expect(res.headers['x-auth']).toExist();
            expect(res.body.email).toBe(email);
            expect(res.body._id).toExist();
        })
        .end((err)=> {
            if (err) {
                return done(err);
            }
 
        User.findOne( {email}).then((user)=> {
            expect(user).toExist();
            expect(user.email).toBe(email);
            done();
            }).catch((e) => done(e));
        });
    });

    it('Should return validation errors if request invalid', (done) => {
        var existEmail = 'boboneone.com';
        request(app)
        .post('/users')
        .send({email: existEmail, password: password})
        .expect(400)
        .expect((res)=> {
            expect(res.body._id).toNotExist();
        //    console.log(res.body._id);
        })
        .end(done);
       
        
    });

    it('Should not create a user if email in use', (done) => {
        var existEmail = 'bobone@one.com';
        request(app)
        .post('/users')
        .send({email: existEmail, password: password})
        .expect(400)
        .expect((res)=> {
            expect(res.body._id).toNotExist();
        //    console.log(res.body._id);
        })
        .end(done);
    });


});

describe('Post users/login', () => {
    
        var email = users[0].email;
        var password = users[0].password;
    
        it('Should login a user', (done) => {
            request(app)
            .post('/users/login')
            .send({email: email, password: password})
            .expect(200)
            .expect( (res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
    
                User.findById(users[0]._id).then((user) => {
                    console.log('Login token ', user.tokens[0]);
                    expect(user.tokens[0]).toInclude({access: 'auth', token: res.headers['x-auth'] });
                    done();
                }).catch((e) => done(e));
    
        });
    });

    it('Should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({email: email, password: 'abc123'})
        .expect(400)
        .end(done);
    });

 
});

describe('Delete /users/me/token', () => {
    
    var email = users[0].email;
    var password = users[0].password;
    var token = users[0].tokens[0].token;

    it('Should remove token', (done) => {
        request(app)
        .delete('/users/me/token')
        .set('x-auth', token)
        .send()
        .expect(200)
        .end((error) =>{
            if (error) {
                return done(error);
            }
            User.findOne({ email }).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((err) => done(err));
        });
    });

});

