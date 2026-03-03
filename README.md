# Overview

Yumrank is a simple way to rank food options in descending order (1 being the best).
<img width="1312" height="691" alt="Screenshot 2026-03-02 at 5 14 30 PM" src="https://github.com/user-attachments/assets/04e0c2b7-0588-4873-b6fe-c5532358a476" />

## Tech Stack

Frontend - NextJS
Backend - Python FastAPI
DB - sqlite + sqlalchemy

## General Setup

1 - Clone the repo with the following command

```
git clone https://github.com/eshaanrawat1/yumrank.git
```

## Backend Setup

1 - Create a virtual environment in /backend 

```
cd backend/

python3 -m venv .venv
source .venv/bin/activate
```



2 - Then, install the needed requirements

```
pip install -r requirements.txt
```



3 - Run the `create_tables.py` file once before running the app to initialize the SQLite DB



4 - To start the backend server run

```
uvicorn main:app --reload
```



## Frontend Setup

1 - Navigate to the frontend directory and run the following command:

```
cd frontend/
npm install
```



2 - To run the frontend

```
npm run dev
```

