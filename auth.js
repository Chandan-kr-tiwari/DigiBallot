const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/users.schema')

// So here if we use localstrategy for the authentication then 
// we always need to give username and password to get access
// which is not good for making scalable and robust application
// so we use token based authentication that's why we are going to use
//JWT authentication
// Authentication
passport.use(new LocalStrategy(async (adhaarcard, password, done) => {
    try {
        // console.log('Received credentials:', username, password);
        const user = await User.findOne({adhaarcard:adhaarcard});
        if (!user)
            return done(null, false, { message: 'Incorrect adhaarcard.' });
        
        // const isPasswordMatch = user.password===password ? true:false; 
        // Now use bcrypt for hashing so we have to incorporate 
        const isPasswordMatch= await user.comparePassword(password)
        if (isPasswordMatch)
            return done(null, user);
        else
            return done(null, false, { message: 'Incorrect password.' })
    } catch (error) {
        return done(error);
    }
}));

module.exports=passport