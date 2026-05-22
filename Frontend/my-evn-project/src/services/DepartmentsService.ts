import axiosClient from '@/utils/axiosClient';
import { ApiResponse, DepartmentItem, DepartmentPayload } from '@/types/department';

export const DepartmentService = {
  getAllDepartments: async () => {
    const response = await axiosClient.get<ApiResponse<DepartmentItem[]>>('/api/Departments');
    return response.data;
  },

  getDepartmentById: async (id: number) => {
    const response = await axiosClient.get<ApiResponse<DepartmentItem>>(`/api/Departments/${id}`);
    return response.data;
  },

  createDepartment: async (payload: DepartmentPayload) => {
    const response = await axiosClient.post<ApiResponse<DepartmentItem>>('/api/Departments', payload);
    return response.data;
  },

  updateDepartment: async (id: number, payload: DepartmentPayload) => {
    const response = await axiosClient.put<ApiResponse<null>>(`/api/Departments/${id}`, payload);
    return response.data;
  },

  deleteDepartment: async (id: number) => {
    const response = await axiosClient.delete<ApiResponse<null>>(`/api/Departments/${id}`);
    return response.data;
  }
};