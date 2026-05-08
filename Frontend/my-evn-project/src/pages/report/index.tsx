import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Progress, Space, Typography, message } from 'antd';
import { SearchOutlined, PlusOutlined, HistoryOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ReportService } from '@/services/ReportService';
import CreateReportModal from '@/components/Report/CreateReportModal'; 
import AuditLogModal from '@/components/Report/AuditLogModal'; // Đảm bảo đúng đường dẫn
import { useRouter } from 'next/router';
import { useRole } from '@/context/RoleContext';

const { Text } = Typography;

export default function ReportList() {
  const { role } = useRole(); 
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- FIX LỖI BIẾN Ở ĐÂY ---
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [selectedReportInfo, setSelectedReportInfo] = useState<any>(null);

  useEffect(() => {
    fetchReportData();
  }, [role]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let result;
      if (role === 'admin') {
        result = await ReportService.getReports();
      } else {
        result = await ReportService.getReportsByDept(2);
      }

      if (result && result.success) {
        const formattedData = result.data.map((item: any) => ({
          key: item.reportId,
          id: item.reportCode,
          name: item.reportName,
          type: item.reportType,
          deadline: item.deadline ? dayjs(item.deadline).format('YYYY-MM-DD HH:mm') : 'Chưa có hạn',
          percent: item.totalAssigned > 0 ? Math.round((item.totalCompleted / item.totalAssigned) * 100) : 0,
          count: `${item.totalCompleted || 0}/${item.totalAssigned || 0}`,
          status: role === 'admin' ? item.globalStatus : (item.assignStatus || 'CHƯA CẬP NHẬT'),
        }));
        setData(formattedData);
      } else {
        message.error(result?.message || 'Không thể lấy dữ liệu báo cáo!');
        setData([]);
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      message.error('Mất kết nối đến máy chủ API!');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: <Text style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>THÔNG TIN BÁO CÁO</Text>,
      key: 'info',
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: 14 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            Mã: {record.id} {record.type && (
              <span> • Phân loại: <span style={{ color: '#3b82f6', fontWeight: 600 }}>{record.type}</span></span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: <Text style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>HẠN CHỐT</Text>,
      dataIndex: 'deadline',
      key: 'deadline',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569', fontWeight: 500 }}>
           <ClockCircleOutlined style={{ color: '#94a3b8' }} /> {text}
        </div>
      ),
    },
    ...(role === 'admin' ? [{
      title: <Text style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>TIẾN ĐỘ</Text>,
      key: 'progress',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Progress percent={record.percent} size="small" showInfo={false} strokeColor="#22c55e" style={{ width: 80, margin: 0 }} />
          <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>{record.count}</span>
        </div>
      ),
    }] : []),
    {
      title: <Text style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>TRẠNG THÁI</Text>,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '#d97706'; let bg = '#fffbeb'; let border = '#fde68a';
        if (status === 'Đã hoàn thành' || status === 'Đã cập nhật') { color = '#16a34a'; bg = '#f0fdf4'; border = '#bbf7d0'; } 
        else if (status === 'Quá hạn') { color = '#dc2626'; bg = '#fef2f2'; border = '#fecaca'; }

        return (
          <Tag style={{ color, backgroundColor: bg, borderColor: border, fontWeight: 'bold', padding: '4px 12px', borderRadius: 6 }}>
            {status?.toUpperCase()}
          </Tag>
        );
      },
    },
{
  title: <Text style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>THAO TÁC</Text>,
  key: 'action',
  align: 'right' as const,
  render: (_: any, record: any) => {
    // 1. Xác định cấu hình nút
    const getActionConfig = () => {
      if (role === 'admin') {
        return { text: 'Quản lý & Tổng hợp', color: '#1e293b', url: `/report/${record.key}` };
      }
      if (role === 'leader') {
        return { text: 'Phê duyệt số liệu', color: '#1e293b', url: `/report/approve/${record.key}` };
      }
      // Dòng bạn đang bị lỗi
      return { text: 'Tải file báo cáo', color: '#1e293b', url: `/report/submit/${record.key}` };
    };

    const config = getActionConfig();

    return (
      <Space size="large">
        <HistoryOutlined 
          style={{ fontSize: 18, color: '#94a3b8', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedReportId(Number(record.key)); 
            setSelectedReportInfo({ reportName: record.name, reportCode: record.id });
            setIsAuditModalOpen(true);
          }} 
        />
        <Button 
          type="primary"
          style={{ 
            backgroundColor: config.color, 
            borderRadius: 8, 
            fontWeight: 600, 
            border: 'none', 
            height: 38 
          }}
          onClick={(e) => {
            // NGĂN CHẶN XUNG ĐỘT SỰ KIỆN
            e.preventDefault();
            e.stopPropagation();
            
            console.log("Đang chuyển hướng tới:", config.url);

            if (role === 'leader') {
              router.push({
                pathname: config.url,
                query: { deptId: 2 }
              });
            } else {
              // Đối với Staff và Admin
              router.push(config.url);
            }
          }}
        >
          {config.text}
        </Button>
      </Space>
    );
  },
}
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Input 
          placeholder="Tìm kiếm tên báo cáo, mã..." 
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
          style={{ width: 320, borderRadius: 8, height: 42, backgroundColor: '#ffffff', border: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
        />
        
        {role === 'admin' && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            style={{ backgroundColor: '#2563eb', borderRadius: 8, height: 42, fontWeight: 600, boxShadow: 'none' }}
            onClick={() => setIsModalOpen(true)}
          >
            Khởi tạo đợt báo cáo mới
          </Button>
        )}
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <Table columns={columns} dataSource={data} pagination={false} loading={loading} />
      </div>

      <CreateReportModal 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        onSuccess={fetchReportData} 
      />

      {/* --- ĐÃ ĐỒNG BỘ TÊN BIẾN Ở ĐÂY --- */}
      {selectedReportId && (
        <AuditLogModal 
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        reportId={selectedReportId!}
        reportInfo={selectedReportInfo}
        currentAssignments={[]} // <--- TRUYỀN DANH SÁCH BAN Ở ĐÂY
      />
      )}
    </div>
  );
}