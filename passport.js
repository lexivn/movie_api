const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
Models = require('./models.js'),
passportJWT = require('passport-jwt');

let Users = Models.User,
JWTStrategy = passportJWT.Strategy,
ExtractJWT = passportJWT.ExtractJwt;

// Defining the Passport Strategy: Local Strategy
passport.use(
    new LocalStrategy(
        {
          // Defininf the parameters the server will receive when client submit the form
          // Use Username and Password.
            usernameField: 'Username',  
            passwordField: 'Password',
        },
        async (username, password, callback) => {
            console.log(`${username} ${password}`);
            await Users.findOne({Username: username})
            .then((user) => {
                if(!user) {
                    console.log('incorrect username');
                    return callback(null, false, {
                        message: 'Incorrect username or password.',
                    });
                }               
                // Hash any password entered by the user when logging in before comparing it to the password stored in MongoDB
                if(!user.validatePassword(password)) {       // Additional callback to validate any password a user enters
                    console.log('incorrect password');
                    return callback(null, false, {message: 'incorrect password.'});
                }
                console.log('finished');
                return callback(null, user);
            })
            .catch((error) => {
                if (error) {
                    console.log(error);
                    return callback(error);
                }
            })
        }
    )
);

// Strategy that allows only requests with valid tokens to access some endpoints
passport.use( new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'telefono'
}, async (jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error);
    });

}
));

