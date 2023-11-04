class ActionProvider {
   constructor(
    createChatBotMessage,
    setStateFunc,
    createClientMessage,
    stateRef,
    createCustomMessage,
    ...rest
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
    this.createCustomMessage = createCustomMessage;
  }

  outputText = (text) => {
    const message = this.createChatBotMessage(text)
    this.addMessageToState(message)
  }
  
  addMessageToState = (message) => {
      this.setState(prevState => ({
          ...prevState,
          messages: [...prevState.messages, message],
      }));
  };

}
export default ActionProvider;
