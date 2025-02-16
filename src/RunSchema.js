export default runSchema
///START OF RUNSCHEMA FUNCTION


 export async function runSchema(listedSchemaDict) {
      async function sendDictionaryAndProcess(listedSchemaDict) {
        try {
	  let json_string = JSON.stringify(listedSchemaDict)
          const response = await fetch('http://10.8.0.2:4269/schema_json_handler', {
            method: 'POST',
            cache: "no-store",
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

