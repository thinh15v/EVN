import { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useRole } from '@/context/RoleContext';
import { ReportService } from '@/services/ReportService';
import { ReportAssignment, ReportListItem } from '@/types/report';

function getCurrentDepartmentId(): number | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;

  try {
    const currentUser = JSON.parse(userStr);
    return currentUser?.department?.deptId || currentUser?.deptId || currentUser?.departmentId || null;
  } catch {
    return null;
  }
}

export function useReport(initialSearch = '') {
  const { role } = useRole();
  const [data, setData] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [selectedReportInfo, setSelectedReportInfo] = useState<{ reportName: string; reportCode: string } | null>(null);
  const [currentAssignments, setCurrentAssignments] = useState<ReportAssignment[]>([]);

  const departmentId = getCurrentDepartmentId();

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let result;
      if (role === 'admin') {
        result = await ReportService.getReports();
      } else {
        if (!departmentId) {
          message.warning('Không xác định Ban của người dùng.');
          setData([]);
          return;
        }
        result = await ReportService.getReportsByDept(departmentId);
      }

      if (result?.success) {
        const formattedData = (result.data || []).map((item: any) => ({
          key: item.reportId,
          id: item.reportCode,
          name: item.reportName,
          type: item.reportType,
          deadline: item.deadline ? dayjs(item.deadline).format('YYYY-MM-DD HH:mm') : 'Chưa có hạn',
          percent: item.totalAssigned > 0 ? Math.round((item.totalCompleted / item.totalAssigned) * 100) : 0,
          count: `${item.totalCompleted || 0}/${item.totalAssigned || 0}`,
          status: role === 'admin' ? item.globalStatus : (item.assignStatus || 'CHƯA CẬP NHẬT'),
          rawAssignments: item.assignments || item.Assignments || [],
        }));
        setData(formattedData);
      } else {
        message.error(result?.message || 'Không thể lấy dữ liệu báo cáo!');
        setData([]);
      }
    } catch (error) {
      console.error('fetchReportData error', error);
      message.error('Mất kết nối đến máy chủ API!');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const openAuditLog = (reportId: number, reportName: string, reportCode: string, rawAssignments: ReportAssignment[]) => {
    setSelectedReportId(reportId);
    setSelectedReportInfo({ reportName, reportCode });
    setCurrentAssignments(rawAssignments || []);
    setIsAuditModalOpen(true);
  };

  const closeAuditLog = () => {
    setIsAuditModalOpen(false);
  };

  const filteredData = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return data;

    return data.filter((item) =>
      [item.name, item.id, item.type, item.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [data, searchText]);

  useEffect(() => {
    fetchReportData();
  }, [role]);

  return {
    role,
    departmentId,
    data,
    filteredData,
    loading,
    searchText,
    setSearchText,
    isModalOpen,
    setIsModalOpen,
    openCreateModal,
    fetchReportData,
    isAuditModalOpen,
    selectedReportId,
    selectedReportInfo,
    currentAssignments,
    openAuditLog,
    closeAuditLog,
  };
}
