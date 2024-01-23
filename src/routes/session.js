const express = require('express');
const sessionRouter = express.Router();

const session = require('./../controllers/SessionController');
const validatorMiddleware = require('./../middlewares/validator');
const authMiddleware = require('./../middlewares/auth');

const middlewares = [
  validatorMiddleware.secret,
  authMiddleware.token
];

sessionRouter.post('/register', validatorMiddleware.secret, session.register);
sessionRouter.get('/', middlewares,session.remove);
sessionRouter.post('/remove', middlewares, session.remove);
sessionRouter.put('/', middlewares, session.update);

module.exports = sessionRouter;