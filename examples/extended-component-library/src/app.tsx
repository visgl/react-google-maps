import React, {useState, useRef} from 'react';
import {createRoot} from 'react-dom/client';

import ControlPanel from './control-panel';
import {AdvancedMarker, Map, Pin, APIProvider} from '@vis.gl/react-google-maps';
import {
  PlaceReviews,
  PlaceDataProvider,
  PlaceDirectionsButton,
  IconButton,
  PlaceOverview,
  SplitLayout,
  OverlayLayout,
  PlacePicker
} from '@googlemaps/extended-component-library/react';

import './app.css';

// The below imports are necessary because we are creating refs of
// the OverlayLayout and PlacePicker components.
// You need to pass the ref property a web component type object.
// Imports from @googlemaps/extended-component-library/react are
// wrappers around web components, not the components themselves.
// For the ref property we import the actual components and alias them for clarity.
import {OverlayLayout as TOverlayLayout} from '@googlemaps/extended-component-library/overlay_layout.js';
import {PlacePicker as TPlacePicker} from '@googlemaps/extended-component-library/place_picker.js';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const DEFAULT_CENTER = {lat: 38, lng: -98};
const DEFAULT_ZOOM = 4;
const DEFAULT_ZOOM_WITH_LOCATION = 16;

/**
 * Sample app that helps users locate a college on the map, with place info such
 * as ratings, photos, and reviews displayed on the side.
 */
const App = () => {
  const overlayLayoutRef = useRef<TOverlayLayout>(null);
  const pickerRef = useRef<TPlacePicker>(null);
  const [college, setCollege] = useState<google.maps.places.Place | undefined>(
    undefined
  );

  // See https://lit.dev/docs/frameworks/react/#using-slots for why
  // we need to wrap our custom elements in a div with a slot attribute.
  return (
    <div className="App">
      <APIProvider apiKey={API_KEY} version="beta">
        <SplitLayout rowReverse rowLayoutMinWidth={700}>
          <div className="SplitLayoutContainer" slot="fixed">
            <OverlayLayout ref={overlayLayoutRef}>
              <div className="MainContainer" slot="main">
                <PlacePicker
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
                <PlaceOverview
                  size="large"
                  place={college}
                  googleLogoAlreadyDisplayed>
                  <div slot="action">
                    <IconButton
                      slot="action"
                      variant="filled"
                      onClick={() => overlayLayoutRef.current?.showOverlay()}>
                      See Reviews
                    </IconButton>
                  </div>
                  <div slot="action">
                    <PlaceDirectionsButton slot="action" variant="filled">
                      Directions
                    </PlaceDirectionsButton>
                  </div>
                </PlaceOverview>
              </div>
              <div slot="overlay">
                <IconButton
                  className="CloseButton"
                  onClick={() => overlayLayoutRef.current?.hideOverlay()}>
                  Close
                </IconButton>
                <PlaceDataProvider place={college}>
                  <PlaceReviews />
                </PlaceDataProvider>
              </div>
            </OverlayLayout>
          </div>
          <div className="SplitLayoutContainer" slot="main">
            <Map
              id="gmap"
              mapId="8c732c82e4ec29d9"
              center={college?.location ?? DEFAULT_CENTER}
              zoom={
                college?.location ? DEFAULT_ZOOM_WITH_LOCATION : DEFAULT_ZOOM
              }
              gestureHandling="none"
              disableDefaultUI
              fullscreenControl={false}
              zoomControl={false}>
              {college?.location && (
                <AdvancedMarker position={college?.location}>
                  <Pin
                    background={'#FBBC04'}
                    glyphColor={'#000'}
                    borderColor={'#000'}
                  />
                </AdvancedMarker>
              )}
              <ControlPanel />
            </Map>
          </div>
        </SplitLayout>
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
