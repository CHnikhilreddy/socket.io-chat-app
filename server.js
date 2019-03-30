var express = require('express');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express()
app.use(session({secret: "Shh, its a secret!"}));
const hbs = require('hbs');
var http = require('http').Server(app);
var io = require('socket.io')(http);


var {User} = require("./models/users.js");
var {chat} = require("./models/chat.js");
var {room} = require("./models/room.js");

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine','hbs');
app.use(express.urlencoded({ extended: false}));

// routing
app.use('/', require('./routes/index'));
 



io.sockets.on('connection', function (socket) {

    socket.on('useronline', function(username){
    	//Mark as online
        User.findOneAndUpdate({name: username},{$set:{online: true}},{new:true},(err,doc)=>{
            if (err) {
                console.log("something went wrong");
            }
       });

       //All the rooms users in part of add to all of them
       room.find({username : username},function(err,doc){
            for (var i = 0; i <= doc.length; i++) {
            	socket.join('roomid'+doc.room_id)
            }
            socket.emit('rooms',doc);
       });

       //All the users how are online
       User.find({online : true},function(err,doc){
            socket.emit('onlineusers',doc);
       });

       // update the list of users in chat, client-side
       io.sockets.emit('updateuser', username);
    });
    
    // add to room
    socket.on('addtoroom',function(doc){
    	room.save().then((obj)=>{
            },(e)=>{
        	console.log(e);
        });
        socket.join(doc.room_id);
    })

    //create a new room
    socket.on("createroom",function(doc){
    	room.find({room_id : doc.room_id},function(err,doc1){
           if(err){
           	throw err
           }
           else{
           	if(doc.room_id == doc1[0].room_id){
           		socket.emit("roomupdate",'room already exit')
           	}
           	else{
           		room.save().then((obj)=>{
                    },(e)=>{
        			console.log(e);
        		});
        		socket.join(doc.room_id);
        		socket.emit("roomupdate",'room created and added')
           	}
           }
    	});
    });

    //save chat
    socket.on('savechat',function(doc){
        chat.save().then((obj)=>{
            },(e)=>{
        	console.log(e);
        });
        //broadcast to the room
        io.sockets.in(doc.to).emit('broadcast',doc);
    })

    //room individual
    socket.on('onlineroom',function(doc){
    	socket.broadcast.to(doc.room_id).emit('updateUsersList', doc.username + 'is online');
    	// Get chats from mongo collection
        chat.find({room_id : doc.room_id}).limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }

            // Emit the messages
            socket.emit('roomchat', res);
        });
    });

    // when the user disconnects.. perform this
	socket.on('disconnect', function(obj){
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', obj.username + ' has disconnected');
		socket.leave(obj.room_id);
	});
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});