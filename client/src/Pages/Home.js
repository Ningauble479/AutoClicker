import React, { useContext } from 'react';
import ProgressBar from '../Components/ProgressBar';
import { ResourceContext } from '../Context/ResourceContext';
import { SurvivorContext } from '../Context/SurvivorContext';
import { CurrentBuildingContext } from '../Context/CurrentBuildingContext';
import '../Styles/Home.css';  // Ensure the CSS file is imported

const Home = () => {
  const { resources, handleManualClick } = useContext(ResourceContext);
  const { survivor, updateHealth } = useContext(SurvivorContext);
  const { buildings, currentBuildingId, updateBuildingHealth, switchBuilding } = useContext(CurrentBuildingContext);

  const currentBuilding = buildings.find((building) => building.id === currentBuildingId);

  const handleLocationClick = (locationName) => {
    console.log(`Scavenging at ${locationName}`);
    handleManualClick();
    updateHealth(-10); // Example: Decrease health by 10 when scavenging
    updateBuildingHealth(currentBuilding.id, 5); // Example: Increase building health by 5
  };

  if (!currentBuilding) return <div>Loading...</div>;

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>{currentBuilding.name}</h1>
        <h2>Building Health: {currentBuilding.health}%</h2>
        <h3>Supplies: {resources}</h3>
        <button onClick={handleManualClick}>Scavenge for Supplies</button>
      </div>
      <div className="progress-bar-container">
        <ProgressBar intervalTime={1000} />
      </div>
      <div className="survivor-info">
        <h3>Survivor: {survivor.name}</h3>
        <p>Health: {survivor.health}</p>
        <h4>Skills</h4>
        <ul>
          <li>Scavenging: {survivor.skills.scavenging}</li>
          <li>Combat: {survivor.skills.combat}</li>
          <li>Survival: {survivor.skills.survival}</li>
        </ul>
        <h4>Inventory</h4>
        <ul>
          {survivor.inventory.map((item, index) => (
            <li key={index}>{item.item} x{item.quantity}</li>
          ))}
        </ul>
      </div>
      <div className="building-switcher">
        <h4>Switch Building</h4>
        <ul>
          {buildings.map((building) => (
            <li key={building.id}>
              <button onClick={() => switchBuilding(building.id)}>{building.name}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;