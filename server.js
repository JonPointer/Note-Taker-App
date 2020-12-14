// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const cuid = require('cuid');

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
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post('/api/notes', (req, res) => {
    // req.body hosts is equal to the JSON post sent from the user
    const newNote = req.body;
    // Set an ID parameter for the new note
    let id = cuid();
    newNote.id = id;
    // Now, need to add this note to the db.json file
    // First, read the array of note objects from the file
    fs.readFile(dbLocation, function read(err, data) {
        if (err) {
            throw err;
        }
        // Set the notesArray equal to the returned data from the file
        notesArray = JSON.parse(data);
        // Now add the new note to this array
        notesArray = [...notesArray, newNote];
        // Write this new array to the db file
        fs.writeFile(dbLocation, JSON.stringify(notesArray), (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
            // success case, the file was saved
            console.log('New note saved to db file!');
            // Now return the new array of notes
            res.json(notesArray);
        });
    });
});

// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete
app.delete('/api/notes/:id', (req, res) => {
    // Capture the note id to be deleted
    const deleteId = req.params.id;
    // Read the notes db into an array
    fs.readFile(dbLocation, function read(err, data) {
        if (err) {
            throw err;
        }
        // Set the notesArray equal to the returned data from the file
        notesArray = JSON.parse(data);
        // Now generate a new notes array without the object that has the specified id
        function checkId(record) {
            return record.id != deleteId;
        }
        newNotesArray = notesArray.filter(checkId);
        // Now write this new notes array to the db file
        fs.writeFile(dbLocation, JSON.stringify(newNotesArray), (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
            // success case, the file was saved
            console.log(`Note ID: ${deleteId} removed and new file saved!`);
            // Now return the new array of notes
            res.json(newNotesArray);
        });
    });
});

// Bind and listen for connections on the specified host and port
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
