import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { CurrentBuildingContext } from '../Context/CurrentBuildingContext';
import '../Styles/BuildingCarousel.css';

const BuildingCarousel = () => {
  const navigate = useNavigate();
  const { buildings, currentBuildingId, switchBuilding } = useContext(CurrentBuildingContext);

  const handleSelect = (index) => {
    const selectedBuilding = buildings[index];
    switchBuilding(selectedBuilding.id);
    navigate(`/building/${selectedBuilding.id}`);
  };

  return (
    <div className="building-carousel">
      <Carousel selectedItem={buildings.findIndex(b => b.id === currentBuildingId)} onChange={handleSelect} showThumbs={false} infiniteLoop useKeyboardArrows>
        {buildings.map((building) => (
          <div key={building.id} className="building-slide">
            <h3>{building.name}</h3>
            <p>{building.description}</p>
            <p>Health: {building.health}%</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default BuildingCarousel;