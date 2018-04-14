'use strict';

const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const app        = express();
const db         = require('./config/db');
const port       = 8080;

const Objects = require('./app/models/objects');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect(db.url);


require('./app/routes')(app);
app.use((req, res) => {
  res.status(404).send({url: req.originalUrl + ' not found'})
});
app.listen(port, () => {
  console.log('API server started on: ' + port);
});
