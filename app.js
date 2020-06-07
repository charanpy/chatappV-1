const express=require("express");
const app=express();
const path = require('path')
const http = require('http');

const server=http.createServer(app);

const io=require("socket.io")(server)

const Filter=require("bad-words");


//importing time, msgs

const {generateMessage}=require("./utils/messages.js");

const {generateLocationMessage}=require("./utils/messages.js");

//importing id,username,room
const {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom}=require('./utils/users')

//including HTML

app.use(express.static('public'));

//let count=0;
/*
let greeting="welcome";


io.on('connection',function(socket){
	console.log("New user connected");



	socket.on('join',(options,callback)=>{
		//adding users

		const {error,user}=addUser({id:socket.id,...options})

		if(error){
			return callback(error)

		}
		socket.join(user.room)

		//Sending msgs from server to client

		socket.emit("greeting",generateMessage(greeting))

	//Sending msg to all except new user

	socket.broadcast.to(user.room).emit("greeting",generateMessage(`${user.username} has joined`))

	callback()

})



    //Receiving information from client

    socket.on('user',(msg,callback)=>{

    	const user=getUser(socket.id)

        //Filtering foul words

        const filter=new Filter()


        if(filter.isProfane(msg)){
        	return callback('Profanity is not allowed')
        }
        
        //Sending msg from server to client 

        io.to(user.room).emit("greeting",generateMessage(msg))
        callback()


    })

    //Receiving location from client

    socket.on("sendLocation",(coords,callback)=>{

    	const user=getUser(socket.id)


    	io.to(user.room).emit("location",generateLocation(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    	callback()
    })
    
    //Disconnect
    socket.on('disconnect', () => {
    	const user=removeUser(socket.id)
    	if(user){
    		io.to(user.room).emit("greeting",generateMessage(`${user.username} has left`))

    	}
    	

    })

})






server.listen(3000,function(){
	console.log("server started");
})
*/

io.on('connection', (socket) => {
	console.log('New WebSocket connection')

	socket.on('join', (options, callback) => {
		const { error, user } = addUser({ id: socket.id, ...options })
		console.log('user',user)
		if (error) {
			return callback(error)
		}

		socket.join(user.room)

		socket.emit('message', generateMessage('Admin', 'Welcome!'))
		socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
		io.to(user.room).emit('roomData',{
			room:user.room,
			users:getUsersInRoom(user.room)
		})
		callback()
	})

	socket.on('sendMessage', (message, callback) => {
		const user = getUser(socket.id)
		const filter = new Filter()

		if (filter.isProfane(message)) {
			return callback('Profanity is not allowed!')
		}

		io.to(user.room).emit('message', generateMessage(user.username, message))
		callback()
	})

	socket.on('sendLocation', (coords, callback) => {
		const user = getUser(socket.id)
		io.to(user.room).emit('locationMessage',generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
		callback()
	})

	socket.on('disconnect', () => {
		const user = removeUser(socket.id)

		if (user) {
			io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
			io.to(user.room).emit('roomData',{
				room:user.room,
				users:getUsersInRoom(user.room)
			})
		}

	})
})

server.listen(3000, () => {
	console.log(`Server is up on port!`)
})