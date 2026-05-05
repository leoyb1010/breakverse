# BREAKVERSE Web Demo

《破防宇宙：人间炼狱》第一阶段 Web 可玩视觉原型。

当前目标是严格按 `BREAKVERSE_全维度升级文档.md` 打通带展示质感和基础五感反馈的体验链路：

```text
输入一句吐槽
→ 本地 Mock 生成 Boss JSON
→ 预览 Boss 档案、技能、掉落、安全改写
→ 进入带主题场景、DOM HUD、技能冷却和打击反馈的横版战斗
→ 结算装备、战报卡、分享文案和 PNG 战报下载
```

## 运行

这是零依赖纯前端版本，可以直接打开 `index.html`。

也可以在本目录启动本地服务：

```bash
python3 -m http.server 4173
```

然后访问：

```text
http://localhost:4173
```

## QA 截图

当前仓库保留了本轮视觉检查截图：

- `QA/intro.png`
- `QA/battle-live-v3.png`
- `QA/intro-upgrade-v2.png`
- `QA/boss-upgrade.png`
- `QA/battle-upgrade-v2.png`

战斗页可用以下参数直接进入，方便后续 Agent 截图回归：

```text
http://localhost:4173/?autostart=battle&skipIntro=1
http://localhost:4173/?autostart=battle&skipIntro=1&forceWave=2
```

## 操作

- A / D：左右移动
- W / 空格：跳跃
- J：轻攻击
- K：闪避
- L：技能
- 移动端可使用画面下方触控按钮

## 当前视觉标准

- 首屏必须像游戏原型，而不是表单页。
- Boss 预览必须有角色档案感、威胁感和副本情报。
- 战斗画面必须有背景层、角色轮廓、Boss 形体、攻击预警、刀光、粒子、Hit-Spark、伤害数字和暗角聚焦。
- 结算页必须像可传播战报，而不是普通文本结果。

## 已按升级文档落地

- In-world 顶栏：`BREAKVERSE / CH.01 / 实时时间`。
- 终端风输入框、字数反馈、身份 chip。
- 生成 Boss 前的 AI 分析 loading。
- Boss 档案照、Case 编号、Threat Level、差异化技能/掉落/故事卡。
- DOM 化战斗 HUD、双层血条 lag bar、Boss 阶段文案。
- SVG 技能 CD 圆环和 ready 呼吸。
- Hit-Stop、弹簧式方向震屏、摄像机微推拉。
- Hit-Spark、暴击、弹性伤害数字、方向粒子。
- Web Audio 基础音效和移动端震动反馈。
- 玩家 idle/run/jump/attack/dodge/hurt 状态变形。
- Boss 独眼、能量场、拖影、主题道具。
- 战报 PNG 下载。

## 已按严苛 Review 补强

- `LevelConfig` 雏形：每个主题不再只是背景名，而是 3 个 wave，包含杂兵、精英和最终 Boss。
- Wave 推进：战斗开局先清理压力源，之后进入 Boss 波，DOM HUD 显示当前 wave/敌人数。
- 小怪与精英敌人：具备生命、移动、投射攻击、受击反馈和血条。
- `LootTable` / `DropItem` / `Inventory` 雏形：掉落有 `id`、`rarity`、`effectType`、`effectValue`、`dropRate`。
- 装备真实生效：当前支持弹幕免疫、减伤、命中回血、冷却缩短。
- 失败不再发放装备；胜利掉落写入 `localStorage`，下一局可观测生效。
- 内容池从 4 条扩到 12 条 archetype，并从首个 `includes` 改为加权关键词评分。
- 首页“上次副本”接真实 `localStorage`；没有历史时隐藏，不再假装有记录。
- Canvas 内重复技能图标已移除，只保留 DOM 技能 dock；Canvas 只保留开场/wave 标题演出。

## 当前边界

- AI 生成为本地规则 Mock，尚未接入真实模型。
- 战斗仍是 Canvas 原型，重点验证视觉闭环和基础手感。
- 分享卡目前支持页面内战报、可复制文案和 PNG 下载。
- 暂无账号、数据库、云存档、UGC 发布和审核后台。

## 下一步

后续阶段请看 [docs/agent_iteration_plan.md](./docs/agent_iteration_plan.md)。
