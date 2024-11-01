/*document.addEventListener('DOMContentLoaded', () => {
    const streamImg = document.getElementById("stream");
    let flag = 0;
    let isDetecting = true;

    // Function to start detecting smiles
    function startSmileDetection() {
        console.log("Loading models...");
        // Load all the required libraries from the models folder
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/public/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/public/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/public/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/public/models'),
        ]).then(detectSmile)
        .catch(err=>{

            console.error("Error loading models:",err);
        });
    }

    // Function to detect smiles
    function detectSmile() {
        console.log("Starting smile detection...");
        const handleSmileDetection = () => {
            
            setInterval(async () => {
               
                try {
                    // Create a canvas element
                    // console.log("hi");
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set the canvas dimensions to match the image dimensions
                    canvas.width = streamImg.width;
                    canvas.height = streamImg.height;

                    // Draw the image onto the canvas
                    ctx.drawImage(streamImg, 0, 0, canvas.width, canvas.height);

                    // Detect faces and expressions on the canvas
                    const detections = await faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

                    if (detections.length > 0) {
                        // Process each detection
                        detections.forEach(detection => {
                            const expressions = detection.expressions;
                            const maxScore = Math.max(...Object.values(expressions));
                            const maxExpression = Object.keys(expressions).find(
                                expression => expressions[expression] === maxScore
                            );

                            if (maxExpression === "happy") {
                                flag = 1;
                                console.log("Happy face detected, flag:", flag);
                                take_snapshot();
        
                                flag = 0;
                            } 
                            
                        });
                    }
                     else {
                        console.log("No face detected");
                    }
                } catch (error) {
                    console.error("Error during detection:", error);
                }
            }, 2000);
        };
        handleSmileDetection();
        
    }
    // Call startSmileDetection to initiate the smile detection process
    
        startSmileDetection();
        
});
*/



function take_snapshot() {
    console.log('Taking snapshot...');

    // Get the image element
    const img = document.getElementById('stream');

    // Create a canvas element to draw the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d',{willReadFrequently:true});

    // Set the canvas dimensions to match the image dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert the canvas content to a data URL representing a still image
    const data_uri = canvas.toDataURL('image/jpg');

    // Display the captured image in the results div
    document.getElementById('results').innerHTML = '<img src="' + data_uri + '"/>';

    // Call the run function with the data URI (present in the fr-scripts.js)
    run(data_uri);
}