// src/pages/AdminPage.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchGames,
  createGame,
  updateGame,
  deleteGame,
  fetchAllTags,
  deleteTag,
  addGameTags,
  deleteGameTag
} from '../api'; // 确保路径正确

// 辅助函数：将评分转换为浮点数，并确保在有效范围内
const parseRating = (value) => {
  const num = parseFloat(value);
  if (isNaN(num) || num < 0.0 || num > 10.0) {
    return null; // 返回 null 或抛出错误，取决于你的验证策略
  }
  return num;
};

// 初始游戏表单状态
const initialGameFormState = {
  name: '',
  image_url: '',
  release_year: '',
  developer: '',
  publisher: '',
  platform: '',
  art_rating: '',
  music_rating: '',
  story_rating: '',
  playability_rating: '',
  innovation_rating: '',
  performance_rating: '',
  review_text: '',
  my_overall_score: '',
  is_completed: false,
  play_time_hours: '',
  tags: '', // 逗号分隔的字符串
};

const AdminPage = () => {
  const [games, setGames] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameForm, setGameForm] = useState(initialGameFormState);
  const [editingGameId, setEditingGameId] = useState(null); // 当前正在编辑的游戏ID
  const [newTagName, setNewTagName] = useState('');

  // 游戏列表的搜索、排序、分页状态 (与 HomePage 类似)
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5); // 管理页可以少一点
  const [totalPages, setTotalPages] = useState(1);
  const [totalGames, setTotalGames] = useState(0);

  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        search: searchQuery,
        sort_by: sortBy,
        order: sortOrder,
        page: currentPage,
        per_page: perPage,
      };
      const data = await fetchGames(params);
      setGames(data.games);
      setTotalPages(data.total_pages);
      setTotalGames(data.total_games);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, sortOrder, currentPage, perPage]);

  const loadTags = useCallback(async () => {
    try {
      const data = await fetchAllTags();
      setTags(data.tags);
    } catch (err) {
      console.error("Failed to fetch tags:", err.message);
      setError("获取标签失败: " + err.message);
    }
  }, []);

  useEffect(() => {
    loadGames();
    loadTags();
  }, [loadGames, loadTags]);

  // --- 游戏表单处理 ---
  const handleGameFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGameForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateGameForm = () => {
    const { name, art_rating, music_rating, story_rating, playability_rating, innovation_rating, performance_rating } = gameForm;
    if (!name.trim()) return "游戏名称不能为空。";

    const ratings = { art_rating, music_rating, story_rating, playability_rating, innovation_rating, performance_rating };
    for (const key in ratings) {
      const value = parseRating(ratings[key]);
      if (value === null) {
        return `评分 ${key.replace('_rating', '')} 必须是 0.0 到 10.0 之间的小数。`;
      }
    }
    return null; // 验证通过
  };

  const handleSubmitGame = async (e) => {
    e.preventDefault();
    const validationError = validateGameForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null); // 清除之前的错误

    const gameDataToSend = {
      ...gameForm,
      release_year: gameForm.release_year ? parseInt(gameForm.release_year) : null,
      play_time_hours: gameForm.play_time_hours ? parseInt(gameForm.play_time_hours) : null,
      art_rating: parseRating(gameForm.art_rating),
      music_rating: parseRating(gameForm.music_rating),
      story_rating: parseRating(gameForm.story_rating),
      playability_rating: parseRating(gameForm.playability_rating),
      innovation_rating: parseRating(gameForm.innovation_rating),
      performance_rating: parseRating(gameForm.performance_rating),
      my_overall_score: gameForm.my_overall_score ? parseRating(gameForm.my_overall_score) : null,
      tags: gameForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag), // 转换为数组
    };

    try {
      if (editingGameId) {
        await updateGame(editingGameId, gameDataToSend);
        alert('游戏更新成功！');
      } else {
        await createGame(gameDataToSend);
        alert('游戏添加成功！');
      }
      setGameForm(initialGameFormState);
      setEditingGameId(null);
      loadGames(); // 重新加载游戏列表
      loadTags(); // 重新加载标签列表 (因为可能添加了新标签)
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditGame = (game) => {
    setEditingGameId(game.id);
    setGameForm({
      name: game.name,
      image_url: game.image_url || '',
      release_year: game.release_year || '',
      developer: game.developer || '',
      publisher: game.publisher || '',
      platform: game.platform || '',
      art_rating: game.art_rating?.toFixed(1) || '',
      music_rating: game.music_rating?.toFixed(1) || '',
      story_rating: game.story_rating?.toFixed(1) || '',
      playability_rating: game.playability_rating?.toFixed(1) || '',
      innovation_rating: game.innovation_rating?.toFixed(1) || '',
      performance_rating: game.performance_rating?.toFixed(1) || '',
      review_text: game.review_text || '',
      my_overall_score: game.my_overall_score?.toFixed(1) || '',
      is_completed: game.is_completed,
      play_time_hours: game.play_time_hours || '',
      tags: game.tags ? game.tags.join(', ') : '', // 将标签数组转为字符串
    });
  };

  const handleDeleteGame = async (gameId) => {
    if (window.confirm('确定要删除这个游戏吗？')) {
      try {
        await deleteGame(gameId);
        alert('游戏删除成功！');
        loadGames();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // --- 标签管理 ---
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      setError("标签名称不能为空。");
      return;
    }
    setError(null);
    try {
      // 实际上，添加标签是通过 createGame 或 updateGame 时的 tags 字段自动处理的。
      // 这里是提供一个单独添加"全局"标签的接口，但后端目前没有直接的 POST /tags 接口。
      // 如果要实现独立添加标签功能，需要后端提供一个 POST /tags 接口。
      // 目前，标签是在游戏创建/更新时自动创建的。
      // 为了演示，我们可以模拟一个添加标签到某个游戏的操作，或者直接提示用户标签会在游戏添加时自动创建。
      alert("标签会在添加或修改游戏时自动创建。此处仅用于展示现有标签。");
      setNewTagName('');
      loadTags();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (window.confirm('确定要删除这个标签吗？这会从所有关联游戏中移除它。')) {
      try {
        await deleteTag(tagId);
        alert('标签删除成功！');
        loadTags(); // 重新加载标签列表
        loadGames(); // 重新加载游戏列表，以反映标签变化
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // --- 游戏列表过滤/排序/分页控制 (与 HomePage 相同) ---
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };
  const handleOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };
  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const allowedSortFields = [
    { value: 'updated_at', label: '最近更新' },
    { value: 'name', label: '名称' },
    { value: 'release_year', label: '发行年份' },
    { value: 'art_rating', label: '美术评分' },
    { value: 'music_rating', label: '音乐评分' },
    { value: 'story_rating', label: '故事评分' },
    { value: 'playability_rating', label: '可玩性评分' },
    { value: 'innovation_rating', label: '创新性评分' },
    { value: 'performance_rating', label: '性能评分' },
    { value: 'my_overall_score', label: '综合评分' },
  ];


  if (loading) return <div className="app-container">加载中...</div>;
  if (error) return <div className="app-container error">错误: {error}</div>;

  return (
    <div className="app-container admin-page">
      <h1>管理员面板</h1>

      {error && <div className="error-message">{error}</div>}

      <section className="admin-section">
        <h2>{editingGameId ? '编辑游戏' : '添加新游戏'}</h2>
        <form onSubmit={handleSubmitGame} className="game-form">
          <div className="form-group">
            <label>名称*:</label>
            <input type="text" name="name" value={gameForm.name} onChange={handleGameFormChange} required />
          </div>
          <div className="form-group">
            <label>图片URL:</label>
            <input type="text" name="image_url" value={gameForm.image_url} onChange={handleGameFormChange} />
          </div>
          <div className="form-group">
            <label>发行年份:</label>
            <input type="number" name="release_year" value={gameForm.release_year} onChange={handleGameFormChange} />
          </div>
          <div className="form-group">
            <label>开发者:</label>
            <input type="text" name="developer" value={gameForm.developer} onChange={handleGameFormChange} />
          </div>
          <div className="form-group">
            <label>发行商:</label>
            <input type="text" name="publisher" value={gameForm.publisher} onChange={handleGameFormChange} />
          </div>
          <div className="form-group">
            <label>平台:</label>
            <input type="text" name="platform" value={gameForm.platform} onChange={handleGameFormChange} />
          </div>

          <h3>评分 (0.0 - 10.0)*</h3>
          <div className="ratings-input-grid">
            <div className="form-group">
              <label>美术:</label>
              <input type="number" step="0.1" name="art_rating" value={gameForm.art_rating} onChange={handleGameFormChange} required />
            </div>
            <div className="form-group">
              <label>音乐:</label>
              <input type="number" step="0.1" name="music_rating" value={gameForm.music_rating} onChange={handleGameFormChange} required />
            </div>
            <div className="form-group">
              <label>故事:</label>
              <input type="number" step="0.1" name="story_rating" value={gameForm.story_rating} onChange={handleGameFormChange} required />
            </div>
            <div className="form-group">
              <label>可玩性:</label>
              <input type="number" step="0.1" name="playability_rating" value={gameForm.playability_rating} onChange={handleGameFormChange} required />
            </div>
            <div className="form-group">
              <label>创新性:</label>
              <input type="number" step="0.1" name="innovation_rating" value={gameForm.innovation_rating} onChange={handleGameFormChange} required />
            </div>
            <div className="form-group">
              <label>性能:</label>
              <input type="number" step="0.1" name="performance_rating" value={gameForm.performance_rating} onChange={handleGameFormChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>我的综合评分 (0.0 - 10.0):</label>
            <input type="number" step="0.1" name="my_overall_score" value={gameForm.my_overall_score} onChange={handleGameFormChange} />
          </div>
          <div className="form-group">
            <label>评价:</label>
            <textarea name="review_text" value={gameForm.review_text} onChange={handleGameFormChange}></textarea>
          </div>
          <div className="form-group checkbox-group">
            <label>已通关:</label>
            <input type="checkbox" name="is_completed" checked={gameForm.is_completed} onChange={handleGameFormChange} />
          </div>
          <div className="form-group">
            <label>游玩时长 (小时):</label>
            <input type="number" name="play_time_hours" value={gameForm.play_time_hours} onChange={handleGameFormChange} />
          </div>
          <div className="form-group">
            <label>标签 (逗号分隔):</label>
            <input type="text" name="tags" value={gameForm.tags} onChange={handleGameFormChange} placeholder="例如: RPG, 动作, 独立游戏" />
          </div>

          <button type="submit">{editingGameId ? '更新游戏' : '添加游戏'}</button>
          {editingGameId && (
            <button type="button" onClick={() => { setEditingGameId(null); setGameForm(initialGameFormState); }}>取消编辑</button>
          )}
        </form>
      </section>

      <section className="admin-section">
        <h2>管理游戏列表</h2>
        <div className="filters-container">
          <input
            type="text"
            placeholder="搜索游戏..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />

          <div className="sort-controls">
            <label htmlFor="adminSortBy">排序依据:</label>
            <select id="adminSortBy" value={sortBy} onChange={handleSortChange}>
              {allowedSortFields.map(field => (
                <option key={field.value} value={field.value}>{field.label}</option>
              ))}
            </select>

            <label htmlFor="adminSortOrder">顺序:</label>
            <select id="adminSortOrder" value={sortOrder} onChange={handleOrderChange}>
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>

            <label htmlFor="adminPerPage">每页显示:</label>
            <select id="adminPerPage" value={perPage} onChange={handlePerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>

        {games.length === 0 ? (
          <p>没有找到游戏。</p>
        ) : (
          <table className="game-admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>名称</th>
                <th>发行年份</th>
                <th>综合评分</th>
                <th>标签</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id}>
                  <td>{game.id}</td>
                  <td>{game.name}</td>
                  <td>{game.release_year || 'N/A'}</td>
                  <td>{game.my_overall_score !== null ? game.my_overall_score.toFixed(1) : 'N/A'}</td>
                  <td>{game.tags && game.tags.length > 0 ? game.tags.join(', ') : '无'}</td>
                  <td className="actions">
                    <button onClick={() => handleEditGame(game)}>编辑</button>
                    <button onClick={() => handleDeleteGame(game.id)} className="delete-button">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 分页控制 */}
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              上一页
            </button>
            <span>
              页码 {currentPage} / {totalPages} (共 {totalGames} 条)
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              下一页
            </button>
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2>管理标签</h2>
        <form onSubmit={handleAddTag} className="tag-form">
          <input
            type="text"
            placeholder="新标签名称"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
          />
          <button type="submit">添加标签 (请通过游戏添加)</button>
        </form>

        {tags.length === 0 ? (
          <p>没有可用的标签。</p>
        ) : (
          <ul className="tag-list">
            {tags.map((tag) => (
              <li key={tag.id}>
                {tag.name}
                <button onClick={() => handleDeleteTag(tag.id)} className="delete-button">删除</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminPage;