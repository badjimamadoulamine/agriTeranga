const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['techniques-culture', 'gestion-ferme', 'commercialisation', 'irrigation', 'bio', 'autre'],
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'article', 'pdf', 'quiz'],
    required: true
  },
  content: {
    videoUrl: String,
    articleText: String,
    pdfUrl: String,
    quizQuestions: [{
      question: String,
      options: [String],
      correctAnswer: Number
    }]
  },
  duration: Number, // en minutes
  level: {
    type: String,
    enum: ['débutant', 'intermédiaire', 'avancé'],
    default: 'débutant'
  },
  thumbnail: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  enrolledUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completed: {
      type: Boolean,
      default: false
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Formation', formationSchema);