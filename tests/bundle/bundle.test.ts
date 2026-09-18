import React from 'react';
import {renderToString} from 'react-dom/server';

import * as root from '@vis.gl/react-google-maps';
import * as threeD from '@vis.gl/react-google-maps/3d';

describe('Bundle Integration', () => {
  test('shared contexts and components are identical instances across entrypoints', () => {
    expect(root.GoogleMaps3DContext).toBe(threeD.GoogleMaps3DContext);
    expect(root.Marker3DContext).toBe(threeD.Marker3DContext);
    expect(root.Map3D).toBe(threeD.Map3D);
    expect(root.Marker3D).toBe(threeD.Marker3D);
    expect(root.Popover).toBe(threeD.Popover);
    expect(root.useMap3D).toBe(threeD.useMap3D);
  });

  test('<Map3D> from /3d renders inside <APIProvider> from root without throwing', () => {
    expect(() => {
      renderToString(
        React.createElement(
          root.APIProvider,
          {apiKey: 'test-api-key'},
          React.createElement(threeD.Map3D, {mode: 'SATELLITE'})
        )
      );
    }).not.toThrow();
  });
});
