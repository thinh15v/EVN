import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Progress, Space, Typography, ConfigProvider, message } from 'antd';
import { SearchOutlined, PlusOutlined, HistoryOutlined, ClockCircleOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ReportService } from '@/services/ReportService';
import CreateReportModal from '@/components/Report/CreateReportModal'; 
import { useRouter } from 'next/router';
import { useRole } from '@/context/RoleContext';

const { Text } = Typography;

export default function ReportList() {
  const { role } = useRole(); // Lấy góc nhìn từ Context dùng chung
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tự động gọi lại API khi Góc nhìn (role) thay đổi
  useEffect(() => {
    fetchReportData();
  }, [role]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let result;
      // KIỂM TRA VAI TRÒ ĐỂ GỌI API PHÙ HỢP
      if (role === 'admin') {
        result = await ReportService.getReports();
      } else {
        // Mặc định gọi API lấy báo cáo của Ban Kỹ thuật (ID = 2)
        result = await ReportService.getReportsByDept(2);
      }

      if (result && result.success) {
        const formattedData = result.data.map((item: any) => ({
          key: item.reportId,
          id: item.reportCode,
          name: item.reportName,
          type: item.reportType,
          deadline: item.deadline ? dayjs(item.deadline).format('YYYY-MM-DD HH:mm') : 'Chưa có hạn',
          // Dữ liệu cho Admin
          percent: item.totalAssigned > 0 ? Math.round((item.totalCompleted / item.totalAssigned) * 100) : 0,
          count: `${item.totalCompleted || 0}/${item.totalAssigned || 0}`,
          // Trạng thái: Lấy trạng thái tổng nếu là Admin, lấy trạng thái gán nếu là Ban
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
            Mã: {record.id} {record.type && `• Phân loại: ${record.type}`}
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
    // CHỈ HIỂN THỊ CỘT TIẾN ĐỘ NẾU LÀ ADMIN
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
    // 1. Hàm xác định tên nút dựa trên role
    const renderButtonText = () => {
      switch (role) {
        case 'admin':
          return 'Quản lý & Tổng hợp';
        case 'leader':
          return 'Phê duyệt số liệu'; // Text dành cho Lãnh đạo
        case 'staff':
        default:
          return 'Tải file báo cáo';  // Text dành cho Nhân viên
      }
    };

    return (
      <Space size="large">
        <HistoryOutlined style={{ fontSize: 18, color: '#94a3b8', cursor: 'pointer' }} />
        <Button 
          style={{ 
            backgroundColor: '#1e293b', 
            color: 'white', 
            borderRadius: 8, 
            fontWeight: 600, 
            border: 'none', 
            height: 38 
          }}
          onClick={() => router.push(`/report/${record.key}`)} 
        >
          {renderButtonText()}
        </Button>
      </Space>
    );
  },
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
        
        {/* CHỈ ADMIN MỚI THẤY NÚT KHỞI TẠO */}
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
    </div>
  );
}