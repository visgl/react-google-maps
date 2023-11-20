# `useAutocomplete` Hook

React hook to use the Google Maps Platform [Places Autocomplete Widget](https://developers.google.com/maps/documentation/javascript/reference/places-widget) in any component.

## Usage

When initializing the `<APIProvider>`, include the places library like this: `libraries={['places']}`.

```tsx
import React, {useRef, useState} from 'react';
import {useAutocomplete} from '@vis.gl/react-google-maps';

const MyComponent = () => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  const onPlaceChanged = place => {
    if (place) {
      setInputValue(place.formatted_address || place.name);
    }

    // Keep focus on input element
    inputRef.current && inputRef.current.focus();
  };

  useAutocomplete({
    inputField: inputRef && inputRef.current,
    onPlaceChanged
  });

  const handleInputChange = event => {
    setInputValue(event.target.value);
  };

  return (
    <input ref={inputRef} value={inputValue} onChange={handleInputChange} />
  );
};
```

## Parameters

### AutocompleteProps

Needs a reference to an Input field, some optional [AutocompleteOptions](https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions) and a callback for when a place got changed.

```TypeScript
interface AutocompleteProps {
  inputField: HTMLInputElement | null;
  options?: google.maps.places.AutocompleteOptions;
  onPlaceChanged: (place: google.maps.places.PlaceResult) => void;
}
```

## Return value

Returns an [`Autocomplete Places Widget`](https://developers.google.com/maps/documentation/javascript/reference/places-widget) instance to use directly.

```TypeScript
google.maps.places.Autocomplete
```
