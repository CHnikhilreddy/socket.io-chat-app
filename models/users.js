var mongoose = require("mongoose");
const validator = require('validator');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/intern',{useNewUrlParser: true});

mongoose.connection.once('open',()=>{
	console.log("connection is sucess");
}).on('error',()=>{
	console.log("connecction error");
});

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  name: {
    type: String,
    require: true,
    minlength:1,
    unique: true,
    trim: true,
  },
  online: {
    type: String,
  }
  
});

module.exports = {User}