const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT|| 5000;
require('dotenv').config(); 

// middle ware
app.use(cors());
app.use(express.json());

//connection with mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.19qwu6y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const main = async() => {
try{
const database = client.db("photography").collection("services");
const database2 = client.db("photography").collection("firstServices");
const database3 = client.db("photography").collection("reviews");

app.get('/allServices', async(req,res) => {
    const query = {};
    const cursor = database.find(query);
    const result = await cursor.toArray();
    res.send(result);
})

app.get('/allServices/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await database.findOne(query);
    res.send(result);
})

app.get('/services', async(req,res) => {
    const query = {};
    const cursor = database2.find(query);
    const result = await cursor.toArray();
    res.send(result);
})

//Write a review
app.post('/reviews', async(req, res) => {
const review = req.body;
const result = await database3.insertOne(review);
res.send(result);
})

//Query by email and service id 
app.get('/reviews', async(req, res) => {
    const email = req.query.email;
    const serviceId = req.query.serviceId;
    let query = {};
    if(email ){
        query = {
            email: email
        }
    }
    else if(serviceId){
        query = {
            serviceId : serviceId
        }
    }
    const cursor = database3.find(query);
    const reviews = await cursor.toArray();
    res.send(reviews)
})

//Delete the specific review
app.delete('/reviews/:id', async(req, res) => {
const id = req.params.id;
const query = {_id : ObjectId(id)};
const result = await database3.deleteOne(query);
res.send(result);
})

//Add new service
app.post('/allServices', async(req, res) => {
const service = req.body;
const result = await database.insertOne(service);
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