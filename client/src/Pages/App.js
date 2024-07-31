import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../Styles/App.css';
import Sidebar from '../Components/Sidebar';
import Home from '../Pages/Home';
import Upgrades from '../Pages/Upgrades';
import Settings from '../Pages/Settings';
import MainMenu from '../Pages/MainMenu';
import BuildingPage from '../Pages/BuildingPage';
import SurvivorsPage from '../Pages/SurvivorsPage';
import { ResourceProvider } from '../Context/ResourceContext';
import { SurvivorProvider } from '../Context/SurvivorContext';
import { CurrentBuildingProvider } from '../Context/CurrentBuildingContext';

function App() {
  return (
    <ResourceProvider>
      <SurvivorProvider>
      <CurrentBuildingProvider>
          <Router>
            <div className="App">
              <Sidebar />
              <div className="main-content">
                <Routes>
                  <Route path="/" element={<MainMenu />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/upgrades" element={<Upgrades />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/building/:id" element={<BuildingPage />} />
                  <Route path="/survivors" element={<SurvivorsPage />} />
                </Routes>
              </div>
            </div>
          </Router>
      </CurrentBuildingProvider>
      </SurvivorProvider>
    </ResourceProvider>
  );
}

export default App;
