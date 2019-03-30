var mongoose = require("mongoose");

var room = mongoose.model('room', {
  room_id: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
});

module.exports = {room}