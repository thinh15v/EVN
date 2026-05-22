export interface DepartmentItem {
  deptId: number;
  deptCode: string;
  deptName: string;
  description?: string;
}

export interface DepartmentPayload {
  deptCode: string;
  deptName: string;
  description?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}
