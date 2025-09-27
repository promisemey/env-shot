# TDesign 胶囊 TabBar 测试说明

## 功能实现

1. **自定义 TabBar**: 使用 TDesign 的胶囊样式 TabBar
2. **权限控制**: 根据用户角色动态显示 TabBar 项
3. **状态同步**: 页面切换时正确更新 TabBar 选中状态

## 测试步骤

### 1. 普通用户测试

- 使用非 138 开头的手机号登录（如：13912345678）
- 验证码随意输入
- 登录后应该只看到：首页、我的

### 2. 管理员测试

- 使用 138 开头的手机号登录（如：13812345678）
- 验证码随意输入
- 登录后应该看到：首页、管理、我的

### 3. TabBar 切换测试

- 点击不同的 TabBar 项
- 验证页面正确跳转
- 验证 TabBar 选中状态正确更新

## 技术实现要点

1. **app.json 配置**:

   - 设置 `"custom": true` 启用自定义 TabBar
   - 保留 list 配置供系统识别 TabBar 页面

2. **自定义 TabBar 组件**:

   - 位置: `custom-tab-bar/`
   - 使用 TDesign 的 `t-tab-bar` 组件
   - 胶囊主题: `theme="capsule"`

3. **权限控制逻辑**:

   - 读取本地存储的用户信息
   - 根据 `userInfo.role` 动态构建 TabBar 列表
   - 管理员显示管理页面，普通用户不显示

4. **状态同步**:
   - 每个 TabBar 页面的 `onShow` 中调用 `updateTabBar()`
   - 确保页面切换时 TabBar 状态正确

## 注意事项

- 确保所有 TabBar 页面都在 app.json 的 pages 列表中
- TabBar 页面必须使用 `wx.switchTab()` 进行跳转
- 自定义 TabBar 组件会在每个 TabBar 页面中自动加载
