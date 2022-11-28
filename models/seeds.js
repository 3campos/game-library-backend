const dotenv = require("dotenv");
dotenv.config();

const mongoose = require('mongoose');
const Game = require('./Game.js');

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{console.log('MONGO CONNECTION OPEN!!!')})
.catch((err)=>{
    console.log(err)
})

const seedGames = [
    {
        title: "Mario Kart Tour",
        backgroundImage: "https://media1.giphy.com/media/3otPoo8NDLOmzvTJF6/giphy.gif",
        playtime: "n/a",
        genre: "Racing",
        rating: "5",
        notes: "A classic racing game with comical vehicle weapons that make each race, explosive fun."
    },
    {
        title: "Oddworld: Abe's Oddysee",
        backgroundImage: "https://thumbs.gfycat.com/WindingCompetentLarva-max-1mb.gif",
        playtime: "12",
        genre: "Adventure",
        rating: "5",
        notes: "Play as a Mudokon trying to rescue your people and escape while trying to avoid perils at every corner."
    },
    {
        title: "Mario Kart Tour",
        backgroundImage: "https://media1.giphy.com/media/3otPoo8NDLOmzvTJF6/giphy.gif",
        playtime: "n/a",
        genre: "Racing",
        rating: "5",
        notes: "A classic racing game with comical vehicle weapons that make each race, explosive fun."
    },
    {
        title: "Crash Bandicoot",
        backgroundImage: "https://giffiles.alphacoders.com/110/110066.gif",
        playtime: "6",
        genre: "Adventure, Action",
        rating: "5",
        notes: "Run, jump and spin and use the power of Aku Aku to defeat Dr. Neo Cortex and his villains."
    },
    {
        title: "Uncharted: Drake's Fortune",
        backgroundImage: "https://i.gifer.com/Azmq.gif",
        playtime: "8",
        genre: "Adventure, Action",
        rating: "5",
        notes: "An adventure to find El Dorado."
    }
]

const seedDB = async() => {
    await Game.deleteMany({});
    await Game.insertMany(seedGames);
}

seedDB().then(()=>{
    mongoose.connection.close();
})