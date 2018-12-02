onmessage = function (e) {
  const points = e.data;
  const factor = 24;
  const groupX = groupBy(points, 'x', factor);
  const groupY = groupBy(points, 'y', factor);

  postMessage(
    points
      .map(point =>
        [
          point,
          intersect(
            areaSearch(point.x, factor)
              .reduce((group, index) => getGroup(groupX, index).concat(group), []),
            areaSearch(point.y, factor)
              .reduce((group, index) => getGroup(groupY, index).concat(group), []),
          ).filter(neighbour => neighbour !== point)
        ])
      .filter(([point, neighbours]) => neighbours.length > 0)
  );
};

function groupBy(points, axis, factor) {
  return points.reduce(
    (result, point) => {
      let index = areaIndex(point[axis], factor);
      result[index] = (result[index] || []).concat([point]);
      return result;
    },
    []);
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
  return set1.filter(point => -1 !== set2.indexOf(point));
}

function unique(value, index, self) {
  return self.indexOf(value) === index;
}
