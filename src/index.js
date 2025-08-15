// src/index.js (或你的应用入口文件)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'; // 导入 Router
import { ThemeProvider, createTheme } from '@mui/material/styles'; // 导入主题相关
import CssBaseline from '@mui/material/CssBaseline'; // 导入 CSS 基线

// 创建一个基本的主题，你可以根据需要在这里定制颜色、字体等
import theme from './theme'; // 导入你刚刚创建的主题

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* ThemeProvider 必须包裹你的整个应用，以便所有 Material-UI 组件都能访问主题 */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline 帮助重置浏览器默认样式，提供一致的基线，让组件渲染更一致 */}
      <CssBaseline />
      {/* Router 必须包裹所有使用 Link 的组件 */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);