// pages/user/user.ts
import { problemApi, communityApi, utils } from "../../services/api";
import { User, Community, EnvironmentProblem } from "../../types/index";
import { AuthManager, UserRole } from "../../utils/auth";

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

  onShow() {
    this.loadUserInfo();
    this.loadUserCommunity();
    this.loadUserStats();
    this.loadRecentActivities();
    this.updateTabBar();
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
      if (userInfo.community_id) {
        const res = await communityApi.getAllCommunity();
        if (res.code === 200 && res.data) {
          const community = res.data.find(
            (c) => c.community_id === userInfo.community_id
          );
          if (community) {
            this.setData({ userCommunity: community });
          }
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
      if (!userInfo.community_id) return;

      const res = await problemApi.getProblemByCommunityId(
        userInfo.community_id
      );

      if (res.code === 200 && res.data) {
        const problems = res.data;
        const reportedProblems = problems.length;
        const fixedProblems = problems.filter((p) => p.status === 1).length;
        const pendingProblems = problems.filter((p) => p.status === 0).length;

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
      if (!userInfo.community_id) return;

      const res = await problemApi.getProblemByCommunityId(
        userInfo.community_id
      );

      if (res.code === 200 && res.data) {
        const activities = res.data.slice(0, 5).map((problem) => ({
          id: problem.problem_id,
          icon: this.getActivityIcon(problem.status),
          title: problem.title,
          description: problem.location,
          time: this.formatTime(problem.created_at),
          status: problem.status,
          statusText: utils.getStatusText(problem.status),
        }));

        this.setData({ recentActivities: activities });
      }
    } catch (error) {
      console.error("加载最近活动失败:", error);
    }
  },

  // 获取活动图标
  getActivityIcon(status: number): string {
    // 使用TDesign图标名称，由WXML渲染
    const iconMap: { [key: number]: string } = {
      0: "time", // 未整改
      1: "check-circle", // 已整改
    };
    return iconMap[status] || "bulletpoint";
  },

  // 格式化时间
  formatTime(dateString: string): string {
    const date = new Date(dateString);
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
      const userInfo = wx.getStorageSync("userInfo") || { role: "user" };
      // 根据是否是管理员，计算正确的索引
      const selected = userInfo.role === UserRole.ADMIN ? 2 : 1;
      console.log("🚀 ~ updateTabBar ~ userInfo:", userInfo, selected);

      this.getTabBar().setData({
        selected,
      });
    }
  },
});
