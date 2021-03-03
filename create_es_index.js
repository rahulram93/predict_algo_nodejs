const { Client }  = require("@elastic/elasticsearch");
const client = new Client({node: "http://localhost:9200"});

async function createESIndex(){
  const result = await client.indices.create({
    index: "words",
    body: {
      mappings: {
        word: {
          properties: {
            suggest: { type: "completion"},
            search_term: { type: "text" }
          }
        }
      }
    }
  });

  console.log(result);
}

createESIndex();
