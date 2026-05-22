import React from 'react';
import { Button, Input, Typography, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useRole } from '@/context/RoleContext';
import { useDepartment } from '@/hooks/useDepartment';
import DepartmentFormModal from '@/components/Department/DepartmentFormModal';
import DepartmentTable from '@/components/Department/DepartmentTable';

const { Title } = Typography;

export default function DepartmentPage() {
  const { role } = useRole();
  const {
    filteredDepartments,
    loading,
    searchText,
    setSearchText,
    isModalOpen,
    editingDepartment,
    handleOpenCreate,
    handleEditDepartment,
    deleteDepartment,
    handleModalSuccess,
    setIsModalOpen,
    setEditingDepartment,
  } = useDepartment();

  const handleDelete = async (id: number) => {
    if (role !== 'admin') {
      message.error('Chỉ Admin mới được xóa Ban.');
      return;
    }

    await deleteDepartment(id);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Quản lý Ban</Title>
          <div style={{ color: '#64748b' }}>Danh sách Ban, tạo mới, sửa, xóa và tìm kiếm nhanh.</div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Input
            placeholder="Tìm kiếm mã, tên hoặc mô tả"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 320, borderRadius: 8, height: 42 }}
            allowClear
          />

          {role === 'admin' && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate} style={{ borderRadius: 8 }}>
              Tạo Ban mới
            </Button>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <DepartmentTable
          data={filteredDepartments}
          loading={loading}
          onEdit={handleEditDepartment}
          onDelete={handleDelete}
          isAdmin={role === 'admin'}
        />
      </div>

      <DepartmentFormModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingDepartment(null);
        }}
        onSuccess={handleModalSuccess}
        initialData={editingDepartment}
        isAdmin={role === 'admin'}
      />
    </div>
  );
}
