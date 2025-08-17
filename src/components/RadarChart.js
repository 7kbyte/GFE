// src/components/RadarChart.js
import React from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { scoreToGrade } from '../utils/scoreUtils';

// 导入 Material-UI 组件和 hooks
import { Box, Typography } from '@mui/material'; // 移除 Card, CardContent
import { useTheme, alpha } from '@mui/material/styles'; // 导入 useTheme 和 alpha 辅助函数

// 注册 Chart.js 所需的组件
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// 移除外部的 Card 包装，使其更灵活地嵌入
const RadarChart = ({ scores }) => {
  const theme = useTheme(); // 使用 useTheme 钩子访问 Material-UI 主题

  const labels = ['美术', '音乐', '剧情', '玩法', '创新', '性能'];

  // 根据主题颜色定义图表颜色
  const chartColor = theme.palette.primary.main;
  const chartBackgroundColor = alpha(chartColor, 0.2);

  const data = {
    labels: labels,
    datasets: [
      {
        label: '评分',
        data: scores,
        backgroundColor: chartBackgroundColor, // 填充颜色，使用主题色加透明度
        borderColor: chartColor,               // 边框颜色，使用主题色
        borderWidth: 2,                        // 稍微增加边框宽度，使其更明显
        pointBackgroundColor: chartColor,      // 点的背景色，使用主题色
        pointBorderColor: theme.palette.background.paper, // 点的边框色，使用卡片背景色，形成对比
        pointHoverBackgroundColor: theme.palette.background.paper,
        pointHoverBorderColor: chartColor
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 允许图表容器控制宽高比
    scales: {
      r: {
        angleLines: {
          display: true,
          color: theme.palette.divider, // 使用主题的分割线颜色，更柔和
        },
        grid: {
          color: theme.palette.divider, // 使用主题的分割线颜色作为网格线
        },
        suggestedMin: 0, // 最小值设为0
        suggestedMax: 10, // 最大值设为10
        ticks: {
          stepSize: 2, // 步长为2，减少刻度线密度，更适合小图表
          color: theme.palette.text.secondary, // 刻度标签颜色使用次要文本色
          // 自定义刻度标签，显示对应的等级
          callback: function(value, index, values) {
            // 只显示非零刻度，或根据需要显示等级
            return value === 0 ? '0' : scoreToGrade(value);
          }
        },
        pointLabels: {
          font: {
            size: 15, // 轴标签字体大小，更小以适应空间
            color: theme.palette.text.primary, // 轴标签颜色使用主要文本色
          },
          color: theme.palette.text.primary, // 兼容性设置，确保颜色被应用
        },
      },
    },
    plugins: {
      legend: {
        display: false, // 不显示图例，因为只有一个数据集
      },
      tooltip: {
        callbacks: {
          // 自定义工具提示内容
          label: function(context) {
            const score = context.raw;
            return `${context.label}: ${score !== null ? score.toFixed(1) : 'N/A'} (${scoreToGrade(score)})`;
          }
        },
        // 自定义工具提示的样式，使其与 Material-UI 主题更协调
        backgroundColor: theme.palette.background.paper, // 工具提示背景色
        titleColor: theme.palette.text.primary,          // 标题文本颜色
        bodyColor: theme.palette.text.secondary,         // 内容文本颜色
        borderColor: theme.palette.divider,              // 边框颜色
        borderWidth: 1,
        cornerRadius: theme.shape.borderRadius,          // 使用主题的圆角
      }
    }
  };

  return (
    // 使用 Box 控制图表的尺寸，确保响应式和填充容器
    // minHeight 和 minWidth 确保图表在小尺寸下依然可见
    <Box sx={{ height: '100%', width: '100%', minHeight: 150, minWidth: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Radar data={data} options={options} />
    </Box>
  );
};

export default RadarChart;