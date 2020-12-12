// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Set location of db file
dbLocation = path.join(__dirname, 'db/db.json');

// Initialize notesArray
let notesArray = [];

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Set up the HTML routes

// GET * should return the index.html file.
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
// GET /notes should return the notes.html file.
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// Set up the API routes

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    // Read the notes db into an array
    fs.readFile(dbLocation, function read(err, data) {
        if (err) {
            throw err;
        }
        // Set the notesArray equal to the returned data from the file
        notesArray = JSON.parse(data);
        // Respond with the notes array in JSON
        res.json(notesArray);
    });
    // ?? Why can't res.json command be here?  If it's here, notesArray is empty, but it's a global variable
});





// Bind and listen for connections on the specified host and port
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
