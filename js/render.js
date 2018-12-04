const neighbourWorker = new Worker('js/neighbours.js');
const blueDot = createPixelImage(6, 'blue');

let thisLoop = new Date();
let lastLoop;
let connections;

function setupScene(context, moveables) {
  context.strokeStyle = 'red';
  neighbourWorker.onmessage = function (e) {
    connections = e.data;
  };

  requestAnimationFrame(renderScene(context, moveables));
}

function renderScene(context, moveables) {
  document.querySelector('#fps-counter').innerHTML = Math.floor(1000 / (thisLoop - lastLoop));
  lastLoop = thisLoop;
  thisLoop = new Date();

  neighbourWorker.postMessage(moveables);

  return () => {
    clear(context);

    if (connections) {
      connections.forEach(([moveable, neighbours]) => {
        renderConnections(context, moveable.coordinate, neighbours.map(moveable => moveable.coordinate));
      });
    }

    draw(
      context,
      moveables.map(moveable => moveable.coordinate)
    );

    requestAnimationFrame(renderScene(context, calcNextFrame(context, moveables)));
  };
}

function calcNextFrame(context, moveables) {
  return moveables.map(moveable => boundMoveable(context, move(moveable)));
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
  points.forEach(point => renderPixel(context, blueDot, point));
}

function clear(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function renderConnections(context, root, points) {
  points.forEach(point => {
    renderLine(context, root, point)
  });
}

function renderPixel(context, image, coordinate) {
  const center = point(coordinate.x - (image.width >> 1), coordinate.y - (image.height >> 1));
  context.drawImage(image, center.x, center.y);
}

function renderLine(context, source, destination) {
  context.beginPath();
  context.moveTo(source.x, source.y);
  context.lineTo(destination.x, destination.y);
  context.stroke();
}

function createPixelImage(size, colour) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  context.fillStyle = colour;
  context.fillRect(0, 0, size, size);

  return canvas;
}
