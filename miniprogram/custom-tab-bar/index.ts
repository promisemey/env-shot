Component({
  data: {
    selected: 0,
    color: "#666666",
    selectedColor: "#0052d9",
    list: [],
  },

  attached() {
    this.updateTabBar();
  },

  methods: {
    updateTabBar() {
      // 获取用户信息
      const userInfo = wx.getStorageSync("userInfo") || { role: "user" };

      // 根据用户权限配置 tabBar 列表
      let list = [
        {
          pagePath: "/pages/index/index",
          text: "首页",
          iconName: "home",
        },
        {
          pagePath: "/pages/user/user",
          text: "我的",
          iconName: "user",
        },
      ];

      // 只有管理员才显示管理页面
      if (userInfo.role === "admin") {
        list.splice(1, 0, {
          pagePath: "/pages/admin/admin",
          text: "管理",
          iconName: "setting",
        });
      }

      this.setData({
        list: list,
      });

      // 设置当前选中的 tab
      this.updateSelected();
    },

    updateSelected() {
      const pages = getCurrentPages();
      if (pages.length === 0) {
        // 默认选中首页
        this.setData({ selected: 0 });
        return;
      }

      const currentPage = pages[pages.length - 1];
      const currentPath = `/${currentPage.route}`;

      const selected = this.data.list.findIndex(
        (item) => item.pagePath === currentPath
      );

      // 如果找到匹配的页面，设置选中状态；否则默认选中首页
      this.setData({
        selected: selected !== -1 ? selected : 0,
      });
    },

    onChange(e: any) {
      const { value } = e.detail;
      const item = this.data.list[value];

      if (item) {
        // 立即更新选中状态，避免闪烁
        this.setData({
          selected: value,
        });

        wx.switchTab({
          url: item.pagePath,
          fail: () => {
            // 如果跳转失败，恢复之前的选中状态
            this.updateSelected();
          },
        });
      }
    },
  },
});
