# WashU CampusConnect
CampusConnect is a platform that helps students discover, RSVP to, and interact with student events happening on campus.
It supports two user types: event attendees and event creators allowing both discovery and management of student-led campus events.

## Team members
* Hayrettin Eren Yildiz
* Demi Ren
* Annie Shao

## Setup Instructions

### Frontend
Navigate to the frontend directory
```
cd frontend
```
Install required dependencies
```
npm install
```
Accessible at http://localhost:3000
```
npm start
```

### Backend
Ensure Python 3.7 or newer is installed: https://www.python.org/downloads/

Navigate to the backend directory
```
cd fastapi-backend
```
Install required dependencies from `requirements.txt`
```
pip install -r requirements.txt
```
Start the FastAPI server
```
uvicorn main:app --reload
```


### Setting Up and Running Docker
Install Docker: https://www.docker.com/

Build and start services defined in `docker-compose.yml`
```
docker-compose up --build
```
This will launch both the frontend and backend services.
