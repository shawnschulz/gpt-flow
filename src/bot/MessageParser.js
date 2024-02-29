class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
    this.promptOneMessage = promptOneMessage
  }

    // When message entered, need to get value by calling promptOneMessage from RunSchema, awaiting for the result,
        // then use actionprovider to render the message
  parse(message) {

    let promptDict = {'prompt':message}
    promptOneMessage(promptDict).then(res => this.actionProvider.outputText(res))


  }
}

 export async function promptOneMessage(listedSchemaDict) {
      async function sendDictionaryAndProcess(listedSchemaDict) {
        try {
	  let json_string = JSON.stringify(listedSchemaDict)
          const response = await fetch('http://127.0.0.1:4269/message_json_handler', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: json_string
          }
          );
          if(!response.ok) {
            throw new Error(`HTTP error! status ${response.status}`);
          }
          const result = await response.json();
          return result;
        } catch (error) {
          console.error('There was a problem running the schema through graph traversal: ', error)
        }
      }
      let return_dictionary = await sendDictionaryAndProcess(listedSchemaDict);
     console.log("Prompting successful, here was the result: " + return_dictionary["Response"])
      return(return_dictionary["Response"])
 }

export default MessageParser;
