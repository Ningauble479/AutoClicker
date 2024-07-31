import React, { useContext } from 'react';
import '../Styles/ResourceBox.css';
import { ResourceContext } from '../Context/ResourceContext';

const ResourceBox = () => {
  const { resources } = useContext(ResourceContext);

  return (
    <div className="resource-box">
      <h3>Supplies</h3>
      <p>{resources}</p>
    </div>
  );
};

export default ResourceBox;