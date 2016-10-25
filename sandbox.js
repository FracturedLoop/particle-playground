var canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  width = canvas.width = window.innerWidth,
  height = canvas.height = window.innerHeight,
  mouseDown = false,
  mousePosX,
  mousePosY,
  angle,
  orbs = [],
  accelerate = vector.create(1, 1),
  mouse = vector.create(mousePosX, mousePosY),
  optionsIsOpen = false,
  distance,
  GRAVITY = 0, // how much gravity affects the particles
  PARTICLES = 250, // the amount of particles generated
  RADIUS = 10, // the radius of the particles
  FRICTION = 0.1, // MUST be less than 1. how much the particles slow down
  FRICTION_ENABLED = false,
  DISTANCE = 200, // how close the mouse must be to the particles to affect them
  REPULSIVENESS = 250, // how much the mouse pushes the particles (higher = less repulsive)
  LAUNCH_VELOCITY = 1,
  LAUNCH_VARIATION = 10,
  BOUNCINESS = 0.9,
  BACKGROUND_COLOR = '#607d8b',
  PARTICLE_COLOR = "#000";

Velocity(document.getElementById('options'), {
  translateY: '-100%'
});
Velocity(document.getElementById('options-handle'), {
  translateY: 0
});


function setup() {
  orbs = [];

  var gravityValue = document.getElementById('gravity').value;
  if (gravityValue !== "") {
    GRAVITY = parseFloat(gravityValue);
  } else {
    GRAVITY = 0;
  }

  var frictionValue = document.getElementById('friction').value;
  if (frictionValue !== "") {
    FRICTION = parseFloat(frictionValue);
  } else {
    FRICTION = 0.1;
  }

  var distanceValue = document.getElementById('distance').value;
  if (distanceValue !== "") {
    DISTANCE = parseInt(distanceValue);
  }

  var repulseValue = document.getElementById('repulsiveness').value;
  if (repulseValue !== "") {
    REPULSIVENESS = parseInt(repulseValue);
  }

  var particleCountValue = document.getElementById('particle-count').value;
  if (particleCountValue !== "") {
    PARTICLES = parseInt(particleCountValue);
  }

  var particleRadiusValue = document.getElementById('particle-radius').value;
  if (particleRadiusValue !== "") {
    RADIUS = parseInt(particleRadiusValue);
  }

  var particleBounceValue = document.getElementById('particle-bounce').value;
  if (particleBounceValue !== "") {
    BOUNCINESS = parseFloat(particleBounceValue);
  }

  var particleLaunchSpeed = document.getElementById('launch-speed').value;
  if (particleLaunchSpeed !== "") {
    LAUNCH_VELOCITY = parseInt(particleLaunchSpeed);
  }

  var particleLaunchVariation = document.getElementById('launch-variation').value;
  if (particleLaunchVariation !== "") {
    LAUNCH_VARIATION = parseInt(particleLaunchVariation);
  }

  var frictionDisabledValue = document.getElementById('friction-disabled').checked;
  FRICTION_ENABLED = !frictionDisabledValue;

  var bgColorValue = document.getElementById('bg-color').value;
  if (bgColorValue !== "") {
    BACKGROUND_COLOR = bgColorValue;
  }

  var particleColorValue = document.getElementById('particle-color').value;
  if (particleColorValue !== "") {
    PARTICLE_COLOR = particleColorValue;
  }

  for (var i = 0; i < PARTICLES; i++) {
    orbs.push(particle.create(width / 2, height / 2, Math.random() * LAUNCH_VARIATION + LAUNCH_VELOCITY, 2 * Math.PI * Math.random(), GRAVITY / 60));
    orbs[i].radius = RADIUS;
    orbs[i].bounce = BOUNCINESS;
  }
}

setup();
update();

