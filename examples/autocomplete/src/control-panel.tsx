import * as React from 'react';
import {AutocompleteMode} from './app';

import './control-panel.css';

interface Props {
  implementations: Array<AutocompleteMode>;
  selectedImplementation: AutocompleteMode;
  onImplementationChange: (autocompleteMode: AutocompleteMode) => void;
}

function ControlPanel({
  implementations,
  selectedImplementation,
  onImplementationChange
}: Props) {
  return (
    <div className="control-panel">
      <h3>Autocomplete Example</h3>

      <p>
        This example demonstrates different ways to add Places Autocomplete
        functionality to your application with the new Places API.
      </p>

      <div className="autocomplete-mode">
        <h4>Choose implementation: </h4>
        <select
          value={selectedImplementation.id}
          onChange={event => {
            const newMode = implementations.find(
              mode => mode.id === event.target.value
            );
            if (newMode) {
              onImplementationChange(newMode);
            }
          }}>
          {implementations.map(({id, label}) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className={'implementation-details'}>
        {selectedImplementation.id === 'webcomponent' && (
          <div>
            This implementation makes use of the new{' '}
            <code>&lt;gmp-place-autocomplete&gt;</code> web-component that is
            currently in preview (only available in alpha and beta channels).
          </div>
        )}

        {selectedImplementation.id === 'custom' && (
          <div>
            A custom implementation using the new Autocomplete Data API using
            just basic HTML elements and minimal styling.
          </div>
        )}

        {selectedImplementation.id === 'custom-hybrid' && (
          <div>
            This implementation uses the Autocomplete Data API and an existing
            combobox component as it can be found in most React UI libraries.
          </div>
        )}
      </div>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/autocomplete"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/autocomplete"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
