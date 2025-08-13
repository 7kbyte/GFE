import React from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { scoreToGrade } from '../utils/scoreUtils';

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
  const labels = ['美术 Art', '音乐 Music', '剧情 Story', '可玩性 Playability', '创新性 Innovation', '运行效率 Performance'];

  const data = {
    labels: labels,
    datasets: [
      {
        label: '评分',
        data: scores,
        backgroundColor: 'rgba(0, 123, 255, 0.2)', // 填充颜色
        borderColor: 'rgba(0, 123, 255, 1)',     // 边框颜色
        borderWidth: 1,
        pointBackgroundColor: 'rgba(0, 123, 255, 1)', // 点的背景色
        pointBorderColor: '#fff',                  // 点的边框色
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0, 123, 255, 1)'
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
        },
        suggestedMin: 0, // 最小值设为0
        suggestedMax: 10, // 最大值设为10
        ticks: {
          stepSize: 1, // 步长为1
          // 自定义刻度标签，显示对应的等级
          callback: function(value, index, values) {
            return scoreToGrade(value);
          }
        },
        pointLabels: {
          font: {
            size: 14, // 轴标签字体大小
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // 不显示图例
      },
      tooltip: {
        callbacks: {
          // 自定义工具提示内容
          label: function(context) {
            const score = context.raw;
            return `${context.label}: ${score} (${scoreToGrade(score)})`;
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;