// pages/admin/problem-monitor/problem-monitor.ts
import {
  problemApi,
  communityApi,
  typeApi,
  utils,
} from "../../../services/api";
import {
  EnvironmentProblem,
  Community,
  ProblemType,
  PROBLEM_STATUS,
} from "../../../types/index";

interface ProblemMonitorPageData {
  overviewStats: {
    total: number;
    pending: number;
    fixed: number;
    fixRate: number;
  };
  communities: Community[];
  selectedCommunityIndex: number;
  selectedCommunityText: string;
  statusOptions: Array<{ value: number; label: string }>;
  selectedStatusIndex: number;
  selectedStatusText: string;
  problems: (EnvironmentProblem & {
    statusText: string;
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
      fixed: 0,
      fixRate: 0,
    },
    communities: [],
    selectedCommunityIndex: 0,
    selectedCommunityText: "全部社区",
    statusOptions: [
      { value: -1, label: "全部状态" },
      { value: 0, label: "未整改" },
      { value: 1, label: "已整改" },
    ],
    selectedStatusIndex: 0,
    selectedStatusText: "全部状态",
    problems: [],
    loading: false,
  },

  onLoad() {
    this.loadCommunities();
    this.loadOverviewStats();
    this.loadProblems();
  },

  onShow() {
    this.refreshData();
  },

  // 加载社区列表
  async loadCommunities() {
    try {
      const res = await communityApi.getAllCommunity();
      if (res.code === 200 && res.data) {
        this.setData({
          communities: res.data,
        });
      }
    } catch (error) {
      console.error("加载社区列表失败:", error);
    }
  },

  // 加载概览统计
  async loadOverviewStats() {
    try {
      // 这里简化处理，实际应该有专门的统计接口
      this.setData({
        overviewStats: {
          total: 10,
          pending: 4,
          fixed: 6,
          fixRate: 60,
        },
      });
    } catch (error) {
      console.error("加载概览统计失败:", error);
    }
  },

  // 加载问题列表
  async loadProblems() {
    try {
      this.setData({ loading: true });

      let res;
      if (this.data.selectedCommunityIndex > 0) {
        const selectedCommunity =
          this.data.communities[this.data.selectedCommunityIndex - 1];
        res = await problemApi.getProblemByCommunityId(
          selectedCommunity.community_id
        );
      } else {
        // 管理员可以看所有社区，这里简化处理
        res = await problemApi.getProblemByCommunityId(
          "b7a6a549737044838361693fd65013db"
        );
      }

      if (res && res.code === 200 && res.data) {
        let problems = res.data;

        // 状态筛选
        if (this.data.selectedStatusIndex > 0) {
          const selectedStatus =
            this.data.statusOptions[this.data.selectedStatusIndex].value;
          problems = problems.filter((p) => p.status === selectedStatus);
        }

        const processedProblems = problems.map((problem) => {
          const community = this.data.communities.find(
            (c) => c.community_id === problem.community_id
          );
          return {
            ...problem,
            statusText: utils.getStatusText(problem.status),
            communityName: community?.community_text || "未知社区",
            createTime: utils.formatTime(problem.created_at),
          };
        });

        this.setData({
          problems: processedProblems,
          loading: false,
        });
      } else {
        this.setData({ loading: false });
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
        index === 0 ? "全部社区" : communities[index - 1].community_text,
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

  // 查看问题详情
  viewProblemDetail(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/user/problem-detail/problem-detail?id=${id}`,
    });
  },

  // 预览照片
  previewPhoto(e: any) {
    const imagePath = e.currentTarget.dataset.image;
    const imageUrl = utils.getImageUrl(imagePath);

    wx.previewImage({
      current: imageUrl,
      urls: [imageUrl],
    });
  },
});
