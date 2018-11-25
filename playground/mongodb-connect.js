// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) { return console.log("Unable to connect to the server") };
    console.log("Connected to the server");
    const db = client.db('AppDb')

    //Insert many documents to Todos collection inside AppDB database
    db.collection('Todos').insertMany([
        {
            text: 'Something to do',
            completed: false
        },
        {
            text: 'Something to do',
            completed: false
        }
    ], (err, result) => {
        if (err) { return console.log('Unable to insert in Todos: ', err) }
        console.log(JSON.stringify(result.ops, undefined, 2));
    })

    //Insert one document to Todos collection inside AppDB database
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) { return console.log('Unable to insert todo: ', err) }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })

    client.close();
});