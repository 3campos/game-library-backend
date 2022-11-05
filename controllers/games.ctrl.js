const db = require('../models')

//index route shows all games' data in the database as json
const index = (req, res) => {
    db.Game.find(
        {}, (error, allGames) => {
            if(error) return res.status(400).json({error: error.message});

            return res.status(200).json({
                allGames,
                requestedAt: new Date().toLocaleString()
            });
        });
};

//create a POST route to add games to the game library
const create = (req, res) => {
    db.Game.create(
        req.body, (error, createdGame) => {
            if(error) return res.status(400).json({error: error.message});
            return res.status(200).json(createdGame)
            console.log(createdGame)
        }
    )
}

//put route
const update = (req, res) => {
    db.Game.findByIdAndUpdate(req.params.id,
        {
            $set: req.body
        },
        {new: true},
        (err, updatedGame) => {
            if(err) return res.status(400).json({error: err.message})
            return res.status(200).json(updatedGame)
        }
    )
}

//delete route
const destroy = (req, res) => {
    db.Game.findByIdAndDelete(req.params.id, (error, deletedGame) => {
        if(!deletedGame) return res.status(400).json({error: "Game not found"})
        if(error) return res.status(400).json({error: error.message})
        return res.status(200).json({
            message: `Game ${deletedGame.title} deleted successfully!`
        })
    })
}

module.exports = {
    index,
    create,
    update,
    destroy
}