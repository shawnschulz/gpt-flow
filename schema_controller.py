# %%
#from transformers import pipeline
from optparse import OptionParser
#from transformers import AutoModelForCausalLM, AutoTokenizer
import os
import json
import sys
from llama_cpp import Llama
# %%
#only thing left to do is receive this json file as an input from the server and make sure
#running the LLM works :), will eventually want to add some other options for LLMs to run
#and also listen for that input.
json_path="/home/shawn/Downloads/lotr.json"

with open(json_path) as json_file:
    schema_dictionary = json.load(json_file)

def ask_lora(prompt):
    path_to_model= "/home/shawn/Programming/ai_stuff/llama.cpp/models/30B/ggml-model-q4_0.bin" 
    llm = Llama(model_path=path_to_model)
    output = llm("Instruction: " + prompt + "Output: ", stop=['Instruction'], max_tokens=200, echo=True)
    print("DEBUG: the output of ask-lora before subsetting is:")
    print(output)
    response = output["choices"][0]["text"].split("Output: ",1)[1]
    #save the model again (this could either be extremely important or useless idk lol)
    #f2 = open(memory_dir + 'dataset.json', 'r+b')
    #f2.write(bytes(str(output), 'utf-8'))
    print(response)
    return(response)
# %%
### Should probably update this to use a python class, so that when we add new node types
### we can reuse some methods without having to minor edits to make them compatible with
### new node types. This is okay for now tho, since that will require thinking some new logic for
### how the schema deals with sending outputs of nodes to nodes of different types

# %%
def schemaListToDictionary(schemaList):
    '''
        Takes nodes or edges list and makes a dictionary you can index list elements using the ID, probably
        only worth running this function if you have a really big graph you need to access nodes or edges of
        many times, but this option is available for that
    '''
    newDict={}
    for dictionary in schemaList:
        newDict[dictionary['id']] = dictionary.copy()
    return newDict

def hashedMappedSchemaDictionary(schema_dictionary):
    '''
        Take a whole schema dictionary and return a version that now has ID key'd nested dictionaries
        rather than lists
    '''
    newDict={'nodes':{}, 'edges':{}}
    nodesDict = schemaListToDictionary(schema_dictionary['nodes'])
    edgesDict = schemaListToDictionary(schema_dictionary['edges'])
    newDict['nodes'] = nodesDict
    newDict['edges'] = edgesDict
    return newDict

# %%
def findRoots(schema_dictionary):
    '''
        Finds the roots of a schema
        1. Get all the ids of all nodes, put in a stack
        2. Check what targets are currently in the schema
        3. Remove them as you find them

        Give schema dictionary (direct from json file), a dictionary
        Returns the stack of roots of the tree, False if schema nodes have no sources
    '''
    stack = []
    for edge in schema_dictionary['edges']:
        if edge['source'] not in stack:
            stack.append(edge['source'])
    for edge in schema_dictionary['edges']:
        if edge['target'] in stack:
            print("removing from stack")
            stack.remove(edge['target'])
    return stack

def findOrphanedNodes(schema_dictionary):
    '''
        finds nodes without edges, please track nodes that have already been run that are orphaned
    '''
    stack = []
    for node in schema_dictionary['nodes']:
        stack.append(node['id'])
        for edge in schema_dictionary['edges']:
            if edge['source'] == node['id'] or edge['target'] == node['id']:
                stack.remove(node['id'])
                break
    return(stack)

def checkBranch(node_id, schema_dictionary):
    '''
        Check if a node ever results in a terminal branch
    '''
    for node in schema_dictionary['nodes']:
        if node['id'] == node_id:
            for edge in schema_dictionary['edges']:
                if edge['source'] == node_id:
                    return False
                else:
                    return True
def checkIsTerminalBranchNode(node_id, schema_dictionary):
    final_value = False
    for edge in schema_dictionary['edges']:
        print('edge source is: ' + edge['source'])
        if edge['source'] == node_id and edge['id'] == node_id:
            final_value = False
        elif edge['source'] != node_id and edge['id'] == node_id:
            final_value = True
    return final_value

