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

function multiply(vector, power) {
  return point(vector.x * power.x, vector.y * power.y);
}

function add(point1, point2) {
  return point(point1.x + point2.x, point1.y + point2.y);
}

function subtract(point1, point2) {
  return point(point1.x - point2.x, point1.y - point2.y);
}

function randomUnitVector() {
  return point(Math.random() * 2 - 1, Math.random() * 2 - 1);
}

function normalize(vector) {
  function hypotenus(vector) {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
  }
  const length = hypotenus(vector);
  return point(vector.x / length, vector.y / length);
}

function dot(vector1, vector2) {
  return vector1.x * vector2.x + vector1.y * vector2.y;
}

function copyVector(vector) {
  return point(vector.x, vector.y);
}