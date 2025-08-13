const API_BASE_URL = 'http://127.0.0.1:5000/api'; // 后端 Flask 服务器地址

export const fetchGames = async () => {
  const response = await fetch(`${API_BASE_URL}/games`);
  if (!response.ok) {
    throw new Error('获取游戏列表失败');
  }
  return response.json();
};

export const fetchGameById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/games/${id}`);
  if (!response.ok) {
    throw new Error('获取游戏详情失败');
  }
  return response.json();
};

export const createGame = async (gameData) => {
  const response = await fetch(`${API_BASE_URL}/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '创建游戏失败');
  }
  return response.json();
};

export const updateGame = async (id, gameData) => {
  const response = await fetch(`${API_BASE_URL}/games/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '更新游戏失败');
  }
  return response.json();
};

export const deleteGame = async (id) => {
  const response = await fetch(`${API_BASE_URL}/games/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '删除游戏失败');
  }
  return response.json();
};