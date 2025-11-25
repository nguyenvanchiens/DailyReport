function DateSelector({ reportDate, planDate, onReportDateChange, onPlanDateChange }) {
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  const handleReportDateChange = (value) => {
    // Không cho phép chọn ngày quá khứ
    if (value < today) {
      return;
    }
    onReportDateChange(value);
    // Nếu ngày kế hoạch nhỏ hơn ngày báo cáo mới, cập nhật ngày kế hoạch
    if (planDate < value) {
      onPlanDateChange(value);
    }
  };

  const handlePlanDateChange = (value) => {
    // Không cho phép chọn ngày nhỏ hơn ngày báo cáo
    if (value < reportDate) {
      return;
    }
    onPlanDateChange(value);
  };

  return (
    <div className="section date-selector">
      <h2>Ngày báo cáo</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Ngày báo cáo:</label>
          <input
            type="date"
            value={reportDate}
            min={today}
            onChange={(e) => handleReportDateChange(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Ngày kế hoạch:</label>
          <input
            type="date"
            value={planDate}
            min={reportDate}
            onChange={(e) => handlePlanDateChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default DateSelector;
