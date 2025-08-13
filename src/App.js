import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import AdminPage from './pages/AdminPage';
import Header from './components/Header'; // 引入新的 Header 组件
import './index.css'; // 引入全局样式
import './App.css';

function App() {
  return (
    <Router>
      <Header /> {/* 将 Header 组件放在这里，它会在所有路由之上渲染 */}
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:id" element={<GameDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;