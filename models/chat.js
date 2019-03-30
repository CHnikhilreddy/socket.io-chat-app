var mongoose = require("mongoose");

var chat = mongoose.model('chat', {
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  from: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  to : {
  	type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
});

module.exports = {chat}