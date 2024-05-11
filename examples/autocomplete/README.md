# Autocomplete Examples

Here you can find a few example implementations of the autocomplete functionality utilizing the Google Places API.

## Examples

We have three different implementations to demonstrate how to add autocomplete functionality to your application

### 1) Maps JavaScript API Autocomplete Widget

When using the [Autocomplete widget][autocomplete-widget] you provide an HTML input element of your choice and Google handles all the rest. It will fetch predictions when the user types and it will get the details for a place when the user selects a prediction from the list.

### 2) Custom Build

When you need complete control over every aspect of your autocomplete you can choose to build your own by utilizing the [Autocomplete Service][autocomplete-service] for fetching query predictions and the [Places Service][place-details] for fetching the place details.

When building your own you are completely free but also responsible for the user experience of the autocomplete. You are also responsible for handling the autocomplete session with a [Session token][session-token]. This can easily be overlooked and may lead to unexpected surprises when it comes to billing.

### 3) Third Party Select Widget

This is basically the same as the custom build, except for not having to implement the list/dropdown/DOM handling yourself. A lot of third party text box widgets provide functionionality for handling keyboard navigation and focus handling. For the demo we used the [Combobox][combobox] from `react-widgets`.

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
