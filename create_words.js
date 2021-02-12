const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, (err, db) => {
  if (err) throw err;
  var dbo = db.db('mydb');
  dbo.createCollection("words", (err, res) => {
    if (err) throw err;
    console.log("Collection created");
    db.close();
  });
});
