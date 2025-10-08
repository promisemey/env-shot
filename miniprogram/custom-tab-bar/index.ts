import { UserRole } from "../utils/auth";

Component<
  {
    selected: number;
    color: string;
    selectedColor: string;
    list: Array<{
      pagePath: string;
      text: string;
      iconName: string;
    }>;
  },
  {},
  any
>({
  data: {
    selected: 0,
    color: "#666666",
    selectedColor: "#0052d9",
    list: [],
  },

  attached() {
    // 初始化 tabBar 列表
    this.updateTabList();
  },

  ready() {
    console.log("tabBar ready", this.data);
    // 页面渲染完成后设置选中状态
    // this.updateTabBar();
  },

  methods: {
    // 更新 tabBar 列表
    updateTabList() {
      const userInfo = wx.getStorageSync("userInfo") || { role: UserRole.USER };

      let list = [
        { pagePath: "/pages/index/index", text: "首页", iconName: "home" },
        { pagePath: "/pages/user/user", text: "我的", iconName: "user" },
      ];

      // 管理员显示管理页
      if (userInfo.role === UserRole.ADMIN) {
        list.splice(1, 0, {
          pagePath: "/pages/admin/admin",
          text: "管理",
          iconName: "setting",
        });
      }

      this.setData({ list });
    },

    // 更新选中状态
    updateTabBar() {
      const pages = getCurrentPages();
      if (pages.length === 0) {
        this.setData({ selected: 0 });
        return;
      }

      const currentPage = pages[pages.length - 1];
      const currentRoute = currentPage.route; // 注意 route 不带前缀 '/'

      const selected = this.data.list.findIndex(
        (item) => item.pagePath.replace(/^\//, "") === currentRoute
      );

      this.setData({ selected: selected !== -1 ? selected : 0 });
    },

    // tab 切换事件
    onChange(e: any) {
      const { value } = e.detail;
      const item = this.data.list[value];
      if (!item) return;

      // 立即更新选中状态，避免闪烁
      this.setData({ selected: value });

      wx.switchTab({
        url: item.pagePath,
        fail: () => this.updateTabBar(),
      });
    },
  },
});
