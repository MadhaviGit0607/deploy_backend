const Note = require('../models/noteModel');
const { Op } = require('sequelize');

exports.getAllNotes = async (req, res) => {
  try {
    const { category, search } = req.query; 
    const whereClause = {}; 

    if (category) whereClause.category = category;

   
    if (search) whereClause.title = { [Op.like]: `%${search}%` };

  
    const notes = await Note.findAll({ 
      where: whereClause, 
      order: [['created_at', 'DESC']]  
    });

    res.json(notes); 
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Unable to fetch notes' });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const note = await Note.create({ title, description, category });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create note' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, completed } = req.body;

    const note = await Note.findByPk(id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    note.title = title || note.title;
    note.description = description || note.description;
    note.category = category || note.category;
    note.completed = completed !== undefined ? completed : note.completed;
    note.updated_at = new Date();

    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update note' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findByPk(id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    await note.destroy();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete note' });
  }
};
