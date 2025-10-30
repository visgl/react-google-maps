import React, {memo, useMemo} from 'react';
import {AutocompleteWebComponent} from './autocomplete-webcomponent';
import {PlaceType} from '../app';

interface Props {
  setLocationId: (placeId: string | null) => void;
  placeType: PlaceType;
  setPlaceType: (placeType: PlaceType) => void;
}

interface PlaceTypeOption {
  value: PlaceType;
  label: string;
}

const SearchBarComponent = ({
  placeType,
  setPlaceType,
  setLocationId
}: Props) => {
  const placeTypeOptions: PlaceTypeOption[] = useMemo(
    () => [
      {value: 'restaurant', label: 'Restaurants'},
      {value: 'cafe', label: 'Cafes'},
      {value: 'electric_vehicle_charging_station', label: 'EV Charging'}
    ],
    []
  );

  const handlePlaceTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPlaceType(event.target.value as PlaceType);
  };

  return (
    <div
      className="autocomplete-wrapper"
      role="search"
      aria-label="Location search">
      <label htmlFor="place-type-select">Find</label>
      <select
        id="place-type-select"
        value={placeType ?? ''}
        onChange={handlePlaceTypeChange}>
        {placeTypeOptions.map(option => (
          <option key={option.value} value={option.value || ''}>
            {option.label}
          </option>
        ))}
      </select>
      <span>near</span>
      <AutocompleteWebComponent
        onPlaceSelect={place => setLocationId(place?.id ?? null)}
      />
    </div>
  );
};

SearchBarComponent.displayName = 'SearchBar';

export const SearchBar = memo(SearchBarComponent);
