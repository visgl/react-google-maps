import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel-deckgl">
      <h3>deck.gl Interleaved Overlay Example</h3>
      <p>
        An example demonstrating how an interleaved deck.gl overlay can be added
        to a <code>{'<Map>'}</code> component. (using the{' '}
        <code>GoogleMapsOverlay</code> from{' '}
        <a href={'https://deck.gl/docs/api-reference/google-maps/overview'}>
          @deck.gl/google-maps
        </a>
        ).
      </p>
      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/deckgl-overlay"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/deckgl-overlay"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
