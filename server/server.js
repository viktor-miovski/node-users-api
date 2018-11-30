require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require("./db/mongoose.js"); // es6 destructuring
let { User } = require("./moduls/user.js");
let { Todo } = require("./moduls/todo.js");
let { authenticate } = require('./middleware/authenticate');

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// POST - add list of user objects -> registration
app.post("/users", (req, res) => {
    let body = _.pick(req.body, ['name', 'surname', 'age', 'email', 'password']);
    let user = new User(body);

    user.save().then(
        (doc) => {
            res.send(doc);
        },
        (err) => {
            res.status(400).send(err);
        });
});

// POST - email and pass -> login
app.post("/users/login", (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then(
        (user) => {
            return user.generateAuthToken().then(
                (token) => {
                    res.header('x-auth', token).send(user);
                })
        }).catch((e) => {
            res.status(400).send();
        })
});

// DELETE - logout user and delete the token
app.delete('/users/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
})

// GET - an user from db with authentication middleware (auth by token from header) -> check the profile
app.get("/users/user-profile", authenticate, (req, res) => {
    res.send(req.user);
})

// GET - all users from db - don't need this part
// app.get("/users", authenticate, (req, res) => {
//     User.find().then(
//         (users) => {
//             res.send({ users });
//         },
//         (err) => {
//             res.status(400).send(err);
//         }
//     )
// })

// GET - current user by id from db - don't need from this at the moment ( same as get user/user-profile)
// app.get("/users/:id", (req, res) => {
//     let id = req.params.id;
//     if (!ObjectID.isValid(id)) {
//         return res.status(404).send();
//     }
//     else {
//         User.findById(id).then(
//             (user) => {
//                 if (!user) {
//                     return res.status(404).send();
//                 }
//                 res.send({ user });
//             }
//         ).catch((e) => {
//             res.status(400).send();
//         })
//     }
// })

// DELETE - current user by id from db - не сам го тествал
app.delete("/users/delete-profile", authenticate, (req, res) => {
    let id = req.user._id;
    // if (!ObjectID.isValid(id)) {
    //     return res.status(404).send();
    // }
    // else {
    User.findByIdAndRemove(id).then(
        (removedUser) => {
            if (!removedUser) {
                return res.status(404).send();
            }
            res.send({ removedUser });
        }
    ).catch((e) => {
        res.status(400).send();
    })
    // }
})

// PATCH - update current user by id from db
app.patch("/users/edit-profile", authenticate, (req, res) => {
    let id = req.user._id;
    let body = _.pick(req.body, ['name', 'surname', 'age', 'email', 'password'])

    // if (!ObjectID.isValid(id)) {
    //     return res.status(404).send("Wrong id!!!");
    // }
    // else {
    User.findByIdAndUpdate(id, { $set: body }, { new: true }).then(
        (updatedUser) => {
            if (!updatedUser) {
                return res.status(404).send();
            }
            res.send({ updatedUser });
        }
    ).catch((e) => {
        res.status(400).send();
    })
    // }
})

// PUT - update current user by id from db
app.put("/users/edit-profile", authenticate, (req, res) => {
    let id = req.user._id;
    let body = _.pick(req.body, ['name', 'surname', 'age', 'email', 'password'])

    // if (!ObjectID.isValid(id)) {
    //     return res.status(404).send("Wrong id!!!");
    // }
    // else {
    User.findByIdAndUpdate(id, { $set: body }, { new: true }).then(
        (updatedUser) => {
            if (!updatedUser) {
                return res.status(404).send();
            }
            res.send({ updatedUser });
        }
    ).catch((e) => {
        res.status(400).send();
    })
    // }
})

// ---- Todo routes to the db ----

// POST -> add new todo to the db
app.post('/todos', authenticate, (req, res) => {
    // let body = _.pick(req.body, ['text', '_creator']);
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then(
        (todo) => {
            res.send(todo);
        },
        (err) => {
            res.status(400).send(err);
        })
})

// GET - todos of current user,which are created by it
app.get("/todos", authenticate, (req, res) => {
    Todo.find({ _creator: req.user._id }).then(
        (todos) => {
            res.send({ todos });
        },
        (err) => {
            res.status(400).send(err);
        })
})

// GET - current todo of an user by id from db
app.get("/todos/:id", authenticate, (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    else {
        Todo.findOne({ _id: id, _creator: req.user._id }).then(
            (todo) => {
                if (!todo) {
                    return res.status(404).send();
                }
                res.send({ todo });
            }
        ).catch((e) => {
            res.status(400).send();
        })
    }
})

// DELETE - current todo of an user by id from db
app.delete("/todos/:id", authenticate, (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    else {
        Todo.findOneAndRemove({ _id: id, _creator: req.user._id }).then(
            (removedTodo) => {
                if (!removedTodo) {
                    return res.status(404).send();
                }
                res.send({ removedTodo });
            }
        ).catch((e) => {
            res.status(400).send();
        })
    }
})

// PATCH - update current todo of an user by id from db
app.patch("/todos/:id", authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then(
        (updatedTodo) => {
            if (!updatedTodo) {
                return res.status(404).send();
            }
            res.send({ updatedTodo });
        }
    ).catch((e) => {
        res.status(400).send();
    })
})

// PUT - update current todo of an user by id from db
app.put("/todos/:id", authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("error");
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then(
        (updatedTodo) => {
            if (!updatedTodo) {
                return res.status(404).send("error2");
            }
            res.send({ updatedTodo });
        }
    ).catch((e) => {
        res.status(400).send();
    })
})

// ---- Todo routes to the db ---- End ----

app.listen(port, () => {
    console.log('Started up at port ', port);
});

module.exports = { app };