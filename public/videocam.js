// load webcam
Webcam.set({
    width: 600,
    height: 400,
    image_format: 'jpeg',
    jpeg_quality: 90
})
    Webcam.attach("#camera");

    function take_snapshot()
    {
        Webcam.snap(function(data_uri){
            //console.log("Data URI captured:", data_uri)
        document.getElementById('results').innerHTML = 
        '<img src = "'+data_uri+'"/>';
         run(data_uri);
    });
}

// function take_snapshot() {
//     console.log('Taking snapshot...');

//     // Fetch the streamed image from the Nodecam stream URL
//     fetch('http://192.168.232.18:81/stream')
//         .then(response => response.blob())
//         .then(blob => {
//             const objectURL = URL.createObjectURL(blob);

//             // Create an <img> element to display the captured image
//             const imgElement = document.createElement('img');
//             imgElement.src = objectURL;

//             // Append the <img> element to the results <div> tag
//             const resultsDiv = document.getElementById('results');
//             resultsDiv.appendChild(imgElement);

//             // Pass the object URL to the run function (if needed)
//             run(objectURL);
//         })
//         .catch(error => {
//             console.error('Error fetching stream:', error);
//         });
// }

