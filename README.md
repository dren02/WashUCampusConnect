# Project Name: Campus Events Website
### Team members: Hayrettin Eren Yildiz, Demi Ren, Annie Shao

## Instructions & Link to Access
http://104.154.252.3/

### Frontend
Change to frontend folder
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

Change to backend folder
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
