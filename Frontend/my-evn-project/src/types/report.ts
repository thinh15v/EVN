export interface ReportAssignment {
  assignmentId?: number;
  deptId?: number;
  DeptId?: number;
  [key: string]: any;
}

export interface ReportListItem {
  key: number;
  id: string;
  name: string;
  type?: string;
  deadline: string;
  percent: number;
  count: string;
  status: string;
  rawAssignments: ReportAssignment[];
}

export interface ReportCreatePayload {
  reportName: string;
  reportType: string;
  deadline?: string;
  [key: string]: any;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}
