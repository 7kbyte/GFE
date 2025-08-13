import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGames } from '../api';

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getGames = async () => {
      try {
        const data = await fetchGames();
        setGames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getGames();
  }, []);

  // 在加载和错误状态下也应用容器样式
  if (loading) return <div className="app-container">加载中...</div>;
  if (error) return <div className="app-container error">错误: {error}</div>;

  return (
    <div className="app-container"> {/* 添加 app-container 类 */}
      <h1>游戏评分网站</h1>
      <p>
        <Link to="/admin" className="button-link">前往管理员页面</Link> {/* 添加 button-link 类 */}
      </p>
      <h2>已评分游戏</h2>
      {games.length === 0 ? (
        <p>暂无已评分游戏。请前往管理员页面添加。</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <Link to={`/game/${game.id}`}>{game.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;