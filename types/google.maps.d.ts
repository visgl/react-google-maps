/* eslint-disable
     @typescript-eslint/triple-slash-reference,
     @typescript-eslint/no-empty-object-type */

/// <reference path="../node_modules/@types/google.maps/index.d.ts" />

/**
 * Type extensions for @types/google.maps to include newer properties
 * not yet available in the published type definitions.
 */

declare namespace google.maps {
  interface MapOptions {
    /**
     * Attribution IDs for internal usage tracking.
     * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.internalUsageAttributionIds
     */
    internalUsageAttributionIds?: Iterable<string> | null;
  }

  namespace marker {
    interface AdvancedMarkerElementOptions {
      anchorLeft?: string;
      anchorTop?: string;
    }

    interface AdvancedMarkerElement {
      anchorLeft?: string;
      anchorTop?: string;
    }
  }
}

declare namespace google.maps.maps3d {
  export enum AltitudeMode {
    ABSOLUTE = 'ABSOLUTE',
    CLAMP_TO_GROUND = 'CLAMP_TO_GROUND',
    RELATIVE_TO_GROUND = 'RELATIVE_TO_GROUND',
    RELATIVE_TO_MESH = 'RELATIVE_TO_MESH'
  }

  export interface CameraOptions {
    center?:
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    heading?: number | null;
    range?: number | null;
    roll?: number | null;
    tilt?: number | null;
  }

  export interface FlyAroundAnimationOptions {
    camera: google.maps.maps3d.CameraOptions;
    durationMillis?: number;
    rounds?: number;
  }

  export interface FlyToAnimationOptions {
    durationMillis?: number;
    endCamera: google.maps.maps3d.CameraOptions;
  }

  export class Map3DElement
    extends HTMLElement
    implements google.maps.maps3d.Map3DElementOptions
  {
    constructor(options?: google.maps.maps3d.Map3DElementOptions);
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral | null;
    center?:
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    defaultUIDisabled?: boolean | null;
    heading?: number | null;
    maxAltitude?: number | null;
    maxHeading?: number | null;
    maxTilt?: number | null;
    minAltitude?: number | null;
    minHeading?: number | null;
    minTilt?: number | null;
    mode?: google.maps.maps3d.MapMode | null;
    range?: number | null;
    roll?: number | null;
    tilt?: number | null;
    flyCameraAround(
      options: google.maps.maps3d.FlyAroundAnimationOptions
    ): void;
    flyCameraTo(options: google.maps.maps3d.FlyToAnimationOptions): void;
    stopCameraAnimation(): void;
  }

  export interface Map3DElementOptions {
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral | null;
    center?:
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    defaultUIDisabled?: boolean | null;
    heading?: number | null;
    maxAltitude?: number | null;
    maxHeading?: number | null;
    maxTilt?: number | null;
    minAltitude?: number | null;
    minHeading?: number | null;
    minTilt?: number | null;
    mode?: google.maps.maps3d.MapMode | null;
    range?: number | null;
    roll?: number | null;
    tilt?: number | null;
  }

  export enum MapMode {
    HYBRID = 'HYBRID',
    SATELLITE = 'SATELLITE'
  }

  export class Marker3DElement
    extends HTMLElement
    implements google.maps.maps3d.Marker3DElementOptions
  {
    constructor(options?: google.maps.maps3d.Marker3DElementOptions);
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    collisionBehavior?: google.maps.CollisionBehavior | null;
    drawsWhenOccluded?: boolean | null;
    extruded?: boolean | null;
    label?: string | null;
    position?:
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    sizePreserved?: boolean | null;
    zIndex?: number | null;
  }

  export interface Marker3DElementOptions {
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    collisionBehavior?: google.maps.CollisionBehavior | null;
    drawsWhenOccluded?: boolean | null;
    extruded?: boolean | null;
    label?: string | null;
    position?:
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    sizePreserved?: boolean | null;
    zIndex?: number | null;
  }

  export class Marker3DInteractiveElement
    extends google.maps.maps3d.Marker3DElement
    implements google.maps.maps3d.Marker3DInteractiveElementOptions
  {
    constructor(options?: google.maps.maps3d.Marker3DInteractiveElementOptions);
    gmpPopoverTargetElement?: google.maps.maps3d.PopoverElement | null;
    title: string;
  }

  export interface Marker3DInteractiveElementOptions
    extends google.maps.maps3d.Marker3DElementOptions {
    gmpPopoverTargetElement?: google.maps.maps3d.PopoverElement | null;
    title?: string;
  }

