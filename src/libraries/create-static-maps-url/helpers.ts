import {StaticMapsLocation} from './types';

/**
 * Formats a location into a string representation suitable for Google Static Maps API.
 *
 * @param location - The location to format, can be either a string or an object with lat/lng properties
 * @returns A string representation of the location in the format "lat,lng" or the original string
 *
 * @example
 * // Returns "40.714728,-73.998672"
 * formatLocation({ lat: 40.714728, lng: -73.998672 })
 *
 * @example
 * // Returns "New York, NY"
 * formatLocation("New York, NY")
 */
export function formatLocation(location: StaticMapsLocation): string {
  return typeof location === 'string'
    ? location
    : `${location.lat},${location.lng}`;
}

// Used for removing the leading pipe from the param string
export function formatParam(string: string) {
  return string.slice(1);
}
