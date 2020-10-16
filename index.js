const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const fileUpload = require('express-fileupload');
require('dotenv').config()


const port = 5000
const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfyjq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true });




client.connect(err => { 
  const services = client.db(process.env.DB_NAME).collection("services");
  const orders = client.db(process.env.DB_NAME).collection("orders");
  const feedback = client.db(process.env.DB_NAME).collection("feedback");
  const admins = client.db(process.env.DB_NAME).collection("admins");

    

  app.post('/addService', (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    const newImg = file.data;
    const encImg = newImg.toString('base64');
    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
  };
    services.insertOne({ title, description, image })
      .then(result => {
        res.send(result.insertedCount > 0)
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

    // app.post('/addOrder', (req, res) => {
    //   const file = req.files.file;
    //   const name = req.body.name;
    //   const email = req.body.email;
    //   const serviceName = req.body.serviceName;
    //   const details = req.body.details;
    //   const price = req.body.price;
    //   const newImg = file.data;
    //   const encImg = newImg.toString('base64');
    //   var image = {
    //     contentType: file.mimetype,
    //     size: file.size,
    //     img: Buffer.from(encImg, 'base64')
    // };
    // orders.insertOne({ name,email, serviceName,details,price, image })
    //     .then(result => {
    //       res.send(result.insertedCount > 0)
    //     })
    // })
      
    
  app.get('/ordersByEmail', (req, res) => {
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

  app.delete('/deleteUserOrder/:id',(req,res)=>{
    orders.deleteOne({_id:ObjectId(req.params.id)})
    .then(result => {
        res.send(result.deletedCount > 0);
    })
  })

    app.post('/addFeedback',(req,res) => {
        const newFeedback = req.body;
        feedback.insertOne(newFeedback)
        .then(result => {
        res.send(result.insertedCount > 0);
        })
    })
    app.get('/feedback',(req,res) =>{
        feedback.find({}).sort({_id:-1}).limit(3)
        .toArray((err,documents) =>{
        res.send(documents);
        })
    })

    

    app.post('/addAdmin',(req,res) => {
      const newAdmin = req.body;
      admins.insertOne(newAdmin)
      .then(result => {
      res.send(result.insertedCount > 0);
      })
  })

  app.post('/isAdmin', (req, res) => {
      const email = req.body.email;
      admins.find({ email: email })
          .toArray((err, admins) => {
              res.send(admins.length > 0);
          })
  })

  //   app.post('/isAdmin' , (req, res)=>{
  //     const email = req.body.email;
  //     admins.find({email})
  //         .toArray((err, documents) => {
  //             if(documents.length > 0){
  //                 res.send({person: 'admin'})
  //             }else{
  //                 res.send({person: 'user'})
  //             }
  //         })
  // })



  app.patch('/updateStatus', (req,res)=>{ 
    orders.updateOne(
        {_id : ObjectId(req.body.id)},
        {
            $set: { status: req.body.newStatus}
        }
    )
    .then(result =>{
        res.send(result.modifiedCount > 0)
    })
})

});

app.get('/', (req, res) => {
    res.send('WoW!!! Server Connected!')
  })

app.listen(process.env.PORT || port)