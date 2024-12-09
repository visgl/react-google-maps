import {formatParam} from './helpers';

/**
 * Converts an array of Google Maps style objects into an array of style strings
 * compatible with the Google Static Maps API.
 *
 * @param styles - An array of Google Maps MapTypeStyle objects that define the styling rules
 * @returns An array of formatted style strings ready to be used with the Static Maps API
 *
 * @example
 * const styles = [{
 *   featureType: "road",
 *   elementType: "geometry",
 *   stylers: [{color: "#ff0000"}, {weight: 1}]
 * }];
 *
 * const styleStrings = assembleMapTypeStyles(styles);
 * // Returns: ["|feature:road|element:geometry|color:0xff0000|weight:1"]
 *
 * Each style string follows the format:
 * "feature:{featureType}|element:{elementType}|{stylerName}:{stylerValue}"
 *
 * Note: Color values with hexadecimal notation (#) are automatically converted
 * to the required 0x format for the Static Maps API.
 */
export function assembleMapTypeStyles(
  styles: Array<google.maps.MapTypeStyle>
): string[] {
  return styles
    .map((mapTypeStyle: google.maps.MapTypeStyle) => {
      const {featureType, elementType, stylers = []} = mapTypeStyle;

      let styleString = '';

      if (featureType) {
        styleString += `|feature:${featureType}`;
      }

      if (elementType) {
        styleString += `|element:${elementType}`;
      }

      for (const styler of stylers) {
        Object.entries(styler).forEach(([name, value]) => {
          styleString += `|${name}:${String(value).replace('#', '0x')}`;
        });
      }

      return styleString;
    })
    .map(formatParam);
}
