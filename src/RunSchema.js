export default runSchema
///START OF RUNSCHEMA FUNCTION


 export async function runSchema(listedSchemaDict) {
      async function sendDictionaryAndProcess(listedSchemaDict) {
        try {
	  let json_string = JSON.stringify(listedSchemaDict)
          const response = await fetch('http://127.0.0.1:4269/schema_json_handler', {
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
          console.error('There was a problem running the schema through graph traversal:', error)
        }
      }
      let return_dictionary = await sendDictionaryAndProcess(listedSchemaDict);
      return(return_dictionary)
 }

export async function promptOneMessage(prompt){
    async function sendMessageAndProcess(prompt){
        try{
            let prompt_text = prompt;
            const response = await fetch('http://127.0.0.1:4269/message_json_handler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text',
                },
                body: prompt_text 
            }
            );
            if(!response.ok){
                throw new Error(`HTTP error! status ${response.status}`);
            }
            const result = await response.json();
            return result
        } catch (error) {
            console.error('There was a probelm prompting the LLM with your message:', error)
        }
    }
    let return_message = await sendMessageAndProcess(prompt);
    return(return_message)
}
