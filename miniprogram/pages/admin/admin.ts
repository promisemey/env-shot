// pages/admin/admin.ts
import { problemApi, communityApi } from "../../services/api";
import { User, Community } from "../../types/index";
import { AuthManager, Permission } from "../../utils/auth";

interface AdminPageData {
  userInfo: User;
  selectedCommunity: Community | null;
  todayStats: {
    newProblems: number;
    fixedProblems: number;
    pendingProblems: number;
  };
}

Page<AdminPageData, any>({
  data: {
    userInfo: {} as User,
    selectedCommunity: null,
    todayStats: {
      newProblems: 0,
      fixedProblems: 0,
      pendingProblems: 0,
    },
  },

  onLoad() {
    this.checkAdminPermission();
  },

  onShow() {
    this.loadUserInfo();
    this.loadSelectedCommunity();
    this.loadTodayStats();
    this.updateTabBar();
  },

  // 检查管理员权限
  checkAdminPermission() {
    if (!AuthManager.checkPagePermission("/pages/admin/admin")) {
      return false;
    }

    if (!AuthManager.isAdmin()) {
      wx.showToast({
        title: "需要管理员权限",
        icon: "none",
      });
      wx.switchTab({
        url: "/pages/index/index",
      });
      return false;
    }

    return true;
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({ userInfo });
    }
  },

  // 加载选中的社区
  loadSelectedCommunity() {
    const selectedCommunity = wx.getStorageSync("selectedCommunity");
    if (selectedCommunity) {
      this.setData({ selectedCommunity });
    }
  },

  // 加载今日统计
  async loadTodayStats() {
    try {
      const today = new Date();
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      ).getTime();
      const todayEnd = todayStart + 24 * 60 * 60 * 1000;

      const res = await problemApi.getProblems({
        page: 1,
        pageSize: 1000, // 获取所有数据用于统计
      });

      if (res.success && res.data) {
        const todayProblems = res.data.filter((problem) => {
          const problemTime = problem.createTime;
          return problemTime >= todayStart && problemTime < todayEnd;
        });

        const newProblems = todayProblems.length;
        const fixedProblems = todayProblems.filter(
          (p) => p.status === "fixed"
        ).length;
        const pendingProblems = todayProblems.filter(
          (p) => p.status === "pending"
        ).length;

        this.setData({
          todayStats: {
            newProblems,
            fixedProblems,
            pendingProblems,
          },
        });
      }
    } catch (error) {
      console.error("加载今日统计失败:", error);
    }
  },

  // 页面导航
  navigateTo(e: any) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url,
    });
  },

  // 更新自定义 tabBar
  updateTabBar() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().updateTabBar();
    }
  },
});
