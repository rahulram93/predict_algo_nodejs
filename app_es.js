const { Client }  = require("@elastic/elasticsearch");
const client = new Client({node: "http://localhost:9200"});

const express = require("express");
const app = express();
//const MongoClient = require('mongodb');
const cors = require('cors');
const PORT = 3001;
express.static(__dirname + '/public')
app.use(express.static('public'))


app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/words", cors(), async (req, res) => {
  const { query: { value }} = req;
  await client.transport.request({
    method: 'POST',
    path: "/words/_search",
    body: {
      suggest: {
        "wordSuggest": {
          prefix: value,
          completion: {
            size: 10,
            field: "suggest" 
            //fuzzy: {}
          }
        }
      }
    }
  }).then((response) => {
    const {body: {suggest: {wordSuggest}} } = response;
    const data = wordSuggest[0].options.map((item) => item._source.search_term);
    res.send({words: data});
  }).catch((err) => {
    console.log(err);
    res.send("Error");
  });
});

app.listen(PORT, function() {
  console.log(`App Started on Port ${PORT}`);
});
