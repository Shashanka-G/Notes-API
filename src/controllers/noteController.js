// Import necessary modules
const Note = require('../models/Note');
const { validationResult } = require('express-validator');

// Validation middleware for note creation and updating
const { body } = require('express-validator');

const validateNote = [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }).withMessage('Title must be at most 255 characters'),
    body('content').trim().notEmpty().withMessage('Content is required'),
];

// Controller functions for CRUD operations

// Retrieve all notes
const getAllNotes = async (req, res, next) => {
    try {
        // Retrieve all notes from the database
        const notes = await Note.find();

        // Return the notes as the response
        res.status(200).json({
            count: notes.length,
            notes: notes.map(note => {
                return {
                    _id: note._id,
                    title: note.title,
                    content: note.content,
                    createdAt: note.createdAt,
                    updatedAt: note.updatedAt,
                    request: {
                        type: 'GET',
                        url_dynamic: req.protocol + '://' + req.get('host') + '/notes/' + note._id,
                    },
                };
            }),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error:error.message || 'Internal Server Error',
        });
    }
};

// Retrieve a note by ID
const getNoteById = async (req, res, next) => {
    const noteId = req.params.id;
    try {
        // Retrieve the note by ID from the database
        const note = await Note.findById(noteId);

        // Check if the note exists
        if (!note) {
            return res.status(404).json({ message: `Note with id ${noteId} not found` });
        }

        // Return the note as the response
        res.status(200).json({
            message : "Note retrieved successfully",
            note: {
                _id: note._id,
                title: note.title,
                content: note.content,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message || 'Internal Server Error',
        });
    }
};


// Add a new note
const addNote = async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message : "Invalid request data",
            errors: errors.array()
        });
    }

    // Extract data from request body
    const { title, content } = req.body;

    try {
        // Create a new note
        const newNote = new Note({
            title,
            content,
        });


        // Save the note to the database
        const savedNote = await newNote.save();


        // Return the saved note with a request object as the response
        res.status(201).json({
            message: 'Note created successfully',
            createdNote: {
                _id: savedNote._id,
                title: savedNote.title,
                content: savedNote.content,
                createdAt: savedNote.createdAt,
                updatedAt: savedNote.updatedAt,
            },
            request: {
                type: 'GET',
                url_dynamic: req.protocol + '://' + req.get('host') + '/notes/' + savedNote._id,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message || 'Internal Server Error',
        });
    }
};


// Delete a note by ID
const deleteNoteById = async (req, res, next) => {
    const noteId = req.params.id;

    try {
        // Delete the note from the database
        const deletedNote = await Note.findByIdAndDelete(noteId);

        // Check if the note exists
        if (!deletedNote) {
            return res.status(404).json({ 
                message: `Note with id ${noteId} not found`
            });
        }

        // Return a success message as the response
        res.status(200).json({
            message: 'Note deleted successfully',
            deletedNote: {
                _id: deletedNote._id,
                title: deletedNote.title,
                content: deletedNote.content,
                createdAt: deletedNote.createdAt,
                updatedAt: deletedNote.updatedAt,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message || 'Internal Server Error'
        });
    }
};

// Update a note by ID
const updateNoteById = async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract data from request body and URL parameters
    const { title, content } = req.body;
    const noteId = req.params.id;

    try {
        // Update the note in the database
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, content, updatedAt: Date.now() },
            { new: true } // Return the updated note
        );

        // Check if the note exists
        if (!updatedNote) {
            return res.status(404).json({ message: `Note with ${noteId} not found`});
        }
        // Return the updated note as the response
        res.status(200).json(updatedNote);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message || 'Internal Server Error',
        });
    }
};


// Export the controller functions and the validation middleware
module.exports = {
    getAllNotes,
    getNoteById,
    addNote,
    deleteNoteById,
    updateNoteById,
    validateNote,
};
