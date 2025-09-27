// pages/user/user.ts
import { problemApi, communityApi } from "../../services/api";
import { User, Community, EnvironmentProblem } from "../../types/index";
import { AuthManager, Permission } from "../../utils/auth";

// 固定的社区列表
const FIXED_COMMUNITIES: Community[] = [
  {
    id: "1",
    name: "社区",
    address: "社区地址",
    latitude: 0,
    longitude: 0,
    createTime: Date.now(),
    updateTime: Date.now(),
  },
  {
    id: "2",
    name: "杨公",
    address: "杨公地址",
    latitude: 0,
    longitude: 0,
    createTime: Date.now(),
    updateTime: Date.now(),
  },
  {
    id: "3",
    name: "大桥",
    address: "大桥地址",
    latitude: 0,
    longitude: 0,
    createTime: Date.now(),
    updateTime: Date.now(),
  },
  {
    id: "4",
    name: "朱集",
    address: "朱集地址",
    latitude: 0,
    longitude: 0,
    createTime: Date.now(),
    updateTime: Date.now(),
  },
  {
    id: "5",
    name: "双庙",
    address: "双庙地址",
    latitude: 0,
    longitude: 0,
    createTime: Date.now(),
    updateTime: Date.now(),
  },
  {
    id: "6",
    name: "陈庙",
    address: "陈庙地址",
    latitude: 0,
    longitude: 0,
    createTime: Date.now(),
    updateTime: Date.now(),
  },
  {
    id: "7",
    name: "汤王",
    address: "汤王地址",
    latitude: 0,
    longitude: 0,
    createTime: Date.now(),
    updateTime: Date.now(),
  },
  {
    id: "8",
    name: "黄圩",
    address: "黄圩地址",
    latitude: 0,
    longitude: 0,
    createTime: Date.now(),
    updateTime: Date.now(),
  },
  {
    id: "9",
    name: "杨郢",
    address: "杨郢地址",
    latitude: 0,
    longitude: 0,
    createTime: Date.now(),
    updateTime: Date.now(),
  },
  {
    id: "10",
    name: "胡岗",
    address: "胡岗地址",
    latitude: 0,
    longitude: 0,
    createTime: Date.now(),
    updateTime: Date.now(),
  },
  {
    id: "11",
    name: "杨祠",
    address: "杨祠地址",
    latitude: 0,
    longitude: 0,
    createTime: Date.now(),
    updateTime: Date.now(),
  },
  {
    id: "12",
    name: "桃园",
    address: "桃园地址",
    latitude: 0,
    longitude: 0,
    createTime: Date.now(),
    updateTime: Date.now(),
  },
  {
    id: "13",
    name: "前瓦",
    address: "前瓦地址",
    latitude: 0,
    longitude: 0,
    createTime: Date.now(),
    updateTime: Date.now(),
  },
];

interface UserPageData {
  userInfo: User;
  userCommunity: Community | null;
  userStats: {
    reportedProblems: number;
    fixedProblems: number;
    pendingProblems: number;
  };
  recentActivities: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
    time: string;
    status: string;
    statusText: string;
  }>;
}

Page<UserPageData, any>({
  data: {
    userInfo: {} as User,
    userCommunity: null,
    userStats: {
      reportedProblems: 0,
      fixedProblems: 0,
      pendingProblems: 0,
    },
    recentActivities: [],
  },

  onLoad() {
    this.checkUserPermission();
  },

  onShow() {
    this.loadUserInfo();
    this.loadUserCommunity();
    this.loadUserStats();
    this.loadRecentActivities();
    this.updateTabBar();
  },

  // 检查用户权限
  checkUserPermission() {
    if (!AuthManager.checkPagePermission("/pages/user/user")) {
      return false;
    }

    if (!AuthManager.isUser()) {
      wx.showToast({
        title: "需要用户权限",
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

  // 加载用户社区信息
  async loadUserCommunity() {
    try {
      const userInfo = wx.getStorageSync("userInfo");
      if (userInfo.communityId) {
        const community = FIXED_COMMUNITIES.find(
          (c) => c.id === userInfo.communityId
        );
        if (community) {
          this.setData({ userCommunity: community });
        }
      }
    } catch (error) {
      console.error("加载社区信息失败:", error);
    }
  },

  // 加载用户统计
  async loadUserStats() {
    try {
      const userInfo = wx.getStorageSync("userInfo");
      const res = await problemApi.getProblems({
        communityId: userInfo.communityId,
        page: 1,
        pageSize: 1000,
      });

      if (res.success && res.data) {
        const problems = res.data;
        const reportedProblems = problems.length;
        const fixedProblems = problems.filter(
          (p) => p.status === "fixed"
        ).length;
        const pendingProblems = problems.filter(
          (p) => p.status === "pending"
        ).length;

        this.setData({
          userStats: {
            reportedProblems,
            fixedProblems,
            pendingProblems,
          },
        });
      }
    } catch (error) {
      console.error("加载用户统计失败:", error);
    }
  },

  // 加载最近活动
  async loadRecentActivities() {
    try {
      const userInfo = wx.getStorageSync("userInfo");
      const res = await problemApi.getProblems({
        communityId: userInfo.communityId,
        page: 1,
        pageSize: 5,
      });

      if (res.success && res.data) {
        const activities = res.data.map((problem) => ({
          id: problem.id,
          icon: this.getActivityIcon(problem.status),
          title: problem.title,
          description: problem.description,
          time: this.formatTime(problem.createTime),
          status: problem.status,
          statusText: this.getStatusText(problem.status),
        }));

        this.setData({ recentActivities: activities });
      }
    } catch (error) {
      console.error("加载最近活动失败:", error);
    }
  },

  // 获取活动图标
  getActivityIcon(status: string): string {
    // 使用TDesign图标名称，由WXML渲染
    const iconMap: { [key: string]: string } = {
      pending: "time",
      processing: "loading",
      fixed: "check-circle",
      closed: "close-circle",
    };
    return iconMap[status] || "bulletpoint";
  },

  // 获取状态文本
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: "待处理",
      processing: "处理中",
      fixed: "已整改",
      closed: "已关闭",
    };
    return statusMap[status] || "未知";
  },

  // 格式化时间
  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60 * 1000) {
      return "刚刚";
    } else if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))}分钟前`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
    } else {
      return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
    }
  },

  // 编辑资料
  editProfile() {
    wx.showModal({
      title: "编辑资料",
      content: "此功能暂未开放",
      showCancel: false,
    });
  },

  // 页面导航
  navigateTo(e: any) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url,
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: "确认退出",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          wx.removeStorageSync("token");
          wx.removeStorageSync("userInfo");
          wx.removeStorageSync("selectedCommunity");

          wx.showToast({
            title: "已退出登录",
            icon: "success",
          });

          // 跳转到登录页
          setTimeout(() => {
            wx.redirectTo({
              url: "/pages/login/login",
            });
          }, 1500);
        }
      },
    });
  },

  // 更新自定义 tabBar
  updateTabBar() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().updateTabBar();
    }
  },
});
