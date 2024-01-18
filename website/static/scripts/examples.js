// For the codesandbox examples, the 'process.env.GOOGLE_MAPS_API_KEY'
// gets replaced in the deploy task in the github action
// to contain the valid key for the examples
globalThis.GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
