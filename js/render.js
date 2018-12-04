const neighbourWorker = new Worker('js/neighbours.js');
const blueDot = createPixelImage(6, 'blue');

let thisLoop = new Date();
let lastLoop;
let connections;
let collisionsUpdated;

function setupScene(context, moveables) {
  context.strokeStyle = 'red';
  neighbourWorker.onmessage = function (e) {
    connections = e.data;
    collisionsUpdated = false;
  };

  requestAnimationFrame(renderScene(context, moveables));
}

function handleCollisions(collisions, moveables) {
  console.info(moveables.length);
  if (collisionsUpdated === false) {
    const moveableMap = moveables.reduce((map, moveable) => {
      map[moveable.id] = moveable;
      return map;
    },{});

    collisions
      .reduce((results, [moveable, candidates]) => {
        results.push([
          moveable.id,
          candidates
            .filter(candidate => isColliding(moveable, candidate))
            .map(candidate => collide(moveable, candidate))
        ]);
        return results;
      }, [])
      .forEach(([id, vectors]) => {
        if (vectors.length) {
          moveableMap[id].velocity = vectors.reduce((result, vector) =>
            // fixme: shouldn't be normalized - separate velocity from vector
            normalize(add(result, vector), point(0, 0)));
        }
      });

    collisionsUpdated = true;
  }

  function isColliding(moveable1, moveable2) {
    return distance(moveable1.coordinate, moveable2.coordinate) < 6;
  }
}

function collide(moveable1, moveable2) {
  const normal = normalize(subtract(moveable1.velocity, moveable2.velocity));
  return subtract(moveable1.velocity, normal);
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
      handleCollisions(connections, moveables);
    }

    draw(
      context,
      moveables.map(moveable => moveable.coordinate)
    );

    setTimeout(() => requestAnimationFrame(renderScene(context, calcNextFrame(context, moveables))), 8);
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
