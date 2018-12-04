const container = document.querySelector('#render-space');
const canvas = container.appendChild(createWorld(container));

const context = canvas.getContext('2d');

const moveables = randomMoveables(200);
setupScene(context, moveables);

function createWorld(container) {
  const width = document.createAttribute('width');
  width.value = container.offsetWidth;

  const height = document.createAttribute('height');
  height.value = container.offsetHeight;

  const layer = document.createElement('canvas');
  layer.setAttributeNode(width);
  layer.setAttributeNode(height);

  return layer;
}

function randomMoveables(numberOfMoveables) {
  return Array(numberOfMoveables)
    .fill(null)
    .map(() => moveable(
      randomPoint(container.offsetWidth, container.offsetHeight),
      point(randomInt(-5, 5), randomInt(-5, 5)),
      point(0, 0)
    ));
}

function randomPoint(x, y) {
  return point(randomInt(0, x), randomInt(0, y));
}

function randomInt(min, max) {
  return Math.floor((max - min) * Math.random()) + min;
}

