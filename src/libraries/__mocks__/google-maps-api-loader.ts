import type {GoogleMapsApiLoader as ActualLoader} from '../google-maps-api-loader';

export class GoogleMapsApiLoader {
  static load: typeof ActualLoader.load = jest.fn(() => Promise.resolve());
}
