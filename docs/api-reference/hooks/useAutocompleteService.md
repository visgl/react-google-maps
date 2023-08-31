# `useAutocompleteService` Hook

React hook to use the Google Maps Platform [Places Autocomplete Service](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service) in any component.

## Usage

When initializing the `<APIProvider>`, include the places library like this: `libraries={['places']}`.

```tsx
const autocompleteService = useAutocompleteService();

const request = {input: inputValue}; // google.maps.places.AutocompletionRequest

autocompleteService?.getPlacePredictions(
  request,
  (
    predictions: google.maps.places.AutocompletePrediction[] | null,
    status: google.maps.places.PlacesServiceStatus
  ) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
      return;
    }
    // Do something with predictions
  }
);
```

## Parameters

### AutocompleteProps

Needs a reference to an Input field, and has some optional properties. Check: [AutocompletionRequest interface](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest) or [QueryAutocompletionRequest interface](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#QueryAutocompletionRequest).

## Return value

Returns an [`Autocomplete Service`](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service) instance to use directly.

```TypeScript
google.maps.places.AutocompleteService
```
