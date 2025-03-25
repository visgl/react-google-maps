# Autocomplete Examples

Here you can find example implementations of the autocomplete functionality
using the new Places API.

We have three different implementations to demonstrate how to add
autocomplete functionality to your application. The corresponding components
can be found in the [./src/components/] directory.

### 1) `<gmp-place-autocomplete>` custom element (beta)

By far the simplest possible implementation using the new
`<gmp-place-autocomplete>` custom element. This is currently in preview and
only available in alpha and beta channels.

Options to adjust styling and behavior details are very limited.

### 2) Custom Build

This example uses the new [Autocomplete Data API][gmp-autocomplete-data] to
retrieve predictions for the current value of an input field.
The main logic for retrieving the suggestions is encapsulated into a custom
hook [`useAutocompleteSuggestions`](./src/hooks/use-autocomplete-suggestions.ts)
that you can copy into your project when you want to write your own 
implementation.

### 3) Third Party Combobox Widget

This is basically the same as the custom build, but instead of implementing 
the UI with HTML/CSS, we are using an existing combobox component. 

Such a Combobox can be found in most React UI libraries, and we would 
recommend building a custom implementation on an existing component.

For this example we used the [Combobox][combobox] from `react-widgets`.

## Google Maps Platform API Key

This example does not come with an API key. Running the examples locally requires a valid API key for the Google Maps Platform.
See [the official documentation][get-api-key] on how to create and configure your own key. For this example to work you also need to enable the `Places API` in your Google Cloud Console.

The API key has to be provided via an environment variable `GOOGLE_MAPS_API_KEY`. This can be done by creating a
file named `.env` in the example directory with the following content:

```shell title=".env"
GOOGLE_MAPS_API_KEY="<YOUR API KEY HERE>"
```

If you are on the CodeSandbox playground you can also choose to [provide the API key like this](https://codesandbox.io/docs/learn/environment/secrets)

## Development

Go into the example-directory and run

```shell
npm install
```

To start the example with the local library run

```shell
npm run start-local
```

The regular `npm start` task is only used for the standalone versions of the example (CodeSandbox for example)

[get-api-key]: https://developers.google.com/maps/documentation/javascript/get-api-key
[autocomplete-widget]: https://developers.google.com/maps/documentation/javascript/place-autocomplete#add-autocomplete
[autocomplete-service]: https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteService.getPlacePredictions
[place-details]: https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.getDetails
[session-token]: https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteSessionToken
[combobox]: https://jquense.github.io/react-widgets/docs/Combobox
[gmp-autocomplete-data]: https://developers.google.com/maps/documentation/javascript/place-autocomplete-data
