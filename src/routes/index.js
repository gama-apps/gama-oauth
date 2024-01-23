const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const sessionRouter = require('./session');
const userRouter = require('./user');

router.use('/', authRouter);
router.use('/session', sessionRouter);
router.use('users', userRouter);

module.exports = router;