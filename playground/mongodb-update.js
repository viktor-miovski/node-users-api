const { MongoClient, ObjectID } = require("mongodb"); // es6 destructuring

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) { return console.log("Unable to connect to the server") };
    console.log("Connected to the server");

    const db = client.db('AppDb');
    const collection = db.collection('Todos');

    // Update one document(by certain criteria(s) like Id) from collection Todos inside AppDb database
    collection.findOneAndUpdate(
        {
            _id: new ObjectID("5bfa838654736904540527f2")
        },
        {
            $set: {
                text: "Walk the dog",
                completed: true
            }
        },
        {
            returnOriginal: false
        }
    ).then(
        (result) => {
            console.log(result)
        },
        (err) => {
            console.log("Unable to update the document from Todos: ", err)
        })

    client.close();
});