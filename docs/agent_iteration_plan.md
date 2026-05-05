# 《破防宇宙》Agent 接力迭代计划

本文档用于让后续 Agent 在当前 Web Demo 基础上持续工作。原则是每个阶段都要交付可运行版本，不做只停留在概念层的改动。

## 当前版本：V0.1 Web Visual Playable Slice

已实现目标：

- 输入一句现实吐槽。
- 本地 Mock 生成匿名化 Boss 配置。
- 展示 Boss 名字、称号、技能、掉落、安全改写。
- Canvas 简化横版战斗。
- Boss 三阶段攻击。
- 主题战斗背景：办公室、雨夜、校园、饭桌、情绪虚空。
- 玩家剪影、Boss 形体、攻击预警、刀光、弹幕和粒子反馈。
- 开场副本标题、Boss 阶段面板、技能冷却图标、伤害数字。
- 按《BREAKVERSE 全维度升级文档》补充：终端输入、chip、加载态、DOM HUD、双层血条、Hit-Stop、弹簧震屏、Hit-Spark、音效、haptic、摄像机微推拉、Boss 独眼拖影、玩家状态机、战报 PNG 下载。
- 按《BREAKVERSE V0.1 严苛 Review》补充：LevelConfig/WaveConfig 雏形、杂兵/精英 wave、LootTable/Inventory、装备真实战斗 hook、12 条 archetype、加权关键词匹配、真实 last run。
- 击败/失败结算。
- 生成分享卡和分享文案。

主要文件：

- `index.html`：产品流程和界面结构。
- `styles.css`：视觉系统、响应式布局、控件样式。
- `src/app.js`：本地生成器、游戏循环、战斗逻辑、结算分享。
- `README.md`：运行方式和当前边界。

## V0.2：视觉完整度补齐

目标：在不删减当前升级成果的基础上，继续补齐《BREAKVERSE_全维度升级文档.md》和《BREAKVERSE_V0.1_严苛Review.docx》未完成项。

任务：

- 为 Boss 预览增加 4 套更明确的主题姿态：职场、情感、校园、家庭。
- 把 Canvas 内旧技能图标完全移除，只保留 DOM 技能 dock。
- 战斗页增加 HUD 受击 shake class、低血量 pulse 和阶段切换动效。
- 增加胜利掉落动画。
- 继续增强场景视差：前景遮挡、动态屏幕光、雨夜雨滴密度、办公室屏幕闪烁。
- 移动端检查首屏、Boss 预览、战斗按钮和结算卡不溢出。

验收：

- 页面截图看起来像游戏 Demo，而不是开发调试页。
- 战斗中不出现纯方块占位角色。
- 新用户不用读说明也能理解“输入吐槽生成 Boss 并战斗”。
- 不得删除 Hit-Stop、DOM HUD、战报 PNG 下载、AI 分析 loading。
- 不得把 Level/Wave、LootTable/Inventory、装备效果 hook 退回固定字符串。

## V0.2.1：严苛 Review 结构继续补强

目标：把本轮 P0 雏形推进到可以内测的最小系统。

任务：

- Boss 攻击从 phase 绑死技能改为 5 个独立 pattern 的 mix-up。
- 轻攻击三连段，每段独立 hit-stop 和位移。
- 每个 archetype 至少 2 个 Level 变体、3 个掉落候选。
- 挑战码改为战报编号，除非实现可复现 seed。
- 展示卡与下载 PNG 统一为同一 Canvas 输出。
- 抽出 `content/`、`battle/`、`render/`、`share/` 模块，保持单文件低于 500 行。
- 加最小测试：加权匹配、掉落随机、装备效果、Level wave 推进。

验收：

- 同一 Boss 一局内至少触发 5 种攻击图案。
- 同一 archetype 多局掉落不完全一致。
- 装备效果在下一局可观察，比如免疫、回血、减 CD。
- 代码不再让一个文件继续膨胀。

## V0.3：把 Mock 生成器抽成可替换内容管线

目标：让“生成 Boss”从页面逻辑中拆出来，为真实 AI API 做准备。

任务：

- 新建 `src/content/generator.js`，迁移 `archetypes`、`sanitizeInput`、`generateBoss` 相关逻辑。
- 定义 `BossConfig`、`SkillConfig`、`DropItemConfig` 的 JSDoc 类型。
- 新增 `src/content/schema.js`，实现运行时校验函数。
- 保留本地 Mock Provider，命名为 `mockBossProvider`。
- 在 UI 中增加“查看 JSON”折叠面板，方便调试 Agent 输出。

验收：

- 不接后端也能继续运行。
- 生成结果必须通过本地 schema 校验。
- 任何缺字段结果都能回退到安全默认 Boss。

## V0.4：接入真实 AI API 的最小后端

目标：把本地 Mock 替换为可配置 API，同时保留离线 fallback。

建议技术栈：

- Node.js + Fastify 或 Express。
- `POST /api/generate/boss`。
- `.env` 管理 `OPENAI_API_KEY`、`AI_PROVIDER`。
- Provider 接口先支持 `mock` 和 `openai`。

任务：

- 新建 `server/`。
- 实现 `AIProvider.generateBoss(input)` 抽象。
- Prompt 必须要求输出合法 JSON。
- 增加 JSON 修复与 schema 校验。
- 前端增加“本地 Mock / AI 生成”模式切换。
- API 超时后自动回退 Mock。

