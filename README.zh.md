<p align="center">
  <img src="https://raw.githubusercontent.com/primer/octicons/main/icons/copilot-48.svg" width="80" alt="Copilot CLI" />
</p>

<h1 align="center">harness-100-copilot</h1>

<p align="center">
  <strong>适用于 GitHub Copilot CLI 的 100 个生产级多智能体编排工具（Harness）</strong><br/>
  基于 <a href="https://github.com/revfactory/harness-100">revfactory/harness-100</a>，为 Copilot CLI 生态系统移植适配
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="Apache 2.0" /></a>
  <a href="#"><img src="https://img.shields.io/badge/copilot--cli-ready-28a745?logo=github" alt="Copilot CLI Ready" /></a>
  <a href="#"><img src="https://img.shields.io/badge/harnesses-15%20of%20100-yellow" alt="15 of 100 Harnesses" /></a>
  <a href="#"><img src="https://img.shields.io/badge/agents-73-blueviolet" alt="73 Agents" /></a>
  <a href="#"><img src="https://img.shields.io/badge/parity-~96%25-green" alt="~96% parity" /></a>
</p>

<p align="center">
  <a href="README.md">🇺🇸 English</a> ·
  <a href="README.ko.md">🇰🇷 한국어</a> ·
  <a href="README.ja.md">🇯🇵 日本語</a>
</p>

---

## 项目介绍

