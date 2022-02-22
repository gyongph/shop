const bcrypt = require('bcryptjs')
const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const Shops = require('./Shops')
const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    firstname: {
      immutable: true,
      type: String,
      required: true,
      lowercase: true,
      minLength: 1,
    },
    lastname: {
      immutable: true,
      type: String,
      required: true,
      lowercase: true,
      minLength: 1,
    },
    username: {
      immutable: true,
      type: String,
      required: true,
      unique: true,
      dropDups: true,
      validate: /[A-z0-9]{5,10}/,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      maxLength: 14,
      validate: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/,
    },
    contact: { type: String, required: true, unique: true, length: 13 },
    address: { type: String, required: true, minLength: 10 },
    shop: {
      immutable: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shops',
    },
    followed_shops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shops' }],
    inbox: [
      { immutable: true, type: mongoose.Schema.Types.ObjectId, ref: 'Inboxes' },
    ],
    profileIMG: { type: String, default: '/public/img/profile.png' },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }],
  },
  {
    timestamps: true,
  },
)

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password') || user.isNew)
    user.password = await hashedPassword(user.password)
  if (user.isModified('username') || user.isNew)
    user.username = user.username.toLowerCase()

  next()
})
userSchema.pre('updateOne', async function (next) {
  let update = this.getUpdate()
  if (update.password) update.password = await hashedPassword(update.password)
  this.setUpdate(update)
  next()
})
userSchema.statics.comparePassword = function (password, hashedPassword, cb) {
  bcrypt.compare(password, hashedPassword, (err, matched) => {
    return cb(matched)
  })
}

userSchema.statics.buildShop = function (userData) {
  let tempShop = new Shops({
    _id: ObjectId(userData.shop),
    name: 'My Shop ' + userData.contact,
  })
  tempShop.save().catch(console.log)
}

function hashedPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, data) => {
      resolve(data)
    })
  })
}

module.exports = mongoose.model('Users', userSchema)
