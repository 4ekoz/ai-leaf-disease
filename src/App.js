import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import PlantCheck from './PlantCheck';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/plant-check" element={<PrivateRoute><PlantCheck /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;