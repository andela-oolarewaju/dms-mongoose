var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  }
});

var userSchema = new Schema({
  firstName: {
    type: String,
    unique: true,
    required: false
  },
  lastName: String,
  roleTitle: {
    type: String,
    ref: 'Role',
    required: true
  }
});

var documentSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  roleTitle: {
    type: String,
    ref: 'Role',
    required: true,
    unique: false
  },
  createdAt: String,
  publishDate: {
    type: Date,
    default: Date.now
  }
});

//set createdAt to current date before saving a document
documentSchema.pre('save', function(next) {
  var doc = this;
  var currentDate = new Date()
  var currentDate = currentDate.getDay() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear()
  doc.createdAt = currentDate;
  next();
});

mongoose.model('User', userSchema);
mongoose.model('Role', roleSchema);
mongoose.model('Document', documentSchema);