  export class Model3DElement
    extends HTMLElement
    implements google.maps.maps3d.Model3DElementOptions
  {
    constructor(options?: google.maps.maps3d.Model3DElementOptions);
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    orientation?:
      | google.maps.Orientation3D
      | google.maps.Orientation3DLiteral
      | null;
    position?:
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    scale?: number | google.maps.Vector3D | google.maps.Vector3DLiteral | null;
    src?: string | URL | null;
  }

  export interface Model3DElementOptions {
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    orientation?:
      | google.maps.Orientation3D
      | google.maps.Orientation3DLiteral
      | null;
    position?:
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    scale?: number | google.maps.Vector3D | google.maps.Vector3DLiteral | null;
    src?: string | URL | null;
  }

  export class Model3DInteractiveElement
    extends google.maps.maps3d.Model3DElement
    implements google.maps.maps3d.Model3DInteractiveElementOptions
  {
    constructor(options?: google.maps.maps3d.Model3DElementOptions);
  }

  export interface Model3DInteractiveElementOptions
    extends google.maps.maps3d.Model3DElementOptions {}

  export class Polygon3DElement
    extends HTMLElement
    implements google.maps.maps3d.Polygon3DElementOptions
  {
    constructor(options?: google.maps.maps3d.Polygon3DElementOptions);
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    drawsOccludedSegments?: boolean | null;
    extruded?: boolean | null;
    fillColor?: string | null;
    geodesic?: boolean | null;
    innerCoordinates?: Iterable<
      Iterable<
        | google.maps.LatLngAltitude
        | google.maps.LatLngAltitudeLiteral
        | google.maps.LatLngLiteral
      >
    > | null;
    outerCoordinates?: Iterable<
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | google.maps.LatLngLiteral
    > | null;
    strokeColor?: string | null;
    strokeWidth?: number | null;
    zIndex?: number | null;
  }

  export interface Polygon3DElementOptions {
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    drawsOccludedSegments?: boolean | null;
    extruded?: boolean | null;
    fillColor?: string | null;
    geodesic?: boolean | null;
    innerCoordinates?: Iterable<
      | Iterable<google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral>
      | Iterable<google.maps.LatLngLiteral>
    > | null;
    outerCoordinates?: Iterable<
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | google.maps.LatLngLiteral
    > | null;
    strokeColor?: string | null;
    strokeWidth?: number | null;
    zIndex?: number | null;
  }

  export class Polygon3DInteractiveElement
    extends google.maps.maps3d.Polygon3DElement
    implements google.maps.maps3d.Polygon3DInteractiveElementOptions
  {
    constructor(options?: google.maps.maps3d.Polygon3DElementOptions);
  }

  export interface Polygon3DInteractiveElementOptions
    extends google.maps.maps3d.Polygon3DElementOptions {}

  export class Polyline3DElement
    extends HTMLElement
    implements google.maps.maps3d.Polyline3DElementOptions
  {
    constructor(options?: google.maps.maps3d.Polyline3DElementOptions);
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    coordinates?: Iterable<
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | google.maps.LatLngLiteral
    > | null;
    drawsOccludedSegments?: boolean | null;
    extruded?: boolean | null;
    geodesic?: boolean | null;
    outerColor?: string | null;
    outerWidth?: number | null;
    strokeColor?: string | null;
    strokeWidth?: number | null;
    zIndex?: number | null;
  }

  export interface Polyline3DElementOptions {
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    coordinates?: Iterable<
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | google.maps.LatLngLiteral
    > | null;
    drawsOccludedSegments?: boolean | null;
    extruded?: boolean | null;
    geodesic?: boolean | null;
    outerColor?: string | null;
    outerWidth?: number | null;
    strokeColor?: string | null;
    strokeWidth?: number | null;
    zIndex?: number | null;
  }

  export class Polyline3DInteractiveElement
    extends google.maps.maps3d.Polyline3DElement
    implements google.maps.maps3d.Polyline3DInteractiveElementOptions
  {
    constructor(options?: google.maps.maps3d.Polyline3DElementOptions);
  }

  export interface Polyline3DInteractiveElementOptions
    extends google.maps.maps3d.Polyline3DElementOptions {}

