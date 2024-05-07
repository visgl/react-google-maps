import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import ControlPanel from './control-panel';
import { AdvancedMarker, Map, Pin, APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import * as GMPX from '@googlemaps/extended-component-library/react';
import { OverlayLayout } from '@googlemaps/extended-component-library/overlay_layout.js';
import { PlacePicker } from '@googlemaps/extended-component-library/place_picker.js';

/**
 * These type manipulations are taken from 
 * https://github.com/googlemaps/extended-component-library/blob/main/src/utils/googlemaps_types.ts
 * 
 * The ECL manipulates some of the types found in @types/google.maps and we have to repeate that here. 
 */

declare interface AuthorAttribution {
  displayName: string;
  photoURI: string | null;
  uri: string | null;
}

declare type Photo = Omit<google.maps.places.Photo, 'attributions'> & {
  authorAttributions: AuthorAttribution[];
};

declare type Review =
  Omit<google.maps.places.Review, 'author' | 'authorURI' | 'authorPhotoURI'> & {
    authorAttribution: AuthorAttribution | null;
  };

declare interface Place extends Omit<
  google.maps.places.Place,
  'photos' | 'reviews' | 'fetchFields' | 'accessibilityOptions'> {
  photos?: Photo[];
  reviews?: Review[];
  accessibilityOptions?: { hasWheelchairAccessibleEntrance: boolean | null } | null;
  fetchFields: (options: google.maps.places.FetchFieldsRequest) =>
    Promise<{ place: Place }>;
}

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? ("YOUR_API_KEY");
const DEFAULT_CENTER = { lat: -34.397, lng: 150.644 };
const DEFAULT_ZOOM = 4;
const DEFAULT_ZOOM_WITH_LOCATION = 16;

/**
 * Sample app that helps users locate a college on the map, with place info such
 * as ratings, photos, and reviews displayed on the side.
 */
const App = () => {
  const overlayLayoutRef = useRef<OverlayLayout>(null);
  const pickerRef = useRef<PlacePicker>(null);
  const [college, setCollege] = useState<Place | undefined>(undefined);

  return (
    <div className="App">
      <APIProvider apiKey={API_KEY} version='beta' >
        <GMPX.SplitLayout rowReverse rowLayoutMinWidth={700}>
          <div className="SplitLayoutContainer" slot="fixed">
            <GMPX.OverlayLayout ref={overlayLayoutRef}>
              <div className="MainContainer" slot="main">
                <GMPX.PlacePicker
                  className="CollegePicker"
                  ref={pickerRef}
                  forMap="gmap"
                  country={['us', 'ca']}
                  type="university"
                  placeholder="Enter a college in the US or Canada"
                  onPlaceChange={() => {
                    if (!pickerRef.current?.value) {
                      setCollege(undefined);
                    } else {
                      setCollege(pickerRef.current?.value);
                    }
                  }}
                />
                <GMPX.PlaceOverview
                  size="large"
                  place={college}
                  googleLogoAlreadyDisplayed
                >
                  <div slot="action">
                    <GMPX.IconButton
                      slot="action"
                      variant="filled"
                      onClick={() => overlayLayoutRef.current?.showOverlay()}
                    >
                      See Reviews
                    </GMPX.IconButton>
                  </div>
                  <div slot="action">
                    <GMPX.PlaceDirectionsButton slot="action" variant="filled">
                      Directions
                    </GMPX.PlaceDirectionsButton>
                  </div>
                </GMPX.PlaceOverview>
              </div>
              <div slot="overlay">
                <GMPX.IconButton
                  className="CloseButton"
                  onClick={() => overlayLayoutRef.current?.hideOverlay()}
                >
                  Close
                </GMPX.IconButton>
                <GMPX.PlaceDataProvider place={college}>
                  <GMPX.PlaceReviews />
                </GMPX.PlaceDataProvider>
              </div>
            </GMPX.OverlayLayout>
          </div>
          <div className="SplitLayoutContainer" slot="main">
            <Map
              id="gmap"
              mapId="8c732c82e4ec29d9"
              center={college?.location ?? DEFAULT_CENTER}
              zoom={college?.location ? DEFAULT_ZOOM_WITH_LOCATION : DEFAULT_ZOOM}
            >
              {college?.location && (
                <AdvancedMarker position={college?.location}>
                  <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
              )}
              <ControlPanel />
            </Map>
          </div>
        </GMPX.SplitLayout>
      </APIProvider>
    </div>
  );
};
export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
