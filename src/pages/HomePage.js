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
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Pagination,
  Stack, // 用于水平或垂直排列元素
  Chip, // 用于标签
} from '@mui/material';

// 导入 Material-UI 图标
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // 发行年份图标

// 导入 RadarChart 组件
import RadarChart from '../components/RadarChart'; // 确保路径正确

const HomePage = () => {
  // 修改默认值
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('random'); // 默认随机排序
  const [sortOrder, setSortOrder] = useState('desc'); // 默认降序
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20); // 默认每页20条
  const [totalPages, setTotalPages] = useState(1);
  const [totalGames, setTotalGames] = useState(0);

  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let params = {
        search: searchQuery,
        page: currentPage,
        per_page: perPage,
      };

      // 如果不是随机排序，则发送 sort_by 和 order 参数
      // 如果是随机排序，只发送 sort_by='random'，后端会处理随机性
      if (sortBy !== 'random') {
        params.sort_by = sortBy;
        params.order = sortOrder;
      } else {
        params.sort_by = 'random'; // 明确发送 random 给后端
        // 此时不需要发送 order 参数，因为后端会忽略它
      }

      const data = await fetchGames(params);
      setGames(data.games); // 直接使用后端返回的已排序（或随机）数据
      setTotalPages(data.total_pages);
      setTotalGames(data.total_games);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, sortOrder, currentPage, perPage]); // sortOrder 仍然是依赖项，因为它可能影响非随机排序

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
    { value: 'random', label: '随机排序' }, // 新增随机排序选项
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
          sx={{ width: { xs: '100%', sm: '100%' } }} // 小屏幕宽度100%，大屏幕自动
        />

        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl sx={{ minWidth: 200 }}>
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
              disabled={sortBy === 'random'} // 当选择随机排序时禁用此选项
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
        <Box> {/* 替换 Grid container，现在只是一个简单的 Box */}
          {games.map((game) => {
            // 准备雷达图所需的评分数据，确保顺序和默认值
            const radarScores = [
              game.art_rating || 0,
              game.music_rating || 0,
              game.story_rating || 0,
              game.playability_rating || 0,
              game.innovation_rating || 0,
              game.performance_rating || 0,
            ];

            return (
              <Box key={game.id} sx={{ mb: 3 }}> {/* 每个游戏条目是一个 Box，提供垂直间距 */}
                <Card
                  component={Link}
                  to={`/game/${game.id}`}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' }, // 小屏幕垂直堆叠，大屏幕水平堆叠 (整个卡片内容，包括雷达图)
                    textDecoration: 'none', // 移除 Link 默认下划线
                    color: 'inherit', // 继承文本颜色
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // 平滑过渡
                    '&:hover': {
                      transform: 'translateY(-5px)', // 鼠标悬停时上移
                      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)', // 更明显的阴影
                    },
                    p: { xs: 1.5, sm: 2 }, // 增加卡片内边距，适应不同屏幕
                    borderRadius: 2, // 增加卡片圆角
                  }}
                >
                  {/* 左侧/顶部区域：图片和游戏详情文本内容 */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' }, // 图片和文本内容在小屏幕上垂直，大屏幕上水平
                      flexGrow: 1, // 允许此区域占据剩余空间
                      width: { xs: '100%', sm: 'auto' }, // 小屏幕全宽，大屏幕自动宽度
                      mr: { xs: 0, sm: 3 }, // 大屏幕上与雷达图的右侧间距
                      mb: { xs: 2, sm: 0 }, // 小屏幕上与雷达图的底部间距
                    }}
                  >
                    {game.image_url && (
                      // CardMedia 用于显示图片，component="img" 确保语义化
                      <CardMedia
                        component="img"
                        sx={{
                          width: { xs: '100%', sm: 200 }, // 小屏幕全宽，大屏幕固定宽度
                          height: { xs: 200, sm: 200 }, // 固定图片高度
                          flexShrink: 0, // 防止图片在 flex 布局中缩小
                          objectFit: 'cover', // 确保图片覆盖整个区域
                          borderRadius: 1, // 图片圆角
                          mb: { xs: 2, sm: 0 }, // 小屏幕图片下方有间距，大屏幕无
                          mr: { xs: 0, sm: 3 }, // 大屏幕图片右侧有间距，小屏幕无
                        }}
                        image={game.image_url}
                        alt={game.name}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, p: 0, '&:last-child': { pb: 0 } }}> {/* 移除 CardContent 默认内边距，由父 Card 控制 */}
                      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 1 }}>
                        {game.name}
                      </Typography>

                      {/* 基本信息：发行年份、综合评分 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
                        {game.release_year && (
                          <Chip
                            icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
                            label={`发行年份: ${game.release_year}`}
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ mr: 1, mb: 0.5 }}
                          />
                        )}
                        {game.my_overall_score !== null && (
                          <Chip
                            icon={<StarIcon sx={{ fontSize: 16 }} />}
                            label={`综合评分: ${game.my_overall_score.toFixed(1)}`}
                            size="small"
                            color="primary"
                            variant="filled"
                            sx={{ mr: 1, mb: 0.5 }}
                          />
                        )}
                      </Box>

                      {/* 详细评分 (文本形式) */}
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>各项评分:</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {['art_rating', 'music_rating', 'story_rating', 'playability_rating', 'innovation_rating', 'performance_rating'].map((ratingKey) => {
                            const labelMap = {
                              art_rating: '美术',
                              music_rating: '音乐',
                              story_rating: '故事',
                              playability_rating: '可玩性',
                              innovation_rating: '创新',
                              performance_rating: '性能',
                            };
                            const ratingValue = game[ratingKey];
                            if (ratingValue !== null && ratingValue !== undefined) {
                              return (
                                <Chip
                                  key={ratingKey}
                                  label={`${labelMap[ratingKey]}: ${ratingValue.toFixed(1)}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mb: 0.5 }}
                                />
                              );
                            }
                            return null;
                          })}
                        </Stack>
                      </Box>

                      {/* 标签 */}
                      {game.tags && game.tags.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>标签:</Typography>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap">
                            {game.tags.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                variant="filled" // 使用实心标签
                                color="secondary"
                                sx={{ mb: 0.5 }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* 评价文本预览 */}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {game.review_text ? game.review_text.substring(0, 20) + (game.review_text.length > 20 ? '...' : '') : '暂无评价'}
                      </Typography>

                      {/* 最后更新时间 */}
                      {game.updated_at && (
                        <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                          最后更新: {new Date(game.updated_at).toLocaleDateString()}
                        </Typography>
                      )}
                    </CardContent>
                  </Box>

                  {/* 右侧/底部区域：雷达图 */}
                  <Box
                    sx={{
                      width: { xs: '100%', sm: 300 }, // 小屏幕全宽，大屏幕固定宽度
                      height: { xs: 300, sm: 300 }, // 固定高度
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0, // 防止雷达图缩小
                      ml: { xs: 0, sm: 2 }, // 大屏幕上与左侧内容的左侧间距
                    }}
                  >
                    <RadarChart scores={radarScores} />
                  </Box>
                </Card>
              </Box>
            );
          })}
        </Box>
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