const settings = require('./../settings');

class LogoutMiddleware {
  async currentapp (req, res, next) {
    let xApp = req.headers['x-app']
    next();
  }
}
module.exports = new LogoutMiddleware();