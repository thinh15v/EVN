import axiosClient from '@/utils/axiosClient';

export const DepartmentService = {
  getAllDepartments: async () => {
    const response = await axiosClient.get('/api/Departments');
    return response.data;
  },

  getDepartmentById: async (id: number) => {
    const response = await axiosClient.get(`/api/Departments/${id}`);
    return response.data;
  },

  createDepartment: async (payload: any) => {
    const response = await axiosClient.post('/api/Departments', payload);
    return response.data;
  },

  updateDepartment: async (id: number, payload: any) => {
    const response = await axiosClient.put(`/api/Departments/${id}`, payload);
    return response.data;
  },

  deleteDepartment: async (id: number) => {
    const response = await axiosClient.delete(`/api/Departments/${id}`);
    return response.data;
  }
};