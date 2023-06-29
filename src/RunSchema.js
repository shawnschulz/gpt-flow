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
      let stack = [];
      for (let nodeKey in schemaDict['nodes']){
        let node = schemaDict['nodes'][nodeKey]
        stack.push(node['id'])
        console.log(stack)
        for (let edgeKey in schemaDict['edges']){
          let edge = schemaDict['edges'][edgeKey]
          if (edge['source'] == node['id'] || edge['target'] == node['id']){
            let index = stack.indexOf(node['id'])
            if (index > -1){
              stack.splice(index, 1)
            }
            break;
          }
        }
      }
      return(stack)
    }
    
    function checkBranch(nodeID, schemaDict){
      //check if a node ever results in a terminal branch
      // i think we don't use this and use checkIsTerminal instead
      if (Object.keys(schemaDict['edges']).length == 0) {
        //there are no edges at all 
        return false
      }

      for (let edgeKey in schemaDict['edges']){
        
        let edge = schemaDict['edges'][edgeKey]
        
        if (edge['source'] == nodeID ){
          return false
        }
        else if (edge['target'] == nodeID) {
          return true
        }
        else{
          return false
        }
      }
    }
    
    function checkIsTerminalBranchNode(nodeID, schemaDict){
      //check if a node is the end of a branch
      let final_value = false
      let orphanedNodes = findOrphanedNodes(schemaDict)
      for (let edgeKey in schemaDict['edges']){
        let edge = schemaDict['edges'][edgeKey]
        if (edge['source'] == nodeID || orphanedNodes.includes(nodeID)){
          //if node is a source or is orphaned, it's not a terminal branch
          final_value = false
        }
        else {
          //i think it's true in all other cases?
          final_value = true
        }
      }
      return(final_value)
    }
    
    function checkLoop(nodeID, schemaDict, truthList = [], seen = []){
      //Recursively checks if following a node's targets only results in a terminal branch, returns record of (bool, list)
      //bool is True if the graph is a loop
      let targetList = []
      
      if (seen.includes(nodeID)){
          return true
      }
      else{
        seen.push(nodeID)
        console.log("DEBUG: seen is:")
        console.log(seen)
        for (let edgeKey in schemaDict['edges']){
          let edge = schemaDict['edges'][edgeKey]
          if (edge['source'] == nodeID) {
            targetList.push(edge['target'])
          }
          else {
            truthList.push(false)
          }
        }
        //Note: always remember javascript loops by iterator # not the value in the array!
        for (let targetIndex in targetList){
          let target = targetList[targetIndex]
          console.log("DEBUG: target is:")
          console.log(target)
          truthList.push(checkLoop(target, schemaDict, truthList, seen=seen))
          console.log("(DEBUG) checkLoop: printing truthlist")
          console.log(truthList) 
          console.log("DEBUG: checking targetList")
          console.log(targetList)
          return(truthList.includes(true))
        }
      }
      return(truthList.includes(true))
    }
    
    function updateNodePrompts(nodePromptDictionary, schemaDict){
      //Takes a mapping of node id's to a prompt to map to it, makes a copy of
      //schema dictionary with the updated prompts and returns it
      let newDict = {}
      Object.assign(newDict, schemaDict)
      for (let nodeKey in newDict['nodes']){
        let node = newDict['nodes'][nodeKey]
        if (Object.keys(nodePromptDictionary).includes(node['id'])){
          let oldPrompt = node['data']['prompt']
          let newPrompt = nodePromptDictionary[node['id']].concat(' \n', oldPrompt)
          newDict['nodes'][nodeKey]['data']['prompt'] = newPrompt
        }
      }
      console.log("DEBUG: the dictionary with updated prompts is:")
      console.log(newDict)
      return(newDict)
    }

    function removeNodeIds(nodeIdList, schemaDict){
      // Takes a list of nodes to be removed by ID and returns a new dictionary
      // with the id's removed

      
      let newDict = {}
      Object.assign(newDict, schemaDict)
      for (let idIndex in nodeIdList) {
        let id = nodeIdList[idIndex]
        for (let nodeKey in newDict['nodes']){
          let node = newDict['nodes'][nodeKey]
          if (node['id'] == id){
            delete newDict['nodes'][nodeKey]
          }
        }
      }
      console.log("DEBUG: the dictionary with updated nodes is:")
      console.log(newDict)
      return(newDict)
    }

    function removeEdgeIDs(edgeIdList, schemaDict){
      //Takes a list of edges to be removed by ID and returns a new dictionary
      // with the id's removed

      //removeEdgeIds currently not working
      let newDict = {}
      Object.assign(newDict, schemaDict)
      for (let idIndex in edgeIdList){
        let edgeIdToRemove = edgeIdList[idIndex]
        for (edgeKey in newDict['edges']){
          let edge = newDict['edges']['edgeKey']
          if (edgeKey == edgeIdToRemove){
            delete newDict['edges'][edgeKey]
          }
        }
      }
      return(newDict)
    }

    function enforceDictUniqueID(id, dictionary){
      // takes a dictionary and an id, returns the id of the id does not appear
      // in the keys of dictionary, returns id with a tail end number if it does   
    }

    function retrieveNodePrompt(id, schemaDict){
      // Retrieve the prompt mapping to a node by traversing list of nodes
    }

    var schemaDict = dictionaryify(listedSchemaDict)
    return(removeNodeIds(["reactflow__edge-Executivebottom-Programmertop"], schemaDict))
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