def checkLoop(node_id, schema_dictionary, truth_list = [], seen=[]):
    '''
        Recursively checks if following a node's targets only results in a terminal branch,
        returns a tuple of (bool, list), first part is True 
    '''
    target_list=[]
    if node_id in seen:
        return True
    else:
        seen.append(node_id)
        for edge in schema_dictionary['edges']:
            if edge['source']==node_id:
                target_list.append(edge['target'])
            else:
                truth_list.append(False)
        for target in target_list:
            truth_list.append(checkLoop(target, schema_dictionary, truth_list, seen=seen))
            print(truth_list)
            return bool(sum(truth_list))
    return(bool(sum(truth_list)))

        


# %%
def updateNodePrompts(node_prompt_dictionary, schema_dictionary):
    '''
        Takes a 
    '''
    new_dictionary = schema_dictionary.copy()
    for node in new_dictionary['nodes']:
        if node['id'] in node_prompt_dictionary.keys():
            old_prompt = node['data']['prompt'] 
            new_prompt = node_prompt_dictionary[node['id']] + ' \n' + old_prompt
            node['data']['prompt'] = new_prompt
    return(new_dictionary)
    
            

# %%
def removeNodeIDs(id_list, schema_dictionary):
    '''
        Takes a list of id's to be removed and returns a new schema dictionary with the node
        id's removed

        Note, when making graph smaller, it will usually make more sense to remove unique
        edge id's than nodes. However if there is some reason to this node removal function is here

        This is also really slow, consider changing if u actually make graphs really big
    '''
    new_dictionary = schema_dictionary.copy()
    for id in id_list:
        for node in new_dictionary['nodes']:
            if node['id'] == id:
                new_dictionary['nodes'].remove(node)
    return new_dictionary

# %%
def removeEdgeIDs(id_list, schema_dictionary):
    '''
        takes a list of edge id's and returns a new schema dictionary with the edge id's removed
        Note: important that you remove by edgeid, not source or target since the edge id is unique
    '''
    new_dictionary = schema_dictionary.copy()
    for id in id_list:
        for edge in new_dictionary['edges']:
            if edge['id'] == id:
                new_dictionary['edges'].remove(edge)
    return new_dictionary

# %%
#to start with, I think we should always start from the first node created. May make sense in the future to allow user to specify
#what node they want to start with, but i am too lazy to think of what the UX of that would be 

def enforceDictUniqueID(id, dictionary):
    '''
        takes a dictionary and an id, returns the id if the id does not appear in the keys of hte dictionary, a new id with
        a tail end number if it does
    '''
    if id in dictionary.keys():
        if id[-1].isnumeric():
            new_id = id[0:-1] + str(int(id[-1]))
            return(new_id)
        else:  
            new_id = id + "_1"
            return(new_id)
    return(id)
# %%
def runTextLLM(text, node_id = "unknown", context_dict = {}, context_fp = './context.json'):
    '''
        much simpler function that only runs LLM using text, not based on node
        outputs context json to context_fp, should figure out a good place for this in
        webserver file structure later
    '''
    #for testing just return a string
    print("Running LLM based on text")
    output= ask_lora(text)
    node_id_to_add = enforceDictUniqueID(node_id, context_dict)
    context_dict[node_id_to_add] = output
    with open(context_fp, "w") as outfile:
        json.dump(context_dict, outfile)
    return output, context_dict

def runNodeLLM(node_id, schema_dictionary, context_dict={}, context_fp = './context.json'):
    '''
        function that runs the node based on node_id, 
        outputs context json to context_fp, should figure out a good place for this in
        webserver file structure later
    '''
    #for testing just return a string to check that schema's working
    prompt=''
    for node in schema_dictionary['nodes']:
        if node['id'] == node_id:
            prompt=''
            for key in node['data'].keys():
                prompt += node['data'][key]
                prompt += " \n"
            # run LLM on prompt, note that this output will need to be sent over web somehow
    output = ask_lora(prompt)
    node_id_to_add = enforceDictUniqueID(node_id, context_dict)
    context_dict[node_id_to_add] = output
    with open(context_fp, "w") as outfile:
        json.dump(context_dict, outfile)
    return output, context_dict

