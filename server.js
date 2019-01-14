const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;
let db = require('./db');
const app = express();
const config = require('./config.json');
let collConfig;
let collTransfer;

//let db;

app.use(bodyParser.urlencoded({extended: true}));

app.post('/transfers', (req, res) => {
  //add new transfer
  const transfer = { description: req.body.description, amount: req.body.amount};
  collTransfer.insertOne(transfer, (err, results) => {
    if (err) {
      res.send('error');
    } else {
      res.send(results);
    }
  });
});


app.get('/transfers', (req, res) => {
  //get list transfers
  collTransfer.find().toArray((err, results) => {
    if (err) {
      res.send('error');
    } else {
      res.send(results);
    }
  });
});

app.get('/transfers/:id', (req, res) => {
  //get list transfers
  const id = req.params.id;
  const details = { '_id': ObjectID(id) };
  collTransfer.findOne(details, (err, results) => {
    if (err) {
      res.send('error');
    } else {
      res.send(results);
    }
  });
});

app.delete('/transfers/:id', (req, res) => {
  //delete transfer
  const id = req.params.id;
  const details = { '_id': ObjectID(id) };
  collTransfer.remove(details, (err, results) => {
    if (err) {
      res.send('error');
    } else {
      res.send(results);
    }
  });
});

app.put('/transfers/:id', (req, res) => {
  //update transfer
  const id = req.params.id;
  const details = { '_id': new ObjectID(id) };
  const transfer = { description: req.body.description, amount: req.body.amount };
  collTransfer.updateOne(details, transfer, (err, results) => {
    if (err) {
      res.send('error' );
    } else {
      res.send(results);
    }
  });
});

app.post('/config', (req, res) => {
  collConfig.updateOne({ "budget": { $exists: true } }, { $set: { "budget": req.body.budget}}, (err, results) => {
    if (err) {
      res.send({'error': 'error'});
    } else {
      res.send(results);
    }
  });
});

app.get('/config', (req, res) => {
  collConfig.findOne({"budget": {$exists: true}}, (err, results) => {
    if (err) {
      res.send({ 'error': 'error' });
    } else {
      res.send(results);
    }
  });
});

MongoClient.connect(db.url, { useNewUrlParser: true }, (err, client) => {
  db = client.db('test-task');
  if (err) return console.log(err)
  app.listen(config.port, config.host, function () {
    collConfig = db.collection('config');
    collTransfer = db.collection('transfers');
    console.log(`App listening at port ${config.port}`);
  });
})



