const { Client }  = require("@elastic/elasticsearch");
const client = new Client({node: "http://localhost:9200"});
const fs = require("fs");
const csv = require("csv-parser");

async function populateDateToES(){
  const body = [];
  await fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', async (row) => {
      let obj = {
        input: row['Search Term'],
        weight: parseInt(row['Total Unique Searches'])
      }
      body.push({index: { _index: 'words', _type: 'word'}});
      body.push({ suggest: obj, search_term: obj.input});
    }).on('end', async () => {
      console.log("data processing done");
      console.log(body.length);
      await client.bulk({
        body: body,
        refresh: true
      }).then((res) => {
        console.log(`${body.length} indexing passed`);
      }).catch((err) => {
        console.log(` indexing failed`);
        console.log(err);
        const { body } = err;
        console.log(body.error);
      });
  });
}

populateDateToES();


