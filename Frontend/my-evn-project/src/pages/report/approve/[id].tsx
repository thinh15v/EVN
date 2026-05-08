import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Card, Typography, Space, Tag, Alert, Button, Spin, Row, Col, message, Input 
} from 'antd';
import { 
  CheckCircleOutlined, LockOutlined, FileTextOutlined, UploadOutlined 
} from '@ant-design/icons';
import { ReportService } from '@/services/ReportService';
import EmployeeVersionsList from '@/components/Report/EmployeeVersionsList';

const { Title, Text } = Typography;

export default function ApproveReport() {
  const router = useRouter();
  const { id } = router.query;

  // Sử dụng messageApi để tránh lỗi "Static function can not consume context"
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [reportInfo, setReportInfo] = useState<any>(null);
  const [myAssignment, setMyAssignment] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);

  useEffect(() => {
    if (router.isReady && id) {
      fetchData();
    }
  }, [router.isReady, id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await ReportService.getReportDetailForDept(Number(id));
      if (res && res.success && res.data) {
        const currentReport = res.data.report;
        const currentAssignment = res.data.assignment;
        
        setReportInfo(currentReport);
        setMyAssignment(currentAssignment);
        
        const deptId = currentAssignment?.deptId || currentAssignment?.DeptId || 2;
        const versionRes = await ReportService.getReportVersions(Number(id), deptId);
        
        if (versionRes && versionRes.success) {
          setVersions(versionRes.data);
          if (versionRes.data.length > 0) {
            // Ưu tiên lấy ID phiên bản đã được chọn từ trước (IsSelected) hoặc bản mới nhất
            const preSelected = versionRes.data.find((v: any) => v.isSelected || v.IsSelected);
            setSelectedVersionId(preSelected ? (preSelected.versionId || preSelected.VersionId) : (versionRes.data[0].versionId || versionRes.data[0].VersionId));
          }
        }
      }
    } catch (error) {
      messageApi.error("Lỗi lấy dữ liệu từ máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC KIỂM TRA KHÓA ---
  const statusText = myAssignment?.assignStatus || myAssignment?.AssignStatus || "";
  const globalStatus = reportInfo?.globalStatus || reportInfo?.GlobalStatus || "";
  
  const isLocked = 
    myAssignment?.isLocked === true || 
    myAssignment?.IsLocked === true || 
    myAssignment?.isLocked === 1 || 
    myAssignment?.IsLocked === 1 ||
    globalStatus.toLowerCase().includes("khóa") || 
    globalStatus.toLowerCase().includes("hoàn thành") ||
    statusText.toLowerCase().includes("khóa") ||
    statusText.toLowerCase().includes("xác nhận");

  const handleApprove = async () => {
    if (!selectedVersionId) {
      messageApi.warning("Vui lòng chọn ít nhất 1 bản báo cáo để phê duyệt!");
      return;
    }

    setSubmitting(true);
    try {
      // Tìm đối tượng version để lấy AssignmentId chính xác từ file (phòng trường hợp lệch data)
      const selectedVerObj = versions.find(v => (v.versionId || v.VersionId) === selectedVersionId);
      const finalAssignmentId = selectedVerObj?.assignmentId || selectedVerObj?.AssignmentId || myAssignment?.assignmentId || myAssignment?.AssignmentId;
      
      const payload = {
            // Ép kiểu chắc chắn về Number
            AssignmentId: Number(finalAssignmentId),
            SelectedVersionId: Number(selectedVersionId),
            UserId: 3,
            UserFullName: "Lãnh đạo Ban Kỹ Thuật",
            UserPosition: "Trưởng Ban",
            UserDeptName: myAssignment?.deptName || "Ban Kỹ thuật"
        };

      console.log("Payload gửi đi:", payload);

      const res = await ReportService.approveReport(payload);
      
      if (res && res.success) {
        messageApi.success("Khóa và chốt số liệu thành công!");
        // Chờ 1 chút để người dùng thấy thông báo trước khi chuyển trang
        setTimeout(() => router.push('/report'), 1000); 
      } else {
        messageApi.error(res?.message || "Lỗi phê duyệt báo cáo.");
      }
    } catch (error: any) {
      console.error("Chi tiết lỗi 400 từ Server:", error.response?.data);
      messageApi.error("Dữ liệu không hợp lệ hoặc lỗi Server.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" description="Đang tải dữ liệu..." /></div>;

  return (
    <>
      {/* ContextHolder bắt buộc phải có để hiển thị thông báo messageApi */}
      {contextHolder}

      <div style={{ backgroundColor: '#f4f7f9', minHeight: '100vh', padding: '40px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
          
          <Card style={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              
              {/* Header */}
              <Row justify="space-between" align="top">
                <Col>
                  <Space align="start" size={12}>
                    <CheckCircleOutlined style={{ color: '#10b981', fontSize: 24, marginTop: 4 }} />
                    <div>
                      <Title level={4} style={{ margin: 0, color: '#1e293b' }}>Phê duyệt Báo cáo</Title>
                      <Text type="secondary">{reportInfo?.reportName || reportInfo?.name || 'Báo cáo vận hành hệ thống'}</Text>
                    </div>
                  </Space>
                </Col>
                <Col>
                  <Tag color={isLocked ? "error" : "blue"} style={{ borderRadius: 6, fontWeight: 700, padding: '4px 12px' }}>
                    {isLocked ? "ĐÃ KHÓA" : (statusText.toUpperCase() || 'ĐANG THỰC HIỆN')}
                  </Tag>
                </Col>
              </Row>

              {/* Hướng dẫn */}
              <Alert
                title={<Text strong style={{ color: isLocked ? '#92400e' : '#1e40af' }}>{isLocked ? "Đợt báo cáo đã kết thúc" : "Hướng dẫn phê duyệt:"}</Text>}
                description={
                  isLocked ? (
                    <Text style={{ color: '#92400e' }}>Báo cáo này đã được xác nhận và khóa. Bạn không thể thay đổi dữ liệu đã chốt.</Text>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: 20, color: '#1e3a8a', fontSize: 13 }}>
                      <li>Chọn một bản cập nhật của nhân viên để duyệt làm bản Final.</li>
                      <li>Dữ liệu sẽ được khóa ngay sau khi bạn nhấn xác nhận.</li>
                    </ul>
                  )
                }
                type={isLocked ? "warning" : "info"}
                showIcon
                style={{ borderRadius: 8 }}
              />

              {/* Phần 1: Chọn file của nhân viên */}
              <div>
                <Space style={{ marginBottom: 16 }}>
                  <FileTextOutlined style={{ color: '#64748b' }} />
                  <Text strong style={{ fontSize: 15, color: '#334155' }}>1. CÁC BẢN BÁO CÁO DO NHÂN VIÊN NỘP</Text>
                </Space>
                
                <EmployeeVersionsList 
                  versions={versions} 
                  selectedVersionId={selectedVersionId} 
                  onSelectVersion={(id) => !isLocked && setSelectedVersionId(id)} 
                />
              </div>

              {/* Phần 2: Upload file của Lãnh đạo */}
              {!isLocked && (
                <div>
                  <Space style={{ marginBottom: 16 }}>
                    <UploadOutlined style={{ color: '#64748b' }} />
                    <Text strong style={{ fontSize: 15, color: '#334155' }}>2. TẢI LÊN THÊM FILE BỔ SUNG (TÙY CHỌN)</Text>
                  </Space>
                  
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', backgroundColor: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <Button>Choose File</Button>
                    <Text type="secondary" style={{ flex: 1 }}>Chưa chọn file nào</Text>
                    <Input placeholder="Ghi chú file..." style={{ width: 250 }} />
                    <Button type="primary" style={{ backgroundColor: '#1e293b' }} icon={<UploadOutlined />}>Thêm file</Button>
                  </div>
                </div>
              )}

              {/* Nút Action */}
              <Row justify="end" style={{ marginTop: 10 }}>
                {isLocked ? (
                  <div style={{ 
                    backgroundColor: '#fffbeb', border: '1px solid #fde68a', 
                    padding: '12px 24px', borderRadius: 8, display: 'flex', gap: 12, alignItems: 'center' 
                  }}>
                    <LockOutlined style={{ color: '#d97706', fontSize: 18 }} />
                    <Text strong style={{ color: '#d97706' }}>Hệ thống đã đóng đợt báo cáo này</Text>
                  </div>
                ) : (
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<LockOutlined />}
                    loading={submitting}
                    onClick={handleApprove}
                    style={{ 
                      backgroundColor: '#10b981', 
                      borderRadius: 8, 
                      fontWeight: 600,
                      height: 48,
                      padding: '0 32px',
                      border: 'none'
                    }}
                  >
                    Xác nhận & Khóa Báo cáo
                  </Button>
                )}
              </Row>

            </Space>
          </Card>
        </div>
      </div>
    </>
  );
}