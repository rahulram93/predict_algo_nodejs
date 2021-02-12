const csv = require("csv-parser");
const fs = require("fs");
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, (err, db) => {
  if (err) throw err;
  const dbo = db.db("mydb");
  fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (row) => {
      let obj = { 
        search_term: row['Search Term'],
        unique_searches: row['Total Unique Searches']
      }

      dbo.collection('words').insertOne(obj, (err, res) => {
        if (err) throw err;
        console.log('Document added')
      });
  
    })
    .on('end', () => {
      db.close();
      console.log("Data Successfully added");
    });

});
