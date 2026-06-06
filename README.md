# 原创作品版权管理平台

## 项目简介

原创作品版权管理平台是一个面向创作者和版权管理机构的综合性版权管理系统，提供从作品登记、版权存证、确权审核、授权分成到商用签约的全流程管理能力。平台基于 TypeScript + Express.js + EJS + SQLite 技术栈构建，采用经典 MVC 架构，轻量部署、开箱即用。

## 适用场景

- 个人创作者管理自己的原创稿件、插画、影音作品的版权信息
- 版权代理机构对批量作品进行版权存证与确权管理
- 内容平台对授权作品进行商用签约与收益分成管理
- 版权溯源场景下对作品创作链路进行追踪与验证
- 小型团队或工作室的版权资产数字化管理

## 核心功能

1. **稿件/插画/影音版权存证**：支持多种作品类型的版权登记，自动生成唯一存证编号与区块链哈希
2. **确权管理**：对已登记作品进行确权审核，支持通过/驳回操作，记录确权时间
3. **授权分成**：管理作品的授权收益，支持按合同约定比例进行分成计算与结算
4. **版权溯源**：通过存证哈希与登记编号追溯作品版权链路
5. **商用签约管理**：管理作品的商业授权合同，包括合同创建、生效、到期、终止等全生命周期

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端框架 | Express.js (TypeScript) |
| 模板引擎 | EJS |
| 数据库 | SQLite (better-sqlite3) |
| 会话管理 | express-session + connect-sqlite3 |
| 密码加密 | bcryptjs |
| 哈希生成 | crypto-js (SHA-256) |
| 运行时 | Node.js 20 + ts-node |

## 目录结构

```
repo/
├── src/
│   ├── config/          # 应用配置与数据库初始化
│   │   ├── app.ts       # Express 应用配置
│   │   └── database.ts  # SQLite 数据库连接与建表
│   ├── controllers/     # 控制器层（处理HTTP请求）
│   │   ├── authController.ts
│   │   ├── workController.ts
│   │   ├── copyrightController.ts
│   │   ├── contractController.ts
│   │   ├── dashboardController.ts
│   │   └── revenueController.ts
│   ├── middleware/       # 中间件
│   │   └── auth.ts      # 登录鉴权中间件
│   ├── models/          # 数据模型层（SQL操作封装）
│   │   ├── user.ts
│   │   ├── work.ts
│   │   ├── copyright.ts
│   │   ├── contract.ts
│   │   └── revenue.ts
│   ├── routes/          # 路由定义
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── works.ts
│   │   ├── copyrights.ts
│   │   └── contracts.ts
│   ├── services/        # 业务逻辑层
│   │   ├── userService.ts
│   │   ├── workService.ts
│   │   ├── copyrightService.ts
│   │   ├── contractService.ts
│   │   └── revenueService.ts
│   ├── seed.ts          # 种子数据
│   └── server.ts        # 入口文件
├── views/               # EJS 模板
│   ├── layout.ejs
│   ├── index.ejs
│   ├── partials/
│   ├── auth/
│   ├── works/
│   ├── copyrights/
│   ├── contracts/
│   ├── dashboard/
│   └── revenues/
├── public/              # 静态资源
│   ├── css/style.css
│   └── js/main.js
├── package.json
├── tsconfig.json
└── README.md
```

## Docker 启动方式

```bash
# 构建镜像
docker build -t copyright-manage ..

# 运行容器
docker run -d \
  -p 3000:3000 \
  -p 2222:22 \
  -e SSH_PASSWORD=your_ssh_password \
  -e SSH_PORT=22 \
  --name copyright-manage \
  copyright-manage

# 访问应用
# 浏览器打开 http://localhost:3000
```

## 本地启动方式

```bash
# 进入项目目录
cd repo/

# 安装依赖
npm install

# 初始化数据库并插入种子数据
npx ts-node src/seed.ts

# 启动服务
npx ts-node src/server.ts

# 访问应用
# 浏览器打开 http://localhost:3000
```

## 默认账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |
| 普通用户 | zhangsan | 123456 |
| 普通用户 | lisi | 123456 |

## 可扩展方向

1. **区块链存证集成**：接入以太坊/蚂蚁链等区块链网络，实现真正的链上存证
2. **文件上传与存储**：支持作品原文件上传，集成 OSS/S3 存储
3. **电子签章**：集成第三方电子签章服务，实现合同在线签署
4. **权限精细化**：基于 RBAC 的细粒度权限控制
5. **数据导出**：支持版权数据导出为 PDF/Excel 格式
6. **消息通知**：版权到期提醒、合同续签通知等
7. **API 开放**：提供 RESTful API 供第三方系统对接
8. **审计日志**：记录所有关键操作的审计轨迹
9. **多租户支持**：支持多个组织/机构独立管理版权数据
10. **移动端适配**：响应式布局或独立移动端应用
