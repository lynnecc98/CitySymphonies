var video;
var videos = [];
let vScale = 20;
let poseNet;
let pose;

var numNotes = 8;
var musicalBoxes = [];
var sounds = [];

var body;
var poses = [];
var drawPeople = [];
var drawCounter = 0;

let notes = [60, 62, 64, 65, 67, 69, 70, 71, 72];

let NYButton;
let BrooklynButton;
let ATLButton;
let SeoulButton

function preload() {
  // sounds = [loadSound('Sounds/pure-bell-c2.mp3'), loadSound('Sounds/pure-bell-ds2.mp3'), 
  // loadSound('Sounds/pure-bell-fs2.mp3'), loadSound('Sounds/pure-bell-a2.mp3'), 
  // loadSound('Sounds/pure-bell-c3.mp3'), loadSound('Sounds/pure-bell-ds3.mp3'),
  // loadSound('Sounds/pure-bell-fs3.mp3'), loadSound('Sounds/pure-bell-a3.mp3')];
  sounds.push (loadSound('Sounds/pure-bell-c2.mp3'));
  sounds.push (loadSound('Sounds/pure-bell-ds2.mp3'));
  sounds.push (loadSound('Sounds/pure-bell-fs2.mp3'));
  sounds.push (loadSound('Sounds/pure-bell-a2.mp3'));
  sounds.push (loadSound('Sounds/pure-bell-c3.mp3'));
  sounds.push (loadSound('Sounds/pure-bell-ds3.mp3'));
  sounds.push (loadSound('Sounds/pure-bell-fs3.mp3'));
  sounds.push (loadSound('Sounds/pure-bell-a3.mp3'));
}

function setup() {
  createCanvas(850, 480);
  pixelDensity(1);
  noStroke();

  // video = createCapture(VIDEO);
  video = createVideo('assets/video1.mov', vidLoaded);
  for (let i = 0; i < 2; i++) {
    videos[i] = createVideo('assets/video${i}.mov');
  }
  video.size(width, height);
  // video.hide();

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', function(results) {
    poses = results;
  });

  for (let i = 0; i < numNotes; i++) {

    musicalBoxes.push(new MusicalBox(i));
  }
  synth = new p5.MonoSynth();
  masterVolume(0.2);

  NYButton = createButton('New York');
  BrooklynButton = createButton('Brooklyn');

  // NYButton.mousePressed(changeVid0); 
  // BrooklynButton.mousePressed(changeVid1); 
}

// function changeVid0(){
//   video = createVideo('assets/video0.mov', vidLoaded);
// }
// function changeVid1(){
//   video = createVideo('assets/video1.mov', vidLoaded);
// }

function vidLoaded(){
  video.loop();
  // video.speed(2);
  // video.hide();
}

function gotHumans(humans) {
  // if there is pose data
  if (humans.length > 0) {
    // store data from first human detected
  pose = humans[0].pose;
  //   for (let i = 0; i < humans.length; i++) {
  //     people.push (humans[i].pose);
  //   }
    // console.log(pose);
  }
  people = humans;
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  image(video, 0, 0, width, height);

  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let i = 0; i < numNotes; i++) {
      musicalBoxes[i].hits(pose.keypoints[0]);
      musicalBoxes[i].hits(pose.keypoints[6]);
      musicalBoxes[i].hits(pose.keypoints[14]);
      // musicalBoxes[i].show();
      // fill(20 + i * 20, 60);
      // rect(i * width / numNotes, 0, width / numNotes, height);
    }

    // drawKeypoints();
    // drawSkeleton();
  }

  // if (people) {
  //   console.log("posenet poses on");
  //   console.log(pose);
  //   console.log(people);
  //   // for (let i = 0; i < people.length; i ++) {
  //   //   drawPeople.push(new DrawBody(people[i]));
  //   // }
  //   body = new DrawBody(pose);
  //   for (let i = 0; i < numNotes; i++) {
  //     if (musicalBoxes[i].hits(pose.keypoints[0])) {

  //     }
  //     // for (b in people) {
  //     //   musicalBoxes[i].hits(b.keypoints[0])
  //     // }
      
  //     musicalBoxes[i].show();
  //     fill(20 + i * 20, 60);
  //     rect(i * width / numNotes, 0, width / numNotes, height);
  //   }
  //   if (drawCounter % 100 == 0) {
  //     for (let i = 0; i < drawPeople.length; i++) {
  //       drawPeople[i].update(people[i].keypoints[3], people[i].keypoints[1], people[i].keypoints[0], people[i].keypoints[6], people[i].keypoints[5], people[i].keypoints[8], people[i].keypoints[7], people[i].keypoints[10], people[i].keypoints[9]);
  //     }
  //     body.update(pose.keypoints[3], pose.keypoints[1], pose.keypoints[0], pose.keypoints[6], pose.keypoints[5], pose.keypoints[8], pose.keypoints[7], pose.keypoints[10], pose.keypoints[9]);

  //     drawCounter = 0;
  //   }
  //   for (b in drawPeople) {
  //     b.show();
  //   }
  //   body.show();
  // }
  // pop();
  // drawCounter++;
}
// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
function MusicalBox(num) {
  this.x = num * width / numNotes;
  this.y = 0;
  this.width = width / numNotes;
  this.height = height;
  this.color = 20 + num * 20;

  this.highlight = false;

  this.show = function() {
    noStroke();
    if (this.highlight) {
      fill(this.color, 100);
    } else {
      fill(this.color, 60);
    }
    rect(this.x, this.y, this.width, this.height);
  }

  this.hits = function(nose) {

    if (nose.position.x > this.x && nose.position.x < this.x + this.width) {
      this.highlight = true;
      // let freqToPlay = midiToFreq(notes[num]);
      // synth.play(freqToPlay, 1);
      if (!sounds[num].isPlaying()){
        sounds[num].play();
      }
      
      return true;
    }

    this.highlight = false;
    return false;
  }

  // this.update = function() {
  //   // this.x -= this.speed;
  // }
}

