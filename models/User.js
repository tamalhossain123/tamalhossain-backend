const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

// পাসওয়ার্ড হ্যাশিং প্রি-হুক
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// পাসওয়ার্ড ম্যাচ মেথড
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// OverwriteModelError প্রটেকশন সহ সেফ এক্সপোর্ট
module.exports = mongoose.models.User || mongoose.model('User', userSchema);