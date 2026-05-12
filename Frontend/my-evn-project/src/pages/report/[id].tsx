import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, Col, Row, Typography, Collapse, Tag, Space, Upload, Empty, Spin, Modal, message, Divider } from 'antd';
import { 
  LeftOutlined, TeamOutlined, LockOutlined, UnlockOutlined, 
  InboxOutlined, DownloadOutlined, FileTextOutlined, CheckCircleOutlined, ExclamationCircleOutlined , CloudUploadOutlined, DeleteOutlined
} from '@ant-design/icons';
import { ReportService } from '@/services/ReportService';
import dayjs from 'dayjs';
import ManageAssignmentModal from '@/components/Report/ManageAssignmentModal';

const { Title, Text } = Typography;
const { Dragger } = Upload;

export default function ReportDetail() {
  const router = useRouter();
  const { id } = router.query; 

  const [reportInfo, setReportInfo] = useState<any>(null); 
  const [assignments, setAssignments] = useState<any[]>([]); 
  const [finalFiles, setFinalFiles] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  const [messageApi, messageContextHolder] = message.useMessage();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // --- LOGIC KIỂM TRA KHÓA TOÀN CỤC ---
  const globalStatusText = (reportInfo?.globalStatus || reportInfo?.GlobalStatus || "").toLowerCase();
  const isGlobalLocked = globalStatusText.includes("khóa") || globalStatusText.includes("hoàn thành");

  useEffect(() => {
    if (!router.isReady) return;
    if (id) {
      fetchDetailData(Number(id));
    }
  }, [router.isReady, id]); 

  const fetchDetailData = async (reportId: number) => {
    setLoading(true);
    try {
      const [detailRes, finalFilesRes] = await Promise.all([
        ReportService.getReportDetailAdmin(reportId), 
        ReportService.getFinalFiles(reportId)
      ]);

      if (detailRes.success) {
        const reportData = detailRes.data.report || detailRes.data.Report;
        setReportInfo(reportData); 
        setAssignments(detailRes.data.assignments || detailRes.data.Assignments || []); 
        const reportName = reportData?.reportName || reportData?.ReportName || 'Chi tiết Báo cáo';
        localStorage.setItem('currentReportName', reportName);
        window.dispatchEvent(new Event('updateReportTitle'));
      }
      if (finalFilesRes.success) {
        setFinalFiles(finalFilesRes.data || []);
      }
    } catch (error) {
      messageApi.error('Lỗi khi tải chi tiết báo cáo!');
    } finally {
      setLoading(false);
    }
  };

  const handleLockAll = () => {
    modalApi.confirm({
      title: 'Xác nhận khóa toàn bộ',
      icon: <ExclamationCircleOutlined />,
      content: 'Tất cả các Ban sẽ không thể chỉnh sửa số liệu sau khi khóa. Bạn có chắc chắn?',
      okText: 'Khóa toàn bộ',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const res = await ReportService.lockAllAssignments(Number(id));
          if (res && res.success) {
            messageApi.success('Đã khóa toàn bộ báo cáo!');
            fetchDetailData(Number(id)); 
          } else {
            messageApi.error(res?.message || 'Có lỗi xảy ra!');
          }
        } catch (error) {
          messageApi.error('Lỗi kết nối!');
        }
      },
    });
  };

  const handleUnlockAssignment = (assignmentId: number, deptName: string) => {
    modalApi.confirm({
      title: `Mở khóa cho ${deptName}`,
      icon: <UnlockOutlined style={{ color: '#faad14' }} />,
      content: 'Ban này sẽ có thể tiếp tục nộp file mới. Bạn có chắc chắn?',
      okText: 'Mở khóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const payload = { 
            assignmentId, userId: 1, reason: "Admin mở khóa",
            userFullName: "Admin", userPosition: "Quản trị viên", userDeptName: "Ban Giám Đốc"
          };
          const res = await ReportService.unlockAssignment(payload);
          if (res && res.success) {
            messageApi.success(`Đã mở khóa cho ${deptName}!`);
            fetchDetailData(Number(id)); 
          }
        } catch (error) {
          messageApi.error('Lỗi kết nối!');
        }
      }
    });
  };

  const handleSaveAssignments = async (values: any) => {
    try {
      const res = await ReportService.updateAssignments(Number(id), values.departmentIds);
      if (res && res.success) {
        messageApi.success('Cập nhật phân công thành công!');
        setIsManageModalOpen(false);
        fetchDetailData(Number(id)); 
      }
    } catch (error) {
      messageApi.error('Lỗi kết nối!');
    }
  };

  const handleDownloadFile = async (file: any, e: React.MouseEvent) => {
  e.stopPropagation(); // Ngăn chặn việc click nhầm vào vùng Collapse
  
  // Lấy filePath từ data backend trả về (nhớ kiểm tra xem backend trả là filePath hay FilePath nhé)
  const filePath = file.filePath || file.FilePath; 

  if (!filePath) {
    messageApi.error('Không tìm thấy đường dẫn file để tải!');
    return;
  }

  try {
    messageApi.loading({ content: 'Đang lấy liên kết tải...', key: 'download_file' });
    
    // Gọi API lấy link
    const res = await ReportService.getDownloadLink(filePath);

    if (res && res.success && res.downloadUrl) {
      messageApi.success({ content: 'Đang tải xuống!', key: 'download_file', duration: 2 });
      
      // Mở link trong tab ẩn để trình duyệt tự động tải file về máy
      const link = document.createElement('a');
      link.href = res.downloadUrl;
      link.target = '_blank';
      link.setAttribute('download', file.fileName || file.FileName || 'Bao_Cao');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } else {
      messageApi.error({ content: res.message || 'Lỗi khi lấy liên kết!', key: 'download_file' });
    }
  } catch (error) {
    messageApi.error({ content: 'Lỗi kết nối máy chủ!', key: 'download_file' });
  }
};
const handleUploadFinalFile = async (options: any) => {
    const { file, onSuccess, onError } = options;
    
    try {
      // Gọi API từ ReportService
      const res = await ReportService.uploadFinalFile(Number(id), file);
      
      if (res && res.success) {
        messageApi.success('Đã tải lên file tổng hợp thành công!');
        onSuccess("ok"); // Báo cho giao diện Ant Design biết là đã upload xong
        fetchDetailData(Number(id)); // Tải lại dữ liệu để lấy danh sách file mới nhất
      } else {
        messageApi.error(res.message || 'Lỗi khi tải lên file!');
        onError(new Error(res.message));
      }
    } catch (error) {
      messageApi.error('Lỗi kết nối máy chủ!');
      onError(error);
    }
  };
  const handleDeleteFinalFile = (fileId: number, fileName: string) => {
    modalApi.confirm({
      title: 'Xác nhận xóa file',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: `Bạn có chắc chắn muốn xóa file "${fileName}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const res = await ReportService.deleteFinalFile(fileId);
          if (res && res.success) {
            messageApi.success('Đã xóa file thành công!');
            fetchDetailData(Number(id)); // Load lại danh sách file
          } else {
            messageApi.error(res.message || 'Lỗi khi xóa file!');
          }
        } catch (error) {
          messageApi.error('Lỗi kết nối máy chủ!');
        }
      }
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  const collapseItems = assignments.map((assign: any, index: number) => {
    const isLocked = assign.isLocked || assign.IsLocked || isGlobalLocked;
    const deptName = assign.deptName || assign.DeptName || 'Tên Ban';
    const assignStatus = assign.assignStatus || assign.AssignStatus || 'CHƯA CẬP NHẬT';
    const filesList = assign.files || assign.Files || [];
    const assignmentId = assign.assignmentId || assign.AssignmentId;

    return {
      key: index.toString(),
      label: <span style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{deptName}</span>,
      extra: (
        <Space size="middle" onClick={(e) => e.stopPropagation()}>
          {isLocked ? (
             <Tag style={{ fontWeight: 600, padding: '4px 12px', borderRadius: 6, color: '#10b981', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
               ĐÃ XÁC NHẬN
             </Tag>
          ) : (
             <Tag color="processing" style={{ fontWeight: 600, padding: '4px 12px', borderRadius: 6 }}>
               {assignStatus.toUpperCase()}
             </Tag>
          )}
          
          {isLocked && !isGlobalLocked && (
            <Button 
              size="small" 
              icon={<UnlockOutlined />} 
              onClick={() => handleUnlockAssignment(assignmentId, deptName)}
              style={{ color: '#ef4444', borderColor: '#fca5a5', fontWeight: 600, borderRadius: 4 }}
            >
              Mở khóa
            </Button>
          )}
        </Space>
      ),
      style: { 
        backgroundColor: '#ffffff', 
        border: '1px solid #f1f5f9', 
        borderRadius: 8, 
        marginBottom: 16,
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      },
      children: (
        <div style={{ padding: '0 24px', paddingBottom: '16px' }}>
          {filesList.length > 0 ? filesList.map((file: any, fIndex: number) => {
            const isFinal = file.isFinal || file.IsFinal;
            const fileName = file.fileName || file.FileName || 'Chưa có tên file';
            const version = file.version || file.Version || 1; // Backend trả là Version
            const note = file.notes || file.Notes; // Backend trả là Notes (có s)
            const createdAt = file.uploadedAt || file.UploadedAt || new Date(); // Backend trả là UploadedAt
            const author = file.uploadedByName || file.UploadedByName || 'NV. Chưa xác định'; // Trường mới thêm

            return (
              <div key={fIndex} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '16px', 
                border: isFinal ? '1px solid #bbf7d0' : '1px solid #e2e8f0', 
                borderRadius: 8, 
                marginBottom: 12, 
                backgroundColor: isFinal ? '#f0fdf4' : '#ffffff' 
              }}>
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                  {/* Icon File */}
                  <div style={{ paddingTop: 4 }}>
                    <FileTextOutlined style={{ fontSize: 22, color: isFinal ? '#16a34a' : '#3b82f6' }} />
                  </div>
                  
                  {/* Nội dung thông tin File */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Dòng 1: Tên file & Tag Bản chốt */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                      <Text strong style={{ fontSize: 15, color: '#1e293b' }}>{fileName}</Text>
                      {isFinal && (
                        <Tag color="#22c55e" style={{ borderRadius: 12, marginLeft: 12, fontWeight: 600, border: 'none' }}>BẢN CHỐT</Tag>
                      )}
                    </div>
                    
                    {/* Dòng 2: Version, Thời gian, Người nộp */}
                    <div style={{ marginBottom: note ? 12 : 0 }}>
                      <Space separator={<span style={{color: '#cbd5e1'}}>|</span>} style={{ fontSize: 13, color: '#64748b' }}>
                        <Tag style={{ margin: 0, borderRadius: 4, backgroundColor: '#f1f5f9', border: 'none', color: '#64748b', fontWeight: 500 }}>
                          v{version}
                        </Tag>
                        <span>{dayjs(createdAt).format('HH:mm DD/MM/YYYY')}</span>
                        <span>{author}</span>
                      </Space>
                    </div>

                    {/* Dòng 3: Ghi chú (nếu có) */}
                    {note && (
                      <div style={{ 
                        border: '1px solid #f1f5f9', 
                        padding: '6px 12px', 
                        borderRadius: 4, 
                        backgroundColor: '#ffffff',
                        width: 'fit-content', /* Ép chiều rộng vừa đủ nội dung thay vì inline-block */
                        maxWidth: '100%'
                      }}>
                        <Text type="secondary" italic style={{ fontSize: 13 }}>Ghi chú: "{note}"</Text>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nút Tải xuống */}
                <Button 
                  type="text" 
                  icon={<DownloadOutlined style={{ fontSize: 20, color: '#3b82f6' }} />} 
                  onClick={(e) => handleDownloadFile(file, e)}
                />
              </div>
            );
          }) : (
            <Empty description="Ban này chưa nộp báo cáo" />
          )}
        </div>
      )
    };
  });

  return (
    <>
      {messageContextHolder}
      {modalApi && modalContextHolder}
      
      <div style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, backgroundColor: '#fff', padding: '16px 24px', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <Title level={4} style={{ margin: 0, color: '#1e293b' }}>
            {reportInfo?.reportName || 'Tên báo cáo trống'} 
            {isGlobalLocked && <Tag color="error" style={{ marginLeft: 12 }}>ĐÃ KHÓA TOÀN BỘ</Tag>}
          </Title>
        </div>

        <Row gutter={24}>
          <Col span={16}>
            <Card 
              title={<span style={{ fontSize: 18, fontWeight: 'bold' }}>Tình hình nộp báo cáo của các Ban</span>}
              extra={
                <Space>
                  <Button disabled={isGlobalLocked} icon={<TeamOutlined />} onClick={() => setIsManageModalOpen(true)} style={{ color: '#2563eb', backgroundColor: '#eff6ff', fontWeight: 600, border: 'none' }}>Quản lý phân công</Button>
                  {isGlobalLocked ? (
                    <Button icon={<UnlockOutlined />} style={{ fontWeight: 600 }}>Mở khóa toàn bộ</Button>
                  ) : (
                    <Button icon={<LockOutlined />} onClick={handleLockAll} style={{ color: '#dc2626', backgroundColor: '#fef2f2', fontWeight: 600, border: 'none' }}>Khóa toàn bộ</Button>
                  )}
                </Space>
              }
              style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <Collapse defaultActiveKey={['0']} ghost items={collapseItems} />
            </Card>
          </Col>

          {/* CỘT BÊN PHẢI: FILE TỔNG HỢP */}
          <Col span={8}>
            <Card 
              styles={{ body: { padding: 0 } }} // Bỏ padding mặc định để làm header tràn viền
              style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              {/* Header Card (Màu xanh dương nhạt) */}
              <div style={{ backgroundColor: '#eff6ff', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircleOutlined style={{ color: '#312e81', fontSize: 22 }} />
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#312e81' }}>File Báo Cáo Tổng Hợp</span>
                </div>
                <div style={{ color: '#4f46e5', fontSize: 13, marginTop: 6, marginLeft: 32 }}>
                  Nơi Admin lưu bản Final (Word/PDF)
                </div>
              </div>

              {/* Nội dung Card */}
              <div style={{ padding: '24px' }}>
                
                {/* Khu vực Upload */}
                <Dragger 
                  disabled={isGlobalLocked} 
                  customRequest={handleUploadFinalFile} 
                  showUploadList={false}
                  style={{ 
                    backgroundColor: '#ffffff', 
                    border: '2px dashed #c7d2fe', // Viền đứt nét màu xanh nhạt
                    borderRadius: 12,
                    padding: '16px 0'
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <CloudUploadOutlined style={{ color: '#6366f1', fontSize: 48 }} />
                  </p>
                  <p className="ant-upload-text" style={{ color: '#1e3a8a', fontWeight: 600, fontSize: 15 }}>
                    Kéo thả file tổng hợp vào đây
                  </p>
                  <p className="ant-upload-hint" style={{ color: '#818cf8', fontSize: 13 }}>
                    hoặc click để chọn file từ máy tính
                  </p>
                </Dragger>

                {/* Danh sách file Final */}
                <div style={{ marginTop: 32 }}>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ color: '#64748b', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      DANH SÁCH FILE FINAL
                    </Text>
                  </div>

                  {finalFiles.length > 0 ? (
                    finalFiles.map((file: any, index: number) => {
                      const fileId = file.fileId || file.FileId;
                      const fileName = file.fileName || file.FileName || 'Bao_cao_final';
                      
                      return (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          padding: '12px 16px', 
                          border: '1px solid #f1f5f9', 
                          borderRadius: 8, 
                          marginBottom: 8,
                          backgroundColor: '#f8fafc'
                        }}>
                          <Space>
                            <FileTextOutlined style={{ fontSize: 18, color: '#3b82f6' }} />
                            <Text strong style={{ color: '#334155' }}>{fileName}</Text>
                          </Space>
                          
                          <Space size="small">
                            {/* Nút Tải xuống (Dùng chung hàm handleDownloadFile lúc nãy) */}
                            <Button 
                              type="text" 
                              icon={<DownloadOutlined style={{ color: '#3b82f6' }} />} 
                              onClick={(e) => handleDownloadFile(file, e)}
                            />
                            {/* Nút Xóa */}
                            {!isGlobalLocked && (
                              <Button 
                                type="text" 
                                danger 
                                icon={<DeleteOutlined />} 
                                onClick={() => handleDeleteFinalFile(fileId, fileName)}
                              />
                            )}
                          </Space>
                        </div>
                      )
                    })
                  ) : (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontStyle: 'italic', fontSize: 14 }}>
                      Chưa có file tổng hợp nào.
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <ManageAssignmentModal 
        isOpen={isManageModalOpen} 
        onClose={() => setIsManageModalOpen(false)} 
        onSave={handleSaveAssignments}
        currentAssignments={assignments}
      />
    </>
  );
}