import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/main.css'; // 引入全局样式
import './css/App.css'; // 引入应用样式
import './css/game.css'; // 引入游戏详情页样式
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);