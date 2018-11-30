const { mongoose } = require("./../db/mongoose.js"); // es6 destructuring

let TodoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        minlenght: 1,
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
});

let Todo = mongoose.model("Todo", TodoSchema);

module.exports = { Todo };