// src/pages/HomePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchGames } from '../api'; // 确保路径正确

// 导入 Material-UI 组件
import {
  Container,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Pagination,
  Stack, // 用于水平或垂直排列元素
  Chip, // 用于标签
} from '@mui/material';

// 导入 Material-UI 图标 (可选，用于美化)
import StarIcon from '@mui/icons-material/Star';

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
    setPerPage(parseInt(e.target.value, 10)); // 确保是数字
    setCurrentPage(1); // 改变每页数量时重置到第一页
  };

  // Pagination 组件的 onChange 事件会传入 page 参数
  const handlePageChange = (event, page) => {
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

  return (
    // Container 用于限制内容的最大宽度，并提供水平居中
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> {/* mt/mb 是 margin-top/bottom */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        我的游戏收藏
      </Typography>

      {/* 搜索和筛选控件 */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }} // 小屏幕上垂直堆叠，中等屏幕及以上水平堆叠
        spacing={2} // 元素之间的间距
        alignItems={{ xs: 'stretch', sm: 'flex-end' }} // 垂直对齐方式
        justifyContent="space-between" // 水平对齐方式
        sx={{ mb: 4 }} // margin-bottom
      >
        <TextField
          label="搜索游戏、评价或标签..."
          variant="outlined" // 边框样式
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: { xs: '100%', sm: 'auto' } }} // 小屏幕宽度100%，大屏幕自动
        />

        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="sortBy-label">排序依据</InputLabel>
            <Select
              labelId="sortBy-label"
              id="sortBy"
              value={sortBy}
              label="排序依据"
              onChange={handleSortChange}
            >
              {allowedSortFields.map((field) => (
                <MenuItem key={field.value} value={field.value}>
                  {field.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel id="sortOrder-label">顺序</InputLabel>
            <Select
              labelId="sortOrder-label"
              id="sortOrder"
              value={sortOrder}
              label="顺序"
              onChange={handleOrderChange}
            >
              <MenuItem value="desc">降序</MenuItem>
              <MenuItem value="asc">升序</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 80 }}>
            <InputLabel id="perPage-label">每页</InputLabel>
            <Select
              labelId="perPage-label"
              id="perPage"
              value={perPage}
              label="每页"
              onChange={handlePerPageChange}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {/* 加载和错误状态 */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>加载中...</Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          错误: {error}
        </Alert>
      )}

      {/* 游戏列表 */}
      {!loading && !error && games.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          没有找到游戏。
        </Typography>
      )}

      {!loading && !error && games.length > 0 && (
        <Grid container spacing={4}> {/* spacing 定义网格项之间的间距 */}
          {games.map((game) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}> {/* 响应式网格布局 */}
              {/* Card 组件用于显示游戏信息，component={Link} 使整个卡片可点击并导航 */}
              <Card
                component={Link}
                to={`/game/${game.id}`}
                sx={{
                  height: '100%', // 确保卡片高度一致
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none', // 移除 Link 默认下划线
                  color: 'inherit', // 继承文本颜色
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // 平滑过渡
                  '&:hover': {
                    transform: 'translateY(-5px)', // 鼠标悬停时上移
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)', // 更明显的阴影
                  },
                }}
              >
                {game.image_url && (
                  // CardMedia 用于显示图片，component="img" 确保语义化
                  <CardMedia
                    component="img"
                    height="200" // 固定图片高度
                    image={game.image_url}
                    alt={game.name}
                    sx={{ objectFit: 'cover' }} // 确保图片覆盖整个区域
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}> {/* flexGrow 确保内容区域填充剩余空间 */}
                  <Typography variant="h6" component="h2" gutterBottom>
                    {game.name}
                  </Typography>
                  {game.my_overall_score !== null && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <StarIcon color="primary" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        综合评分: <Typography component="span" variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
                          {game.my_overall_score.toFixed(1)}
                        </Typography>
                      </Typography>
                    </Box>
                  )}
                  {game.tags && game.tags.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      {game.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          color="secondary"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {game.review_text ? game.review_text.substring(0, 120) + '...' : '暂无评价'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 分页控制 */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            size="large"
          />
        </Box>
      )}
      {/* 可以选择在这里显示总数信息 */}
      {totalPages > 1 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          共 {totalGames} 条游戏
        </Typography>
      )}
    </Container>
  );
};

export default HomePage;