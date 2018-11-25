// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect('mongodb://localhost:27017/AppDb', (err, client) => {
    if (err) { return console.log("Unable to connect to the server") };
    console.log("Connected to the server");
    const db = client.db('AppDb')

    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err) { return console.log('Unable to insert todo: ', err) }
        console.log(JSON.stringify(result.ops, undefined, 2));
    })
    
    client.close();
});