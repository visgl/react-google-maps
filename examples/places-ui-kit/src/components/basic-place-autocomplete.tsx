import {useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {
  Children,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState
} from 'react';
import {createPortal} from 'react-dom';
import {useDomEventListener, usePropBinding} from '../utility-hooks';

export type BasicPlaceAutocompleteElementProps = PropsWithChildren<{
  /**
   * Classname to pass on to gmp-basic-place-autocomplete
   */
  className?: string;
  /**
   * CSS properties to pass on to gmp-basic-place-autocomplete
   * See https://developers.google.com/maps/documentation/javascript/reference/places-widget#BasicPlaceAutocompleteElement-CSS-Properties
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
  const placesLibrary = useMapsLibrary('places');

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

  const numChildren = Children.count(children);

  const [templateElement, setTemplateElement] =
    useState<HTMLTemplateElement | null>(null);

  const ref = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);

  // types have not yet been officially updated so we need to typecast here
  // to avoid TS errors
  const autocomplete = ref.current as any;

  // bind props to the autocomplete element
  usePropBinding(autocomplete, 'includedPrimaryTypes', includedPrimaryTypes);
  usePropBinding(autocomplete, 'includedRegionCodes', includedRegionCodes);
  usePropBinding(autocomplete, 'locationBias', locationBias);
  usePropBinding(autocomplete, 'locationRestriction', locationRestriction);
  usePropBinding(autocomplete, 'name', name);
  usePropBinding(autocomplete, 'origin', origin);
  usePropBinding(autocomplete, 'requestedLanguage', requestedLanguage);
  usePropBinding(autocomplete, 'requestedRegion', requestedRegion);
  usePropBinding(autocomplete, 'unitSystem', unitSystem);

  // bind events to the autocomplete element
  useDomEventListener(autocomplete, 'gmp-select', onSelect);
  useDomEventListener(autocomplete, 'gmp-error', onError);

  // create a template element to wrap the children if they exist
  useEffect(() => {
    if (numChildren === 0) return;

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
  }, [placesLibrary, numChildren, autocomplete]);

  if (!placesLibrary) return null;

  return (
    <gmp-basic-place-autocomplete ref={ref} className={className} style={style}>
      {templateElement && createPortal(children, templateElement.content)}
    </gmp-basic-place-autocomplete>
  );
};

BasicPlaceAutocomplete.displayName = 'BasicPlaceAutocomplete';
