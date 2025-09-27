// pages/admin/community-select/community-select.ts
import { communityApi } from "../../../services/api";
import { Community } from "../../../types/index";

interface CommunitySelectPageData {
  communities: Community[];
  selectedCommunityId: string;
  searchKeyword: string;
  loading: boolean;
}

Page<CommunitySelectPageData>({
  data: {
    communities: [],
    selectedCommunityId: "",
    searchKeyword: "",
    loading: false,
  },

  onLoad() {
    this.loadCommunities();
    this.loadSelectedCommunity();
  },

  // 加载社区列表
  async loadCommunities() {
    try {
      this.setData({ loading: true });

      const res = await communityApi.getCommunities();

      if (res.success && res.data) {
        this.setData({
          communities: res.data,
          loading: false,
        });
      } else {
        wx.showToast({
          title: res.message || "加载失败",
          icon: "none",
        });
        this.setData({ loading: false });
      }
    } catch (error) {
      console.error("加载社区列表失败:", error);
      wx.showToast({
        title: "加载失败，请重试",
        icon: "none",
      });
      this.setData({ loading: false });
    }
  },

  // 加载已选择的社区
  loadSelectedCommunity() {
    const selectedCommunity = wx.getStorageSync("selectedCommunity");
    if (selectedCommunity) {
      this.setData({
        selectedCommunityId: selectedCommunity.id,
      });
    }
  },

  // 搜索输入
  onSearchInput(e: any) {
    this.setData({
      searchKeyword: e.detail.value,
    });
  },

  // 搜索社区
  searchCommunities() {
    const { searchKeyword, communities } = this.data;

    if (!searchKeyword.trim()) {
      this.loadCommunities();
      return;
    }

    const filteredCommunities = communities.filter(
      (community) =>
        community.name.includes(searchKeyword) ||
        community.address.includes(searchKeyword)
    );

    this.setData({
      communities: filteredCommunities,
    });
  },

  // 选择社区
  selectCommunity(e: any) {
    const community = e.currentTarget.dataset.community;
    this.setData({
      selectedCommunityId: community.id,
    });
  },

  // 查看社区详情
  viewCommunityDetail(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "社区详情",
      content: "这里可以显示社区的详细信息，包括位置、联系方式等",
      showCancel: false,
    });
  },

  // 确认选择
  confirmSelection() {
    const { selectedCommunityId, communities } = this.data;

    if (!selectedCommunityId) {
      wx.showToast({
        title: "请先选择社区",
        icon: "none",
      });
      return;
    }

    const selectedCommunity = communities.find(
      (c) => c.id === selectedCommunityId
    );

    if (selectedCommunity) {
      // 保存选择的社区
      wx.setStorageSync("selectedCommunity", selectedCommunity);

      wx.showToast({
        title: "选择成功",
        icon: "success",
      });

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },
});

