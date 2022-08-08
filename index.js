
const express = require('express');
const app = express();
const { connectMongoose, User } = require("./db.js");
const ejs = require("ejs");
const passport = require("passport");
const { initializingPassport,isAuthenticated }= require("./passportConfig.js");
expressSession = require('express-session');

connectMongoose();

initializingPassport(passport);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    expressSession({ secret: "secret", resave: false, saveUninitialized: false})
);
app.use(passport.initialize());
app.use(passport.session());


app.set("view engine","ejs");

app.get("/",(req, res)=>{
    res.render("index.ejs");
})
app.get("/register",(req, res)=>{
    res.render("register.ejs");
})
app.get("/login", (req, res)=> {
    res.render("login.ejs");
})

app.get("/profile", isAuthenticated,(req, res) => {
    res.render("profile");
})
app.get("/message", (req, res)=> {
    res.render("message.ejs");
})

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });


app.post("/register",async (req,res)=>{
    const user = await User.findOne({ username: req.body.username});
    if(user) return res.status(400).send("User already exists");
    const newUser = await User.create(req.body);
    res.render("login.ejs");
});

app.post("/login",
passport.authenticate("local",{ 
    failureRedirect: "/message",
    successRedirect: "/profile",
}) 

);

app.listen(3000,() =>{
    console.log("listening port 3000 ");
});