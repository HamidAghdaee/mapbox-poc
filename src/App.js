import React from 'react';
import mapboxgl from 'mapbox-gl';
import buildingOneData from './data/71_robinson_14th_floor.json';
import buildingTwoData from './data/city_house_2nd_floor.json';
import convertToGeoJSON from './convertToGeoJSON';
import addFloor from './addFloor';
import { featureCollection } from '@turf/turf';
const buildingOneLngLat = { lng: 103.848527, lat: 1.278178 };

const buildingTwoLngLat = { lng: 103.849463, lat: 1.281243 };

const buildingOneGeoJSON = convertToGeoJSON(
  buildingOneData,
  buildingOneLngLat,
  -60
);
const buildingTwoGeoJSON = convertToGeoJSON(
  buildingTwoData,
  buildingTwoLngLat,
  210
);

const dataset = featureCollection([
  ...buildingOneGeoJSON.features,
  ...buildingTwoGeoJSON.features,
]);

console.log(JSON.stringify(dataset));
mapboxgl.accessToken =
  'pk.eyJ1IjoiaGFtaWRhZ2hkYWVlIiwiYSI6ImNqcDRvNzdtZTA0YjEza3A0emI3d3k2OXUifQ.R7u6cbGFHNj2XrFA9_cDSQ';

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 5,
      lat: 34,
      zoom: 2,
    };
  }
  componentDidMount() {
    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
    });

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/hamidaghdaee/cjpuho9120ctb2qpse7r2zv9e',
      center: [103.850067, 1.28122],
      zoom: 20,
    });

    addFloor(map, dataset, 'demo');
    // addFloor(map, buildingTwoGeoJSON, 'city_house');

    map.on('move', () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });

    map.on('click', function(e) {
      // var features = map.queryRenderedFeatures(e.point, {
      //   layers: ['Work rooms'],
      // });
      // if (features && features.length) {
      //   var status = features[0].properties.status;
      //   console.log(e.lngLat.lng);
      //   // Populate the popup and set its coordinates
      //   // based on the feature found.
      //   popup
      //     .setLngLat(e.lngLat)
      //     .setHTML(status)
      //     .addTo(map);
      // }
    });
  }

  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div
          ref={el => (this.mapContainer = el)}
          className="absolute top right left bottom"
        />
      </div>
    );
  }
}

export default Application;
