# Overview
Yumrank is a simple way to rank food options in descending order (1 being the best).

## Tech Stack
Frontend - NextJS
Backend - Python FastAPI
DB - sqlite + sqlalchemy

## General Setup 

1 - Clone the repo with the following command
```
x
```

## Backend Setup
Create a virtual environment in /backend 
```
cd backend/

python3 -m venv .venv
source .venv/bin/activate
```


Then, install the needed requirements
```
pip install -r requirements.txt
```


To start the backend server run
```
uvicorn main:app --reload
```

## Frontend Setup
Navigate to the frontend directory and run the following command:
```
cd frontend/
npm install
```


To run the frontend run
```
npm run dev
```