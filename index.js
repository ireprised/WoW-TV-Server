const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3pim7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('servicetv');
        const packagesCollection = database.collection('packages');
        const ordersCollection = database.collection('orders');
        const reviewsCollection = database.collection('rivews');
        const usersCollection = database.collection('users');

       
        
        app.get('/packages', async (req, res) => {
            const email = req.query.email;     
            const query = { email: email }
            const cursor = packagesCollection.find(query);
            const packages = await cursor.toArray();
            res.json(packages);
        })

        app.get('/reviews', async(req,res)=>{
            const review = req.body;
            const cursor = reviewsCollection.find(review)
            const reviews = await cursor.toArray();
            res.json(reviews)
        })
       app.get('/orders', async(req,res)=>{
        const orders = req.body;
        const cursor = ordersCollection.find(orders)
        const result = await cursor.toArray();
        res.json(result)
       })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result)
        });
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        

        

        app.get('/orders/:email', async(req,res)=>{
            const email = req.query.email;
            const query = { email:email }
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        })
        app.post('/packages', async(req,res)=>{
            const package = req.body;
            const result = await packagesCollection.insertOne(package)
            console.log(result)
            res.json(result)
        })

        

       

        app.post('/users', async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            console.log(result)
            res.json(result)
        })
        app.post('/reviews', async (req, res) => {
            const newReview = req.body;
            const result = await reviewsCollection.insertOne(newReview);
            console.log('got new user', req.body);
            console.log('added user', result);
            res.json(result);
        });
        app.put('/users/admin', async(req,res)=>{
            const user = req.body;
            console.log('put', user)
            const filter = {email:user.email}
            const updateDoc = {$set:{role:'admin'}}
            const result = await usersCollection.updateOne(filter,updateDoc)
            res.json(result)
        })
        app.delete('/orders/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await ordersCollection.deleteOne(query);
            console.log('deleting order',result)
            res.json(result)
          })

          app.delete('/packages/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await packagesCollection.deleteOne(query);
            console.log('deleting package',result)
            res.json(result)
          })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello WoW TV portal!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})
