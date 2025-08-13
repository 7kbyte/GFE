export const scoreToGrade = (score) => {
  if (score > 9) return 'S+';
  if (score > 8) return 'S';
  if (score > 7) return 'A+';
  if (score > 6) return 'A';
  if (score > 5) return 'B+';
  if (score > 4) return 'B';
  if (score > 3) return 'C+';
  if (score > 2) return 'C';
  if (score > 1) return 'D+';
  return 'D';
};

/**
 * 计算六边形雷达图的面积。
 * 面积通过将六边形分解为六个从中心点到相邻两个评分点的三角形来计算。
 * 每个三角形的面积公式为：0.5 * side1 * side2 * sin(included_angle)。
 * 对于雷达图，included_angle 始终是 60 度 (π/3 弧度)。
 * @param {number[]} scores - 包含六个评分的数组，顺序与雷达图轴顺序一致。
 * @returns {string} 格式化后的面积值，保留两位小数。
 */
export const calculateHexagonArea = (scores) => {
  if (!scores || scores.length !== 6) {
    console.warn("无效的评分数组，计算六边形面积需要 6 个评分。");
    return "0.00";
  }

  // 假设评分顺序为：美术、音乐、剧情、可玩性、创新性、运行效率
  const [art, music, story, playability, innovation, performance] = scores;

  const sin60 = Math.sin(Math.PI / 3); // sin(60度) = sqrt(3)/2

  // 计算六个三角形的面积之和
  const area = 0.5 * sin60 * (
    art * music +
    music * story +
    story * playability +
    playability * innovation +
    innovation * performance +
    performance * art // 连接最后一个点和第一个点
  );

  return area.toFixed(2); // 返回保留两位小数的字符串
};