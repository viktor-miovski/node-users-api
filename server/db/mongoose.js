const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const options = {
    useNewUrlParser: true,
};
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/NodeApiDb", options);

module.exports = { mongoose };