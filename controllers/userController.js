// const db = require('../models/users.js')

// //index route shows all users' data in the database as json
// const index = (req, res) => {
//     db.User.find(
//         {}, (error, allUsers) => {
//         //^empty bracket here returns all docs in the collection
//             if(error) return res.status(400).json({error: error.message});
//             return res.status(200).json({
//                 allUsers,
//                 requestedAt: new Date().toLocaleString()
//             });
//         });
// };

// //create a POST route to add users
// const create = (req, res) => {
//     db.User.create(
//         req.body, (error, createdUser) => {
//         // The req.body property contains key-value pairs of data submitted in the request body
//             if(error) return res.status(400).json({error: error.message});
//             return res.status(200).json(createdUser)
//         }
//     )
// }

// module.exports = {
//     index,
//     create
// }