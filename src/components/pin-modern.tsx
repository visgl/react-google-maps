import {
  Children,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo
} from 'react';
import {AdvancedMarkerContext} from './advanced-marker';
import {Marker3DContext} from './marker-3d';
import {useMapsLibrary} from '../hooks/use-maps-library';
import {createPortal} from 'react-dom';
import {logErrorOnce} from '../libraries/errors';

/**
 * Props for the Pin component
 */
export type PinProps = PropsWithChildren<google.maps.marker.PinElementOptions>;

/**
 * Modern implementation of Pin component for Maps API >= 3.62
 * Uses the new custom element API with glyphSrc/glyphText properties
 * Component to configure the appearance of an AdvancedMarker or Marker3D
 */
export const PinModern: FunctionComponent<PinProps> = props => {
  const {children} = props;

  const advancedMarkerContext = useContext(AdvancedMarkerContext);
  const marker3dContext = useContext(Marker3DContext);
  const advancedMarker = advancedMarkerContext?.marker;
  const marker3d = marker3dContext?.marker;
  const setContentHandledExternally =
    marker3dContext?.setContentHandledExternally;
  const glyphContainer = useMemo(() => document.createElement('div'), []);

  const markerLibrary = useMapsLibrary('marker');

  // Signal to Marker3D that we're handling content
  useEffect(() => {
    if (marker3d && setContentHandledExternally) {
      setContentHandledExternally(true);
      return () => setContentHandledExternally(false);
    }
  }, [marker3d, setContentHandledExternally]);

  // Handle Marker3D case
  useEffect(() => {
    if (!marker3d || !markerLibrary) return;

    const pinOptions = {
      ...props
    };

    const pinElement = new markerLibrary.PinElement(pinOptions);

    // Children still rendered via portal into a container
    if (children) {
      // In modern API, DOM children of PinElement serve as glyph
      pinElement.appendChild(glyphContainer);
    }

    // Append PinElement directly (not .element - that's deprecated)
    while (marker3d.firstChild) {
      marker3d.removeChild(marker3d.firstChild);
    }
    marker3d.appendChild(pinElement);

    return () => {
      // Cleanup handled by marker3d removal
    };
  }, [marker3d, markerLibrary, glyphContainer, children, props]);

  // Handle AdvancedMarker case
  useEffect(() => {
    if (marker3d) return; // Skip if in Marker3D context

    if (!advancedMarker || !markerLibrary) {
      if (advancedMarker === undefined && marker3d === undefined) {
        console.error(
          'The <Pin> component can only be used inside <AdvancedMarker> or <Marker3D>.'
        );
      }
      return;
    }

    if ((props.glyphSrc || props.glyphText) && children) {
      logErrorOnce(
        'The <Pin> component only uses children to render the glyph if both glyphSrc/glyphText and children are present.'
      );
    }

    if (Children.count(children) > 1) {
      logErrorOnce(
        'Passing multiple children to the <Pin> component might lead to unexpected results.'
      );
    }

    const pinOptions = {
      ...props
    };

    const pinElement = new markerLibrary.PinElement(pinOptions);

    // Children rendered via portal into container
    if (children) {
      pinElement.appendChild(glyphContainer);
    }

    const markerContent = advancedMarker.content?.firstChild;

    while (markerContent?.firstChild) {
      markerContent.removeChild(markerContent.firstChild);
    }

    if (markerContent) {
      // In modern API, append PinElement directly (not .element)
      markerContent.appendChild(pinElement);
    }
  }, [
    advancedMarker,
    markerLibrary,
    glyphContainer,
    marker3d,
    children,
    props
  ]);

  return createPortal(children, glyphContainer);
};
