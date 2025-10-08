import {
  User,
  Community,
  ProblemType,
  EnvironmentProblem,
  ApiResponse,
} from "../types/index";
import {
  mockUsers,
  mockCommunities,
  mockProblems,
  mockProblemTypes,
} from "./data";

// 模拟延迟
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 模拟用户相关API
export const mockUserApi = {
  // 手机号登录
  loginByPhone: async (
    phone: string,
    code?: string
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    await delay();

    const user = mockUsers.find((u) => u.phone === phone) || mockUsers[0];
    return {
      code: 200,
      message: "登录成功",
      data: {
        user,
        token: "mock-token-" + Date.now(),
      },
    };
  },

  // 微信登录
  loginByWechat: async (loginData: {
    code: string;
    nickname?: string;
    avatar?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    await delay();

    const mockWechatUser: User = {
      user_id: `wechat_user_${Date.now()}`,
      phone: "",
      openid: `openid_${Date.now()}`,
      nickname: loginData.nickname || "微信用户",
      avatar: loginData.avatar || "https://dummyimage.com/200x200",
      role: 0,
      community_id: mockCommunities[0].community_id,
      created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    return {
      code: 200,
      message: "微信登录成功",
      data: {
        user: mockWechatUser,
        token: "wechat-token-" + Date.now(),
      },
    };
  },

  // 获取用户信息
  getUserInfoById: async (user_id: string): Promise<ApiResponse<User>> => {
    await delay();
    const user = mockUsers.find((u) => u.user_id === user_id);

    if (user) {
      return {
        code: 200,
        message: "获取成功",
        data: user,
      };
    }

    return {
      code: 404,
      message: "用户不存在",
    };
  },

  // 获取指定社区所有用户
  getUserByCommunityId: async (
    community_id?: string
  ): Promise<ApiResponse<User[]>> => {
    await delay();

    let filteredUsers = mockUsers;
    if (community_id) {
      filteredUsers = mockUsers.filter((u) => u.community_id === community_id);
    }

    return {
      code: 200,
      message: "获取成功",
      data: filteredUsers,
    };
  },

  // 设置用户所属社区
  setUserCommunityById: async (
    user_id: string,
    community_id: string
  ): Promise<ApiResponse> => {
    await delay();

    const userIndex = mockUsers.findIndex((u) => u.user_id === user_id);
    if (userIndex !== -1) {
      mockUsers[userIndex].community_id = community_id;
      return {
        code: 200,
        message: "设置成功",
      };
    }

    return {
      code: 404,
      message: "用户不存在",
    };
  },

  // 删除用户
  deleteUserById: async (user_id: string): Promise<ApiResponse<User>> => {
    await delay();

    const userIndex = mockUsers.findIndex((u) => u.user_id === user_id);
    if (userIndex !== -1) {
      const deletedUser = mockUsers.splice(userIndex, 1)[0];
      return {
        code: 200,
        message: "删除成功",
        data: deletedUser,
      };
    }

    return {
      code: 404,
      message: "用户不存在",
    };
  },

  // 更新用户角色
  updateUserRoleById: async (
    user_id: string,
    role: number
  ): Promise<ApiResponse<User>> => {
    await delay();

    const userIndex = mockUsers.findIndex((u) => u.user_id === user_id);
    if (userIndex !== -1) {
      mockUsers[userIndex].role = role;
      return {
        code: 200,
        message: "操作成功",
        data: mockUsers[userIndex],
      };
    }

    return {
      code: 404,
      message: "用户不存在",
    };
  },
};

// 模拟社区相关API
export const mockCommunityApi = {
  // 获取所有社区列表
  getAllCommunity: async (): Promise<ApiResponse<Community[]>> => {
    await delay();
    return {
      code: 200,
      message: "获取成功",
      data: mockCommunities,
    };
  },

  // 创建社区（管理员功能）
  createCommunity: async (
    community_text: string
  ): Promise<ApiResponse<Community>> => {
    await delay();

    const newCommunity: Community = {
      community_id: "community-" + Date.now(),
      community_text,
    };

    mockCommunities.push(newCommunity);

    return {
      code: 200,
      message: "创建成功",
      data: newCommunity,
    };
  },

  // 更新社区名称
  updateCommunityById: async (
    community_id: string,
    community_text: string
  ): Promise<ApiResponse<{ current_community: Community }>> => {
    await delay();

    const communityIndex = mockCommunities.findIndex(
      (c) => c.community_id === community_id
    );
    if (communityIndex !== -1) {
      mockCommunities[communityIndex].community_text = community_text;
      return {
        code: 200,
        message: "修改成功",
        data: {
          current_community: mockCommunities[communityIndex],
        },
      };
    }

    return {
      code: 404,
      message: "社区不存在",
    };
  },

  // 删除社区
  deleteCommunityById: async (
    community_id: string
  ): Promise<ApiResponse<{ community_id: string }>> => {
    await delay();

    const communityIndex = mockCommunities.findIndex(
      (c) => c.community_id === community_id
    );
    if (communityIndex !== -1) {
      mockCommunities.splice(communityIndex, 1);
      return {
        code: 200,
        message: "删除成功",
        data: { community_id },
      };
    }

    return {
      code: 404,
      message: "社区不存在",
    };
  },
};

// 模拟问题类型相关API
export const mockTypeApi = {
  // 获取所有问题类型
  getAllProblemType: async (): Promise<ApiResponse<ProblemType[]>> => {
    await delay();
    return {
      code: 200,
      message: "获取成功",
      data: mockProblemTypes,
    };
  },

  // 创建问题类型
  createProblemType: async (
    type_text: string
  ): Promise<ApiResponse<ProblemType>> => {
    await delay();

    const newType: ProblemType = {
      type_id: "type-" + Date.now(),
      type_text,
    };

    mockProblemTypes.push(newType);

    return {
      code: 200,
      message: "上传成功",
      data: newType,
    };
  },

  // 删除问题类型
  deleteProblemTypeById: async (
    type_id: string
  ): Promise<ApiResponse<{ type_id: string }>> => {
    await delay();

    const typeIndex = mockProblemTypes.findIndex((t) => t.type_id === type_id);
    if (typeIndex !== -1) {
      mockProblemTypes.splice(typeIndex, 1);
      return {
        code: 200,
        message: "删除成功",
        data: { type_id },
      };
    }

    return {
      code: 404,
      message: "问题类型不存在",
    };
  },
};

// 模拟环境问题相关API
export const mockProblemApi = {
  // 上传问题（含图片）
  uploadProblem: async (
    filePath: string,
    data: {
      title: string;
      community_id: string;
      type_id: string;
      location: string;
      user_id?: string;
    }
  ): Promise<ApiResponse<{ problem_id: string }>> => {
    await delay(1000);

    const problem_id = "problem-" + Date.now();
    const newProblem: EnvironmentProblem = {
      problem_id,
      user_id: data.user_id || mockUsers[0].user_id,
      community_id: data.community_id,
      type_id: data.type_id,
      title: data.title,
      location: data.location,
      image_path: `uploads/${Math.random().toString(16).substr(2, 12)}.jpg`,
      status: 0,
      created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    mockProblems.push(newProblem);

    return {
      code: 200,
      message: "上传成功",
      data: { problem_id },
    };
  },

  // 上传整改图片
  resolveProblem: async (
    filePath: string,
    data: {
      problem_id: string;
      user_id?: string;
    }
  ): Promise<ApiResponse> => {
    await delay(1000);

    const problemIndex = mockProblems.findIndex(
      (p) => p.problem_id === data.problem_id
    );
    if (problemIndex !== -1) {
      mockProblems[problemIndex] = {
        ...mockProblems[problemIndex],
        resolved_image_path: `uploads/${Math.random()
          .toString(16)
          .substr(2, 12)}.jpg`,
        status: 1,
        resolved_by: data.user_id || mockUsers[0].user_id,
        resolved_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      return {
        code: 200,
        message: "整改完成",
      };
    }

    return {
      code: 404,
      message: "问题不存在",
    };
  },

  // 按社区ID获取问题列表
  getProblemByCommunityId: async (
    community_id: string
  ): Promise<ApiResponse<EnvironmentProblem[]>> => {
    await delay();

    const filteredProblems = mockProblems.filter(
      (p) => p.community_id === community_id
    );

    return {
      code: 200,
      message: "获取成功",
      data: filteredProblems,
    };
  },

  // 按问题ID获取详情
  getProblemById: async (
    problem_id: string
  ): Promise<ApiResponse<EnvironmentProblem>> => {
    await delay();
    const problem = mockProblems.find((p) => p.problem_id === problem_id);

    if (problem) {
      return {
        code: 200,
        message: "获取成功",
        data: problem,
      };
    }

    return {
      code: 404,
      message: "问题不存在",
    };
  },

  // 按问题类型获取所有问题
  getProblemByTypeId: async (
    type_id: string
  ): Promise<ApiResponse<EnvironmentProblem[]>> => {
    await delay();

    const filteredProblems = mockProblems.filter((p) => p.type_id === type_id);

    return {
      code: 200,
      message: "获取成功",
      data: filteredProblems,
    };
  },

  // 按社区和类型获取问题
  getProblemByTypeIdAndCommunityId: async (
    type_id: string,
    community_id: string
  ): Promise<ApiResponse<EnvironmentProblem[]>> => {
    await delay();

    const filteredProblems = mockProblems.filter(
      (p) => p.type_id === type_id && p.community_id === community_id
    );

    return {
      code: 200,
      message: "获取成功",
      data: filteredProblems,
    };
  },
};
