const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uudi = require("uuid");

const morgan = require("morgan");
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

// Require Passport
// let auth = require('./auth.js')(app); //The (app) argument ensures that Express is available in your "auth.js" file as well.
// const passport = require('passport');
// require('./passport');

// Implementing Security to the APP
// --------------------------------

// Using CORS (Default allow from all origins)
const cors = require('cors');
app.use(cors());

// Uncomment following code to either allow only certains orings or return an error if domain is not on the list.  
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message ), false);
//     }
//     return callback(null, true);
//   }
// }));

// Using Server-Side Input Validator. Preventing input attcks to the server
const { check, validationResult } = require('express-validator');
// ------------------------------
// End of Security Implementation

// Require Passport
// let auth = require('./auth.js')(app); //The (app) argument ensures that Express is available in your "auth.js" file as well.
// const passport = require('passport');
// require('./passport');

// Mongo DB Connection
// -------------------
// Local DB for testing
// mongoose.connect("mongodb://localhost:27017/myFlixDB",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

// Cloud DB (Atlas MongoDB)
mongoose.connect(process.env.CONNECTION_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Require Passport
let auth = require('./auth.js')(app); //The (app) argument ensures that Express is available in your "auth.js" file as well.
const passport = require('passport');
require('./passport');

// READ (GET)
// Default text response when at "/"
app.get("/", (req, res) => {
  res.send("Welcome to MYFLIX!");
});

// READ (GET)
// Return a list of ALL users (for testing)
app.get("/users", passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return a list of all movies.
app.get("/movies", passport.authenticate('jwt', { session: false }), async (req, res) => {
//  app.get("/movies", async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return data (desciption, genre, director, image URL, whether it's featured or not) about a single movie by tittle to the user.
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      return res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return data about a genre (description) by name/title(e.g., "Thriller")
app.get("/movies/genre/:Name", passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.Name })
    .then((movie) => {
      if (movie) {
        return res.status(200).json(movie.Genre.Description);
        //res.json(movie.Genre.Description);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return data about a director (bio, birth year, death year) by name
app.get("/movies/directors/:Name", passport.authenticate('jwt', { session: false }), async (req, res) => {
  Movies.findOne({ "Director.Name": req.params.Name })
    .then((movie) => {
      if (movie) {
        return res.status(200).json(movie.Director);
      }
    })
    .catch((err) => {
      console.err(err);
      res.status(500).send("Error: " + err);
    });
});

// CREATE (POST)
// Allow new user to register
app.post("/users",
  // Validation logic for new user request
  // -------------------------------------------------------------------
  // You can either use a chain of methos like .not().isEmpty(), which
  // means "opposite of isEmpy" in plain english "is not empty" or use
  // .isLength({min: 5}) which menas: minimum value of 5 are allowed.
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric - not allowed').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {
    // Check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
  // --------------------------------------------------------------------

  // Hash any password entered by the user when registering before storing it in the MongoDB database
  let hashedPassword = Users.hashPassword(req.body.Password);
await Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      // If the user is found, send a response that it already exist
      return res.status(400).send(req.body.Username + " already exist");
    } else {
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,   // Hashed password
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
        .then((user) => {
          res.status(201).json(user);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error: " + error);
        });
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

// UPDATE (UPDATE)
// Allow users to update their user info (username, password, email, date of birth)
app.put("/users/:Username", passport.authenticate('jwt', { session: false }), async (req, res) => {
  //Condition to Check Added Here
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  // Condition Ends
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      }
    },
    { new: true }
  ) // This line is used to make sure the updated document is returned
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    })
});

// CREATE (POST)
// Allow user to add a movie to their list of favorites
app.post("/users/:Username/movies/:MovieID", passport.authenticate('jwt', { session: false }), async (req, res) => {
  //Condition to Check Added Here
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  // Condition Ends
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $addToSet: { FavoriteMovies: req.params.MovieID } },
    { new: true }
  )
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// nEw
// Allow users to update their user info (username, password, email, date of birth)
app.put("/movie/setFavorite/:movieId/:flag", passport.authenticate('jwt', { session: false }), async (req, res) => {
  //Condition to Check Added Here
  
  // Condition Ends
  await Movies.findOneAndUpdate(
    { _id: req.params.movieId },
    {
      $set: {
        Feature: req.params.flag      }
    },
    { new: true }
  ) // This line is used to make sure the updated document is returned
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    })
});

// DELETE (DELETE)
// Allow users to delete movies from their favorite list
app.delete("/users/:Username/movies/:MovieID", passport.authenticate('jwt', { session: false }), async (req, res) => {
  //Condition to Check Added Here
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  // Condition Ends  
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    //{ $push: {FavoriteMovies: (Movies.findOne( {Title: req.params.Title}).id)}},
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return re.status(404).send("Error: User does not exist.");
      } else {
        res.status(200).json(updatedUser);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// DELETE (DELETE)
// Allow users to deregister
app.delete("/users/:Username", passport.authenticate('jwt', { session: false }), async (req, res) => {
  //Condition to Check Added Here
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found.");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get("/users/:Username", passport.authenticate('jwt', { session: false }), async (req, res) => {
  //Condition to Check Added Here
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//app.listen(8080, () => console.log("Your app is listening on port 8080.")); 

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
