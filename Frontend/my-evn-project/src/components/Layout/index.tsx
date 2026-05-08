import React from 'react';
import { Layout, Menu, Dropdown, Badge, Button } from 'antd';
import { 
  FileTextOutlined, TeamOutlined, SettingOutlined, 
  BellOutlined, DownOutlined, LeftOutlined 
} from '@ant-design/icons';
import { useRole } from '@/context/RoleContext';
import { useRouter } from 'next/router';
import { UserCheck } from 'lucide-react';

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { role, setRole, roleName, setRoleName } = useRole();
  const router = useRouter();

  // 1. KIỂM TRA TRẠNG THÁI TRANG HIỆN TẠI
  // Nếu path có chứa 'submit' hoặc 'approve' hoặc là trang chi tiết [id]
  const isSubPage = router.pathname.includes('/submit') || 
                    router.pathname.includes('/approve') || 
                    (router.pathname.includes('/report/[id]') && router.pathname !== '/report');

  const handleRoleChange = (newRole: string, newRoleName: string) => {
    setRole(newRole);
    setRoleName(newRoleName);
    router.push('/report'); 
  };

  const roleItems = [
    { key: 'admin', label: 'Admin (Quản trị)', onClick: () => handleRoleChange('admin', 'Admin (Quản trị)') },
    { key: 'staff', label: 'Nhân viên Ban', onClick: () => handleRoleChange('staff', 'Nhân viên Ban') },
    { key: 'leader', label: 'Lãnh đạo Ban', onClick: () => handleRoleChange('leader', 'Lãnh đạo Ban') },
  ];

  const getDisplayName = (name: string) => {
    switch (name) {
      case 'Admin (Quản trị)': return 'Admin: Hệ thống';
      case 'Lãnh đạo Ban': return 'LĐ: Ban kỹ thuật';
      case 'Nhân viên Ban': return 'NV: Ban kỹ thuật';
      default: return name;
    }
  };

  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0 !important; padding: 0 !important;
          height: 100% !important; overflow: hidden !important;
        }
        #__next { height: 100%; }
      `}</style>

      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Sider width={260} style={{ backgroundColor: '#1a2332', height: '100vh', border: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4facfe', fontSize: 20, fontWeight: 'bold' }}>
              ĐHSX SYSTEM
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[router.pathname.includes('/report') ? '1' : '']}
                style={{ backgroundColor: '#1a2332', border: 'none' }}
                items={[
                  { key: '1', icon: <FileTextOutlined />, label: 'Quản lý Báo cáo', onClick: () => router.push('/report') },
                  { key: '2', icon: <TeamOutlined />, label: 'Quản lý Ban' },
                  { key: '3', icon: <SettingOutlined />, label: 'Cài đặt hệ thống' },
                ]}
              />
            </div>
            <div style={{ padding: '20px', color: '#94a3b8', fontSize: 13, display: 'flex', alignItems: 'center', borderTop: '1px solid #283548' }}>
              <UserCheck size={16} color="#4ade80" style={{ marginRight: 8 }} /> 
              {getDisplayName(roleName)} 
            </div>
          </div>
        </Sider>

        <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header style={{ 
            background: '#fff', padding: '0 24px', height: 64, 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            boxShadow: '0 1px 4px rgba(0,21,41,.08)', zIndex: 10 
          }}>
            {/* 2. THAY ĐỔI LAYOUT HEADER DỰA TRÊN TRANG CON */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {isSubPage ? (
                <>
                  <Button type="link" icon={<LeftOutlined />} onClick={() => router.push('/report')} style={{ fontWeight: 600, fontSize: 16, paddingLeft: 0, marginRight: 16 }}>Quay lại</Button>
                  {/* Tên trang con có thể lấy động từ context hoặc giữ text mặc định */}
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
                    {router.pathname.includes('/approve') ? 'Phê duyệt Báo cáo' : 'Báo cáo vận hành hệ thống'}
                  </h2>
                </>
              ) : (
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Danh sách Báo cáo</h2>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Dropdown menu={{ items: roleItems }} trigger={['click']} placement="bottomRight">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f5f5f5', padding: '4px 10px', borderRadius: 6, border: '1px solid #d9d9d9', height: 32, cursor: 'pointer' }}>
                  <span style={{ fontSize: 13, fontWeight: 'bold', color: '#2f54eb' }}>GÓC NHÌN:</span>
                  <span style={{ fontSize: 13, fontWeight: 'bold' }}>{roleName}</span>
                  <DownOutlined style={{ fontSize: 12, fontWeight: 'bold', color: '#595959' }} />
                </div>
              </Dropdown>
              <Badge dot offset={[-2, 4]}>
                <BellOutlined style={{ fontSize: 20, color: '#8c8c8c', cursor: 'pointer' }} />
              </Badge>
            </div>
          </Header>

          <Content style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc' }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AppLayout;