// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // 导入 Link 用于路由导航

// 导入 Material-UI 组件
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// 导入 Material-UI 图标
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

import Button from '@mui/material/Button';

const Header = () => {
  return (
    // AppBar 是 Material-UI 的应用栏组件，通常用于页首
    // position="static" 使其在正常文档流中，不会固定在顶部
    // color="primary" 使用主题中定义的主色（默认是蓝色），让页首有统一的品牌色
    <AppBar position="static" color="primary">
      {/* Toolbar 是 AppBar 内部的容器，用于水平排列内容 */}
      <Toolbar>
        {/* Box 组件是一个通用的容器，支持 sx prop 用于快速样式和布局
            flexGrow: 1 使这个 Box 占据所有可用空间，将后面的元素（如果添加的话）推到右侧 */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Link 来自 react-router-dom，用于导航到首页 */}
          {/* sx prop 用于样式定制：
              textDecoration: 'none' 移除 Link 默认的下划线
              color: 'inherit' 继承父元素（AppBar）的文本颜色，通常是白色
              display: 'flex' 和 alignItems: 'center' 使图标和文字水平居中对齐 */}
          <Link
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                opacity: 0.8, // 鼠标悬停时，增加一点透明度，提供视觉反馈
              },
            }}
          >
            {/* VideogameAssetIcon 是 Material-UI 的游戏图标 */}
            {/* sx={{ mr: 1 }} 添加右侧外边距，使图标与文字之间有间距 */}
            <VideogameAssetIcon sx={{ mr: 1 }} />

            {/* Typography 用于显示文本，并应用 Material Design 的排版样式
                variant="h6" 应用 h6 标题样式，适合页首标题
                noWrap 防止文本换行
                component="span" 渲染为 span 标签，更适合作为 Link 的子元素 */}
            <Typography
              variant="h6"
              noWrap
              component="span"
            >
              7168B的小屋
            </Typography>
          </Link>
        </Box>
        <Button color="inherit" component={Link} to="/admin">
          管理员面板
        </Button>
        {/* 未来你可以在这里添加其他导航链接或用户菜单，例如：
        <Button color="inherit" component={Link} to="/games">
          游戏
        </Button>
        <Button color="inherit" component={Link} to="/reviews">
          评论
        </Button>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;