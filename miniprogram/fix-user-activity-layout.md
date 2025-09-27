# 用户页面最近活动布局修复

## 问题描述

用户页面的最近活动列表存在与首页最近问题相同的布局问题：右侧的状态标签被内容挤压，可能看不见。

## 修复方案

对 `miniprogram/pages/user/user.scss` 中的 `.activity-content` 和 `.activity-status` 样式进行了以下修改：

### `.activity-content` 修改：

- 添加 `min-width: 0` - 允许内容区域在空间不足时收缩
- 添加 `margin-right: 16rpx` - 确保与右侧状态标签有足够间距

### `.activity-status` 修改：

- 添加 `flex-shrink: 0` - 防止状态标签被挤压
- 添加 `min-width: 80rpx` - 确保状态标签有最小宽度
- 移除 `margin-left: 16rpx` - 改用左侧内容的 margin-right

## 修复效果

- 状态标签不再被挤压，始终可见
- 内容区域在空间不足时会适当收缩（显示省略号）
- 整体布局更加稳定和美观

## 测试建议

1. 在用户页面查看最近活动列表
2. 验证状态标签是否正常显示
3. 测试不同长度的标题和描述文本
