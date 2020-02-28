const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const points = 20;
let roomPoints = 0;

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room:'Room1', points });

    if(error) return callback(error);

    socket.emit('message', { user: 'GM: ', text: `${user.name}, with ${user.points} points has joined the game.` });
    //socket.emit('message', { user: 'GM: ', text: `${user.name}, with ${user.points} points has joined the game. Room has: ${roomPoints} points!`
    socket.broadcast.to(user.room).emit('message', {user: 'GM: ', text: `${user.name}, has joined!`})

    socket.join(user.room);

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    socket.emit('message', { user: 'GM: ', text: `Room has: ${roomPoints} points!` });

    callback();
  });

  socket.on('addPoints', (amount, callback ) => {
    const user = getUser(socket.id);
    console.log(user.points);
    if (user.points > 0){
    user.points -= 1;
    roomPoints += 1;
    if (roomPoints % 500 == 0){
      user.points += 250;
      io.to(user.room).emit('message', { user: 'GM: ', text: `${user.name} has won 250 points.`});
      io.to(user.id).emit('message', { user: 'GM: ', text: `You have won 250 points`});
      io.to(user.id).emit('message', { user: 'GM: ', text: `You have ${user.points} points`});
    } else if (roomPoints % 100 == 0){
      user.points += 40;
      io.to(user.room).emit('message', { user: 'GM: ', text: `${user.name} has won 40 points.`});
      io.to(user.id).emit('message', { user: 'GM: ', text: `You have won 40 points`});
      io.to(user.id).emit('message', { user: 'GM: ', text: `You have ${user.points} points`});
    } else if (roomPoints % 10 == 0){
      user.points += 5;
      io.to(user.room).emit('message', { user: 'GM: ', text: `${user.name} has won 5 points.`});
      io.to(user.id).emit('message', { user: 'GM: ', text: `You have won 5 points. You now have ${user.points} points`});
    } else {
      const remainder10 = 10 - (roomPoints % 10);
      const remainder100 = 100 - (roomPoints % 100);
      const remainder500 = 500 - (roomPoints % 500);

      if (remainder500 == remainder10){
        //io.to(user.room).emit('message', { user: 'GM: ', text: `${remainder500} presses left for 250 point win`});
        io.to(user.id).emit('message', { user: 'GM: ', text: `${remainder500} presses left for 250 point win`});
      } else if (remainder100 == remainder10) {
        //io.to(user.room).emit('message', { user: 'GM: ', text: `${remainder100} presses left for 40 point win`});
        io.to(user.id).emit('message', { user: 'GM: ', text: `${remainder100} presses left for 40 point win`});
      } else {
        //io.to(user.room).emit('message', { user: 'GM: ', text: `${remainder10} presses left for 5 point win`});
        io.to(user.id).emit('message', { user: 'GM: ', text: `${remainder10} presses left for 5 point win`});
      }
      // if (remainder500 <= remainder100){
      //   io.to(user.room).emit('message', { user: 'GM: ', text: `${remainder500} presses left for 250 point win`});
      // } else if (remainder100 <= remainder10) {
      //   io.to(user.room).emit('message', { user: 'GM: ', text: `${remainder100} presses left for 40 point win`});
      // } else {
      //   io.to(user.room).emit('message', { user: 'GM: ', text: `${remainder10} presses left for 5 point win`});
      // }
      console.log ("Painallusten määrä arvoon 10:" + (remainder10));
      console.log ("Painallusten määrä arvoon 100:" + (remainder100));
      console.log ("Painallusten määrä arvoon 500:" + (remainder500));
    }

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    console.log(user.points);
  } else {
    const error = true;
    return callback(error);
  }
    callback();
  });

  socket.on('disconnect', () =>{
    console.log('User has left');
    const user = removeUser(socket.id);

    if (user){
      io.to(user.room).emit('message', { user: 'GM: ', text: `${user.name} has left with ${user.points} points.`})
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  });
});

app.use(router);
app.use(cors());

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
