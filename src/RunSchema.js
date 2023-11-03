import ActionProvider from './bot/ActionProvider'

///START OF RUNSCHEMA FUNCTION


// The new plan is to refactor this entire thing FUUUUUUUUUuCK
// when we refactor just start with the non loop cases and don't worry about implementing loop cases yet
 async function runSchema(listedSchemaDict) {
      async function sendDictionaryAndProcess(listedSchemaDict) {
        try {
          const response = await fetch('http://127.0.0.1:4269/schema_json_handler', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: listedSchemaDict
          }
          );
          if(!response.ok) {
            throw new Error('HTTP error! status ${response.status}');
          }
          const result = await response.json();
          return result;
        } catch (error) {
          console.error('There was a problem running the schema through graph traversal:', error)
        }
      }
      sendDictionaryAndProcess(listedSchemaDict).then(
        //This promise is absolutely disgusting, but I messed up the recursive logic so it's the only way to
        //only do execution once we get the LLM output
        async processedData => {
	  return(processedData)
	})
 }
