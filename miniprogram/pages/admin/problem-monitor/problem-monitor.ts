// pages/admin/problem-monitor/problem-monitor.ts
import { problemApi, communityApi, utils } from "../../../services/api";
import {
  EnvironmentProblem,
  Community,
  PROBLEM_CATEGORIES,
  SEVERITY_LEVELS,
  PROBLEM_STATUS,
} from "../../../types/index";

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

interface ProblemMonitorPageData {
  overviewStats: {
    total: number;
    pending: number;
    processing: number;
    fixed: number;
    fixRate: number;
  };
  communities: Community[];
  selectedCommunityIndex: number;
  selectedCommunityText: string;
  statusOptions: Array<{ value: string; label: string }>;
  selectedStatusIndex: number;
  selectedStatusText: string;
  problems: (EnvironmentProblem & {
    statusText: string;
    categoryText: string;
    severityText: string;
    communityName: string;
    createTime: string;
  })[];
  loading: boolean;
}

Page<ProblemMonitorPageData, any>({
  data: {
    overviewStats: {
      total: 0,
      pending: 0,
      processing: 0,
      fixed: 0,
      fixRate: 0,
    },
    communities: FIXED_COMMUNITIES,
    selectedCommunityIndex: 0,
    selectedCommunityText: "全部社区",
    statusOptions: [
      { value: "all", label: "全部状态" },
      { value: "pending", label: "待处理" },
      { value: "processing", label: "处理中" },
      { value: "fixed", label: "已整改" },
      { value: "closed", label: "已关闭" },
    ],
    selectedStatusIndex: 0,
    selectedStatusText: "全部状态",
    problems: [],
    loading: false,
  },

  onLoad() {
    this.loadOverviewStats();
    this.loadProblems();
  },

  onShow() {
    // 页面显示时刷新数据
    this.refreshData();
  },

  // 加载概览统计
  async loadOverviewStats() {
    try {
      const res = await problemApi.getProblems({
        page: 1,
        pageSize: 1000,
      });

      if (res.success && res.data) {
        const problems = res.data;
        const total = problems.length;
        const pending = problems.filter((p) => p.status === "pending").length;
        const processing = problems.filter(
          (p) => p.status === "processing"
        ).length;
        const fixed = problems.filter((p) => p.status === "fixed").length;
        const fixRate = total > 0 ? Math.round((fixed / total) * 100) : 0;

        this.setData({
          overviewStats: {
            total,
            pending,
            processing,
            fixed,
            fixRate,
          },
        });
      }
    } catch (error) {
      console.error("加载概览统计失败:", error);
    }
  },

  // 加载问题列表
  async loadProblems() {
    try {
      this.setData({ loading: true });

      const params: any = {
        page: 1,
        pageSize: 1000,
      };

      // 添加社区筛选
      if (this.data.selectedCommunityIndex > 0) {
        const selectedCommunity =
          this.data.communities[this.data.selectedCommunityIndex - 1];
        params.communityId = selectedCommunity.id;
      }

      // 添加状态筛选
      if (this.data.selectedStatusIndex > 0) {
        const selectedStatus =
          this.data.statusOptions[this.data.selectedStatusIndex];
        params.status = selectedStatus.value;
      }

      const res = await problemApi.getProblems(params);

      if (res.success && res.data) {
        const problems = await Promise.all(
          res.data.map(async (problem) => {
            // 获取社区名称
            let communityName = "未知社区";
            const community = FIXED_COMMUNITIES.find(
              (c) => c.id === problem.communityId
            );
            if (community) {
              communityName = community.name;
            }

            return {
              ...problem,
              statusText: this.getStatusText(problem.status),
              categoryText: this.getCategoryText(problem.category),
              severityText: this.getSeverityText(problem.severity),
              communityName,
              createTime: utils.formatTime(problem.createTime),
            };
          })
        );

        this.setData({
          problems,
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

  // 刷新数据
  refreshData() {
    this.loadOverviewStats();
    this.loadProblems();
  },

  // 社区选择变化
  onCommunityChange(e: any) {
    const index = e.detail.value;
    const communities = this.data.communities;

    this.setData({
      selectedCommunityIndex: index,
      selectedCommunityText:
        index === 0 ? "全部社区" : communities[index - 1].name,
    });

    this.loadProblems();
  },

  // 状态选择变化
  onStatusChange(e: any) {
    const index = e.detail.value;
    const statusOptions = this.data.statusOptions;

    this.setData({
      selectedStatusIndex: index,
      selectedStatusText: statusOptions[index].label,
    });

    this.loadProblems();
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

  // 更新问题状态
  async updateStatus(e: any) {
    const id = e.currentTarget.dataset.id;
    const status = e.currentTarget.dataset.status;

    const statusText = this.getStatusText(status);

    wx.showModal({
      title: "确认操作",
      content: `确定要将此问题状态更新为"${statusText}"吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({
              title: "更新中...",
            });

            const updateRes = await problemApi.updateProblemStatus(id, status);

            if (updateRes.success) {
              wx.showToast({
                title: "更新成功",
                icon: "success",
              });

              // 刷新数据
              this.refreshData();
            } else {
              wx.showToast({
                title: updateRes.message || "更新失败",
                icon: "none",
              });
            }
          } catch (error) {
            console.error("更新问题状态失败:", error);
            wx.showToast({
              title: "更新失败，请重试",
              icon: "none",
            });
          } finally {
            wx.hideLoading();
          }
        }
      },
    });
  },
});
