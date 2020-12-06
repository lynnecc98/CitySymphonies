var video;
var videos = [];
let poseNet;
let pose;
let posesN = [];
let poseNetReady = false;
let poseNetReady0 = false;
let poseNetReady1 = false;
let poseNetReady2 = false;
let poseNetReady3 = false;

var numNotes = 8;
var musicalBoxes = [];
var sounds = [];

var body;
var poses = [];
var poses0 = [];
var poses1 = [];
var poses2 = [];
var poses3 = [];

let notes = [60, 62, 64, 65, 67, 69, 70, 71, 72];

let NYButton;
let BrooklynButton;
let BusanButton;
let DCButton

let font;
let flockFont = [];

let currentVid = 1;

let points;

function preload() {
  sounds.push(loadSound('Sounds/pure-bell-c2.mp3'));
  sounds.push(loadSound('Sounds/pure-bell-ds2.mp3'));
  sounds.push(loadSound('Sounds/pure-bell-fs2.mp3'));
  sounds.push(loadSound('Sounds/pure-bell-a2.mp3'));
  sounds.push(loadSound('Sounds/pure-bell-c3.mp3'));
  sounds.push(loadSound('Sounds/pure-bell-ds3.mp3'));
  sounds.push(loadSound('Sounds/pure-bell-fs3.mp3'));
  sounds.push(loadSound('Sounds/pure-bell-a3.mp3'));

  font = loadFont('assets/Montserrat-Bold.ttf');

  videos[0] = createVideo('assets/video0.mov', vidLoaded0);
  videos[1] = createVideo('assets/video1.mov', vidLoaded1);
  videos[2] = createVideo('assets/video2.mov', vidLoaded2);
  videos[3] = createVideo('assets/video3.mov', vidLoaded3);
}

function setup() {
  createCanvas(850, 480);
  noStroke();

  for (let i = 0; i < videos.length; i++) {
    videos[i].hide();
  }

  // video = createVideo('assets/video1.mov', vidLoaded);
  // video = createCapture(VIDEO);
  // for (let i = 0; i < 2; i++) {
  //   videos[i] = createVideo('assets/video${i}.mov');
  // }
  

  // poseNet = ml5.poseNet(video, modelLoaded);
  // poseNet.on('pose', function (results) {
  //   poses = results;
  // });

  for (let i = 0; i < numNotes; i++) {

    musicalBoxes.push(new MusicalBox(i));
  }
  synth = new p5.MonoSynth();
  masterVolume(0.2);

  NYButton = createButton('New York');
  BrooklynButton = createButton('Brooklyn');
  BusanButton = createButton('Busan');
  DCButton = createButton('Washington DC');

  NYButton.mousePressed(changeVid0); 
  BrooklynButton.mousePressed(changeVid1); 
  BusanButton.mousePressed(changeVid2);
  DCButton.mousePressed(changeVid3);

  // points = font.textToPoints('New York', 100, 300, 130, {
  //   sampleFactor: 0.25
  // });

  // for (var i = 0; i < points.length; i++) {
  //   var pt = points[i];
  //   var newPoint = new FlockPoint(pt.x, pt.y);
  //   flockFont.push(newPoint);
  // }
}

function changeVid0(){
  for (let i = 0; i < videos.length; i++) {
    videos[i].pause();
    videos[i].hide();
  }
  videos[0].play();
  currentVid = 0;
}
function changeVid1(){
  for (let i = 0; i < videos.length; i++) {
    videos[i].pause();
    videos[i].hide();
  }
  videos[1].play();
  currentVid = 1;
}
function changeVid2(){
  for (let i = 0; i < videos.length; i++) {
    videos[i].pause();
    videos[i].hide();
  }
  videos[2].play();
  currentVid = 2;
}
function changeVid3(){
  for (let i = 0; i < videos.length; i++) {
    videos[i].pause();
    videos[i].hide();
  }
  videos[3].play();
  currentVid = 3;
}

