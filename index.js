const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    uudi = require("uuid");

app.use(bodyParser.json());

let users = [
    {
        id: 1,
        Name: "Jhon White",
        FavouriteMovies: [],
    },
    {
        id: 2,
        Name: "Douglas Neciai",
        FavouriteMovies: ['Top Gun'],
    },
];

let movies = [
    {
        Title: "Harry Potter and the Philosopher's Stone",
        Description:
            "Harry Potter has lived under the stairs at his aunt and uncle's house his whole life. But on his 11th birthday, he learns he's a powerful wizard—with a place waiting for him at the Hogwarts School of Witchcraft and Wizardry. As he learns to harness his newfound powers with the help of the school's kindly headmaster, Harry uncovers the truth about his parents' deaths—and about the villain who's to blame.",
        Genre: {
            Name: "Adventure",
            Description:
                "A type of adventure film where the action takes place in imaginary lands with strange beasts, wizards and witches. These films contain many of the elements of the sword-and-sorcery film, but are not necessarily bound to the conventions of the sword and magic.",
        },
        Director: {
            Name: "J.K. Rowling",
            Bio: "Chris Joseph Columbus (born September 10, 1958) is an American filmmaker. Born in Spangler, Pennsylvania, Columbus studied film at Tisch School of the Arts where he developed an interest in filmmaking. After writing screenplays for several teen comedies in the mid-1980s, he made his directorial debut with a teen adventure, Adventures in Babysitting (1987). Columbus gained recognition soon after with the highly successful Christmas comedy Home Alone (1990) and its sequel Home Alone 2: Lost in New York (1992).The comedy Mrs. Doubtfire (1993), starring Robin Williams, was another box office success for Columbus. He went on to direct several other films throughout the 1990s, which were mostly met with lukewarm reception. However, he found commercial success again for directing the film adaptations of J. K. Rowling's novels, Harry Potter and the Sorcerer's Stone (2001) and its sequel, Harry Potter and the Chamber of Secrets (2002), which are his highest-grossing films to date. In addition to directing, Columbus was a producer for Harry Potter and the Prisoner of Azkaban (2004), and the drama The Help (2011). He also directed the fantasy Percy Jackson & the Olympians: The Lightning Thief (2010) and the 3D action comedy Pixels (2015). Columbus is the co- founder of 1492 Pictures, a film production company that has produced some of his films since 1995. More recently, he co- founded another production firm with his daughter in 2014, called Maiden Voyage Pictures.In 2017, he launched ZAG Animation Studios, alongside Michael Barnathan, Haim Saban, and Jeremy Zag.",
            Birth: 1969.0,
        },
        Image: "",
        Featured: false,
    },
    {
        Title: "Jhon Wick",
        Description:
            "With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
        Genre: {
            Name: "Action",
            Description: "",
        },
        Director: {
            Name: "Chad Stahelski",
            Bio: "Chad Stahelski is an American stuntman and film director. He is known for directing 2014 film John Wick along with David Leitch, and for doubling Brandon Lee after the fatal accident involving Lee at the set of The Crow (1994). He has also worked as a stunt coordinator and second unit director on several films.",
            Birth: 1968,
        },
        Image: "",
        Featured: false,
    },
    {
        Title: "Law and Order",
        Description:
            "With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
        Genre: {
            Name: "Crime",
            Description: "",
        },
        Director: {
            Name: "Dick Wolf",
            Bio: "In cases ripped from the headlines, police investigate serious and often deadly crimes, weighing the evidence and questioning the suspects until someone is taken into custody. The district attorney's office then builds a case to convict the perpetrator by proving the person guilty beyond a reasonable doubt. Working together, these expert teams navigate all sides of the complex criminal justice system to make New York a safer place.",
            Birth: 1946,
        },
        Image: "",
        Featured: false,
    },
    {
        Title: "Top Gun",
        Description:
            "After more than thirty years of service as one of the Navy's top aviators, and dodging the advancement in rank that would ground him, Pete “Maverick” Mitchell finds himself training a detachment of TOP GUN graduates for a specialized mission the likes of which no living pilot has ever seen.",
        Genre: {
            Name: "Action",
            Description: "",
        },
        Director: {
            Name: "Joseph Kosinski",
            Bio: "Joseph Kosinski (born May 3, 1974) is an American film director best known for the science-fiction films “Tron: Legacy (2010) and “Oblivion (2013)”, the drama-thriller “Only the Brave” (2017), and the action-thrille “Top Gun: Maverick” (2022). His previous work has primarily been in the field of CGI television commercials, most notably his 2007 commercials for the video games “Halo 3“ and “Gears of War”.",
            Birth: 1974,
        },
        Image: "",
        Featured: false,
    },
];

// READ
// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// Return data (desciption, genre, director, image URL, whether it's featured or not) about a single movue by tittle to the user.
app.get('/movies/:title', (req, res) => {
    //const title = req.params.title; This is equivalente to const { title } = req.params;
    const { title } = req.params;
    const movie = movies.find((movie) => movie.Title === title);

    if (movie) {
        return res.status(200).json(movie);
    } else {
        res.status(400).send("No such movie");
    }
});

// Return data about a genre (description) by name/title(e.g., "Thriller")
app.get('/movies/genre/:genreName', (req, res) => {
    //const title = req.params.title; This is equivalente to const { title } = req.params;
    const { genreName } = req.params;
    const genre = movies.find((movies) => movies.Genre.Name === genreName).Genre;

    if (genre) {
        return res.status(200).json(genre);
    } else {
        res.status(400).send("No such movie");
    }
});

// Return data about a director (bio, birth year, death year) by name
app.get('/movies/directors/:directorName', (req, res) => {
    //const title = req.params.title; This is equivalente to const { title } = req.params;
    const { directorName } = req.params;
    const director = movies.find(
        (movies) => movies.Director.Name === directorName
    ).Director;

    if (director) {
        return res.status(200).json(director);
    } else {
        res.status(400).send("No such movie");
    }
});

// CREATE
// Allow new user to register
app.post('/users', (req, res) => {
    let newUser = req.body;

    if (!newUser.Name) {
        res.status(400).send("Missing the name in the request body");
    } else {
        newUser.id = uudi.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

// UPDATE
// Allow users to update their user info (username, password, email, date of birth)
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    let updatedUser = req.body;

    let user = users.find((user) => user.id == id);

    if (user) {
        user.Name = updatedUser.Name;
        res.status(200).json(user);
    } else {
        res.status(404).send("User not found");
    }
});

// CREATE
// Allow user to add a movie to their list of favourites
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
       user.FavouriteMovies.push(movieTitle);
       res.status(201).send(`${movieTitle} has been added to the "${user.Name}'s" favourite movie list.`);
    } else {
        res.status(404).send('User not found.');        
    }
});

// DELETE
// Allow users to delete movies from their favourite list
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle} = req.params;

    let user = users.find( user => user.id == id);

    if(user) {
        user.FavouriteMovies = user.FavouriteMovies.filter( title => title !== movieTitle); // Return only titles different from movieTitle
        res.status(200).send(`${movieTitle} has been removed from the "${user.Name}'s favourite movie list."`);
        //res.json(user.FavouriteMovies);
    } else {
        res.status(400).send('User not found.');

    }
});

// DELETE
// Allow users to deregister
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id);

    if(user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`The user with id=${id} has been removed.`);
        //res.status(200).json(users);

    } else {
        res.status(400).send('User not found.');

    }
});

app.listen(8080, () => console.log("Your app is listening on port 8080."));