  export class PopoverElement
    extends HTMLElement
    implements google.maps.maps3d.PopoverElementOptions
  {
    constructor(options?: google.maps.maps3d.PopoverElementOptions);
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    lightDismissDisabled?: boolean | null;
    open?: boolean | null;
    positionAnchor?:
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitudeLiteral
      | google.maps.maps3d.Marker3DInteractiveElement
      | string
      | null;
  }

  export interface PopoverElementOptions {
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    lightDismissDisabled?: boolean | null;
    open?: boolean | null;
    positionAnchor?:
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitudeLiteral
      | string
      | google.maps.maps3d.Marker3DInteractiveElement
      | null;
  }
}

declare namespace google.maps.places {
  export class AccessibilityOptions {
    hasWheelchairAccessibleEntrance: boolean | null;
    hasWheelchairAccessibleParking: boolean | null;
    hasWheelchairAccessibleRestroom: boolean | null;
    hasWheelchairAccessibleSeating: boolean | null;
  }

  export class AddressComponent {
    longText: string | null;
    shortText: string | null;
    types: string[];
  }

  export class Attribution {
    provider: string | null;
    providerURI: string | null;
  }

  export enum AttributionColor {
    BLACK = 'BLACK',
    GRAY = 'GRAY',
    WHITE = 'WHITE'
  }

  export class AuthorAttribution {
    displayName: string;
    photoURI: string | null;
    uri: string | null;
  }

  export class AutocompleteSessionToken {
    constructor();
  }

  export enum BusinessStatus {
    CLOSED_PERMANENTLY = 'CLOSED_PERMANENTLY',
    CLOSED_TEMPORARILY = 'CLOSED_TEMPORARILY',
    OPERATIONAL = 'OPERATIONAL'
  }

  export interface ComponentRestrictions {
    country: string | string[] | null;
  }

  export class ConnectorAggregation {
    availabilityLastUpdateTime: Date | null;
    availableCount: number | null;
    count: number;
    maxChargeRateKw: number;
    outOfServiceCount: number | null;
    type: google.maps.places.EVConnectorType | null;
  }

  export class EVChargeOptions {
    connectorAggregations: google.maps.places.ConnectorAggregation[];
    connectorCount: number;
  }

  export enum EVConnectorType {
    CCS_COMBO_1 = 'CCS_COMBO_1',
    CCS_COMBO_2 = 'CCS_COMBO_2',
    CHADEMO = 'CHADEMO',
    J1772 = 'J1772',
    NACS = 'NACS',
    OTHER = 'OTHER',
    TESLA = 'TESLA',
    TYPE_2 = 'TYPE_2',
    UNSPECIFIED_GB_T = 'UNSPECIFIED_GB_T',
    UNSPECIFIED_WALL_OUTLET = 'UNSPECIFIED_WALL_OUTLET'
  }

  export interface EVSearchOptions {
    connectorTypes?: google.maps.places.EVConnectorType[];
    minimumChargingRateKw?: number;
  }

  export interface FetchFieldsRequest {
    fields: string[];
  }

  export class FormattableText {
    matches: google.maps.places.StringRange[];
    text: string;
  }

  export class FuelOptions {
    fuelPrices: google.maps.places.FuelPrice[];
  }

  export class FuelPrice {
    price: google.maps.places.Money | null;
    type: google.maps.places.FuelType | null;
    updateTime: Date | null;
  }

  export enum FuelType {
    BIO_DIESEL = 'BIO_DIESEL',
    DIESEL = 'DIESEL',
    DIESEL_PLUS = 'DIESEL_PLUS',
    E100 = 'E100',
    E80 = 'E80',
    E85 = 'E85',
    LPG = 'LPG',
    METHANE = 'METHANE',
    MIDGRADE = 'MIDGRADE',
    PREMIUM = 'PREMIUM',
    REGULAR_UNLEADED = 'REGULAR_UNLEADED',
    SP100 = 'SP100',
    SP91 = 'SP91',
    SP91_E10 = 'SP91_E10',
    SP92 = 'SP92',
    SP95 = 'SP95',
    SP95_E10 = 'SP95_E10',
    SP98 = 'SP98',
    SP99 = 'SP99',
    TRUCK_DIESEL = 'TRUCK_DIESEL'
  }

  export type LocationBias =
    | google.maps.LatLng
    | google.maps.LatLngLiteral
    | google.maps.LatLngBounds
    | google.maps.LatLngBoundsLiteral
    | google.maps.Circle
    | google.maps.CircleLiteral
    | string;

