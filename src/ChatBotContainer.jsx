import { React, useState } from 'react';
import './style.css';

//import './ChatBotStyle.css';

const ChatBot= (props) => {

  const [chatInputMessage, setChatInputMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [inputText, setInputText] = useState("");
  const chatMessages = document.querySelector('.chat-messages')
    var message = {
        sender:"you",
        text:""
    }
  const chatMessageElement = (message) => `
    <div class="message usr-bg">
        <b class="message-sender">${message.sender}</b>
        <div class="message-text">${message.text}</div>
    </div>
  `

  function changeText(event) {
      setInputText(event.target.value);
  }
  function drawElement(sender, text){
        message = {
            sender: sender,
            text: text,
        }
      const new_element = chatMessageElement(message)
      chatMessages.innerHTML += new_element
  }
  function sendMessage(e) {
    e.preventDefault();
    console.log(inputText);
    drawElement("you", inputText);
    setSavedMessage(inputText);
    setInputText("");
    
  }
  function createBotMessage(text) {

  }
  function createUserMessage(text) {
  }
  return (
    <div> 
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
                    <b class="message-sender">shbot</b>
                    <div class="message-text">Welcome to GPT Flow!</div>
                </div>
                <div class="mesage usr-bg">
                    <b class="message-sender">shbot</b>
                    <div class="message-text">You can type your prompt into the input below. Outputs from the flow chart will appear here automatically.</div>
                </div>
            </div>
            <form class="chat_input">
                <input 
                    type="text" 
                    class="chat-input" 
                    onChange={changeText}
                    value={inputText}
                    required placeholder="Type here..."/>
                <button 
                    type="submit" 
                    onClick={sendMessage}
                    class="button send-button">Send</button>
            </form>
              <script src="App.tsx"></script>
            </div>
        </body>
    </div>
  );
};

export default ChatBot;
