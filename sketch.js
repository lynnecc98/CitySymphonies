var video;
let poseNet;
let pose;

var numNotes = 6;
var musicalBoxes = [];

var body;
var drawCounter = 0;

let notes = [60, 62, 64, 65, 67, 69, 70, 71, 72];

function setup() {
  createCanvas(640, 480);
  noStroke();

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotHumans);

  for (let i = 0; i < numNotes; i++) {

    musicalBoxes.push(new MusicalBox(i));
  }




  synth = new p5.MonoSynth();
  masterVolume(0.2);
}

function gotHumans(humans) {
  // if there is pose data
  if (humans.length > 0) {
    // store data from first human detected
    pose = humans[0].pose;
    // console.log(pose);
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  if (pose) {
    body = new DrawBody(pose);
    for (let i = 0; i < numNotes; i++) {
      if (musicalBoxes[i].hits(pose.keypoints[0])) {

      }
      musicalBoxes[i].show();
      // fill(20 + i * 20, 60);
      // rect(i * width / numNotes, 0, width / numNotes, height);
    }
    if (drawCounter % 100 == 0) {

      body.update(pose.keypoints[3], pose.keypoints[1], pose.keypoints[0], pose.keypoints[6], pose.keypoints[5], pose.keypoints[8], pose.keypoints[7], pose.keypoints[10], pose.keypoints[9]);

      drawCounter = 0;
    }
    body.show();
  }
  pop();
  drawCounter++;
}

function MusicalBox(num) {
  this.x = num * width / numNotes;
  this.y = 0;
  this.width = width / numNotes;
  this.height = height;
  this.color = 20 + num * 20;

  this.highlight = false;

  this.show = function() {
    if (this.highlight) {
      fill(this.color, 100);
    } else {
      fill(this.color, 60);
    }
    rect(this.x, this.y, this.width, this.height);
    // fill(255);
    // if (this.highlight) {
    //   fill(255, 0, 0);
    // }
    // rect(this.x, 0, this.w, this.top);
    // rect(this.x, height - this.bottom, this.w, this.bottom);
  }

  this.hits = function(nose) {

    if (nose.position.x > this.x && nose.position.x < this.x + this.width) {
      this.highlight = true;
      let freqToPlay = midiToFreq(notes[num]);
      synth.play(freqToPlay, 1);
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