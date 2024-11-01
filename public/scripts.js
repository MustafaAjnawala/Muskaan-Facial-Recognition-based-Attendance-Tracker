//console.log(faceapi)


//Facial detection
const run = async()=>{
  //console.log("Hello");
    //we need to load our models
    //loading the models is going to use await
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
    ])

    const face1 = document.getElementById('face');
    //const face1 = await faceapi.fetchImage();

    let faceAIData = await faceapi.detectAllFaces(face1).withFaceLandmarks().withFaceDescriptors().withAgeAndGender();
    //console.log(faceAIData);

    //const canvas = getElementById('canvas');

     // Calculate offsets relative to the document using getBoundingClientRect()
     const faceRect = face1.getBoundingClientRect();
     const canvasLeft = faceRect.left + window.scrollX;
     const canvasTop = faceRect.top + window.scrollY;
 
     // Set canvas position and size
     canvas.style.position = 'absolute';
     canvas.style.left = canvasLeft + 'px';
     canvas.style.top = canvasTop + 'px';
     canvas.width = faceRect.width;
     canvas.height = faceRect.height;

    //canvas.style.left = face1.offsetLeft
    //canvas.style.top = face1.offsetTop;
    //canvas.height = face1.height;
    //canvas.width = face1.width;

    faceAIData = faceapi.resizeResults(faceAIData, face1);
    faceapi.draw.drawDetections(canvas, faceAIData);


    //Facial detection done, now trying facial recognition

}

    
run()