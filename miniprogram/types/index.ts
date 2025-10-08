// 用户类型
export interface User {
  user_id: string;
  phone?: string;
  openid?: string;
  nickname?: string;
  avatar?: string;
  role: number; // 0-普通用户，1-管理员
  community_id?: string;
  created_at: string;
}

// 社区类型
export interface Community {
  community_id: string;
  community_text: string;
}

// 问题类型
export interface ProblemType {
  type_id: string;
  type_text: string;
}

// 环境问题类型
export interface EnvironmentProblem {
  problem_id: string;
  user_id: string;
  community_id: string;
  type_id: string;
  title: string;
  location: string;
  image_path: string;
  resolved_image_path?: string;
  status: number; // 0-未整改，1-已整改
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

// 问题状态选项
export const PROBLEM_STATUS = [
  { value: 0, label: "未整改", color: "#faad14" },
  { value: 1, label: "已整改", color: "#52c41a" },
];

// 用户角色选项
export const USER_ROLES = [
  { value: 0, label: "普通用户" },
  { value: 1, label: "管理员" },
];

// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}
