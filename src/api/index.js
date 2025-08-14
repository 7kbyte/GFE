// src/services/api.js

// 注意：根据你 Flask 后端蓝图的 url_prefix 设置，API_BASE_URL 应该指向 Flask 应用的根地址。
// 如果你的 Flask 蓝图是 `url_prefix='/games'` 和 `url_prefix='/tags'`，那么这里就是 `http://127.0.0.1:5000`。
// 如果你希望有 `/api` 前缀（例如 /api/games），你需要修改 Flask 的 app.py 来注册蓝图时添加该前缀。
const API_BASE_URL = 'http://127.0.0.1:5000';

// 辅助函数：处理 API 响应，检查是否成功并解析 JSON
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorText = response.statusText; // 默认错误信息
    try {
      // 尝试解析后端返回的 JSON 错误信息
      const errorData = await response.json();
      errorText = errorData.error || errorData.message || errorText;
    } catch (e) {
      // 如果响应不是 JSON 格式，则使用默认错误信息
      console.error("Error parsing API response:", e);
    }
    throw new Error(errorText);
  }
  // 对于 DELETE 请求，响应体可能为空，但 Flask 仍会返回 JSON 消息
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  // 如果没有 JSON 内容，返回一个空对象
  return {};
};

// --- 游戏相关的 API 接口 ---

/**
 * 获取游戏列表
 * @param {object} params - 查询参数对象
 * @param {string} [params.search] - 搜索关键词
 * @param {string} [params.sort_by] - 排序字段 (例如: 'name', 'art_rating', 'created_at')
 * @param {'asc'|'desc'} [params.order] - 排序顺序 ('asc' 或 'desc')
 * @param {number} [params.page] - 页码 (默认为 1)
 * @param {number} [params.per_page] - 每页数量 (默认为 10)
 * @returns {Promise<object>} 包含游戏列表、总数、分页信息的对象
 */
export const fetchGames = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/games${query ? `?${query}` : ''}`;
  console.log(`Fetching games from: ${url}`);
  const response = await fetch(url);
  return handleResponse(response);
};

/**
 * 获取单个游戏详情
 * @param {number} gameId - 游戏的唯一 ID
 * @returns {Promise<object>} 游戏详情对象
 */
export const fetchGameById = async (gameId) => {
  const url = `${API_BASE_URL}/games/${gameId}`;
  console.log(`Fetching game by ID: ${url}`);
  const response = await fetch(url);
  return handleResponse(response);
};

/**
 * 创建新游戏
 * @param {object} gameData - 包含游戏所有字段的数据对象
 *   例如: {
 *     name: "游戏名称",
 *     image_url: "http://...",
 *     art_rating: 8.5,
 *     music_rating: 9.0,
 *     story_rating: 7.5,
 *     playability_rating: 9.0,
 *     innovation_rating: 8.0,
 *     performance_rating: 7.0,
 *     review_text: "一段评价",
 *     tags: ["RPG", "奇幻"]
 *   }
 * @returns {Promise<object>} 创建成功的消息和新游戏的 ID
 */
export const createGame = async (gameData) => {
  const url = `${API_BASE_URL}/games/`;
  console.log(`Creating game: ${url}`, gameData);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  });
  return handleResponse(response);
};

/**
 * 更新游戏信息
 * @param {number} gameId - 游戏的唯一 ID
 * @param {object} gameData - 要更新的字段及其新值（可以只包含部分字段）
 *   例如: {
 *     review_text: "新的评价",
 *     art_rating: 9.0,
 *     tags: ["RPG", "科幻", "独立"] // 更新标签会覆盖原有标签
 *   }
 * @returns {Promise<object>} 更新成功的消息
 */
export const updateGame = async (gameId, gameData) => {
  const url = `${API_BASE_URL}/games/${gameId}`;
  console.log(`Updating game ${gameId}: ${url}`, gameData);
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  });
  return handleResponse(response);
};

/**
 * 删除游戏
 * @param {number} gameId - 游戏的唯一 ID
 * @returns {Promise<object>} 删除成功的消息
 */
export const deleteGame = async (gameId) => {
  const url = `${API_BASE_URL}/games/${gameId}`;
  console.log(`Deleting game: ${url}`);
  const response = await fetch(url, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

/**
 * 为指定游戏添加一个或多个标签
 * @param {number} gameId - 游戏的唯一 ID
 * @param {string[]} tags - 要添加的标签名称数组 (例如: ["新标签1", "新标签2"])
 * @returns {Promise<object>} 添加成功的消息
 */
export const addGameTags = async (gameId, tags) => {
  const url = `${API_BASE_URL}/games/${gameId}/tags`;
  console.log(`Adding tags to game ${gameId}: ${url}`, tags);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tags }),
  });
  return handleResponse(response);
};

/**
 * 从指定游戏中删除一个特定标签
 * @param {number} gameId - 游戏的唯一 ID
 * @param {number} tagId - 要删除的标签的 ID
 * @returns {Promise<object>} 删除成功的消息
 */
export const deleteGameTag = async (gameId, tagId) => {
  const url = `${API_BASE_URL}/games/${gameId}/tags/${tagId}`;
  console.log(`Deleting tag ${tagId} from game ${gameId}: ${url}`);
  const response = await fetch(url, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// --- 标签相关的 API 接口 ---

/**
 * 获取所有可用标签
 * @returns {Promise<object>} 包含标签列表的对象 (例如: { tags: [{ id: 1, name: "RPG" }] })
 */
export const fetchAllTags = async () => {
  const url = `${API_BASE_URL}/tags`;
  console.log(`Fetching all tags: ${url}`);
  const response = await fetch(url);
  return handleResponse(response);
};

/**
 * 删除一个标签（此操作会从所有关联游戏中移除该标签）
 * @param {number} tagId - 要删除的标签的 ID
 * @returns {Promise<object>} 删除成功的消息
 */
export const deleteTag = async (tagId) => {
  const url = `${API_BASE_URL}/tags/${tagId}`;
  console.log(`Deleting tag: ${url}`);
  const response = await fetch(url, {
    method: 'DELETE',
  });
  return handleResponse(response);
};