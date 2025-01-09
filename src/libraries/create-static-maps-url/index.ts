import {assembleMarkerParams} from './assemble-marker-params';
import {assemblePathParams} from './assemble-path-params';
import {formatLocation} from './helpers';

import {StaticMapsApiOptions} from './types';
import {assembleMapTypeStyles} from './assemble-map-type-styles';

const STATIC_MAPS_BASE = 'https://maps.googleapis.com/maps/api/staticmap';

/**
 * Creates a URL for the Google Static Maps API with the specified parameters.
 *
 * @param {Object} options - The configuration options for the static map
 * @param {string} options.apiKey - Your Google Maps API key (required)
 * @param {number} options.width - The width of the map image in pixels (required)
 * @param {number} options.height - The height of the map image in pixels (required)
 * @param {StaticMapsLocation} [options.center] - The center point of the map (lat/lng or address).
 *  Required if no markers or paths or "visible locations" are provided.
 * @param {number} [options.zoom] - The zoom level of the map. Required if no markers or paths or "visible locations" are provided.
 * @param {1|2|4} [options.scale] - The resolution of the map (1, 2, or 4)
 * @param {string} [options.format] - The image format (png, png8, png32, gif, jpg, jpg-baseline)
 * @param {string} [options.mapType] - The type of map (roadmap, satellite, terrain, hybrid)
 * @param {string} [options.language] - The language of the map labels
 * @param {string} [options.region] - The region code for the map
 * @param {string} [options.map_id] - The Cloud-based map style ID
 * @param {StaticMapsMarker[]} [options.markers=[]] - Array of markers to display on the map
 * @param {StaticMapsPath[]} [options.paths=[]] - Array of paths to display on the map
 * @param {StaticMapsLocation[]} [options.visible=[]] - Array of locations that should be visible on the map
 * @param {MapTypeStyle[]} [options.style=[]] - Array of style objects to customize the map appearance
 *
 * @returns {string} The complete Google Static Maps API URL
 *
 * @throws {Error} If API key is not provided
 * @throws {Error} If width or height is not provided
 *
 * @example
 * const url = createStaticMapsUrl({
 *   apiKey: 'YOUR_API_KEY',
 *   width: 600,
 *   height: 400,
 *   center: { lat: 40.714728, lng: -73.998672 },
 *   zoom: 12,
 *   markers: [
 *     {
 *       location: { lat: 40.714728, lng: -73.998672 },
 *       color: 'red',
 *       label: 'A'
 *     }
 *   ],
 *   paths: [
 *     {
 *       coordinates: [
 *         { lat: 40.714728, lng: -73.998672 },
 *         { lat: 40.719728, lng: -73.991672 }
 *       ],
 *       color: '0x0000ff',
 *       weight: 5
 *     }
 *   ],
 *   style: [
 *     {
 *       featureType: 'road',
 *       elementType: 'geometry',
 *       stylers: [{color: '#00ff00'}]
 *     }
 *   ]
 * });
 *
 * // Results in URL similar to:
 * // https://maps.googleapis.com/maps/api/staticmap?key=YOUR_API_KEY
 * // &size=600x400
 * // &center=40.714728,-73.998672&zoom=12
 * // &markers=color:red|label:A|40.714728,-73.998672
 * // &path=color:0x0000ff|weight:5|40.714728,-73.998672|40.719728,-73.991672
 * // &style=feature:road|element:geometry|color:0x00ff00
 */
export function createStaticMapsUrl({
  apiKey,
  width,
  height,
  center,
  zoom,
  scale,
  format,
  mapType,
  language,
  region,
  mapId,
  markers = [],
  paths = [],
  visible = [],
  style = []
}: StaticMapsApiOptions) {
  if (!apiKey) {
    console.warn('API key is required');
  }
  if (!width || !height) {
    console.warn('Width and height are required');
  }

  const params: Record<string, string | number | null> = {
    key: apiKey,
    size: `${width}x${height}`,
    ...(center && {center: formatLocation(center)}),
    ...(zoom && {zoom}),
    ...(scale && {scale}),
    ...(format && {format}),
    ...(mapType && {maptype: mapType}),
    ...(language && {language}),
    ...(region && {region}),
    ...(mapId && {map_id: mapId})
  };

  const url = new URL(STATIC_MAPS_BASE);

  // Params that don't need special handling
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  // Assemble Markers
  for (const markerParam of assembleMarkerParams(markers)) {
    url.searchParams.append('markers', markerParam);
  }

  // Assemble Paths
  for (const pathParam of assemblePathParams(paths)) {
    url.searchParams.append('path', pathParam);
  }

  // Assemble visible locations
  if (visible.length) {
    url.searchParams.append(
      'visible',
      visible.map(location => formatLocation(location)).join('|')
    );
  }

  // Assemble Map Type Styles
  for (const styleString of assembleMapTypeStyles(style)) {
    url.searchParams.append('style', styleString);
  }

  return url.toString();
}
