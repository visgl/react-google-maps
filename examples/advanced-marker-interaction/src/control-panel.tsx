import * as React from 'react';
import {AdvancedMarkerAnchorPoint} from '@vis.gl/react-google-maps';
import {AnchorPointName} from './app';

interface Props {
  anchorPointName: AnchorPointName;
  onAnchorPointChange: (anchorPointName: AnchorPointName) => void;
}

function ControlPanel(props: Props) {
  return (
    <div className="control-panel">
      <h3>Advanced Marker interaction</h3>
      <p>
        Markers scale on hover and change their color when they are selected by
        clicking on them. The default z-index is sorted by latitude. The z-index
        hierarchy is "hover" on top, then "selected" and then the default
        (latitude).
      </p>
      <p>
        The orange dot on the blue markers represents the current anchor point
        of the marker. Use the dropdown to change the anchor point and see its
        impact.
      </p>
      <p>
        <select
          value={props.anchorPointName}
          onChange={event =>
            props.onAnchorPointChange(
              event.currentTarget.value as AnchorPointName
            )
          }>
          {Object.keys(AdvancedMarkerAnchorPoint).map(anchorPoint => {
            return (
              <option key={anchorPoint} value={anchorPoint}>
                {anchorPoint}
              </option>
            );
          })}
        </select>
      </p>
      <p>
        The blue markers also have the{' '}
        <a
          href="https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.collisionBehavior"
          target="_blank">
          collision detection
        </a>{' '}
        feature turned on for demonstration purposes.
      </p>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/advanced-marker-interaction"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/advanced-marker-interaction"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
