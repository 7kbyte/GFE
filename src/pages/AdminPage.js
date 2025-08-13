import React, { useEffect, useState } from 'react';
import { fetchGames, createGame, updateGame, deleteGame } from '../api';
import GameForm from '../components/GameForm';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGame, setEditingGame] = useState(null); // null 表示新建，对象表示编辑

  // 加载游戏列表
  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await fetchGames();
      setGames(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  // 处理创建或更新游戏
  const handleCreateOrUpdate = async (gameData) => {
    try {
      if (editingGame && editingGame.id) {
        // 更新现有游戏
        await updateGame(editingGame.id, gameData);
        alert('游戏更新成功！');
      } else {
        // 创建新游戏
        await createGame(gameData);
        alert('游戏创建成功！');
      }
      setEditingGame(null); // 重置表单状态（回到新建模式）
      await loadGames(); // 重新加载游戏列表以显示最新数据
    } catch (err) {
      alert(`操作失败: ${err.message}`);
    }
  };

  // 处理删除游戏
  const handleDelete = async (id) => {
    if (window.confirm('确定要删除此游戏吗？此操作不可撤销！')) {
      try {
        await deleteGame(id);
        alert('游戏删除成功！');
        await loadGames();
      } catch (err) {
        alert(`删除失败: ${err.message}`);
      }
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div className="app-container">
      <h1>管理员页面</h1>
      <p><Link to="/">返回主页</Link></p>

      {/* 游戏创建/编辑表单 */}
      <GameForm
        initialData={editingGame || {}} // 传入当前编辑的游戏数据，或空对象表示新建
        onSubmit={handleCreateOrUpdate}
        onCancel={() => setEditingGame(null)} // 取消编辑时重置状态
      />

      <h2>管理游戏</h2>
      {games.length === 0 ? (
        <p>暂无游戏可管理。</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id} className="game-card">
              <span>{game.name}</span>
              <div>
                <button onClick={() => setEditingGame(game)}>编辑</button>
                <button className="delete" onClick={() => handleDelete(game.id)}>删除</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPage;