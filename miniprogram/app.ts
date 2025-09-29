// app.ts
import { FontLoader } from "./utils/font-loader";

App<IAppOption>({
  globalData: {
    userInfo: null,
  },
  onLaunch() {
    // 初始化字体加载器
    FontLoader.init();

    // 检查登录状态
    this.checkLoginStatus();
    // 初始化用户信息
    this.initUserInfo();
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

  // 初始化用户信息
  initUserInfo() {
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },

  // 更新用户信息
  updateUserInfo(userInfo: any) {
    this.globalData.userInfo = userInfo;
    wx.setStorageSync("userInfo", userInfo);
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
