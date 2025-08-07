import {formatLocation, formatParam} from './helpers';
import {StaticMapsPath} from './types';

// Style properties that can be applied to paths in the Static Maps API
const PATH_STYLE_KEYS = ['color', 'weight', 'fillcolor', 'geodesic'] as const;

/**
 * Builds the style portion of a path parameter string.
 * @param path - The path object containing style properties
 * @returns A string with style parameters in the format "|key:value"
 */
function buildStyleParams(path: StaticMapsPath): string {
  let styleParams = '';

  PATH_STYLE_KEYS.forEach(key => {
    if (path[key] !== undefined) {
      styleParams += `|${key}:${path[key]}`;
    }
  });

  return styleParams;
}

/**
 * Builds the coordinates portion of a path parameter string.
 * @param coordinates - Either a string or array of location objects
 * @returns A string with coordinates in the format "|lat,lng|lat,lng"
 */
function buildCoordinateParams(
  coordinates: StaticMapsPath['coordinates']
): string {
  if (typeof coordinates === 'string') {
    return `|${decodeURIComponent(coordinates)}`;
  }

  return coordinates.map(location => `|${formatLocation(location)}`).join('');
}

/**
 * Assembles path parameters for the Static Maps API from an array of paths.
 *
 * This function constructs a string of path parameters for each path. Each path parameter string
 * includes the style properties and the coordinates of the paths.
 *
 * @param {Array<StaticMapsPath>} [paths=[]] - An array of paths to be assembled into path parameters.
 * @returns {Array<string>} An array of path parameter strings.
 *
 * @example
 * ```typescript
 * const paths = [
 *   {
 *     color: 'red',
 *     weight: 5,
 *     coordinates: [
 *       { lat: 40.714728, lng: -73.998672 },
 *       { lat: 40.718217, lng: -73.998284 }
 *     ]
 *   }
 * ];
 *
 * const pathParams = assemblePathParams(paths);
 * // Output: ['color:red|weight:5|40.714728,-73.998672|40.718217,-73.998284']
 * ```
 */
export function assemblePathParams(
  paths: Array<StaticMapsPath> = []
): string[] {
  return paths.map(path => {
    const styleParams = buildStyleParams(path);
    const coordinateParams = buildCoordinateParams(path.coordinates);

    const pathParam = styleParams + coordinateParams;

    return formatParam(pathParam);
  });
}
