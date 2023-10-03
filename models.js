// Importing the package mongoose.
const mongoose = require('mongoose');
// Implementing Hashing to the user's password
const bcrypt = require('bcrypt');

// Defining the Schema for documents in the "Movies"
let movieSchema = mongoose.Schema({
    Title: { type: String, required: true},
    Desciption: { type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actor: [String],
    ImagePath: String,
    Featured: Boolean
});

// Defining the Schema for documents in the "Users"
let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});
// Function to Hash the submitted passwords
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};
// Function to Validate the submitted hashed passwords with hashed passwords stored in database
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

// Defining the Schema for documents in the "Genres"
// let genreSchema = mongoose.Schema({
//     Name: {type: String, required: true},
//     Desciption: {type: String, required: true}
// });

// Defining the Schema for the documents in the "Directors
// let directorSchema = mongoose.Schema({
//     Name: {type: String, required: true},
//     Bio: {type: String},
//     Birth: {type: Date},
//     Death: {type: Date}
// });

// Creating the Models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
//let Genre = mongoose.model('Genre', genreSchema );
//let Director = mongoose.model('Director', directorSchema);

// Exporting the Models
module.exports.Movie = Movie;
module.exports.User = User;
//module.exports.Genre = Genre;
//module.exports.Director = Director;
