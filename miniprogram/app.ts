// app.ts
App<IAppOption>({
  globalData: {},
  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync("token");
    if (!token) {
      // 未登录，跳转到登录页
      wx.redirectTo({
        url: "/pages/login/login",
      });
    }
  },

  // 全局方法：显示加载中
  showLoading(title: string = "加载中...") {
    wx.showLoading({
      title,
      mask: true,
    });
  },

  // 全局方法：隐藏加载中
  hideLoading() {
    wx.hideLoading();
  },

  // 全局方法：显示提示
  showToast(
    title: string,
    icon: "success" | "error" | "loading" | "none" = "none"
  ) {
    wx.showToast({
      title,
      icon,
      duration: 2000,
    });
  },
});
