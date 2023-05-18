//set up server variables/external modules
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const cors = require('cors');
const session = require("express-session")
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User.js')

//internal modules
const routes = require('./routes')

//environment variables
require('dotenv').config();
const PORT = process.env.PORT || 3003;

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

//set up cors middleware
                                            
const whitelist = [`${process.env.FRONTEND_URL}`, `https://game-library-frontend.herokuapp.com`];
const corsOptions = {
    origin: (origin, callback) => {
        console.log(whitelist, "WHITELIST")
            console.log(origin, "ORIGIN")
            if((whitelist.indexOf(origin) !== -1) || (!origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
    },
    //Credentials: true is required for accepting credentials from the front-end.
    credentials: true,
};

//middleware
//cors for cross-domain approval
app.use(cors(corsOptions));
app.use(express.json())
//body data middleware
app.use(express.urlencoded({extended: true}))
//method override Middleware
app.use(methodOverride("_method"))

//create sessions
const SESSION_SECRET_KEY=process.env.SESSION_SECRET

app.set("trust proxy", 1);

app.use(session({
    secret: `${SESSION_SECRET_KEY}`,
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 5 // five days per session
    }
}))

app.use(passport.initialize());
app.use(passport.session());

//passport serializes user instances to and from the session based on the cookie for that session.
//serializeUser determines which user object data is stored in session (user._id)
passport.serializeUser((user, done) => {
    return done(null, user._id);
}) 
//deserializeUser retrieves the user object based on the key provided in the done function (here, user._id)
passport.deserializeUser((id, done) => {
    User.findById(id, (err, doc) => {
        return done(null, doc);
    })
})

//2. the clientId and secret are set to the credentials for the google API
passport.use(new GoogleStrategy({
    clientID: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    callbackURL: "/auth/google/callback"
},
//3. The user is authenticated based on comparison of the credentials. This function is called on a successful authentication
function(accessToken, refreshToken, profile, cb) {
    //insert into the database
    User.findOne({ googleId: profile.id}, async (err, doc) => {
        if (err){
            return cb(err, null);
        }
        if (!doc) {
        const newUser = new User({
            googleId: profile.id,
            username: profile.name.givenName
        })
        await newUser.save();
        cb(null, newUser);
        }
        cb(null, doc);
    })
    // cb(null, profile);
    // console.log(profile);
}));

//ROUTES
app.use('/games', routes.games)
app.use('/users', routes.users)
//^sending the routes to the controller

//1. a get request is first made for the user's google profile before the user is authenticated using the googleStrategy function
app.get("/auth/google",
passport.authenticate('google', {scope: ['profile']}));

//4. this function is then called on a successful or unsuccessful callback
app.get("/auth/google/callback", passport.authenticate('google', {
    failureRedirect: 'https://game-library-frontend.herokuapp.com/',
    session: true,
}),
function(req, res){
    res.redirect('https://game-library-frontend.herokuapp.com/');
});

app.get("/getuser", (req, res) => {
    res.send(req.user);
})

app.get("/logout", function (req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})

//confirms that the server is working
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
})