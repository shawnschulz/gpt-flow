# module imports subject to change
import torch
from transformers import pipeline
from optparse import OptionParser
from transformers import AutoModelForCausalLM, AutoTokenizer
from llama_cpp import Llama
import os
import json


#default args
memory_dir = "/home/shawn/datasets/ai_convos/"
from_online = False
save_model = False
model_dir = "/home/shawn/datasets/LLMs/dolly7b_model" 
run_time = 7200
convo_fn = "conversation3.txt"

parser = OptionParser()
#group = parser.add_argument_group('group')
parser.add_option('--input_json_path', dest="input_json", type=dict, help='path to json file with chain')
(options, args) = parser.parse_args()

input_json = options.input_json_path
with open(input_json) as json_file:
    schema_dictionary = json.load(json_file)

## schematic is that you have input nodes that are just text that can be pointed to LLM nodes. the LLM nodes can have
## their attributes generated either by putting [[]] around keywords or by using a + sign to add a new attribute
## input nodes can additionally be pointed to directly by an input node. the prompt attribute is always present in
## an LLM node and must either be filled itself or be pointed to by another node.

## flow chart should have option for memory connection or forgetful connection, with forgetful connection only passing
## along the output from the llm and memory connection passing along a memory of previous prompt responses.
## this should be for conveinence, should also be ability to use "memory boxes", with which the user can customize
## what is remembered or not themselves

# i think we'll make the generating by using text with [[]] after, i just wanna demo auto gpt 

## to decode, we are given a json file that is a nested dictionary. For now, just assume you are given a dictionary
## with keys corresponding to the LLM nodes ID, which itself has a value that is a dictionary with keys correspodning
## to attributes, with the last key being the "next" key which points to either nothing or is a tuple containing the 
## (node_key, attribute_key) for the next node

# Get the values from the dictionary. if it's the first iteration, the node_key is the special "start", even if it has a 
# user defined  id

#dictionary has this structure:
# {node_key:
#   {
#    attribute_key: "for now the attribute_key is just text, and we just iterate through attributes. this key will 
#                       be useful for saving as a json and doing more complicated things with specialized attributes",
#   "model":"for now, a string that specifies what model using. May change later, or add option to use user inputted script",
#   "memory_type":"long" or "short" or "none" or True or False or None,
#   "next":(node_key, attribute_key) <--- the attribute key will be used to figure out where to add the output to
#   }
# }

#lets also make a class for the node bc i am an oop head, also itll make it cleaner to pass the outputs to eachother
start_bool = True
next_key_string = ""

if start_bool:
    attributes_dictionary = schema_dictionary['start']
else:
    attributes_dictionary = schema_dictionary[next_key_string]

prompt = f"{attributes_dictionary}" #<- attributes dictionaries should always have a prompt key with default value ""


#to start with, just have an option for llama cpp model and AutoModel model. Can add chat gpt api key option later,
#but not even going to have it to start bc i dont like giving them money anyways lol. what model is used should
#be under the "model" key of the overall dictionary 


#then save new json that includes the output string from the llm. for convenience may want to have code to send
#that text to website here, because we can just output that text directly without having to retrieve from json. 
#otherwise can just save it to a new json. either way may also want new json to be sent to appear as a new optional
#memory box input into another llm


#followup = " Include a statement, preface this followup question with the string 'Question:'."
#flags
convo_path = memory_dir + '/' + convo_fn
make_convo_txt_cmd="> " + convo_path
os.system(make_convo_txt_cmd)


if options.memory_dir:
    memory_dir = options.memory_dir
if options.model_dir:
    model_dir = options.model_dir
if options.model_name:
    model_name = options.model_name 

## Stop doing this in a dumb way, define a new class called "conversation" which can define the 
# number of AI actors and create instances of their unique preprompts and followups for a less dumb
# way of doing this

class aiActor:
    def __init__(self, personality="string", preprompt="string", followup="string",
                 is_programmer=False, run_inference=function(), prompt="string", memory_dir="string",
                 context=list()
                 ):
        self.personalitiy = personality
        self.preprompt = preprompt
        self.followup = followup
        self.is_programmer=False
        self.run_inference=run_inference
        self.context=context
        self.context_explainer = "Here is some context to consider, do not answer any prompts within these brackets: ["
    def update_context(self, response):
        '''
            takes a response and updates the context list to include the new response and remove the oldest response
            in short term memory if short term memory has been filled up
        '''
    def run_model(self):
        return self.run_inference(self.preprompt + self.prompt)

