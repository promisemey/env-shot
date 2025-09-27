// pages/permission-demo/permission-demo.ts
import { AuthManager, Permission } from "../../utils/auth";
import { User } from "../../types/index";
import { getCommunityNameById } from "../../constants/communities";

interface PermissionItem {
  name: string;
  description: string;
  permission: Permission;
  hasPermission: boolean;
}

interface PageAccessItem {
  title: string;
  path: string;
  icon: string;
  canAccess: boolean;
}

interface PermissionDemoPageData {
  userInfo: User;
  communityName: string;
  permissions: PermissionItem[];
  pageAccess: PageAccessItem[];
}

Page<PermissionDemoPageData, any>({
  data: {
    userInfo: {} as User,
    communityName: "",
    permissions: [],
    pageAccess: [],
  },

  onLoad() {
    this.loadUserInfo();
    this.loadPermissions();
    this.loadPageAccess();
  },

  onShow() {
    this.loadUserInfo();
    this.loadPermissions();
    this.loadPageAccess();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = AuthManager.getCurrentUser();
    if (userInfo) {
      const communityName = userInfo.communityId
        ? getCommunityNameById(userInfo.communityId)
        : "未分配";

      this.setData({
        userInfo,
        communityName,
      });
    } else {
      this.setData({
        userInfo: {} as User,
        communityName: "",
      });
    }
  },

  // 加载权限信息
  loadPermissions() {
    const permissionList: PermissionItem[] = [
      {
        name: "查看所有数据",
        description: "管理员可以查看所有社区的问题数据",
        permission: Permission.ADMIN_VIEW_ALL,
        hasPermission: AuthManager.hasPermission(Permission.ADMIN_VIEW_ALL),
      },
      {
        name: "上传问题",
        description: "管理员可以上传发现的环境问题",
        permission: Permission.ADMIN_UPLOAD_PROBLEM,
        hasPermission: AuthManager.hasPermission(
          Permission.ADMIN_UPLOAD_PROBLEM
        ),
      },
      {
        name: "管理问题状态",
        description: "管理员可以更新问题的处理状态",
        permission: Permission.ADMIN_MANAGE_PROBLEM,
        hasPermission: AuthManager.hasPermission(
          Permission.ADMIN_MANAGE_PROBLEM
        ),
      },
      {
        name: "选择社区",
        description: "管理员可以选择管理的社区",
        permission: Permission.ADMIN_SELECT_COMMUNITY,
        hasPermission: AuthManager.hasPermission(
          Permission.ADMIN_SELECT_COMMUNITY
        ),
      },
      {
        name: "监控面板",
        description: "管理员可以访问问题监控面板",
        permission: Permission.ADMIN_MONITOR,
        hasPermission: AuthManager.hasPermission(Permission.ADMIN_MONITOR),
      },
      {
        name: "查看自己社区数据",
        description: "用户可以查看所属社区的问题数据",
        permission: Permission.USER_VIEW_OWN,
        hasPermission: AuthManager.hasPermission(Permission.USER_VIEW_OWN),
      },
      {
        name: "上传整改照片",
        description: "用户可以上传问题的整改照片",
        permission: Permission.USER_UPLOAD_FIX,
        hasPermission: AuthManager.hasPermission(Permission.USER_UPLOAD_FIX),
      },
      {
        name: "查看问题列表",
        description: "用户可以查看问题列表页面",
        permission: Permission.USER_VIEW_PROBLEM_LIST,
        hasPermission: AuthManager.hasPermission(
          Permission.USER_VIEW_PROBLEM_LIST
        ),
      },
      {
        name: "查看问题详情",
        description: "用户可以查看问题详情页面",
        permission: Permission.USER_VIEW_PROBLEM_DETAIL,
        hasPermission: AuthManager.hasPermission(
          Permission.USER_VIEW_PROBLEM_DETAIL
        ),
      },
    ];

    this.setData({ permissions: permissionList });
  },

  // 加载页面访问权限
  loadPageAccess() {
    const pageList: PageAccessItem[] = [
      {
        title: "首页",
        path: "/pages/index/index",
        icon: "home",
        canAccess: AuthManager.canAccessPage("/pages/index/index"),
      },
      {
        title: "管理员工作台",
        path: "/pages/admin/admin",
        icon: "user-setting",
        canAccess: AuthManager.canAccessPage("/pages/admin/admin"),
      },
      {
        title: "社区选择",
        path: "/pages/admin/community-select/community-select",
        icon: "location",
        canAccess: AuthManager.canAccessPage(
          "/pages/admin/community-select/community-select"
        ),
      },
      {
        title: "问题上报",
        path: "/pages/admin/problem-upload/problem-upload",
        icon: "camera",
        canAccess: AuthManager.canAccessPage(
          "/pages/admin/problem-upload/problem-upload"
        ),
      },
      {
        title: "问题监控",
        path: "/pages/admin/problem-monitor/problem-monitor",
        icon: "chart-bar",
        canAccess: AuthManager.canAccessPage(
          "/pages/admin/problem-monitor/problem-monitor"
        ),
      },
      {
        title: "用户中心",
        path: "/pages/user/user",
        icon: "user",
        canAccess: AuthManager.canAccessPage("/pages/user/user"),
      },
      {
        title: "问题列表",
        path: "/pages/user/problem-list/problem-list",
        icon: "view-list",
        canAccess: AuthManager.canAccessPage(
          "/pages/user/problem-list/problem-list"
        ),
      },
      {
        title: "上传整改",
        path: "/pages/user/upload-fix/upload-fix",
        icon: "check-circle",
        canAccess: AuthManager.canAccessPage(
          "/pages/user/upload-fix/upload-fix"
        ),
      },
    ];

    this.setData({ pageAccess: pageList });
  },

  // 测试页面访问
  testPageAccess(e: any) {
    const path = e.currentTarget.dataset.path;

    if (AuthManager.canAccessPage(path)) {
      wx.showToast({
        title: "访问权限验证通过",
        icon: "success",
      });

      // 实际跳转页面
      if (path.includes("admin") || path.includes("user")) {
        wx.switchTab({ url: path });
      } else {
        wx.navigateTo({ url: path });
      }
    } else {
      wx.showToast({
        title: "无权限访问此页面",
        icon: "none",
      });
    }
  },

  // 切换到管理员
  switchToAdmin() {
    const mockAdminUser: User = {
      id: "admin_test",
      phone: "13800000000",
      name: "测试管理员",
      role: "admin",
      createTime: Date.now(),
      updateTime: Date.now(),
    };

    wx.setStorageSync("token", "mock_admin_token");
    wx.setStorageSync("userInfo", mockAdminUser);

    wx.showToast({
      title: "已切换到管理员角色",
      icon: "success",
    });

    this.onShow();
  },

  // 切换到普通用户
  switchToUser() {
    const mockUser: User = {
      id: "user_test",
      phone: "13900000000",
      name: "测试用户",
      role: "user",
      communityId: "1",
      createTime: Date.now(),
      updateTime: Date.now(),
    };

    wx.setStorageSync("token", "mock_user_token");
    wx.setStorageSync("userInfo", mockUser);

    wx.showToast({
      title: "已切换到普通用户角色",
      icon: "success",
    });

    this.onShow();
  },

  // 退出登录
  logout() {
    AuthManager.logout();

    wx.showToast({
      title: "已退出登录",
      icon: "success",
    });

    setTimeout(() => {
      wx.redirectTo({
        url: "/pages/login/login",
      });
    }, 1500);
  },
});