  export type LocationRestriction =
    | google.maps.LatLngBounds
    | google.maps.LatLngBoundsLiteral;

  export class Money {
    currencyCode: string;
    nanos: number;
    units: number;
    toString(): string;
  }

  export class OpeningHours {
    periods: google.maps.places.OpeningHoursPeriod[];
    weekdayDescriptions: string[];
  }

  export class OpeningHoursPeriod {
    close: google.maps.places.OpeningHoursPoint | null;
    open: google.maps.places.OpeningHoursPoint;
  }

  export class OpeningHoursPoint {
    day: number;
    hour: number;
    minute: number;
  }

  export class ParkingOptions {
    hasFreeGarageParking: boolean | null;
    hasFreeParkingLot: boolean | null;
    hasFreeStreetParking: boolean | null;
    hasPaidGarageParking: boolean | null;
    hasPaidParkingLot: boolean | null;
    hasPaidStreetParking: boolean | null;
    hasValetParking: boolean | null;
  }

  export class PaymentOptions {
    acceptsCashOnly: boolean | null;
    acceptsCreditCards: boolean | null;
    acceptsDebitCards: boolean | null;
    acceptsNFC: boolean | null;
  }

  export class Photo {
    authorAttributions: google.maps.places.AuthorAttribution[];
    heightPx: number;
    widthPx: number;
    getURI(options?: google.maps.places.PhotoOptions): string;
  }

  export interface PhotoOptions {
    maxHeight?: number | null;
    maxWidth?: number | null;
  }

  export class Place implements google.maps.places.PlaceOptions {
    constructor(options: google.maps.places.PlaceOptions);
    accessibilityOptions?: google.maps.places.AccessibilityOptions | null;
    addressComponents?: google.maps.places.AddressComponent[];
    adrFormatAddress?: string | null;
    allowsDogs?: boolean | null;
    attributions?: google.maps.places.Attribution[];
    businessStatus?: google.maps.places.BusinessStatus | null;
    displayName?: string | null;
    displayNameLanguageCode?: string | null;
    editorialSummary?: string | null;
    editorialSummaryLanguageCode?: string | null;
    evChargeOptions?: google.maps.places.EVChargeOptions | null;
    formattedAddress?: string | null;
    fuelOptions?: google.maps.places.FuelOptions | null;
    googleMapsURI?: string | null;
    hasCurbsidePickup?: boolean | null;
    hasDelivery?: boolean | null;
    hasDineIn?: boolean | null;
    hasLiveMusic?: boolean | null;
    hasMenuForChildren?: boolean | null;
    hasOutdoorSeating?: boolean | null;
    hasRestroom?: boolean | null;
    hasTakeout?: boolean | null;
    iconBackgroundColor?: string | null;
    id: string;
    internationalPhoneNumber?: string | null;
    isGoodForChildren?: boolean | null;
    isGoodForGroups?: boolean | null;
    isGoodForWatchingSports?: boolean | null;
    isReservable?: boolean | null;
    location?: google.maps.LatLng | null;
    nationalPhoneNumber?: string | null;
    parkingOptions?: google.maps.places.ParkingOptions | null;
    paymentOptions?: google.maps.places.PaymentOptions | null;
    photos?: google.maps.places.Photo[];
    plusCode?: google.maps.places.PlusCode | null;
    postalAddress?: google.maps.places.PostalAddress | null;
    priceLevel?: google.maps.places.PriceLevel | null;
    priceRange?: google.maps.places.PriceRange | null;
    primaryType?: string | null;
    primaryTypeDisplayName?: string | null;
    primaryTypeDisplayNameLanguageCode?: string | null;
    rating?: number | null;
    regularOpeningHours?: google.maps.places.OpeningHours | null;
    requestedLanguage?: string | null;
    requestedRegion?: string | null;
    reviews?: google.maps.places.Review[];
    servesBeer?: boolean | null;
    servesBreakfast?: boolean | null;
    servesBrunch?: boolean | null;
    servesCocktails?: boolean | null;
    servesCoffee?: boolean | null;
    servesDessert?: boolean | null;
    servesDinner?: boolean | null;
    servesLunch?: boolean | null;
    servesVegetarianFood?: boolean | null;
    servesWine?: boolean | null;
    svgIconMaskURI?: string | null;
    types?: string[];
    userRatingCount?: number | null;
    utcOffsetMinutes?: number | null;
    viewport?: google.maps.LatLngBounds | null;
    websiteURI?: string | null;
    openingHours?: google.maps.places.OpeningHours | null;
    hasWiFi?: boolean | null;
    static searchByText(
      request: google.maps.places.SearchByTextRequest
    ): Promise<{places: google.maps.places.Place[]}>;
    static searchNearby(
      request: google.maps.places.SearchNearbyRequest
    ): Promise<{places: google.maps.places.Place[]}>;
    fetchFields(
      options: google.maps.places.FetchFieldsRequest
    ): Promise<{place: google.maps.places.Place}>;
    getNextOpeningTime(date?: Date): Promise<Date | undefined>;
    isOpen(date?: Date): Promise<boolean | undefined>;
    toJSON(): object;
  }

