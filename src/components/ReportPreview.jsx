import { useState } from 'react';

function ReportPreview({ personalInfo, tasksDone, tasksPlanned, suggestions, reportDate, planDate }) {
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
  };

  const generateSubject = () => {
    return `[IT] Báo cáo công việc của ${personalInfo.hoTen} ngày ${formatDate(reportDate)}, kế hoạch ngày ${formatDate(planDate)}`;
  };

  const generateEmailTo = () => {
    const emails = [];
    if (personalInfo.emailMacDinh) {
      emails.push(personalInfo.emailMacDinh);
    }
    if (personalInfo.emailPhuTrach) {
      emails.push(personalInfo.emailPhuTrach);
    }
    return emails.join(', ');
  };

  const getTrangThaiText = (trangThai) => {
    const map = {
      'done': 'Done',
      'test': 'Test',
      'processing': 'Processing',
      'pending': 'Pending',
      'reception': 'Reception',
      'support': 'Support'
    };
    return map[trangThai] || trangThai;
  };

  // Check if status needs progress/reason (not Done or Test)
  const needsReason = (trangThai) => {
    return trangThai && trangThai !== 'done' && trangThai !== 'test';
  };

  // Format progress with % if needed
  const formatProgress = (tienDo) => {
    if (!tienDo) return '';
    // If already has %, return as is
    if (tienDo.includes('%')) return tienDo;
    // Otherwise add %
    return `${tienDo}%`;
  };

  // Format plain text: - Tên task - tiến độ (lý do nếu chưa hoàn thành) (link)
  const generateTaskText = (task) => {
    let text = '- ';
    text += task.tenTask;

    // Add progress info based on status
    if (task.trangThai) {
      if (needsReason(task.trangThai)) {
        // Processing/Pending: show percentage and reason
        let progress = task.tienDo ? formatProgress(task.tienDo) : getTrangThaiText(task.trangThai);
        if (task.lyDo) {
          text += ` - ${progress} (${task.lyDo})`;
        } else {
          text += ` - ${progress}`;
        }
      } else {
        // Done/Test: just show status
        text += ` - ${getTrangThaiText(task.trangThai)}`;
      }
    }

    if (task.maJira) {
      text += ` (${task.maJira})`;
    }

    // Add AI usage for this task
    if (task.ungDungAI) {
      text += `\n  + Ứng dụng AI: ${task.ungDungAI}`;
    }

    return text;
  };

  // Format HTML: - <a href="link">Tên task</a> - tiến độ (lý do nếu chưa hoàn thành)
  const generateTaskHtml = (task) => {
    let html = '- ';

    // Wrap task name with link if Jira URL exists
    if (task.maJira) {
      html += `<a href="${task.maJira}">${task.tenTask}</a>`;
    } else {
      html += task.tenTask;
    }

    // Add progress info based on status
    if (task.trangThai) {
      if (needsReason(task.trangThai)) {
        // Processing/Pending: show percentage and reason
        let progress = task.tienDo ? formatProgress(task.tienDo) : getTrangThaiText(task.trangThai);
        if (task.lyDo) {
          html += ` - ${progress} (${task.lyDo})`;
        } else {
          html += ` - ${progress}`;
        }
      } else {
        // Done/Test: just show status
        html += ` - ${getTrangThaiText(task.trangThai)}`;
      }
    }

    // Add AI usage for this task
    if (task.ungDungAI) {
      html += `<br>&nbsp;&nbsp;+ Ứng dụng AI: ${task.ungDungAI}`;
    }

    return html;
  };

  const generateAISection = (tasks, label) => {
    const tasksWithAI = tasks.filter(t => t.ungDungAI);
    if (tasksWithAI.length === 0) return '';
    let text = `- ${label}: `;
    text += tasksWithAI.map(t => t.ungDungAI).join('; ');
    return text;
  };

  const generateSupportSection = (tasks) => {
    const tasksWithSupport = tasks.filter(t => t.yeuCauHoTro);
    if (tasksWithSupport.length === 0) return '';
    let text = '- Yêu cầu hỗ trợ: ';
    text += tasksWithSupport.map(t => t.yeuCauHoTro).join('; ');
    return text;
  };

  // Plain text version (for preview)
  const generateReportContent = () => {
    const subject = generateSubject();

    let content = `Kính gửi Ban lãnh đạo,

Tôi là: ${personalInfo.hoTen}, mã nhân viên: ${personalInfo.maNhanVien}
Đơn vị: ${personalInfo.donVi}
Phụ trách trực tiếp: ${personalInfo.phuTrachTrucTiep}

I. Kết quả công việc ngày ${formatDate(reportDate)}
`;

    if (tasksDone.length > 0) {
      tasksDone.forEach((task, index) => {
        content += generateTaskText(task);
        // Thêm dòng trống giữa các task (trừ task cuối)
        if (index < tasksDone.length - 1) {
          content += '\n\n';
        } else {
          content += '\n';
        }
      });
    } else {
      content += '- (Chưa có công việc)\n';
    }

    content += `
II. Dự kiến công việc ngày ${formatDate(planDate)}
`;

    if (tasksPlanned.length > 0) {
      tasksPlanned.forEach((task, index) => {
        content += generateTaskText(task);
        // Thêm dòng trống giữa các task (trừ task cuối)
        if (index < tasksPlanned.length - 1) {
          content += '\n\n';
        } else {
          content += '\n';
        }
      });
      const supportSection = generateSupportSection(tasksPlanned);
      if (supportSection) {
        content += supportSection + '\n';
      }
    } else {
      content += '- (Chưa có công việc)\n';
    }

    content += `
III. Ý kiến đề xuất
- ${suggestions || 'Không có'}

Trân trọng`;

    return { subject, content };
  };

  // HTML version (for copy to email)
  const generateReportHtml = () => {
    let html = `<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;">
<p>Kính gửi Ban lãnh đạo,</p>

<p>Tôi là: ${personalInfo.hoTen}, mã nhân viên: ${personalInfo.maNhanVien}<br>
Đơn vị: ${personalInfo.donVi}<br>
Phụ trách trực tiếp: ${personalInfo.phuTrachTrucTiep}</p>

<p><strong>I. Kết quả công việc ngày ${formatDate(reportDate)}</strong></p>
`;

    if (tasksDone.length > 0) {
      tasksDone.forEach((task, index) => {
        html += generateTaskHtml(task);
        // Thêm khoảng cách giữa các task
        if (index < tasksDone.length - 1) {
          html += '<br><br>\n';
        } else {
          html += '<br>\n';
        }
      });
    } else {
      html += '- (Chưa có công việc)<br>\n';
    }

    html += `
<p><strong>II. Dự kiến công việc ngày ${formatDate(planDate)}</strong></p>
`;

    if (tasksPlanned.length > 0) {
      tasksPlanned.forEach((task, index) => {
        html += generateTaskHtml(task);
        // Thêm khoảng cách giữa các task
        if (index < tasksPlanned.length - 1) {
          html += '<br><br>\n';
        } else {
          html += '<br>\n';
        }
      });
      const supportSection = generateSupportSection(tasksPlanned);
      if (supportSection) {
        html += supportSection + '<br>\n';
      }
    } else {
      html += '- (Chưa có công việc)<br>\n';
    }

    html += `
<p><strong>III. Ý kiến đề xuất</strong></p>
<p>- ${suggestions || 'Không có'}</p>

<p>Trân trọng</p>
</div>`;

    return html;
  };

  const { subject, content } = generateReportContent();

  const copyToClipboard = async (text, message = 'Đã copy!') => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showToast(message);
        return;
      }
      // Fallback for non-secure contexts (HTTP)
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      showToast(message);
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('Copy thất bại!');
    }
  };

  // Copy HTML to clipboard (for paste into email with formatting)
  const copyHtmlToClipboard = async () => {
    const html = generateReportHtml();
    const plainText = content;

    try {
      // Try modern clipboard API first (only works in secure context)
      if (navigator.clipboard && window.isSecureContext && typeof ClipboardItem !== 'undefined') {
        const blob = new Blob([html], { type: 'text/html' });
        const plainBlob = new Blob([plainText], { type: 'text/plain' });

        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': blob,
            'text/plain': plainBlob
          })
        ]);
        showToast('Đã copy HTML!');
        return;
      }

      // Fallback for HTTP: use contenteditable div to copy rich HTML
      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.position = 'fixed';
      container.style.left = '-999999px';
      container.style.top = '-999999px';
      container.style.opacity = '0';
      document.body.appendChild(container);

      // Select the content
      const range = document.createRange();
      range.selectNodeContents(container);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      // Copy
      document.execCommand('copy');

      // Cleanup
      selection.removeAllRanges();
      container.remove();
      showToast('Đã copy HTML!');
    } catch (err) {
      console.error('Failed to copy HTML:', err);
      await copyToClipboard(plainText, 'Đã copy nội dung!');
    }
  };

  const copyAll = async () => {
    const fullText = `Subject: ${subject}\nTo: ${generateEmailTo()}\n\n${content}`;
    await copyToClipboard(fullText);
  };

  const openEmailClient = () => {
    const to = generateEmailTo();
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="section report-preview">
      {toast.show && <div className="toast">{toast.message}</div>}
      <h2>Xem trước báo cáo</h2>

      <div className="preview-field">
        <label>Subject:</label>
        <div className="preview-value subject">
          {subject}
          <button onClick={() => copyToClipboard(subject)} title="Copy Subject">
            Copy
          </button>
        </div>
      </div>

      <div className="preview-field">
        <label>To:</label>
        <div className="preview-value">
          {generateEmailTo()}
          <button onClick={() => copyToClipboard(generateEmailTo())} title="Copy To">
            Copy
          </button>
        </div>
      </div>

      <div className="preview-field">
        <label>Nội dung:</label>
        <pre className="preview-content">{content}</pre>
      </div>

      <div className="action-buttons">
        <button className="btn-primary" onClick={copyHtmlToClipboard}>
          Copy HTML (có link + ảnh)
        </button>
        <button className="btn-primary" onClick={() => copyToClipboard(content)}>
          Copy Text thuần
        </button>
        <button className="btn-secondary" onClick={openEmailClient}>
          Mở Email Client
        </button>
      </div>
    </div>
  );
}

export default ReportPreview;
