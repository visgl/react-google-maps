import {
  Children,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo
} from 'react';
import {AdvancedMarkerContext} from './advanced-marker';
import {createPortal} from 'react-dom';
import {logErrorOnce} from '../libraries/errors';

/**
 * Props for the Pin component
 */
export type PinProps = google.maps.marker.PinElementOptions;

/**
 * Component to render a google maps marker Pin View
 */
export const Pin = (props: PropsWithChildren<PinProps>) => {
  const advancedMarker = useContext(AdvancedMarkerContext)?.marker;
  const glyphContainer = useMemo(() => document.createElement('div'), []);

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

    if (props.glyph && props.children) {
      logErrorOnce(
        'The <Pin> component only uses children to render the glyph if both the glyph property and children are present.'
      );
    }

    if (Children.count(props.children) > 1) {
      logErrorOnce(
        'Passing multiple children to the <Pin> component might lead to unexpected results.'
      );
    }

    const pinViewOptions: google.maps.marker.PinElementOptions = {
      ...props
    };

    const pinElement = new google.maps.marker.PinElement(pinViewOptions);

    // Set glyph to glyph container if children are present (rendered via portal).
    // If both props.glyph and props.children are present, props.children takes priority.
    if (props.children) {
      pinElement.glyph = glyphContainer;
    }

    // Set content of Advanced Marker View to the Pin View element
    advancedMarker.content = pinElement.element;
  }, [advancedMarker, props]);

  return createPortal(props.children, glyphContainer);
};
