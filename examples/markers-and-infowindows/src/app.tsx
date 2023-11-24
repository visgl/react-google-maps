import React from 'react';
import {createRoot} from 'react-dom/client';

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  Pin
} from '@vis.gl/react-google-maps';

import ControlPanel from './control-panel';
import {MovingMarker} from './moving-marker';
import {MarkerWithInfowindow} from './marker-with-infowindow';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;

const App = () => {
  return (
    <APIProvider apiKey={API_KEY} libraries={['marker']}>
      <Map
        mapId={'bf51a910020fa25a'}
        zoom={3}
        center={{lat: 12, lng: 0}}
        gestureHandling={'greedy'}
        disableDefaultUI={true}>
        {/* simple marker */}
        <Marker
          position={{lat: 10, lng: 10}}
          clickable={true}
          onClick={() => alert('marker was clicked!')}
          title={'clickable google.maps.Marker'}
        />

        {/* advanced marker with customized pin */}
        <AdvancedMarker
          position={{lat: 20, lng: 10}}
          title={'AdvancedMarker with customized pin.'}>
          <Pin
            background={'#22ccff'}
            borderColor={'#1e89a1'}
            glyphColor={'#0f677a'}></Pin>
        </AdvancedMarker>

        {/* advanced marker with html pin glyph */}
        <AdvancedMarker position={{lat: 15, lng: 20}}
          title={'AdvancedMarker with customized pin.'}>
          <Pin
            background={'#22ccff'}
            borderColor={'#1e89a1'}
            scale={1.4}>
              {/* child gets rendered as 'glyph' element of pin */}
              <img src="https://www.svgrepo.com/show/522904/info-circle.svg" style={{height: "24px", width: "24px", color: "white", stroke: "#fff", fill: "#fff"}}/>
            </Pin>
        </AdvancedMarker>

        {/* advanced marker with html-content */}
        <AdvancedMarker
          position={{lat: 30, lng: 10}}
          title={'AdvancedMarker with custom html content.'}>
          <div
            style={{
              width: 16,
              height: 16,
              position: 'absolute',
              top: 0,
              left: 0,
              background: '#1dbe80',
              border: '2px solid #0e6443',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}></div>
        </AdvancedMarker>

        {/* simple positioned infowindow */}
        <InfoWindow position={{lat: 40, lng: 0}} maxWidth={200}>
          <p>
            This is the content for another infowindow with <em>HTML</em>
            -elements.
          </p>
        </InfoWindow>

        {/* continously updated marker */}
        <MovingMarker />

        {/* simple stateful infowindow */}
        <MarkerWithInfowindow />
      </Map>

      <ControlPanel />
    </APIProvider>
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