验收：

- 无 API Key 时 Demo 可运行。
- 有 API Key 时输入吐槽能返回更贴合的 Boss。
- 输出不得包含手机号、邮箱、身份证、具体地址等可识别隐私。

## V0.5：战斗手感加强

目标：让 Demo 从“能玩”变成“愿意再打一局”。

任务：

- 增加攻击前摇、命中停顿、受击闪白、屏幕震动参数配置。
- 玩家增加轻攻击三连段。
- 技能增加冷却 UI。
- Boss 每个技能增加更明确的预警区。
- 失败后给出具体建议，例如“多用闪避躲第三阶段冲撞”。
- 加入简单音效，可先用 Web Audio 生成。

验收：

- 玩家输入响应即时。
- Boss 三个技能有可读性。
- 一局 60-120 秒内能结束。
- 失败不是随机秒杀，玩家能理解原因。

## V0.6：分享卡图片化

目标：让战斗结果适合截图和传播。

任务：

- 新增 `src/share/cardRenderer.js`。
- 使用 Canvas 渲染分享卡图片。
- 支持下载 PNG。
- 分享卡包含：Boss 名、掉落、身份、用时、挑战码、匿名化吐槽。
- 增加 3 套主题：职场红黑、情感雨夜、家庭饭桌。

验收：

- 点击按钮可下载 PNG。
- 移动端卡片尺寸不溢出。
- 文案不会超出卡片边界。

## V0.7：存档与个人破防宇宙雏形

目标：让玩家不是只玩一次，而是能积累自己的 Boss 档案。

任务：

- 使用 `localStorage` 保存历史事件、Boss、胜负、掉落。
- 新增“我的宇宙”视图。
- 展示最近 10 个 Boss。
- 增加装备收藏列表。
- 支持重打历史 Boss。

验收：

- 刷新页面后历史仍存在。
- 可以从历史记录直接进入战斗。
- 不保存原始隐私文本，只保存安全改写文本。

## V0.8：关卡配置化

目标：让 Boss 和关卡真正由配置驱动。

任务：

- 把战斗常量移入 `src/battle/config.js`。
- 定义 `LevelConfig`：背景、地面、陷阱、Boss 初始位置、技能节奏。
- AI/Mock 生成时同时输出 `level`。
- Canvas 渲染根据 level theme 改变背景和危险物。

验收：

- 至少 4 类主题关卡：办公室、雨夜、校园、饭桌。
- 不改战斗主循环即可新增主题。

## V0.9：内容安全与发布前审核

目标：为公开分享和 UGC 做最小安全底座。

任务：

- 独立 `src/content/moderation.js`。
- 增加隐私识别：手机号、邮箱、身份证、地址、公司全称。
- 增加暴力威胁改写。
- 分享前再次审核。
- 不合规时显示“已转译为游戏隐喻”的说明。

验收：

- 用户输入现实攻击语句时，公开文案只出现游戏化表达。
- 分享文案不包含真实姓名、电话、邮箱、地址。

## V0.10：移动端体验专项

目标：让手机浏览器也能顺畅试玩。

任务：

- 优化触控按钮布局。
- 增加竖屏轻量战斗布局。
- 限制 Canvas 高度，避免地址栏遮挡。
- 增加震动反馈，使用 `navigator.vibrate`，不可用时静默跳过。
- 处理多点触控同时移动和攻击。

验收：

- iPhone Safari 和 Android Chrome 可玩。
- 按钮文字不溢出。
- 触控移动、跳跃、攻击可同时响应。

## V1.0：Web Demo 对外展示版

目标：可发给用户、投资人或创作者试玩。

任务：

- 首屏加载速度优化。
- 增加 10 个高质量模板输入。
- 增加教程第一局。
- 增加错误边界和空状态。
- 加入基础埋点接口占位。
- README 补充部署到 Vercel/Netlify/GitHub Pages 的方法。

验收：

- 新用户 5 分钟内完成完整闭环。
- 无需解释即可理解玩法。
- 无后端时仍可稳定展示。

## V1.1 以后：产品化路线

方向一：后端产品化

- 登录和匿名游客档案。
- 玩家档案、人生事件、Boss、掉落、战斗记录表。
- 云存档。
- 分享链接。
- 内容审核日志。

方向二：UGC 和编辑器

- Boss 编辑器。
- 分享卡模板编辑。
- 关卡参数编辑。
- UGC 发布和挑战码。
- 官方精选池。

方向三：更完整客户端

- 评估 Phaser 版本，适合 Web 快速迭代。
- 评估 Unity 版本，适合多端产品化。
- 战斗逻辑与内容配置保持可迁移。

方向四：商业化实验

- 皮肤和特效外观。
- 主题副本包。
- 高级年度破防报告。
- 创作者模板分成。

## Agent 工作规则

- 每次接力先运行当前 Demo，确认没有空白页。
- 每次视觉改动后至少截图首屏和战斗页，参考 `QA/intro.png`、`QA/battle-live-v3.png`。
- 任何阶段都必须保持 `index.html` 可打开。
- 新增真实 API 时必须保留 Mock fallback。
- 不要把隐私原文写进分享文案或公开 URL。
- 改战斗时优先保证可读性，再追求难度。
- 每次提交都更新 README 或本计划中的当前状态。
