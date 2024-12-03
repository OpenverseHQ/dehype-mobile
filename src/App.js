import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CategoryList from './CategoryList';
import CategoryDetail from './CategoryDetail';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CategoryList />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
