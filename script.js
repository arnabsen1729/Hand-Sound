var video = document.querySelector("#videoElement");
let isVideo = false;
let handFound = false;
const canvas = document.getElementById("output");
const context = canvas.getContext('2d');

var sound1 = new Howl({
  src: ['./assets/sounds/boom.wav'],
  autoplay: false,
  loop: false,
  volume: 0.8,
  onend: function() {
    console.log('Finished!');
  }
});

var sound2 = new Howl({
  src: ['./assets/sounds/hihat.wav'],
  autoplay: false,
  loop: false,
  volume: 0.8,
  onend: function() {
    console.log('Finished!');
  }
});

var sound3 = new Howl({
  src: ['./assets/sounds/clap.wav'],
  autoplay: false,
  loop: false,
  volume: 0.8,
  onend: function() {
    console.log('Finished!');
  }
});

var sound4 = new Howl({
  src: ['./assets/sounds/snare.wav'],
  autoplay: false,
  loop: false,
  volume: 0.8,
  onend: function() {
    console.log('Finished!');
  }
});

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
  scoreThreshold: 0.79,    // confidence threshold for predictions.
}

function play1(){
  console.log('1 playing...');
  sound1.stop();
  sound1.play();
}
function play2(){
  console.log('2 playing...');
  sound2.stop();
  sound2.play();
}
function play3(){
  console.log('3 playing...');
  sound3.stop();
  sound3.play();
}
function play4(){
  console.log('4 playing...');
  sound4.stop();
  sound4.play();
}


function runDetection() {
  model.detect(video).then(predictions => {
      // console.log("Predictions: ", predictions);
      if(predictions.length > 0){
        // console.log('Hand Found');
        for( index=0; index<predictions.length; index++){
          let handPos = {}
          handPos.x=predictions[index]['bbox'][0];
          handPos.y=predictions[index]['bbox'][1];
          document.getElementById('xcord').innerHTML = handPos.x
          document.getElementById('ycord').innerHTML = handPos.y
          if(handPos.x<250 && handPos.y<150) play4();
          else if(handPos.x<250 && handPos.y>150) play2();
          else if(handPos.x>250 && handPos.y<150) play3();
          else if(handPos.x>250 && handPos.y>150) play1();
        // console.log(handPos);
        }
      }
      
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
