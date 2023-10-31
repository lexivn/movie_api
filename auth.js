const jwtSecret = 'telefono'; // This has to be the sae key used in the JWTStrategy
const jwt = require('jsonwebtoken'),
passport = require('passport');

require('./passport');  // Your local passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // This is the username you're enconding in the JWT.
        expiresIn: '7d', // This specifies that the otek will expire in 7 days
        algorithm: 'HS256' // This is the algorithm used to "sign" or encode the values of the JWT
    });
}

/* POST login. */
module.exports = (router) => {
    router.post('/login', (req, res) => {     
      let user = req.body.Username;
        passport.authenticate('local', {session: false}, (error, user, info) => {
            if (error) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            if (!user) {
              return res.status(400).json({
                message: 'No such a user',
                user: user
              });
            }

                req.login(user, {session: false}, (error) => {
                    if(error) {
                        res.send('ERROR: ' + error);
                    }
                    let token = generateJWTToken(user.toJSON());
                    return res.json({user, token});
                });
                console.log(user);
        })(req, res);

    });
}