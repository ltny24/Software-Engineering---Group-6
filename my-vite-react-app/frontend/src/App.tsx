import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppealPage from './pages/appeals/AppealPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppealPage />} />
      </Routes>
    </Router>
  );
};

export default App;