function vidLoaded0() {
  videos[0].size(width, height);
  posesN[0] = ml5.poseNet(videos[0], modelLoaded0);
  videos[0].pause();
  // points = font.textToPoints('Brooklyn', 100, 300, 130, {
  //   sampleFactor: 0.25
  // });
}
function vidLoaded1() {
  videos[1].size(width, height);
  posesN[1] = ml5.poseNet(videos[1], modelLoaded1);
  videos[1].pause();
  // points = font.textToPoints('New York', 100, 300, 130, {
  //   sampleFactor: 0.25
  // });
  // for (var i = 0; i < points.length; i++) {
  //   var pt = points[i];
  //   var newPoint = new FlockPoint(pt.x, pt.y);
  //   flockFont.push(newPoint);
  // }
}
function vidLoaded2() {
  videos[2].size(width, height);
  posesN[2] = ml5.poseNet(videos[2], modelLoaded2);
  // points = font.textToPoints('Busan', 100, 300, 130, {
  //   sampleFactor: 0.25
  // });
}
function vidLoaded3() {
  videos[3].size(width, height);
  posesN[3] = ml5.poseNet(videos[3], modelLoaded3);
  // points = font.textToPoints('Washington DC', 100, 300, 130, {
  //   sampleFactor: 0.25
  // });
}

function gotHumans(humans) {
  if (humans.length > 0) {
    pose = humans[0].pose;
  }
  people = humans;
}

function modelLoaded0() {
  console.log('poseNet ready');
  poseNetReady0 = true;
  videos[0].loop();

  posesN[0].on('pose', function(results) {
    poses0 = results;
  });
  
}

function modelLoaded1() {
  console.log('poseNet ready');
  poseNetReady = true;
  videos[1].loop();

  posesN[1].on('pose', function(results) {
    poses1 = results;
  });
}

function modelLoaded2() {
  console.log('poseNet ready');
  poseNetReady = true;
  videos[2].loop();

  posesN[2].on('pose', function(results) {
    poses2 = results;
  });
}

function modelLoaded3() {
  console.log('poseNet ready');
  poseNetReady = true;
  videos[3].loop();

  posesN[3].on('pose', function(results) {
    poses3 = results;
  });
}

function draw() {
  if (poseNetReady0) work();
}

function work(){
  push();
  image(videos[currentVid], 0, 0, width, height);
  // console.log(posesN[0]);
  if (currentVid == 0) {
    poses = poses0;
  } else if (currentVid == 1) {
    poses = poses1;
  } else if (currentVid == 2) {
    poses = poses2;
  } else if (currentVid == 3) {
    poses = poses3;
  }
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    
    for (let j = 0; j < numNotes; j++) {
      musicalBoxes[j].hits(pose.keypoints[0]);
      musicalBoxes[j].hits(pose.keypoints[6]);
      musicalBoxes[j].hits(pose.keypoints[14]);
      // musicalBoxes[i].show();
      // fill(20 + i * 20, 60);
      // rect(i * width / numNotes, 0, width / numNotes, height);
    }
    // for (var k = 0; k < flockFont.length; k++) {
    //   var v = flockFont[k];
    //   v.behaviors(pose.keypoints[6]);
    // }
    // drawKeypoints();
    // drawSkeleton();
  }
  // for (var k = 0; k < flockFont.length; k++) {
  //   var v = flockFont[k];
  //   v.update();
  //   v.show();
  // }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
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
class MusicalBox {
  constructor(num) {
    this.x = num * width / numNotes;
    this.y = 0;
    this.width = width / numNotes;
    this.height = height;
    this.color = 20 + num * 20;

    this.highlight = false;

    this.show = function () {
      noStroke();
      if (this.highlight) {
        fill(this.color, 100);
      } else {
        fill(this.color, 60);
      }
      rect(this.x, this.y, this.width, this.height);
    };

    this.hits = function (nose) {

      if (nose.position.x > this.x && nose.position.x < this.x + this.width) {
        this.highlight = true;
        if (!sounds[num].isPlaying()) {
          sounds[num].play();
        }

        return true;
      }

      this.highlight = false;
      return false;
    };
  }
}

class FlockPoint {
  constructor(x, y) {
    this.pos = createVector(random(width), random(height));
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.r = 8;
    this.maxspeed = 10;
    this.maxforce = 1;
  }

  behaviors(posePoint) {
    var arrive = this.arrive(this.target);
    // flee posenet here
    var pose = createVector(posePoint.position.x, posePoint.position.y);
    var flee = this.flee(pose);

    arrive.mult(1);
    flee.mult(5);

    this.applyForce(arrive);
    this.applyForce(flee);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }

  show() {
    stroke(255);
    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
  }


  arrive(target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    var speed = this.maxspeed;
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxspeed);
    }
    desired.setMag(speed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  }

  flee(target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    if (d < 50) {
      desired.setMag(this.maxspeed);
      desired.mult(-1);
      var steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }
}
