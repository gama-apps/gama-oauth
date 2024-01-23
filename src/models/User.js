const { model, Schema } = require('mongoose')
const collectionName = 'users'

const userSchema = new Schema({
  _id: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  age: { type: Number },
  img: { type: String },
  birthday_date: { type: Object },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  status: { type: Boolean, default: false },
  password: { type: String },
  isRemove: { type: Boolean, default: false }
}, {
  versionKey: false,
  timestamps: true,
  collection: collectionName,
  _id: false
});
module.exports = model(collectionName, userSchema);