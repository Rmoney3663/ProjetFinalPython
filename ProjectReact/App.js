import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './Components/Login';
import Ajouter from './Components/Ajouter';
import Utilisateur from './Components/Utilisateur'; 
import NavigationBar from './Components/NavigationBar';
import Index from './Components/Index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Ajouter" element={<Ajouter />} />
        <Route path="/Utilisateur/:id" element={<Utilisateur />} />
      </Routes>
    </Router>
  );
}

export default App;

