import React, { useState } from 'react'; // <-- Thêm useState ở đây
import { Layout, Menu, Dropdown } from 'antd'; // <-- Thêm Dropdown từ antd
import { FileTextOutlined, TeamOutlined, SettingOutlined, UserOutlined, BellOutlined, DownOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  // --- THÊM PHẦN NÀY ĐỂ QUẢN LÝ TRẠNG THÁI GÓC NHÌN ---
  const [currentRole, setCurrentRole] = useState('Admin (Quản trị)');

  const roleItems = [
    { key: 'admin', label: 'Admin (Quản trị)', onClick: () => setCurrentRole('Admin (Quản trị)') },
    { key: 'staff', label: 'Nhân viên Ban', onClick: () => setCurrentRole('Nhân viên Ban') },
    { key: 'leader', label: 'Lãnh đạo Ban', onClick: () => setCurrentRole('Lãnh đạo Ban') },
  ];
  // ----------------------------------------------------

  const getDisplayName = (role: string) => {
    switch (role) {
      case 'Admin (Quản trị)':
        return 'Admin: Hệ thống';
      case 'Lãnh đạo Ban':
        return 'LĐ: Ban kỹ thuật';
      case 'Nhân viên Ban':
        return 'NV: Ban kỹ thuật';
      default:
        return role;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 1. Ghim Sider luôn ở màn hình (100vh và sticky) */}
      <Sider 
        width={260} 
        style={{ 
          backgroundColor: '#1a2332',
          height: '100vh', 
          position: 'sticky', 
          top: 0 
        }}
      >
        {/* Tạo container dùng Flexbox dọc */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* PHẦN 1: LOGO */}
          <div style={{ height: 64, minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4facfe', fontSize: 20, fontWeight: 'bold' }}>
            ĐHSX SYSTEM
          </div>

          {/* PHẦN 2: MENU (Dùng flex: 1 để tự động đẩy Footer xuống đáy) */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ backgroundColor: '#1a2332', borderRight: 0 }}
              items={[
                { key: '1', icon: <FileTextOutlined />, label: 'Quản lý Báo cáo', style: { margin: '8px 0', backgroundColor: '#3366ff', color: 'white', borderRadius: '4px' } },
                { key: '2', icon: <TeamOutlined />, label: 'Quản lý Ban' },
                { key: '3', icon: <SettingOutlined />, label: 'Cài đặt hệ thống' },
              ]}
            />
          </div>

          {/* PHẦN 3: FOOTER (Luôn dính chặt ở đáy do bị Menu đẩy xuống) */}
          <div style={{ 
            padding: '20px', 
            color: '#94a3b8', 
            fontSize: 13, 
            display: 'flex', 
            alignItems: 'center',
            borderTop: '1px solid #283548' // Thêm cái viền mờ ngăn cách cho xịn
          }}>
            <UserOutlined style={{ marginRight: 8, color: '#4ade80' }} /> 
            {getDisplayName(currentRole)} {/* Hiển thị tên Góc nhìn đang chọn ở đây */}
          </div>
          
        </div>
      </Sider>

      <Layout>
        {/* Header trắng có bóng đổ nhẹ */}
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Danh sách Báo cáo</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            
            {/* --- BỌC THẺ BADGE VÀO TRONG DROPDOWN CỦA ANTD --- */}
            <Dropdown menu={{ items: roleItems }} trigger={['click']} placement="bottomRight">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#f5f5f5',
                  padding: '4px 10px',        
                  borderRadius: 6,            
                  border: '1px solid #d9d9d9',
                  lineHeight: 1,              
                  height: 32,
                  cursor: 'pointer' // Thêm hình bàn tay khi di chuột vào
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: '#2f54eb' }}>
                  GÓC NHÌN:
                </span>

                <span style={{ fontSize: 13 }}>
                  {currentRole} {/* <-- Hiển thị tên Góc nhìn đang chọn */}
                </span>

                <DownOutlined style={{ fontSize: 12, color: '#595959' }} />
              </div>
            </Dropdown>

            {/* ICON CHUÔNG */}
            <BellOutlined style={{ fontSize: 18, color: '#8c8c8c' }} />
          </div>
        </Header>

        {/* Nội dung chính nền xám nhạt */}
        <Content style={{ margin: '24px', padding: '24px', background: '#f8fafc', borderRadius: 8 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;