// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb"); // es6 destructuring

MongoClient.connect('mongodb://localhost:27017/AppDb', (err, client) => {
    const db = client.db('AppDb');

    if (err) { return console.log("Unable to connect to the server") };
    console.log("Connected to the server");

    // Fetching all documents from AppDB database
    db.collection('Todos').find().toArray().then(
        (docs) => {
            console.log("Todos: ", JSON.stringify(docs, undefined, 2))
        },
        (err) => {
            console.log("Unable to fetch todos: ", err)
        })

    // Fetching all documents from AppDB database, which have field completed = true
    db.collection('Todos').find({completed: true}).toArray().then(
        (docs) => {
            console.log("Todos with completed field: ", JSON.stringify(docs, undefined, 2))
        },
        (err) => {
            console.log("Unable to fetch todos: ", err)
        })

    // Fetching the document from AppDB database with current id
    db.collection('Todos').find({
        _id: new ObjectID('5bf994901e70ae1ab816ae25')
    }).toArray().then(
        (docs) => {
            console.log("current document from Todos: ", JSON.stringify(docs, undefined, 2))
        },
        (err) => {
            console.log("Unable to fetch todos: ", err)
        })

    // Fetching all documents from AppDB database and count them
    db.collection('Todos').find().count().then(
        (count) => {
            console.log("Todos count: ", count)
        },
        (err) => {
            console.log("Unable to fetch todos: ", err)
        })

    client.close();
});