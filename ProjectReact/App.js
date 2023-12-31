import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './Components/Login';
import Ajouter from './Components/Ajouter';
import Utilisateur from './Components/Utilisateur'; 
import NavigationBar from './Components/NavigationBar';
import Explorer from './Components/Explorer'
import Index from './Components/Index';
import NotFound from './Components/NotFound'; 
import ErrorBoundary from './Components/ErrorBoundary';
import Modifier from './Components/Modifier';
import { AppProvider } from './Components/AppContext';

function App() {
  return (
    <Router>
		<ErrorBoundary>
	 		<AppProvider>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/Login" element={<Login />} />
					<Route path="/Ajouter" element={<Ajouter />} />
					<Route path="/Utilisateur/:id" element={<Utilisateur />} />
					<Route path="/explorer" element={<Explorer />} />
					<Route path="/Modifier" element={<Modifier />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</AppProvider>	
 		</ErrorBoundary>
    </Router>
  );
}

export default App;

