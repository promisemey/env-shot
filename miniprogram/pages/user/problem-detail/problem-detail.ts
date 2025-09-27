// pages/user/problem-detail/problem-detail.ts
import { problemApi, communityApi, utils } from "../../../services/api";
import {
  EnvironmentProblem,
  PROBLEM_CATEGORIES,
  SEVERITY_LEVELS,
  PROBLEM_STATUS,
  Community,
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

interface ProblemDetailPageData {
  problemId: string;
  problemInfo:
    | (EnvironmentProblem & {
        statusText: string;
        categoryText: string;
        severityText: string;
        communityName: string;
        createTime: string;
        fixTime?: string;
      })
    | null;
  userInfo: any;
}

Page<ProblemDetailPageData, any>({
  data: {
    problemId: "",
    problemInfo: null,
    userInfo: null,
  },

  onLoad(options: any) {
    if (options.id) {
      this.setData({
        problemId: options.id,
      });
      this.loadUserInfo();
      this.loadProblemDetail();
    } else {
      wx.showToast({
        title: "参数错误",
        icon: "none",
      });
      wx.navigateBack();
    }
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({ userInfo });
    }
  },

  // 加载问题详情
  async loadProblemDetail() {
    try {
      wx.showLoading({
        title: "加载中...",
      });

      const res = await problemApi.getProblemById(this.data.problemId);

      if (res.success && res.data) {
        // 获取社区名称
        let communityName = "未知社区";
        const community = FIXED_COMMUNITIES.find(
          (c) => c.id === res.data!.communityId
        );
        if (community) {
          communityName = community.name;
        }

        const problemInfo = {
          ...res.data,
          statusText: this.getStatusText(res.data.status),
          categoryText: this.getCategoryText(res.data.category),
          severityText: this.getSeverityText(res.data.severity),
          communityName,
          createTime: utils.formatTime(res.data.createTime),
          fixTime: res.data.fixTime
            ? utils.formatTime(res.data.fixTime)
            : undefined,
        } as any;

        this.setData({ problemInfo });
      } else {
        wx.showToast({
          title: res.message || "加载失败",
          icon: "none",
        });
        wx.navigateBack();
      }
    } catch (error) {
      console.error("加载问题详情失败:", error);
      wx.showToast({
        title: "加载失败，请重试",
        icon: "none",
      });
      wx.navigateBack();
    } finally {
      wx.hideLoading();
    }
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

  // 预览问题照片
  previewPhoto(e: any) {
    const photos = e.currentTarget.dataset.photos;
    const current = e.currentTarget.dataset.current;

    wx.previewImage({
      current,
      urls: photos,
    });
  },

  // 预览整改照片
  previewFixPhoto(e: any) {
    const photos = e.currentTarget.dataset.photos;
    const current = e.currentTarget.dataset.current;

    wx.previewImage({
      current,
      urls: photos,
    });
  },

  // 上传整改照片
  uploadFix() {
    wx.navigateTo({
      url: `/pages/user/upload-fix/upload-fix?problemId=${this.data.problemId}`,
    });
  },
});
