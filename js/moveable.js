let i = 0;

function moveable(coordinate, velocity, acceleration, id = i++) {
    return {coordinate, velocity, acceleration, id};
}

function point(x, y) {
    return {x, y};
}

function move({coordinate, velocity, acceleration, id}) {
    return moveable(
        add(coordinate, velocity),
        add(velocity, acceleration),
        acceleration,
        id
    )
}

function add(point1, point2) {
  return point(point1.x + point2.x, point1.y + point2.y);
}

function subtract(point1, point2) {
  return point(point1.x - point2.x, point1.y - point2.y);
}

function normalize(vector) {
  const length = distance(vector, point(0, 0));
  return length ? point(vector.x / length, vector.y / length) : vector;
}

function distance(point1, point2) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}
