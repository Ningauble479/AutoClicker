import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResourceContext } from '../Context/ResourceContext';
import { CurrentBuildingContext } from '../Context/CurrentBuildingContext';
import { SurvivorContext } from '../Context/SurvivorContext';
import BuildingCarousel from '../Components/BuildingCarousel';
import RoomClearingQueue from '../Components/RoomClearingQueue';
import AlertBar from '../Components/AlertBar';
import useRoomClearing from '../hooks/useRoomClearing';
import '../Styles/BuildingPage.css';

const BuildingPage = () => {
  const { id } = useParams();
  const { resources, setResources } = useContext(ResourceContext);
  const { buildings, clearingQueue, updateBuildingHealth, updateFloorHealth, updateRoomType, retakeRoom, addClearingTask } = useContext(CurrentBuildingContext);
  const { survivors } = useContext(SurvivorContext);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [alert, setAlert] = useState(null);

  // Use the useRoomClearing hook
  const { assignTask } = useRoomClearing();

  // Set the initial selected floor when buildings are loaded or the building ID changes
  useEffect(() => {
    if (buildings.length > 0) {
      const building = buildings.find((b) => b.id === parseInt(id));
      if (building) {
        setSelectedFloor(building.floors[0]?.floorNumber || null);
      }
    }
  }, [buildings, id]);

  // Set up a timer to run the assignTask function every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      assignTask();
    }, 2000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [assignTask]);

  // Show loading if buildings data is not available
  if (buildings.length === 0) {
    return <div>Loading...</div>;
  }

  // Find the building with the matching ID
  const building = buildings.find((b) => b.id === parseInt(id));
  if (!building) {
    return <div>Building not found</div>;
  }

  const upgrades = [
    { name: 'Fortify Walls', cost: 100, increment: 10 },
    { name: 'Reinforce Structure', cost: 200, increment: 20 },
  ];

  const roomTypes = ['empty', 'bedroom', 'storage', 'lab'];

  // Handle upgrading the building
  const handleUpgrade = (upgrade) => {
    if (resources >= upgrade.cost) {
      setResources(resources - upgrade.cost);
      updateBuildingHealth(building.id, upgrade.increment);
    } else {
      alert('Not enough resources!');
    }
  };

  // Handle upgrading the floor
  const handleFloorUpgrade = (floorNumber, upgrade) => {
    if (resources >= upgrade.cost) {
      setResources(resources - upgrade.cost);
      updateFloorHealth(building.id, floorNumber, upgrade.increment);
    } else {
      alert('Not enough resources!');
    }
  };

  // Handle changing the room type
  const handleRoomTypeChange = (floorNumber, roomNumber, newType) => {
    updateRoomType(building.id, floorNumber, roomNumber, newType);
  };

  // Handle changing the selected floor
  const handleFloorChange = (event) => {
    setSelectedFloor(parseInt(event.target.value));
    setSelectedRoom(null); // Reset selected room when floor changes
  };

  // Handle changing the selected room
  const handleRoomChange = (event) => {
    setSelectedRoom(parseInt(event.target.value));
  };

  // Handle queuing a room for retaking
  const handleRetakeRoom = (floorNumber, room) => {
    const newTask = {
      buildingName: building.name,
      floorNumber: floorNumber,
      roomNumber: room.roomNumber,
      status: 'queued',
      remainingTime: 0,
      survivorName: '',
      survivorId: null,
    };
    addClearingTask(newTask);
  };

  // Check if a room is already queued for clearing
  const isRoomQueued = (floorNumber, roomNumber) => {
    return clearingQueue.some(task => task.floorNumber === floorNumber && task.roomNumber === roomNumber && task.status === 'queued');
  };

  // Get the current selected floor and room
  const currentFloor = building.floors.find(floor => floor.floorNumber === selectedFloor);
  const currentRoom = currentFloor ? currentFloor.rooms.find(room => room.roomNumber === selectedRoom) : null;

  return (
    <div className="building-page">
      {alert && <AlertBar message={alert} type="success" duration={5000} onClose={() => setAlert(null)} />}
      <BuildingCarousel />
      <div className="building-content">
        <h1>{building.name}</h1>
        <p>{building.description}</p>
        <p>Health: {building.health}%</p>
        <p>Resources: {resources}</p>
        {upgrades.map((upgrade) => (
          <button key={upgrade.name} onClick={() => handleUpgrade(upgrade)}>
            {upgrade.name} (Cost: {upgrade.cost} resources, +{upgrade.increment}% health)
          </button>
        ))}
        <div className="floor-selection">
          <label htmlFor="floor-select">Select Floor:</label>
          <select id="floor-select" value={selectedFloor || ''} onChange={handleFloorChange}>
            <option value="" disabled>Select a floor</option>
            {building.floors.map((floor) => (
              <option key={floor.floorNumber} value={floor.floorNumber}>
                Floor {floor.floorNumber}
              </option>
            ))}
          </select>
        </div>
        {currentFloor && (
          <div className="floor">
            <p>Floor {currentFloor.floorNumber}</p>
            <p>Health: {currentFloor.health}%</p>
            {upgrades.map((upgrade) => (
              <button key={upgrade.name} onClick={() => handleFloorUpgrade(currentFloor.floorNumber, upgrade)}>
                {upgrade.name} (Cost: {upgrade.cost} resources, +{upgrade.increment}% health)
              </button>
            ))}
            <div className="room-selection">
              <label htmlFor="room-select">Select Room:</label>
              <select id="room-select" value={selectedRoom || ''} onChange={handleRoomChange}>
                <option value="" disabled>Select a room</option>
                {currentFloor.rooms.map((room) => (
                  <option key={room.roomNumber} value={room.roomNumber}>
                    Room {room.roomNumber}
                  </option>
                ))}
              </select>
            </div>
            {currentRoom && (
              <div className="room">
                <p>Room {currentRoom.roomNumber}: {currentRoom.type}</p>
                <select value={currentRoom.type} onChange={(e) => handleRoomTypeChange(currentFloor.floorNumber, currentRoom.roomNumber, e.target.value)}>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {!currentRoom.retaken && (
                  <div className="retake-room">
                    <button
                      className="retake-button"
                      onClick={() => handleRetakeRoom(currentFloor.floorNumber, currentRoom)}
                      disabled={isRoomQueued(currentFloor.floorNumber, currentRoom.roomNumber)}
                    >
                      {isRoomQueued(currentFloor.floorNumber, currentRoom.roomNumber) ? 'Queued' : 'Take Room'}
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="room-table">
              <h3>Room Details</h3>
              <table>
                <thead>
                  <tr>
                    <th>Room Number</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Occupancy</th>
                    <th>Equipment</th>
                    <th>Cleanliness</th>
                    <th>Maintenance</th>
                    <th>Notes</th>
                    <th>Danger Level</th>
                    <th>Retaken</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFloor.rooms.map((room) => (
                    <tr key={room.roomNumber} className={room.retaken ? '' : 'fogged'}>
                      <td>{room.roomNumber}</td>
                      <td>{room.type}</td>
                      <td>{room.size || 'N/A'}</td>
                      <td>{room.occupancy || 'N/A'}</td>
                      <td>{room.equipment || 'N/A'}</td>
                      <td>{room.cleanliness || 'N/A'}</td>
                      <td>{room.maintenance || 'N/A'}</td>
                      <td>{room.notes || 'N/A'}</td>
                      <td>{room.dangerLevel}</td>
                      <td>{room.retaken ? 'Yes' : 'No'}</td>
                      <td>
                        <button
                          className="retake-button"
                          onClick={() => handleRetakeRoom(currentFloor.floorNumber, room)}
                          disabled={isRoomQueued(currentFloor.floorNumber, room.roomNumber)}
                        >
                          {isRoomQueued(currentFloor.floorNumber, room.roomNumber) ? 'Queued' : 'Queue Room'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <RoomClearingQueue /> {/* Add the RoomClearingQueue component */}
      </div>
    </div>
  );
};

export default BuildingPage;
