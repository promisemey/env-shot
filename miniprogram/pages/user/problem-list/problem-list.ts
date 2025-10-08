// pages/user/problem-list/problem-list.ts
import { problemApi, utils } from "../../../services/api";
import { EnvironmentProblem, PROBLEM_STATUS } from "../../../types/index";

interface ProblemListPageData {
  problems: (EnvironmentProblem & {
    statusText: string;
    categoryText: string;
    severityText: string;
    createTime: string;
  })[];
  currentFilter: string;
  loading: boolean;
  hasMore: boolean;
  page: number;
  pageSize: number;
}

Page<ProblemListPageData, any>({
  data: {
    problems: [],
    currentFilter: "all",
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10,
  },

  onLoad() {
    this.loadProblems();
  },

  onShow() {
    // 页面显示时刷新数据
    this.refreshProblems();
  },

  // 加载问题列表
  async loadProblems(reset = false) {
    try {
      if (reset) {
        this.setData({
          page: 1,
          problems: [],
          hasMore: true,
        });
      }

      this.setData({ loading: true });

      const userInfo = wx.getStorageSync("userInfo");
      const params: any = {
        page: this.data.page,
        pageSize: this.data.pageSize,
        communityId: userInfo.communityId,
      };

      // 添加状态筛选
      if (this.data.currentFilter !== "all") {
        params.status = this.data.currentFilter;
      }

      const res = await problemApi.getProblemByCommunityId(params);

      if (res.data) {
        const newProblems = res.data.map((problem) => ({
          ...problem,
          statusText: this.getStatusText(problem.status),
          categoryText: this.getCategoryText(problem.status),
          severityText: this.getSeverityText(problem.status),
          createTime: problem.created_at,
        }));

        const problems = reset
          ? newProblems
          : [...this.data.problems, ...newProblems];
        const hasMore = res.data.length === this.data.pageSize;

        this.setData({
          problems,
          hasMore,
          loading: false,
        });
      } else {
        this.setData({ loading: false });
        wx.showToast({
          title: res.message || "加载失败",
          icon: "none",
        });
      }
    } catch (error) {
      console.error("加载问题列表失败:", error);
      this.setData({ loading: false });
      wx.showToast({
        title: "加载失败，请重试",
        icon: "none",
      });
    }
  },

  // 刷新问题列表
  refreshProblems() {
    this.loadProblems(true);
  },

  // 加载更多
  loadMore() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1,
      });
      this.loadProblems();
    }
  },

  // 切换筛选条件
  changeFilter(e: any) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({
      currentFilter: filter,
    });
    this.loadProblems(true);
  },

  // 获取状态文本
  getStatusText(status: string): string {
    const statusItem = PROBLEM_STATUS.find((item) => item.value === status);
    return statusItem ? statusItem.label : "未知";
  },

  // 获取分类文本
  getCategoryText(category: string): string {
    const categoryItem = PROBLEM_CATEGORIES.find(
      (item) => item.value === category
    );
    return categoryItem ? categoryItem.label : "未知";
  },

  // 获取严重程度文本
  getSeverityText(severity: string): string {
    const severityItem = SEVERITY_LEVELS.find(
      (item) => item.value === severity
    );
    return severityItem ? severityItem.label : "未知";
  },

  // 查看问题详情
  viewProblemDetail(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/user/problem-detail/problem-detail?id=${id}`,
    });
  },

  // 预览照片
  previewPhoto(e: any) {
    const photos = e.currentTarget.dataset.photos;
    const current = e.currentTarget.dataset.current;

    wx.previewImage({
      current,
      urls: photos,
    });
  },

  // 上传整改
  uploadFix(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/user/upload-fix/upload-fix?problemId=${id}`,
    });
  },
});
