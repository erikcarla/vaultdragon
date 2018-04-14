'use strict';

module.exports = (app) => {
  const objectController = require('../controllers/objectController');

  app.route('/object').post(objectController.createObject);
  app.route('/object/:key').get(objectController.findObject);
};
