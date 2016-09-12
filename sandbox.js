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
  distance,
  GRAVITY = 0, // how much gravity affects the particles
  PARTICLES = 1000, // the amount of particles generated
  RADIUS = 10, // the radius of the particles
  FRICTION = 0.5, // MUST be less than 1. how much the particles slow down
  FRICTION_ENABLED = true,
  DISTANCE = 200, // how close the mouse must be to the particles to affect them
  REPULSIVENESS = 250, // how much the mouse pushes the particles (higher = less repulsive)
  friction = (1 - FRICTION) * 1000;

for (var i = 0; i < PARTICLES; i++) {
  orbs.push(particle.create(width / 2, height / 2, Math.random() * 10 + 1, 2 * Math.PI * Math.random(), GRAVITY));
  orbs[i].radius = RADIUS;
  orbs[i].bounce = -0.9;
}

update();

function update() {
  context.clearRect(0, 0, width, height);

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
      orbs[i].velocity.setX(orbs[i].velocity.getX() - orbs[i].velocity.getX() / friction);
      orbs[i].velocity.setY(orbs[i].velocity.getY() - orbs[i].velocity.getY() / friction);
    }
    // if the mouse is close enough, accelerate the particle
    if (distance < DISTANCE) {
      orbs[i].accelerate(accelerate);

    }

    // detect edge collisions
    if (orbs[i].position.getX() + orbs[i].radius > width) {
      orbs[i].position.setX(width - orbs[i].radius);
      orbs[i].velocity.setX(orbs[i].velocity.getX() * orbs[i].bounce);
    }
    if (orbs[i].position.getX() - orbs[i].radius < 0) {
      orbs[i].position.setX(orbs[i].radius);
      orbs[i].velocity.setX(orbs[i].velocity.getX() * orbs[i].bounce);
    }
    if (orbs[i].position.getY() + orbs[i].radius > height) {
      orbs[i].position.setY(height - orbs[i].radius);
      orbs[i].velocity.setY(orbs[i].velocity.getY() * orbs[i].bounce);
    }
    if (orbs[i].position.getY() - orbs[i].radius < 0) {
      orbs[i].position.setY(orbs[i].radius);
      orbs[i].velocity.setY(orbs[i].velocity.getY() * orbs[i].bounce);
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

window.addEventListener('mousemove', mouseMove);
window.addEventListener('resize', resize);

document.body.onmousedown = function () {
  mouseDown = true;
};
document.body.onmouseup = function () {
  mouseDown = false;
};

function mouseMove(e) {
  if (e.pageX || e.pageY) {
    mousePosX = e.pageX;
    mousePosY = e.pageY;
  } else if (e.clientX || e.clientY) {
    mousePosX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    mousePosY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
