import React, { useEffect, useState } from 'react';
import { Modal, Collapse, Tag, Typography, Space, Spin, Empty, Timeline } from 'antd';
import { 
  HistoryOutlined, 
  SafetyCertificateOutlined, 
  RightOutlined,
  UserOutlined,
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
      // ĐÃ SỬA: Lấy dữ liệu từ res.data.events theo đúng JSON bạn gửi
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

  // 1. Nhóm các log theo Ban được phân công
  const displayList = safeAssignments.map(assign => {
    const deptName = assign.deptName || assign.DeptName;
    const logsOfDept = safeTimeline.filter(log => 
      // ĐÃ SỬA: Kiểm tra trường 'deptName' (viết thường chữ cái đầu) từ JSON
      (log.deptName || log.DeptName) === deptName
    );

    return {
      deptName,
      status: assign.isLocked || assign.IsLocked ? 'LOCKED' : 'PENDING',
      logs: logsOfDept,
      lastUpdate: logsOfDept.length > 0 ? logsOfDept[0].actionTime : null
    };
  });

  // 2. Nhóm Log của Admin (Những log có deptName là "Ban Giám Đốc" hoặc null)
  const adminLogs = safeTimeline.filter(log => {
    const logDept = log.deptName || log.DeptName;
    return !logDept || logDept === "Ban Giám Đốc" || !safeAssignments.some(a => (a.deptName || a.DeptName) === logDept);
  });
  
  // Chỉ thêm nhóm Admin vào danh sách hiển thị nếu có log
  const finalDisplay = [...displayList];
  if (adminLogs.length > 0) {
    finalDisplay.unshift({
      deptName: "Hệ thống & Ban Quản trị",
      status: 'ADMIN',
      logs: adminLogs,
      lastUpdate: adminLogs[0].actionTime
    });
  }

  const collapseItems = finalDisplay.map((item, index) => ({
    key: index.toString(),
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Space orientation="vertical" size={0}>
          <Space>
            {item.status === 'ADMIN' && <SafetyCertificateOutlined style={{ color: '#2563eb' }} />}
            <Text strong style={{ fontSize: 15 }}>{item.deptName}</Text>
            {item.status === 'LOCKED' && <Tag color="success">ĐÃ XÁC NHẬN</Tag>}
          </Space>
          {item.lastUpdate && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Thao tác lần cuối: {dayjs(item.lastUpdate).format('HH:mm DD/MM/YYYY')}
            </Text>
          )}
        </Space>
        <Tag color={item.logs.length > 0 ? "blue" : "default"} style={{ borderRadius: 10 }}>
          {item.logs.length} thao tác
        </Tag>
      </div>
    ),
    children: item.logs.length > 0 ? (
      <div style={{ paddingLeft: 10 }}>
        <Timeline
          items={item.logs.map((log: any) => ({
            children: (
              <div style={{ marginBottom: 8 }}>
                <Text strong style={{ display: 'block' }}>{log.actionDetail}</Text>
                <Space style={{ fontSize: 12, color: '#64748b' }}>
                  <UserOutlined />
                  <span>{log.fullName || "Hệ thống"} {log.position ? `(${log.position})` : ''}</span>
                </Space>
              </div>
            )
          }))}
        />
      </div>
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu thao tác" />
    )
  }));

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={750}
      centered
      styles={{ body: { padding: 0, backgroundColor: '#f8fafc', borderRadius: 12, overflow: 'hidden' } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
        <Space style={{ color: '#2563eb' }}>
          <HistoryOutlined style={{ fontSize: 20 }} />
          <span style={{ fontSize: 16, fontWeight: 700 }}>Lịch sử toàn hệ thống (Audit Log)</span>
        </Space>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <Title level={4} style={{ margin: 0 }}>{reportInfo?.reportName || reportInfo?.name}</Title>
          <Text type="secondary">Mã: {reportInfo?.reportCode || reportInfo?.id}</Text>
        </div>

        <Spin spinning={loading}>
          <Collapse
            accordion
            items={collapseItems}
            expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} />}
            style={{ backgroundColor: 'transparent', border: 'none' }}
          />
        </Spin>
      </div>
    </Modal>
  );
}