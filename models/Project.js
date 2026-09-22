const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Project title is required'],
    trim: true 
  },
  
  // ক্যাটাগরি ওপেন ও ডাইনামিক রাখা হয়েছে (ড্যাশবোর্ডের সব ক্যাটাগরি সাপোর্ট করবে)
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    trim: true,
    lowercase: true 
  },

  // নতুন ফিল্ড ১: লাইভ লিঙ্ক নাকি লাইটবক্স প্রিভিউ
  actionType: { 
    type: String, 
    enum: ['url', 'lightbox'], 
    default: 'url' 
  },

  // নতুন ফিল্ড ২: লং স্ক্রিনশট স্ক্রোল নাকি নরমাল ফিট ফ্রেম
  scrollMode: { 
    type: String, 
    enum: ['scroll', 'fit'], 
    default: 'fit' 
  },

  description: { 
    type: String, 
    default: '',
    trim: true 
  },

  image: { 
    type: String, 
    required: [true, 'Project screenshot image is required'] 
  },

  liveUrl: { 
    type: String, 
    default: '',
    trim: true 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// OverwriteModelError প্রতিরোধক সেফ এক্সপোর্ট
module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);