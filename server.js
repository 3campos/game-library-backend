//set up server variables/external modules
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const cors = require('cors');

//internal modules
const routes = require('./routes')

//environment variables
require('dotenv').config();
const PORT = process.env.PORT || 3003;

//set up cors middleware

                                            //👇deployed site link goes here
const whitelist = [`${process.env.FRONTEND_URL}`, `https://game-library-frontend.herokuapp.com/`];
const corsOptions = {
    origin: (origin, callback) => {
        console.log(whitelist, "WHITELIST")
            console.log(origin, "ORIGIN")
            if(whitelist.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
    },
    //The below line is required for accepting credentials from the front-end. It's not needed if we do not implement authentication.
    //credentials: true,
};

//middleware
//cors for cross-domain approval
// app.use(cors(corsOptions));
app.use(cors({
    origin: "https://game-library-frontend.herokuapp.com/"
}))
app.use(express.json())
//body data middleware
app.use(express.urlencoded({extended: true}))
//method override Middleware
app.use(methodOverride("_method"))
//serve public files

//ROUTES
//this makes all routes start with /games on local or deployed site
app.use('/games', routes.games)
//^sending the default route over to the controller
//can add additional controllers here

//Connect to mongoose server
const mongoose = require('mongoose');
const db = mongoose.connection;

//establishing the connection b/n mongoDB Atlas
mongoose
    .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
    .then(()=>{
    console.log(`Mongodb connected at ${db.host}:${db.port}`)
    })
    .catch((err)=>console.log(err))

//confirms that the server is working
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
})