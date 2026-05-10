import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, Col, Row, Typography, Space, Upload, Input, Tag, message, Spin } from 'antd';
import { LeftOutlined, CloudUploadOutlined, ClockCircleOutlined, CheckCircleOutlined, LockOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ReportService } from '@/services/ReportService';

// IMPORT COMPONENT CON VÀO ĐÂY
import VersionHistoryCard from '@/components/Report/VersionHistoryCard'; 

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

export default function SubmitReport() {
  const router = useRouter();
  const { id } = router.query;

  // 1. SỬA LẠI KHÚC LẤY USER: Thêm typeof window để chống lỗi Crash Next.js (SSR)
  const userStr = typeof window !== 'undefined' ? localStorage.getItem("currentUser") : null;
  const currentUser = userStr ? JSON.parse(userStr) : {};

  // Bao quát mọi trường hợp trả về từ C# (viết hoa/viết thường)
  const currentUserId = currentUser.id || currentUser.userId || currentUser.Id || "1";
  const currentUserName = currentUser.fullName || currentUser.FullName || currentUser.username || "Nhân viên";
  const currentUserPosition = currentUser.position || currentUser.Position || currentUser.role || currentUser.Role || "Nhân viên";

  const [loading, setLoading] = useState(true);
  const [loadingVersions, setLoadingVersions] = useState(false); 
  const [reportInfo, setReportInfo] = useState<any>(null);
  const [myAssignment, setMyAssignment] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  
  const [note, setNote] = useState('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (router.isReady && id) {
      fetchData();
    }
  }, [router.isReady, id]);

  const fetchVersionsData = async (reportId: number, deptId: number) => {
    setLoadingVersions(true);
    try {
      const res = await ReportService.getReportVersions(reportId, deptId);
      if (res && res.success) {
        setVersions(res.data || []);
      }
    } catch (error) {
      message.error("Lỗi tải lịch sử phiên bản");
    } finally {
      setLoadingVersions(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await ReportService.getReportDetailForDept(Number(id));
      if (res && res.success && res.data) {
        const currentReport = res.data.report;
        const currentAssignment = res.data.assignment;
        
        setReportInfo(currentReport);
        setMyAssignment(currentAssignment);

        const titleToDisplay = currentReport?.reportName || currentReport?.name || "";
        localStorage.setItem('currentReportName', titleToDisplay);
        window.dispatchEvent(new Event('updateReportTitle'));
        
        const currentDeptId = currentAssignment?.deptId || currentAssignment?.DeptId || 2;
        await fetchVersionsData(Number(id), currentDeptId);
      }
    } catch (error) {
      message.error("Lỗi kết nối hệ thống");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("Vui lòng chọn file!");
      return;
    }

    const fileToUpload = fileList[0].originFileObj || fileList[0];
    if (!(fileToUpload instanceof File)) {
      message.error("Dữ liệu không phải là File hợp lệ!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    const currentDeptId = myAssignment?.deptId || myAssignment?.DeptId || 2;

    // 2. SỬA LẠI KHÚC GẮN FORM DATA: Dùng các biến động vừa lấy ở trên
    formData.append('File', fileToUpload); 
    formData.append('ReportId', String(id));
    formData.append('DeptId', String(currentDeptId));
    formData.append('UserId', String(currentUserId)); // Truyền ID thật
    formData.append('Note', note || "");
    formData.append('UserFullName', currentUserName); // Truyền Tên thật
    formData.append('UserPosition', currentUserPosition); // Truyền Chức vụ thật
    formData.append('UserDeptName', myAssignment?.deptName || myAssignment?.DeptName || "Ban Kỹ thuật");

    try {
      const res = await ReportService.uploadReportFile(formData);
      if (res && res.success) {
        message.success("Nộp báo cáo thành công!");
        setFileList([]);
        setNote('');
        
        // Cập nhật lại danh sách lịch sử sau khi upload
        await fetchVersionsData(Number(id), currentDeptId);
      } else {
        message.error(res?.message || "Lỗi nộp file");
      }
    } catch (error) {
      message.error("Lỗi kết nối server");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  const statusText = myAssignment?.assignStatus || myAssignment?.AssignStatus || "";
  const globalStatusText = reportInfo?.globalStatus || reportInfo?.GlobalStatus || "";
  
  const isLocked = 
    myAssignment?.isLocked === true || 
    myAssignment?.IsLocked === true || 
    myAssignment?.isLocked === 1 || 
    myAssignment?.IsLocked === 1 || 
    globalStatusText.toLowerCase().includes("khóa") || 
    globalStatusText.toLowerCase().includes("hoàn thành") ||
    statusText.toLowerCase().includes("khóa") ||      
    statusText.toLowerCase().includes("xác nhận");

  const deadlineValue = reportInfo?.deadline || reportInfo?.Deadline;

  return (
    <div style={{ backgroundColor: '#f4f7f9', minHeight: '100vh', padding: '40px 0' }}>
      <div style={{ maxWidth: 850, margin: '0 auto', padding: '0 20px' }}>
        <Space orientation="vertical" size={20} style={{ width: '100%' }}>
          
          {/* Header Card */}
          <Card style={{ borderRadius: 12, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col flex="auto">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>  
                  <div>
                    <Title level={4} style={{ margin: 0, color: '#1e293b' }}>{reportInfo?.reportName || reportInfo?.name}</Title>
                    <Space style={{ marginTop: 6, color: '#64748b', fontSize: 13 }}>
                      <ClockCircleOutlined style={{ color: '#ef4444' }} /> 
                      <span style={{ fontWeight: 500 }}>Hạn chốt :</span>
                      <span style={{ color: '#1e293b', fontWeight: 600 }}>{deadlineValue ? dayjs(deadlineValue).format('HH:mm DD/MM/YYYY') : 'Chưa thiết lập'}</span>
                    </Space>
                  </div>
                </div>
              </Col>
              <Col>
                <Tag color={isLocked ? "error" : "blue"} style={{ borderRadius: 6, fontWeight: 700, padding: '4px 12px', fontSize: 12 }}>
                  {isLocked ? "ĐÃ KHÓA" : (myAssignment?.assignStatus?.toUpperCase() || 'ĐANG THỰC HIỆN')}
                </Tag>
              </Col>
            </Row>
          </Card>

          {/* Form Nộp */}
          <Card 
            title={<Space style={{ fontSize: 15, fontWeight: 700 }}><CloudUploadOutlined style={{ color: '#2563eb' }} /> Nộp báo cáo / Cập nhật số liệu</Space>} 
            style={{ borderRadius: 12, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
          >
            {isLocked ? (
              <div style={{ 
                backgroundColor: '#fffbeb', 
                border: '1px solid #fde68a', 
                borderRadius: 8, 
                padding: '24px 20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px' 
              }}>
                <LockOutlined style={{ fontSize: 28, color: '#d97706' }} />
                <div>
                  <Text strong style={{ fontSize: 16, color: '#1e293b', display: 'block', marginBottom: 4 }}>
                    Đợt báo cáo đã kết thúc
                  </Text>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    Admin đã khóa toàn bộ đợt báo cáo này. Bạn không thể cập nhật thêm.
                  </Text>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 20 }}>
                  <Text strong style={{ display: 'block', marginBottom: 12, color: '#334155' }}>Tệp tin báo cáo (Excel, Word, PDF...)</Text>
                  <Dragger 
                    fileList={fileList} 
                    customRequest={({ file, onSuccess }: any) => { 
                      setFileList([{ 
                        uid: file.uid || '-1',
                        name: file.name, 
                        status: 'done',
                        originFileObj: file 
                      }]); 
                      onSuccess("ok"); 
                    }} 
                    onRemove={() => setFileList([])} 
                    style={{ backgroundColor: '#f8fafc', borderRadius: 10, border: '2px dashed #e2e8f0' }}
                  >
                    <p className="ant-upload-drag-icon"><CloudUploadOutlined style={{ color: '#2563eb', fontSize: 40 }} /></p>
                    <p className="ant-upload-text">Chọn file hoặc kéo thả vào đây</p>
                  </Dragger>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Text strong style={{ display: 'block', marginBottom: 12, color: '#334155' }}>Ghi chú cho Lãnh đạo (Tùy chọn)</Text>
                  <TextArea 
                    rows={4} 
                    placeholder="Nhập nội dung thay đổi hoặc lý do cập nhật lại số liệu..." 
                    value={note} 
                    onChange={(e) => setNote(e.target.value)} 
                    style={{ borderRadius: 10, padding: '12px' }} 
                  />
                </div>

                <Button 
                  type="primary" block size="large" icon={<CheckCircleOutlined />} 
                  onClick={handleUpload} loading={uploading} disabled={fileList.length === 0} 
                  style={{ height: 50, borderRadius: 10, fontWeight: 700, color: '#fff', fontSize: 16, backgroundColor: '#2563eb', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}
                >
                  Tải lên bản cập nhật mới
                </Button>
              </>
            )}
          </Card>

          {/* HIỂN THỊ COMPONENT CON */}
          <VersionHistoryCard 
            versions={versions} 
            deptName={myAssignment?.deptName || myAssignment?.DeptName} 
            loading={loadingVersions}
          />

        </Space>
      </div>
    </div>
  );
}