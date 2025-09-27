import {
  User,
  Community,
  EnvironmentProblem,
  ApiResponse,
  PaginatedResponse,
} from "../types/index";
import { mockUsers, mockCommunities, mockProblems } from "./data";

// 模拟延迟
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 模拟用户相关API
export const mockUserApi = {
  // 手机号登录
  loginByPhone: async (
    phone: string,
    code: string
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    await delay();

    // 简单验证逻辑
    if (code === "123456") {
      const user = mockUsers.find((u) => u.phone === phone) || mockUsers[0];
      return {
        success: true,
        data: {
          user,
          token: "mock-token-" + Date.now(),
        },
      };
    }

    return {
      success: false,
      message: "验证码错误",
    };
  },

  // 发送验证码
  sendSmsCode: async (phone: string): Promise<ApiResponse> => {
    await delay(200);
    return {
      success: true,
      message: "验证码已发送",
    };
  },

  // 获取用户信息
  getUserInfo: async (): Promise<ApiResponse<User>> => {
    await delay();
    return {
      success: true,
      data: mockUsers[0],
    };
  },

  // 更新用户信息
  updateUserInfo: async (
    userInfo: Partial<User>
  ): Promise<ApiResponse<User>> => {
    await delay();
    const updatedUser = { ...mockUsers[0], ...userInfo };

    return {
      success: true,
      data: updatedUser,
    };
  },
};

// 模拟社区相关API
export const mockCommunityApi = {
  // 获取所有社区列表
  getCommunities: async (): Promise<ApiResponse<Community[]>> => {
    await delay();
    return {
      success: true,
      data: mockCommunities,
    };
  },

  // 根据ID获取社区信息
  getCommunityById: async (id: string): Promise<ApiResponse<Community>> => {
    await delay();
    const community = mockCommunities.find((c) => c.id === id);

    if (community) {
      return {
        success: true,
        data: community,
      };
    }

    return {
      success: false,
      message: "社区不存在",
    };
  },

  // 创建社区（管理员功能）
  createCommunity: async (
    community: Omit<Community, "id" | "createTime" | "updateTime">
  ): Promise<ApiResponse<Community>> => {
    await delay();

    const newCommunity: Community = {
      ...community,
      id: "community-" + Date.now(),
      createTime: Date.now(),
      updateTime: Date.now(),
    };

    mockCommunities.push(newCommunity);

    return {
      success: true,
      data: newCommunity,
    };
  },
};

// 模拟环境问题相关API
export const mockProblemApi = {
  // 获取问题列表
  getProblems: async (
    params: {
      communityId?: string;
      status?: string;
      category?: string;
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<PaginatedResponse<EnvironmentProblem>> => {
    await delay();

    const { communityId, status, category, page = 1, pageSize = 10 } = params;

    let filteredProblems = [...mockProblems];

    if (communityId) {
      filteredProblems = filteredProblems.filter(
        (p) => p.communityId === communityId
      );
    }

    if (status) {
      filteredProblems = filteredProblems.filter((p) => p.status === status);
    }

    if (category) {
      filteredProblems = filteredProblems.filter(
        (p) => p.category === category
      );
    }

    const total = filteredProblems.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProblems = filteredProblems.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedProblems,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  // 根据ID获取问题详情
  getProblemById: async (
    id: string
  ): Promise<ApiResponse<EnvironmentProblem>> => {
    await delay();
    const problem = mockProblems.find((p) => p.id === id);

    if (problem) {
      return {
        success: true,
        data: problem,
      };
    }

    return {
      success: false,
      message: "问题不存在",
    };
  },

  // 创建问题
  createProblem: async (
    problem: Omit<EnvironmentProblem, "id" | "createTime" | "updateTime">
  ): Promise<ApiResponse<EnvironmentProblem>> => {
    await delay();

    const newProblem: EnvironmentProblem = {
      ...problem,
      id: "problem-" + Date.now(),
      createTime: Date.now(),
      updateTime: Date.now(),
      status: "pending",
    };

    mockProblems.push(newProblem);

    return {
      success: true,
      data: newProblem,
    };
  },

  // 更新问题状态
  updateProblemStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<EnvironmentProblem>> => {
    await delay();
    const problemIndex = mockProblems.findIndex((p) => p.id === id);

    if (problemIndex !== -1) {
      mockProblems[problemIndex] = {
        ...mockProblems[problemIndex],
        status,
        updateTime: Date.now(),
      };

      return {
        success: true,
        data: mockProblems[problemIndex],
      };
    }

    return {
      success: false,
      message: "问题不存在",
    };
  },

  // 上传整改照片
  uploadFixPhotos: async (
    id: string,
    photos: string[],
    description?: string
  ): Promise<ApiResponse<EnvironmentProblem>> => {
    await delay();
    const problemIndex = mockProblems.findIndex((p) => p.id === id);

    if (problemIndex !== -1) {
      mockProblems[problemIndex] = {
        ...mockProblems[problemIndex],
        fixPhotos: photos,
        fixDescription: description,
        status: "fixed",
        updateTime: Date.now(),
      };

      return {
        success: true,
        data: mockProblems[problemIndex],
      };
    }

    return {
      success: false,
      message: "问题不存在",
    };
  },
};

// 模拟文件上传API
export const mockUploadApi = {
  // 上传图片
  uploadImage: async (
    filePath: string
  ): Promise<ApiResponse<{ url: string }>> => {
    await delay(1000); // 模拟上传时间

    // 模拟上传成功，返回一个假的图片URL
    const mockImageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;

    return {
      success: true,
      data: {
        url: mockImageUrl,
      },
    };
  },

  // 批量上传图片
  uploadImages: async (
    filePaths: string[]
  ): Promise<ApiResponse<{ urls: string[] }>> => {
    try {
      const uploadPromises = filePaths.map((filePath) =>
        mockUploadApi.uploadImage(filePath)
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