  export class PlaceAccessibleEntranceIconElement
    extends HTMLElement
    implements google.maps.places.PlaceAccessibleEntranceIconElementOptions
  {
    constructor(
      options?: google.maps.places.PlaceAccessibleEntranceIconElementOptions
    );
  }

  export interface PlaceAccessibleEntranceIconElementOptions {}

  export class PlaceAddressElement
    extends HTMLElement
    implements google.maps.places.PlaceAddressElementOptions
  {
    constructor(options?: google.maps.places.PlaceAddressElementOptions);
  }

  export interface PlaceAddressElementOptions {}

  export class PlaceAllContentElement
    extends HTMLElement
    implements google.maps.places.PlaceAllContentElementOptions
  {
    constructor(options?: google.maps.places.PlaceAllContentElementOptions);
  }

  export interface PlaceAllContentElementOptions {}

  export interface PlaceAspectRating {
    rating: number;
    type: string;
  }

  export class PlaceAttributionElement
    extends HTMLElement
    implements google.maps.places.PlaceAttributionElementOptions
  {
    constructor(options?: google.maps.places.PlaceAttributionElementOptions);
    darkSchemeColor?: google.maps.places.AttributionColor | null;
    lightSchemeColor?: google.maps.places.AttributionColor | null;
  }

  export interface PlaceAttributionElementOptions {
    darkSchemeColor?: google.maps.places.AttributionColor | null;
    lightSchemeColor?: google.maps.places.AttributionColor | null;
  }

  export class PlaceAutocompleteElement
    extends HTMLElement
    implements google.maps.places.PlaceAutocompleteElementOptions
  {
    constructor(options: google.maps.places.PlaceAutocompleteElementOptions);
    includedPrimaryTypes: string[] | null;
    includedRegionCodes: string[] | null;
    locationBias: google.maps.places.LocationBias | null;
    locationRestriction: google.maps.places.LocationRestriction | null;
    name: string | null;
    origin?:
      | google.maps.LatLng
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    requestedLanguage: string | null;
    requestedRegion: string | null;
    unitSystem?: google.maps.UnitSystem | null;
  }

  export interface PlaceAutocompleteElementOptions {
    locationBias?: google.maps.places.LocationBias | null;
    locationRestriction?: google.maps.places.LocationRestriction | null;
    name?: string | null;
    requestedLanguage?: string | null;
  }

  export class PlaceContentConfigElement
    extends HTMLElement
    implements google.maps.places.PlaceContentConfigElementOptions
  {
    constructor(options?: google.maps.places.PlaceContentConfigElementOptions);
  }

  export interface PlaceContentConfigElementOptions {}

  export class PlaceContextualElement
    extends HTMLElement
    implements google.maps.places.PlaceContextualElementOptions
  {
    contextToken?: string | null;
  }

  export interface PlaceContextualElementOptions {
    contextToken?: string | null;
  }

  export class PlaceContextualListConfigElement
    extends HTMLElement
    implements google.maps.places.PlaceContextualListConfigElementOptions
  {
    layout?: google.maps.places.PlaceContextualListLayout | null;
    mapHidden?: boolean | null;
  }

  export interface PlaceContextualListConfigElementOptions {
    layout?: google.maps.places.PlaceContextualListLayout | null;
    mapHidden?: boolean | null;
  }

  export enum PlaceContextualListLayout {
    COMPACT = 'COMPACT',
    VERTICAL = 'VERTICAL'
  }

  export class PlaceDetailsCompactElement
    extends HTMLElement
    implements google.maps.places.PlaceDetailsCompactElementOptions
  {
    constructor(options?: google.maps.places.PlaceDetailsCompactElementOptions);
    orientation?: google.maps.places.PlaceDetailsOrientation | null;
    place?: google.maps.places.Place;
    truncationPreferred: boolean;
  }

  export interface PlaceDetailsCompactElementOptions {
    orientation?: google.maps.places.PlaceDetailsOrientation | null;
    truncationPreferred?: boolean | null;
  }

  export class PlaceDetailsElement
    extends HTMLElement
    implements google.maps.places.PlaceDetailsElementOptions
  {
    place?: google.maps.places.Place;
  }

  export interface PlaceDetailsElementOptions {}

  export class PlaceDetailsLocationRequestElement
    extends HTMLElement
    implements google.maps.places.PlaceDetailsLocationRequestElementOptions
  {
    constructor(
      options?: google.maps.places.PlaceDetailsLocationRequestElementOptions
    );
    location?:
      | google.maps.LatLng
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
  }

  export interface PlaceDetailsLocationRequestElementOptions {
    location?:
      | google.maps.LatLng
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
  }

  export enum PlaceDetailsOrientation {
    HORIZONTAL = 'HORIZONTAL',
    VERTICAL = 'VERTICAL'
  }

  export class PlaceDetailsPlaceRequestElement
    extends HTMLElement
    implements google.maps.places.PlaceDetailsPlaceRequestElementOptions
  {
    constructor(
      options?: google.maps.places.PlaceDetailsPlaceRequestElementOptions
    );
    place: google.maps.places.Place | null;
  }

  export interface PlaceDetailsPlaceRequestElementOptions {
    place?: google.maps.places.Place | string | null;
  }

  export interface PlaceDetailsRequest {
    fields?: string[];
    language?: string | null;
    placeId: string;
    region?: string | null;
    sessionToken?: google.maps.places.AutocompleteSessionToken;
  }

  export class PlaceFeatureListElement
    extends HTMLElement
    implements google.maps.places.PlaceFeatureListElementOptions {}

  export interface PlaceFeatureListElementOptions {}

  export interface PlaceGeometry {
    location?: google.maps.LatLng;
    viewport?: google.maps.LatLngBounds;
  }

  export class PlaceListElement
    extends HTMLElement
    implements google.maps.places.PlaceListElementOptions
  {
    constructor(options?: google.maps.places.PlaceListElementOptions);
    places: google.maps.places.Place[];
    selectable: boolean;
    configureFromSearchByTextRequest(
      request: google.maps.places.SearchByTextRequest
    ): Promise<void>;
    configureFromSearchNearbyRequest(
      request: google.maps.places.SearchNearbyRequest
    ): Promise<void>;
  }

  export interface PlaceListElementOptions {
    selectable?: boolean | null;
  }

  export class PlaceMediaElement
    extends HTMLElement
    implements google.maps.places.PlaceMediaElementOptions
  {
    constructor(options?: google.maps.places.PlaceMediaElementOptions);
    lightboxPreferred?: boolean | null;
  }

  export interface PlaceMediaElementOptions {
    lightboxPreferred?: boolean | null;
  }

  export class PlaceOpenNowStatusElement
    extends HTMLElement
    implements google.maps.places.PlaceOpenNowStatusElementOptions
  {
    constructor(options?: google.maps.places.PlaceOpenNowStatusElementOptions);
  }

  export interface PlaceOpenNowStatusElementOptions {}

  export interface PlaceOpeningHours {
    periods?: google.maps.places.PlaceOpeningHoursPeriod[];
    weekday_text?: string[];
    open_now?: boolean;
    isOpen(date?: Date): boolean | undefined;
  }

  export class PlaceOpeningHoursElement
    extends HTMLElement
    implements google.maps.places.PlaceOpeningHoursElementOptions {}

  export interface PlaceOpeningHoursElementOptions {}

  export interface PlaceOpeningHoursPeriod {
    close?: google.maps.places.PlaceOpeningHoursTime;
    open: google.maps.places.PlaceOpeningHoursTime;
  }

  export interface PlaceOpeningHoursTime {
    day: number;
    hours: number;
    minutes: number;
    nextDate?: number;
    time: string;
  }

  export interface PlaceOptions {
    id: string;
    requestedLanguage?: string | null;
    requestedRegion?: string | null;
  }

  export class PlacePhoneNumberElement
    extends HTMLElement
    implements google.maps.places.PlacePhoneNumberElementOptions {}

  export interface PlacePhoneNumberElementOptions {}

  export interface PlacePhoto {
    height: number;
    html_attributions: string[];
    width: number;
    getUrl(opts?: google.maps.places.PhotoOptions): string;
  }

