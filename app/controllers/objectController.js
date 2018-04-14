'use strict';

const mongoose = require('mongoose'),
    Objects = mongoose.model('Objects');

exports.createObject = (req, res) => {
  let newObject = new Objects(req.body);
  newObject.save((err, obj) => {
    if (err)
      return res.send(err);
    res.json({
      key: obj.key,
      value: obj.value,
      timestamp: Math.round(obj.timestamp.getTime()/1000)
    });
  });
};

exports.findObject = (req, res) => {
  let filter = {key: req.params.key};
  let timestamp = parseInt(req.query.timestamp);
  if(new Date(timestamp).getTime() > 0) {
    filter.timestamp = {$lte : new Date(timestamp * 1000)};
  }
  Objects.findOne(filter)
    .select('-_id value')
    .sort({ 'timestamp' : -1 })
    .exec((err, obj) => {
      if (err)
        return res.send(err);
      if (obj === null)
        return res.status(404).json({error: 'Not found'});
      res.json(obj);
    });
};
