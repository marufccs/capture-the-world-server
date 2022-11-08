const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT|| 5000;
require('dotenv').config(); 

// middle ware
app.use(cors());
app.use(express.json());

//connection with mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.19qwu6y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const main = async() => {
try{
const database = client.db("photography").collection("services");

app.get('/services', async(req,res) => {
    const query = {};
    const cursor = database.find(query);
    const result = await cursor.toArray();
    res.send(result);
})
}
catch(error){
console.log(error.name, error.message, error.stack);
}
}

main().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Its happening');
})

app.listen(port, () => {
    console.log('running');
})