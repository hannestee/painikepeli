import React from 'react';

import './Message.css';

const Message = ({ message: { user, text}, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
    ? (
      <div className="messageContainer justifyEnd">
        <p className="sentText pr-10">{trimmedName}</p>
        <div className="messageBox backgroundBlue">
          <p className="messageText colorWhite">{text}</p>
        </div>
      </div>
      //true
    )
    : (
      <div className="messageContainer justifyStart">
      <p className="sentText pl-10">{user}</p>
        <div className="messageBox backgroundLight">
          <p className="messageText colorDark">{text}</p>
        </div>
      </div>
    )
  )
}



export default Message;
