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
    this.updateTabBar();
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
      if (!userInfo) return;

      let res;
      if (userInfo.role === 0 && userInfo.community_id) {
        // 普通用户只能看自己社区的数据
        res = await problemApi.getProblemByCommunityId(userInfo.community_id);
      } else if (userInfo.role === 1) {
        res = await problemApi.getProblemByCommunityId(
          userInfo.community_id || "b7a6a549737044838361693fd65013db"
        );
      }

      if (res && res.code === 200 && res.data) {
        const problems = res.data;
        const totalProblems = problems.length;
        const pendingProblems = problems.filter((p) => p.status === 0).length;
        const fixedProblems = problems.filter((p) => p.status === 1).length;
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
      if (!userInfo) return;

      let res;
      if (userInfo.role === 0 && userInfo.community_id) {
        // 普通用户只能看自己社区的数据
        res = await problemApi.getProblemByCommunityId(userInfo.community_id);
      } else if (userInfo.role === 1) {
        // 管理员可以看所有数据，这里简化处理
        res = await problemApi.getProblemByCommunityId(
          userInfo.community_id || "b7a6a549737044838361693fd65013db"
        );
      }

      if (res && res.code === 200 && res.data) {
        const recentProblems = res.data.slice(0, 5).map((problem) => ({
          ...problem,
          statusText: utils.getStatusText(problem.status),
          createTime: utils.formatTime(problem.created_at),
        }));

        this.setData({ recentProblems });
      }
    } catch (error) {
      console.error("加载最近问题失败:", error);
    }
  },

  // 页面导航
  navigateTo(e: WechatMiniprogram.BaseEvent) {
    const url = e.currentTarget.dataset.url;

    // // 检查页面访问权限
    // if (!AuthManager.canAccessPage(url)) {
    //   wx.showToast({
    //     title: "无权限访问此页面",
    //     icon: "none",
    //   });
    //   return;
    // }

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

  // 更新自定义 tabBar
  updateTabBar() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      });
    }
  },
});
