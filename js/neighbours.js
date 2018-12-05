importScripts('moveable.js');

onmessage = function ({data: moveables}) {
  const factor = 24;
  const clusters = groupByAxis(moveables, factor);

  postMessage(
    moveables
      .map(moveable =>
        [
          moveable,
          findCollisionCandidates(moveable, clusters, factor)
        ])
      .filter(([moveable, neighbours]) => neighbours.length > 0)
      .map(handleCollisions.bind(null, factor))
      .filter(vectorUpdates => vectorUpdates.length)
  );
};

function groupByAxis(moveables, factor) {
  return moveables
    .reduce((cluster, moveable) => {
      addToCluster(cluster.x, moveable, 'x');
      addToCluster(cluster.y, moveable, 'y');
      return cluster;
    }, {x: [], y: []});

  function addToCluster(cluster, moveable, axis) {
    let index = clusterIndex(moveable.coordinate[axis], factor);
    cluster[index] = (cluster[index] || []).concat([moveable]);
  }
}

function findCollisionCandidates(moveable, cluster, factor) {
  return intersect(
    areaSearch(moveable, 'x', factor).reduce((group, index) => getGroup(cluster.x, index).concat(group), []),
    areaSearch(moveable, 'y', factor).reduce((group, index) => getGroup(cluster.y, index).concat(group), []),
  ).filter(neighbour => neighbour !== moveable)
}

function areaSearch({coordinate,}, axis, factor) {
  const searchArea = factor * 0.75;
  const basis = coordinate[axis];
  return [
    clusterIndex(basis - searchArea, factor),
    clusterIndex(basis, factor),
    clusterIndex(basis + searchArea, factor)
  ].filter(unique);
}

function clusterIndex(basis, factor) {
  return (basis / factor) >> 0;
}

function getGroup(neighbourHood, index) {
  return (index < 0 || index > neighbourHood.length) ? [] : neighbourHood[index] || [];
}

function intersect(set1, set2) {
  return set1.filter(value => -1 !== set2.indexOf(value));
}

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

function isCollision(moveable1, moveable2, factor) {
  return distance(moveable1.coordinate, moveable2.coordinate) < factor >> 1;
}

function handleCollisions(factor, [target, neighbours]) {
  const newVector = resultingVector(
    target,
    neighbours.filter(neighbour => isCollision(target, neighbour, factor))
  );

  return newVector ?
    [
      target.id,
      moveable(
        target.coordinate,
        multiply(newVector, isStationary(target.velocity) ? 1 : distance(target.velocity)),
        target.acceleration
      )
    ] :
    [
    ];
}

function resultingVector(target, vectors) {
  const result = vectors.map(neighbour => collide(target, neighbour));
  return result.length ?
    normalize(result.reduce((result, vector) => add(result, vector))) :
    null;
}

function collide(moveable1, moveable2) {
  return moveable2.velocity;
}
