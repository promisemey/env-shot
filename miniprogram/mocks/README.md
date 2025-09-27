# 小程序 Mock 服务使用指南

本项目使用简单的 Mock 方案来模拟 API 接口，适用于微信小程序开发环境。

## 🚀 快速开始

### 1. 启用 Mock

在 `miniprogram/config/index.ts` 中设置：

```typescript
export const config = {
  enableMock: true, // 开发时设为 true
  apiBaseUrl: "https://your-api-domain.com/api",
};
```

### 2. 测试接口

访问 `/pages/mock-test/mock-test` 页面测试所有 Mock 接口。

## 📁 文件结构

```
miniprogram/mocks/
├── README.md          # 使用说明
├── data.ts           # 模拟数据
└── api.ts            # Mock API 实现
```

## 🔧 Mock 功能

### 用户相关

- ✅ 手机号登录 (验证码: `123456`)
- ✅ 发送验证码
- ✅ 获取用户信息
- ✅ 更新用户信息

### 社区相关

- ✅ 获取社区列表
- ✅ 获取社区详情
- ✅ 创建社区

### 问题相关

- ✅ 获取问题列表 (支持分页和筛选)
- ✅ 获取问题详情
- ✅ 创建问题
- ✅ 更新问题状态
- ✅ 上传整改照片

### 文件上传

- ✅ 图片上传 (返回模拟 URL)

## 📊 模拟数据

### 用户数据

- 3 个测试用户 (1 个管理员 + 2 个普通用户)
- 手机号: `13800138000`, `13800138001`, `13800138002`

### 社区数据

- 3 个测试社区 (阳光花园、绿城小区、和谐家园)

### 问题数据

- 5 个测试问题 (不同状态和类别)

## 🎯 工作原理

Mock 服务通过在 API 调用时检查 `config.enableMock` 配置来决定是否使用 Mock 数据：

```typescript
// 示例：用户登录
loginByPhone: (phone: string, code: string) => {
  if (config.enableMock) {
    return mockUserApi.loginByPhone(phone, code); // 使用 Mock
  }
  return request("/user/login", { ... }); // 使用真实 API
}
```

## 📝 添加新的 Mock 接口

### 1. 在 data.ts 中添加模拟数据

```typescript
export const mockNewData = [
  // 你的模拟数据
];
```

### 2. 在 api.ts 中添加 Mock 实现

```typescript
export const mockNewApi = {
  getData: async (): Promise<ApiResponse<NewDataType>> => {
    await delay();
    return {
      success: true,
      data: mockNewData,
    };
  },
};
```

### 3. 在 services/api.ts 中集成

```typescript
export const newApi = {
  getData: (): Promise<ApiResponse<NewDataType>> => {
    if (config.enableMock) {
      return mockNewApi.getData();
    }
    return request("/new-endpoint");
  },
};
```

## ⚙️ 配置管理

### 开发环境

```typescript
// miniprogram/config/index.ts
export const config = {
  enableMock: true, // 启用 Mock
  apiBaseUrl: "https://your-api-domain.com/api",
};
```

### 生产环境

```typescript
// miniprogram/config/index.ts
export const config = {
  enableMock: false, // 禁用 Mock
  apiBaseUrl: "https://your-production-api.com/api",
};
```

## 🔍 调试

### 查看 Mock 状态

在测试页面 `/pages/mock-test/mock-test` 可以查看当前 Mock 状态。

### 控制台输出

Mock API 会在控制台输出相关信息，方便调试。

## ⚠️ 注意事项

1. **生产环境**: 确保在生产环境中禁用 Mock (`enableMock: false`)
2. **数据持久化**: Mock 数据在内存中，重新启动应用会重置
3. **接口一致性**: 确保 Mock 接口与真实 API 接口保持一致
4. **错误处理**: Mock 接口也应该模拟各种错误情况

## 🎊 优势

- ✅ 无需外部依赖，纯 TypeScript 实现
- ✅ 完全兼容微信小程序环境
- ✅ 简单易用，易于维护
- ✅ 支持异步操作和延迟模拟
- ✅ 可以模拟各种业务场景

## 📚 更多信息

- 查看 `/pages/mock-test/mock-test` 页面测试所有接口
- 在 `miniprogram/config/index.ts` 中管理配置
- 所有 Mock 数据都在 `data.ts` 中定义
