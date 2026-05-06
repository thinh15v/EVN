import React from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { 
  FileTextOutlined, TeamOutlined, SettingOutlined, 
  UserOutlined, BellOutlined, DownOutlined 
} from '@ant-design/icons';
// Import hook dùng chung
import { useRole } from '@/context/RoleContext';

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  // --- KẾT NỐI VỚI ROLE CONTEXT ---
  const { role, setRole, roleName, setRoleName } = useRole();

  // Cấu hình các lựa chọn trong Dropdown
  const roleItems = [
    { 
      key: 'admin', 
      label: 'Admin (Quản trị)', 
      onClick: () => { setRole('admin'); setRoleName('Admin (Quản trị)'); } 
    },
    { 
      key: 'staff', 
      label: 'Nhân viên Ban', 
      onClick: () => { setRole('staff'); setRoleName('Nhân viên Ban'); } 
    },
    { 
      key: 'leader', 
      label: 'Lãnh đạo Ban', 
      onClick: () => { setRole('leader'); setRoleName('Lãnh đạo Ban'); } 
    },
  ];

  // Hàm hiển thị tên định danh dưới Footer Sider
  const getDisplayName = (name: string) => {
    switch (name) {
      case 'Admin (Quản trị)':
        return 'Admin: Hệ thống';
      case 'Lãnh đạo Ban':
        return 'LĐ: Ban kỹ thuật';
      case 'Nhân viên Ban':
        return 'NV: Ban kỹ thuật';
      default:
        return name;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        width={260} 
        style={{ 
          backgroundColor: '#1a2332',
          height: '100vh', 
          position: 'sticky', 
          top: 0 
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <div style={{ height: 64, minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4facfe', fontSize: 20, fontWeight: 'bold' }}>
            ĐHSX SYSTEM
          </div>

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

          {/* Hiển thị vai trò dựa trên Context */}
          <div style={{ 
            padding: '20px', 
            color: '#94a3b8', 
            fontSize: 13, 
            display: 'flex', 
            alignItems: 'center',
            borderTop: '1px solid #283548'
          }}>
            <UserOutlined style={{ marginRight: 8, color: '#4ade80' }} /> 
            {getDisplayName(roleName)} 
          </div>
          
        </div>
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Danh sách Báo cáo</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            
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
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: '#2f54eb' }}>
                  GÓC NHÌN:
                </span>

                <span style={{ fontSize: 13 }}>
                  {roleName} 
                </span>

                <DownOutlined style={{ fontSize: 12, color: '#595959' }} />
              </div>
            </Dropdown>

            <BellOutlined style={{ fontSize: 18, color: '#8c8c8c' }} />
          </div>
        </Header>

        <Content style={{ margin: '24px', padding: '24px', background: '#f8fafc', borderRadius: 8 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;