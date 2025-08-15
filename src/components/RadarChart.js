// src/components/RadarChart.js
import React from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { scoreToGrade } from '../utils/scoreUtils';

// 导入 Material-UI 组件和 hooks
import { Card, CardContent, Box, Typography } from '@mui/material';
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

const RadarChart = ({ scores }) => {
  const theme = useTheme(); // 使用 useTheme 钩子访问 Material-UI 主题

  const labels = ['美术 Art', '音乐 Music', '剧情 Story', '可玩性 Playability', '创新性 Innovation', '运行效率 Performance'];

  // 根据主题颜色定义图表颜色
  // 可以选择 theme.palette.primary.main 或 theme.palette.secondary.main
  const chartColor = theme.palette.primary.main;
  // 使用 alpha 辅助函数创建带有透明度的颜色，用于填充
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
          stepSize: 1, // 步长为1
          color: theme.palette.text.secondary, // 刻度标签颜色使用次要文本色
          // 自定义刻度标签，显示对应的等级
          callback: function(value, index, values) {
            return scoreToGrade(value);
          }
        },
        pointLabels: {
          font: {
            size: 14, // 轴标签字体大小
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
            return `${context.label}: ${score} (${scoreToGrade(score)})`;
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
    // 使用 Material-UI Card 组件包裹雷达图，提供统一的视觉风格
    <Card sx={{ maxWidth: 600, mx: 'auto', my: 4 }}> {/* maxWidth 限制卡片最大宽度，mx: 'auto' 水平居中，my 垂直外边距 */}
      <CardContent>
        {/* 使用 Typography 组件作为图表标题 */}
        <Typography variant="h6" component="h3" gutterBottom sx={{ textAlign: 'center' }}>
          游戏维度评分雷达图
        </Typography>
        {/* Box 用于控制图表的尺寸，确保响应式和填充容器 */}
        <Box sx={{ height: 400, width: '100%' }}> {/* 固定高度，宽度填充父容器 */}
          <Radar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default RadarChart;