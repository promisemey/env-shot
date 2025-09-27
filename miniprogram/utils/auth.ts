// utils/auth.ts - 权限管理工具
import { User } from "../types/index";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum Permission {
  // 管理员权限
  ADMIN_VIEW_ALL = "admin:view_all", // 查看所有数据
  ADMIN_UPLOAD_PROBLEM = "admin:upload_problem", // 上传问题
  ADMIN_MANAGE_PROBLEM = "admin:manage_problem", // 管理问题状态
  ADMIN_SELECT_COMMUNITY = "admin:select_community", // 选择社区
  ADMIN_MONITOR = "admin:monitor", // 监控面板

  // 用户权限
  USER_VIEW_OWN = "user:view_own", // 查看自己社区的数据
  USER_UPLOAD_FIX = "user:upload_fix", // 上传整改照片
  USER_VIEW_PROBLEM_LIST = "user:view_problem_list", // 查看问题列表
  USER_VIEW_PROBLEM_DETAIL = "user:view_problem_detail", // 查看问题详情
}

// 角色权限映射
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.ADMIN_VIEW_ALL,
    Permission.ADMIN_UPLOAD_PROBLEM,
    Permission.ADMIN_MANAGE_PROBLEM,
    Permission.ADMIN_SELECT_COMMUNITY,
    Permission.ADMIN_MONITOR,
  ],
  [UserRole.USER]: [
    Permission.USER_VIEW_OWN,
    Permission.USER_UPLOAD_FIX,
    Permission.USER_VIEW_PROBLEM_LIST,
    Permission.USER_VIEW_PROBLEM_DETAIL,
  ],
};

// 页面权限映射
export const PAGE_PERMISSIONS: Record<string, Permission[]> = {
  // 管理员页面
  "/pages/admin/admin": [Permission.ADMIN_VIEW_ALL],
  "/pages/admin/community-select/community-select": [
    Permission.ADMIN_SELECT_COMMUNITY,
  ],
  "/pages/admin/problem-upload/problem-upload": [
    Permission.ADMIN_UPLOAD_PROBLEM,
  ],
  "/pages/admin/problem-monitor/problem-monitor": [Permission.ADMIN_MONITOR],

  // 用户页面
  "/pages/user/user": [Permission.USER_VIEW_OWN],
  "/pages/user/problem-list/problem-list": [Permission.USER_VIEW_PROBLEM_LIST],
  "/pages/user/problem-detail/problem-detail": [
    Permission.USER_VIEW_PROBLEM_DETAIL,
  ],
  "/pages/user/upload-fix/upload-fix": [Permission.USER_UPLOAD_FIX],

  // 公共页面
  "/pages/index/index": [], // 首页所有登录用户都可以访问
  "/pages/login/login": [], // 登录页所有人都可以访问
};

/**
 * 权限管理类
 */
export class AuthManager {
  /**
   * 获取当前用户信息
   */
  static getCurrentUser(): User | null {
    try {
      const userInfo = wx.getStorageSync("userInfo");
      return userInfo || null;
    } catch (error) {
      console.error("获取用户信息失败:", error);
      return null;
    }
  }

  /**
   * 检查用户是否已登录
   */
  static isLoggedIn(): boolean {
    const token = wx.getStorageSync("token");
    const userInfo = this.getCurrentUser();
    return !!(token && userInfo);
  }

  /**
   * 获取用户角色
   */
  static getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return (user?.role as UserRole) || null;
  }

  /**
   * 检查用户是否具有指定权限
   */
  static hasPermission(permission: Permission): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;

    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    return rolePermissions.includes(permission);
  }

  /**
   * 检查用户是否具有任一指定权限
   */
  static hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  /**
   * 检查用户是否具有所有指定权限
   */
  static hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  /**
   * 检查用户是否可以访问指定页面
   */
  static canAccessPage(pagePath: string): boolean {
    const requiredPermissions = PAGE_PERMISSIONS[pagePath];

    // 如果页面没有权限要求，则任何已登录用户都可以访问
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return this.isLoggedIn();
    }

    // 检查是否具有所需权限
    return this.hasAnyPermission(requiredPermissions);
  }

  /**
   * 检查是否为管理员
   */
  static isAdmin(): boolean {
    return this.getUserRole() === UserRole.ADMIN;
  }

  /**
   * 检查是否为普通用户
   */
  static isUser(): boolean {
    return this.getUserRole() === UserRole.USER;
  }

  /**
   * 权限验证拦截器
   */
  static checkPagePermission(pagePath: string): boolean {
    // 检查是否已登录
    if (!this.isLoggedIn()) {
      wx.showToast({
        title: "请先登录",
        icon: "none",
      });
      wx.redirectTo({
        url: "/pages/login/login",
      });
      return false;
    }

    // 检查页面权限
    if (!this.canAccessPage(pagePath)) {
      wx.showToast({
        title: "无权限访问此页面",
        icon: "none",
      });
      wx.switchTab({
        url: "/pages/index/index",
      });
      return false;
    }

    return true;
  }

  /**
   * 清除用户信息
   */
  static logout(): void {
    wx.removeStorageSync("token");
    wx.removeStorageSync("userInfo");
    wx.removeStorageSync("selectedCommunity");
  }

  /**
   * 根据用户角色获取默认跳转页面
   */
  static getDefaultPageForRole(): string {
    const userRole = this.getUserRole();
    switch (userRole) {
      case UserRole.ADMIN:
        return "/pages/admin/admin";
      case UserRole.USER:
        return "/pages/user/user";
      default:
        return "/pages/index/index";
    }
  }
}
