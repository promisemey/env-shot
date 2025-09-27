import {
  User,
  Community,
  EnvironmentProblem,
  ApiResponse,
  PaginatedResponse,
} from "../types/index";

// API基础配置
const API_BASE_URL = "https://your-api-domain.com/api"; // 替换为实际的API地址

// 通用请求方法
const request = <T>(
  url: string,
  options: any = {}
): Promise<ApiResponse<T>> => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${url}`,
      method: options.method || "GET",
      data: options.data,
      header: {
        "Content-Type": "application/json",
        Authorization: wx.getStorageSync("token") || "",
        ...options.header,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data as ApiResponse<T>);
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// 用户相关API
export const userApi = {
  // 手机号登录
  loginByPhone: (
    phone: string,
    code: string
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    return request("/user/login", {
      method: "POST",
      data: { phone, code },
    });
  },

  // 发送验证码
  sendSmsCode: (phone: string): Promise<ApiResponse> => {
    return request("/user/send-sms", {
      method: "POST",
      data: { phone },
    });
  },

  // 获取用户信息
  getUserInfo: (): Promise<ApiResponse<User>> => {
    return request("/user/info");
  },

  // 更新用户信息
  updateUserInfo: (userInfo: Partial<User>): Promise<ApiResponse<User>> => {
    return request("/user/update", {
      method: "PUT",
      data: userInfo,
    });
  },
};

// 社区相关API
export const communityApi = {
  // 获取所有社区列表
  getCommunities: (): Promise<ApiResponse<Community[]>> => {
    return request("/communities");
  },

  // 根据ID获取社区信息
  getCommunityById: (id: string): Promise<ApiResponse<Community>> => {
    return request(`/communities/${id}`);
  },

  // 创建社区（管理员功能）
  createCommunity: (
    community: Omit<Community, "id" | "createTime" | "updateTime">
  ): Promise<ApiResponse<Community>> => {
    return request("/communities", {
      method: "POST",
      data: community,
    });
  },
};

// 环境问题相关API
export const problemApi = {
  // 获取问题列表
  getProblems: (
    params: {
      communityId?: string;
      status?: string;
      category?: string;
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<PaginatedResponse<EnvironmentProblem>> => {
    return request("/problems", {
      data: params,
    });
  },

  // 根据ID获取问题详情
  getProblemById: (id: string): Promise<ApiResponse<EnvironmentProblem>> => {
    return request(`/problems/${id}`);
  },

  // 创建问题
  createProblem: (
    problem: Omit<EnvironmentProblem, "id" | "createTime" | "updateTime">
  ): Promise<ApiResponse<EnvironmentProblem>> => {
    return request("/problems", {
      method: "POST",
      data: problem,
    });
  },

  // 更新问题状态
  updateProblemStatus: (
    id: string,
    status: string
  ): Promise<ApiResponse<EnvironmentProblem>> => {
    return request(`/problems/${id}/status`, {
      method: "PUT",
      data: { status },
    });
  },

  // 上传整改照片
  uploadFixPhotos: (
    id: string,
    photos: string[],
    description?: string
  ): Promise<ApiResponse<EnvironmentProblem>> => {
    return request(`/problems/${id}/fix`, {
      method: "PUT",
      data: { photos, description },
    });
  },
};

// 文件上传API
export const uploadApi = {
  // 上传图片
  uploadImage: (filePath: string): Promise<ApiResponse<{ url: string }>> => {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync("token");

      wx.uploadFile({
        url: `${API_BASE_URL}/upload/image`,
        filePath: filePath,
        name: "file",
        header: {
          Authorization: token || "",
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data);
            resolve(data);
          } catch (e) {
            reject(new Error("上传失败"));
          }
        },
        fail: reject,
      });
    });
  },

  // 批量上传图片
  uploadImages: async (
    filePaths: string[]
  ): Promise<ApiResponse<{ urls: string[] }>> => {
    try {
      const uploadPromises = filePaths.map((filePath) =>
        uploadApi.uploadImage(filePath)
      );
      const results = await Promise.all(uploadPromises);

      const urls = results.map((result) => result.data?.url).filter(Boolean);

      return {
        success: true,
        data: { urls },
      };
    } catch (error) {
      return {
        success: false,
        message: "批量上传失败",
      };
    }
  },
};

// 工具函数
export const utils = {
  // 格式化时间
  formatTime: (timestamp: number): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  // 获取状态颜色
  getStatusColor: (status: string): string => {
    const statusMap: { [key: string]: string } = {
      pending: "#faad14",
      processing: "#1890ff",
      fixed: "#52c41a",
      closed: "#666666",
    };
    return statusMap[status] || "#666666";
  },

  // 获取严重程度颜色
  getSeverityColor: (severity: string): string => {
    const severityMap: { [key: string]: string } = {
      low: "#52c41a",
      medium: "#faad14",
      high: "#f5222d",
    };
    return severityMap[severity] || "#666666";
  },
};

