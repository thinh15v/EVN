import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Progress, Space, Typography, ConfigProvider, message } from 'antd';
import { SearchOutlined, PlusOutlined, HistoryOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ReportService } from '@/services/ReportService'; // Import cái Service vừa tạo

const { Text } = Typography;

export default function ReportList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Dùng useEffect để gọi API khi trang vừa load xong
  useEffect(() => {
    fetchReportData();
  }, []);

  // 2. Hàm xử lý logic gọi API
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const result = await ReportService.getReports(); // Gọi Service chuẩn chỉnh

      if (result && result.success) {
        // Ánh xạ dữ liệu từ C# sang định dạng Table Ant Design cần
        const formattedData = result.data.map((item: any) => ({
          key: item.reportId,
          id: item.reportCode,
          name: item.reportName,
          type: item.reportType,
          deadline: item.deadline ? dayjs(item.deadline).format('YYYY-MM-DD HH:mm') : 'Chưa có hạn',
          percent: item.totalAssigned > 0 ? Math.round((item.totalCompleted / item.totalAssigned) * 100) : 0,
          count: `${item.totalCompleted}/${item.totalAssigned}`, // Hiển thị kiểu 1/3
          status: item.globalStatus,
        }));
        
        setData(formattedData);
      } else {
        message.error(result?.message || 'Không thể lấy dữ liệu báo cáo!');
      }
    } catch (error) {
      message.error('Mất kết nối đến máy chủ API!');
    } finally {
      setLoading(false);
    }
  };

  // 3. Cấu hình cột Table (Giữ nguyên như lúc nãy bạn ưng ý)
  const columns = [
    {
      title: <Text style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>THÔNG TIN BÁO CÁO</Text>,
      dataIndex: 'info',
      key: 'info',
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: 14 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            Mã: {record.id} • Phân loại: <span style={{ color: '#3b82f6', fontWeight: 600 }}>{record.type}</span>
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
    {
      title: <Text style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>TIẾN ĐỘ</Text>,
      key: 'progress',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Progress percent={record.percent} size="small" showInfo={false} strokeColor="#22c55e" style={{ width: 80, margin: 0 }} />
          <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>{record.count}</span>
        </div>
      ),
    },
    {
      title: <Text style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>TRẠNG THÁI</Text>,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '#d97706'; let bg = '#fffbeb'; let border = '#fde68a';
        if (status === 'Đã hoàn thành') { color = '#16a34a'; bg = '#f0fdf4'; border = '#bbf7d0'; } 
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
      render: () => (
        <Space size="large">
          <HistoryOutlined style={{ fontSize: 18, color: '#94a3b8', cursor: 'pointer' }} />
          <Button style={{ backgroundColor: '#1e293b', color: 'white', borderRadius: 8, fontWeight: 600, border: 'none', height: 38 }}>
            Quản lý & Tổng hợp
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Input 
          placeholder="Tìm kiếm tên báo cáo, mã..." 
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
          style={{ width: 320, borderRadius: 8, height: 42, backgroundColor: '#ffffff', border: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
        />
        <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#2563eb', borderRadius: 8, height: 42, fontWeight: 600, boxShadow: 'none' }}>
          Khởi tạo đợt báo cáo mới
        </Button>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <ConfigProvider
          theme={{
            components: { Table: { headerBg: '#ffffff', headerColor: '#64748b', headerSplitColor: 'transparent' } }
          }}
        >
          <Table columns={columns} dataSource={data} pagination={false} loading={loading} />
        </ConfigProvider>
      </div>
    </div>
  );
}