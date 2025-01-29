import {useMap} from '@vis.gl/react-google-maps';
import {useEffect, useMemo} from 'react';

import {GoogleMapsOverlay} from '@deck.gl/google-maps';

import type {LayersList} from '@deck.gl/core';

export type DeckglOverlayProps = {layers?: LayersList};

/**
 * A very simple implementation of a component that renders a list of deck.gl layers
 * via the GoogleMapsOverlay into the <Map> component containing it.
 */
export const DeckGlOverlay = ({layers}: DeckglOverlayProps) => {
  // the GoogleMapsOverlay can persist throughout the lifetime of the DeckGlOverlay
  const deck = useMemo(() => new GoogleMapsOverlay({interleaved: true}), []);

  // add the overlay to the map once the map is available
  const map = useMap();
  useEffect(() => {
    deck.setMap(map);

    return () => deck.setMap(null);
  }, [deck, map]);

  // whenever the rendered data changes, the layers will be updated
  useEffect(() => {
    deck.setProps({layers});
  }, [deck, layers]);

  // no dom rendered by this component
  return null;
};
