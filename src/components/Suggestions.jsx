function Suggestions({ value, onChange }) {
  return (
    <div className="section suggestions">
      <h2>III. Ý kiến đề xuất</h2>
      <div className="form-group">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Các ý kiến đề xuất nếu có..."
          rows={3}
        />
        <small className="hint">Mặc định: "Không có" nếu để trống</small>
      </div>
    </div>
  );
}

export default Suggestions;
