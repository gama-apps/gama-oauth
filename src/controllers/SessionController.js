const userModel = require('../models/User');
const sessionModel = require('../models/User');
const { v4: uuidv4 } = require('uuid');

class SessionController {
   
  get(req, res) {
    res.json(req.session);
  }

  async update(req, res) {
    try {
      const user = await userModel.findOne({ _id: req.session.userId }, {
        _id: 0,
        password: 0,
        createdAt: 0,
        isRemove: 0
      }).lean();

      const session = { ...req.session, ...user };
      session.updatedAt = new Date();

      res.status(200).json(session);
    } catch (error) {
      res.status(500).json({ message: 'Error updating session' });
    }
  }

  async register(req, res) {
    const { data } = req.body;
    try {
      const newSession = new sessionModel({
        _id: uuidv4().replace(/-/g, ""),
        userId: data.userId,
        token: data.token
      });

      const response = await newSession.save();
      const session = response.toObject();

      if (session) {
        const user = await UserActivation.findOne({ _id: data.userId }, {
          _id: 0,
          password: 0,
          createdAt: 0,
          updateAt: 0,
          isRemove: 0
        }).lean();


        if (user) {
          session.extraData = data.token;
          const sessionObject = { ...session, ...user };

          await sessionModel.create(sessionObject)
          res.json(sessionObject);
        } else {
          res.status(500).json({ message: 'Error getting user.' });
        }
      } else {
        res.status(500).json({ messge: 'Error saved session.', error});
      }
    } catch (error) {
      res.status(500).json({ message: 'Error saved session.', error });
    }
  }

  async remove(req, res) {
    const { _id } = req.session;

    try {
      const response = await Session.update({ _id }, {
        $set: { isRemove: true }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error remove session.', error });
    }
    res.send('ok remove')
  } 

  async _readSession(token, headers = {}) {
    try {
      const find = sessionModel.aggregate([])
        .match({ token, isRemove: false })
        .lookup({
          from: 'users',
          foreignField: '_id',
          localField: 'userId',
          as: '_user'
        })
        .unwind('$_user')
        .lookup({
          from: 'users',
          foreignField: '_id',
          localField: 'userId',
          as: '_user'
        })
        .project({
          extraData: '$token',
          token: 1,
          _user: {
            _id: 1,
            first_name:1,
            last_name: 1,
            age: 1,
            img: 1,
            email: 1,
            phone: 1,
            address: 1
          }

        })
        
      let session = await find.exc()
      session = session[0]

      if(session){
        session = { ...session, ...session._user }
        session._id = session.userId = session._user._id
      }

      delete session._user
      session.updateAt = new Date()
      const sessionToUpdate = { ...session }
      sessionModel.updateOne({token}, sessionToUpdate).then()

      return session
    } catch (error) {
      console.log('%c e', 'color:white;background-color:red',error);
      return error
    }
  }
}

module.exports = new SessionController();