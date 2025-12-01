import { useState } from 'react';
import PersonalInfo from './components/PersonalInfo';
import DateSelector from './components/DateSelector';
import TaskList from './components/TaskList';
import Suggestions from './components/Suggestions';
import ReportPreview from './components/ReportPreview';
import './App.css';

function App() {
  // Lấy ngày hôm nay và ngày mai
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  // State cho thông tin cá nhân
  const [personalInfo, setPersonalInfo] = useState({
    hoTen: '',
    maNhanVien: '',
    donVi: '',
    phuTrachTrucTiep: '',
    emailPhuTrach: '',
    emailMacDinh: 'baocaongay.cntt@hopnhat.vn, quynn@hncjsc.vn'
  });

  // State cho ngày (mặc định hôm nay và ngày mai)
  const [reportDate, setReportDate] = useState(formatDateForInput(today));
  const [planDate, setPlanDate] = useState(formatDateForInput(tomorrow));

  // State cho công việc đã làm
  const [tasksDone, setTasksDone] = useState([
    {
      id: Date.now(),
      maJira: '',
      tenTask: '',
      trangThai: '',
      tienDo: '',
      lyDo: '',
      ungDungAI: '',
      yeuCauHoTro: ''
    }
  ]);

  // State cho công việc dự kiến
  const [tasksPlanned, setTasksPlanned] = useState([
    {
      id: Date.now() + 1,
      maJira: '',
      tenTask: '',
      trangThai: '',
      tienDo: '',
      lyDo: '',
      ungDungAI: '',
      yeuCauHoTro: ''
    }
  ]);

  // State cho ý kiến đề xuất
  const [suggestions, setSuggestions] = useState('');

  // State để hiển thị/ẩn preview
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Công cụ tạo báo cáo công việc hàng ngày</h1>
        <p className="subtitle">Phòng CNTT - Hợp Nhất</p>
      </header>

      <main className="app-main">
        <div className="form-container">
          <PersonalInfo data={personalInfo} onChange={setPersonalInfo} />

          <DateSelector
            reportDate={reportDate}
            planDate={planDate}
            onReportDateChange={setReportDate}
            onPlanDateChange={setPlanDate}
          />

          <TaskList
            title="I. Kết quả công việc đã làm"
            tasks={tasksDone}
            onChange={setTasksDone}
            showAI={true}
            aiLabel="Ứng dụng AI (bắt buộc với nhóm lập trình)"
            isPlanned={false}
          />

          <TaskList
            title="II. Dự kiến công việc"
            tasks={tasksPlanned}
            onChange={setTasksPlanned}
            showAI={true}
            aiLabel="Dự kiến ứng dụng AI"
            isPlanned={true}
          />

          <Suggestions value={suggestions} onChange={setSuggestions} />

          <div className="preview-toggle">
            <button
              className="btn-preview"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? '🔼 Ẩn xem trước' : '🔽 Xem trước báo cáo'}
            </button>
          </div>

          {showPreview && (
            <ReportPreview
              personalInfo={personalInfo}
              tasksDone={tasksDone.filter(t => t.tenTask)}
              tasksPlanned={tasksPlanned.filter(t => t.tenTask)}
              suggestions={suggestions}
              reportDate={reportDate}
              planDate={planDate}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Tool hỗ trợ tạo báo cáo nhanh - Phòng CNTT</p>
      </footer>
    </div>
  );
}

export default App;
