import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Game.css';
// import ScrollToBottom from 'react-scroll-to-bottom';
import Messages from '../Messages/Messages';

let socket;

const Game = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [points, setPoints2] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const ENDPOINT = 'localhost:5000';
  
  useEffect( () =>{
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, ( error ) => {
      if (error){
        alert(error);
        window.location.href = './';
      }
    });

    return () => {
      socket.emit('disconnect');

      socket.off();
    }

  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });

    socket.on('roomData', ({ users }) => {
       setUsers(users);
    })

    return () => {
      socket.emit('disconnect');
      socket.off();
    }

  }, [messages]);

  // const sendMessage = (event) => {
  //   event.preventDefault();
  //
  //   if(message){
  //     socket.emit('sendMessage', message, () => setMessage(''));
  //   }
  // }

  const setPoints = (event) => {
    console.log('setpoints fired');
    event.preventDefault();
    socket.emit('addPoints', '1', (error) => {
      setPoints2('');
      if (error){
        if (window.confirm("You are out of points. Game over. Go to lobby?")) {
          window.location.href = './';
        }
      }
    });

    console.log('emit complete')
  }

  function backButtonPressed(e) {
    e.preventDefault();
    window.location.href = './';
  }

  return (
    <div>
    <div className="center">
      <h1>Painikepeli</h1>
      <div className="buttons">
        <button className="backButton" onClick={backButtonPressed}>🡨</button>
        <button className="gameButton" onClick={(event) => setPoints(event)}>Press this button</button>
      </div>
    </div>
    <div className="center">
      {
        users
          ? (
            <div>
              <h1>Players Online :</h1>
              <div>
                <h2>
                  {users.map(({name, points}) => (
                    <div key={name}>
                      {name} - score: {points}
                    </div>
                    // <div key={name}>
                    //   {name}
                    // </div>
                  ))}
                </h2>
              </div>
            </div>
          )
          : null
      }
    </div>
      <div className="outerContainer">
        <div className="container">
          <Messages className="messages" name={name} messages={messages} />
        </div>
      </div>
    </div>
  )
}

export default Game;
