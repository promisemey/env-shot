// pages/user/upload-fix/upload-fix.ts
import { problemApi, uploadApi, utils } from "../../../services/api";
import {
  EnvironmentProblem,
  PROBLEM_CATEGORIES,
  SEVERITY_LEVELS,
  PROBLEM_STATUS,
} from "../../../types/index";

interface UploadFixPageData {
  problemId: string;
  problemInfo:
    | (EnvironmentProblem & {
        statusText: string;
        categoryText: string;
        severityText: string;
      })
    | null;
  fixPhotos: string[];
  fixDescription: string;
  submitDisabled: boolean;
  submitBtnText: string;
}

Page<UploadFixPageData>({
  data: {
    problemId: "",
    problemInfo: null,
    fixPhotos: [],
    fixDescription: "",
    submitDisabled: false,
    submitBtnText: "提交整改",
  },

  onLoad(options: any) {
    if (options.problemId) {
      this.setData({
        problemId: options.problemId,
      });
      this.loadProblemInfo();
    } else {
      wx.showToast({
        title: "参数错误",
        icon: "none",
      });
      wx.navigateBack();
    }
  },

  // 加载问题信息
  async loadProblemInfo() {
    try {
      wx.showLoading({
        title: "加载中...",
      });

      const res = await problemApi.getProblemById(this.data.problemId);

      if (res.success && res.data) {
        const problemInfo = {
          ...res.data,
          statusText: this.getStatusText(res.data.status),
          categoryText: this.getCategoryText(res.data.category),
          severityText: this.getSeverityText(res.data.severity),
        };

        this.setData({ problemInfo });
      } else {
        wx.showToast({
          title: res.message || "加载失败",
          icon: "none",
        });
        wx.navigateBack();
      }
    } catch (error) {
      console.error("加载问题信息失败:", error);
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

  // 选择整改照片
  chooseFixPhoto() {
    const { fixPhotos } = this.data;
    const remainingCount = 9 - fixPhotos.length;

    wx.chooseMedia({
      count: remainingCount,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const tempFiles = res.tempFiles.map((file) => file.tempFilePath);
        this.setData({
          fixPhotos: [...fixPhotos, ...tempFiles],
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

  // 预览整改照片
  previewFixPhoto(e: any) {
    const index = e.currentTarget.dataset.index;
    const { fixPhotos } = this.data;

    wx.previewImage({
      current: fixPhotos[index],
      urls: fixPhotos,
    });
  },

  // 删除整改照片
  deleteFixPhoto(e: any) {
    const index = e.currentTarget.dataset.index;
    const { fixPhotos } = this.data;

    fixPhotos.splice(index, 1);
    this.setData({ fixPhotos });
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

  // 描述输入
  onDescriptionInput(e: any) {
    this.setData({
      fixDescription: e.detail.value,
    });
  },

  // 提交整改
  async submitFix() {
    const { fixPhotos, fixDescription } = this.data;

    // 验证必填字段
    if (fixPhotos.length === 0) {
      wx.showToast({
        title: "请至少上传一张整改照片",
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

      const uploadRes = await uploadApi.uploadImages(fixPhotos);

      if (!uploadRes.success || !uploadRes.data) {
        throw new Error("照片上传失败");
      }

      wx.hideLoading();

      // 提交整改
      const res = await problemApi.uploadFixPhotos(
        this.data.problemId,
        uploadRes.data.urls,
        fixDescription.trim()
      );

      if (res.success) {
        wx.showToast({
          title: "提交成功",
          icon: "success",
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
      console.error("提交整改失败:", error);
      wx.showToast({
        title: "提交失败，请重试",
        icon: "none",
      });
    } finally {
      this.setData({
        submitDisabled: false,
        submitBtnText: "提交整改",
      });
    }
  },
});

