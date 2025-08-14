// src/pages/HomePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchGames } from '../api'; // 确保路径正确

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated_at'); // 默认按更新时间排序
  const [sortOrder, setSortOrder] = useState('desc'); // 默认降序
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
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

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // 搜索时重置到第一页
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // 排序时重置到第一页
  };

  const handleOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // 排序时重置到第一页
  };

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setCurrentPage(1); // 改变每页数量时重置到第一页
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="app-container">加载中...</div>;
  if (error) return <div className="app-container error">错误: {error}</div>;

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

  return (
    <div className="app-container">
      <h1>我的游戏收藏</h1>

      <div className="filters-container">
        <input
          type="text"
          placeholder="搜索游戏、评价或标签..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />

        <div className="sort-controls">
          <label htmlFor="sortBy">排序依据:</label>
          <select id="sortBy" value={sortBy} onChange={handleSortChange}>
            {allowedSortFields.map(field => (
              <option key={field.value} value={field.value}>{field.label}</option>
            ))}
          </select>

          <label htmlFor="sortOrder">顺序:</label>
          <select id="sortOrder" value={sortOrder} onChange={handleOrderChange}>
            <option value="desc">降序</option>
            <option value="asc">升序</option>
          </select>

          <label htmlFor="perPage">每页显示:</label>
          <select id="perPage" value={perPage} onChange={handlePerPageChange}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {games.length === 0 ? (
        <p>没有找到游戏。</p>
      ) : (
        <div className="game-list">
          {games.map((game) => (
            <Link to={`/game/${game.id}`} key={game.id} className="game-card-link">
              <div className="game-card">
                {game.image_url && (
                  <img src={game.image_url} alt={game.name} className="game-card-image" />
                )}
                <div className="game-card-content">
                  <h2>{game.name}</h2>
                  {game.my_overall_score !== null && (
                    <p>综合评分: <span className="score-highlight">{game.my_overall_score.toFixed(1)}</span></p>
                  )}
                  {game.tags && game.tags.length > 0 && (
                    <p className="game-tags">标签: {game.tags.join(', ')}</p>
                  )}
                  <p className="game-card-review">{game.review_text ? game.review_text.substring(0, 100) + '...' : '暂无评价'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
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
    </div>
  );
};

export default HomePage;