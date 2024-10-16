export interface RealEstateListing {
  uuid: string;
  details: ListingDetails;
  images: string[];
}

export interface ListingDetails {
  property_type: string;
  property_address: string;
  property_bedrooms: number;
  property_bathrooms: number;
  property_square_feet: string;
  property_lot_size: string;
  property_price: string;
  property_year_built: number;
  property_adjective: string;
  property_material: string;
  property_garage: false;
  property_features: string[];
  property_accessibility: string;
  property_eco_features: string;
  property_has_view: false;
  local_amenities: string;
  transport_access: string;
  ambiance: string;
  latitude: number;
  longitude: number;
  img_weather: string;
  listing_title: string;
  listing_description: string;
  img_prompt_front: string;
  img_prompt_back: string;
  img_prompt_bedroom: string;
}
