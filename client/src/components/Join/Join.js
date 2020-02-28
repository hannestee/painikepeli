import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Join.css';

const Join = () => {
  const [name, setName] = useState('');
  const [setRoom] = useState('');

  return (
    <div className="center">
      <h1>Painikepeli</h1>
      <div>
        <input className="input" placeholder="Name" maxlength="15" type="text" onChange={(event) => setName(event.target.value)} />
      </div>
      <div>
        <input className="input" type="text" value="Room1 (Feature under construction)" disabled onChange={(event) => setRoom(event.target.value)} />
      </div>
      <Link onClick={e => (!name) ? e.preventDefault() : null} to={`/game?name=${name}`}>
        <button className="button" type="submit">Start</button>
      </Link>
      <p>Painikepeli is a multiplayer game where the objective is to gather points.</p>
      <p>© Hannes Tikkanen <a href="https://github.com/hannestee/">Github</a></p>
    </div>
  )
}

export default Join;
