const userModel = require('../models/User');

class UserController {
  async getUser(req, res) {
    const query = { isRemove: false }
   

    try {
      const users = await userModel.find(query, {
        first_name: 1,
        last_name: 1,
        age: 1,
        img: 1,
        birthday_date: 1,
        email: 1, 
        phone: 1,
        address: 1,
      });
      res.status(200).send({ message: 'ok consulta UserCotroller', data: users});
    } catch (e) {
      res.status(500).json({ message: e.toString() })
    }
  }
}

module.exports = new UserController();
