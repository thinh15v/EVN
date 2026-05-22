import { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { DepartmentService } from '@/services/DepartmentsService';
import { DepartmentItem } from '@/types/department';

export function useDepartment(initialSearch = '') {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentItem | null>(null);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await DepartmentService.getAllDepartments();
      if (res?.success) {
        setDepartments(res.data || []);
      } else {
        message.error(res?.message || 'Không thể tải danh sách Ban.');
      }
    } catch (error) {
      console.error('fetchDepartments error', error);
      message.error('Lỗi kết nối đến máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleEditDepartment = (department: DepartmentItem) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const deleteDepartment = async (id: number) => {
    setLoading(true);
    try {
      const res = await DepartmentService.deleteDepartment(id);
      if (res?.success) {
        message.success('Xóa Ban thành công.');
        fetchDepartments();
      } else {
        message.error(res?.message || 'Xóa Ban thất bại.');
      }
    } catch (error) {
      console.error('deleteDepartment error', error);
      message.error('Lỗi máy chủ khi xóa Ban.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalSuccess = () => {
    fetchDepartments();
  };

  const filteredDepartments = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return departments;

    return departments.filter((item) =>
      [item.deptCode, item.deptName, item.description]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(keyword))
    );
  }, [departments, searchText]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    filteredDepartments,
    loading,
    searchText,
    setSearchText,
    isModalOpen,
    setIsModalOpen,
    editingDepartment,
    setEditingDepartment,
    handleOpenCreate,
    handleEditDepartment,
    deleteDepartment,
    handleModalSuccess,
    fetchDepartments,
  };
}
