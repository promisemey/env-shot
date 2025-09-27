// pages/admin/problem-upload/problem-upload.ts
import { problemApi, uploadApi } from "../../../services/api";
import {
  Community,
  PROBLEM_CATEGORIES,
  SEVERITY_LEVELS,
} from "../../../types/index";

interface ProblemUploadPageData {
  selectedCommunity: Community | null;
  problemData: {
    title: string;
    description: string;
    categoryIndex: number;
    categoryText: string;
    severityIndex: number;
    severityText: string;
  };
  photos: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  submitDisabled: boolean;
  submitBtnText: string;
}

Page<ProblemUploadPageData>({
  data: {
    selectedCommunity: null,
    problemData: {
      title: "",
      description: "",
      categoryIndex: 0,
      categoryText: "请选择问题分类",
      severityIndex: 0,
      severityText: "请选择严重程度",
    },
    photos: [],
    location: null,
    submitDisabled: false,
    submitBtnText: "提交问题",
  },

  onLoad() {
    this.loadSelectedCommunity();
  },

  // 加载选中的社区
  loadSelectedCommunity() {
    const selectedCommunity = wx.getStorageSync("selectedCommunity");
    if (selectedCommunity) {
      this.setData({ selectedCommunity });
    } else {
      wx.showModal({
        title: "提示",
        content: "请先选择要管理的社区",
        showCancel: false,
        success: () => {
          wx.navigateBack();
        },
      });
    }
  },

  // 切换社区
  changeCommunity() {
    wx.navigateTo({
      url: "/pages/admin/community-select/community-select",
    });
  },

  // 标题输入
  onTitleInput(e: any) {
    this.setData({
      "problemData.title": e.detail.value,
    });
  },

  // 描述输入
  onDescriptionInput(e: any) {
    this.setData({
      "problemData.description": e.detail.value,
    });
  },

  // 分类选择
  onCategoryChange(e: any) {
    const index = e.detail.value;
    const category = PROBLEM_CATEGORIES[index];
    this.setData({
      "problemData.categoryIndex": index,
      "problemData.categoryText": category.label,
    });
  },

  // 严重程度选择
  onSeverityChange(e: any) {
    const index = e.detail.value;
    const severity = SEVERITY_LEVELS[index];
    this.setData({
      "problemData.severityIndex": index,
      "problemData.severityText": severity.label,
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
    const { selectedCommunity, problemData, photos, location } = this.data;

    // 验证必填字段
    if (!problemData.title.trim()) {
      wx.showToast({
        title: "请输入问题标题",
        icon: "none",
      });
      return;
    }

    if (!problemData.description.trim()) {
      wx.showToast({
        title: "请输入问题描述",
        icon: "none",
      });
      return;
    }

    if (problemData.categoryText === "请选择问题分类") {
      wx.showToast({
        title: "请选择问题分类",
        icon: "none",
      });
      return;
    }

    if (problemData.severityText === "请选择严重程度") {
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
        communityId: selectedCommunity!.id,
        title: problemData.title.trim(),
        description: problemData.description.trim(),
        category: PROBLEM_CATEGORIES[problemData.categoryIndex].value,
        severity: SEVERITY_LEVELS[problemData.severityIndex].value,
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
          problemData: {
            title: "",
            description: "",
            categoryIndex: 0,
            categoryText: "请选择问题分类",
            severityIndex: 0,
            severityText: "请选择严重程度",
          },
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
        submitBtnText: "提交问题",
      });
    }
  },
});

