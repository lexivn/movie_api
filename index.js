const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uudi = require("uuid");

const morgan = require("morgan");
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", 
{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.json());

// READ (GET)
//default text response when at /
app.get("/", (req, res) => {
  res.send("Welcome to MYFLIX!");
});

// READ (GET)
// Return a list of ALL users (to test)
app.get("/users", async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// READ (GET)
// Return a list of all movies.
app.get("/movies", async (req, res) => {
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
app.get("/movies/:Title", async (req, res) => {
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
app.get("/movies/genre/:Name", async (req, res) => {
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
app.get("/movies/directors/:Name", async (req, res) => {
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
app.post("/users", async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exist");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
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
app.put("/users/:Username", async (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }
  ) // This line is used to make sure the updated document is returned
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// CREATE (POST)
// Allow user to add a movie to their list of favorites
app.post("/users/:Username/movies/:MovieID", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $addToSet: { FavoriteMovies: req.params.MovieID } },
    //{ $push: {FavoriteMovies: (Movies.findOne( {Title: req.params.Title}).id)}},
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

// DELETE (DELETE)
// Allow users to delete movies from their favorite list
app.delete("/users/:Username/movies/:MovieID", async (req, res) => {
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
app.delete("/users/:Username", async (req, res) => {
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

app.listen(8080, () => console.log("Your app is listening on port 8080."));
