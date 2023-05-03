const mongoose = require('mongoose');

//create schema
const gameSchema = new mongoose.Schema({
    title: {type: String, required: true},
    backgroundImage: {type: String},
    playtime: {type: String},
    genre: {type: String},
    rating: {type: String},
    notes: {type: String},
    dbIdForGame: {type: String}
})
//timestamp will track when the object was made. It will return a date.

//Create Model
const Game = mongoose.model("Game", gameSchema);

module.exports = Game