**harness-100-copilot** 是将 [revfactory/harness-100](https://github.com/revfactory/harness-100) 移植到 **GitHub Copilot CLI** 的项目。

原版 harness-100 使用 Claude Code 的 `SendMessage` 实现智能体之间的实时通信。本项目将 Phase 2 的 **15 个 Harness** 适配为 Copilot CLI 的**基于文件的消息总线**模式，并以最终完成 100 个 Harness 的移植为目标（**~96% 功能一致性**）。

> **什么是 Harness？** 一支由 4〜7 名专业智能体组成的预组装团队，通过结构化流水线协同完成复杂任务——例如构建全栈 Web 应用、审查 PR，或搭建 CI/CD 流水线。

---

## 快速概览

| 属性 | 值 |
|------|---|
| Harness 总数 | 目前 15 个（Phase 2 完成）；规划 10 个领域共 100 个 |
| 智能体定义数 | 目前 73 个（100 个 Harness 完成时为 489 个） |
| 技能数（编排器 + 领域） | 目前 43 个（100 个 Harness 完成时为 315 个） |
| 与原版的功能一致性 | ~96% |
| 核心适配点 | `SendMessage` → 基于文件的消息总线 |
| 主要用途 | Copilot CLI 中的复杂多智能体工作流 |

---

## 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/drvoss/harness-100-copilot.git

# 2. 将 Harness 复制到您的项目（示例：code-reviewer）
cp -r harness-100-copilot/harnesses/21-code-reviewer/agents/ .github/agents/
cp -r harness-100-copilot/harnesses/21-code-reviewer/skills/ .github/skills/
cp -r harness-100-copilot/references/ references/   # 安全、测试和性能类 Harness 所需

# 3. 启动 Copilot CLI
cd your-project
copilot

# 4. 触发 Harness
> 从安全和架构角度审查我最近的代码变更
```

> 📖 详细安装说明请参阅 [guides/installation.md](guides/installation.md)。

---

## 核心区别：消息总线

原版 harness-100 使用 Claude Code 的 `SendMessage` 进行智能体间的实时通信：

```
style-inspector → SendMessage(synthesizer, findings)
security-analyst → SendMessage(synthesizer, findings)
```

GitHub Copilot CLI 不具备此原语。我们用**基于文件的消息总线**替代：

```
_workspace/
  messages/
    style-inspector-to-review-synthesizer.md
    security-analyst-to-review-synthesizer.md
    performance-analyst-to-review-synthesizer.md
  01_style_review.md
  02_security_review.md
  ...
```

每个智能体将输出结果和结构化消息摘要写入 `_workspace/messages/`，下一个智能体在开始前读取相关消息。无需任何额外基础设施，即可实现**约 90% 的通信丰富度**。

> 📖 详见 [guides/message-bus-pattern.md](guides/message-bus-pattern.md) 和 [PORTING-NOTES.md](PORTING-NOTES.md)。

---

## Harness 列表

### ✅ 类别 2：软件开发 & DevOps（16-30）— Phase 2（现已可用）

| # | Harness | 描述 | 状态 |
|---|---------|------|------|
| 16 | [fullstack-webapp](harnesses/16-fullstack-webapp/) | 全栈 Web 应用：设计 → 前端 → 后端 → 测试 → 部署 | ✅ 可用 |
| 17 | [mobile-app-builder](harnesses/17-mobile-app-builder/) | 移动应用：UI/UX、代码、API、应用商店发布 | ✅ 可用 |
| 18 | [api-designer](harnesses/18-api-designer/) | REST/GraphQL API：设计、文档、Mock、测试 | ✅ 可用 |
| 19 | [database-architect](harnesses/19-database-architect/) | 数据库：建模、优化、迁移 | ✅ 可用 |
| 20 | [cicd-pipeline](harnesses/20-cicd-pipeline/) | CI/CD：设计、安全门控、监控 | ✅ 可用 |
| 21 | [code-reviewer](harnesses/21-code-reviewer/) | 代码审查：风格、安全、性能、架构 | ✅ 可用 |
| 22 | [legacy-modernizer](harnesses/22-legacy-modernizer/) | 遗留代码现代化与重构 | ✅ 可用 |
| 23 | [microservice-designer](harnesses/23-microservice-designer/) | 微服务架构与拆分 | ✅ 可用 |
| 24 | [test-automation](harnesses/24-test-automation/) | 测试自动化策略与实现 | ✅ 可用 |
| 25 | [incident-postmortem](harnesses/25-incident-postmortem/) | 故障分析与复盘报告生成 | ✅ 可用 |
| 26 | [infra-as-code](harnesses/26-infra-as-code/) | 使用 Terraform/Kubernetes 的基础设施即代码 | ✅ 可用 |
| 27 | [data-pipeline](harnesses/27-data-pipeline/) | 数据管道设计与实现 | ✅ 可用 |
| 28 | [security-audit](harnesses/28-security-audit/) | 全面安全审计 | ✅ 可用 |
| 29 | [performance-optimizer](harnesses/29-performance-optimizer/) | 应用性能优化 | ✅ 可用 |
| 30 | [open-source-launcher](harnesses/30-open-source-launcher/) | 开源项目发布 | ✅ 可用 |

### 🔜 其他类别（即将推出）

| 类别 | 范围 | 领域 |
|------|------|------|
| 内容创作 & 创意 | 01-15 | YouTube、播客、Newsletter、品牌 |
| 数据 & AI/ML | 31-42 | ML 实验、数据分析、LLM 应用 |
| 商业 & 战略 | 43-55 | 市场分析、战略规划 |
| 教育 & 学习 | 56-65 | 课程设计、辅导系统 |
| 法律 & 合规 | 66-72 | 合同审查、合规审计 |
| 健康 & 生活方式 | 73-80 | 健康追踪、健康计划 |
| 沟通 & 文档 | 81-88 | 技术写作、文档生成 |
| 运营 & 流程 | 89-95 | 项目管理、流程优化 |
| 专业领域 | 96-100 | 金融、研究、细分领域 |

---

## 如何使用 Harness

每个 Harness 独立存放于 `harnesses/{nn}-{name}/`：

```
{nn}-{harness-name}/
├── HARNESS.md          # 概述、智能体列表、使用方法、安装说明
├── agents/
│   ├── specialist-1.md
│   ├── specialist-2.md
│   └── ...
└── skills/
    ├── orchestrator/SKILL.md    # 第 1 层：团队协调
    ├── domain-skill-1/SKILL.md  # 第 2 层：领域专业知识
    └── domain-skill-2/SKILL.md  # 第 2 层：领域专业知识
```

**将 Harness 安装到您的项目：**

```bash
# 将智能体和技能复制到项目的 .github 目录
cp -r harnesses/21-code-reviewer/agents/ your-project/.github/agents/
cp -r harnesses/21-code-reviewer/skills/ your-project/.github/skills/
```

然后在 Copilot CLI 中使用自然语言触发编排器技能。

> 📖 详细说明请参阅 [guides/installation.md](guides/installation.md)。

---

## 模板

构建新 Harness 时，请使用提供的模板：

- [templates/agent-template.md](templates/agent-template.md) — 智能体定义模板
- [templates/orchestrator-skill-template.md](templates/orchestrator-skill-template.md) — 编排器 SKILL.md 模板
- [templates/workspace-layout.md](templates/workspace-layout.md) — `_workspace/` 布局规范

---

## 相关项目：everything-copilot-cli

如需了解独立技能、编排模式和指南（而非完整 Harness）：
→ [drvoss/everything-copilot-cli](https://github.com/drvoss/everything-copilot-cli)

```
everything-copilot-cli    ←→    harness-100-copilot
  模式指南                          完整团队 Harness
  独立技能（~40 个）                 团队 Harness（100 个）
  编排示例                          生产级流水线
```

---

## 如何贡献

1. **移植 Harness** — 选择一个未实现的 Harness，参考 [PORTING-NOTES.md](PORTING-NOTES.md)
2. **改进现有 Harness** — 修复 Bug、改进智能体提示词、添加测试场景
3. **添加领域技能** — 用新的领域专用技能扩展 Harness
4. **测试与验证** — 运行 `npm test` 验证 Harness 结构

```bash
npm install
npm test        # 验证所有 Harness 结构
npm run lint:md # Markdown 格式检查
```

---

## 许可证

Apache 2.0 — 参阅 [LICENSE](LICENSE) 和 [ATTRIBUTION.md](ATTRIBUTION.md)。

基于 [revfactory/harness-100](https://github.com/revfactory/harness-100)（Apache 2.0）改编。

---

<p align="center">
  <sub>为 GitHub Copilot CLI 社区构建 · 基于 <a href="https://github.com/revfactory/harness-100">revfactory/harness-100</a> 移植</sub>
</p>
