// pages/admin/problem-upload/problem-upload.ts
import { problemApi, communityApi, typeApi } from "../../../services/api";
import { Community, ProblemType } from "../../../types/index";

interface ProblemUploadPageData {
  communities: Community[];
  selectedCommunityIndex: number;
  selectedCommunity: Community | null;
  selectedCommunityText: string;
  title: string;
  location: string;
  problemTypes: ProblemType[];
  selectedTypeIndex: number;
  selectedType: ProblemType | null;
  selectedTypeText: string;
  photos: string[];
  submitDisabled: boolean;
  submitBtnText: string;
  submitting: boolean;
}

Page<ProblemUploadPageData, any>({
  data: {
    communities: [],
    selectedCommunityIndex: -1,
    selectedCommunity: null,
    selectedCommunityText: "",
    title: "",
    location: "",
    problemTypes: [],
    selectedTypeIndex: -1,
    selectedType: null,
    selectedTypeText: "",
    photos: [],
    submitDisabled: true,
    submitBtnText: "提交问题",
    submitting: false,
  },

  onLoad() {
    this.loadCommunities();
    this.loadProblemTypes();
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

  // 加载问题类型
  async loadProblemTypes() {
    try {
      const res = await typeApi.getAllProblemType();
      if (res.code === 200 && res.data) {
        this.setData({
          problemTypes: res.data,
        });
      }
    } catch (error) {
      console.error("加载问题类型失败:", error);
    }
  },

  // 社区选择
  onCommunityChange(e: any) {
    const index = e.detail.value;
    const community = this.data.communities[index];
    this.setData({
      selectedCommunityIndex: index,
      selectedCommunity: community,
      selectedCommunityText: community.community_text,
    });
    this.checkSubmitStatus();
  },

  // 问题类型选择
  onTypeChange(e: any) {
    const index = e.detail.value;
    const type = this.data.problemTypes[index];
    this.setData({
      selectedTypeIndex: index,
      selectedType: type,
      selectedTypeText: type.type_text,
    });
    this.checkSubmitStatus();
  },

  // 问题标题输入
  onTitleInput(e: any) {
    this.setData({
      title: e.detail.value,
    });
    this.checkSubmitStatus();
  },

  // 问题位置输入
  onLocationInput(e: any) {
    this.setData({
      location: e.detail.value,
    });
    this.checkSubmitStatus();
  },

  // 检查提交状态
  checkSubmitStatus() {
    const { selectedCommunity, selectedType, title, location, photos } =
      this.data;
    const canSubmit =
      selectedCommunity &&
      selectedType &&
      title.trim().length > 0 &&
      location.trim().length > 0 &&
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

  // 提交问题
  async submitProblem() {
    const { selectedCommunity, selectedType, title, location, photos } =
      this.data;

    // 验证必填字段
    if (!selectedCommunity) {
      wx.showToast({
        title: "请选择社区",
        icon: "none",
      });
      return;
    }

    if (!selectedType) {
      wx.showToast({
        title: "请选择问题类型",
        icon: "none",
      });
      return;
    }

    if (!title.trim()) {
      wx.showToast({
        title: "请填写问题标题",
        icon: "none",
      });
      return;
    }

    if (!location.trim()) {
      wx.showToast({
        title: "请填写问题位置",
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

      // 获取用户信息
      const userInfo = wx.getStorageSync("userInfo");

      // 构建问题数据
      const problemData = {
        title: title.trim(),
        community_id: selectedCommunity.community_id,
        type_id: selectedType.type_id,
        location: location.trim(),
        user_id: userInfo?.user_id,
      };

      wx.showLoading({
        title: "上传中...",
      });

      // 上传问题（包含图片）
      const res = await problemApi.uploadProblem(photos[0], problemData);

      wx.hideLoading();

      if (res.code === 200) {
        wx.showToast({
          title: "提交成功",
          icon: "success",
        });

        // 清空表单
        this.setData({
          selectedCommunityIndex: -1,
          selectedCommunity: null,
          selectedCommunityText: "",
          selectedTypeIndex: -1,
          selectedType: null,
          selectedTypeText: "",
          title: "",
          location: "",
          photos: [],
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
      wx.hideLoading();
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
});
