import {initialize} from '@googlemaps/jest-mocks';

import {createStaticMapsUrl} from '../create-static-maps-url';

const requiredParams = {
  apiKey: 'test-api-key',
  width: 600,
  height: 400
};

beforeEach(() => {
  initialize();
});

describe('createStaticMapsUrl', () => {
  const API_KEY = 'test-api-key';

  test('creates basic URL with required parameters', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      center: {lat: 40.714728, lng: -73.998672},
      zoom: 12
    });
    expect(url).toMatch(
      /^https:\/\/maps\.googleapis\.com\/maps\/api\/staticmap/
    );
    expect(url).toContain('center=40.714728%2C-73.998672');
    expect(url).toContain('zoom=12');
    expect(url).toContain('size=600x400');
    expect(url).toContain(`key=${API_KEY}`);
  });

  test('includes map type', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      center: {lat: 40.714728, lng: -73.998672},
      zoom: 12,
      mapType: google.maps.MapTypeId.SATELLITE
    });
    expect(url).toContain('maptype=satellite');
  });

  test('handles single marker', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      markers: [{location: {lat: 40.714728, lng: -73.998672}}]
    });

    const markerParam = encodeURIComponent('40.714728,-73.998672');

    expect(url).toContain(`markers=${markerParam}`);
  });

  test('handles multiple markers with same style', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      center: {lat: 40.714728, lng: -73.998672},
      markers: [
        {location: {lat: 40.714728, lng: -73.998672}, color: 'blue'},
        {location: {lat: 41.715728, lng: -72.999672}, color: 'blue'}
      ]
    });

    const markerParam = encodeURIComponent(
      `color:blue|40.714728,-73.998672|41.715728,-72.999672`
    );

    expect(url).toContain(`markers=${markerParam}`);
  });

  test('handles multiple markers with different style', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      center: {lat: 40.714728, lng: -73.998672},
      markers: [
        {location: {lat: 40.714728, lng: -73.998672}, color: 'blue'},
        {location: {lat: 41.715728, lng: -72.999672}, color: 'red'}
      ]
    });
    const blueMarkerParam = encodeURIComponent(
      `color:blue|40.714728,-73.998672`
    );
    const redMarkerParam = encodeURIComponent(`color:red|41.715728,-72.999672`);

    expect(url).toContain(`markers=${blueMarkerParam}`);
    expect(url).toContain(`markers=${redMarkerParam}`);
  });

  test('includes custom marker styles', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      center: {lat: 40.714728, lng: -73.998672},
      markers: [
        {
          location: {lat: 40.714728, lng: -73.998672},
          color: 'red',
          label: 'A',
          size: 'mid'
        }
      ]
    });
    const markerParam = encodeURIComponent(
      'color:red|label:A|size:mid|40.714728,-73.998672'
    );

    expect(url).toContain(`markers=${markerParam}`);
  });

  test('includes scale parameter', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      center: {lat: 40.714728, lng: -73.998672},
      scale: 2
    });
    expect(url).toContain('scale=2');
  });

  test('includes format parameter', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      center: {lat: 40.714728, lng: -73.998672},
      format: 'png32'
    });
    expect(url).toContain('format=png32');
  });

  test('includes language parameter', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      center: {lat: 40.714728, lng: -73.998672},
      language: 'de'
    });

    expect(url).toContain(`language=de`);
  });

  test('includes region parameter', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      center: {lat: 40.714728, lng: -73.998672},
      region: 'en'
    });

    expect(url).toContain(`region=en`);
  });

  test('includes map_id parameter', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      center: {lat: 40.714728, lng: -73.998672},
      mapId: '8e0a97af9386fef'
    });
    const encodedMapId = encodeURIComponent('8e0a97af9386fef');
    expect(url).toContain(`map_id=${encodedMapId}`);
  });

  test('handles single path', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      paths: [
        {
          coordinates: [
            {lat: 40.737102, lng: -73.990318},
            {lat: 40.749825, lng: -73.987963}
          ],
          color: 'blue',
          weight: 5
        }
      ]
    });
    const encodedPath = encodeURIComponent(
      'color:blue|weight:5|40.737102,-73.990318|40.749825,-73.987963'
    );
    expect(url).toContain(`path=${encodedPath}`);
  });

  test('handles multiple paths with different styles', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      paths: [
        {
          coordinates: [{lat: 40.737102, lng: -73.990318}, 'Hamburg, Germany'],
          color: 'blue',
          weight: 5
        },
        {
          coordinates: [
            {lat: 40.737102, lng: -73.990318},
            {lat: 40.736102, lng: -73.989318}
          ],
          color: 'red',
          weight: 2
        }
      ]
    });
    const encodedPath1 = encodeURIComponent(
      'color:blue|weight:5|40.737102,-73.990318|Hamburg, Germany'
    ).replace(/%20/g, '+');
    const encodedPath2 = encodeURIComponent(
      'color:red|weight:2|40.737102,-73.990318|40.736102,-73.989318'
    );
    expect(url).toContain(`path=${encodedPath1}`);
    expect(url).toContain(`path=${encodedPath2}`);
  });

  test('includes style parameters', () => {
    const url = createStaticMapsUrl({
      ...requiredParams,
      center: {lat: 40.714728, lng: -73.998672},
      style: [
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#00ff00'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#0000ff'}]
        }
      ]
    });

    const style1 = encodeURIComponent(
      'feature:road|element:geometry|color:0x00ff00'
    );
    const style2 = encodeURIComponent(
      'feature:water|element:geometry|color:0x0000ff'
    );
    expect(url).toContain(`style=${style1}`);
    expect(url).toContain(`style=${style2}`);
  });
});
