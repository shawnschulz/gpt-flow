export default runSchema
///START OF RUNSCHEMA FUNCTION


 export async function runSchema(listedSchemaDict) {
      async function sendDictionaryAndProcess(listedSchemaDict) {
        try {
            if (JSON.stringify(listedSchemaDict).length > 5000000) {
                throw new Error('Flow json exceeds file size limit of 5 mb');
                return
            }
	  let json_string = JSON.stringify(listedSchemaDict);
          const response = await fetch('https://www.shmage.xyz/schema_json_handler', {
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

