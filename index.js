const express = require('express'),
morgan = require('morgan'),
fs = require('fs'),
path = require('path');

let top10movies = [
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author:'J.K. Rowling'
    },
    {
        title: 'Lord of the Rings',
        author:'J.R.R. Tolkien'
    },
    {
        title: 'Twilighone',
        author:'Stephanie Meyer'
    },
    {
        title: 'Avatar',
        author:'James Cameron'
    },
    {
        title: 'Rocky Balboa',
        author:'Silvester Stalone'
    },
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author:'J.K. Rowling'
    },
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author:'J.K. Rowling'
    },
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author:'J.K. Rowling'
    },
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author:'J.K. Rowling'
    },
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author:'J.K. Rowling'
    }
];

const app = express();

// Creating a write stream (in append mode)
// a 'log.txt' file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'}); 

app.use(express.static('public'));
// Set up the logger
app.use(morgan('combined', {stream: accessLogStream}));


app.get('/', (req, res)=> {
    res.send('Welcome to my app!');

});

app.get('/movies', (req, res)=> {
    res.json(top10movies);
});

app.listen(8080, ()=> {
    console.log('Your app is listening on port 8080.');
});