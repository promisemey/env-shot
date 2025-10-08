// pages/login/login.ts
import { userApi } from "../../services/api";
import { AuthManager } from "../../utils/auth";

interface LoginPageData {
  phone: string;
  code: string;
  codeBtnText: string;
  codeBtnDisabled: boolean;
  loginBtnText: string;
  loginBtnDisabled: boolean;
  countdown: number;
  wechatLoginText: string;
  wechatLoginDisabled: boolean;
}

Page<LoginPageData, any>({
  data: {
    phone: "",
    code: "",
    codeBtnText: "获取验证码",
    codeBtnDisabled: false,
    loginBtnText: "登录",
    loginBtnDisabled: false,
    countdown: 0,
    wechatLoginText: "微信一键登录",
    wechatLoginDisabled: false,
  },

  onLoad() {
    // 检查是否已登录
    const token = wx.getStorageSync("token");
    if (token) {
      this.checkLoginStatus();
    }
  },

  // 检查登录状态
  async checkLoginStatus() {
    try {
      const userInfo = wx.getStorageSync("userInfo");
      if (userInfo && userInfo.user_id) {
        const res = await userApi.getUserInfoById(userInfo.user_id);
        if (res.code === 200 && res.data) {
          wx.setStorageSync("userInfo", res.data);
          wx.switchTab({
            url: "/pages/index/index",
          });
        }
      }
    } catch (error) {
      console.error("检查登录状态失败:", error);
      wx.removeStorageSync("token");
    }
  },

  // 手机号输入
  onPhoneInput(e: any) {
    this.setData({
      phone: e.detail.value,
    });
  },

  // 验证码输入
  onCodeInput(e: any) {
    this.setData({
      code: e.detail.value,
    });
  },

  // 发送验证码
  async sendCode() {
    const { phone } = this.data;

    if (!phone) {
      wx.showToast({
        title: "请输入手机号",
        icon: "none",
      });
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: "请输入正确的手机号",
        icon: "none",
      });
      return;
    }

    try {
      this.setData({
        codeBtnDisabled: true,
        codeBtnText: "发送中...",
      });

      // 模拟发送验证码成功
      wx.showToast({
        title: "验证码已发送",
        icon: "success",
      });
      this.startCountdown();
    } catch (error) {
      console.error("发送验证码失败:", error);
      wx.showToast({
        title: "发送失败，请重试",
        icon: "none",
      });
      this.setData({
        codeBtnDisabled: false,
        codeBtnText: "获取验证码",
      });
    }
  },

  // 开始倒计时
  startCountdown() {
    let countdown = 60;
    this.setData({ countdown });

    const timer = setInterval(() => {
      countdown--;
      this.setData({ countdown });

      if (countdown <= 0) {
        clearInterval(timer);
        this.setData({
          codeBtnDisabled: false,
          codeBtnText: "获取验证码",
          countdown: 0,
        });
      } else {
        this.setData({
          codeBtnText: `${countdown}s后重发`,
        });
      }
    }, 1000);
  },

  // 登录
  async login() {
    const { phone, code } = this.data;

    if (!phone) {
      wx.showToast({
        title: "请输入手机号",
        icon: "none",
      });
      return;
    }

    if (!code) {
      wx.showToast({
        title: "请输入验证码",
        icon: "none",
      });
      return;
    }

    try {
      this.setData({
        loginBtnDisabled: true,
        loginBtnText: "登录中...",
      });

      // 调用登录API
      const res = await userApi.loginByPhone(phone, code);

      if (res.code === 200 && res.data) {
        // 保存用户信息和token
        wx.setStorageSync("token", res.data.token);
        wx.setStorageSync("userInfo", res.data.user);

        wx.showToast({
          title: "登录成功",
          icon: "success",
        });

        wx.switchTab({
          url: "/pages/index/index",
        });
      } else {
        wx.showToast({
          title: res.message || "登录失败",
          icon: "none",
        });
        this.setData({
          loginBtnDisabled: false,
          loginBtnText: "登录",
        });
      }
    } catch (error) {
      console.error("登录失败:", error);
      wx.showToast({
        title: "登录失败，请重试",
        icon: "none",
      });
      this.setData({
        loginBtnDisabled: false,
        loginBtnText: "登录",
      });
    }
  },

  // 显示隐私政策
  showPrivacy() {
    wx.showModal({
      title: "隐私政策",
      content: "我们重视您的隐私保护，详细内容请查看完整隐私政策。",
      showCancel: false,
    });
  },

  // 显示服务条款
  showTerms() {
    wx.showModal({
      title: "服务条款",
      content: "使用本服务即表示您同意相关服务条款。",
      showCancel: false,
    });
  },

  // 微信授权登录回调
  async onGetUserInfo(e: any) {
    console.log("微信授权回调:", e);

    if (e.detail.errMsg === "getUserInfo:ok") {
      // 用户同意授权
      await this.handleWechatLogin(e.detail);
    } else {
      // 用户拒绝授权
      wx.showToast({
        title: "需要授权才能登录",
        icon: "none",
      });
    }
  },

  // 处理微信登录
  async handleWechatLogin(userInfo: any) {
    try {
      this.setData({
        wechatLoginDisabled: true,
        wechatLoginText: "登录中...",
      });

      // 1. 获取微信登录code
      const loginCode = await this.getWechatLoginCode();

      // 2. 准备登录数据
      const loginData = {
        code: loginCode.code,
        userInfo: userInfo.userInfo,
        rawData: userInfo.rawData,
        signature: userInfo.signature,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv,
      };

      console.log("微信登录数据:", loginData);

      // 3. 调用后端微信登录接口
      const wechatLoginData = {
        code: loginCode.code,
        nickname: userInfo.userInfo?.nickName,
        avatar: userInfo.userInfo?.avatarUrl,
      };

      const res = await userApi.loginByWechat(wechatLoginData);

      if (res.code === 200 && res.data) {
        // 保存用户信息和token
        wx.setStorageSync("token", res.data.token);
        wx.setStorageSync("userInfo", res.data.user);

        wx.showToast({
          title: "登录成功",
          icon: "success",
        });

        // 根据用户角色跳转到对应页面
        setTimeout(() => {
          const defaultPage = AuthManager.getDefaultPageForRole();
          if (defaultPage.includes("admin") || defaultPage.includes("user")) {
            wx.switchTab({
              url: defaultPage,
            });
          } else {
            wx.switchTab({
              url: "/pages/index/index",
            });
          }
        }, 1500);
      } else {
        throw new Error(res.message || "微信登录失败");
      }
    } catch (error) {
      console.error("微信登录失败:", error);

      let errorMessage = "微信登录失败";
      if (error instanceof Error) {
        if (error.message.includes("网络")) {
          errorMessage = "网络连接失败，请重试";
        } else {
          errorMessage = error.message;
        }
      }

      wx.showToast({
        title: errorMessage,
        icon: "none",
        duration: 2000,
      });
    } finally {
      this.setData({
        wechatLoginDisabled: false,
        wechatLoginText: "微信一键登录",
      });
    }
  },

  // 获取微信登录code
  getWechatLoginCode(): Promise<{ code: string }> {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve({ code: res.code });
          } else {
            reject(new Error("获取微信登录凭证失败"));
          }
        },
        fail: (err) => {
          console.error("微信登录失败:", err);
          reject(new Error("获取登录凭证失败"));
        },
      });
    });
  },
});
