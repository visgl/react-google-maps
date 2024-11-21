import React, {CSSProperties, FunctionComponent} from 'react';

export const AuthFailureMessage: FunctionComponent = () => {
  const style: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 999,
    display: 'flex',
    flexFlow: 'column nowrap',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: '.8rem',
    color: 'rgba(0,0,0,0.6)',
    background: '#dddddd',
    padding: '1rem 1.5rem'
  };

  return (
    <div style={style}>
      <h2>Error: AuthFailure</h2>
      <p>
        A problem with your API key prevents the map from rendering correctly.
        Please make sure the value of the <code>APIProvider.apiKey</code> prop
        is correct. Check the error-message in the console for further details.
      </p>
    </div>
  );
};
