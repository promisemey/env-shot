# 开发环境配置说明

## TDesign 字体加载问题解决方案

### 问题描述

在开发过程中可能遇到以下错误：

```
[渲染层网络层错误] Failed to load font https://tdesign.gtimg.com/icon/0.3.2/fonts/t.woff
```

### 解决方案

#### 方案 1：微信开发者工具设置（推荐用于开发环境）

1. 打开微信开发者工具
2. 点击右上角"详情"按钮
3. 在"本地设置"中勾选"不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书"
4. 重新编译项目

#### 方案 2：配置合法域名（生产环境必需）

1. 登录微信公众平台
2. 进入小程序管理后台
3. 在"开发管理" -> "开发设置" -> "服务器域名"中添加：
   - `https://tdesign.gtimg.com`

#### 方案 3：本地化字体文件

1. 下载 TDesign 字体文件：

   ```bash
   # 创建字体目录
   mkdir -p miniprogram/assets/fonts

   # 下载字体文件（需要手动下载）
   # https://tdesign.gtimg.com/icon/0.3.2/fonts/t.woff2
   # https://tdesign.gtimg.com/icon/0.3.2/fonts/t.woff
   # https://tdesign.gtimg.com/icon/0.3.2/fonts/t.ttf
   ```

2. 修改 `miniprogram/styles/fonts.scss` 文件，取消注释本地字体配置

3. 重新编译项目

### 当前项目配置

项目已经包含以下配置来处理字体问题：

1. **字体降级处理**：`miniprogram/styles/fonts.scss`
2. **字体加载器**：`miniprogram/utils/font-loader.ts`
3. **网络超时配置**：`miniprogram/app.json`

### 验证字体加载

在浏览器控制台或微信开发者工具控制台中运行：

```javascript
// 检查字体是否加载成功
console.log(
  "TDesign字体状态:",
  document.fonts ? document.fonts.check("16px t") : "字体API不支持"
);
```

### 常见问题

#### Q: 图标显示为方块或乱码

A: 这通常是字体文件加载失败导致的，请按照上述方案 1 或方案 2 解决。

#### Q: 开发环境正常，真机预览异常

A: 需要配置合法域名（方案 2）或使用本地字体文件（方案 3）。

#### Q: 字体文件下载失败

A: 检查网络连接，或使用代理/VPN 访问。

### 性能优化建议

1. **预加载关键字体**：在 app.ts 中预加载常用字体
2. **字体子集化**：只包含项目中使用的图标字符
3. **CDN 加速**：使用国内 CDN 加速字体文件加载
4. **缓存策略**：合理设置字体文件缓存时间

### 监控和调试

项目已集成字体加载监控，可以在控制台查看字体加载状态：

```javascript
// 查看字体加载状态
FontLoader.isFontLoaded("t");

// 手动预加载字体
FontLoader.preloadFont("t");
```