# %%
def outputToChatbot(output):
    '''
        Takes an output and sends it to the chatbot to be outputted.
        Should also store the outputs in a JSON file for context
    '''
    print("Running outputToChatbot")
    return("Ready to send to output!")

# %%
def listenForInput():
    '''
        Listens for an input from website if user pushes pause or stop
    '''
    print("Running listenForInput")
    return("Placeholder for listening to server!")

def retrieveNodePrompt(node_id, schema_dictionary):
    for node in schema_dictionary['nodes']:
        if node['id'] == node_id:
            return(node['data']['prompt'])

# %%
def runSchema(schema_dictionary, next_node_in_loop = "start", received_input="", diverging_loop_stack=[], seen_nodes=[], context_dict = {}):
    '''
        Take a schema and run the flow. Mutates schema dictionary and removes edges not part of a loop, edges within or downstream of loops are
        preserved.

        There are 2 things to track, what the current graph looks like and the stack of 
        nodes to run and their received prompts. Nodes on the stack have to check if they are a 
        root, or else they are not run yet. Root nodes on the stack are run in order, then
        targets are added to the stack with their associated prompt. If the target is already
        on the stack, simply give it the additional prompt.

        If there are nodes, and all of the nodes have a source, this means that there is a loop 
        somewhere in the graph. We still want to run the flow, because recursive nodes are a 
        selling point. In this case, if ALL the nodes have a source, pick the most recently 
        created node and run it, sending its prompts and adding the new targets to the stack. We
        do not update the graph now, instead simply running the node, then its targets in order.
        This will continue running iterations, until a stop button is pressed.

        The user will probably want to

        We should create a stack, a list of dictionaries that look like this:
        [{node_id: ____, sources_dict:{source_id:received_prompt = "" }}]
        This forms a stack. Sources dict may or may not have multiple source_ids in it. Queue up
        the next nodes to run based on what the targets of the node you just ran are. If
        a node has multiple sources when it's run, combine those sources into one prompt
        via concatenation. Received prompts are added first, with the LLMs actual text
        entered into it added last. We may have to do prompt engineering to make sure
        the LLM answers the prompt inputted into the box and not questions received as context,
        but this is not preferred.
        For bonus points, add an option to use dfs or bfs
    '''
    ### Should listen here to see if user hit the pause/stop button, and if they did pause or stop the execution of the code
    listenForInput()

    roots = findRoots(schema_dictionary)
    nodes_to_send_outputs={}
    next_schema_dictionary=schema_dictionary.copy()
    orphaned_nodes=list(set(findOrphanedNodes(schema_dictionary)).difference(set(seen_nodes)))
    print("Printing the orphaned nodes")
    print(orphaned_nodes)
    #Base case: Check if schema dictionary has no roots
    if len(roots) == 0 and len(orphaned_nodes) == 0 and len(schema_dictionary['edges']) == 0:
        print("No roots, orphaned nodes or edges. Exiting.")
        return(schema_dictionary) 
    if len(roots) == 0 and len(orphaned_nodes) == 0:
        print("We are doing the loop case.")
        print("Here's the node we're doing:")
        print(next_node_in_loop)
        if not schema_dictionary['edges']:
            return(schema_dictionary)
        # Other special case: we are looping 
        #this doesn't work, should make a function that follows the targets and returns False if ends up at a terminal branch and True if it 
        #comes back to itself
        else:
            if next_node_in_loop == "start":
                for node in schema_dictionary['nodes']:
                    if checkLoop(node['id'], schema_dictionary):
                        current_node = node['id']
                        print(current_node)
                        break
                    else:
                        print("Node just checked is terminal branch, skipping to find start node!")
            else:
                current_node = next_node_in_loop
            
            ### In the future, you may want to change the way this script combines received inputs
            # with the prompt a node has typed into it
            node_prompt = received_input + retrieveNodePrompt(current_node, schema_dictionary)
            print("the node prompt is: " + node_prompt)
            output, context_dict = runTextLLM(node_prompt, context_dict)
            next_received_input = output + " "
            outputToChatbot(output)
            for edge in next_schema_dictionary['edges']:
                if edge['source'] == current_node:
                    edge_id = edge['id']
                    nodes_to_send_outputs[edge['target']] = output
                    print("next nodes are:")
                    print(nodes_to_send_outputs)
            next_loops= []
            next_terminal = []
            for node_id in nodes_to_send_outputs:
                #i dont understand why this isn't working
                print("THE NODE ID IS")
                print(node_id)
                print("check loop is:")
                print(checkLoop(node_id, schema_dictionary))
                breakpoint()

                if checkLoop(node_id, schema_dictionary):
                    next_loops.append(node_id)
                    print("In next loop")
                    print(next_loops)
                if checkIsTerminalBranchNode(node_id, schema_dictionary):
                    next_terminal.append(node_id)
                    print("In next terminal")
            for terminal_id in next_terminal:
                print("in terminal")
                print("terminal id is: " + terminal_id)
                runSchema(schema_dictionary, next_node_in_loop=terminal_id, received_input=next_received_input, diverging_loop_stack=diverging_loop_stack)
            if len(next_loops) == 1:
                print('detected len as 1')
                runSchema(schema_dictionary, next_node_in_loop=next_loops[0], received_input=next_received_input, diverging_loop_stack=diverging_loop_stack)
            elif len(next_loops) > 1:
                #want to make sure we run different diverging loops in order 
                if len(diverging_loop_stack) == 0:
                    #if this is the first time seeing the diverging loop, make our queued loops the diverging
                    #loop stack
                    runSchema(schema_dictionary, next_node_in_loop=next_loops[0], received_input=next_received_input, diverging_loop_stack=next_loops)
                elif len(diverging_loop_stack) > 0:
                    if set(next_loops) != set(diverging_loop_stack):
                        diverging_loop_stack = next_loops
                        runSchema(schema_dictionary, next_node_in_loop=diverging_loop_stack[0], received_input=next_received_input, diverging_loop_stack=diverging_loop_stack)
                    elif set(next_loops) == set(diverging_loop_stack):
                        first = diverging_loop_stack.pop(0)
                        diverging_loop_stack.append(first)
                        print("THISIS THE NEW STACK")
                        print(diverging_loop_stack)
                        runSchema(schema_dictionary, next_node_in_loop=diverging_loop_stack[0], received_input=next_received_input, diverging_loop_stack=diverging_loop_stack, context_dict=context_dict)

    else:                    
        #Recursive case: Schema dictionary has roots. Get the outputs from the source node, make 
        #an updated schema dictionary where target nodes have the new outputs, and remove
        #the edges that have already been checked
        print("We are doing the tree case")
        edge_ids_to_remove=[]
        
        next_schema_dictionary=schema_dictionary.copy()
        roots = roots + orphaned_nodes
        new_seen_nodes=seen_nodes
        for root in roots:
            for edge in next_schema_dictionary['edges']:
                if edge['source'] == root:
                    edge_id = edge['id']
                    edge_ids_to_remove.append(edge_id)
                    nodes_to_send_outputs[edge['target']] = ""
                    print("Printing the next nodes")
                    print(nodes_to_send_outputs)
                    print("Printing the edges to be removed")
                    print(edge_ids_to_remove)
                    print("printing the new seen nodes")
                    print(new_seen_nodes)
            output, context_dict = runNodeLLM(root, next_schema_dictionary, context_dict=context_dict)
            new_seen_nodes.append(root)
            ### SEND OUTPUT TO CHATBOT TO OUTPUT HERE ####
            outputToChatbot(output)

            for node_id in nodes_to_send_outputs.keys():
                nodes_to_send_outputs[node_id] = output
            
            ### In the future you may want to change the way this script handles combining 
            ### prompts
            updated_prompts_dict = updateNodePrompts(nodes_to_send_outputs, schema_dictionary)
            next_schema_dictionary=removeEdgeIDs(edge_ids_to_remove, updated_prompts_dict)
        return(runSchema(next_schema_dictionary, seen_nodes=new_seen_nodes, context_dict=context_dict))

# %%
runSchema(schema_dictionary)