  export interface PlacePlusCode {
    compound_code?: string;
    global_code: string;
  }

  export class PlacePlusCodeElement
    extends HTMLElement
    implements google.maps.places.PlacePlusCodeElementOptions {}

  export interface PlacePlusCodeElementOptions {}

  export class PlacePrediction {
    distanceMeters: number | null;
    mainText: google.maps.places.FormattableText | null;
    placeId: string;
    secondaryText: google.maps.places.FormattableText | null;
    text: google.maps.places.FormattableText;
    types: string[];
    fetchAddressValidation(
      request: google.maps.addressValidation.AddressValidationRequest
    ): Promise<google.maps.addressValidation.AddressValidation>;
    toPlace(): google.maps.places.Place;
  }

  export class PlacePriceElement
    extends HTMLElement
    implements google.maps.places.PlacePriceElementOptions
  {
    constructor(options?: google.maps.places.PlacePriceElementOptions);
  }

  export interface PlacePriceElementOptions {}

  export class PlaceRatingElement
    extends HTMLElement
    implements google.maps.places.PlaceRatingElementOptions
  {
    constructor(options?: google.maps.places.PlaceRatingElementOptions);
  }

  export interface PlaceRatingElementOptions {}

  export interface PlaceResult {
    address_components?: google.maps.GeocoderAddressComponent[];
    adr_address?: string;
    aspects?: google.maps.places.PlaceAspectRating[];
    business_status?: google.maps.places.BusinessStatus;
    formatted_address?: string;
    formatted_phone_number?: string;
    geometry?: google.maps.places.PlaceGeometry;
    html_attributions?: string[];
    icon?: string;
    icon_background_color?: string;
    icon_mask_base_uri?: string;
    international_phone_number?: string;
    name?: string;
    opening_hours?: google.maps.places.PlaceOpeningHours;
    photos?: google.maps.places.PlacePhoto[];
    place_id?: string;
    plus_code?: google.maps.places.PlacePlusCode;
    price_level?: number;
    rating?: number;
    reviews?: google.maps.places.PlaceReview[];
    types?: string[];
    url?: string;
    user_ratings_total?: number;
    utc_offset_minutes?: number;
    vicinity?: string;
    website?: string;
    utc_offset?: number;
    permanently_closed?: boolean;
  }

  export interface PlaceReview {
    author_name: string;
    author_url?: string;
    language: string;
    profile_photo_url: string;
    rating?: number;
    relative_time_description: string;
    text: string;
    time: number;
    aspects?: google.maps.places.PlaceAspectRating[];
  }

  export class PlaceReviewsElement
    extends HTMLElement
    implements google.maps.places.PlaceReviewsElementOptions {}

  export interface PlaceReviewsElementOptions {}

  export interface PlaceSearchPagination {
    hasNextPage: boolean;
    nextPage(): void;
  }

  export interface PlaceSearchRequest {
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    keyword?: string;
    language?: string | null;
    location?: google.maps.LatLng | google.maps.LatLngLiteral;
    maxPriceLevel?: number;
    minPriceLevel?: number;
    openNow?: boolean;
    radius?: number;
    rankBy?: google.maps.places.RankBy;
    type?: string;
    name?: string;
  }

  export class PlaceStandardContentElement
    extends HTMLElement
    implements google.maps.places.PlaceStandardContentElementOptions
  {
    constructor(
      options?: google.maps.places.PlaceStandardContentElementOptions
    );
  }

  export interface PlaceStandardContentElementOptions {}

  export class PlaceSummaryElement
    extends HTMLElement
    implements google.maps.places.PlaceSummaryElementOptions {}

  export interface PlaceSummaryElementOptions {}

  export class PlaceTypeElement
    extends HTMLElement
    implements google.maps.places.PlaceTypeElementOptions
  {
    constructor(options?: google.maps.places.PlaceTypeElementOptions);
  }

  export interface PlaceTypeElementOptions {}

  export class PlaceTypeSpecificHighlightsElement
    extends HTMLElement
    implements google.maps.places.PlaceTypeSpecificHighlightsElementOptions {}

  export interface PlaceTypeSpecificHighlightsElementOptions {}

  export class PlaceWebsiteElement
    extends HTMLElement
    implements google.maps.places.PlaceWebsiteElementOptions {}

  export interface PlaceWebsiteElementOptions {}

  export class PlusCode {
    compoundCode: string | null;
    globalCode: string | null;
  }

