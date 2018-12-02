function moveable(coordinate, velocity, acceleration) {
    return {coordinate, velocity, acceleration};
}

function point(x, y) {
    return {x, y};
}

function move({coordinate, velocity, acceleration}) {
    return moveable(
        add(coordinate, velocity),
        add(velocity, acceleration),
        acceleration
    )
}

function multiply(vector, power) {
  return point(vector.x * power.x, vector.y * power.y);
}

function add(point1, point2) {
  return point(point1.x + point2.x, point1.y + point2.y);
}

function randomUnitVector() {
  const vector = [Math.random() * 2 - 1, Math.random() * 2 - 1];
  return point.apply(null, normalize(vector));
}

function normalize(vector) {
  function hypotenus(vector) {
    return Math.sqrt(vector.reduce((length, basis) => length + basis * basis, 0))
  }
  const length = hypotenus(vector);
  return vector.map(basis => basis / length);
}
