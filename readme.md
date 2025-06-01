Check this Post out :https://www.linkedin.com/feed/update/urn:li:activity:7258065359365173248/
# Software application for the Automated Facial Recognition based Attendance Tracker
(Requires an esp32cam powered hardware module to run)
![sWhatsApp Image 2024-10-23 at 13 17 30_43b396de](https://github.com/user-attachments/assets/2385c62f-c1ee-4dc6-9b01-7be2c772a4bb)

 Add the student/faculty images in the database folder in the public directory


## Docker Setup Instructions

### Prerequisites
- Docker installed on your machine
- Docker Compose installed on your machine

### Running with Docker

1. **Build and Run the Container**
   ```bash
   docker-compose up --build
   ```
   This command will:
   - Build the Docker image using the Dockerfile
   - Start the container on port 5000
   - Name the container as "face-api-container"

2. **Stop the Container**
   ```bash
   docker-compose down
   ```

3. **View Running Containers**
   ```bash
   docker ps
   ```

### Docker Configuration Details

#### Docker Compose Configuration
The application uses Docker Compose with the following configuration:
- Service name: face-recognition-app
- Port mapping: 5000:5000
- Auto-restart policy: unless-stopped

#### Dockerfile Details
The application is built using:
- Node.js 18 base image
- Working directory: /app
- Exposes port 5000
- Runs on `npm start` command

### Troubleshooting
- If port 5000 is already in use, modify the port mapping in `docker-compose.yml`
- For permission issues, ensure Docker daemon is running
- Check logs using: `docker logs face-api-container`

## Development

To modify the Docker setup:
1. Edit `Dockerfile` for container build instructions
2. Edit `docker-compose.yml` for service configuration
3. Rebuild using `docker-compose up --build`

## License
[MIT License](https://github.com/MustafaAjnawala/Muskaan-Facial-Recognition-based-Attendance-Tracker/blob/main/LICENSE)

### To start up the app:
1. run npm install in the root directory
2. run node on server.js
3. go to http://localhost:5000



### Loading 4 primary models
``` javascript
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
    ])
```

reference GitHub repo: ### [Face API Github](https://github.com/justadudewhohacks/face-api.js)
