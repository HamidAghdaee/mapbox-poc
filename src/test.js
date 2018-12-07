const {
  featureCollection,
  feature,
  toWgs84,
  point,
  toMercator,
  transformRotate,
  getCoord,
} = require('@turf/turf');
const isArray = require('lodash/isArray');

const boundaries = [
  [
    ['34.5350545101115', '39.7616679154688', '172.900918635171'],
    ['34.5350545101114', '30.4807026477851', '172.900918635171'],
    ['40.8683878434448', '30.4807026477851', '172.900918635171'],
    ['51.7850545101115', '30.480702647785', '172.900918635171'],
    ['51.7850545101115', '39.7616679154688', '172.900918635171'],
    ['45.7538045101115', '39.7616679154688', '172.900918635171'],
    ['34.5350545101115', '39.7616679154688', '172.900918635171'],
  ],
];

const pt = point([103.848527, 1.278178]);
const m = toMercator(pt);
const [x, y] = m.geometry.coordinates;

// const [feature] = relatedFeatures;
// const mercator = toMercator(feature);

const convertToGeoJSON = (boundaries, { lng, lat }, rotate) => {
  const pt = point([lng, lat]);
  const m = toMercator(pt);
  const [x, y] = m.geometry.coordinates;

  const convertPoint = p => {
    if (!isArray(p)) return;
    return [
      parseFloat(p[0]) * 0.3048 + x,
      parseFloat(p[1]) * 0.3048 + y,
      parseFloat(p[2]) * 0.3048,
    ];
  };

  const convertBoundary = boundary => boundary.map(p => convertPoint(p));
  const convertBoundaries = boundaries =>
    boundaries.map(b => convertBoundary(b));

  const f = feature({
    type: 'Polygon',
    coordinates: convertBoundaries(boundaries),
  });

  const fc = featureCollection([f]);
  const converted = toWgs84(fc);
  const rotated = transformRotate(converted, rotate);
  return rotated;
};

const convertBack = (feat, { lng, lat }, rotate) => {
  const pt = point([lng, lat]);
  const m = toMercator(pt);
  const [x, y] = m.geometry.coordinates;

  const rotated = transformRotate(feat, rotate);
  const converted = toMercator(rotated);
  const coordinates = converted.features[0].geometry.coordinates;
  const convertPoint = p => {
    if (!isArray(p)) return;
    return [(p[0] - x) / 0.3048, (p[1] - y) / 0.3048, p[2] / 0.3048];
  };

  const convertBoundary = boundary => boundary.map(p => convertPoint(p));
  const convertBoundaries = boundaries =>
    boundaries.map(b => convertBoundary(b));

  const f = feature({
    type: 'Polygon',
    coordinates: convertBoundaries(coordinates),
  });

  //   const fc = featureCollection([feature]);
  //   const converted = toWgs84(fc);
  return f;
};

const buildingOneLngLat = { lng: 103.848527, lat: 1.278178 };
const buildingOneGeoJSON = convertToGeoJSON(boundaries, buildingOneLngLat, -60);
const convertedBack = convertBack(buildingOneGeoJSON, buildingOneLngLat, 60);

console.log(buildingOneGeoJSON, convertedBack);

// var relatedFeatures = map.queryRenderedFeatures(undefined, {
//     layers: ['base floor plan'],
//     filter: ['==', 'id', 'cbf88a72-d092-11e7-9d13-0642b0acf810'],
//   });
