// pages/login/login.ts
import { userApi } from "../../services/api";
import { AuthManager } from "../../utils/auth";
import { User } from "../../types/index";

interface LoginPageData {
  phone: string;
  code: string;
  codeBtnText: string;
  codeBtnDisabled: boolean;
  loginBtnText: string;
  loginBtnDisabled: boolean;
  countdown: number;
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
      const res = await userApi.getUserInfo();
      if (res.success && res.data) {
        wx.setStorageSync("userInfo", res.data);
        wx.switchTab({
          url: "/pages/index/index",
        });
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

      const res = await userApi.sendSmsCode(phone);

      if (res.success) {
        wx.showToast({
          title: "验证码已发送",
          icon: "success",
        });
        this.startCountdown();
      } else {
        wx.showToast({
          title: res.message || "发送失败",
          icon: "none",
        });
        this.setData({
          codeBtnDisabled: false,
          codeBtnText: "获取验证码",
        });
      }
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

      // 模拟登录逻辑 - 根据手机号判断用户角色
      let userRole: "admin" | "user" = "user";
      let userName = "普通用户";
      let communityId = "1"; // 默认社区

      // 管理员手机号规则：以138开头的为管理员
      if (phone.startsWith("138")) {
        userRole = "admin";
        userName = "系统管理员";
        communityId = ""; // 管理员不固定社区
      } else {
        // 普通用户根据手机号后两位分配社区
        const lastTwoDigits = parseInt(phone.slice(-2));
        communityId = String((lastTwoDigits % 13) + 1);
      }

      // 构造用户信息
      const mockUser: User = {
        id: `user_${phone}`,
        phone: phone,
        name: userName,
        role: userRole,
        communityId: userRole === "user" ? communityId : undefined,
        createTime: Date.now(),
        updateTime: Date.now(),
      };

      // 模拟token
      const mockToken = `mock_token_${Date.now()}_${phone}`;

      // 保存用户信息和token
      wx.setStorageSync("token", mockToken);
      wx.setStorageSync("userInfo", mockUser);

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

      // 原有的API调用逻辑（注释掉，供参考）
      /*
      const res = await userApi.loginByPhone(phone, code);

      if (res.success && res.data) {
        // 保存用户信息和token
        wx.setStorageSync("token", res.data.token);
        wx.setStorageSync("userInfo", res.data.user);

        wx.showToast({
          title: "登录成功",
          icon: "success",
        });

        // 跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: "/pages/index/index",
          });
        }, 1500);
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
      */
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
});
