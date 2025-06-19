// Inside your backend routes, assuming you're using Express
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// POST: Create a new note
router.post('/create', async (req, res) => {
  try {
    const { title, content, tags, user } = req.body;

    if (!title || !content || !tags || !user) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newNote = new Note({
      title,
      content,
      tags,
      user
    });

    await newNote.save();
    res.status(201).json(newNote); // Sending back the created note
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/mynotes/:userId', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.params.userId });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Toggle star/unstar a note
// PUT: Toggle star/unstar a note
router.patch('/star/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Toggle the starred status
    note.starred = !note.starred;
    
    // Save the updated note
    await note.save();
    
    // Return the updated note data
    res.status(200).json(note);  // This returns the note with the updated starred status
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH: Toggle done/undone a note
router.patch('/done/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Toggle the done status
    note.done = !note.done;

    // Save the updated note
    await note.save();

    res.status(200).json(note); // Return updated note
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




module.exports = router;


