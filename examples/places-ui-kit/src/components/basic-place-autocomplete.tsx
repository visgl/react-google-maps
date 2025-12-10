import {useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState
} from 'react';
import {createPortal} from 'react-dom';

export type BasicPlaceAutocompleteElementProps = PropsWithChildren<{
  /**
   * Classname to pass on to gmp-basic-place-autocomplete
   */
  className?: string;
  /**
   * CSS properties to pass on to gmp-basic-place-autocomplete
   */
  style?: React.CSSProperties;
  /**
   * Restricts predictions to a set of pre-defined primary types.
   */
  includedPrimaryTypes?: Array<string> | null;
  /**
   * Restricts predictions to a set of pre-defined region codes.
   */
  includedRegionCodes?: Array<string> | null;
  /**
   * Bias the results towards a particular area.
   */
  locationBias?: google.maps.places.LocationBias | null;
  /**
   * Restrict the results to a particular area.
   */
  locationRestriction?: google.maps.places.LocationRestriction | null;
  /**
   * The name of the autocomplete element.
   */
  name?: string | null;
  /**
   * The origin point from which to calculate distances.
   */
  origin?:
    | google.maps.LatLng
    | google.maps.LatLngLiteral
    | google.maps.LatLngAltitude
    | google.maps.LatLngAltitudeLiteral
    | null;
  /**
   * The language to use for the autocomplete predictions.
   */
  requestedLanguage?: string | null;
  /**
   * The region code to use for the autocomplete predictions.
   */
  requestedRegion?: string | null;
  /**
   * The unit system to use for the autocomplete predictions.
   */
  unitSystem?: google.maps.UnitSystem;
  /**
   * Fired when a place is selected from the autocomplete predictions.
   */
  onSelect?: ({place}: {place: google.maps.places.Place}) => void;
  /**
   * Fired when an error occurs.
   */
  onError?: (e: google.maps.places.PlaceAutocompleteRequestErrorEvent) => void;
}>;

/**
 * Wrapper component for gmp-basic-place-autocomplete
 * Properties and styling options according to https://developers.google.com/maps/documentation/javascript/reference/places-widget#BasicPlaceAutocompleteElement
 */
export const BasicPlaceAutocomplete: FunctionComponent<
  BasicPlaceAutocompleteElementProps
> = props => {
  const {
    children,
    className,
    style,
    includedPrimaryTypes,
    includedRegionCodes,
    locationBias,
    locationRestriction,
    name,
    origin,
    requestedLanguage,
    requestedRegion,
    unitSystem,
    onSelect,
    onError
  } = props;

  const placesLibrary = useMapsLibrary('places');

  const ref = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);

  const [templateElement, setTemplateElement] =
    useState<HTMLTemplateElement | null>(null);

  useEffect(() => {
    const autocomplete = ref.current;
    if (!placesLibrary || !autocomplete || !children) return;

    const template = document.createElement('template');
    template.setAttribute('slot', 'prediction-item-icon');

    autocomplete.appendChild(template);
    setTemplateElement(template);

    return () => {
      setTemplateElement(null);
      if (autocomplete.contains(template)) {
        autocomplete.removeChild(template);
      }
    };
  }, [placesLibrary, children]);

  if (!placesLibrary) return null;

  return (
    <gmp-basic-place-autocomplete
      ref={ref}
      className={className}
      style={style}
      includedPrimaryTypes={includedPrimaryTypes}
      includedRegionCodes={includedRegionCodes}
      locationBias={locationBias}
      locationRestriction={locationRestriction}
      name={name}
      origin={origin}
      requestedLanguage={requestedLanguage}
      requestedRegion={requestedRegion}
      unitSystem={unitSystem}
      ongmp-select={onSelect}
      ongmp-error={onError}>
      {templateElement &&
        children &&
        createPortal(children, templateElement.content)}
    </gmp-basic-place-autocomplete>
  );
};

BasicPlaceAutocomplete.displayName = 'BasicPlaceAutocomplete';
