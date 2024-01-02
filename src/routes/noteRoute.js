const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Define API endpoints and link them to controller functions
router.get('/all', noteController.getAllNotes);
router.get('/:id', noteController.getNoteById);
router.post('/add', noteController.validateNote, noteController.addNote);
router.delete('/delete/:id', noteController.deleteNoteById);
router.put('/update/:id', noteController.validateNote, noteController.updateNoteById);

module.exports = router;
