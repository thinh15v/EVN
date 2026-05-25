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
      // Thêm ": any" vào đây để báo cho TypeScript biết bỏ qua việc check type của res
      const res: any = await ReportService.getReportTimeline(reportId);
      
      // Hỗ trợ cả camelCase và PascalCase từ Backend
      const eventsList = res?.data?.events || res?.data?.Events || [];
      if (Array.isArray(eventsList)) {
        setTimelineData(eventsList);
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

  // --- LOGIC PHÂN NHÓM THÔNG MINH ---
  
  // 1. Trích xuất tất cả tên Ban xuất hiện trong Timeline (loại bỏ Ban Giám Đốc)
  const deptsInTimeline = Array.from(new Set(safeTimeline
    .map(log => (log.deptName || log.DeptName || "").trim())
    .filter(name => name && name.toLowerCase() !== "ban giám đốc")
  ));

  // 2. Hợp nhất danh sách Ban được giao và các Ban có trong log để không sót dữ liệu
  const allDeptNames = Array.from(new Set([
    ...safeAssignments.map(a => (a.deptName || a.DeptName || "").trim()),
    ...deptsInTimeline
  ])).filter(name => name !== "");

  // 3. Xây dựng danh sách hiển thị cho từng Ban
  const displayList = allDeptNames.map(deptName => {
    const deptNameLower = deptName.toLowerCase();
    
    // Lọc log: Khớp tuyệt đối hoặc chứa cụm từ (giúp "Ban Kỹ Thuật" khớp "Lãnh đạo Ban Kỹ Thuật")
    const logsOfDept = safeTimeline.filter(log => {
      const logDept = (log.deptName || log.DeptName || "").trim().toLowerCase();
      return logDept === deptNameLower || logDept.includes(deptNameLower) || deptNameLower.includes(logDept);
    });

    const assignInfo = safeAssignments.find(a => 
      (a.deptName || a.DeptName || "").trim().toLowerCase() === deptNameLower
    );

    const hasUpdated = logsOfDept.some(l => ["UPLOAD", "CONFIRM", "UPDATE"].includes(l.actionType));

    return {
      deptName,
      status: assignInfo?.isLocked || assignInfo?.IsLocked ? 'LOCKED' : (hasUpdated ? 'UPDATED' : 'EMPTY'),
      logs: logsOfDept,
      lastUpdate: logsOfDept.length > 0 ? logsOfDept[0].actionTime : null,
      isAssigned: !!assignInfo 
    };
  }).filter(item => item.logs.length > 0 || item.isAssigned);

  // 4. Lọc log Admin (Chỉ những gì thuộc Ban Giám Đốc hoặc không rõ định danh)
  const adminLogs = safeTimeline.filter(log => {
    const logDept = (log.deptName || log.DeptName || "").trim().toLowerCase();
    return !logDept || logDept === "ban giám đốc" || logDept.includes("hệ thống");
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
  
  // Sắp xếp các Ban theo thời gian cập nhật mới nhất
  finalDisplay.push(...displayList.sort((a, b) => 
    dayjs(b.lastUpdate).unix() - dayjs(a.lastUpdate).unix()
  ));

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
            
            {item.status === 'LOCKED' && <Tag color="success" style={{borderRadius: 4, margin: 0}}>ĐÃ XÁC NHẬN</Tag>}
            {item.status === 'UPDATED' && <Tag color="blue" style={{borderRadius: 4, margin: 0}}>ĐÃ CẬP NHẬT</Tag>}
            {item.status === 'EMPTY' && <Tag color="error" style={{borderRadius: 4, margin: 0}}>CHƯA CẬP NHẬT</Tag>}
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
                  {/* Khớp với DTO: FullName và Position */}
                  {log.fullName || log.FullName || "Hệ thống"} - {log.position || log.Position || "NV"}
                </div>
              </div>
            )
          }))}
        />
      </div>
    ) : (
      <div style={{ padding: '10px 24px', color: '#94a3b8', fontStyle: 'italic' }}>
        Chưa có thao tác nào từ đơn vị này.
      </div>
    ),
    style: {
        backgroundColor: '#fff',
        marginBottom: 12,
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
    }
  }));

  const isGlobalLocked = (reportInfo?.globalStatus || reportInfo?.GlobalStatus || "").toLowerCase().includes("khóa");

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={750}
      centered
      styles={{ body: { padding: 0, backgroundColor: '#f8fafc' } }}
    >
      <div style={{ padding: '16px 24px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <HistoryOutlined style={{ fontSize: 18, color: '#2563eb' }} />
          <Text strong style={{ fontSize: 16 }}>Lịch sử toàn hệ thống (Audit Log)</Text>
        </Space>
      </div>

      <div style={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ 
            backgroundColor: '#fff', 
            borderRadius: 12, 
            borderTop: '4px solid #ef4444', 
            padding: '20px', 
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: 20
        }}>
          <Title level={4} style={{ margin: '0 0 4px 0' }}>{reportInfo?.reportName || reportInfo?.name || "Báo cáo"}</Title>
          <Text type="secondary">Mã: {reportInfo?.reportCode || reportInfo?.id || "N/A"} • Hệ thống: EVN</Text>
          {isGlobalLocked && (
              <div style={{ marginTop: 8, color: '#ef4444', fontSize: 13, fontWeight: 500 }}>
                  <LockOutlined style={{marginRight: 4}}/> Đợt báo cáo này hiện đang bị khóa
              </div>
          )}
        </div>

        <Spin spinning={loading}>
          {finalDisplay.length > 0 ? (
            <Collapse
              ghost
              accordion
              items={collapseItems}
              expandIcon={() => null} 
              style={{ padding: 0 }}
            />
          ) : (
            <Empty description="Không tìm thấy dữ liệu lịch sử" />
          )}
        </Spin>
      </div>
    </Modal>
  );
}