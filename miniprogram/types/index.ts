// 微信用户信息
export interface WechatUserInfo {
  openid: string;
  unionid?: string;
  nickname?: string;
  avatarUrl?: string;
}

// 用户类型
export interface User {
  id: string;
  phone: string;
  name: string;
  role: "admin" | "user"; // 管理员或普通用户
  communityId?: string; // 用户所属社区ID
  avatar?: string;
  wechatInfo?: WechatUserInfo; // 微信用户信息
  createTime: number;
  updateTime: number;
}

// 社区类型
export interface Community {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  createTime: number;
  updateTime: number;
}

// 环境问题类型
export interface EnvironmentProblem {
  id: string;
  communityId: string;
  title: string;
  description: string;
  category: "garbage" | "pollution" | "facility" | "hygiene" | "other"; // 问题分类
  severity: "low" | "medium" | "high"; // 严重程度
  status: "pending" | "processing" | "fixed" | "closed"; // 问题状态
  photos: string[]; // 问题照片URL数组
  fixPhotos?: string[]; // 整改照片URL数组
  reporterId: string; // 上报人ID
  reporterName: string; // 上报人姓名
  reporterPhone: string; // 上报人电话
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createTime: number;
  updateTime: number;
  fixTime?: number; // 整改完成时间
  fixDescription?: string; // 整改描述
}

// 问题分类选项
export const PROBLEM_CATEGORIES = [
  { value: "garbage", label: "垃圾问题" },
  { value: "pollution", label: "污染问题" },
  { value: "facility", label: "设施问题" },
  { value: "hygiene", label: "卫生问题" },
  { value: "other", label: "其他问题" },
];

// 严重程度选项
export const SEVERITY_LEVELS = [
  { value: "low", label: "轻微", color: "#52c41a" },
  { value: "medium", label: "中等", color: "#faad14" },
  { value: "high", label: "严重", color: "#f5222d" },
];

// 问题状态选项
export const PROBLEM_STATUS = [
  { value: "pending", label: "待处理", color: "#faad14" },
  { value: "processing", label: "处理中", color: "#1890ff" },
  { value: "fixed", label: "已整改", color: "#52c41a" },
  { value: "closed", label: "已关闭", color: "#666666" },
];

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

// 分页响应
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}
