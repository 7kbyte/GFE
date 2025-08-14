// src/pages/GameDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameById } from '../api'; // 确保路径正确
import RadarChart from '../components/RadarChart'; // 假设这个组件存在
import { calculateHexagonArea } from '../utils/scoreUtils'; // 假设这个工具函数存在

const GameDetailPage = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getGame = async () => {
      try {
        const data = await fetchGameById(id);
        setGame(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getGame();
  }, [id]);

  // 在加载、错误和未找到游戏状态下也应用容器样式
  if (loading) return <div className="app-container">加载中...</div>;
  if (error) return <div className="app-container error">错误: {error}</div>;
  if (!game) return <div className="app-container">游戏未找到</div>;

  // 确保使用正确的评分属性名
  const scores = [
    game.art_rating,
    game.music_rating,
    game.story_rating,
    game.playability_rating,
    game.innovation_rating,
    game.performance_rating
  ];
  // 确保传入的 scores 都是数字，并处理可能的 null 或 undefined
  const validScores = scores.filter(score => typeof score === 'number' && score !== null);
  const overallScore = validScores.length === 6 ? calculateHexagonArea(validScores) : 'N/A';

  return (
    <div className="app-container game-detail-page"> {/* 添加 game-detail-page 类 */}
      <div className="game-header">
        {game.image_url && (
          <img src={game.image_url} alt={game.name} className="game-detail-image" />
        )}
        <h1>{game.name}</h1>
      </div>

      <div className="game-meta">
        {game.release_year && <p><strong>发行年份:</strong> {game.release_year}</p>}
        {game.developer && <p><strong>开发者:</strong> {game.developer}</p>}
        {game.publisher && <p><strong>发行商:</strong> {game.publisher}</p>}
        {game.platform && <p><strong>平台:</strong> {game.platform}</p>}
        {game.play_time_hours !== null && <p><strong>游玩时长:</strong> {game.play_time_hours} 小时</p>}
        <p><strong>是否通关:</strong> {game.is_completed ? '是' : '否'}</p>
        {game.tags && game.tags.length > 0 && (
          <p><strong>标签:</strong> {game.tags.join(', ')}</p>
        )}
      </div>

      <h2>战力图</h2>
      {validScores.length === 6 ? (
        <>
          <RadarChart scores={validScores} />
          <h3>综合评分: {typeof overallScore === 'number' ? overallScore.toFixed(1) : overallScore}</h3>
        </>
      ) : (
        <p>评分数据不完整，无法生成战力图。</p>
      )}


      <h2>各项评分</h2>
      <div className="ratings-grid">
        <p><strong>美术:</strong> {game.art_rating?.toFixed(1) || 'N/A'}</p>
        <p><strong>音乐:</strong> {game.music_rating?.toFixed(1) || 'N/A'}</p>
        <p><strong>故事:</strong> {game.story_rating?.toFixed(1) || 'N/A'}</p>
        <p><strong>可玩性:</strong> {game.playability_rating?.toFixed(1) || 'N/A'}</p>
        <p><strong>创新性:</strong> {game.innovation_rating?.toFixed(1) || 'N/A'}</p>
        <p><strong>性能:</strong> {game.performance_rating?.toFixed(1) || 'N/A'}</p>
        {game.my_overall_score !== null && (
          <p><strong>我的总分:</strong> {game.my_overall_score.toFixed(1)}</p>
        )}
      </div>

      <h2>我的评价</h2>
      <div className="review-text">
        <p>{game.review_text || '暂无评价。'}</p>
      </div>
    </div>
  );
};

export default GameDetailPage;