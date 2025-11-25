function TaskList({ title, tasks, onChange, showAI = true, aiLabel = "Ứng dụng AI", isPlanned = false }) {
  const addTask = () => {
    onChange([
      ...tasks,
      {
        id: Date.now(),
        tenTask: '',
        trangThai: '',
        tienDo: '',
        lyDo: '',
        maJira: '',
        ungDungAI: '',
        yeuCauHoTro: ''
      }
    ]);
  };

  // Check if status requires reason (not Done or Test)
  const needsReason = (trangThai) => {
    return trangThai && trangThai !== 'done' && trangThai !== 'test';
  };

  const updateTask = (id, field, value) => {
    onChange(
      tasks.map((task) =>
        task.id === id ? { ...task, [field]: value } : task
      )
    );
  };

  const removeTask = (id) => {
    onChange(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="section task-list">
      <h2>{title}</h2>

      {tasks.map((task, index) => (
        <div key={task.id} className="task-item">
          <div className="task-header">
            <span className="task-number">#{index + 1}</span>
            <button
              className="btn-remove"
              onClick={() => removeTask(task.id)}
              title="Xóa công việc"
            >
              ×
            </button>
          </div>

          <div className="form-group">
            <label>Tên task:</label>
            <input
              type="text"
              value={task.tenTask}
              onChange={(e) => updateTask(task.id, 'tenTask', e.target.value)}
              placeholder="SMT-309 [Supermarket - AU] - Hỗ trợ xóa những mã có ngày 1900..."
            />
          </div>

          <div className="form-row three-cols">
            <div className="form-group">
              <label>Trạng thái:</label>
              <select
                value={task.trangThai}
                onChange={(e) => updateTask(task.id, 'trangThai', e.target.value)}
              >
                <option value="">-- Chọn --</option>
                <option value="done">Done</option>
                <option value="test">Test</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {needsReason(task.trangThai) && (
              <div className="form-group">
                <label>Tiến độ (%):</label>
                <input
                  type="text"
                  value={task.tienDo}
                  onChange={(e) => updateTask(task.id, 'tienDo', e.target.value)}
                  placeholder="70%"
                />
              </div>
            )}

            <div className="form-group">
              <label>Link Jira:</label>
              <input
                type="text"
                value={task.maJira}
                onChange={(e) => updateTask(task.id, 'maJira', e.target.value)}
                placeholder="https://issue.fastlink.vn/browse/SMT-309"
              />
            </div>
          </div>

          {needsReason(task.trangThai) && (
            <div className="form-group">
              <label>Lý do chưa hoàn thành:</label>
              <input
                type="text"
                value={task.lyDo}
                onChange={(e) => updateTask(task.id, 'lyDo', e.target.value)}
                placeholder="cần check tính năng cùng flink..."
              />
            </div>
          )}

          {showAI && (
            <div className="form-group">
              <label>{aiLabel}:</label>
              <input
                type="text"
                value={task.ungDungAI}
                onChange={(e) => updateTask(task.id, 'ungDungAI', e.target.value)}
                placeholder="Sử dụng Claude để viết script xử lý data..."
              />
            </div>
          )}

          {isPlanned && (
            <div className="form-group">
              <label>Yêu cầu hỗ trợ (nếu có):</label>
              <input
                type="text"
                value={task.yeuCauHoTro}
                onChange={(e) => updateTask(task.id, 'yeuCauHoTro', e.target.value)}
                placeholder="Cần anh/chị X hỗ trợ..."
              />
            </div>
          )}
        </div>
      ))}

      <button className="btn-add" onClick={addTask}>
        + Thêm công việc
      </button>
    </div>
  );
}

export default TaskList;
