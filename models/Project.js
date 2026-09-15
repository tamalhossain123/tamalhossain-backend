const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['photoshop', 'illustrator', 'website', 'wordpress'], 
    required: true 
  },
  description: { type: String },
  image: { type: String, required: true },
  liveUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);