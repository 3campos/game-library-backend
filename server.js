//set up server variables/external modules
const express = require('express');
const app = express();
const router = express.Router()
const methodOverride = require('method-override');
const cors = require('cors');
const session = require("express-session")
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieParser = require('cookie-parser')
const User = require('./models/users.js')

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

                                            //👇deployed site link goes here
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
    //The below line is required for accepting credentials from the front-end. It's not needed if we do not implement authentication.
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
// app.use(
//     session({
//         secret: "secretcode",
//         resave: true,
//         saveUninitialized: true,
//     })
// );
// app.use(cookieParser());

// const SESSION_SECRET=process.env.SESSION_SECRET

app.set("trust proxy", 1);

app.use(session({
    secret: "secret-key",
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
passport.serializeUser((user, done) => {
    return done(null, user._id);
}) 

passport.deserializeUser((id, done) => {
    User.findById(id, (err, doc) => {
        return done(null, doc);
    })
})

passport.use(new GoogleStrategy({
    clientID: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    callbackURL: "/auth/google/callback"
},
//this function is called on a successful authentication
function(accessToken, refreshToken, profile, cb) {
    //insert into the database
    console.log(User, 'line 86 of server.js')
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
//this makes all routes start with /games on local or deployed site
app.use('/games', routes.games)
//^sending the default route over to the controller
//can add additional controllers here
app.get("/auth/google",
passport.authenticate('google', {scope: ['profile']}));

app.get("/auth/google/callback", passport.authenticate('google', {failureRedirect: 'https://game-library-frontend.herokuapp.com/'}),
function(req, res){
    res.redirect('https://game-library-frontend.herokuapp.com/');
});

//a get request is first made
//the user is authenticated based on comparison of the credentials
//the googleStrategy function inserts the user credentials into the database
//if there's a successful authentication, the user is redirected home. If not, the user is redirected to the login page
//then passport will serialize the user id and store it into a cookie for the session

app.get("/getuser", (req, res) => {
    res.send(req.user);
    console.log('getting user line 132:', req.user)
})

app.get("/logout", function (req, res, next) {
    console.log('getting user line 136:', req.user)
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    console.log('checking whether there is still a user line 141:', req.user)
})

//confirms that the server is working
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
})