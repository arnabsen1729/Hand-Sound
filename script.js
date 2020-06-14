var video = document.querySelector("#videoElement");
let isVideo = false;
const canvas = document.getElementById("output");
const context = canvas.getContext('2d');

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
      console.log('Video working')
    })
    .catch(function (error) {
      console.log("Something went wrong!");
    });
}

const modelParams = {
  flipHorizontal: true,   // flip e.g for video  
  maxNumBoxes: 20,        // maximum number of boxes to detect
  iouThreshold: 0.5,      // ioU threshold for non-max suppression
  scoreThreshold: 0.6,    // confidence threshold for predictions.
}




function runDetection() {
  model.detect(video).then(predictions => {
      console.log("Predictions: ", predictions);
      model.renderPredictions(predictions, canvas, context, video);
      if (isVideo) {
          requestAnimationFrame(runDetection);
      }
  });
}

function startVideo() {
  handTrack.startVideo(video).then(function (status) {
      console.log("video started", status);
      if (status) {
        console.log('Detection Started...')
        isVideo = true
        runDetection()
      }
  });
}

document.getElementById('togSwitch').style.display = "none";
handTrack.load(modelParams).then(lmodel => {
  model = lmodel
  console.log('Model Loaded')
  document.getElementById('togSwitch').style.display = "block";
  document.getElementById('info').style.display = "none";
});

function toggleVideo() {
  console.log('click')
  if (!isVideo) {
      startVideo();
  } else {
      console.log('Stopping Video')
      handTrack.stopVideo(video)
      isVideo = false;
      console.log('Video Stopped')
  }
}

document.getElementById('check').addEventListener('click', toggleVideo);