  export class PostalAddress
    implements google.maps.places.PostalAddressLiteral
  {
    addressLines: string[];
    administrativeArea: string | null;
    languageCode: string | null;
    locality: string | null;
    organization: string | null;
    postalCode: string | null;
    recipients: string[];
    regionCode: string;
    sortingCode: string | null;
    sublocality: string | null;
  }

  export interface PostalAddressLiteral {
    addressLines?: Iterable<string>;
    administrativeArea?: string | null;
    languageCode?: string | null;
    locality?: string | null;
    organization?: string | null;
    postalCode?: string | null;
    recipients?: Iterable<string>;
    regionCode: string;
    sortingCode?: string | null;
    sublocality?: string | null;
  }

  export interface PredictionSubstring {
    length: number;
    offset: number;
  }

  export interface PredictionTerm {
    offset: number;
    value: string;
  }

  export enum PriceLevel {
    EXPENSIVE = 'EXPENSIVE',
    FREE = 'FREE',
    INEXPENSIVE = 'INEXPENSIVE',
    MODERATE = 'MODERATE',
    VERY_EXPENSIVE = 'VERY_EXPENSIVE'
  }

  export class PriceRange {
    endPrice: google.maps.places.Money | null;
    startPrice: google.maps.places.Money;
  }

  export enum RankBy {
    DISTANCE = 0.0,
    PROMINENCE = 1.0
  }

  export class Review {
    authorAttribution: google.maps.places.AuthorAttribution | null;
    publishTime: Date | null;
    rating: number | null;
    relativePublishTimeDescription: string | null;
    text: string | null;
    textLanguageCode: string | null;
  }

  export enum SearchByTextRankPreference {
    DISTANCE = 'DISTANCE',
    RELEVANCE = 'RELEVANCE'
  }

  export interface SearchByTextRequest {
    evSearchOptions?: google.maps.places.EVSearchOptions;
    fields?: string[];
    includedType?: string;
    isOpenNow?: boolean;
    language?: string;
    locationBias?:
      | google.maps.LatLng
      | google.maps.LatLngLiteral
      | google.maps.LatLngBounds
      | google.maps.LatLngBoundsLiteral
      | google.maps.CircleLiteral
      | google.maps.Circle;
    locationRestriction?:
      | google.maps.LatLngBounds
      | google.maps.LatLngBoundsLiteral;
    maxResultCount?: number;
    minRating?: number;
    priceLevels?: google.maps.places.PriceLevel[];
    rankPreference?: google.maps.places.SearchByTextRankPreference;
    region?: string;
    textQuery?: string;
    useStrictTypeFiltering?: boolean;
    query?: string;
    rankBy?: google.maps.places.SearchByTextRankPreference;
  }

  export enum SearchNearbyRankPreference {
    DISTANCE = 'DISTANCE',
    POPULARITY = 'POPULARITY'
  }

  export interface SearchNearbyRequest {
    excludedPrimaryTypes?: string[];
    excludedTypes?: string[];
    fields?: string[];
    includedPrimaryTypes?: string[];
    includedTypes?: string[];
    language?: string;
    locationRestriction: google.maps.Circle | google.maps.CircleLiteral;
    maxResultCount?: number;
    rankPreference?: google.maps.places.SearchNearbyRankPreference;
    region?: string;
  }

  export class StringRange {
    endOffset: number;
    startOffset: number;
  }

  export interface StructuredFormatting {
    main_text: string;
    main_text_matched_substrings: google.maps.places.PredictionSubstring[];
    secondary_text: string;
  }

  export interface TextSearchRequest {
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    language?: string | null;
    location?: google.maps.LatLng | google.maps.LatLngLiteral;
    query?: string;
    radius?: number;
    region?: string | null;
    type?: string;
  }
}

declare namespace google.maps.elevation {
  export class ElevationElement
    extends HTMLElement
    implements google.maps.elevation.ElevationElementOptions
  {
    constructor(options?: google.maps.elevation.ElevationElementOptions);
    path?:
      | (
          | google.maps.LatLng
          | google.maps.LatLngLiteral
          | google.maps.LatLngAltitude
        )[]
      | null;
    unitSystem?: google.maps.UnitSystem | null;
  }

  export interface ElevationElementOptions {
    path?: (google.maps.LatLng | google.maps.LatLngLiteral)[] | null;
    unitSystem?: google.maps.UnitSystem | null;
  }
}
