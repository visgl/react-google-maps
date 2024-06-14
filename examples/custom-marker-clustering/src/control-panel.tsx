import * as React from 'react';

type ControlPanelProps = {
  numClusters: number;
  numFeatures: number;
};

const numberFormat = new Intl.NumberFormat();

function ControlPanel(props: ControlPanelProps) {
  return (
    <div className="control-panel custom-marker-clustering-control-panel">
      <h3>Custom Marker Clustering</h3>
      <p>
        This example loads a GeoJSON file and uses the{' '}
        <a href={'https://github.com/mapbox/supercluster'} target={'_blank'}>
          <code>supercluster</code>
        </a>{' '}
        library together with <code>&lt;AdvancedMarker&gt;</code> components for
        fast and fully customizable clustering of the features. It requires a
        lot more code
      </p>
      <p>
        The data shows all features from the OSM database for castles that are
        also tagged as tourist attractions.
      </p>

      <ul>
        <li>
          <strong>{numberFormat.format(props.numFeatures)}</strong> Features
          loaded
        </li>
        <li>
          <strong>{props.numClusters}</strong> Markers rendered
        </li>
      </ul>

      <div className={'attribution'}>
        <div>
          <strong>Data:</strong>{' '}
          <a href="https://openstreetmap.org/copyright" target="_blank">
            OpenStreetMap
          </a>{' '}
          via <a href="https://overpass-api.de/">overpass API</a>.
        </div>

        <div>
          <strong>Icon:</strong> Castle by Rikas Dzihab from{' '}
          <a
            href="https://thenounproject.com/browse/icons/term/castle/"
            target="_blank"
            title="Castle Icons">
            Noun Project
          </a>{' '}
          (CC BY 3.0)
        </div>
      </div>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/custom-marker-clustering"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/custom-marker-clustering"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
