const neighbourWorker = new Worker('js/neighbours.js');

let thisLoop = new Date();
let lastLoop;

const assets = [];

function setupScene(context, moveables) {
  neighbourWorker.onmessage = function (e) {
    updateVelocity(
      moveables.reduce((map, moveable) => {
        map[moveable.id] = moveable;
        return map;
      }, {}),
      e.data
    );
    requestAnimationFrame(renderScene(context, calcNextFrame(context, moveables)));
  };

  for (let i = 0; i < moveables.length; i++) {
    assets.push(createPixelImage(6, randomColour()));
  }

  setInterval(() => neighbourWorker.postMessage(moveables), 16);

  requestAnimationFrame(renderScene(context, moveables));
}

function renderScene(context, moveables) {
  document.querySelector('#fps-counter').innerHTML = Math.floor(1000 / (thisLoop - lastLoop));
  lastLoop = thisLoop;
  thisLoop = new Date();

  return () => {
    clear(context);
    draw(
      context,
      moveables.map(moveable => moveable.coordinate)
    );
  };
}

function updateVelocity(moveableMap, collisions) {
  collisions.forEach(([id, moveable]) => {
    moveableMap[id].velocity = moveable.velocity;
  });
}

function calcNextFrame(context, moveables) {
  moveables.forEach(moveable => boundMoveable(context, mutableMove(moveable)));
  return moveables;
}

function boundMoveable(context, moveable) {
  if (moveable.coordinate.x < 0) {
    moveable.coordinate.x = context.canvas.width;
  } else if (moveable.coordinate.x > context.canvas.width) {
    moveable.coordinate.x = 0;
  }

  if (moveable.coordinate.y < 0) {
    moveable.coordinate.y = context.canvas.height;
  } else if (moveable.coordinate.y > context.canvas.height) {
    moveable.coordinate.y = 0;
  }

  return moveable;
}

function draw(context, points) {
  points.forEach((point, index) => renderPixel(context, assets[index], point));
}

function clear(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function renderPixel(context, image, coordinate) {
  const center = point(coordinate.x - (image.width >> 1), coordinate.y - (image.height >> 1));
  context.drawImage(image, center.x, center.y);
}

function createPixelImage(size, colour) {
  const canvas = document.createElement("canvas");
  canvas.width = size << 1;
  canvas.height = size << 1;

  const context = canvas.getContext("2d");
  context.fillStyle = colour;
  context.beginPath();
  context.arc(size, size, size, 0, 2 * Math.PI, true);
  context.fill();

  return canvas;
}
