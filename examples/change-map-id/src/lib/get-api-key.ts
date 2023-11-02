export function getApiKey() {
  const url = new URL(location.href);
  const apiKey =
    url.searchParams.get('apiKey') ||
    (process.env.GOOGLE_MAPS_API_KEY as string);

  if (!apiKey) {
    const key = prompt(
      'Please provide your Google Maps API key in the URL\n' +
        '(using the parameter `?apiKey=YOUR_API_KEY_HERE`) or enter it here:'
    );

    if (key) {
      url.searchParams.set('apiKey', key);
      location.replace(url.toString());
    }
  }

  return apiKey;
}
