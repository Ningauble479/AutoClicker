import React, { useContext } from 'react';
import { CurrentBuildingContext } from '../Context/CurrentBuildingContext';
import '../Styles/RoomClearingQueue.css';

// Component to display the room clearing queue table
const RoomClearingQueue = () => {
  const { clearingQueue } = useContext(CurrentBuildingContext);

  return (
    <div className="room-clearing-queue">
      <h3>Room Clearing Queue</h3>
      <div className="table-container">
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
      </div>
    </div>
  );
};

export default RoomClearingQueue;
