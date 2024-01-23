const userModel = require('../models/User');
const sessionModel = require('../models/Session');

const { v4: uuidv4 } = require('uuid');
const sha512 = require('crypto-js/sha512');
const File = require('./../libs/file');
const jwt_decode = require('jwt-decode');


class AuthController {
  async login(req, res){
    
    let { usernameOrEmail, password, credential } = req.body?.data || req.body;
    let googleUser 
    
    if (credential){
      googleUser = jwt_decode(credential)
      usernameOrEmail = googleUser.email
    }

    try {
      
      const query = {
        $or: [{ email: usernameOrEmail }],
        password
      }

      if (credential) delete query.password
      let user = await userModel.findOne(query, {
        _id: 1,
        first_name: 1,
        last_name: 1,
        phone: 1,
        email: 1,
        age: 1,
        status: 1,
      }).lean();
      
      if(!user && credential){
        return res.status(403)
          .json({message: `Email ${usernameOrEmail} does not exist.` });
      }

      if (user) {
        if (!user.status){
          res.status(403)
            .json({ message: 'Login faild, user is disabled.' })
        }
        let session = null;
        const randomString = uuidv4().replace(/-/g, "").slice(0, 10);
        const token = sha512(randomString).toString();
        

        const newSession = new sessionModel({
          _id: uuidv4().replace(/-/g, "").slice(0, 18),
          userId: user._id,
          token
        });

        session = await newSession.save();
        session = session.toObject();

        delete user._id;
        const response = {
          _id: session._id,
          userId: session.userId,
          token: session.token,
          ...user
        }
        res.status(200).json(response)

      }else {
        res.status(400).json({
          message: 'Login failed, username/email or password incorrect.'
        });
      }
    } catch (error) {
      console.error('Error catch user login', error);
      res.status(500).json({ message: error.toString() });
    }   
  }

  async logout (req, res) {
    const { _id, extraData } = req.session;

    try {
      const session = await sessionModel.updateOne({
        $or: [{ _id }, { token: extraData }]
      }, {
        $set: { isRemove: true }
      });

      if (session) {
        File.remove(`${process.env.STORAGE_FOLDER}/${process.env.TEMP_SESSIONS_FOLDER}`,
        `${req.session.token}.json`)
      }

      res.status(200).json({ message: 'ok' });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  } 
}
module.exports = new AuthController();