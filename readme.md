Check this Post out :https://www.linkedin.com/feed/update/urn:li:activity:7258065359365173248/
# Software application for the Automated Facial Recognition based Attendance Tracker
(Requires an esp32cam powered hardware module to run)
![sWhatsApp Image 2024-10-23 at 13 17 30_43b396de](https://github.com/user-attachments/assets/2385c62f-c1ee-4dc6-9b01-7be2c772a4bb)

### Add the student/faculty images in the database folder in the public directory

## the hardware module enclosed in it's box
![image](https://github.com/user-attachments/assets/54c6184e-9b83-4d2b-9262-a016351dedd7)

##License
[MIT License] (LICENSE)

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
