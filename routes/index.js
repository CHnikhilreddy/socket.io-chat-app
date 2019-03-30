const express = require('express');
const router = express.Router();
var {User} = require("../models/users.js");

router.get('/',(req,res) => res.render('welcome'));


//login page
router.get('/login',(req,res) => res.render('login'));

router.post('/logout',(req,res) => {
	req.session = null;
	res.render('login')
});
//register
router.get('/register',(req,res) => res.render('signup'));

router.get('/:NameOfAccount',(req,res) => {
	if(req.session.usersName == req.params.NameOfAccount){
		res.render('index.hbs',{
			usersName: req.session.usersName
		});
	}
	else{
		 res.render('login.hbs');
	}
});

router.get('/:NameOfAccount/:Event',(req,res) => {
	    
		if(req.session.usersName == req.params.NameOfAccount){
		    if(req.params.Event == "users"){
		       res.render('users.hbs',{
			   usersName: req.session.usersName
		       });
		     }
		     else if(req.params.Event == "rooms"){
		       res.render('rooms.hbs',{
			   usersName: req.session.usersName
		       });
		     }
		     else if(req.params.Event == "online"){
		       res.render('online.hbs',{
			   usersName: req.session.usersName
		       });
		     }
		}
		else{
		      res.render('login.hbs');
		}
		
});

router.post('/register',(req,res) => {
	  const { name, email, password, password2 } = req.body;
	  var user = new User({
	  	email :  email,
	  	password : password,
	  	name: name
	  });
	  user.save().then((doc)=>{
        },(e)=>{
        	console.log('Unable to save user');
        });
	res.render('login')
})

router.post('/login',(req,res)=>{
	const { email, password } = req.body;
	User.findOne({email: email}).then((doc)=>{
	    if(doc.password == password){
	       	req.session.user = doc.email;
            req.session.usersName = doc.name;
            req.session.userId = doc._id.toString();
            res.redirect(req.session.usersName)
     
	      }
	    else{res.redirect('login')}
        },(e)=>{
	            res.status(400).json({message: 'A user with that email does not exist.'});
    });
	
});

module.exports = router;