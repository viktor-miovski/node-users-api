const { mongoose } = require("./../db/mongoose.js"); // es6 destructuring

let User = mongoose.model("Users", {
    name: { type: String, required: true },
    surname: { type: String },
    age: { type: Number },
    email: {
        type: String,
        required: true,
        trim: true,
        minlenght: 1
    },
    isAKid: { type: Boolean }
});

module.exports = { User };