function DrawBody(poses) {
  this.leftEar = poses.keypoints[3];
  this.leftEye = poses.keypoints[1];
  this.nose = poses.keypoints[0];
  this.rightShoulder = poses.keypoints[6];
  this.leftShoulder = poses.keypoints[5];
  this.rightElbow = poses.keypoints[8];
  this.leftElbow = poses.keypoints[7];
  this.rightWrist = poses.keypoints[10];
  this.leftWrist = poses.keypoints[9];
  // this.leftEar = null
  // this.leftEye = null
  // this.nose = null
  // this.rightShoulder = null
  // this.leftShoulder = null
  // this.rightElbow = null
  // this.leftElbow = null
  // this.rightWrist = null
  // this.leftWrist = null


  this.show = function() {
    let neckx = this.leftShoulder.position.x - this.rightShoulder.position.x;
    let necky = this.leftShoulder.position.y;


    //     let hipx = poses.keypoints[12].position.x - poses.keypoints[11].position.x;
    //     let hipy = poses.keypoints[12].position.y;
    if (this.leftEar != null) {
      // fill(255);
      noFill();
      strokeWeight(4);
      stroke(255);

      //face
      beginShape();
      vertex(this.leftEar.position.x, this.leftEye.position.y);
      vertex(this.nose.position.x, this.nose.position.y);
      endShape();

      //neck
      beginShape();
      vertex(this.nose.position.x, this.nose.position.y);
      vertex(neckx, necky);
      endShape();

      //shoulder
      beginShape();
      vertex(this.rightShoulder.position.x, this.rightShoulder.position.y);
      vertex(this.leftShoulder.position.x, this.leftShoulder.position.y);
      endShape();

      //rightArm
      beginShape();
      vertex(this.rightShoulder.position.x, this.rightShoulder.position.y);
      vertex(this.rightElbow.position.x, this.rightElbow.position.y);
      vertex(this.rightWrist.position.x, this.rightWrist.position.y);
      endShape();

      //leftArm
      beginShape();
      vertex(this.leftShoulder.position.x, this.leftShoulder.position.y);
      vertex(this.leftElbow.position.x, this.leftElbow.position.y);
      vertex(this.leftWrist.position.x, this.leftWrist.position.y);
      endShape();
    }
    // //spine
    // beginShape();
    // vertex(hipx, hipy);
    // vertex(neckx, necky);
    // endShape();
  }

  this.update = function(leftEar, leftEye, nose, rightShoulder, leftShoulder, rightElbow, leftElbow, rightWrist, leftWrist) {
    this.leftEar = leftEar;
    this.leftEye = leftEye;
    this.nose = nose;
    this.rightShoulder = rightShoulder;
    this.leftShoulder = leftShoulder;
    this.rightElbow = rightElbow;
    this.leftElbow = leftElbow;
    this.rightWrist = rightWrist;
    this.leftWrist = leftWrist;

  }
}