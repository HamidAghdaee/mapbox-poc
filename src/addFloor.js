const addFloor = (map, floorGeoJSON, srcName) => {
  map.on('zoomend', function() {
    var relatedFeatures = map.queryRenderedFeatures(undefined, {
      layers: ['base floor plan'],
      filter: ['==', ['get', 'id'], 'cbf88a72-d092-11e7-9d13-0642b0acf810'],
    });

    console.log(relatedFeatures);
    const srcFeatures = map.querySourceFeatures(srcName, {
      layers: ['base floor plan'],
      filter: ['==', ['get', 'id'], 'cbf88a72-d092-11e7-9d13-0642b0acf810'],
    });
    console.log(srcFeatures);
    console.log(relatedFeatures);
  });

  map.on('click', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['fill layer'],
    });
    console.log(features[0], features[0].id);

    map.setFeatureState(features[0], { foo: 'foo' });
  });

  map.on('load', function() {
    map.addSource(srcName, {
      type: 'geojson',
      data: floorGeoJSON,
    });
    map.addLayer({
      id: 'base floor plan',
      type: 'line',
      source: srcName,
      filter: ['==', 'type', 'room'],
      layout: {},
      paint: {},
      minzoom: 14,
    });

    map.addLayer({
      id: 'fill layer',
      type: 'fill',
      source: srcName,
      filter: ['==', 'type', 'room'],
      layout: {},
      paint: { 'fill-opacity': 0 },
      minzoom: 14,
    });
    map.addLayer({
      id: 'chairs',
      type: 'fill-extrusion',
      source: srcName,
      minzoom: 17,
      filter: ['==', 'objectType', 'CHAIR'],
      layout: {},
      paint: {
        'fill-extrusion-color': 'hsl(0, 0%, 81%)',
        'fill-extrusion-height': 0.5,
        'fill-extrusion-base': 0,
      },
    });

    map.addLayer({
      id: 'tables',
      type: 'fill-extrusion',
      source: srcName,
      minzoom: 17,
      filter: ['==', 'objectType', 'TABLE'],
      layout: {},
      paint: {
        'fill-extrusion-color': 'hsl(261, 100%, 97%)',
        'fill-extrusion-opacity': 1,
        'fill-extrusion-height': 0.75,
        'fill-extrusion-base': 0.5,
      },
    });

    map.addLayer({
      id: 'hallways',
      type: 'fill',
      source: srcName,
      filter: ['==', 'roomType', 'HALLWAY'],
      layout: {},
      paint: { 'fill-color': 'hsl(45, 100%, 94%)' },
      minzoom: 14,
    });

    map.addLayer({
      id: 'meeting rooms',
      type: 'fill-extrusion',
      source: srcName,
      filter: ['==', 'programType', 'MEET'],
      layout: {},
      paint: {
        'fill-extrusion-height': 7,
        'fill-extrusion-opacity': 0.72,
        'fill-extrusion-color': 'hsl(193, 100%, 86%)',
      },
      minzoom: 14,
    });

    map.addLayer({
      id: 'lounge rooms',
      type: 'fill-extrusion',
      source: srcName,
      filter: ['==', 'roomType', 'LOUNGE'],
      layout: {},
      paint: {
        'fill-extrusion-height': 7,
        'fill-extrusion-opacity': 0.72,
        'fill-extrusion-color': 'hsl(42, 100%, 71%)',
      },
      minzoom: 14,
    });

    map.addLayer({
      id: 'Work rooms',
      type: 'fill-extrusion',
      source: srcName,
      filter: ['==', 'programType', 'WORK'],
      layout: {},
      paint: {
        'fill-extrusion-height': 7,
        'fill-extrusion-opacity': 0.72,
        'fill-extrusion-color': 'hsl(207, 100%, 95%)',
      },
      minzoom: 14,
    });

    map.addLayer({
      id: 'lounge image',
      type: 'symbol',
      source: srcName,
      minzoom: 17,
      filter: ['==', 'roomType', 'LOUNGE'],
      layout: { 'icon-image': 'cafe-15', 'icon-offset': [0, 0] },
      paint: {},
    });

    map.addLayer({
      id: 'Work room numbers',
      type: 'symbol',
      source: srcName,
      minzoom: 17.3,
      filter: ['==', 'programType', 'WORK'],
      layout: {
        'text-field': ['to-string', ['get', 'number']],
        'symbol-avoid-edges': true,
      },
      paint: {},
    });
  });
};

export default addFloor;
