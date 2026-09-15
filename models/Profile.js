const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Md. Tamal Hossain' },
  typingTitles: [{ type: String }],
  email: { type: String, default: 'tamalhossain908@gmail.com' },
  phone: { type: String, default: '+880 1730 048626' },
  address: { type: String, default: 'Barishal Sadar, Barishal-8200, Bangladesh' },
  nationality: { type: String, default: 'Bangladeshi' },
  aboutBio: { type: String },
  profileImage: { type: String, default: 'assets/img/profile-pic.png' },

  skills: [{
    name: { type: String },
    percentage: { type: Number }
  }],

  education: [{
    institute: { type: String },
    year: { type: String },
    degree: { type: String },
    field: { type: String }
  }],

  experience: [{
    company: { type: String },
    duration: { type: String },
    role: { type: String },
    description: { type: String }
  }],

  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    upwork: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);