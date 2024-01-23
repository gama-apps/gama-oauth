const express = require('express');
const authRouter = express.Router();

const user = require('./../controllers/UsersController');
const validatorMiddleware = require('./../middlewares/validator');
const AuthMiddleware = require('./../middlewares/auth');

const middlewares = [
  validatorMiddleware.secret,
  AuthMiddleware.token
];

authRouter.get('/', middlewares, (req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = authRouter;