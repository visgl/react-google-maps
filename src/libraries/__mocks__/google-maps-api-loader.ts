import type {GoogleMapsApiLoader as ActualLoader} from '../google-maps-api-loader';

// FIXME: this should no longer be needed with the next version of @googlemaps/jest-mocks
import {importLibraryMock} from './lib/import-library-mock';
import {APILoadingStatus} from '../api-loading-status';

export class GoogleMapsApiLoader {
  static loadingStatus: APILoadingStatus = APILoadingStatus.LOADED;
  static load: typeof ActualLoader.load = jest.fn(
    (_, onLoadingStatusChange) => {
      google.maps.importLibrary = importLibraryMock;
      onLoadingStatusChange(APILoadingStatus.LOADED);
      return Promise.resolve();
    }
  );
}
