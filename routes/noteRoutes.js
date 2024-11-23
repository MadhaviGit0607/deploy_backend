const express = require('express');
const { Op } = require('sequelize');  
const Note = require('../models/Note'); 

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query; 
    const whereClause = {};

    if (category) whereClause.category = category;  
    if (search) whereClause.title = { [Op.like]: `%${search}%` }; 
    const notes = await Note.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']], 
    });

    res.json(notes); 
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { title, description, category } = req.body;

    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newNote = await Note.create({
      title,
      description,
      category: category || 'Others', 
    });

    res.status(201).json(newNote); 
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ message: 'Error creating note' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, completed } = req.body;

    // Find the note by its ID
    const note = await Note.findByPk(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    
    note.title = title || note.title;
    note.description = description || note.description;
    note.category = category || note.category;
    note.completed = completed !== undefined ? completed : note.completed; 
    note.updated_at = new Date();  

    await note.save(); 

    res.json(note);
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ message: 'Error updating note' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findByPk(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.destroy();
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

module.exports = router;