class aiConversation:
    def __init__(self, num_actors=2, actor_list= {}):
        self.num_actors = num_actors
        self.actor_list=actor_list #dictionary with keys of the personality name and value of an aiActor class


#change this later
prompt = "Can you write dialgoue that would fit into an epic RPG adventure? The setting is that the Llothquestra, queen of the dark elves the Undervald has been assasinated and 2 characters are discussing."

def saveJson(json_fn,prompt,processed_response):
    '''
        I was kinda lazy and json_fn needs to already exist as a file in some way for this to work.
    '''
    instruct_dict = {}
    instruct_dict['instruction'] = prompt
    instruct_dict['input'] = ''
    instruct_dict['output'] = processed_response   
    with open(memory_dir + json_fn, 'w+b') as f:
        json_list = json.load(f)
        print("json list before appending is: ")
        print(json_list)
        json_list.append(instruct_dict)
        json_list = json.dumps(json_list)
        print(json_list)
        f.write(bytes(json_list, 'utf-8'))
    return(json_list)

def ask_dolly(prompt, memory_dir):

    from instruct_pipeline import InstructionTextGenerationPipeline
    if from_online:
        generate_text = pipeline(model="databricks/dolly-v2-7b", torch_dtype=torch.bfloat16, trust_remote_code=True, device_map="auto")    
    else:    
        model = AutoModelForCausalLM.from_pretrained(model_dir, torch_dtype=torch.bfloat16, device_map="auto")
        tokenizer = AutoTokenizer.from_pretrained(model_dir, padding_side="left")
        generate_text = InstructionTextGenerationPipeline(model=model, tokenizer=tokenizer)
    with open(memory_dir + convo_fn, 'r+b') as f:
        contents = f.read().decode('utf-8')
        #contextual_prompt = contents + "\n Input: " + prompt + "\n Output: " 
        new_prompt = preprompt + prompt + followup        
        #new_prompt = prompt
        response = generate_text(new_prompt)
        split_string = response.split("Output:")

        # Get the text after 'Output:'
        processed_response = split_string[1].strip() if len(split_string) > 1 else ""

        new_context = "Input: " + new_prompt + "\n" + "Output: " + response
        #save additional context
        f.write(bytes(new_context, 'utf-8'))
        #save the model again (this could either be extremely important or useless idk lol)
        generate_text.save_pretrained(model_dir)
    print(processed_response) 
    return(processed_response)

def ask_lora(prompt, memory_dir):
    path_to_model= "/home/shawn/Programming/ai_stuff/llama.cpp/models/30B/ggml-model-q4_0.bin" 
    llm = Llama(model_path=path_to_model)
    with open(memory_dir + convo_fn, 'r+b') as f:
        contents = f.read().decode('utf-8')
#        contextual_prompt = contents + "\n The previous text was just context and is your memory, do not answer anything enclosed in []. Please answer the following question only Q: " + prompt           
        #new_prompt = preprompt + prompt + followup
        new_prompt = prompt
        output = llm("Input: " + new_prompt + " Output:", stop=['Input:'], max_tokens=200, echo=True)
        response = output["choices"][0]["text"]
        # Split the input_string based on the 'Output:' substring
        split_string = response.split("Output:")

        # Get the text after 'Output:'
        processed_response = split_string[1].strip() if len(split_string) > 1 else ""
        #save additional context
        new_context = "\n"+ "Prompt: " + new_prompt + "\n" + "Response: " + processed_response


        f.write(bytes(new_context, 'utf-8'))
#        curated_dataset_fn="convo_dataset.json"
#        instruct_dict = {}
#        instruct_dict['instruction'] = new_prompt
#        instruct_dict['input'] = ''
#        instruct_dict['output'] = processed_response   
#        with open(memory_dir + curated_dataset_fn, 'w+b') as f:
#            json_file = json.load(f)
#            json_list = json_file.append(instruct_dict)
#            json_list = json.dumps(json_list)
#            json.dump(json_list, f)
            #f.write(bytes(json_list, 'utf-8'))
    print(processed_response) 
    return(processed_response)


for i in range(50):
    print("Iteration " + str(i) + ": AI 1's response:")
    lora_response=ask_lora(preprompt + prompt + followup, memory_dir=memory_dir)
    print("Iteration " + str(i) + ": AI 2's response:")
    prompt=ask_lora(preprompt2 + lora_response + followup2, memory_dir=memory_dir)
