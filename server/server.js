require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require("./db/mongoose.js"); // es6 destructuring
let { User } = require("./moduls/user.js");
let {authenticate} = require('./middleware/authenticate');

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
    // find User by email and pass, return it and generate a auth token to it and send it back to the front-end
    // let user = new User(body);

    // user.save().then(
    //     () => {
    //         return user.generateAuthToken();
    //     }).then(
    //         (token) => {
    //             res.header('x-auth', token).send(user);
    //         }
    //     ).catch((e) => {
    //         res.status(400).send(err);
    //     });
});

// GET - an user from db with authentication middleware (auth by token from header)
app.get("/users/user", authenticate, (req, res) => {
    res.send(req.user);
})

// GET - all users from db
app.get("/users", (req, res) => {
    User.find().then(
        (users) => {
            res.send({ users });
        },
        (err) => {
            res.status(400).send(err);
        }
    )
})

// GET - current user by id from db
app.get("/users/:id", (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Wrong id!!!");
    }
    else {
        User.findById(id).then(
            (user) => {
                if (!user) {
                    return res.status(404).send();
                }
                res.send({ user });
            }
        ).catch((e) => {
            res.status(400).send();
        })
    }
})

// DELETE - current user by id from db
app.delete("/users/:id", (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Wrong id!!!");
    }
    else {
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
    }
})

// PATCH - update current user by id from db
app.patch("/users/:id", (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'surname', 'age', 'email', 'password'])

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Wrong id!!!");
    }
    else {
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
    }
})

// PUT - update current user by id from db
app.put("/users/:id", (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'surname', 'age', 'email', 'password'])

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Wrong id!!!");
    }
    else {
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
    }
})

app.listen(port, () => {
    console.log('Started up at port ', port);
});

module.exports = { app };