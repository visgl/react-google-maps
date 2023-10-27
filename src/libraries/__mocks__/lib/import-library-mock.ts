// FIXME: remove once we can update to the new @googlemaps/jest-mocks version
export const importLibraryMock = jest.fn(async (name: string) => {
  switch (name) {
    case 'core': {
      const {
        ControlPosition,
        event,
        LatLng,
        LatLngAltitude,
        LatLngBounds,
        MapsNetworkError,
        MapsNetworkErrorEndpoint,
        MapsRequestError,
        MapsServerError,
        MVCArray,
        MVCObject,
        Point,
        Settings,
        Size,
        SymbolPath,
        UnitSystem
      } = google.maps;

      return {
        ControlPosition,
        event,
        LatLng,
        LatLngAltitude,
        LatLngBounds,
        MapsNetworkError,
        MapsNetworkErrorEndpoint,
        MapsRequestError,
        MapsServerError,
        MVCArray,
        MVCObject,
        Point,
        Settings,
        Size,
        SymbolPath,
        UnitSystem
      } as google.maps.CoreLibrary;
    }

    case 'maps': {
      const {
        BicyclingLayer,
        Circle,
        Data,
        FeatureType,
        GroundOverlay,
        ImageMapType,
        InfoWindow,
        KmlLayer,
        KmlLayerStatus,
        Map,
        MapTypeControlStyle,
        MapTypeId,
        MapTypeRegistry,
        MaxZoomService,
        MaxZoomStatus,
        OverlayView,
        Polygon,
        Polyline,
        Rectangle,
        RenderingType,
        StrokePosition,
        StyledMapType,
        TrafficLayer,
        TransitLayer,
        WebGLOverlayView
      } = google.maps;

      return {
        BicyclingLayer,
        Circle,
        Data,
        FeatureType,
        GroundOverlay,
        ImageMapType,
        InfoWindow,
        KmlLayer,
        KmlLayerStatus,
        Map,
        MapTypeControlStyle,
        MapTypeId,
        MapTypeRegistry,
        MaxZoomService,
        MaxZoomStatus,
        OverlayView,
        Polygon,
        Polyline,
        Rectangle,
        RenderingType,
        StrokePosition,
        StyledMapType,
        TrafficLayer,
        TransitLayer,
        WebGLOverlayView
      } as google.maps.MapsLibrary;
    }
    case 'places':
      return google.maps.places as google.maps.PlacesLibrary;
    case 'geocoding': {
      const {Geocoder, GeocoderLocationType, GeocoderStatus} = google.maps;
      return {
        Geocoder,
        GeocoderLocationType,
        GeocoderStatus
      } as google.maps.GeocodingLibrary;
    }
    case 'routes': {
      const {
        DirectionsRenderer,
        DirectionsService,
        DirectionsStatus,
        DistanceMatrixElementStatus,
        DistanceMatrixService,
        DistanceMatrixStatus,
        TrafficModel,
        TransitMode,
        TransitRoutePreference,
        TravelMode,
        VehicleType
      } = google.maps;

      return {
        DirectionsRenderer,
        DirectionsService,
        DirectionsStatus,
        DistanceMatrixElementStatus,
        DistanceMatrixService,
        DistanceMatrixStatus,
        TrafficModel,
        TransitMode,
        TransitRoutePreference,
        TravelMode,
        VehicleType
      } as google.maps.RoutesLibrary;
    }
    case 'marker': {
      const {
        Animation,
        CollisionBehavior,
        Marker,
        marker: {AdvancedMarkerClickEvent, AdvancedMarkerElement, PinElement}
      } = google.maps;

      return {
        AdvancedMarkerClickEvent,
        AdvancedMarkerElement,
        Animation,
        CollisionBehavior,
        Marker,
        PinElement
      } as google.maps.MarkerLibrary;
    }
    case 'geometry': {
      return google.maps.geometry as google.maps.GeometryLibrary;
    }
    case 'elevation': {
      const {ElevationService, ElevationStatus} = google.maps;

      return {
        ElevationService,
        ElevationStatus
      } as google.maps.ElevationLibrary;
    }
    case 'streetView': {
      const {
        InfoWindow,
        OverlayView,
        StreetViewCoverageLayer,
        StreetViewPanorama,
        StreetViewPreference,
        StreetViewService,
        StreetViewSource,
        StreetViewStatus
      } = google.maps;

      return {
        InfoWindow,
        OverlayView,
        StreetViewCoverageLayer,
        StreetViewPanorama,
        StreetViewPreference,
        StreetViewService,
        StreetViewSource,
        StreetViewStatus
      } as google.maps.StreetViewLibrary;
    }
    case 'journeySharing': {
      return google.maps.journeySharing as google.maps.JourneySharingLibrary;
    }
    case 'drawing': {
      return google.maps.drawing as google.maps.DrawingLibrary;
    }
    case 'visualization': {
      return google.maps.visualization as google.maps.VisualizationLibrary;
    }
  }

  throw new TypeError(`unknown library name: ${name}`);
});
