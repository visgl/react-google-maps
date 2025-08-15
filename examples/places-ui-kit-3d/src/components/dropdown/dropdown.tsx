import React from 'react';
import {memo} from 'react';
import {PlaceType} from '../../app';

import './dropdown.css';

type DropdownProps = {
  placeType: string;
  onPlaceTypeSelect: (placeType: PlaceType) => void;
};

export const Dropdown = memo((props: DropdownProps) => {
  const handlePlaceTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    props.onPlaceTypeSelect(event.target.value as PlaceType);
  };

  return (
    <div className="dropdown">
      <span>Nearby Search</span>
      <select
        id="placetype-select"
        name="placetype-select"
        value={props.placeType}
        onChange={handlePlaceTypeChange}>
        <option value="restaurant">Restaurants</option>
        <option value="coffee_shop">Coffee shops</option>
        <option value="tourist_attraction">Attractions</option>
        <option value="park">Parks</option>
      </select>
    </div>
  );
});
