# 社区环境问题管理小程序

这是一个基于微信小程序开发的社区环境问题管理系统，支持管理员和普通用户两种角色，实现环境问题的上报、整改和监控功能。

## 功能特性

### 🔐 用户认证

- 手机号验证码登录
- 用户角色管理（管理员/普通用户）
- 自动登录状态检查

### 👨‍💼 管理员功能

- **社区选择**: 选择要管理的社区
- **问题上传**: 拍照上传环境问题，支持多张照片
- **问题监控**: 监控各社区问题整改情况
- **状态管理**: 更新问题处理状态（待处理 → 处理中 → 已整改 → 已关闭）

### 👤 普通用户功能

- **问题查看**: 查看当前社区的环境问题列表
- **问题详情**: 查看问题详细信息、照片和位置
- **整改上传**: 上传问题整改后的照片
- **活动记录**: 查看个人贡献和活动历史

### 📊 数据统计

- 问题总数、待处理、已整改等统计
- 整改率计算
- 个人贡献统计

## 技术架构

### 前端技术栈

- **框架**: 微信小程序原生开发
- **语言**: TypeScript
- **样式**: SCSS
- **组件**: 自定义组件 + 微信原生组件

### 项目结构

```
miniprogram/
├── app.ts                 # 应用入口
├── app.json              # 应用配置
├── app.scss              # 全局样式
├── types/                # 类型定义
│   └── index.ts
├── services/             # API服务
│   └── api.ts
├── pages/                # 页面
│   ├── login/            # 登录页
│   ├── index/            # 首页
│   ├── admin/            # 管理员页面
│   │   ├── admin.wxml    # 管理员主页
│   │   ├── community-select/  # 社区选择
│   │   ├── problem-upload/   # 问题上传
│   │   └── problem-monitor/  # 问题监控
│   └── user/             # 用户页面
│       ├── user.wxml     # 用户主页
│       ├── problem-list/     # 问题列表
│       ├── upload-fix/       # 上传整改
│       └── problem-detail/   # 问题详情
└── components/           # 自定义组件
    └── navigation-bar/
```

## 数据模型

### 用户模型 (User)

```typescript
interface User {
  id: string;
  phone: string;
  name: string;
  role: "admin" | "user";
  communityId?: string;
  avatar?: string;
  createTime: number;
  updateTime: number;
}
```

### 社区模型 (Community)

```typescript
interface Community {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  createTime: number;
  updateTime: number;
}
```

### 环境问题模型 (EnvironmentProblem)

```typescript
interface EnvironmentProblem {
  id: string;
  communityId: string;
  title: string;
  description: string;
  category: "garbage" | "pollution" | "facility" | "hygiene" | "other";
  severity: "low" | "medium" | "high";
  status: "pending" | "processing" | "fixed" | "closed";
  photos: string[];
  fixPhotos?: string[];
  reporterId: string;
  reporterName: string;
  reporterPhone: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createTime: number;
  updateTime: number;
  fixTime?: number;
  fixDescription?: string;
}
```

## 安装和运行

### 环境要求

- 微信开发者工具
- Node.js (用于 TypeScript 编译)

### 安装步骤

1. **克隆项目**

   ```bash
   git clone <repository-url>
   cd miniprogram-3
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **配置 API 地址**
   编辑 `miniprogram/services/api.ts` 文件，将 `API_BASE_URL` 替换为实际的 API 地址：

   ```typescript
   const API_BASE_URL = "https://your-api-domain.com/api";
   ```

4. **配置地图服务**
   编辑相关页面中的地图 API Key，替换为实际的地图服务 Key。

5. **打开微信开发者工具**
   - 导入项目目录
   - 配置 AppID
   - 编译运行

## 配置说明

### 1. 应用配置 (app.json)

- 页面路由配置
- TabBar 配置
- 权限配置

### 2. 项目配置 (project.config.json)

- 编译设置
- 开发者工具设置
- 云开发配置

### 3. API 配置

需要配置以下 API 接口：

- 用户登录/注册
- 短信验证码发送
- 社区管理
- 问题管理
- 文件上传

## 使用说明

### 管理员使用流程

1. **登录**: 使用管理员账号登录
2. **选择社区**: 在管理员工作台选择要管理的社区
3. **上传问题**: 拍照上传发现的环境问题
4. **监控问题**: 查看问题列表，更新处理状态
5. **管理整改**: 确认用户上传的整改照片

### 普通用户使用流程

1. **登录**: 使用手机号验证码登录
2. **查看问题**: 浏览当前社区的环境问题
3. **上传整改**: 对需要整改的问题上传整改照片
4. **查看进度**: 跟踪问题处理进度

## 权限控制

### 页面权限

- 登录页：所有用户可访问
- 首页：已登录用户可访问
- 管理员页面：仅管理员可访问
- 用户页面：仅普通用户可访问

### 功能权限

- 问题上传：仅管理员
- 状态更新：仅管理员
- 整改上传：仅普通用户
- 问题查看：根据社区权限

## 注意事项

1. **API 接口**: 需要后端提供相应的 API 接口支持
2. **文件上传**: 需要配置文件上传服务
3. **地图服务**: 需要配置地图 API 服务
4. **短信服务**: 需要配置短信验证码服务
5. **权限管理**: 确保用户角色和社区权限正确配置

## 开发建议

1. **代码规范**: 遵循 TypeScript 和微信小程序开发规范
2. **错误处理**: 完善的错误处理和用户提示
3. **性能优化**: 图片压缩、分页加载等
4. **用户体验**: 加载状态、空状态、错误状态的处理
5. **测试**: 充分测试各种场景和边界情况

## 更新日志

### v1.0.0

- 初始版本发布
- 实现基础的用户认证功能
- 实现管理员和普通用户功能
- 实现问题管理和监控功能

## 许可证

本项目采用 MIT 许可证。

