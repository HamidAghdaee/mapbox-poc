import {
  featureCollection,
  feature,
  toWgs84,
  point,
  toMercator,
  transformRotate,
} from '@turf/turf';
import isArray from 'lodash/isArray';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

const convertToGeoJSON = (data, { lng, lat }, rotate) => {
  const pt = point([lng, lat]);
  const m = toMercator(pt);
  const [x, y] = m.geometry.coordinates;

  console.log('iouyiouy', data, lng, lat, x, y);

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

  //   //take only the outer boundary for now
  //   const boundaries = get(data, 'data.attributes.boundaries');

  //   const floorCoordinates = convertBoundaries(boundaries);

  //   const floorOutline = feature({
  //     type: 'Polygon',
  //     coordinates: floorCoordinates,
  //   });

  const getFeatures = entities =>
    entities.map(entity => {
      const { boundaries, ...otherAtttributes } = entity.attributes;
      const { type, id, relationships } = entity;

      const f = feature(
        {
          type: 'Polygon',
          coordinates: convertBoundaries(boundaries),
        },
        {
          type,
          id,
          relationships,
          ...otherAtttributes,
        },
        { id }
      );

      return f;
    });

  const features = getFeatures(data.included);
  const fc = featureCollection(features);
  const converted = toWgs84(fc);
  //const rotated = transformRotate(converted, rotate);
  return converted;
};

export default convertToGeoJSON;
