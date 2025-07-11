# 管理员权限控制

## 概述

DNA修复知识平台现在实现了完整的管理员权限控制系统，确保只有经过认证的管理员才能进行数据修改操作。

## 权限控制范围

### 1. 蛋白质管理 (Proteins)
- **公开访问**: 查看蛋白质列表、蛋白质详情、按通路筛选蛋白质
- **管理员权限**: 添加新蛋白质、编辑蛋白质、删除蛋白质

### 2. 蛋白质修饰管理 (Protein Modifications)
- **公开访问**: 查看蛋白质修饰信息
- **管理员权限**: 添加新修饰、编辑修饰、删除修饰

### 3. 蛋白质位置管理 (Protein Positions)
- **公开访问**: 查看蛋白质在通路图中的位置
- **管理员权限**: 保存蛋白质位置、更新位置、重置通路位置

### 4. 博客管理 (Blogs)
- **公开访问**: 查看博客文章、搜索博客、按分类浏览
- **管理员权限**: 创建新博客、编辑博客、删除博客

## 前端权限控制

### 1. 蛋白质列表页面
- 只有管理员登录时才显示"添加新蛋白质"按钮
- 只有管理员登录时才显示"编辑"和"删除"按钮
- 所有用户都可以查看蛋白质信息

### 2. 蛋白质编辑页面
- 需要管理员登录才能访问
- 未登录用户会被重定向到管理员登录页面

### 3. 蛋白质节点交互
- 只有管理员登录时才能通过右键菜单添加/编辑/删除蛋白质修饰
- 所有用户都可以查看蛋白质修饰信息

## 后端权限控制

### 1. 认证中间件
- `auth`: 验证JWT令牌
- `requireAdmin`: 确保用户具有管理员权限

### 2. 受保护的API端点
所有修改数据的API端点都需要管理员认证：

```
POST /api/proteins - 创建蛋白质
PUT /api/proteins/:id - 更新蛋白质
DELETE /api/proteins/:id - 删除蛋白质

POST /api/protein-modifications/protein/:proteinId - 创建修饰
PUT /api/protein-modifications/:id - 更新修饰
DELETE /api/protein-modifications/:id - 删除修饰

POST /api/protein-positions/:pathway - 保存位置
PUT /api/protein-positions/:pathway/:proteinId - 更新位置
DELETE /api/protein-positions/:pathway/reset - 重置位置

POST /api/blogs - 创建博客
PUT /api/blogs/:id - 更新博客
DELETE /api/blogs/:id - 删除博客
```

### 3. 公开API端点
所有查看数据的API端点都是公开的：

```
GET /api/proteins - 获取所有蛋白质
GET /api/proteins/:id - 获取特定蛋白质
GET /api/proteins/pathway/:pathway - 按通路获取蛋白质

GET /api/protein-modifications/protein/:proteinId - 获取蛋白质修饰

GET /api/protein-positions/:pathway - 获取蛋白质位置

GET /api/blogs - 获取所有博客
GET /api/blogs/:id - 获取特定博客
GET /api/blogs/search - 搜索博客
GET /api/blogs/category/:category - 按分类获取博客
```

## 安全特性

### 1. JWT令牌认证
- 24小时有效期
- 自动令牌验证
- 令牌失效时自动清除本地存储

### 2. 前端安全
- 认证状态实时检查
- 未授权访问自动重定向
- 敏感操作按钮条件显示

### 3. 后端安全
- bcrypt密码哈希
- 速率限制防止暴力攻击
- 输入验证和清理

## 使用方法

### 1. 管理员登录
1. 访问 `/dna-repair/admin/login`
2. 输入管理员凭据
3. 登录成功后自动获得管理权限

### 2. 管理蛋白质
1. 登录后访问蛋白质列表页面
2. 点击"添加新蛋白质"按钮创建新蛋白质
3. 点击蛋白质卡片上的"编辑"按钮修改蛋白质
4. 点击"删除"按钮删除蛋白质

### 3. 管理蛋白质修饰
1. 在通路图中右键点击蛋白质节点
2. 选择"添加修饰"创建新修饰
3. 点击现有修饰进行编辑或删除

### 4. 管理蛋白质位置
1. 在通路图中拖拽蛋白质节点调整位置
2. 位置会自动保存（需要管理员权限）

## 故障排除

### 1. 权限被拒绝
- 检查是否已登录管理员账户
- 刷新页面重新验证令牌
- 清除浏览器缓存和本地存储

### 2. 按钮不显示
- 确认已成功登录管理员账户
- 检查网络连接是否正常
- 查看浏览器控制台是否有错误

### 3. API调用失败
- 检查JWT令牌是否有效
- 确认请求头包含正确的Authorization
- 查看服务器日志获取详细错误信息

## 技术实现

### 1. 前端实现
- React hooks管理认证状态
- 条件渲染控制UI显示
- 路由守卫保护管理页面

### 2. 后端实现
- Express中间件链式验证
- JWT令牌解析和验证
- 角色权限检查

### 3. 数据库
- Admin模型存储管理员信息
- 密码加密存储
- 用户角色管理 