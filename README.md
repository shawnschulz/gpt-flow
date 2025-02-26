# gpt-flow

Welcome to gpt-flow! This github is mainly meant to be used for issues related to the gpt-flow web application, which you can use here: https://www.shmage.xyz/landing_page.

If your a developer and would like to use the app locally, you can currently do so by installing the front end and backend locally using the following instructions:

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
Getting the backend to work on your local system will require ollama and flask, which you can install using pip. Note that if you'd like to have the application run other models on your local machine, you can do so, but you'll need to edit the backend source code to do so.




