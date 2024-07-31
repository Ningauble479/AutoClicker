import React, { createContext, useState, useContext, useEffect } from 'react';
import { CurrentBuildingContext } from './CurrentBuildingContext';

const SurvivorContext = createContext();

const SurvivorProvider = ({ children }) => {
  const initialSurvivors = [
    { id: 1, name: 'John', health: 100, scavenging: 5, combat: 5, survival: 5, role: 'Idle', busy: false },
    { id: 2, name: 'Jane', health: 100, scavenging: 6, combat: 4, survival: 6, role: 'Idle', busy: false },
    { id: 3, name: 'Sam', health: 100, scavenging: 4, combat: 6, survival: 4, role: 'Idle', busy: false },
    { id: 4, name: 'Anna', health: 100, scavenging: 7, combat: 3, survival: 7, role: 'Idle', busy: false },
    { id: 5, name: 'Mike', health: 100, scavenging: 5, combat: 7, survival: 5, role: 'Idle', busy: false },
    { id: 6, name: 'Sara', health: 100, scavenging: 6, combat: 4, survival: 6, role: 'Idle', busy: false },
    { id: 7, name: 'Tom', health: 100, scavenging: 4, combat: 5, survival: 4, role: 'Idle', busy: false },
    { id: 8, name: 'Lucy', health: 100, scavenging: 6, combat: 3, survival: 7, role: 'Idle', busy: false },
    { id: 9, name: 'Bob', health: 100, scavenging: 5, combat: 6, survival: 5, role: 'Idle', busy: false },
    { id: 10, name: 'Eve', health: 100, scavenging: 7, combat: 4, survival: 6, role: 'Idle', busy: false },
  ];

  const [survivors, setSurvivors] = useState(initialSurvivors);
  const { clearingQueue, startRoomClearing } = useContext(CurrentBuildingContext);

  // Function to update the role of a survivor
  const updateSurvivorRole = (id, role) => {
    setSurvivors((prevSurvivors) =>
      prevSurvivors.map((survivor) =>
        survivor.id === id ? { ...survivor, role } : survivor
      )
    );

    // Assign task if role is Room Clearing and survivor is available
    if (role === 'Room Clearing') {
      const availableSurvivor = survivors.find((survivor) => survivor.id === id && !survivor.busy);
      const taskToStart = clearingQueue.find((task) => task.status === 'queued');

      if (availableSurvivor && taskToStart) {
        startRoomClearing(taskToStart, availableSurvivor);
      }
    }
  };

  // Function to update the busy status of a survivor
  const updateSurvivorStatus = (id, status) => {
    setSurvivors((prevSurvivors) =>
      prevSurvivors.map((survivor) =>
        survivor.id === id ? { ...survivor, ...status } : survivor
      )
    );
  };

  // Function to update the health of a survivor
  const updateHealth = (id, amount) => {
    setSurvivors((prevSurvivors) =>
      prevSurvivors.map((survivor) =>
        survivor.id === id ? { ...survivor, health: Math.min(100, Math.max(0, survivor.health + amount)) } : survivor
      )
    );
  };

  // Check and assign tasks to idle survivors every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const availableSurvivor = survivors.find((survivor) => survivor.role === 'Room Clearing' && !survivor.busy);
      const taskToStart = clearingQueue.find((task) => task.status === 'queued');

      if (availableSurvivor && taskToStart) {
        startRoomClearing(taskToStart, availableSurvivor);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [survivors, clearingQueue, startRoomClearing]);

  return (
    <SurvivorContext.Provider value={{ survivors, updateSurvivorRole, updateSurvivorStatus, updateHealth }}>
      {children}
    </SurvivorContext.Provider>
  );
};

export { SurvivorContext, SurvivorProvider };
