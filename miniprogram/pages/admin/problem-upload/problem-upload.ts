// pages/admin/problem-upload/problem-upload.ts
import { problemApi, uploadApi } from "../../../services/api";
import { Community } from "../../../types/index";

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

interface ProblemUploadPageData {
  communities: Community[];
  selectedCommunityIndex: number;
  selectedCommunity: Community | null;
  selectedCommunityText: string;
  description: string;
  categories: Array<{
    value: string;
    label: string;
    icon: string;
  }>;
  selectedCategory: string;
  severityOptions: Array<{
    value: string;
    label: string;
  }>;
  selectedSeverity: string;
  photos: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  submitDisabled: boolean;
  submitBtnText: string;
  submitting: boolean;
}

Page<ProblemUploadPageData, any>({
  data: {
    communities: FIXED_COMMUNITIES,
    selectedCommunityIndex: -1,
    selectedCommunity: null,
    selectedCommunityText: "",
    description: "",
    categories: [
      { value: "garbage", label: "垃圾处理", icon: "delete" },
      { value: "water", label: "水质问题", icon: "circle" },
      { value: "air", label: "空气质量", icon: "cloud" },
      { value: "noise", label: "噪音污染", icon: "sound" },
      { value: "green", label: "绿化问题", icon: "radish-filled" },
      { value: "other", label: "其他问题", icon: "bulletpoint" },
    ],
    selectedCategory: "",
    severityOptions: [
      { value: "low", label: "轻微" },
      { value: "medium", label: "中等" },
      { value: "high", label: "严重" },
    ],
    selectedSeverity: "",
    photos: [],
    location: null,
    submitDisabled: false,
    submitBtnText: "提交问题",
    submitting: false,
  },

  onLoad() {
    // 页面加载时不需要特别处理
  },

  // 社区选择
  onCommunityChange(e: any) {
    const index = e.detail.value;
    const community = this.data.communities[index];
    this.setData({
      selectedCommunityIndex: index,
      selectedCommunity: community,
      selectedCommunityText: community.name,
    });
    this.checkSubmitStatus();
  },

  // 问题描述输入
  onDescriptionInput(e: any) {
    this.setData({
      description: e.detail.value,
    });
    this.checkSubmitStatus();
  },

  // 选择问题分类
  selectCategory(e: any) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      selectedCategory: value,
    });
    this.checkSubmitStatus();
  },

  // 选择严重程度
  selectSeverity(e: any) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      selectedSeverity: value,
    });
    this.checkSubmitStatus();
  },

  // 检查提交状态
  checkSubmitStatus() {
    const {
      selectedCommunity,
      description,
      selectedCategory,
      selectedSeverity,
      photos,
    } = this.data;
    const canSubmit =
      selectedCommunity &&
      description.trim().length > 0 &&
      selectedCategory &&
      selectedSeverity &&
      photos.length > 0;

    this.setData({
      submitDisabled: !canSubmit,
    });
  },

  // 选择照片
  choosePhoto() {
    const { photos } = this.data;
    const remainingCount = 9 - photos.length;

    wx.chooseMedia({
      count: remainingCount,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const tempFiles = res.tempFiles.map((file) => file.tempFilePath);
        this.setData({
          photos: [...photos, ...tempFiles],
        });
        this.checkSubmitStatus();
      },
      fail: (error) => {
        console.error("选择照片失败:", error);
        wx.showToast({
          title: "选择照片失败",
          icon: "none",
        });
      },
    });
  },

  // 预览照片
  previewPhoto(e: any) {
    const index = e.currentTarget.dataset.index;
    const { photos } = this.data;

    wx.previewImage({
      current: photos[index],
      urls: photos,
    });
  },

  // 删除照片
  deletePhoto(e: any) {
    const index = e.currentTarget.dataset.index;
    const { photos } = this.data;

    photos.splice(index, 1);
    this.setData({ photos });
    this.checkSubmitStatus();
  },

  // 获取当前位置
  getCurrentLocation() {
    wx.showLoading({
      title: "获取位置中...",
    });

    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        const { latitude, longitude } = res;

        // 逆地理编码获取地址
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=YOUR_MAP_KEY`,
          success: (addressRes: any) => {
            wx.hideLoading();

            if (addressRes.data.status === 0) {
              const address = addressRes.data.result.address;
              this.setData({
                location: {
                  latitude,
                  longitude,
                  address,
                },
              });
            } else {
              this.setData({
                location: {
                  latitude,
                  longitude,
                  address: "位置获取成功，但地址解析失败",
                },
              });
            }
          },
          fail: () => {
            wx.hideLoading();
            this.setData({
              location: {
                latitude,
                longitude,
                address: "位置获取成功，但地址解析失败",
              },
            });
          },
        });
      },
      fail: (error) => {
        wx.hideLoading();
        console.error("获取位置失败:", error);
        wx.showToast({
          title: "获取位置失败",
          icon: "none",
        });
      },
    });
  },

  // 提交问题
  async submitProblem() {
    const {
      selectedCommunity,
      description,
      selectedCategory,
      selectedSeverity,
      photos,
      location,
    } = this.data;

    // 验证必填字段
    if (!selectedCommunity) {
      wx.showToast({
        title: "请选择社区",
        icon: "none",
      });
      return;
    }

    if (!description.trim()) {
      wx.showToast({
        title: "请填写问题描述",
        icon: "none",
      });
      return;
    }

    if (!selectedCategory) {
      wx.showToast({
        title: "请选择问题分类",
        icon: "none",
      });
      return;
    }

    if (!selectedSeverity) {
      wx.showToast({
        title: "请选择严重程度",
        icon: "none",
      });
      return;
    }

    if (photos.length === 0) {
      wx.showToast({
        title: "请至少上传一张照片",
        icon: "none",
      });
      return;
    }

    try {
      this.setData({
        submitDisabled: true,
        submitting: true,
        submitBtnText: "提交中...",
      });

      // 上传照片
      wx.showLoading({
        title: "上传照片中...",
      });

      const uploadRes = await uploadApi.uploadImages(photos);

      if (!uploadRes.success || !uploadRes.data) {
        throw new Error("照片上传失败");
      }

      wx.hideLoading();

      // 获取用户信息
      const userInfo = wx.getStorageSync("userInfo");

      // 构建问题数据
      const problemDataToSubmit = {
        communityId: selectedCommunity.id,
        title: `${selectedCommunity.name}${this.getCategoryText(
          selectedCategory
        )}`,
        description: description.trim(),
        category: selectedCategory as any,
        severity: selectedSeverity as any,
        status: "pending" as const,
        photos: uploadRes.data.urls,
        reporterId: userInfo.id,
        reporterName: userInfo.name,
        reporterPhone: userInfo.phone,
        location: location || {
          latitude: 0,
          longitude: 0,
          address: "位置信息未获取",
        },
        createTime: Date.now(),
        updateTime: Date.now(),
      };

      // 提交问题
      const res = await problemApi.createProblem(problemDataToSubmit);

      if (res.success) {
        wx.showToast({
          title: "提交成功",
          icon: "success",
        });

        // 清空表单
        this.setData({
          selectedCommunityIndex: -1,
          selectedCommunity: null,
          selectedCommunityText: "",
          description: "",
          selectedCategory: "",
          selectedSeverity: "",
          photos: [],
          location: null,
        });

        // 返回上一页
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({
          title: res.message || "提交失败",
          icon: "none",
        });
      }
    } catch (error) {
      console.error("提交问题失败:", error);
      wx.showToast({
        title: "提交失败，请重试",
        icon: "none",
      });
    } finally {
      this.setData({
        submitDisabled: false,
        submitting: false,
        submitBtnText: "提交问题",
      });
    }
  },

  // 获取分类文本
  getCategoryText(category: string): string {
    const categoryMap: { [key: string]: string } = {
      garbage: "垃圾处理问题",
      water: "水质问题",
      air: "空气质量问题",
      noise: "噪音污染问题",
      green: "绿化问题",
      other: "环境问题",
    };
    return categoryMap[category] || "环境问题";
  },
});
