import type {GoogleMapsApiLoader as ActualLoader} from '../google-maps-api-loader';

// FIXME: this should no longer be needed with the next version of @googlemaps/jest-mocks
import {importLibraryMock} from './lib/import-library-mock';

export class GoogleMapsApiLoader {
  static load: typeof ActualLoader.load = jest.fn(() => {
    google.maps.importLibrary = importLibraryMock;
    return Promise.resolve();
  });
}
