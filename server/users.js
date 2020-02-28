const users = [];
const disconnectedUsers = [];

const addUser = ({ id, name, room, points }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  // console.log(disconnectedUsers);
  const existingUser = users.find((user) => user.room === room && user.name === name);

  if (existingUser || name === 'gm') {
    console.log("existing user")
    return { error: 'Username is taken' };
  }
  if (disconnectedUsers.length !== 0){
    const existingDcUser = disconnectedUsers.find((user) => user.room === room && user.name === name);

    if (existingDcUser) {
      //console.log("existing disconnected user: " + JSON.stringify(existingDcUser));
      //console.log(existingDcUser.points);
      // const user = { id: existingDcUser.id, name: existingDcUser.name, room: existingDcUser.room, points: existingDcUser.points };
      const user = { id: id, name: existingDcUser.name, room: existingDcUser.room, points: existingDcUser.points };
      //console.log(JSON.stringify(disconnectedUsers));
      users.push(user);
      const index = disconnectedUsers.findIndex((existingDcUser) => existingDcUser.name === name);
      console.log(index);
      if(index !== -1) {
        disconnectedUsers.splice(index, 1)[0];
      }
      return { user };
    }
  }
  const user = { id, name, room, points };

  users.push(user);

  return { user };
}

const removeUser = (id) => {
  let dcUser;
  const index = users.findIndex((user) => user.id === id);
  users.findIndex((user) => {
    dcUser = user;
  });
  //console.log(dcUser);
  disconnectedUsers.push(dcUser);
  //console.log(index);
  if(index !== -1) {
    return users.splice(index, 1)[0];
  }
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom};
