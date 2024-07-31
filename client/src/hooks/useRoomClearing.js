import { useContext, useEffect } from 'react';
import { SurvivorContext } from '../Context/SurvivorContext';
import { CurrentBuildingContext } from '../Context/CurrentBuildingContext';

const useRoomClearing = () => {
  const { survivors } = useContext(SurvivorContext);
  const { clearingQueue, startRoomClearing } = useContext(CurrentBuildingContext);

  // Function to assign tasks to available survivors
  const assignTask = () => {
    const availableSurvivor = survivors.find((s) => s.role === 'Room Clearing' && !s.busy);
    if (availableSurvivor) {
      const taskToStart = clearingQueue.find((task) => task.status === 'queued');
      if (taskToStart) {
        startRoomClearing(taskToStart, availableSurvivor);
      }
    }
  };

  // Return the assignTask function so it can be called from outside
  return { assignTask };
};

export default useRoomClearing;
