const express = require('express');
const enableWs = require('express-ws');
const _ = require('lodash');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

const rooms = {};

app.get('/', (req, res) => {
  res.send({ response: 'I am alive' }).status(200);
});

io.on('connection', (socket) => {
  console.log('New client connected');

  addUserToRoom(socket);
  onUpdate(socket);
  userHasLeftTheRoom(socket);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const onUpdate = (socket) => {
  socket.on('update', (update) => {
    let room = rooms[update.roomId];
    // console.log('update', update);

    room = update;

    io.emit('remote-update', room);
  });
};

const addUserToRoom = (socket) => {
  socket.on('newUser', ({ roomId, name, resources, userId }) => {
    // Create room if it does not exists
    let room = rooms[roomId];

    // check if room exists
    if (!room) {
      rooms[roomId] = {};
      room = rooms[roomId];
      room.users = [];
    }

    // Add user to the room
    room.users.push({ name, roomId, userId, ...resources });

    room.roomId = roomId;

    io.emit('remote-update', room);
  });

  socket.on('setActivePlayer', ({ activePlayerId }) => {
    // console.log({activePlayerId});
    io.emit('activePlayer', activePlayerId);
  });
};

const userHasLeftTheRoom = (socket) => {
  socket.on('userLeft', ({ userId, roomname }) => {
    console.log({ userId, roomname });
    // remove room
  });
};

server.listen(process.env.PORT || 3001, () => {
  console.log(`EXPRESS APP LISTENING AT http://localhost:${process.env.PORT || 3001}`);
});
