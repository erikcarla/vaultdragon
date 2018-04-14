'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let ObjectSchema = new Schema({
  key: {
    type: String,
    required: 'Please enter key of object',
    index: true
  },
  value: {
    type: String,
    required: 'Please enter value of object'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
});

module.exports = mongoose.model('Objects', ObjectSchema);
