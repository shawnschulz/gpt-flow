import { promptOneMessage } from "../RunSchema";

class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

    // When message entered, need to get value by calling promptOneMessage from RunSchema, awaiting for the result,
        // then use actionprovider to render the message
  parse(message) {

    const llmOutput = promptOneMessage(message)
    this.actionProvider.outputText(llmOutput)

  }
}


export default MessageParser;
