import {useContext, useEffect} from 'react';
import {AdvancedMarkerContext} from './advanced-marker';

/**
 * Props for the Pin component
 */
export type PinProps = google.maps.marker.PinElementOptions;

/**
 * Component to render a google maps marker Pin View
 */
export const Pin = (props: PinProps) => {
  const advancedMarker = useContext(AdvancedMarkerContext)?.marker;

  // Create Pin View instance
  useEffect(() => {
    if (!advancedMarker) {
      if (advancedMarker === undefined) {
        console.error(
          'The <Pin> component can only be used inside <AdvancedMarker>.'
        );
      }

      return;
    }

    const pinViewOptions: google.maps.marker.PinElementOptions = {
      ...props
    };

    const pinElement = new google.maps.marker.PinElement(pinViewOptions);

    // Set content of Advanced Marker View to the Pin View element
    advancedMarker.content = pinElement.element;
  }, [advancedMarker, props]);

  return null;
};
