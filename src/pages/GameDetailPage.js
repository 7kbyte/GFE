import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameById } from '../api'; // 确保路径正确
import RadarChart from '../components/RadarChart'; // 假设这个组件存在
import { calculateHexagonArea, scoreToGrade } from '../utils/scoreUtils'; // 确保路径正确，并导入 scoreToGrade

// 导入 Material-UI 组件
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles'; // 导入 styled 和 useTheme

// 自定义一个样式组件，用于综合评分的显示
const OverallScoreBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
  background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
  color: theme.palette.primary.contrastText,
  boxShadow: theme.shadows[5],
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const GameDetailPage = () => {
  // 从 URL 获取 gameId，修正为 { id }
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme(); // 获取 Material-UI 主题

  useEffect(() => {
    const getGameDetails = async () => {
      try {
        setLoading(true);
        // 使用修正后的 id
        const data = await fetchGameById(id);
        setGame(data);
      } catch (err) {
        console.error("Failed to fetch game details:", err);
        setError(err.message || "加载游戏详情失败。");
      } finally {
        setLoading(false);
      }
    };

    getGameDetails();
  }, [id]); // 依赖 id，当 ID 变化时重新加载

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>加载中...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!game) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">未找到游戏信息。</Alert>
      </Box>
    );
  }

  // 提取评分数据，用于雷达图和详细评分
  const scores = [
    game.art_rating,
    game.music_rating,
    game.story_rating,
    game.playability_rating,
    game.innovation_rating,
    game.performance_rating,
  ];

  // 计算综合评分（雷达图面积）
  const overallAreaScore = calculateHexagonArea(scores);

  const scoreLabels = ['美术', '音乐', '剧情', '可玩性', '创新性', '运行效率'];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Information Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: { xs: 'flex-start', sm: 'center' } }}>
            {game.image_url && (
              <Box
                component="img"
                src={game.image_url}
                alt={game.name}
                sx={{
                  width: { xs: '100%', sm: 200 }, // 小屏幕全宽，大屏幕固定宽度
                  height: 'auto',
                  borderRadius: 1,
                  objectFit: 'cover',
                  flexShrink: 0, // 防止图片缩小
                }}
              />
            )}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {game.name}
              </Typography>

              {/* 标签 - 修改后的部分 */}
              {game.tags && game.tags.length > 0 && (
                <Box sx={{ mb: 2 }}> {/* 调整外边距，以匹配原先 Stack 的 mb:2 */}
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>标签:</Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {game.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="filled" // 使用实心标签
                        color="secondary"
                        sx={{ mb: 0.5 }} // 为了应对 flexWrap 时的垂直间距
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Typography variant="body1" color="text.secondary">
                创建时间: {new Date(game.created_at).toLocaleDateString()}
              </Typography>
              {game.updated_at && (
                <Typography variant="body2" color="text.secondary">
                  最后更新: {new Date(game.updated_at).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Radar Chart and Comment Section */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        {/* Radar Chart */}
        <Card sx={{ flex: 1, minWidth: { md: '45%' } }}> {/* flex: 1 让它占据可用空间，minWidth 确保在小屏幕下不会太窄 */}
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              综合能力雷达图
            </Typography>
            <Box sx={{ height: 350, width: '100%' }}>
              <RadarChart scores={scores} />
            </Box>
          </CardContent>
        </Card>

        {/* Comment Section */}
        <Card sx={{ flex: 1, minWidth: { md: '45%' } }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              游戏评价
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {game.review_text || '暂无详细评价。'}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Score Detail Section */}
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            评分详情
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {/* Individual Scores */}
            {scores.map((score, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: theme.palette.background.default,
                  // 响应式宽度，实现类似 Grid 的效果
                  width: 170,
                }}
              >
                <Typography variant="subtitle1" color="text.secondary">
                  {scoreLabels[index]}评分
                </Typography>
                <Typography variant="h6" component="span" sx={{
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                  mt: 0.5
                }}>
                  {score !== null ? score.toFixed(1) : 'N/A'}
                  <Typography component="span" variant="body2" sx={{ ml: 1, color: theme.palette.text.secondary }}>
                    ({scoreToGrade(score)})
                  </Typography>
                </Typography>
              </Box>
            ))}

            {/* Overall Score (Hexagon Area) */}
            <Box sx={{ width: '100%', mt: 2 }}> {/* 确保综合评分独占一行 */}
              <Divider sx={{ my: 1 }} /> {/* 调整分隔线外边距 */}
              <OverallScoreBox>
                <Typography variant="h6" component="div">
                  综合评分 (雷达图面积)
                </Typography>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {overallAreaScore}
                </Typography>
              </OverallScoreBox>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GameDetailPage;  