let data = [];
let faceMatcherCache = null;
//function to download CSV after making it
function download(filename, csvData) {
    const element = document.createElement("a");

    element.setAttribute("href", `data:text/csv;charset=utf-8,${csvData}`);
    element.setAttribute("download", filename);
    element.style.display = "none";

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

//function to only make csv not download
function generateCSV(name) {
    //getting date for csv file
    let currentDate = new Date().toLocaleDateString('en-GB');

    const btnDownloadCsv = document.getElementById("btnDownloadCsv");

    if (!btnDownloadCsv.hasListener) {
        btnDownloadCsv.addEventListener("click", () => {
            download(`${currentDate}.csv`, json2csv.parse(data));
        });
        btnDownloadCsv.hasListener = true; // Mark that the listener is added
    }

    //pushing current fields one by one to data array
    data.push({ name: name, date: currentDate });

}

// Function to fetch all images from the database
async function fetchDatabaseImages() {
    return ['Ronaldo.jpg','Messi.jpg']; //add file names accordingly
}

// Function to load face data for all database images
async function loadFaceDescriptors(images) {
    const descriptors = [];
    for (let image of images) {
        const img = await faceapi.fetchImage(`database/${image}`);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        if (detections && detections.descriptor) {
            descriptors.push(new faceapi.LabeledFaceDescriptors(image.replace('.jpg', ''), [detections.descriptor]));
        }
    }
    return descriptors;
}

// The main function to run face recognition
const run = async (data_uri) => {
    let recognized = false;
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    ]);

    if(faceMatcherCache == null){
        // Load the face descriptors for all database images
    const databaseImages = await fetchDatabaseImages();
    const labeledFaceDescriptors = await loadFaceDescriptors(databaseImages);

    // Create a FaceMatcher instance with the loaded descriptors
    faceMatcherCache = new faceapi.FaceMatcher(labeledFaceDescriptors);

    }
    
    // Face to check from the webcam (iotcam now)
    const facesToCheck = await faceapi.fetchImage(data_uri);
    let facesToCheckAiData = await faceapi.detectAllFaces(facesToCheck).withFaceLandmarks().withFaceDescriptors();

    // Resize and match the faces
    facesToCheckAiData = faceapi.resizeResults(facesToCheckAiData, facesToCheck);

    facesToCheckAiData.forEach(face => {
        const { detection, descriptor } = face;
        let bestMatch = faceMatcherCache.findBestMatch(descriptor);
        if (bestMatch.label !== 'unknown') {
            recognized = true;
            alert(`Welcome ${bestMatch.label}`);
            console.log(bestMatch.label);
            generateCSV(bestMatch.label);
            return;
        }
    });

    if (!recognized) {
        alert("Login failed. User not in database");
    }

};

run();
