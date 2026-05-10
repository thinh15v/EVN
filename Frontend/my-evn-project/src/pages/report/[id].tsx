import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, Col, Row, Typography, Collapse, Tag, Space, Upload, Empty, Spin, Modal, message } from 'antd';
import { 
  LeftOutlined, TeamOutlined, LockOutlined, UnlockOutlined, 
  InboxOutlined, DownloadOutlined, FileExcelOutlined, CheckCircleOutlined, ExclamationCircleOutlined
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
  // Nếu globalStatus chứa chữ "khóa" hoặc "hoàn thành", coi như toàn bộ đợt bị khóa
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
        setReportInfo(detailRes.data.report || detailRes.data.Report); 
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

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  const collapseItems = assignments.map((assign: any, index: number) => {
    // SỬA TẠI ĐÂY: isLocked sẽ là true nếu riêng Ban đó khóa HOẶC Admin khóa cả đợt
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
          <Tag color={isLocked ? "success" : "processing"} style={{ fontWeight: 600, padding: '4px 12px', borderRadius: 6 }}>
            {isLocked ? "ĐÃ XÁC NHẬN" : assignStatus.toUpperCase()}
          </Tag>
          
          {/* Chỉ hiện nút Mở khóa nếu Ban đó bị khóa NHƯNG Admin chưa khóa toàn bộ đợt */}
          {isLocked && !isGlobalLocked && (
            <Button 
              size="small" 
              icon={<UnlockOutlined />} 
              onClick={() => handleUnlockAssignment(assignmentId, deptName)}
              style={{ color: '#dc2626', borderColor: '#fecaca', fontWeight: 600, borderRadius: 4 }}
            >
              Mở khóa
            </Button>
          )}
        </Space>
      ),
      style: { 
        backgroundColor: isLocked ? '#ffffff' : '#f8fafc', 
        border: isLocked ? '1px solid #e2e8f0' : '1px dashed #cbd5e1', 
        borderRadius: 8, 
        marginBottom: 16 
      },
      children: (
        <div style={{ padding: '0 24px' }}>
          {filesList.length > 0 ? filesList.map((file: any, fIndex: number) => {
            const isFinal = file.isFinal || file.IsFinal;
            return (
              <div key={fIndex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: isFinal ? '1px solid #bbf7d0' : '1px solid #e2e8f0', borderRadius: 8, marginBottom: 12, backgroundColor: isFinal ? '#f0fdf4' : '#ffffff' }}>
                <Space size={12}>
                  <FileExcelOutlined style={{ fontSize: 24, color: isFinal ? '#16a34a' : '#2563eb' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{file.fileName || file.FileName}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>v{file.version || file.Version || 1}</Text>
                  </div>
                </Space>
                {isFinal && <Tag color="#16a34a">BẢN CHỐT</Tag>}
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
                  <Button disabled={isGlobalLocked} icon={<TeamOutlined />} onClick={() => setIsManageModalOpen(true)} style={{ color: '#2563eb', backgroundColor: '#eff6ff', fontWeight: 600 }}>Quản lý phân công</Button>
                  {isGlobalLocked ? (
                    <Button icon={<UnlockOutlined />} style={{ fontWeight: 600 }}>Mở khóa toàn bộ</Button>
                  ) : (
                    <Button icon={<LockOutlined />} onClick={handleLockAll} style={{ color: '#dc2626', backgroundColor: '#fef2f2', fontWeight: 600 }}>Khóa toàn bộ</Button>
                  )}
                </Space>
              }
              style={{ borderRadius: 12 }}
            >
              <Collapse defaultActiveKey={['0']} ghost items={collapseItems} />
            </Card>
          </Col>

          <Col span={8}>
            <Card title={<div><CheckCircleOutlined /> File Báo Cáo Tổng Hợp</div>} style={{ borderRadius: 12 }}>
              <Dragger disabled={isGlobalLocked} action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188">
                <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: isGlobalLocked ? '#cbd5e1' : '#60a5fa', fontSize: 48 }} /></p>
                <p className="ant-upload-text">Kéo thả file tổng hợp vào đây</p>
              </Dragger>
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