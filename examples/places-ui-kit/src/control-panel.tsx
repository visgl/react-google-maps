import * as React from 'react';
import {ColorScheme, DetailsSize} from './app';

interface ControlPanelProps {
  detailsSize: DetailsSize;
  onDetailSizeChange: (size: DetailsSize) => void;
  colorScheme: ColorScheme;
  onColorSchemeChange: (scheme: ColorScheme) => void;
}

// ControlPanel provides UI configuration options for the place details view
// This component is memoized to prevent unnecessary re-renders
function ControlPanel(props: ControlPanelProps) {
  return (
    <div className="control-panel">
      <h3>Places UI Kit</h3>
      <p>This shows the use of the Places UI Kit webcomponents.</p>

      <p>Control the size of the place details infowindow:</p>
      {/* 
        Dropdown to select the level of detail shown in the place details infowindow
        - FULL: Comprehensive view with all available details
        - COMPACT: Compact view with minimal information
      */}
      <select
        name="detailsSize"
        id="detailsSize"
        value={props.detailsSize}
        onChange={event => {
          props.onDetailSizeChange(event.target.value as DetailsSize);
        }}>
        <option value="FULL">Full</option>
        <option value="COMPACT">Compact</option>
      </select>

      <p>Control the color scheme of the webcomponents:</p>
      {/* 
        Dropdown to select the color scheme for all webcomponents of the Places UI Kit
        as of 17.7.25 the color-scheme for the internal list entries of the gmp-place-search can not yet be overwritten
      */}
      <select
        name="colorScheme"
        id="colorScheme"
        value={props.colorScheme}
        onChange={event => {
          props.onColorSchemeChange(event.target.value as ColorScheme);
        }}>
        <option value="light">light</option>
        <option value="dark">dark</option>
      </select>
      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/places-ui-kit"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/places-ui-kit"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
