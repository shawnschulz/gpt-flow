# autogpt-flow

WIP! Here's how you can test the app locally:

clone the repo:
```
git clone https://github.com/shawnschulz/gpt-flow.git
```
enter folder and install npm packages:
```
cd gpt-flow
npm install
```

run development server:
```
npm run dev
```

be sure to also get the flask backend up and running to test api calls:
```
git clone https://github.com/shawnschulz/gpt-flow-backend.git
cd gpt-flow-backend
pip -r install requirements.txt
python app.py 
```
Getting the backend to work on your local system will require editing app.py. Go to the "ask_alpaca" function and change the model_path argument to a valid .ggml or .gguf file stored on your local system

TODOs

~~1. Add ability to add new nodes~~

~~2. Add attributes to nodes, text boxes to enter prompts~~

~~3. Create json/dictionary upon hitting play or download json and send it to backend for running~~

~~4. Make python script to run flows properly~~

~~5. Make the webserver~~

~~6. Rebase experimental branch to new main branch~~

~~7. Add regular chatbot functionality to text output screen~~

~~8. Add way to handle graph traversal on front end so API calls to LLM can be outputted to frontend each call~~

9. Create AWS hosted website for flow-chart

10. Improve selection of nodes, add some hotkey for drag select, allow shift clicking to select mutliple nodes, make visual indicator that node is selected

11. Incorporate hf agents, add new types of nodes such as text-image image-text text-text and nodes that are capable of running python code 

13. Add option to use chatgpt api key

14. Add option to run local models


