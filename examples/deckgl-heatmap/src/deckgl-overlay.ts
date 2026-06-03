import {useMap} from '@vis.gl/react-google-maps';
import {useEffect, useMemo} from 'react';

import {GoogleMapsOverlay} from '@deck.gl/google-maps';

import type {LayersList} from '@deck.gl/core';

export type DeckGlOverlayProps = {layers?: LayersList};

export const DeckGlOverlay = ({layers}: DeckGlOverlayProps) => {
  const deck = useMemo(() => new GoogleMapsOverlay({interleaved: true}), []);

  const map = useMap();
  useEffect(() => {
    deck.setMap(map);

    return () => deck.setMap(null);
  }, [deck, map]);

  useEffect(() => {
    deck.setProps({layers});
  }, [deck, layers]);

  return null;
};