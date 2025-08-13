import React, { useState, useEffect } from 'react';

const GameForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    art: 5,
    music: 5,
    story: 5,
    playability: 5,
    innovation: 5,
    performance: 5,
    remarks: '',
    ...initialData, // 如果是编辑模式，则使用传入的初始数据填充表单
  });

  // 当 initialData 改变时（例如从“新建”切换到“编辑”），重置表单数据
  useEffect(() => {
    setFormData({
      name: '',
      art: 5,
      music: 5,
      story: 5,
      playability: 5,
      innovation: 5,
      performance: 5,
      remarks: '',
      ...initialData,
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // 游戏名和备注是字符串，评分是数字
      [name]: name === 'name' || name === 'remarks' ? value : parseInt(value, 10),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // 提交表单数据给父组件处理
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialData.id ? '编辑游戏评分' : '新建游戏评分'}</h2>
      <div>
        <label htmlFor="name">游戏名:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      {/* 循环渲染六个评分项 */}
      {['art', 'music', 'story', 'playability', 'innovation', 'performance'].map((field) => (
        <div key={field}>
          <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
          <input
            type="number"
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            min="1"
            max="10"
            required
          />
        </div>
      ))}
      <div>
        <label htmlFor="remarks">备注 (不超过200字):</label>
        <textarea
          id="remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          maxLength="200"
          rows="4"
        ></textarea>
      </div>
      <button type="submit">{initialData.id ? '更新' : '创建'}</button>
      {onCancel && <button type="button" onClick={onCancel}>取消</button>}
    </form>
  );
};

export default GameForm;