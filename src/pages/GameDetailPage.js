// src/pages/GameDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameById } from '../api'; // 确保路径正确
import RadarChart from '../components/RadarChart'; // 假设这个组件存在
import { calculateHexagonArea, scoreToGrade } from '../utils/scoreUtils'; // 确保路径正确，并导入 scoreToGrade

// 导入 Material-UI 组件
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Chip,
  Paper,
  Divider,
  Stack,
} from '@mui/material';

// 导入 Material-UI 图标
import InfoIcon from '@mui/icons-material/Info';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // 奖杯图标，用于综合评分

const GameDetailPage = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getGame = async () => {
      try {
        setLoading(true);
        setError(null);
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

  // 加载、错误和未找到游戏状态
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>加载中...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">错误: {error}</Alert>
      </Container>
    );
  }

  if (!game) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning" icon={<InfoIcon fontSize="inherit" />}>
          游戏未找到。请检查游戏ID。
        </Alert>
      </Container>
    );
  }

  // 确保使用正确的评分属性名，并处理可能的 null 或 undefined
  const scores = [
    game.art_rating,
    game.music_rating,
    game.story_rating,
    game.playability_rating,
    game.innovation_rating,
    game.performance_rating
  ];
  // 过滤掉非数字或 null 的评分，确保 RadarChart 接收有效数据
  const validScores = scores.filter(score => typeof score === 'number' && score !== null);
  const overallScore = validScores.length === 6 ? calculateHexagonArea(validScores) : null; // 如果不完整则为 null

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* 游戏头部区域 */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={4} alignItems="center">
          {game.image_url && (
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                image={game.image_url}
                alt={game.name}
                sx={{
                  borderRadius: 1,
                  maxHeight: 400,
                  width: '100%',
                  objectFit: 'cover',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                }}
              />
            </Grid>
          )}
          <Grid item xs={12} md={game.image_url ? 8 : 12}>
            <Typography variant="h3" component="h1" gutterBottom>
              {game.name}
            </Typography>
            {game.release_year && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                <strong>发行年份:</strong> {game.release_year}
              </Typography>
            )}
            {game.developer && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                <strong>开发者:</strong> {game.developer}
              </Typography>
            )}
            {game.publisher && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                <strong>发行商:</strong> {game.publisher}
              </Typography>
            )}
            {game.platform && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                <strong>平台:</strong> {game.platform}
              </Typography>
            )}
            {game.play_time_hours !== null && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                <strong>游玩时长:</strong> {game.play_time_hours} 小时
              </Typography>
            )}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              <strong>是否通关:</strong> {game.is_completed ? '是' : '否'}
            </Typography>
            {game.tags && game.tags.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" component="span" sx={{ mr: 1, fontWeight: 'bold' }}>标签:</Typography>
                {game.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 4 }} /> {/* 分割线 */}

      {/* 战力图区域 */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          游戏战力图
        </Typography>
        {validScores.length === 6 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <RadarChart scores={validScores} />
            {overallScore !== null && (
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                <EmojiEventsIcon color="primary" sx={{ fontSize: 30 }} />
                <Typography variant="h5" component="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  综合评分: {overallScore}
                </Typography>
              </Stack>
            )}
          </Box>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            评分数据不完整，无法生成战力图。请确保所有六个维度都有评分。
          </Alert>
        )}
      </Paper>

      <Divider sx={{ my: 4 }} /> {/* 分割线 */}

      {/* 各项评分区域 */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          各项评分
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: '美术', score: game.art_rating },
            { label: '音乐', score: game.music_rating },
            { label: '故事', score: game.story_rating },
            { label: '可玩性', score: game.playability_rating },
            { label: '创新性', score: game.innovation_rating },
            { label: '性能', score: game.performance_rating },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                  {item.label}:
                </Typography>
                <Typography variant="body1" color="primary">
                  {item.score !== null ? `${item.score.toFixed(1)} (${scoreToGrade(item.score)})` : 'N/A'}
                </Typography>
              </Box>
            </Grid>
          ))}
          {game.my_overall_score !== null && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderTop: '1px solid', borderColor: 'divider', mt: 2 }}>
                <Typography variant="h6" component="span" color="text.primary">
                  我的总分:
                </Typography>
                <Typography variant="h6" color="secondary" sx={{ fontWeight: 'bold' }}>
                  {game.my_overall_score.toFixed(1)}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Divider sx={{ my: 4 }} /> {/* 分割线 */}

      {/* 我的评价区域 */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          我的评价
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          {game.review_text || '暂无评价。'}
        </Typography>
      </Paper>
    </Container>
  );
};

export default GameDetailPage;