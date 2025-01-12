import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Setupmqtt from './pages/Setupmqtt';
import WebSocketPage from './pages/WebSocketPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WebSocketPage />} />
        <Route path="/mqtt" element={<Setupmqtt />} />
      </Routes>
    </Router>
  );
}

export default App;
