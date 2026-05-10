import React, { useEffect, useState } from 'react';
import { Modal, Collapse, Tag, Typography, Space, Spin, Empty, Timeline } from 'antd';
import { 
  HistoryOutlined, 
  SafetyCertificateOutlined, 
  RightOutlined,
  UserOutlined,
  LockOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { ReportService } from '@/services/ReportService';

const { Title, Text } = Typography;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reportId: number;
  reportInfo: any;
  currentAssignments: any[];
}

export default function AuditLogModal({ isOpen, onClose, reportId, reportInfo, currentAssignments }: Props) {
  const [loading, setLoading] = useState(false);
  const [timelineData, setTimelineData] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && reportId) {
      loadTimeline();
    }
  }, [isOpen, reportId]);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const res = await ReportService.getReportTimeline(reportId);
      if (res && res.success && res.data && Array.isArray(res.data.events)) {
        setTimelineData(res.data.events);
      } else {
        setTimelineData([]);
      }
    } catch (error) {
      setTimelineData([]);
    } finally {
      setLoading(false);
    }
  };

  const safeTimeline = Array.isArray(timelineData) ? timelineData : [];
  const safeAssignments = Array.isArray(currentAssignments) ? currentAssignments : [];

  // Logic nhóm log (Giữ nguyên logic của bạn nhưng tối ưu hóa hiển thị)
  const displayList = safeAssignments.map(assign => {
    const deptName = assign.deptName || assign.DeptName;
    const logsOfDept = safeTimeline.filter(log => (log.deptName || log.DeptName) === deptName);
    
    // Xác định trạng thái của Ban dựa trên việc có nộp file hay chưa
    const hasUpdated = logsOfDept.some(l => l.actionType === "UPLOAD" || l.actionType === "CONFIRM");

    return {
      deptName,
      status: assign.isLocked || assign.IsLocked ? 'LOCKED' : (hasUpdated ? 'UPDATED' : 'EMPTY'),
      logs: logsOfDept,
      lastUpdate: logsOfDept.length > 0 ? logsOfDept[0].actionTime : null
    };
  });

  const adminLogs = safeTimeline.filter(log => {
    const logDept = log.deptName || log.DeptName;
    return !logDept || logDept === "Ban Giám Đốc" || !safeAssignments.some(a => (a.deptName || a.DeptName) === logDept);
  });
  
  const finalDisplay = [];
  if (adminLogs.length > 0) {
    finalDisplay.push({
      deptName: "Hệ thống & Ban Quản trị",
      status: 'ADMIN',
      logs: adminLogs,
      lastUpdate: adminLogs[0].actionTime
    });
  }
  finalDisplay.push(...displayList);

  const collapseItems = finalDisplay.map((item, index) => ({
    key: index.toString(),
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Space orientation="vertical" size={2}>
          <Space>
            {item.status === 'ADMIN' ? (
                <SafetyCertificateOutlined style={{ color: '#2563eb', fontSize: 18 }} />
            ) : (
                <RightOutlined style={{ fontSize: 12, color: '#64748b' }} />
            )}
            <Text strong style={{ fontSize: 15, color: '#1e293b' }}>{item.deptName}</Text>
            
            {/* Tag trạng thái giống ảnh mẫu */}
            {item.status === 'LOCKED' && <Tag color="success" style={{borderRadius: 4}}>ĐÃ XÁC NHẬN</Tag>}
            {item.status === 'UPDATED' && <Tag color="blue" style={{borderRadius: 4}}>ĐÃ CẬP NHẬT</Tag>}
            {item.status === 'EMPTY' && <Tag color="error" style={{borderRadius: 4}}>CHƯA CẬP NHẬT</Tag>}
          </Space>
          {item.lastUpdate && (
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 22 }}>
              <ClockCircleOutlined style={{marginRight: 4}}/>
              Cập nhật lần cuối: {dayjs(item.lastUpdate).format('HH:mm DD/MM/YYYY')}
            </Text>
          )}
        </Space>
        <div style={{ backgroundColor: '#f1f5f9', padding: '2px 12px', borderRadius: 12 }}>
            <Text strong style={{ fontSize: 13, color: '#475569' }}>{item.logs.length} thao tác</Text>
        </div>
      </div>
    ),
    children: item.logs.length > 0 ? (
      <div style={{ padding: '10px 10px 0 24px' }}>
        <Timeline
          items={item.logs.map((log: any) => ({
            color: log.actionType === 'CONFIRM' ? 'green' : 'blue',
            children: (
              <div style={{ marginBottom: 4 }}>
                <Text strong style={{ color: '#334155' }}>{log.actionDetail}</Text>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  <UserOutlined style={{marginRight: 4}} />
                  {log.userFullname || log.UserFullname || "Hệ thống"} - {log.userPosition || "NV"}
                </div>
              </div>
            )
          }))}
        />
      </div>
    ) : (
      <div style={{ padding: '10px 24px', color: '#94a3b8', fontStyle: 'italic' }}>
        Chưa có thao tác nào.
      </div>
    ),
    // Tùy chỉnh Style từng Panel để nó giống "thẻ" (Card) trong ảnh mẫu
    style: {
        backgroundColor: '#fff',
        marginBottom: 12,
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
    }
  }));

  // Kiểm tra nếu báo cáo bị khóa toàn bộ
  const isGlobalLocked = reportInfo?.globalStatus?.toLowerCase().includes("khóa") || reportInfo?.GlobalStatus?.toLowerCase().includes("hoàn thành");

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      styles={{ body: { padding: 0, backgroundColor: '#f1f5f9' } }} // Nền xám nhạt cho modal
    >
      {/* Header Modal */}
      <div style={{ padding: '16px 24px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <HistoryOutlined style={{ fontSize: 18, color: '#2563eb' }} />
          <Text strong style={{ fontSize: 16 }}>Lịch sử toàn hệ thống (Audit Log)</Text>
        </Space>
        <Text type="secondary" style={{cursor: 'pointer'}} onClick={onClose}>✕</Text>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Banner thông tin báo cáo - Dải màu đỏ ở trên */}
        <div style={{ 
            backgroundColor: '#fff', 
            borderRadius: 12, 
            borderTop: '4px solid #ef4444', // Dải màu đỏ
            padding: '20px', 
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            marginBottom: 20
        }}>
          <Title level={4} style={{ margin: '0 0 4px 0' }}>{reportInfo?.reportName || "Tên báo cáo"}</Title>
          <Text type="secondary">Mã: {reportInfo?.reportCode || "N/A"} • Phân loại: EVN</Text>
          {isGlobalLocked && (
              <div style={{ marginTop: 8, color: '#ef4444', fontSize: 13, fontWeight: 500 }}>
                  <LockOutlined style={{marginRight: 4}}/> Đợt báo cáo này đã bị Admin khóa
              </div>
          )}
        </div>

        <Spin spinning={loading}>
          {finalDisplay.length > 0 ? (
            <Collapse
              ghost
              accordion
              items={collapseItems}
              expandIcon={() => null} // Ẩn icon mặc định vì mình đã tùy chỉnh trong label
              style={{ padding: 0 }}
            />
          ) : (
            <Empty description="Không có dữ liệu lịch sử" />
          )}
        </Spin>
      </div>
    </Modal>
  );
}