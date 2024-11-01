# Software application for the Automated Facial Recognition based Attendance Tracker
(Requires an esp32cam powered hardware module to run)
### Add the student/faculty images in the database folder in the public directory

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
