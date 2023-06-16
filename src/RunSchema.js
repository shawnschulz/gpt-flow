import axios from 'axios'

///START OF RUNSCHEMA FUNCTION
 function runSchema(listedSchemaDict) {
    console.log("inside runSchema")
    console.log(listedSchemaDict)
    //This will be a very large function that runs clientside, traversing graph with correct logic for loops
    //Should do an api call to ask for LLM output when needed
    // I am way too lazy but this whole funciton really should be in
    // another javascript file and imported

    //if performance is rlly bad may want to convert nodes/edges to a dictionary first
    
    ///START OF Helper functions of runSchema
    function runAPILLM(text, ){
      // eventually want to make database so users can login and access
      // saved context from a JSON database, but to save time for now
      // just uses a smaller context that is removed whem webpage reloaded

      //Calls API using fetch, the return it gets from the API should be 
      //outputted to the chatbot messenger bot thingie somehow and also
      //stored into a context dictionary
      axios.post('http://127.0.0.1:4269/schema_json_handler', schema)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    function schemaListToDictionary(schemaList) {
      console.log("running schemaListToDictionary")
      let newDict={};
      for (let dict_i = 0; dict_i < schemaList.length; dict_i++){
          newDict[schemaList[dict_i]['id']] = schemaList[dict_i]
      }
      return newDict;
    }

    function dictionaryify(schemaDict){
      // takes the schema and converts it from one where the nodes and edges
      // are stored in a list of dictionaries and instead makes it a 
      // dictionary, where each key is the id and the value is the dictionary
      // with information 
      // using this at the beginning should allow us to make much simpler
      // code for our helper functions
      console.log("running dictionaryify")
      let newDict = {'nodes':{}, 'edges':{}}
      let nodesDict = schemaListToDictionary(schemaDict['nodes'])
      let edgesDict = schemaListToDictionary(schemaDict['edges'])
      newDict['nodes'] = nodesDict
      newDict['edges'] = edgesDict
      console.log(newDict)
      return newDict
    }

    function findRoots(schemaDict){
      // Finds the roots of the schema
      // note that our schemaDict is expected to have been converted to have
      // ID lookupable nodes and edge nested dictionaries
      let stack = [];
      for (let edgeKey in schemaDict['edges']){
        if (  !(stack.includes(schemaDict['edges'][edgeKey]['source'])) ){
          
          stack.push(schemaDict['edges'][edgeKey]['source'])
          console.log(stack)
        }
      }
      for (let edgeKey in schemaDict['edges']){
        if (stack.includes(schemaDict['edges'][edgeKey]['target'])){
          console.log("(DEBUG) findRoots: Removing edge from stack")
          console.log(edgeKey)
          let index = stack.indexOf(schemaDict['edges'][edgeKey]['target'])
          if (index > -1){
            stack.splice(index, 1)
          }
          console.log("(DEBUG) findRoots: printing stack")
          console.log(stack)
        }
      }
      return(stack)
    }
    
    function findOrphanedNodes(schemaDict){
      //finds nodes without edges
    }
    
    function checkBranch(nodeID, schemaDict){
      //check if a node ever results in a terminal branch
    }
    
    function checkIsTerminalBranchNode(nodeID, schemaDict){
      //check if a node is the end of a branch
    }
    
    function checkLoop(nodeID, schemaDict, truthList, seen){
      //Recursively checks if following a node's targets only results in a terminal branch, returns record of (bool, list)
      //bool is True if the graph is a loop
    }
    
    function updateNodePrompts(nodePromptDictionary, schemaDict){
      //Takes a mapping of node id's to a prompt to map to it, makes a copy of
      //schema dictionary with the updated prompts and returns it
    }

    function removeNodeIds(nodeIdList, schemaDict){
      // Takes a list of nodes to be removed by ID and returns a new dictionary
      // with the id's removed
    }

    function removeEdgeIDs(edgeIdList, schemaDict){
      //Takes a list of edges to be removed by ID and returns a new dictionary
      // with the id's removed

    }

    function enforceDictUniqueID(id, dictionary){
      // takes a dictionary and an id, returns the id of the id does not appear
      // in the keys of dictionary, returns id with a tail end number if it does   
    }

    function retrieveNodePrompt(id, schemaDict){
      // Retrieve the prompt mapping to a node by traversing list of nodes
    }

    var schemaDict = dictionaryify(listedSchemaDict)
    return(findRoots(schemaDict))
    ///START OF GRAPH TRAVERSAAL
    ///Please make the logic behind graph traversal more readable than
    ///in the python script

    //Base case: Check if schema dictionary has no roots

      //Special case: graph is a loop

          //Special case: loops diverge
    
    //Recursive case: Schema dictionary has roots
 }
///END OF RUNSCHEMA FUNCTION
export default runSchema
/////
