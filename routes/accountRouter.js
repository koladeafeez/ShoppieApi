/* eslint-disable no-param-reassign */
const express = require('express');
const accountsController = require('../controllers/accountController');

function routes(Register) {
  const accountRouter = express.Router();
  const controller = accountsController(Register);
  accountRouter.route('/register')
    .post(controller.register)

  accountRouter.route('/login')
  .post(controller.login)
  
  return accountRouter;
}

module.exports = routes;