function update() {
  context.clearRect(0, 0, width, height);
  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, width, height);

  context.fillStyle = PARTICLE_COLOR;

  // for each particle...
  for (var i = 0; i < orbs.length; i++) {

    // determine the distance to the mouse pointer and set the vector accelerate accordingly
    distance = Math.sqrt(Math.abs(mouse.getX() - orbs[i].position.getX()) * Math.abs(mouse.getX() - orbs[i].position.getX()) + Math.abs(mouse.getY() - orbs[i].position.getY()) * Math.abs(mouse.getY() - orbs[i].position.getY()));
    angle = Math.atan2(orbs[i].position.getY() - mouse.getY(), orbs[i].position.getX() - mouse.getX());
    if (mouse.getX() !== undefined && mouse.getY() !== undefined) {
      accelerate.setLength(200 / REPULSIVENESS - distance / REPULSIVENESS);
      accelerate.setAngle(angle);
    }

    if (mouseDown) {
      accelerate.setLength(accelerate.getLength() * -1);
    }

    // friction
    if (FRICTION_ENABLED) {
      orbs[i].velocity.setX(orbs[i].velocity.getX() - orbs[i].velocity.getX() * FRICTION / 10);
      orbs[i].velocity.setY(orbs[i].velocity.getY() - orbs[i].velocity.getY() * FRICTION / 10);
    }
    // if the mouse is close enough, accelerate the particle
    if (distance < DISTANCE) {
      orbs[i].accelerate(accelerate);
    }

    // detect edge collisions
    if (orbs[i].position.getX() + orbs[i].radius > width) {
      orbs[i].position.setX(width - orbs[i].radius);
      orbs[i].velocity.setX(orbs[i].velocity.getX() * -1 * orbs[i].bounce);
    }
    if (orbs[i].position.getX() - orbs[i].radius < 0) {
      orbs[i].position.setX(orbs[i].radius);
      orbs[i].velocity.setX(orbs[i].velocity.getX() * -1 * orbs[i].bounce);
    }
    if (orbs[i].position.getY() + orbs[i].radius > height) {
      orbs[i].position.setY(height - orbs[i].radius);
      orbs[i].velocity.setY(orbs[i].velocity.getY() * -1 * orbs[i].bounce);
    }
    if (orbs[i].position.getY() - orbs[i].radius < 0) {
      orbs[i].position.setY(orbs[i].radius);
      orbs[i].velocity.setY(orbs[i].velocity.getY() * -1 * orbs[i].bounce);
    }

    // update the particle's location
    orbs[i].update();

    context.beginPath();
    context.arc(orbs[i].position.getX(), orbs[i].position.getY(), orbs[i].radius, 0, Math.PI * 2, false);
    context.fill();

  }

  mouse.setX(mousePosX);
  mouse.setY(mousePosY);

  requestAnimationFrame(update);
}

function showOptions() {
  console.log("It works");
  if (!optionsIsOpen) {
    Velocity(document.getElementById('options-handle'), {
      translateY: document.getElementById('options').offsetHeight
    });
    Velocity(document.getElementById('options'), {
      translateY: 0
    });
    Velocity(canvas, {
      height: window.innerHeight - document.getElementById('options').offsetHeight
    });
    optionsIsOpen = true;
  } else {
    Velocity(document.getElementById('options-handle'), {
      translateY: 0
    });
    Velocity(document.getElementById('options'), {
      translateY: '-100%'
    });
    Velocity(canvas, {
      height: window.innerHeight
    });
    optionsIsOpen = false;
  }
}

document.getElementById('options-handle').addEventListener('mousedown', showOptions);

window.addEventListener('mousemove', mouseMove);

// added touch support here
// emulate the mouse up
window.addEventListener('touchend', function(evt){
  mouseDown = false;
});
// emulate touch support here
// move the mouse position on the start
window.addEventListener('touchstart', function(evt){
  var touches = evt.changedTouches;
  for(var i=0;i<touches.length;i++) {
    mousePosX = touches[i].pageX;
    mousePosY = touches[i].pageY;
  }
  mouseDown = true;
});


window.addEventListener('resize', resize);

document.body.onmousedown = function () {
  mouseDown = true;
};
document.body.onmouseup = function () {
  mouseDown = false;
};

function mouseMove(event) {
    mousePosX = event.pageX;
    mousePosY = event.pageY;
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
