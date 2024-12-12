import {formatParam} from './helpers';
import {StaticMapsMarker} from './types';

/**
 * Assembles marker parameters for static maps.
 *
 * This function takes an array of markers and groups them by their style properties.
 * It then creates a string representation of these markers, including their styles and locations,
 * which can be used as parameters for static map APIs.
 *
 * @param {StaticMapsMarker[]} [markers=[]] - An array of markers to be processed. Each marker can have properties such as color, label, size, scale, icon, anchor, and location.
 * @returns {string[]} An array of strings, each representing a group of markers with their styles and locations.
 *
 * @example
 * const markers = [
 *   { color: 'blue', label: 'A', size: 'mid', location: '40.714728,-73.998672' },
 *   { color: 'blue', label: 'B', size: 'mid', location: '40.714728,-73.998672' },
 *   { icon: 'http://example.com/icon.png', location: { lat: 40.714728, lng: -73.998672 } }
 * ];
 * const params = assembleMarkerParams(markers);
 * // Params will be an array of strings representing the marker parameters
 * Example output: [
 *   "color:blue|label:A|size:mid|40.714728,-73.998672|40.714728,-73.998672",
 *   "color:blue|label:B|size:mid|40.714728,-73.998672|40.714728,-73.998672",
 *   "icon:http://example.com/icon.png|40.714728,-73.998672"
 * ]
 */
export function assembleMarkerParams(markers: StaticMapsMarker[] = []) {
  const markerParams: Array<string> = [];

  // Group markers by style
  const markersByStyle = markers?.reduce(
    (styles, marker) => {
      const {color = 'red', label, size, scale, icon, anchor} = marker;

      // Create a unique style key based on either icon properties or standard marker properties
      const relevantProps = icon ? [icon, anchor, scale] : [color, label, size];
      const key = relevantProps.filter(Boolean).join('-');

      styles[key] = styles[key] || [];
      styles[key].push(marker);
      return styles;
    },
    {} as Record<string, StaticMapsMarker[]>
  );

  Object.values(markersByStyle ?? {}).forEach(markers => {
    let markerParam: string = '';

    const {icon} = markers[0];

    // Create marker style from first marker in group since all markers share the same style.
    Object.entries(markers[0]).forEach(([key, value]) => {
      // Determine which properties to include based on whether marker uses custom icon
      const relevantKeys = icon
        ? ['icon', 'anchor', 'scale']
        : ['color', 'label', 'size'];

      if (relevantKeys.includes(key)) {
        markerParam += `|${key}:${value}`;
      }
    });

    // Add location coordinates for each marker in the style group
    // Handles both string locations and lat/lng object formats.
    for (const marker of markers) {
      const location =
        typeof marker.location === 'string'
          ? marker.location
          : `${marker.location.lat},${marker.location.lng}`;

      markerParam += `|${location}`;
    }

    markerParams.push(markerParam);
  });

  return markerParams.map(formatParam);
}
