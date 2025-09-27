// pages/admin/community-select/community-select.ts
import { communityApi } from "../../../services/api";
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

interface CommunitySelectPageData {
  communities: Community[];
  selectedCommunityId: string;
  searchKeyword: string;
  filteredCommunities: Community[];
}

Page<CommunitySelectPageData, any>({
  data: {
    communities: FIXED_COMMUNITIES,
    selectedCommunityId: "",
    searchKeyword: "",
    filteredCommunities: FIXED_COMMUNITIES,
  },

  onLoad() {
    this.loadSelectedCommunity();
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
    const searchKeyword = e.detail.value;
    this.setData({
      searchKeyword,
    });
    this.searchCommunities(searchKeyword);
  },

  // 搜索社区
  searchCommunities(keyword: string = "") {
    const { communities } = this.data;
    const searchKeyword = keyword || this.data.searchKeyword;

    if (!searchKeyword.trim()) {
      this.setData({
        filteredCommunities: communities,
      });
      return;
    }

    const filteredCommunities = communities.filter(
      (community: Community) =>
        community.name.includes(searchKeyword) ||
        community.address.includes(searchKeyword)
    );

    this.setData({
      filteredCommunities,
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
      (c: Community) => c.id === selectedCommunityId
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
