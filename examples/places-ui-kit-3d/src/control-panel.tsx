import React, {memo} from 'react';

type ControlPanelProps = {
  useCustomStyling: boolean;
  setUseCustomStyling: (use: boolean) => void;
};

const ControlPanel = (props: ControlPanelProps) => {
  return (
    <div className="control-panel">
      <h3>Places UI Kit 3D</h3>
      <p>
        An immersive 3D experience showcasing relevant POIs using Places UI Kit
        for travel.
      </p>
      <p>
        Control whether or not the default style of the components should be
        overwritten:
      </p>
      <label>
        <input
          type="checkbox"
          checked={props.useCustomStyling}
          onChange={() => props.setUseCustomStyling(!props.useCustomStyling)}
        />
        Use Custom Styling
      </label>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/_template"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/_template"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
};
ControlPanel.displayName = 'ControlPanel';

export default memo(ControlPanel);
