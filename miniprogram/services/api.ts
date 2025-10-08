import {
  User,
  Community,
  ProblemType,
  EnvironmentProblem,
  ApiResponse,
} from "../types/index";
import { config } from "../config/index";
import {
  mockUserApi,
  mockCommunityApi,
  mockProblemApi,
  mockTypeApi,
} from "../mocks/api";

// API基础配置
const API_BASE_URL = config.apiBaseUrl;

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

// 文件上传方法
const uploadFile = (
  url: string,
  filePath: string,
  formData: any = {}
): Promise<ApiResponse<any>> => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${API_BASE_URL}${url}`,
      filePath: filePath,
      name: "image",
      formData: formData,
      header: {
        Authorization: wx.getStorageSync("token") || "",
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
};

// 用户相关API
export const userApi = {
  // 手机号登录
  loginByPhone: (
    phone: string,
    code?: string
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    if (config.enableMock) {
      return mockUserApi.loginByPhone(phone, code);
    }
    return request("/auth/loginByPhone", {
      method: "POST",
      data: { phone, code },
    });
  },

  // 微信登录
  loginByWechat: (loginData: {
    code: string;
    nickname?: string;
    avatar?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    if (config.enableMock) {
      return mockUserApi.loginByWechat(loginData);
    }
    return request("/auth/loginByWechat", {
      method: "POST",
      data: loginData,
    });
  },

  // 获取用户信息
  getUserInfoById: (user_id: string): Promise<ApiResponse<User>> => {
    if (config.enableMock) {
      return mockUserApi.getUserInfoById(user_id);
    }
    return request("/user/getUserInfoById", {
      method: "GET",
      data: { user_id },
    });
  },

  // 获取指定社区所有用户
  getUserByCommunityId: (
    community_id?: string
  ): Promise<ApiResponse<User[]>> => {
    if (config.enableMock) {
      return mockUserApi.getUserByCommunityId(community_id);
    }
    return request("/user/getUserByCommunityId", {
      method: "GET",
      data: { community_id },
    });
  },

  // 设置用户所属社区
  setUserCommunityById: (
    user_id: string,
    community_id: string
  ): Promise<ApiResponse> => {
    if (config.enableMock) {
      return mockUserApi.setUserCommunityById(user_id, community_id);
    }
    return request("/user/setUserCommunityById", {
      method: "PUT",
      data: { user_id, community_id },
    });
  },

  // 删除用户
  deleteUserById: (user_id: string): Promise<ApiResponse<User>> => {
    if (config.enableMock) {
      return mockUserApi.deleteUserById(user_id);
    }
    return request("/user/deleteUserById", {
      method: "DELETE",
      data: { user_id },
    });
  },

  // 更新用户角色
  updateUserRoleById: (
    user_id: string,
    role: number
  ): Promise<ApiResponse<User>> => {
    if (config.enableMock) {
      return mockUserApi.updateUserRoleById(user_id, role);
    }
    return request("/user/updateUserRoleById", {
      method: "PUT",
      data: { user_id, role },
    });
  },
};

// 社区相关API
export const communityApi = {
  // 获取所有社区列表
  getAllCommunity: (): Promise<ApiResponse<Community[]>> => {
    if (config.enableMock) {
      return mockCommunityApi.getAllCommunity();
    }
    return request("/community/getAllCommunity");
  },

  // 创建社区（管理员功能）
  createCommunity: (
    community_text: string
  ): Promise<ApiResponse<Community>> => {
    if (config.enableMock) {
      return mockCommunityApi.createCommunity(community_text);
    }
    return request("/community/createCommunity", {
      method: "POST",
      data: { community_text },
    });
  },

  // 更新社区名称
  updateCommunityById: (
    community_id: string,
    community_text: string
  ): Promise<ApiResponse<{ current_community: Community }>> => {
    if (config.enableMock) {
      return mockCommunityApi.updateCommunityById(community_id, community_text);
    }
    return request("/community/updateCommunityById", {
      method: "PUT",
      data: { community_id, community_text },
    });
  },

  // 删除社区
  deleteCommunityById: (
    community_id: string
  ): Promise<ApiResponse<{ community_id: string }>> => {
    if (config.enableMock) {
      return mockCommunityApi.deleteCommunityById(community_id);
    }
    return request("/community/deleteCommunityById", {
      method: "DELETE",
      data: { community_id },
    });
  },
};

// 问题类型相关API
export const typeApi = {
  // 获取所有问题类型
  getAllProblemType: (): Promise<ApiResponse<ProblemType[]>> => {
    if (config.enableMock) {
      return mockTypeApi.getAllProblemType();
    }
    return request("/type/getAllProblemType");
  },

  // 创建问题类型
  createProblemType: (type_text: string): Promise<ApiResponse<ProblemType>> => {
    if (config.enableMock) {
      return mockTypeApi.createProblemType(type_text);
    }
    return request("/type/createProblemType", {
      method: "POST",
      data: { type_text },
    });
  },

  // 删除问题类型
  deleteProblemTypeById: (
    type_id: string
  ): Promise<ApiResponse<{ type_id: string }>> => {
    if (config.enableMock) {
      return mockTypeApi.deleteProblemTypeById(type_id);
    }
    return request("/type/deleteProblemTypeById", {
      method: "DELETE",
      data: { type_id },
    });
  },
};

// 环境问题相关API
export const problemApi = {
  // 上传问题（含图片）
  uploadProblem: (
    filePath: string,
    data: {
      title: string;
      community_id: string;
      type_id: string;
      location: string;
      user_id?: string;
    }
  ): Promise<ApiResponse<{ problem_id: string }>> => {
    if (config.enableMock) {
      return mockProblemApi.uploadProblem(filePath, data);
    }
    return uploadFile("/problem/uploadProblem", filePath, data);
  },

  // 上传整改图片
  resolveProblem: (
    filePath: string,
    data: {
      problem_id: string;
      user_id?: string;
    }
  ): Promise<ApiResponse> => {
    if (config.enableMock) {
      return mockProblemApi.resolveProblem(filePath, data);
    }
    return uploadFile("/problem/resolveProblem", filePath, data);
  },

  // 按社区ID获取问题列表
  getProblemByCommunityId: (
    community_id: string
  ): Promise<ApiResponse<EnvironmentProblem[]>> => {
    if (config.enableMock) {
      return mockProblemApi.getProblemByCommunityId(community_id);
    }
    return request("/problem/getProblemByCommunityId", {
      method: "GET",
      data: { community_id },
    });
  },

  // 按问题ID获取详情
  getProblemById: (
    problem_id: string
  ): Promise<ApiResponse<EnvironmentProblem>> => {
    if (config.enableMock) {
      return mockProblemApi.getProblemById(problem_id);
    }
    return request("/problem/getProblemById", {
      method: "GET",
      data: { problem_id },
    });
  },

  // 按问题类型获取所有问题
  getProblemByTypeId: (
    type_id: string
  ): Promise<ApiResponse<EnvironmentProblem[]>> => {
    if (config.enableMock) {
      return mockProblemApi.getProblemByTypeId(type_id);
    }
    return request("/problem/getProblemByTypeId", {
      method: "GET",
      data: { type_id },
    });
  },

  // 按社区和类型获取问题
  getProblemByTypeIdAndCommunityId: (
    type_id: string,
    community_id: string
  ): Promise<ApiResponse<EnvironmentProblem[]>> => {
    if (config.enableMock) {
      return mockProblemApi.getProblemByTypeIdAndCommunityId(
        type_id,
        community_id
      );
    }
    return request("/problem/getProblemByTypeIdAndCommunityId", {
      method: "GET",
      data: { type_id, community_id },
    });
  },
};

// 工具函数
export const utils = {
  // 格式化时间
  formatTime: (dateString: string): string => {
    return dateString; // API返回的已经是格式化的时间字符串
  },

  // 获取状态颜色
  getStatusColor: (status: number): string => {
    const statusMap: { [key: number]: string } = {
      0: "#faad14", // 未整改
      1: "#52c41a", // 已整改
    };
    return statusMap[status] || "#666666";
  },

  // 获取状态文本
  getStatusText: (status: number): string => {
    const statusMap: { [key: number]: string } = {
      0: "未整改",
      1: "已整改",
    };
    return statusMap[status] || "未知";
  },

  // 获取角色文本
  getRoleText: (role: number): string => {
    const roleMap: { [key: number]: string } = {
      0: "普通用户",
      1: "管理员",
    };
    return roleMap[role] || "未知";
  },

  // 构建图片完整URL
  getImageUrl: (imagePath: string): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL.replace("/api", "")}/${imagePath}`;
  },
};
