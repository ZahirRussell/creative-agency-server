const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
require('dotenv').config()


const port = 5000
const app = express()
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfyjq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true });




client.connect(err => { 
  const services = client.db(process.env.DB_NAME).collection("services");
  const orders = client.db(process.env.DB_NAME).collection("orders");
  const feedback = client.db(process.env.DB_NAME).collection("feedback");

    app.post('/addService',(req,res) => {
        const newService = req.body;
        services.insertOne(newService)
        .then(result => {
           res.send(result.insertedCount > 0);
        })
    })

    app.get('/services',(req,res) =>{
        services.find({})
        .toArray((err,documents) =>{
          res.send(documents);
        })
      })

    app.post('/addOrder', (req,res)=>{
        const newOrder = req.body;
        orders.insertOne(newOrder)
        .then(result=>{
            res.send(result.insertedCount>0)
        })
    })
      
    
  app.get('/ordersByUser', (req, res) => {
    orders.find({email: req.query.email})
              .toArray((err,documents) =>{
              res.send(documents);
        })

  })
  app.get('/orders', (req, res) => {
    orders.find({})
              .toArray((err,documents) =>{
              res.send(documents);
        })

  })

    app.post('/addFeedback',(req,res) => {
        const newFeedback = req.body;
        feedback.insertOne(newFeedback)
        .then(result => {
        res.send(result.insertedCount > 0);
        })
    })
    app.get('/services',(req,res) =>{
        feedback.find({})
        .toArray((err,documents) =>{
        res.send(documents);
        })
    })

});

app.get('/', (req, res) => {
    res.send('WoW!!! Server Connected!')
  })

app.listen(process.env.PORT || port)