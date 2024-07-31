import React, { createContext, useState, useEffect, useRef } from 'react';

const ResourceContext = createContext();

const ResourceProvider = ({ children }) => {
  const [resources, setResources] = useState(0);
  const [autoIncrement, setAutoIncrement] = useState(1);
  const autoIncrementRef = useRef(autoIncrement);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('idleGameState'));
    if (savedState) {
      setResources(savedState.resources);
      setAutoIncrement(savedState.autoIncrement);
    }

    const interval = setInterval(() => {
      setResources(prevResources => prevResources + autoIncrementRef.current);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('idleGameState', JSON.stringify({ resources, autoIncrement }));
  }, [resources, autoIncrement]);

  useEffect(() => {
    autoIncrementRef.current = autoIncrement;
  }, [autoIncrement]);

  const handleManualClick = () => {
    setResources(prevResources => prevResources + 1);
  };

  const spendResources = (amount) => {
    setResources((prevResources) => prevResources - amount);
  };

  const handlePurchaseUpgrade = (upgrade) => {
    if (resources >= upgrade.cost) {
      setResources(prevResources => prevResources - upgrade.cost);
      setAutoIncrement(prevAutoIncrement => prevAutoIncrement + upgrade.increment);
    }
  };

  return (
    <ResourceContext.Provider value={{ resources, autoIncrement, handleManualClick, handlePurchaseUpgrade, spendResources, setResources }}>
      {children}
    </ResourceContext.Provider>
  );
};

export { ResourceContext, ResourceProvider };