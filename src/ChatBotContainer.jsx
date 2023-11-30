import React from 'react';
import './ChatBotStyle.css';

const ChatBot= (props) => {

  return (
    <div className =    {`message ${messageClass}`}>
        <head>
            <meta charSet='UTF-8'/>
            <meta name = 'viewport' content="width=device-width, initial-scale=1.0"/>
            <title> GPT-Flow </title>
            <link rel='stylesheet' href="style.css" />
        </head>
        <body>
            <div class="chat-container"> 
                <h2 class="chat-header">GPT-flow chatbot...</h2>
            <div class="chat-messages">
                <div class="message usr-bg">
                    <div class="message-sender">You</div>
                    <div class="message-text">Default</div>
                </div>
                <div class="bot usr-bg">
                    <div class="bot-sender">You</div>
                    <div class="bot-text">Default</div>
                </div>
            </div>
            </div>
        </body>
    </div>
  );
};

export default ChatBot;
