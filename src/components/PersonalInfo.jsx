import { useEffect, useState } from 'react';

function PersonalInfo({ data, onChange }) {
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  // Load từ localStorage khi component mount
  useEffect(() => {
    const saved = localStorage.getItem('personalInfo');
    if (saved) {
      const parsed = JSON.parse(saved);
      onChange(parsed);
    }
  }, []);

  // Lưu vào localStorage khi data thay đổi
  useEffect(() => {
    if (data.hoTen || data.maNhanVien || data.donVi || data.phuTrachTrucTiep) {
      localStorage.setItem('personalInfo', JSON.stringify(data));
    }
  }, [data]);

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="section personal-info">
      <h2>Thông tin cá nhân</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Họ và tên:</label>
          <input
            type="text"
            value={data.hoTen}
            onChange={(e) => handleChange('hoTen', e.target.value)}
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div className="form-group">
          <label>Mã nhân viên:</label>
          <input
            type="text"
            value={data.maNhanVien}
            onChange={(e) => handleChange('maNhanVien', e.target.value)}
            placeholder="123456"
          />
        </div>
        <div className="form-group">
          <label>Đơn vị:</label>
          <input
            type="text"
            value={data.donVi}
            onChange={(e) => handleChange('donVi', e.target.value)}
            placeholder="Tổ Web - Phòng PTPM"
          />
        </div>
        <div className="form-group">
          <label>Phụ trách trực tiếp:</label>
          <input
            type="text"
            value={data.phuTrachTrucTiep}
            onChange={(e) => handleChange('phuTrachTrucTiep', e.target.value)}
            placeholder="Phạm Văn B"
          />
        </div>
        <div className="form-group">
          <label>Email phụ trách:</label>
          <input
            type="email"
            value={data.emailPhuTrach}
            onChange={(e) => handleChange('emailPhuTrach', e.target.value)}
            placeholder="phu_trach_truc_tiep@hopnhat.vn"
          />
        </div>
        <div className="form-group">
          <label>Email báo cáo (To mặc định):</label>
          <div className="editable-input-wrapper">
            <input
              type="email"
              value={data.emailMacDinh}
              onChange={(e) => handleChange('emailMacDinh', e.target.value)}
              onDoubleClick={() => setIsEmailEditable(true)}
              onBlur={() => setIsEmailEditable(false)}
              readOnly={!isEmailEditable}
              className={isEmailEditable ? '' : 'readonly-input'}
              placeholder="baocaongay.cntt@hopnhat.vn"
            />
            <button
              type="button"
              className="btn-edit-small"
              onClick={() => setIsEmailEditable(!isEmailEditable)}
              title={isEmailEditable ? 'Khóa' : 'Sửa'}
            >
              {isEmailEditable ? '🔒' : '✏️'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
