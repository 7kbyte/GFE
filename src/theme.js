// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // --- 1. 调色板 (Palette) ---
  // 定义应用程序的颜色。Material-UI 会根据这些颜色自动生成深色/浅色变体。
  palette: {
    primary: {
      main: '#1976d2', // 核心品牌色，通常用于按钮、应用栏等主要元素 (深蓝色)
      light: '#42a5f5', // 主色的浅色变体
      dark: '#115293',  // 主色的深色变体
      contrastText: '#ffffff', // 在主色背景上使用的文本颜色 (白色)
    },
    secondary: {
      main: '#dc004e', // 辅助色，用于强调或次要元素 (鲜艳的粉色)
      light: '#ff3378',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f', // 错误状态色
    },
    warning: {
      main: '#ed6c02', // 警告状态色
    },
    info: {
      main: '#0288d1', // 信息状态色
    },
    success: {
      main: '#2e7d32', // 成功状态色
    },
    background: {
      default: '#f4f6f8', // 默认页面背景色 (浅灰色，比纯白柔和)
      paper: '#ffffff',   // 卡片、模态框等“纸张”元素的背景色 (白色)
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)', // 主要文本颜色 (深灰色，更柔和)
      secondary: 'rgba(0, 0, 0, 0.6)', // 次要文本颜色
      disabled: 'rgba(0, 0, 0, 0.38)', // 禁用文本颜色
    },
  },

  // --- 2. 排版 (Typography) ---
  // 定义字体、字重、字号等。
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif', // 优先使用 Roboto，其次是系统字体
    h1: {
      fontSize: '3.5rem', // 标题1
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2.5rem', // 标题2
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '2rem', // 标题3
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.6rem', // 标题4
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.3rem', // 标题5
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.1rem', // 标题6 (适合页首Logo)
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem', // 主体文本
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem', // 次要文本
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none', // 按钮文本默认不转换为大写，更现代
      fontWeight: 500,
    },
  },

  // --- 3. 间距 (Spacing) ---
  // 定义全局的间距单位。默认是 8px 的倍数。
  // 可以通过 theme.spacing(1) 得到 8px，theme.spacing(2) 得到 16px 等。
  spacing: 8, // 默认值，但可以明确定义或修改

  // --- 4. 组件默认样式 (Components) ---
  // 在这里可以覆盖特定 Material-UI 组件的默认样式或 props。
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          // 自定义 AppBar 的根样式
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.08), 0px 4px 5px 0px rgba(0,0,0,0.04), 0px 1px 10px 0px rgba(0,0,0,0.02)', // 更柔和的阴影
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true, // 默认禁用按钮的阴影，使按钮更扁平化
      },
      styleOverrides: {
        root: {
          borderRadius: 8, // 稍微增加按钮的圆角
        },
        containedPrimary: {
          // 针对 primary contained 按钮的样式
          '&:hover': {
            backgroundColor: '#1565c0', // 鼠标悬停时颜色稍微变深
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // 增加卡片的圆角
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)', // 更轻微的卡片阴影
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8, // 增加 Paper 组件的圆角
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover', // 链接默认只在悬停时显示下划线
      },
      styleOverrides: {
        root: {
          color: '#1976d2', // 链接颜色使用主色
        },
      },
    },
  },
});

export default theme;