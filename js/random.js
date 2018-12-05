function randomColour() {
  return `rgba(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)}, 255)`;
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
