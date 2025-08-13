// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          {/* 这里可以使用一个图标或简单的文字作为Logo */}
          {/* 例如，如果你有一个logo图片，可以这样使用：
          <img src="/images/your-logo.png" alt="游戏评分 Logo" className="logo-image" />
          */}
          🎮 游戏评分站
        </Link>
        {/* 未来你可以在这里添加其他导航链接或用户菜单 */}
      </div>
    </header>
  );
};

export default Header;