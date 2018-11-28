const { mongoose } = require("./../db/mongoose.js"); // es6 destructuring
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlenght: 1,
    },
    surname: {
        type: String,
        required: true,
        trim: true,
        minlenght: 1,
    },
    age: {
        type: Number,
        trim: true,
        maxlenght: 3
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlenght: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlenght: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        }
    }]
});

// adding method to construct JSON, which will be send back to the front-end
UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'name', 'surname', 'age', 'email']);
};

// adding instance method to the schema
UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();

    // second way -> user.tokens.push({access, token}); , but it should not work correctly
    user.tokens = user.tokens.concat([{ access, token }]);

    return user.save().then(() => { return token; })
};

let User = mongoose.model("Users", UserSchema);

module.exports = { User };