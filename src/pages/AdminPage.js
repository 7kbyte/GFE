// src/pages/AdminPage.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchGames,
  createGame,
  updateGame,
  deleteGame,
  fetchAllTags,
  deleteTag,
} from '../api'; // 确保路径正确

// 导入 Material-UI 组件
import {
  Container,
  Box, // 替代 Grid 的主要布局组件
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Divider,
  Stack, // 用于水平或垂直堆叠，替代 Grid 的部分功能
  CircularProgress,
  Alert,
  Snackbar,
  Switch,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Checkbox,
  FormControlLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';

// 导入 Material-UI 图标
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
// import CloseIcon from '@mui/icons-material/Close'; // CloseIcon 未使用，已移除导入

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success, error, info, warning

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

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

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
      setError("加载游戏失败: " + err.message);
      showSnackbar("加载游戏失败: " + err.message, 'error');
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
      showSnackbar("获取标签失败: " + err.message, 'error');
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
      if (value === null && ratings[key] !== '') { // 允许空字符串，但如果填写了就必须有效
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
      showSnackbar(validationError, 'warning');
      return;
    }
    setError(null); // 清除之前的错误

    // 确保空字符串的评分字段被转换为 null，而不是 0
    const parseRatingOrNull = (value) => {
      const num = parseRating(value);
      return value === '' ? null : num;
    };

    const gameDataToSend = {
      ...gameForm,
      release_year: gameForm.release_year ? parseInt(gameForm.release_year, 10) : null,
      play_time_hours: gameForm.play_time_hours ? parseInt(gameForm.play_time_hours, 10) : null,
      art_rating: parseRatingOrNull(gameForm.art_rating),
      music_rating: parseRatingOrNull(gameForm.music_rating),
      story_rating: parseRatingOrNull(gameForm.story_rating),
      playability_rating: parseRatingOrNull(gameForm.playability_rating),
      innovation_rating: parseRatingOrNull(gameForm.innovation_rating),
      performance_rating: parseRatingOrNull(gameForm.performance_rating),
      my_overall_score: gameForm.my_overall_score ? parseRatingOrNull(gameForm.my_overall_score) : null,
      tags: gameForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag), // 转换为数组
    };

    try {
      if (editingGameId) {
        await updateGame(editingGameId, gameDataToSend);
        showSnackbar('游戏更新成功！', 'success');
      } else {
        await createGame(gameDataToSend);
        showSnackbar('游戏添加成功！', 'success');
      }
      setGameForm(initialGameFormState);
      setEditingGameId(null);
      loadGames(); // 重新加载游戏列表
      loadTags(); // 重新加载标签列表 (因为可能添加了新标签)
    } catch (err) {
      setError("操作失败: " + err.message);
      showSnackbar("操作失败: " + err.message, 'error');
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
      // 如果评分为 null，则显示为空字符串，否则保留一位小数
      art_rating: game.art_rating !== null ? game.art_rating.toFixed(1) : '',
      music_rating: game.music_rating !== null ? game.music_rating.toFixed(1) : '',
      story_rating: game.story_rating !== null ? game.story_rating.toFixed(1) : '',
      playability_rating: game.playability_rating !== null ? game.playability_rating.toFixed(1) : '',
      innovation_rating: game.innovation_rating !== null ? game.innovation_rating.toFixed(1) : '',
      performance_rating: game.performance_rating !== null ? game.performance_rating.toFixed(1) : '',
      review_text: game.review_text || '',
      my_overall_score: game.my_overall_score !== null ? game.my_overall_score.toFixed(1) : '',
      is_completed: game.is_completed,
      play_time_hours: game.play_time_hours || '',
      tags: game.tags ? game.tags.join(', ') : '', // 将标签数组转为字符串
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 滚动到表单顶部
  };

  const handleDeleteGame = async (gameId) => {
    if (window.confirm('确定要删除这个游戏吗？')) { // 可以替换为 MUI Dialog
      try {
        await deleteGame(gameId);
        showSnackbar('游戏删除成功！', 'success');
        loadGames();
      } catch (err) {
        setError("删除失败: " + err.message);
        showSnackbar("删除失败: " + err.message, 'error');
      }
    }
  };

  // --- 标签管理 ---
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      showSnackbar("标签名称不能为空。", 'warning');
      return;
    }
    // 提示用户标签会在游戏添加/修改时自动创建
    showSnackbar("标签会在添加或修改游戏时自动创建。此处仅用于展示现有标签。", 'info');
    setNewTagName('');
    // loadTags(); // 重新加载标签列表 (此处不需要，因为没有实际添加标签的API调用)
  };

  const handleDeleteTag = async (tagId) => {
    if (window.confirm('确定要删除这个标签吗？这会从所有关联游戏中移除它。')) { // 可以替换为 MUI Dialog
      try {
        await deleteTag(tagId);
        showSnackbar('标签删除成功！', 'success');
        loadTags(); // 重新加载标签列表
        loadGames(); // 重新加载游戏列表，以反映标签变化
      } catch (err) {
        setError("删除标签失败: " + err.message);
        showSnackbar("删除标签失败: " + err.message, 'error');
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
    setPerPage(parseInt(e.target.value, 10)); // 确保是数字
    setCurrentPage(1);
  };
  const handlePageChange = (event, page) => { // Pagination组件的onChange会传入event和page
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

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>加载中...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        管理员面板
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 添加/编辑游戏 */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {editingGameId ? '编辑游戏' : '添加新游戏'}
        </Typography>
        {/* 使用 Box 和 Stack 替代 Grid */}
        <Box component="form" onSubmit={handleSubmitGame}>
          {/* 前8个栏目，两个一排 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2, mb: 2 }}>
            <TextField
              label="名称"
              name="name"
              value={gameForm.name}
              onChange={handleGameFormChange}
              required
              fullWidth
              //sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }} // 50% 宽度，减去一半的间距
            />
            <TextField
              label="图片URL"
              name="image_url"
              value={gameForm.image_url}
              onChange={handleGameFormChange}
              fullWidth
              //sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}
            />
            <TextField
              label="发行年份"
              name="release_year"
              type="number"
              value={gameForm.release_year}
              onChange={handleGameFormChange}
              sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}
            />
            <TextField
              label="开发者"
              name="developer"
              value={gameForm.developer}
              onChange={handleGameFormChange}
              sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}
            />
            <TextField
              label="发行商"
              name="publisher"
              value={gameForm.publisher}
              onChange={handleGameFormChange}
              sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}
            />
            <TextField
              label="平台"
              name="platform"
              value={gameForm.platform}
              onChange={handleGameFormChange}
              sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}
            />
            <TextField
              label="游玩时长 (小时)"
              name="play_time_hours"
              type="number"
              value={gameForm.play_time_hours}
              onChange={handleGameFormChange}
              sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}
            />
            <FormControlLabel
              control={
                <Switch // 将 Checkbox 替换为 Switch
                  checked={gameForm.is_completed}
                  onChange={handleGameFormChange}
                  name="is_completed"
                  color="primary" // 可以添加颜色，例如 primary 或 secondary
                />
              }
              label="已通关"
              sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' }, mt: 1 }} // 保持原有布局样式
            />
          </Box>


          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>评分 (0.0 - 10.0)*</Typography>
          {/* 6个评分排成一排 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2, mb: 2 }}>
            {[
              { label: '美术', name: 'art_rating' },
              { label: '音乐', name: 'music_rating' },
              { label: '故事', name: 'story_rating' },
              { label: '可玩性', name: 'playability_rating' },
              { label: '创新性', name: 'innovation_rating' },
              { label: '性能', name: 'performance_rating' },
            ].map((ratingField) => (
              <TextField
                key={ratingField.name}
                label={ratingField.label}
                name={ratingField.name}
                type="number"
                step="0.1"
                value={gameForm[ratingField.name]}
                onChange={handleGameFormChange}
                required
                inputProps={{ min: 0, max: 10 }}
                // 响应式宽度：xs=100%, sm=50%, md=33.33%, lg=16.66% (6个一排)
                sx={{
                  width: {
                    xs: '100%',
                    sm: 'calc(50% - 8px)', // 2 per row
                    md: 'calc(33.33% - 10.67px)', // 3 per row
                    lg: 'calc(16.66% - 13.33px)', // 6 per row
                  },
                }}
              />
            ))}
          </Box>

          {/* <TextField
            label="我的综合评分 (0.0 - 10.0)"
            name="my_overall_score"
            type="number"
            step="0.1"
            value={gameForm.my_overall_score}
            onChange={handleGameFormChange}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          /> */}
          <TextField
            label="评价"
            name="review_text"
            value={gameForm.review_text}
            onChange={handleGameFormChange}
            multiline
            rows={8}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="标签 (逗号分隔)"
            name="tags"
            value={gameForm.tags}
            onChange={handleGameFormChange}
            placeholder="例如: RPG, 动作, 独立游戏"
            fullWidth
            sx={{ mb: 3 }}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={editingGameId ? <EditIcon /> : <AddIcon />}
            >
              {editingGameId ? '更新游戏' : '添加游戏'}
            </Button>
            {editingGameId && (
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={() => { setEditingGameId(null); setGameForm(initialGameFormState); }}
              >
                取消编辑
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* 管理游戏列表 - 此部分布局保持不变，因为它已经未使用 Grid */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          管理游戏列表
        </Typography>
        {/* 搜索和筛选控件 */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'flex-end' }}
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <TextField
            label="搜索游戏..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <SearchIcon color="action" sx={{ mr: 1 }} />
              ),
            }}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          />

          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="adminSortBy-label">排序依据</InputLabel>
              <Select
                labelId="adminSortBy-label"
                id="adminSortBy"
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
              <InputLabel id="adminSortOrder-label">顺序</InputLabel>
              <Select
                labelId="adminSortOrder-label"
                id="adminSortOrder"
                value={sortOrder}
                label="顺序"
                onChange={handleOrderChange}
              >
                <MenuItem value="desc">降序</MenuItem>
                <MenuItem value="asc">升序</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 80 }}>
              <InputLabel id="adminPerPage-label">每页</InputLabel>
              <Select
                labelId="adminPerPage-label"
                id="adminPerPage"
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

        {games.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
            没有找到游戏。
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
            <Table sx={{ minWidth: 650 }} aria-label="游戏管理表格">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>名称</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>发行年份</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>综合评分</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>标签</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {games.map((game) => (
                  <TableRow
                    key={game.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {game.id}
                    </TableCell>
                    <TableCell>{game.name}</TableCell>
                    <TableCell>{game.release_year || 'N/A'}</TableCell>
                    <TableCell>{game.my_overall_score !== null ? game.my_overall_score.toFixed(1) : 'N/A'}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                        {game.tags && game.tags.length > 0 ? (
                          game.tags.map((tag, idx) => (
                            <Chip key={idx} label={tag} size="small" variant="outlined" color="primary" />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">无</Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditGame(game)}
                        sx={{ mr: 1 }}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteGame(game.id)}
                      >
                        删除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
        {totalPages > 1 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            共 {totalGames} 条游戏
          </Typography>
        )}
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* 管理标签 - 此部分布局保持不变，因为它已经未使用 Grid */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          管理标签
        </Typography>
        <Box component="form" onSubmit={handleAddTag} sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="新标签名称"
            variant="outlined"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained" startIcon={<AddIcon />}>
            添加标签 (通过游戏添加)
          </Button>
        </Box>

        {tags.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
            没有可用的标签。
          </Typography>
        ) : (
          <List sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            {tags.map((tag) => (
              <ListItem
                key={tag.id}
                divider // 添加分割线
              >
                <ListItemText primary={tag.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTag(tag.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPage;