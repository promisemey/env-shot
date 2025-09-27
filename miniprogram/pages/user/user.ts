// pages/user/user.ts
import { problemApi, communityApi } from "../../services/api";
import { User, Community, EnvironmentProblem } from "../../types/index";

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

Page<UserPageData>({
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
  },

  // 检查用户权限
  checkUserPermission() {
    const userInfo = wx.getStorageSync("userInfo");
    if (!userInfo || userInfo.role !== "user") {
      wx.showToast({
        title: "无权限访问",
        icon: "none",
      });
      wx.switchTab({
        url: "/pages/index/index",
      });
      return;
    }
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
        const res = await communityApi.getCommunityById(userInfo.communityId);
        if (res.success && res.data) {
          this.setData({ userCommunity: res.data });
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
    const iconMap: { [key: string]: string } = {
      pending: "⏳",
      processing: "🔄",
      fixed: "✅",
      closed: "🔒",
    };
    return iconMap[status] || "📋";
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
});

