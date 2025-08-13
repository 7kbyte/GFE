import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameById } from '../api';
import RadarChart from '../components/RadarChart';
import { calculateHexagonArea } from '../utils/scoreUtils';

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

  const scores = [game.art, game.music, game.story, game.playability, game.innovation, game.performance];
  const overallScore = calculateHexagonArea(scores);

  return (
    <div className="app-container"> {/* 添加 app-container 类 */}
      <h1>{game.name}</h1>

      <h2>战力图</h2>
      <RadarChart scores={scores} />
      <h3>综合评分: {overallScore}</h3> {/* 建议格式化分数，保留两位小数 */}

      <h2>备注</h2>
      <div className="remarks">
        <p>{game.remarks || '暂无备注。'}</p>
      </div>
    </div>
  );
};

export default GameDetailPage;