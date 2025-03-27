const fields = ['routes.viewport', 'routes.legs', 'routes.polylineDetails'];

// docs at https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes

export class RoutesApi {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async computeRoutes(
    from: google.maps.LatLngLiteral,
    to: google.maps.LatLngLiteral,
    options: any
  ) {
    console.log('computeRoutes', from, to, options);
    const url = new URL(
      'https://routes.googleapis.com/directions/v2:computeRoutes'
    );

    const routeRequest = {
      origin: {
        location: {latLng: {longitude: from.lng, latitude: from.lat}}
      },
      destination: {
        location: {latLng: {longitude: to.lng, latitude: to.lat}}
      },
      ...options
    };

    url.searchParams.set('fields', fields.join(','));
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': this.apiKey
      },
      body: JSON.stringify(routeRequest)
    });

    if (!response.ok) {
      throw new Error(
        `Request failed with status: ${response.status} - ${response.statusText}`
      );
    }

    return await response.json();
  }
}
