const { MongoClient, ObjectID } = require("mongodb"); // es6 destructuring

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) { return console.log("Unable to connect to the server") };
    console.log("Connected to the server");

    const db = client.db('AppDb');
    const collection = db.collection('Todos');

    // Deleting one document(first from many) from collection Todos inside AppDb database
    // collection.deleteOne({text:"Something to do"}).then(
    //     (result) => {
    //         console.log(result)
    //     },
    //     (err) => {
    //         console.log("Unable to delete a document from Todos: ", err)
    //     })

    // Deleting many documents(with current filter) from collection Todos inside AppDb database
    // collection.deleteMany({text:"Something to do"}).then(
    //     (result) => {
    //         console.log(result)
    //     },
    //     (err) => {
    //         console.log("Unable to delete a document from Todos: ", err)
    //     })

    // Deleting one document(by certain criteria(s)) from collection Todos inside AppDb database
    collection.findOneAndDelete({ completed: false }).then(
        (result) => {
            console.log(result)
        },
        (err) => {
            console.log("Unable to delete a document from Todos: ", err)
        })

    client.close();
});