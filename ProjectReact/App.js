import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './Components/Login';
import Ajouter from './Components/Ajouter';
import NavigationBar from './Components/NavigationBar';
import Index from './Components/Index';

function App() {
  return (
    <Router>
		
		<Routes>
			<Route path="/" element={<Index />} />
			<Route path="/Login" element={<Login />} />
			<Route path="/Ajouter" element={<Ajouter />} />
		{/* Define your other routes here */}
		</Routes>
    </Router>
  );
}

export default App;

