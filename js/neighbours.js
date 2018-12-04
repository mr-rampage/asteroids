onmessage = function (e) {
  const moveables = e.data;
  const factor = 24;
  const clusters = groupByAxis(moveables, factor);

  postMessage(
    moveables
      .filter(moveable => !isStationary(moveable.velocity))
      .map(moveable =>
        [
          moveable,
          findCollisionCandidates(moveable, clusters, factor)
        ])
      .filter(([moveable, neighbours]) => neighbours.length > 0)
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
  const searchArea = factor >> 1;
  const basis = coordinate[axis];
  return [
    clusterIndex(basis - searchArea, factor),
    clusterIndex(basis, factor),
    clusterIndex(basis + searchArea, factor)
  ].filter(unique);
}

function isStationary(velocity) {
  return (velocity.x === 0 && velocity.y === 0);
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
