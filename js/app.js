const container = document.querySelector('#render-space');
const canvas = container.appendChild(createWorld(container));

const context = canvas.getContext('2d');

const moveables = randomMoveables(1000);
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
      multiply(randomUnitVector(), randomPoint(5, 5)),
      point(0, 0)
    ));
}

function randomPoint(x, y) {
  return point(randomInt(0, x), randomInt(0, y));
}

function randomInt(min, max) {
  return Math.floor((max - min) * Math.random());
}

function distance(point1, point2) {
  return Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
}

function cursorPosition(event) {
  const rect = event.target.parentElement.getBoundingClientRect();
  return point(event.clientX - rect.left, event.clientY - rect.top);
}

function closestPoint(target, set) {
  const distanceToTarget = distance.bind(null, target);
  return set.reduce((closest, point) => {
    const distance = distanceToTarget(point);
    if (closest.distance) {
      if (closest.distance > distance) {
        return {distance, point}
      } else {
        return closest;
      }
    } else {
      return {distance, point}
    }
  }, {}).point;
}

