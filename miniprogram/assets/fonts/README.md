# 字体文件说明

## TDesign 图标字体

由于网络加载 TDesign 字体文件可能出现问题，建议将字体文件本地化。

### 解决方案

1. **临时解决方案**：在微信开发者工具中开启"不校验合法域名"
2. **生产环境方案**：下载字体文件到本地或使用 CDN

### 字体文件获取

可以从以下地址下载 TDesign 字体文件：

- https://tdesign.gtimg.com/icon/0.3.2/fonts/t.woff
- https://tdesign.gtimg.com/icon/0.3.2/fonts/t.woff2
- https://tdesign.gtimg.com/icon/0.3.2/fonts/t.ttf

### 使用方式

将字体文件放置在此目录下，然后在样式文件中引用：

```css
@font-face {
  font-family: "t";
  src: url("/assets/fonts/t.woff2") format("woff2"), url("/assets/fonts/t.woff")
      format("woff");
}
```
