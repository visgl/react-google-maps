import {formatLocation, formatParam} from './helpers';
import {StaticMapsPath} from './types';

/**
 * Assembles path parameters for the Static Maps Api from an array of paths.
 *
 * This function groups paths by their style properties (color, weight, fillcolor, geodesic)
 * and then constructs a string of path parameters for each group. Each path parameter string
 * includes the style properties and the coordinates of the paths.
 *
 * @param {Array<StaticMapsPath>} [paths=[]] - An array of paths to be assembled into path parameters.
 * @returns {Array<string>} An array of path parameter strings.
 *
 * @example
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
 * Output: [
 *    'color:red|weight:5|40.714728,-73.998672|40.718217,-73.998284'
 *  ]
 */
export function assemblePathParams(paths: Array<StaticMapsPath> = []) {
  const pathParams: Array<string> = [];

  // Group paths by their style properties (color, weight, fillcolor, geodesic)
  // to combine paths with identical styles into single parameter strings
  const pathsByStyle = paths?.reduce(
    (styles, path) => {
      const {color = 'default', weight, fillcolor, geodesic} = path;

      // Create unique key for this style combination
      const key = [color, weight, fillcolor, geodesic]
        .filter(Boolean)
        .join('-');

      styles[key] = styles[key] || [];
      styles[key].push(path);
      return styles;
    },
    {} as Record<string, Array<StaticMapsPath>>
  );

  // Process each group of paths with identical styles
  Object.values(pathsByStyle ?? {}).forEach(paths => {
    let pathParam = '';

    // Build style parameter string using properties from first path in group
    // since all paths in this group share the same style
    Object.entries(paths[0]).forEach(([key, value]) => {
      if (['color', 'weight', 'fillcolor', 'geodesic'].includes(key)) {
        pathParam += `|${key}:${value}`;
      }
    });

    // Add location for all marker in style group
    for (const path of paths) {
      if (typeof path.coordinates === 'string') {
        pathParam += `|${decodeURIComponent(path.coordinates)}`;
      } else {
        for (const location of path.coordinates) {
          pathParam += `|${formatLocation(location)}`;
        }
      }
    }

    pathParams.push(pathParam);
  });

  return pathParams.map(formatParam);
}
