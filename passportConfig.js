 const LocalStrategy = require("passport-local").Strategy;
 const {User} = require("./db.js");
 exports.initializingPassport = (passport) =>{
    passport.use(
        new LocalStrategy(async(username, password, done) => {
            console.log("Paswoded",password, username);
           try {
            const user = await User.findOne({ username });
            if(!user) return done(null, false);
            if(user.password !== password) return done(null, false, {message: "incorrect password"}) 
            return done(null, user);
            
           } catch (error) {
            return done(error, false);
         
           }
        })
    );
    passport.serializeUser((user,done) => {
        done(null, user.id);
    })
    passport.deserializeUser(async (id, done) =>{
        try{
            const user = await User.findById(id);
            done(null, user);
        }
        catch(error){
            done(error,false);
        }
    });

};

exports.isAuthenticated = (req,res,next)=> {
    if (req.user) return next();

    res.redirect("/login");
}