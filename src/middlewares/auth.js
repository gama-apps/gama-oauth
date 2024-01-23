const sessionModel = require('./../models/Session');
const File = require('./../libs/file');
const SessionController = require('./../controllers/SessionController');

class AuthMiddleware {
  async token (req, res, next) {
    const token = req.headers['x-token']
    if (!token) {
      const err = {
        message: 'Unauthorized: Token not provided.',
        code: 403
      }
      res.status(403)
      return res.json(err)
    }
    if (typeof token !== 'string'){
      const err = {
        message: 'Unauthorized: Invalid Token. Invalid data type.',
        code: 403
      }
      res.status(403)
      return res.json(err)
    }
    try {
      let session = await SessionController._readSession(token, req.headers)

      if(session){
        req.session = session
        next()
      } else {
        const err2 = {
          message: 'Unauthorized: Invalid Or Expired token.',
          code: 403
        }
        res.status(403)
        return res.json(err2)
      }
    } catch (error) {
      error.status = 403
      res.status(403)
      return res.json(error)
    }
  }
}

module.exports = new AuthMiddleware()