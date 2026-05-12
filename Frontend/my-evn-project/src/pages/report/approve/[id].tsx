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

  const userStr = typeof window !== 'undefined' ? localStorage.getItem("currentUser") : null;
  const currentUser = userStr ? JSON.parse(userStr) : {};

  const currentUserId = currentUser.id || currentUser.userId || currentUser.Id ;
  const currentUserName = currentUser.fullName || currentUser.FullName ;
  const currentUserPosition = currentUser.position || currentUser.Position || currentUser.role ;

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
        
        const titleToDisplay = currentReport?.reportName || currentReport?.name || "";
        localStorage.setItem('currentReportName', titleToDisplay);
        window.dispatchEvent(new Event('updateReportTitle'));
        
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
  
  // --- LOGIC KIỂM TRA KHÓA TRỰC TIẾP TỪ DATA DATABASE ---
  const isLocked = React.useMemo(() => {
    if (!myAssignment || !reportInfo) return false;

    // Ưu tiên kiểm tra cột IsLocked từ bảng Assignment trong DB
    const isAssignLocked = myAssignment.isLocked === true || myAssignment.IsLocked === true || myAssignment.isLocked === 1;
    
    // Kiểm tra trạng thái chữ (đề phòng dữ liệu DB chỉ cập nhật text)
    const statusText = (myAssignment.assignStatus || myAssignment.AssignStatus || "").toLowerCase();
    const globalStatusText = (reportInfo.globalStatus || reportInfo.GlobalStatus || "").toLowerCase();

    return (
      isAssignLocked || 
      globalStatusText.includes("khóa") || 
      globalStatusText.includes("hoàn thành") ||
      statusText.includes("khóa") ||
      statusText.includes("xác nhận")
    );
  }, [myAssignment, reportInfo]); // Theo dõi sự thay đổi của data từ DB

  const handleApprove = async () => {
    if (!selectedVersionId) {
      messageApi.warning("Vui lòng chọn ít nhất 1 bản báo cáo để phê duyệt!");
      return;
    }

    setSubmitting(true);
    try {
      const selectedVerObj = versions.find(v => (v.versionId || v.VersionId) === selectedVersionId);
      const finalAssignmentId = selectedVerObj?.assignmentId || selectedVerObj?.AssignmentId || myAssignment?.assignmentId || myAssignment?.AssignmentId;
      
      const payload = {
            AssignmentId: Number(finalAssignmentId),
            SelectedVersionId: Number(selectedVersionId),
            UserId: Number(currentUserId),
            UserFullName: currentUserName,
            UserPosition: currentUserPosition,
            UserDeptName: myAssignment?.deptName || myAssignment?.DeptName 
        };

      const res = await ReportService.approveReport(payload);
      
      if (res && res.success) {
        messageApi.success("Khóa và chốt số liệu thành công!");
        
        // --- QUAN TRỌNG: Cập nhật lại data từ Database thay vì chuyển trang ngay ---
        await fetchData(); 
        
      } else {
        messageApi.error(res?.message || "Lỗi phê duyệt báo cáo.");
      }
    } catch (error: any) {
      messageApi.error("Dữ liệu không hợp lệ hoặc lỗi Server.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" description="Đang tải dữ liệu..." /></div>;

  return (
    <>
      {contextHolder}

      <div style={{ backgroundColor: '#f4f7f9', minHeight: '100vh', padding: '40px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
          
          <Card style={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Space orientation="vertical" size={24} style={{ width: '100%' }}>
              
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
                  {/* TAG TRẠNG THÁI GÓC PHẢI */}
                  <Tag color={isLocked ? "success" : "blue"} style={{ borderRadius: 6, fontWeight: 700, padding: '4px 12px' }}>
                    {isLocked ? "ĐÃ XÁC NHẬN" : (statusText.toUpperCase() || 'ĐANG THỰC HIỆN')}
                  </Tag>
                </Col>
              </Row>

              {/* Hướng dẫn hoặc Thông báo đã khóa */}
              <Alert
                title={
                  <Text strong style={{ color: isLocked ? '#166534' : '#1e40af' }}>
                    {isLocked ? "Ban đã chốt số liệu thành công" : "Hướng dẫn phê duyệt:"}
                  </Text>
                }
                description={
                  isLocked ? (
                    <Text style={{ color: '#166534' }}>Báo cáo giao ban ĐHSX tháng 5/2026</Text>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: 20, color: '#1e3a8a', fontSize: 13 }}>
                      <li>Chọn một hoặc nhiều bản cập nhật của nhân viên để duyệt làm bản Final.</li>
                      <li>Bạn cũng có thể đính kèm thêm file của riêng mình (VD: Bản scan có chữ ký, file chốt cuối).</li>
                    </ul>
                  )
                }
                type={isLocked ? "success" : "info"}
                showIcon
                style={{ borderRadius: 8, border: isLocked ? '1px solid #bbf7d0' : '1px solid #bfdbfe' }}
              />

              {/* Phần 1: Danh sách file nhân viên */}
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

              {/* Nút Action / Thông báo hoàn thành ở dưới cùng */}
              <Row justify="end" style={{ marginTop: 10 }}>
                {isLocked ? (
                  /* GIAO DIỆN KHI ĐÃ CHỐT GIỐNG TRONG ẢNH */
                  <div style={{ 
                    backgroundColor: '#dcfce7', 
                    border: '1px solid #bbf7d0', 
                    padding: '12px 32px', 
                    borderRadius: 8, 
                    display: 'flex', 
                    gap: 12, 
                    alignItems: 'center' 
                  }}>
                    <CheckCircleOutlined style={{ color: '#16a34a', fontSize: 20 }} />
                    <Text strong style={{ color: '#15803d', fontSize: 16 }}>
                      Ban đã chốt số liệu thành công
                    </Text>
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
