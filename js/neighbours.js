onmessage = function (e) {
  const moveables = e.data;
  const factor = 24;

  const clusters = groupByAxis(moveables, factor);

  postMessage(
    moveables
      .map(moveable =>
        [
          moveable,
          intersect(
            areaSearch(moveable.coordinate.x, factor)
              .reduce((group, index) => getGroup(clusters.x, index).concat(group), []),
            areaSearch(moveable.coordinate.y, factor)
              .reduce((group, index) => getGroup(clusters.y, index).concat(group), []),
          ).filter(neighbour => neighbour !== moveable)
        ])
      .filter(([moveable, neighbours]) => neighbours.length > 0)
  );
};

function groupByAxis(moveables, factor) {
  return moveables
    .reduce((cluster, moveable) => {
      addToCluster(cluster, moveable, 'x');
      addToCluster(cluster, moveable, 'y');
      return cluster;
    }, {x: {}, y: {}});

  function addToCluster(cluster, moveable, axis) {
    let index = areaIndex(moveable.coordinate[axis], factor);
    cluster[axis][index] = (cluster[axis][index] || []).concat([moveable]);
  }
}


function areaSearch(basis, factor) {
  const searchArea = factor >> 1;
  return [
    areaIndex(basis - searchArea, factor),
    areaIndex(basis, factor),
    areaIndex(basis + searchArea, factor)
  ].filter(unique);
}

function areaIndex(basis, factor) {
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
