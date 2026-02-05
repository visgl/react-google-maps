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
 * Component to configure the appearance of an AdvancedMarker or Marker3D
 */
export const Pin: FunctionComponent<PinProps> = props => {
  const advancedMarkerContext = useContext(AdvancedMarkerContext);
  const marker3dContext = useContext(Marker3DContext);
  const advancedMarker = advancedMarkerContext?.marker;
  const marker3d = marker3dContext?.marker;
  const setContentHandledExternally =
    marker3dContext?.setContentHandledExternally;
  const glyphContainer = useMemo(() => document.createElement('div'), []);

  // Load marker library for Marker3D case (AdvancedMarker already has it loaded)
  const markerLibrary = useMapsLibrary('marker');

  // Signal to Marker3D that we're handling content
  useEffect(() => {
    if (marker3d && setContentHandledExternally) {
      setContentHandledExternally(true);
      return () => setContentHandledExternally(false);
    }
  }, [marker3d, setContentHandledExternally]);

  // Handle Marker3D case - append PinElement directly
  useEffect(() => {
    if (!marker3d || !markerLibrary) return;

    const pinViewOptions: google.maps.marker.PinElementOptions = {
      ...props
    };

    const pinElement = new markerLibrary.PinElement(pinViewOptions);

    // Set glyph to glyph container if children are present
    if (props.children) {
      pinElement.glyph = glyphContainer;
    }

    // Append PinElement directly to Marker3D (not in a template)
    // PinElement is a special element that Marker3D can handle natively
    while (marker3d.firstChild) {
      marker3d.removeChild(marker3d.firstChild);
    }
    marker3d.append(pinElement);

    return () => {
      // Cleanup handled by marker3d removal
    };
  }, [marker3d, markerLibrary, glyphContainer, props]);

  // Create Pin View instance for AdvancedMarker
  useEffect(() => {
    // Skip if we're in Marker3D context
    if (marker3d) return;

    if (!advancedMarker) {
      if (advancedMarker === undefined && marker3d === undefined) {
        console.error(
          'The <Pin> component can only be used inside <AdvancedMarker> or <Marker3D>.'
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
    // Here we are selecting the anchor container.
    // The hierarchy is as follows:
    // "advancedMarker.content" (from google) -> "anchor container"
    const markerContent = advancedMarker.content?.firstChild;

    while (markerContent?.firstChild) {
      markerContent.removeChild(markerContent.firstChild);
    }

    if (markerContent) {
      markerContent.appendChild(pinElement.element);
    }
  }, [advancedMarker, glyphContainer, marker3d, props]);

  return createPortal(props.children, glyphContainer);
};
