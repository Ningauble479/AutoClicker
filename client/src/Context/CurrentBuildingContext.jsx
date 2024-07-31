import React, { createContext, useState, useContext } from 'react';
import { ResourceContext } from './ResourceContext';
import { SurvivorContext } from './SurvivorContext';
import { v4 as uuidv4 } from 'uuid';

const CurrentBuildingContext = createContext();

const CurrentBuildingProvider = ({ children }) => {
  const [buildings, setBuildings] = useState([
    {
      id: 1,
      name: 'Main Building',
      description: 'A sturdy structure used as the main base of operations.',
      health: 80,
      floors: [
        {
          floorNumber: 1,
          health: 75,
          rooms: [
            { roomNumber: 1, type: 'empty', dangerLevel: 10, retaken: false },
            { roomNumber: 2, type: 'bedroom', dangerLevel: 20, retaken: false },
            { roomNumber: 3, type: 'storage', dangerLevel: 15, retaken: false },
          ],
        },
        {
          floorNumber: 2,
          health: 85,
          rooms: [
            { roomNumber: 4, type: 'lab', dangerLevel: 25, retaken: false },
            { roomNumber: 5, type: 'bedroom', dangerLevel: 30, retaken: false },
            { roomNumber: 6, type: 'storage', dangerLevel: 20, retaken: false },
          ],
        },
      ],
    },
  ]);

  const [clearingQueue, setClearingQueue] = useState([]);
  const { setResources } = useContext(ResourceContext);
  const { updateSurvivorStatus } = useContext(SurvivorContext);

  // Function to update the health of a building
  const updateBuildingHealth = (buildingId, increment) => {
    setBuildings((prevBuildings) =>
      prevBuildings.map((building) =>
        building.id === buildingId
          ? { ...building, health: Math.min(100, building.health + increment) }
          : building
      )
    );
  };

  // Function to update the health of a floor in a building
  const updateFloorHealth = (buildingId, floorNumber, increment) => {
    setBuildings((prevBuildings) =>
      prevBuildings.map((building) =>
        building.id === buildingId
          ? {
              ...building,
              floors: building.floors.map((floor) =>
                floor.floorNumber === floorNumber
                  ? { ...floor, health: Math.min(100, floor.health + increment) }
                  : floor
              ),
            }
          : building
      )
    );
  };

  // Function to update the type of a room in a building
  const updateRoomType = (buildingId, floorNumber, roomNumber, newType) => {
    setBuildings((prevBuildings) =>
      prevBuildings.map((building) =>
        building.id === buildingId
          ? {
              ...building,
              floors: building.floors.map((floor) =>
                floor.floorNumber === floorNumber
                  ? {
                      ...floor,
                      rooms: floor.rooms.map((room) =>
                        room.roomNumber === roomNumber ? { ...room, type: newType } : room
                      ),
                    }
                  : floor
              ),
            }
          : building
      )
    );
  };

  // Function to mark a room as retaken
  const retakeRoom = (buildingId, floorNumber, roomNumber) => {
    setBuildings((prevBuildings) =>
      prevBuildings.map((building) =>
        building.id === buildingId
          ? {
              ...building,
              floors: building.floors.map((floor) =>
                floor.floorNumber === floorNumber
                  ? {
                      ...floor,
                      rooms: floor.rooms.map((room) =>
                        room.roomNumber === roomNumber ? { ...room, retaken: true } : room
                      ),
                    }
                  : floor
              ),
            }
          : building
      )
    );
  };

  // Function to add a new clearing task to the queue
  const addClearingTask = (task) => {
    task.id = uuidv4();
    setClearingQueue((prevQueue) => [...prevQueue, task]);
  };

  // Function to update an existing clearing task
  const updateClearingTask = (updatedTask) => {
    setClearingQueue((prevQueue) =>
      prevQueue.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  // Function to remove a clearing task from the queue
  const removeClearingTask = (taskId) => {
    setClearingQueue((prevQueue) => prevQueue.filter((task) => task.id !== taskId));
  };

  // Function to start clearing a room
  const startRoomClearing = (task, survivor) => {
    const { floorNumber, roomNumber, buildingName } = task;
    const building = buildings.find((b) => b.name === buildingName);
    const floor = building.floors.find((f) => f.floorNumber === floorNumber);
    const room = floor.rooms.find((r) => r.roomNumber === roomNumber);

    const damage = room.dangerLevel;
    const supplies = room.dangerLevel;
    const minTime = 15; // 15 seconds
    const maxTime = 180; // 3 minutes (180 seconds)
    const clearingTime = Math.floor(minTime + (maxTime - minTime) * (room.dangerLevel / 100));

    // Set survivor to busy
    updateSurvivorStatus(survivor.id, { busy: true });
    task.survivorName = survivor.name;
    task.survivorId = survivor.id;
    task.status = 'in progress';
    task.remainingTime = clearingTime;

    const clearingInterval = setInterval(() => {
      task.remainingTime -= 1;
      updateClearingTask({ ...task });

      if (task.remainingTime <= 0) {
        clearInterval(clearingInterval);
        // Set survivor to not busy
        updateSurvivorStatus(survivor.id, { busy: false });
        updateClearingTask({ ...task, status: 'completed', remainingTime: 0 });
        updateBuildingContext(survivor, damage, supplies, building.id, floorNumber, roomNumber);
        removeClearingTask(task.id);
      }
    }, 1000);
  };

  // Function to update the building context after a room is cleared
  const updateBuildingContext = (survivor, damage, supplies, buildingId, floorNumber, roomNumber) => {
    setResources((prevResources) => prevResources + supplies);
    retakeRoom(buildingId, floorNumber, roomNumber);
  };

  return (
    <CurrentBuildingContext.Provider
      value={{
        buildings,
        clearingQueue,
        updateBuildingHealth,
        updateFloorHealth,
        updateRoomType,
        retakeRoom,
        addClearingTask,
        updateClearingTask,
        removeClearingTask,
        startRoomClearing,
      }}
    >
      {children}
    </CurrentBuildingContext.Provider>
  );
};

export { CurrentBuildingContext, CurrentBuildingProvider };
