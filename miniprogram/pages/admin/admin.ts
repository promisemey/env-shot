import { User, Community } from "../../types/index";
import { AuthManager } from "../../utils/auth";

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
      // 获取所有社区的问题进行统计
      const userInfo = wx.getStorageSync("userInfo");
      if (!userInfo || userInfo.role !== 1) return;

      // 这里简化处理，实际应该有专门的统计接口
      // 暂时使用模拟数据
      this.setData({
        todayStats: {
          newProblems: 5,
          fixedProblems: 3,
          pendingProblems: 2,
        },
      });
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
      this.getTabBar().setData({
        selected: 1,
      });
    }
  },
});
