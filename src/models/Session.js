const { model, Schema } = require('mongoose');
const collectionName = 'session';

const sessionSchema = new Schema({
  _id: { type: String },
  userId: { type: String },
  token: { type: String, require: true },
  isRemove: { type: Boolean },
}, {
  versionKey: false,
  timestamps: true,
  collection: collectionName,
  _id: false
});

module.exports = model(collectionName, sessionSchema);