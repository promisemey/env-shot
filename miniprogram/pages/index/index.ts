// pages/index/index.ts
import { problemApi, utils } from "../../services/api";
import { User, EnvironmentProblem } from "../../types/index";
import { AuthManager } from "../../utils/auth";

interface IndexPageData {
  userInfo: User;
  stats: {
    totalProblems: number;
    pendingProblems: number;
    fixedProblems: number;
    fixRate: number;
  };
  recentProblems: (EnvironmentProblem & {
    statusText: string;
    createTime: string;
  })[];
}

Page<IndexPageData, any>({
  data: {
    userInfo: {} as User,
    stats: {
      totalProblems: 0,
      pendingProblems: 0,
      fixedProblems: 0,
      fixRate: 0,
    },
    recentProblems: [],
  },

  onLoad() {
    this.checkLoginStatus();
  },

  onShow() {
    this.loadUserInfo();
    this.loadStats();
    this.loadRecentProblems();
  },

  // 检查登录状态
  checkLoginStatus() {
    if (!AuthManager.isLoggedIn()) {
      wx.redirectTo({
        url: "/pages/login/login",
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

  // 加载统计数据
  async loadStats() {
    try {
      const userInfo = wx.getStorageSync("userInfo");
      const params: any = {};

      if (userInfo.role === "user" && userInfo.communityId) {
        params.communityId = userInfo.communityId;
      }

      const res = await problemApi.getProblems(params);

      if (res.success && res.data) {
        const problems = res.data;
        const totalProblems = problems.length;
        const pendingProblems = problems.filter(
          (p) => p.status === "pending"
        ).length;
        const fixedProblems = problems.filter(
          (p) => p.status === "fixed"
        ).length;
        const fixRate =
          totalProblems > 0
            ? Math.round((fixedProblems / totalProblems) * 100)
            : 0;

        this.setData({
          stats: {
            totalProblems,
            pendingProblems,
            fixedProblems,
            fixRate,
          },
        });
      }
    } catch (error) {
      console.error("加载统计数据失败:", error);
    }
  },

  // 加载最近问题
  async loadRecentProblems() {
    try {
      const userInfo = wx.getStorageSync("userInfo");
      const params: any = {
        page: 1,
        pageSize: 5,
      };

      if (userInfo.role === "user" && userInfo.communityId) {
        params.communityId = userInfo.communityId;
      }

      const res = await problemApi.getProblems(params);

      if (res.success && res.data) {
        const recentProblems = res.data.map((problem) => ({
          ...problem,
          statusText: this.getStatusText(problem.status),
          createTime: utils.formatTime(problem.createTime),
        }));

        this.setData({ recentProblems });
      }
    } catch (error) {
      console.error("加载最近问题失败:", error);
    }
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

  // 页面导航 - 加入权限检查
  navigateTo(e: any) {
    const url = e.currentTarget.dataset.url;

    // 检查页面访问权限
    if (!AuthManager.canAccessPage(url)) {
      wx.showToast({
        title: "无权限访问此页面",
        icon: "none",
      });
      return;
    }

    wx.navigateTo({
      url,
    });
  },

  // 查看问题详情
  viewProblemDetail(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/user/problem-detail/problem-detail?id=${id}`,
    });
  },
});
