import axios from 'axios'

///START OF RUNSCHEMA FUNCTION
 function runSchema(listedSchemaDict, nextNodeInLoop = "start", receivedInput = "", divergingLoopStack = [], seenNodes = [], contextDict = {}) {
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

      //basic functions:
      //take text and context dict and use fetch to send it to backend to run on llm
      // get the return from fetch, take that and update the context dict
      // also take output and send to chatbot message as output
      // this function should also be called to ask the chatbot questions directly,
      // should be able to just import from this file in App.tsx

      //this will return an ARRAY, the first element will be the output string and the second element will be a context object
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

      let newDict = {}
      Object.assign(newDict, schemaDict)
      for (let idIndex in edgeIdList){
        let edgeIdToRemove = edgeIdList[idIndex]
        for (let edgeKey in newDict['edges']){
          console.log(edgeKey)
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

      function checkNumber(c){
        if (c >= '0' && c <= '9'){
          return(true)
        }
        else{
          return(false)
        }
      }


      if (Object.keys(dictionary).includes(id)) {
        console.log(checkNumber(id.slice(-1)))
        if ( checkNumber(id.slice(-1)) ){
          let newId = id.slice(0, -1).concat((parseInt(id.slice(-1)) + 1).toString())
          console.log(newId)
          return(newId)
        }
        else{
          let newId = id + "_1"
          return(newId)
        }
      }
      return(id)
    }

    function retrieveNodePrompt(nodeId, schemaDict){
      // Retrieve the prompt mapping to a node by traversing list of nodes
      for ( let nodeKey in schemaDict['nodes']) {
        let node = schemaDict['nodes'][nodeKey]
        if (node['id'] == nodeId){
          return(node['data']['prompt'])
        }
      }
    }

    var schemaDict = dictionaryify(listedSchemaDict)
    
    ///START OF GRAPH TRAVERSAAL
    ///Please make the logic behind graph traversal more readable than
    ///in the python script

    //define some objects for later
    console.log("DEBUG: defining objects for later")
    let roots = findRoots(schemaDict)
    nodeToSendOutputs = {}
    let nextSchemaDictionary = {}
    Object.assign(nextSchemaDictionary, schemaDict)
    let orphanedNodes = findOrphanedNodes(schemaDict).filter(x => !seenNodes.includes(x));
    console.log("DEBUG: checking orphaned Nodes that weren't seen, double check that seen nodes aren't included")
    console.log(orphanedNodes)
    console.log(seenNodes)

    //Base case: Check if schema dictionary has no roots
    if (roots.length == 0 && orphanedNodes.length == 0 && Object.keys(schemaDict['edges']).length == 0) {
      console.log("DEBUG: no roots, orphaned nodes or edges. Exiting.")
      return(schemaDict)
    }
    
      //Special case: graph is a loop
      if (roots.length == 0 && orphanedNodes.lenght == 0 ){
        //another check to make sure graph isn't just lacking edges altogether
        console.log("DEBUG: we are starting the checks before loop case. Here's the node we are checking:")
        console.log(nextNodeInLoop)
        if (!schemaDictionary['edges']){
          return(schemaDict)
        }
        //LOOP CASE PROPER: enters this else if schema isn't just all orphaned
        else {
          //if we have just started, find a node to start on that's in the loop
          if ( nextNodeInLoop == "start"){
            for (nodeKey in schemaDict['nodes']){
              let node = schemaDict['nodes'][nodeKey]
              if ( checkLoop(node['id'], schemaDict)){
                let currentNode = node['id']
                console.log("DEBUG: printing current node checking if in loop")
                break
              }
              else{
                console.log("DEBUG: Node just checked is a terminal branch, skipping to find start node!")
              }

            }
          }
          else{
            let currentNode = nextNodeInLoop
          }
        //In the future may want to change the way script combines received inputs
        //Now that have where to start, start running the loop case

        //Start by running the initial node
        let nodePrompt = receivedInput.concat(retrieveNodePrompt(currentNode, schemaDict))
        console.log("DEBUG: the current node prompt is: ")
        console.log(nodePrompt)
        //this function call should handle outputting hte message to the chatbot
        let LLMRecord = runAPILLM(nodePrompt, contextDict)
        let output = LLMRecord[0]
        let contextDict = LLMRecord[1]
        let nextReceivedInput = output.concat(" ")
        for (let edgKey in nextSchemaDictionary['edges']){
          let edge = nextSchemaDictionary['edges'][edgeKey]
          if (edge['source'] == currentNode){
            edgeID = edge["id"]
            nodeToSendOutputs[edge['target']] = output
            console.log("DEBUG: next nodes are:")
            console.log(nodeToSendOutputs)
          }
        let nextLoops = []
        let nextTerminal = []
        }
        //this is convoluted but need tofigure out where to send output to
        for ( let nodeID in nodeToSendOutputs){
          console.log("DEBUG: The Node ID is:")
          console.log(nodeID)
          console.log("DEBUG: check loop is:")
          console.log(checkLoop(nodeID,schemaDict))

          if (checkLoop(nodeID, schemaDict)){
            nextLoops.push(nodeID)
            console.log("DEBUG: Added to next loop")
            console.log(nextLoops)
          }

          if(checkIsTerminalBranchNode(nodeID, schemaDict)){
            nextTerminal.push(nodeID)
            console.log("DEBUG: Added to next terminal")
          }
        }  
        //if the next node is terminal, simply do the next node
        for (let i in nextTerminal){
          console.log("In terminal")
          console.log(nextTerminal[i])
          runSchema(schemaDict, nextNodeInLoop=nextTerminal[i], receivedInput=nextReceivedInput, divergingLoopStack=divergingLoopStack)
        }
        //if the next node is a part of a loop and there is only one next loop, that means
        // we don't have a diverging loop and can also simply run the next node
        if (nextLoops.length == 1){
          console.log("Detected next loop as length 1")
          runSchema(schemaDict, nextNodeInLoop=nextLoops[0],receivedInput=nextReceivedInput,divergingLoopStack=divergingLoopStack)
        } 
        //END OF NON DIVERGING LOOP CASE

        //DIVERGING LOOP CASE PROPER
        else if (nextLoops.length > 1){
          //want to ensure run different diverging loops in order
          if (divergingLoopStack.length == 0){
            // first time seeing diverging loop, make queued loops the loop stack
            runSchema(schemaDict, nextNodeInLoop=nextLoops[0], receivedInput=nextReceivedInput, divergingLoopStack=nextLoops)
          }
          else if (divergingLoopStack.length > 0){
            //need to check if set in nextloops and diverging
            const eqSet = (set1, set2) =>
              set1.size === set2.size &&
              [...set1].every((x) => set2.has(x));

            if(!eqSet(Set(nextLoops), Set(divergingLoopStack))){
              divergingLoopStack = nextLoops
              runSchema(schemaDict, nextNodeInLoop=divergingLoopStack[0], receivedInput=nextReceivedInput, divergingLoopStack=divergingLoopStack)
            }
            else if (eqSet(Set(nextLoops), Set(divergingLoopStack))){
              //following line should hopefully put first element to last position
              divergingLoopStack.push(divergingLoopStack.shift())
              console.log("DEBUG: New diverging loop stack is:")
              console.log(divergingLoopStack)
              runSchema(schemaDict, nextNodeInLoop=divergingLoopStack[0], receivedInput=nextReceivedInput, divergingLoopStack=divergingLoopStack, contextDict=contextDict)
            }
          }
        }
        }
      }
    //Recursive case: Schema dictionary has roots
      else {
        //Recursive case: Schema dictionary has roots. Get the outputs from the source node, make 
        //an updated schema dictionary where target nodes have the new outputs, and remove
        //the edges that have already been checked
        console.log("DEBUG: We are doing the tree case")
        let edgeIdToRemove=[]
        roots = roots.concat(orphanedNodes)
        let newSeenNodes = seenNodes
        for (let i in roots){
          let root = roots[i]
          for (let edgeKey in nextSchemaDictionary['edges']){
            let edge = nextSchemaDictionary['edges'][edgeKey]
            if (edge['source']==root){
              edgeIdToRemove.push(edge['id'])
              nodeToSendOutputs[edge['target']] = ""
              console.log("DEBUG: recursive case printing the next nodes")
              console.log(nodeToSendOutputs)
              console.log("Printing the edges to be removed")
              console.log(edgeIdToRemove)
              console.log("Printing new seen nodes")
              console.log(newSeenNodes)
            }
          }
          let LLMRecord = runAPILLM(root, nextSchemaDictionary, contextDict)
          newSeenNodes.push(root)

          //construct dictionary of nodes and outputs being sent to them
          // may need to enforce checking of key existencee
          for (let nodeIDKey in nodeToSendOutputs){
            nodeToSendOutputs[nodeIDKey] = output
          }
          //in the future may want to change way script handles combining prompts
          let updatedPromptsDict = updateNodePrompts(nodeToSendOutputs, schemaDict)
          nextSchemaDictionary= removeEdgeIDs(edgeIdToRemove, updatedPromptsDict)

        }
       return(runSchema(nextSchemaDictionary, seenNodes=newSeenNodes, contextDict=contextDict))
      }
 }
///END OF RUNSCHEMA FUNCTION
export default runSchema
/////
