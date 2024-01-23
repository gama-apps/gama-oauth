class ValidatorMiddleware {
  async secret(req, res, next) {
    const secret = req.headers['x-secret'];

    const error = {
      code: 401,
      success: false,
      massage: 'Unauthorized: Secret not Provide.'
    };

    if (!secret){
      return res.status(401).json(error);
    }
    if (secret !== process.env.SECRET.trim() || typeof secret !== 'string' || secret.length < 5){
      error.massage = 'Unauthorized: Invalid Secret';
      return res.status(401).json(error);
    }
    next();
  }
}

module.exports = new ValidatorMiddleware();