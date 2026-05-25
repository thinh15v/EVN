// src/components/Layout/AppLayout.tsx
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Badge, Button, message, Spin } from 'antd';
import { 
  FileTextOutlined, TeamOutlined, SettingOutlined, 
  BellOutlined, DownOutlined, LeftOutlined, LoadingOutlined
} from '@ant-design/icons';
import { useRole } from '@/context/RoleContext';
import { useRouter } from 'next/router';
import { UserCheck } from 'lucide-react';
import { AuthService } from '@/services/AuthService';

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { role, setRole, currentUser, setCurrentUser } = useRole();
  const router = useRouter();
  
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // State lưu tên báo cáo động lấy từ trang con
  const [reportTitle, setReportTitle] = useState('');

  // Kiểm tra xem có đang ở các trang chi tiết (nộp/duyệt) hay không
  const isSubPage = router.pathname.includes('/submit') || 
                    router.pathname.includes('/approve') || 
                    (router.pathname.includes('/report/[id]') && router.pathname !== '/report');

  /**
   * EFFECT: Lắng nghe sự kiện cập nhật tên báo cáo từ các trang con
   */
  useEffect(() => {
    const handleUpdateTitle = () => {
      const newTitle = localStorage.getItem('currentReportName');
      if (newTitle) {
        setReportTitle(newTitle);
      }
    };

    // Kiểm tra ngay khi mount hoặc khi chuyển trang
    handleUpdateTitle();

    // Đăng ký sự kiện 'updateReportTitle' (được dispatch từ trang con)
    window.addEventListener('updateReportTitle', handleUpdateTitle);
    
    // Xóa tên báo cáo khi quay về trang danh sách chính
    if (!isSubPage) {
      setReportTitle('');
      localStorage.removeItem('currentReportName');
    }

    return () => window.removeEventListener('updateReportTitle', handleUpdateTitle);
  }, [router.pathname, isSubPage]);

  /**
   * Logic chuyển đổi Role và đăng nhập lại để lấy Token mới
   */
  const handleRoleChange = async (newRole: string) => {
    setIsSwitchingRole(true);
    
    let targetUsername = '';
    if (newRole === 'admin') targetUsername = 'admin';
    else if (newRole === 'leader') targetUsername = 'lanhdaob02';
    else if (newRole === 'staff') targetUsername = 'nhanvienb02';

    try {
      const res = await AuthService.loginMock(targetUsername);

      if (res.success) {
        setRole(newRole);
        setCurrentUser(res.data); 

        
        // Chuyển hướng về trang danh sách để làm mới dữ liệu
        router.push('/report');
      } else {
        messageApi.error(res.message || "Lỗi chuyển tài khoản!");
      }
    } catch (error) {
      messageApi.error("Hệ thống đang bận, vui lòng thử lại sau.");
    } finally {
      setIsSwitchingRole(false);
    }
  };

  const roleItems = [
    { key: 'admin', label: 'Admin (Quản trị)', onClick: () => handleRoleChange('admin') },
    { key: 'staff', label: 'Nhân viên Ban', onClick: () => handleRoleChange('staff') },
    { key: 'leader', label: 'Lãnh đạo Ban', onClick: () => handleRoleChange('leader') },
  ];

  return (
    <>
      {contextHolder}
      <style jsx global>{`
        html, body {
          margin: 0 !important; padding: 0 !important;
          height: 100% !important; overflow: hidden !important;
        }
        #__next { height: 100%; }
      `}</style>

      {/* Lớp phủ Loading khi đang chuyển đổi tài khoản */}
      {isSwitchingRole && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} description="Đang chuyển đổi tài khoản..." size="large" />
        </div>
      )}

      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        {/* SIDEBAR */}
        <Sider width={260} style={{ backgroundColor: '#1a2332', border: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4facfe', fontSize: 20, fontWeight: 'bold' }}>
              ĐHSX SYSTEM
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[
                  router.pathname.includes('/department') ? '2' : 
                  router.pathname.includes('/report') ? '1' : ''
                ]}
                style={{ backgroundColor: '#1a2332', border: 'none' }}
                items={[
                  { key: '1', icon: <FileTextOutlined />, label: 'Quản lý Báo cáo', onClick: () => router.push('/report') },
                  { key: '2', icon: <TeamOutlined />, label: 'Quản lý Ban', onClick: () => router.push('/department') },
                  { key: '3', icon: <SettingOutlined />, label: 'Cài đặt hệ thống' },
                ]}
              />
            </div>
            
            {/* Hiển thị Tên thật và Phòng ban ở Sidebar */}
            <div style={{ padding: '20px', color: '#94a3b8', fontSize: 13, display: 'flex', alignItems: 'center', borderTop: '1px solid #283548' }}>
              <UserCheck size={20} color="#4ade80" style={{ marginRight: 12 }} /> 
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold', color: '#e2e8f0', fontSize: 14 }}>
                  {currentUser?.fullName || currentUser?.FullName || 'Đang tải...'}
                </span>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  {currentUser?.department?.deptName || currentUser?.Department?.DeptName || 'Quản trị hệ thống'}
                </span>
              </div>
            </div>
          </div>
        </Sider>

        {/* MAIN LAYOUT */}
        <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header style={{ 
            background: '#fff', padding: '0 24px', height: 64, 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            boxShadow: '0 1px 4px rgba(0,21,41,.08)', zIndex: 10 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {isSubPage ? (
                <>
                  <Button 
                    type="link" 
                    icon={<LeftOutlined />} 
                    onClick={() => router.push('/report')} 
                    style={{ fontWeight: 600, fontSize: 16, paddingLeft: 0, marginRight: 16 }}
                  >
                    Quay lại
                  </Button>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
                    {/* Ưu tiên hiển thị tên báo cáo động, nếu chưa có thì hiện fallback theo đường dẫn */}
                    {reportTitle || (router.pathname.includes('/approve') ? 'Phê duyệt Báo cáo' : 'Chi tiết Báo cáo')}
                  </h2>
                </>
              ) : (
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Danh sách Báo cáo</h2>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Dropdown menu={{ items: roleItems }} trigger={['click']} placement="bottomRight" disabled={isSwitchingRole}>
                <div style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f5f5f5', 
                  padding: '4px 10px', borderRadius: 6, border: '1px solid #d9d9d9', 
                  height: 32, cursor: isSwitchingRole ? 'not-allowed' : 'pointer' 
                }}>
                  <span style={{ fontSize: 13, fontWeight: 'bold', color: '#2f54eb' }}>GÓC NHÌN:</span>
                  <span style={{ fontSize: 13, fontWeight: 'bold' }}>
                    {role === 'admin' ? 'Admin (Quản trị)' : 
                     role === 'leader' ? 'Lãnh đạo Ban' : 
                     'Nhân viên Ban'}
                  </span>
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