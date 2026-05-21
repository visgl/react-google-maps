# 3D Map Routes Example (JS API Programmatic)

This example shows how to programmatically retrieve route details using the modern `google.maps.routes.Route.computeRoutes(...)` method and render a thinned 3D polyline overlay dynamically on a photorealistic 3D Map (`<Map3D>`).

It showcases full visual control and thinned styling of polylines using the client-side Javascript SDK.

## Google Maps Platform API Key & Requirements

To run this example locally, you must satisfy the following platform requirements:

1. **Billing Enabled:** The Routes API and 3D Maps are premium Google Maps features and require a Google Cloud project with an **active billing account** linked to it.
2. **Enabled APIs & Alpha Channel:** Ensure that both the **Routes API** and the **Maps JavaScript API** are explicitly enabled in your Google Cloud Console. **Note:** 3D Maps and elements are currently only available in the **Alpha channel** (e.g., by setting `version="alpha"` on your `<APIProvider>`).
3. **API Key Environment Variable:** The API key has to be provided via an environment variable `GOOGLE_MAPS_API_KEY`. This can be done by creating a file named `.env` in the example directory with the following content:

```shell title=".env"
GOOGLE_MAPS_API_KEY="<YOUR API KEY HERE>"
```

## Browser Compatibility

Photorealistic 3D Maps require WebGL2 support and hardware graphics acceleration. Please refer to the official **[Google Maps 3D Maps Browser Support Guide](https://developers.google.com/maps/documentation/javascript/3d-maps-support)** for detailed browser requirements and system compatibility guidelines.

_(Note: Virtual machine or remote desktop environments like Cloudtop do not support direct WebGL2 hardware rendering overlays by default. Please run the example locally on your physical host machine)._

## Development & How to Run

Go into the example directory:

```shell
cd examples/map-3d-routes
```

Install dependencies and start the development server:

```shell
npm install
npm run start-local
```
