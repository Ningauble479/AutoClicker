import React, { useContext, useState } from 'react';
import { SurvivorContext } from '../Context/SurvivorContext';
import { CurrentBuildingContext } from '../Context/CurrentBuildingContext';
import '../Styles/SurvivorsPage.css';

const SurvivorsPage = () => {
  const { survivors, updateSurvivorRole } = useContext(SurvivorContext);
  const { clearingQueue } = useContext(CurrentBuildingContext);
  const [selectedSurvivor, setSelectedSurvivor] = useState(survivors[0]?.id || 1);
  
  const roles = ['Room Clearing', 'Standing Watch', 'Scavenging', 'Cooking', 'Training', 'Researching', 'Idle'];

  const handleSurvivorChange = (event) => {
    setSelectedSurvivor(parseInt(event.target.value));
  };

  const handleRoleChange = (event) => {
    updateSurvivorRole(selectedSurvivor, event.target.value);
  };

  const currentSurvivor = survivors.find(survivor => survivor.id === selectedSurvivor);

  return (
    <div className="survivors-page">
      <h1>Survivors</h1>
      <div className="survivor-activities">
        <h2>Current Survivor Activities</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Health</th>
              <th>Scavenging</th>
              <th>Combat</th>
              <th>Survival</th>
              <th>Role</th>
              <th>Busy</th>
            </tr>
          </thead>
          <tbody>
            {survivors.map((survivor) => (
              <tr key={survivor.id}>
                <td>{survivor.name}</td>
                <td>{survivor.health}</td>
                <td>{survivor.scavenging}</td>
                <td>{survivor.combat}</td>
                <td>{survivor.survival}</td>
                <td>{survivor.role}</td>
                <td>{survivor.busy ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="manage-survivors">
        <h2>Manage Survivors</h2>
        <div className="survivor-selection">
          <label htmlFor="survivor-select">Select Survivor:</label>
          <select id="survivor-select" value={selectedSurvivor} onChange={handleSurvivorChange}>
            {survivors.map((survivor) => (
              <option key={survivor.id} value={survivor.id}>
                {survivor.name}
              </option>
            ))}
          </select>
        </div>
        {currentSurvivor && (
          <div className="survivor-details">
            <h3>{currentSurvivor.name}</h3>
            <p>Health: {currentSurvivor.health}</p>
            <p>Scavenging: {currentSurvivor.scavenging}</p>
            <p>Combat: {currentSurvivor.combat}</p>
            <p>Survival: {currentSurvivor.survival}</p>
            <label htmlFor="role-select">Assign Role:</label>
            <select id="role-select" value={currentSurvivor.role} onChange={handleRoleChange}>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="room-clear">
        <h2>Room Clearing Process</h2>
        <table>
          <thead>
            <tr>
              <th>Building</th>
              <th>Floor</th>
              <th>Room</th>
              <th>Survivor</th>
              <th>Status</th>
              <th>Remaining Time</th>
            </tr>
          </thead>
          <tbody>
            {clearingQueue.map((task, index) => (
              <tr key={index}>
                <td>{task.buildingName}</td>
                <td>{task.floorNumber}</td>
                <td>{task.roomNumber}</td>
                <td>{task.survivorName}</td>
                <td>{task.status}</td>
                <td>{task.remainingTime}s</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Queue</h3>
        <table>
          <thead>
            <tr>
              <th>Building</th>
              <th>Floor</th>
              <th>Room</th>
              <th>Survivor</th>
              <th>Status</th>
              <th>Remaining Time</th>
            </tr>
          </thead>
          <tbody>
            {clearingQueue.filter(task => task.status === 'queued').map((task, index) => (
              <tr key={index}>
                <td>{task.buildingName}</td>
                <td>{task.floorNumber}</td>
                <td>{task.roomNumber}</td>
                <td>{task.survivorName}</td>
                <td>{task.status}</td>
                <td>{task.remainingTime}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SurvivorsPage;
