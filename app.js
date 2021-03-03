const express = require("express");
const app = express();
const MongoClient = require('mongodb');
const url = 'mongodb://localhost:27017';
const cors = require('cors')


app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/words", cors(), (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    const dbo = db.db('mydb');

    const words = dbo.collection("words").find({}).toArray((err, result) => {
      if (err) throw err;
      const words = result.map((item) => [item['search_term'], item["unique_searches"]]);
      res.json({words: words});
      db.close();
      console.log("/words done");
    });


  });
});

app.listen(4001);
