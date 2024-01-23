const express = require('express');
const authRouter = express.Router();

const auth = require('./../controllers/AuthController');
const authMiddleware = require('./../middlewares/auth');
const validatorMiddleware = require('./../middlewares/validator');
const logoutMiddleware = require('./../middlewares/logout')

const middlewares = [
  validatorMiddleware.secret,
  authMiddleware.token,
  logoutMiddleware.currentapp
];

authRouter.post('/login', validatorMiddleware.secret, auth.login);
authRouter.post('logout', middlewares, auth.logout);

module.exports = authRouter;