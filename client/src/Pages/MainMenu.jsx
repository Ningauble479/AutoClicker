import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/MainMenu.css';

const MainMenu = () => {
  const navigate = useNavigate();

  const startNewGame = () => {
    navigate('/home');
  };

  return (
    <div className="main-menu">
      <h1>Zombie Survival Game</h1>
      <button onClick={startNewGame}>New Game</button>
    </div>
  );
};

export default MainMenu;