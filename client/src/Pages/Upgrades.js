import React, { useContext } from 'react';
import { ResourceContext } from '../Context/ResourceContext';
import '../Styles/Upgrades.css';

const Upgrades = () => {
  const { resources, setResources } = useContext(ResourceContext);

  const upgrades = [
    { name: 'Fortify Walls', cost: 100, increment: 10 },
    { name: 'Reinforce Structure', cost: 200, increment: 20 },
  ];

  const handleUpgrade = (upgrade) => {
    if (resources >= upgrade.cost) {
      setResources(resources - upgrade.cost);
      // Logic to apply the upgrade increment
    } else {
      alert('Not enough resources!');
    }
  };

  return (
    <div className="upgrades-page">
      <h1>Upgrades</h1>
      <p>Resources: {resources}</p>
      <div className="upgrades-list">
        {upgrades.map((upgrade) => (
          <button key={upgrade.name} onClick={() => handleUpgrade(upgrade)}>
            {upgrade.name} (Cost: {upgrade.cost} resources, +{upgrade.increment}%)
          </button>
        ))}
      </div>
    </div>
  );
};

export default Upgrades;
