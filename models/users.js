const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    googleId: {required: true, type: String},
    username: {required: true, type: String}
})

const User = mongoose.model('User', userSchema)

module.exports = User