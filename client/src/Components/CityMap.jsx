import React from 'react';
import '../Styles/CityMap.css';

const locations = [
  { name: 'Hospital', x: 50, y: 50 },
  { name: 'Police Station', x: 150, y: 100 },
  { name: 'Supermarket', x: 250, y: 150 },
  { name: 'School', x: 350, y: 200 },
  { name: 'Fire Station', x: 450, y: 250 }
];

const CityMap = ({ onLocationClick }) => (
  <div className="city-map">
    {locations.map((location, index) => (
      <div
        key={index}
        className="map-location"
        style={{ left: `${location.x}px`, top: `${location.y}px` }}
        onClick={() => onLocationClick(location.name)}
      >
        {location.name}
      </div>
    ))}
  </div>
);

export default CityMap;