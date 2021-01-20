const express = require('express');
const enableWs = require('express-ws');
const _ = require('lodash');

const app = express();
enableWs(app);

// object to manage rooms
// each room has a users array of active users
const rooms = {};
app.ws('/websocket', (ws, req) => {
  ws.on('message', function incoming(message) {
    console.log('RECEIVED DATA IN SERVER: ', message);
    const {name, roomId, roomData, gameData, id} = JSON.parse(message);
    // create room if not existing
    if (!rooms[roomId]) {
      rooms[roomId] = { users: [] };
      console.log(`Room created: ${roomId}`);
    }
    
    const room = rooms[roomId];
    let user = room.users.find(user => user.name === name);
    // add user if not in room
    if (!user) {
      user = { name, ws, gameData, roomId, id };
      room.users.push(user);
      console.log(`User added to room: ${name} ${roomId}`);
      console.log(`User id: ${id}`);

      // send user all other users
      console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
      console.log(room.users.map(u => _.omit(u, 'ws')))
      console.log(room);
      console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
      ws.send(JSON.stringify({users: room.users.map(u => _.omit(u, 'ws'))}));
    }

    // if (room) {
    //   console.log('HELLLLLLLLLO?');
    //   console.log(room.users.map(u => _.omit(u, 'ws')))
    //   ws.send(JSON.stringify({...room, users: room.users.map(u => _.omit(u, 'ws'))}));
    // }


    // update user
    Object.assign(user, _.omit(JSON.parse(message), 'roomData'));
    // update room
    if (roomData) Object.assign(room, {...roomData, updateFrom: _.omit(user, 'ws')});

    // broadcast current user change
    room.users.forEach((user) => {
      if (user.name !== name) {
        user.ws.send(message);
        // send room data if room was changed
        if (roomData) user.ws.send(JSON.stringify({...room, users: room.users.map(u => _.omit(u, 'ws'))}));
      }
    });
  });

  // user disconnect
  ws.on('close', function close() {
    // find disconnected user
    const roomEntry = Object.entries(rooms).find(([roomName, room]) => room.users.find(user => user.ws === ws));
    if (!roomEntry) return console.log('User disconnected: UNKNOWN');
    const room = roomEntry[1];

    const user = room.users.find(user => user.ws === ws);
    room.users.splice(room.users.indexOf(user), 1);
    console.log(`User disconnected: ${user.name}`);

    // broadcast disconnected user
    room.users.forEach((remoteUser) => remoteUser.ws.send(JSON.stringify({name: user.name, disconnected: true }))); // broadcast user disconnect
  });

  // new user connected
  console.log('User connected');
});

app.use('/', express.static('client'));
app.listen((process.env.PORT || 3001), () => {
  console.log(`EXPRESS APP LISTENING AT http://localhost:${(process.env.PORT || 3001)}`);
});