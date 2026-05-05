const views = {
  intro: document.querySelector("#introView"),
  boss: document.querySelector("#bossView"),
  game: document.querySelector("#gameView"),
  result: document.querySelector("#resultView"),
};

const els = {
  brandClock: document.querySelector("#brandClock"),
  loaderOverlay: document.querySelector("#loaderOverlay"),
  loaderDetail: document.querySelector("#loaderDetail"),
  lastRunStrip: document.querySelector("#lastRunStrip"),
  rantInput: document.querySelector("#rantInput"),
  rantCounter: document.querySelector("#rantCounter"),
  identityChips: document.querySelector("#identityChips"),
  identitySelect: document.querySelector("#identitySelect"),
  styleSelect: document.querySelector("#styleSelect"),
  generateBtn: document.querySelector("#generateBtn"),
  regenBtn: document.querySelector("#regenBtn"),
  startBtn: document.querySelector("#startBtn"),
  againBtn: document.querySelector("#againBtn"),
  copyBtn: document.querySelector("#copyBtn"),
  downloadCardBtn: document.querySelector("#downloadCardBtn"),
  bossGlyph: document.querySelector("#bossGlyph"),
  bossName: document.querySelector("#bossName"),
  bossTitle: document.querySelector("#bossTitle"),
  bossIntro: document.querySelector("#bossIntro"),
  caseStamp: document.querySelector("#caseStamp"),
  caseFileId: document.querySelector("#caseFileId"),
  bossRelation: document.querySelector("#bossRelation"),
  bossEmotion: document.querySelector("#bossEmotion"),
  bossStyle: document.querySelector("#bossStyle"),
  skillList: document.querySelector("#skillList"),
  dropPreview: document.querySelector("#dropPreview"),
  safeText: document.querySelector("#safeText"),
  levelName: document.querySelector("#levelName"),
  playerHpBar: document.querySelector("#playerHpBar"),
  playerHpLag: document.querySelector("#playerHpLag"),
  playerHpText: document.querySelector("#playerHpText"),
  bossHpBar: document.querySelector("#bossHpBar"),
  bossHpLag: document.querySelector("#bossHpLag"),
  bossHpText: document.querySelector("#bossHpText"),
  bossHudName: document.querySelector("#bossHudName"),
  bossPortrait: document.querySelector("#bossPortrait"),
  bossPhaseText: document.querySelector("#bossPhaseText"),
  attackCdRing: document.querySelector("#attackCdRing"),
  dodgeCdRing: document.querySelector("#dodgeCdRing"),
  skillCdRing: document.querySelector("#skillCdRing"),
  resultTitle: document.querySelector("#resultTitle"),
  resultSummary: document.querySelector("#resultSummary"),
  shareBossName: document.querySelector("#shareBossName"),
  shareDamage: document.querySelector("#shareDamage"),
  shareTime: document.querySelector("#shareTime"),
  shareBreaks: document.querySelector("#shareBreaks"),
  shareDrop: document.querySelector("#shareDrop"),
  shareQuote: document.querySelector("#shareQuote"),
  shareCode: document.querySelector("#shareCode"),
  lootName: document.querySelector("#lootName"),
  lootEffect: document.querySelector("#lootEffect"),
  shareText: document.querySelector("#shareText"),
  canvas: document.querySelector("#battleCanvas"),
};

const ctx = els.canvas.getContext("2d");
const keys = new Set();
const touch = new Set();
let currentBoss = null;
let game = null;
let animationId = 0;
let lastFrame = 0;
let audioCtx = null;

const BALANCE = {
  playerSpeed: 245,
  jumpVelocity: -540,
  gravity: 1350,
  attackDamage: 38,
  skillDamage: 56,
  attackCd: 0.34,
  dodgeCd: 1.1,
  skillCd: 2.8,
  hitStop: 0.065,
  critHitStop: 0.12,
};

const STORAGE_KEYS = {
  lastRun: "breakverse:lastRun:v1",
  inventory: "breakverse:inventory:v1",
};

const STYLE_MODS = {
  "远程嘴炮": { attack: 0.92, skill: 1.18, cd: 0.92, hp: 1 },
  "忍不了一点": { attack: 1.2, skill: 1.05, cd: 1, hp: 0.9 },
  "我扛过太多了": { attack: 0.92, skill: 0.9, cd: 1.06, hp: 1.28 },
  "我不发疯我布局": { attack: 0.88, skill: 1.08, cd: 0.78, hp: 1.05 },
};

const LOOT_ITEMS = {
  unread_earplugs: {
    id: "unread_earplugs",
    name: "已读不回耳塞",
    rarity: "legendary",
    effectType: "projectileImmunity",
    effectValue: 0.35,
    description: "受到语音/弹幕类攻击时，有 35% 概率免疫。",
  },
  sunday_charm: {
    id: "sunday_charm",
    name: "周日护符",
    rarity: "rare",
    effectType: "damageReduction",
    effectValue: 0.14,
    description: "受到 Boss 伤害降低 14%。",
  },
  let_go_remote: {
    id: "let_go_remote",
    name: "放下遥控器",
    rarity: "rare",
    effectType: "cooldownReduction",
    effectValue: 0.18,
    description: "闪避与技能冷却减少 18%。",
  },
  last_page_talisman: {
    id: "last_page_talisman",
    name: "最后一页护符",
    rarity: "epic",
    effectType: "healOnHit",
    effectValue: 2,
    description: "每次命中 Boss 回复 2 点生命。",
  },
  smile_barrier: {
    id: "smile_barrier",
    name: "微笑屏障",
    rarity: "rare",
    effectType: "damageReduction",
    effectValue: 0.18,
    description: "被连续击中时更能扛，受到伤害降低 18%。",
  },
  three_min_sovereignty: {
    id: "three_min_sovereignty",
    name: "三分钟主权",
    rarity: "common",
    effectType: "cooldownReduction",
    effectValue: 0.1,
    description: "攻击和技能冷却减少 10%。",
  },
};

const LEVEL_VARIANTS = {
  office: [
    {
      id: "office_weekend",
      name: "周日 23:47 的开放办公区",
      waves: [
        { id: "messages", title: "Wave 1 · 微信 99+", duration: 10, enemies: [{ type: "memo", count: 3 }] },
        { id: "ppt_elite", title: "Wave 2 · PPT 激光校对", duration: 12, enemies: [{ type: "elite", count: 1 }, { type: "memo", count: 2 }] },
        { id: "boss", title: "Wave 3 · Boss 入场", duration: 999, boss: true },
      ],
    },
    {
      id: "office_meeting",
      name: "没有尽头的会议室",
      waves: [
        { id: "calendar", title: "Wave 1 · 会议邀请", duration: 9, enemies: [{ type: "memo", count: 4 }] },
        { id: "deadline", title: "Wave 2 · 截止时间压迫", duration: 12, enemies: [{ type: "elite", count: 2 }] },
        { id: "boss", title: "Wave 3 · Boss 入场", duration: 999, boss: true },
      ],
    },
  ],
  rain: [
    {
      id: "rain_corridor",
      name: "雨夜消息未读走廊",
      waves: [
        { id: "echo", title: "Wave 1 · 旧消息回声", duration: 10, enemies: [{ type: "memo", count: 3 }] },
        { id: "memory", title: "Wave 2 · 回忆滤镜", duration: 11, enemies: [{ type: "elite", count: 1 }, { type: "memo", count: 3 }] },
        { id: "boss", title: "Wave 3 · Boss 入场", duration: 999, boss: true },
      ],
    },
  ],
  campus: [
    {
      id: "campus_deadline",
      name: "凌晨两点的自习室",
      waves: [
        { id: "papers", title: "Wave 1 · 参考文献", duration: 9, enemies: [{ type: "memo", count: 4 }] },
        { id: "defense", title: "Wave 2 · 答辩预演", duration: 12, enemies: [{ type: "elite", count: 2 }] },
        { id: "boss", title: "Wave 3 · Boss 入场", duration: 999, boss: true },
      ],
    },
  ],
  family: [
    {
      id: "family_table",
      name: "年夜饭圆桌迷宫",
      waves: [
        { id: "questions", title: "Wave 1 · 饭桌问号", duration: 10, enemies: [{ type: "memo", count: 4 }] },
        { id: "comparison", title: "Wave 2 · 别人家孩子", duration: 12, enemies: [{ type: "elite", count: 1 }, { type: "memo", count: 2 }] },
        { id: "boss", title: "Wave 3 · Boss 入场", duration: 999, boss: true },
      ],
    },
  ],
  void: [
    {
      id: "void_recycle",
      name: "情绪回收站",
      waves: [
        { id: "noise", title: "Wave 1 · 小事噪音", duration: 9, enemies: [{ type: "memo", count: 4 }] },
        { id: "knot", title: "Wave 2 · 情绪结块", duration: 12, enemies: [{ type: "elite", count: 2 }] },
        { id: "boss", title: "Wave 3 · Boss 入场", duration: 999, boss: true },
      ],
    },
  ],
};

const SFX = {
  hit: () => playTone(120, 0.08, "square", 0.22),
  crit: () => playTone(420, 0.12, "sawtooth", 0.28),
  dodge: () => playTone(680, 0.1, "sine", 0.16),
  hurt: () => playTone(82, 0.16, "sawtooth", 0.24),
  skill: () => playTone(220, 0.22, "triangle", 0.22),
  generate: () => playTone(520, 0.08, "sine", 0.1),
};

const archetypes = [
  {
    match: ["老板", "领导", "经理", "主管", "客户", "需求", "加班", "kpi", "KPI", "方案", "PPT"],
    relation: "职场压力源",
    glyph: "卷",
    name: "周末吞噬者",
    title: "把休息日吃掉的人",
    level: "周日 23:47 的开放办公区",
    color: "#e5484d",
    emotionType: "rage",
    theme: "office",
    skills: [
      ["紧急需求", "红色感叹号从天而降，逼你原地加班。"],
      ["再改一版", "重置你的节奏，并把焦虑推到眼前。"],
      ["年轻人多锻炼", "Boss 回血，同时甩出一排 KPI 飞刀。"],
    ],
    drop: ["已读不回耳塞", "受到语音类攻击时，有 35% 概率免疫。"],
  },
  {
    match: ["前任", "暧昧", "冷暴力", "分手", "点赞", "相亲", "恋爱"],
    relation: "情感回音",
    glyph: "念",
    name: "回忆倒放机",
    title: "把旧伤循环播放的影子",
    level: "雨夜消息未读走廊",
    color: "#a98df0",
    emotionType: "melt",
    theme: "rain",
    skills: [
      ["突然点赞", "召唤旧动态残影，短暂定住玩家。"],
      ["你想多了", "发射三段回旋弹幕。"],
      ["回忆滤镜", "让场景变暗，并隐藏下一次攻击预警。"],
    ],
    drop: ["放下遥控器", "主动技能命中后，减少一次情绪回放伤害。"],
  },
  {
    match: ["考试", "论文", "老师", "室友", "作业", "实习", "答辩", "deadline", "Deadline"],
    relation: "校园压迫感",
    glyph: "卷",
    name: "截止日期追猎者",
    title: "永远提前一天出现的 Deadline",
    level: "凌晨两点的自习室",
    color: "#55c7d9",
    emotionType: "anxiety",
    theme: "campus",
    skills: [
      ["格式不对", "从屏幕边缘切出蓝色批注刀。"],
      ["明天就交", "加速冲刺并留下拖延陷阱。"],
      ["参考文献风暴", "召唤旋转纸页弹幕。"],
    ],
    drop: ["最后一页护符", "生命低于 30% 时，下一次技能冷却减半。"],
  },
  {
    match: ["亲戚", "父母", "催婚", "老家", "房贷", "孩子", "二胎", "饭桌"],
    relation: "家庭审判",
    glyph: "审",
    name: "饭桌审判官",
    title: "把关心说成拷问的人",
    level: "年夜饭圆桌迷宫",
    color: "#e7b75f",
    emotionType: "rage",
    theme: "family",
    skills: [
      ["什么时候结婚", "发射环形问号冲击波。"],
      ["别人家孩子", "复制一个高速小怪追击玩家。"],
      ["都是为你好", "制造护盾并压缩战斗空间。"],
    ],
    drop: ["微笑屏障", "被连续击中时，自动生成短暂无敌。"],
  },
  {
    match: ["地铁", "通勤", "堵车", "排队", "早高峰", "晚高峰", "挤"],
    relation: "通勤压迫",
    glyph: "挤",
    name: "早高峰碾压者",
    title: "把每一分钟都压扁的车厢",
    level: "早高峰换乘站台",
    color: "#54d4e8",
    emotionType: "anxiety",
    theme: "void",
    skills: [["人潮推搡", "召唤横向压力波。"], ["下一班更挤", "生成连续追踪弹。"], ["到站不开门", "短暂封锁玩家闪避方向。"]],
    drop: ["三分钟主权", "攻击和技能冷却减少 10%。"],
  },
  {
    match: ["外卖", "骑手", "超时", "差评", "餐", "排单"],
    relation: "服务业委屈",
    glyph: "催",
    name: "差评倒计时",
    title: "把善意压成秒表的怪物",
    level: "暴雨里的取餐口",
    color: "#ff3b47",
    emotionType: "rage",
    theme: "rain",
    skills: [["还有多久", "倒计时炸弹落地。"], ["系统派单", "召唤多目标弹幕。"], ["差评阴影", "降低玩家移动速度。"]],
    drop: ["微笑屏障", "受到伤害降低 18%。"],
  },
  {
    match: ["房租", "房东", "搬家", "押金", "中介", "合租"],
    relation: "居住焦虑",
    glyph: "租",
    name: "押金吞没兽",
    title: "把安全感扣成清单的人",
    level: "漏水出租屋",
    color: "#ffc857",
    emotionType: "anxiety",
    theme: "office",
    skills: [["墙皮脱落", "天花板坠落危险物。"], ["押金另算", "Boss 获得护盾。"], ["临时涨租", "场地边界向内收缩。"]],
    drop: ["周日护符", "受到 Boss 伤害降低 14%。"],
  },
  {
    match: ["健身", "体重", "减肥", "身材", "容貌", "皮肤", "焦虑"],
    relation: "自我审判",
    glyph: "审",
    name: "镜子审判者",
    title: "把你变成指标的人",
    level: "过曝试衣间",
    color: "#b596ff",
    emotionType: "melt",
    theme: "void",
    skills: [["放大缺点", "制造视野暗角。"], ["数字审判", "召唤标尺弹幕。"], ["再瘦一点", "吸取玩家生命。"]],
    drop: ["放下遥控器", "闪避与技能冷却减少 18%。"],
  },
  {
    match: ["失眠", "睡不着", "熬夜", "焦虑", "凌晨", "脑子停不下来"],
    relation: "夜间内耗",
    glyph: "眠",
    name: "凌晨复盘机",
    title: "专挑闭眼后开会的脑内主管",
    level: "03:17 的天花板",
    color: "#b596ff",
    emotionType: "melt",
    theme: "rain",
    skills: [["如果当时", "回旋弹幕折返。"], ["明天完了", "削弱玩家攻击。"], ["再想五分钟", "延长 Boss 技能持续时间。"]],
    drop: ["三分钟主权", "攻击和技能冷却减少 10%。"],
  },
  {
    match: ["朋友", "群聊", "已读", "不回", "背刺", "聚会", "社交"],
    relation: "社交消耗",
    glyph: "群",
    name: "群聊吞声者",
    title: "把每句话都变成试探的空气",
    level: "消息气泡剧场",
    color: "#54d4e8",
    emotionType: "anxiety",
    theme: "rain",
    skills: [["怎么不说话", "召唤气泡追踪弹。"], ["大家都在等你", "生成环形压力场。"], ["玩笑而已", "Boss 短暂无敌。"]],
    drop: ["已读不回耳塞", "受到语音/弹幕类攻击时，有 35% 概率免疫。"],
  },
  {
    match: ["游戏", "连跪", "队友", "匹配", "挂机", "排位"],
    relation: "娱乐反噬",
    glyph: "跪",
    name: "连跪匹配器",
    title: "把放松变成第二份工作的系统",
    level: "排位结算废墟",
    color: "#ff3b47",
    emotionType: "rage",
    theme: "void",
    skills: [["队友挂机", "召唤干扰小怪。"], ["差一颗星", "Boss 冲刺。"], ["再来一把", "Boss 低血量狂暴。"]],
    drop: ["最后一页护符", "每次命中 Boss 回复 2 点生命。"],
  },
  {
    match: ["宠物", "猫", "狗", "医院", "生病", "陪伴"],
    relation: "柔软担心",
    glyph: "护",
    name: "担心放大器",
    title: "把爱变成整夜守候的影子",
    level: "宠物医院长椅",
    color: "#ffc857",
    emotionType: "anxiety",
    theme: "family",
    skills: [["检查报告", "落下报告单陷阱。"], ["余额提醒", "削弱玩家资源。"], ["再观察一下", "延长战斗阶段。"]],
    drop: ["微笑屏障", "受到伤害降低 18%。"],
  },
];

const fallback = {
  relation: "人生压力源",
  glyph: "破",
  name: "破防集合体",
  title: "把小事堆成高墙的怪物",
  level: "情绪回收站",
  color: "#58c98f",
  emotionType: "anxiety",
  theme: "void",
  skills: [
    ["突然破防", "近身释放短促冲击波。"],
    ["想太多了", "召唤弹幕从空中落下。"],
    ["先忍一下", "短暂蓄力后向前冲撞。"],
  ],
  drop: ["三分钟主权", "每次击败 Boss 后，恢复一点今天的掌控感。"],
};

function showView(name) {
  Object.values(views).forEach((view) => view.classList.add("hidden"));
  views[name].classList.remove("hidden");
}

function sanitizeInput(text) {
  return text
    .replace(/1[3-9]\d{9}/g, "某个电话怪")
    .replace(/\d{6,}/g, "一串神秘数字")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "某个邮箱幽灵")
    .replace(/([\u4e00-\u9fa5]{2,4})(总|经理|老师|主管|老板)/g, "X$2")
    .trim();
}

function pickArchetype(text) {
  const normalized = text.toLowerCase();
  const ranked = archetypes
    .map((item, index) => {
      const score = item.match.reduce((sum, word) => {
        const w = String(word).toLowerCase();
        if (!normalized.includes(w)) return sum;
        return sum + Math.max(1, Math.min(6, w.length));
      }, 0);
      return { item, score, index };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);
  return ranked[0]?.item || fallback;
}

async function generateBoss() {
  await runGenerationLoader();
  buildBossConfig();
  renderBoss();
  showView("boss");
  SFX.generate();
}

function buildBossConfig() {
  const raw = els.rantInput.value.trim() || "今天被一堆说不清的小事压住了，我想把它做成 Boss。";
  const safe = sanitizeInput(raw);
  const base = pickArchetype(raw);
  const identity = els.identitySelect.value;
  const style = els.styleSelect.value;
  const intensity = inferEmotionIntensity(raw, base);
  const seed = Math.abs([...raw].reduce((sum, char) => sum + char.charCodeAt(0), 0));
  const levelConfig = pickLevelConfig(base.theme, seed);
  const lootTable = createLootTable(base);
  const selectedDrop = rollLoot(lootTable, seed + intensity);

  currentBoss = {
    id: `BV-${String(seed).slice(0, 4).padEnd(4, "8")}`,
    raw,
    safe,
    identity,
    style,
    relation: base.relation,
    glyph: base.glyph,
    name: `${base.name}${intensity > 80 ? "·狂化版" : ""}`,
    title: base.title,
    intro: `系统已把「${safe}」匿名化为 ${base.relation}。职业风格：${style}。`,
    level: levelConfig.name,
    levelConfig,
    color: base.color,
    theme: base.theme,
    emotionType: base.emotionType,
    skills: base.skills.map(([name, description], index) => ({
      id: `skill_${index + 1}`,
      name,
      description,
    })),
    lootTable,
    drop: selectedDrop,
    emotion: {
      anger: Math.min(99, intensity + 8),
      fatigue: Math.min(99, Math.round(intensity * 0.78)),
      resilience: Math.max(24, 100 - Math.round(intensity * 0.45)),
    },
  };
}

function inferEmotionIntensity(raw, base) {
  const signals = ["疯", "崩", "受不了", "烦", "累", "气", "哭", "绝望", "爆炸", "离谱", "崩溃"];
  const signalScore = signals.reduce((sum, word) => sum + (raw.includes(word) ? 8 : 0), 0);
  const relationWeight = base === fallback ? 0 : 10;
  return Math.min(99, Math.max(42, 48 + signalScore + relationWeight + Math.min(22, Math.round(raw.length / 6))));
}

function pickLevelConfig(theme, seed) {
  const variants = LEVEL_VARIANTS[theme] || LEVEL_VARIANTS.void;
  return structuredCloneSafe(variants[seed % variants.length]);
}

function createLootTable(base) {
  const defaultIds = {
    office: ["unread_earplugs", "sunday_charm", "three_min_sovereignty"],
    rain: ["let_go_remote", "unread_earplugs", "three_min_sovereignty"],
    campus: ["last_page_talisman", "three_min_sovereignty", "let_go_remote"],
    family: ["smile_barrier", "sunday_charm", "last_page_talisman"],
    void: ["three_min_sovereignty", "let_go_remote", "smile_barrier"],
  };
  const ids = defaultIds[base.theme] || defaultIds.void;
  return ids.map((id, index) => ({
    ...LOOT_ITEMS[id],
    dropRate: [55, 32, 13][index] || 10,
  }));
}

function rollLoot(lootTable, seed) {
  const total = lootTable.reduce((sum, item) => sum + item.dropRate, 0);
  let cursor = seededRandom(seed) * total;
  for (const item of lootTable) {
    cursor -= item.dropRate;
    if (cursor <= 0) return { ...item };
  }
  return { ...lootTable[0] };
}

function seededRandom(seed) {
  const x = Math.sin(seed || 1) * 10000;
  return x - Math.floor(x);
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function renderBoss() {
  const caseId = currentBoss.id.replace("BV", "SH");
  els.bossGlyph.textContent = currentBoss.glyph;
  els.caseStamp.textContent = `CASE #${caseId}`;
  els.caseFileId.textContent = `CASE FILE #${caseId}`;
  els.bossName.textContent = currentBoss.name;
  els.bossTitle.textContent = currentBoss.title;
  els.bossIntro.textContent = currentBoss.intro;
  els.bossRelation.textContent = currentBoss.relation;
  els.bossEmotion.textContent = `愤怒 ${currentBoss.emotion.anger} / 疲惫 ${currentBoss.emotion.fatigue}`;
  els.bossStyle.textContent = currentBoss.style;
  els.safeText.textContent = currentBoss.safe;
  els.dropPreview.textContent = `${rarityLabel(currentBoss.drop.rarity)} · ${currentBoss.drop.name}：${currentBoss.drop.description}`;
  els.levelName.textContent = currentBoss.level;
  els.bossHudName.textContent = currentBoss.name;
  els.bossPortrait.textContent = currentBoss.glyph;
  els.skillList.innerHTML = currentBoss.skills
    .map((skill) => `<li><strong>${skill.name}</strong>：${skill.description}</li>`)
    .join("");
  document.documentElement.style.setProperty("--red", currentBoss.color);
  document.documentElement.style.setProperty("--boss-color", currentBoss.color);
  document.body.dataset.emotion = currentBoss.emotionType;
}

function initGame() {
  ensureAudio();
  cancelAnimationFrame(animationId);
  const bossMaxHp = 360 + currentBoss.emotion.anger * 2;
  game = {
    startedAt: performance.now(),
    shake: 0,
    hitStop: 0,
    cameraZoom: 1,
    cameraKick: 0,
    shakeState: { x: 0, y: 0, vx: 0, vy: 0, amp: 0, life: 0 },
    flash: 0,
    particles: [],
    messages: [],
    slashes: [],
    telegraphs: [],
    hitNumbers: [],
    sparks: [],
    introTimer: 2.2,
    stats: { damage: 0, taken: 0, breaks: 0 },
    level: structuredCloneSafe(currentBoss.levelConfig),
    waveIndex: 0,
    waveTimer: 0,
    waveTitleTimer: 2.2,
    enemies: [],
    bossActive: false,
    appliedLoot: getEquippedLootEffects(),
    playerTuning: getPlayerTuning(currentBoss.style),
    player: {
      x: 150,
      y: 372,
      w: 46,
      h: 72,
      vx: 0,
      vy: 0,
      hp: Math.round(120 * getPlayerTuning(currentBoss.style).hp),
      maxHp: Math.round(120 * getPlayerTuning(currentBoss.style).hp),
      facing: 1,
      grounded: false,
      attackCd: 0,
      skillCd: 0,
      dodgeCd: 0,
      invuln: 0,
      state: "idle",
      stateTime: 0,
    },
    boss: {
      x: 710,
      y: 308,
      w: 118,
      h: 124,
      hp: bossMaxHp,
      maxHp: bossMaxHp,
      phase: 0,
      attackTimer: 1.2,
      hurt: 0,
      quoteTimer: 1.1,
    },
    projectiles: [],
    hazards: [],
    state: "playing",
  };
  const forceWave = Number(new URLSearchParams(window.location.search).get("forceWave"));
  startWave(Number.isFinite(forceWave) && forceWave > 0 ? forceWave : 0);
  if (new URLSearchParams(window.location.search).get("skipIntro") === "1") {
    game.introTimer = 0;
  }
  showView("game");
  updateHud();
  lastFrame = performance.now();
  animationId = requestAnimationFrame(loop);
}

function rarityLabel(rarity) {
  return {
    common: "普通",
    rare: "稀有",
    epic: "史诗",
    legendary: "传说",
  }[rarity] || "普通";
}

function getPlayerTuning(style) {
  const mod = STYLE_MODS[style] || STYLE_MODS["远程嘴炮"];
  const loot = getEquippedLootEffects();
  const cdBonus = loot.cooldownReduction || 0;
  return {
    attack: mod.attack,
    skill: mod.skill,
    cd: Math.max(0.55, mod.cd * (1 - cdBonus)),
    hp: mod.hp,
  };
}

function getEquippedLootEffects() {
  const inventory = loadInventory();
  const effects = {};
  Object.values(inventory.items || {}).forEach((entry) => {
    const item = LOOT_ITEMS[entry.id];
    if (!item) return;
    effects[item.effectType] = Math.max(effects[item.effectType] || 0, item.effectValue);
  });
  return effects;
}

function loop(now) {
  const rawDt = Math.min(0.033, (now - lastFrame) / 1000);
  lastFrame = now;
  game.hitStop = Math.max(0, game.hitStop - rawDt);
  const dt = rawDt * (game.hitStop > 0 ? 0.05 : 1);
  updateGame(dt);
  drawGame();
  if (game?.state === "playing") {
    animationId = requestAnimationFrame(loop);
  }
}

function updateGame(dt) {
  const p = game.player;
  const b = game.boss;
  const left = keys.has("a") || keys.has("arrowleft") || touch.has("left");
  const right = keys.has("d") || keys.has("arrowright") || touch.has("right");
  const jump = keys.has("w") || keys.has(" ") || keys.has("arrowup") || touch.has("jump");
  const attack = keys.has("j") || touch.has("attack");
  const dodge = keys.has("k") || touch.has("dodge");
  const skill = keys.has("l") || touch.has("skill");

  p.attackCd = Math.max(0, p.attackCd - dt);
  p.skillCd = Math.max(0, p.skillCd - dt);
  p.dodgeCd = Math.max(0, p.dodgeCd - dt);
  p.invuln = Math.max(0, p.invuln - dt);
  game.introTimer = Math.max(0, game.introTimer - dt);
  b.attackTimer -= dt;
  b.hurt = Math.max(0, b.hurt - dt);
  game.cameraKick = Math.max(0, game.cameraKick - dt * 6);
  game.cameraZoom += (1 + game.cameraKick - game.cameraZoom) * Math.min(1, dt * 12);
  game.flash = Math.max(0, game.flash - dt * 4);
  updateShake(dt);

  p.vx = 0;
  if (left) {
    p.vx = -BALANCE.playerSpeed;
    p.facing = -1;
  }
  if (right) {
    p.vx = BALANCE.playerSpeed;
    p.facing = 1;
  }
  if (jump && p.grounded) {
    p.vy = BALANCE.jumpVelocity;
    p.grounded = false;
  }
  if (dodge && p.dodgeCd <= 0) {
    p.vx = p.facing * 620;
    p.invuln = 0.34;
    p.dodgeCd = BALANCE.dodgeCd * game.playerTuning.cd;
    SFX.dodge();
    vibrate(12);
    burst(p.x + p.w / 2, p.y + p.h, "#55c7d9", 10);
  }
  if (attack && p.attackCd <= 0) {
    p.attackCd = BALANCE.attackCd * game.playerTuning.cd;
    strike(p.facing === 1 ? p.x + p.w : p.x - 46, p.y + 8, 64, 46, BALANCE.attackDamage * game.playerTuning.attack);
  }
  if (skill && p.skillCd <= 0) {
    p.skillCd = BALANCE.skillCd * game.playerTuning.cd;
    SFX.skill();
    game.projectiles.push({
      x: p.x + p.w / 2,
      y: p.y + 24,
      vx: p.facing * 520,
      r: 13,
      damage: BALANCE.skillDamage * game.playerTuning.skill,
      color: "#e7b75f",
      from: "player",
    });
  }

  p.vy += BALANCE.gravity * dt;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  if (p.y >= 372) {
    p.y = 372;
    p.vy = 0;
    p.grounded = true;
  }
  p.x = clamp(p.x, 24, 898);

  updatePlayerState(dt);
  updateLevel(dt);
  updateEnemies(dt);
  updateBoss(dt);
  updateProjectiles(dt);
  updateHazards(dt);
  updateParticles(dt);
  updateSlashes(dt);
  updateTelegraphs(dt);
  updateHitNumbers(dt);
  updateSparks(dt);
  updateHud();

  if (game.bossActive && b.hp <= 0) finishRun(true);
  if (p.hp <= 0) finishRun(false);
}

function strike(x, y, w, h, damage) {
  const hitBox = { x, y, w, h };
  const enemy = game.enemies.find((item) => rectsOverlap(hitBox, item));
  const hitBoss = game.bossActive && rectsOverlap(hitBox, game.boss);
  const hit = Boolean(enemy || hitBoss);
  game.flash = 0.18;
  game.slashes.push({
    x: x + w / 2,
    y: y + h / 2,
    facing: game.player.facing,
    life: 0.18,
    hit,
  });
  burst(x + w / 2, y + h / 2, hit ? "#e7b75f" : "#f6f0df", hit ? 18 : 5, game.player.facing);
  if (enemy) damageEnemy(enemy, damage);
  else if (hitBoss) damageBoss(damage);
}

function updatePlayerState(dt) {
  const p = game.player;
  p.stateTime += dt;
  let next = "idle";
  if (p.invuln > 0 && p.dodgeCd > 0.72) next = "dodge";
  else if (p.attackCd > 0.18) next = "attack";
  else if (!p.grounded) next = "jump";
  else if (Math.abs(p.vx) > 10) next = "run";
  if (next !== p.state) {
    p.state = next;
    p.stateTime = 0;
  }
}

function updateLevel(dt) {
  const wave = game.level.waves[game.waveIndex];
  if (!wave) return;
  game.waveTimer += dt;
  game.waveTitleTimer = Math.max(0, game.waveTitleTimer - dt);
  const waveCleared = game.enemies.length === 0;
  if (!wave.boss && (game.waveTimer >= wave.duration || waveCleared)) {
    startWave(game.waveIndex + 1);
  }
}

function startWave(index) {
  game.waveIndex = Math.min(index, game.level.waves.length - 1);
  game.waveTimer = 0;
  game.waveTitleTimer = 2.1;
  game.enemies = [];
  const wave = game.level.waves[game.waveIndex];
  game.bossActive = Boolean(wave.boss);
  toast(wave.title);
  if (wave.enemies) {
    wave.enemies.forEach((group, groupIndex) => {
      for (let i = 0; i < group.count; i += 1) {
        spawnEnemy(group.type, 520 + groupIndex * 90 + i * 78);
      }
    });
  }
}

function spawnEnemy(type, x) {
  const elite = type === "elite";
  game.enemies.push({
    id: `${type}_${Math.random().toString(16).slice(2)}`,
    type,
    x,
    y: elite ? 338 : 366,
    w: elite ? 56 : 38,
    h: elite ? 62 : 42,
    hp: elite ? 92 : 42,
    maxHp: elite ? 92 : 42,
    vx: elite ? -34 : -52,
    attackTimer: 0.8 + Math.random() * 1.4,
    hurt: 0,
    color: elite ? currentBoss.color : "#ffc857",
  });
}

function updateEnemies(dt) {
  const p = game.player;
  game.enemies = game.enemies.filter((enemy) => {
    enemy.hurt = Math.max(0, enemy.hurt - dt);
    enemy.attackTimer -= dt;
    const direction = p.x < enemy.x ? -1 : 1;
    enemy.x += direction * Math.abs(enemy.vx) * dt;
    enemy.x = clamp(enemy.x, 80, 850);
    if (enemy.attackTimer <= 0) {
      enemy.attackTimer = enemy.type === "elite" ? 1.4 : 1.9;
      game.telegraphs.push({ x: enemy.x - 18, y: enemy.y + 16, w: enemy.w + 36, h: 28, life: 0.32, color: enemy.color });
      game.projectiles.push({
        x: enemy.x + enemy.w / 2,
        y: enemy.y + 18,
        vx: direction * (enemy.type === "elite" ? 260 : 210),
        r: enemy.type === "elite" ? 12 : 9,
        damage: enemy.type === "elite" ? 12 : 8,
        color: enemy.color,
        from: "enemy",
      });
    }
    return enemy.hp > 0;
  });
}

function updateBoss(dt) {
  if (!game.bossActive) return;
  const b = game.boss;
  const p = game.player;
  const hpRatio = b.hp / b.maxHp;
  b.phase = hpRatio < 0.3 ? 2 : hpRatio < 0.62 ? 1 : 0;
  b.x += Math.sin(performance.now() / 420) * dt * 18;

  if (b.quoteTimer > 0) b.quoteTimer -= dt;
  if (b.attackTimer > 0) return;

  const pattern = b.phase;
  b.attackTimer = 1.35 - b.phase * 0.16;
  const skill = currentBoss.skills[pattern];
  toast(skill.name);

  if (pattern === 0) {
    const direction = p.x < b.x ? -1 : 1;
    game.telegraphs.push({ x: b.x + direction * 84, y: b.y + 24, w: 120, h: 34, life: 0.38, color: currentBoss.color });
    game.projectiles.push({
      x: b.x + b.w / 2,
      y: b.y + 28,
      vx: direction * 330,
      r: 17,
      damage: 16,
      color: currentBoss.color,
      from: "boss",
    });
  } else if (pattern === 1) {
    for (let i = 0; i < 4; i += 1) {
      game.telegraphs.push({ x: 130 + i * 190, y: 420, w: 58, h: 18, life: 0.54, color: currentBoss.color });
      game.hazards.push({
        x: 130 + i * 190,
        y: -40 - i * 28,
        w: 34,
        h: 64,
        vy: 380,
        damage: 14,
        ttl: 2.2,
        color: currentBoss.color,
      });
    }
  } else {
    const direction = p.x < b.x ? -1 : 1;
    game.telegraphs.push({ x: Math.min(p.x, b.x), y: 410, w: Math.abs(p.x - b.x) + 120, h: 22, life: 0.24, color: currentBoss.color });
    b.x += direction * 108;
    if (rectsOverlap(b, p)) hurtPlayer(22);
    triggerShake(8, direction);
    burst(b.x + b.w / 2, b.y + b.h / 2, currentBoss.color, 20, direction);
  }
}

function updateProjectiles(dt) {
  game.projectiles = game.projectiles.filter((shot) => {
    shot.x += shot.vx * dt;
    if (shot.from === "player") {
      const enemy = game.enemies.find((item) => circleRect(shot, item));
      if (enemy) {
        damageEnemy(enemy, shot.damage);
        return false;
      }
    }
    if (shot.from === "player" && game.bossActive && circleRect(shot, game.boss)) {
      damageBoss(shot.damage);
      return false;
    }
    if ((shot.from === "boss" || shot.from === "enemy") && circleRect(shot, game.player)) {
      hurtPlayer(shot.damage);
      return false;
    }
    return shot.x > -60 && shot.x < 1020;
  });
}

function updateHazards(dt) {
  game.hazards = game.hazards.filter((hazard) => {
    hazard.y += hazard.vy * dt;
    hazard.ttl -= dt;
    if (rectsOverlap(hazard, game.player)) {
      hurtPlayer(hazard.damage);
      hazard.ttl = 0;
      burst(hazard.x + hazard.w / 2, hazard.y + hazard.h / 2, hazard.color, 14);
    }
    return hazard.ttl > 0 && hazard.y < 540;
  });
}

function damageBoss(amount) {
  const isCrit = Math.random() < 0.18;
  const damage = Math.round(isCrit ? amount * 1.6 : amount);
  game.boss.hp = Math.max(0, game.boss.hp - damage);
  game.stats.damage += damage;
  game.stats.breaks += 1;
  game.boss.hurt = 0.16;
  game.hitStop = isCrit ? BALANCE.critHitStop : BALANCE.hitStop;
  game.cameraKick = isCrit ? 0.024 : 0.012;
  triggerShake(isCrit ? 12 : 7, game.player.facing);
  spawnHitSpark(game.boss.x + game.boss.w / 2, game.boss.y + 48, isCrit);
  isCrit ? SFX.crit() : SFX.hit();
  vibrate(isCrit ? 45 : 18);
  game.hitNumbers.push({
    x: game.boss.x + game.boss.w / 2 + (Math.random() - 0.5) * 38,
    y: game.boss.y + 16,
    value: damage,
    color: isCrit ? "#FFC857" : "#fff6e8",
    scale: isCrit ? 1.65 : 1,
    crit: isCrit,
    life: 0.72,
  });
  burst(game.boss.x + 44, game.boss.y + 44, "#e7b75f", isCrit ? 34 : 18, game.player.facing);
  applyOnHitEffects();
}

function damageEnemy(enemy, amount) {
  const damage = Math.round(amount);
  enemy.hp = Math.max(0, enemy.hp - damage);
  enemy.hurt = 0.14;
  game.stats.damage += damage;
  game.hitStop = BALANCE.hitStop * 0.75;
  triggerShake(4, game.player.facing);
  spawnHitSpark(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, false);
  SFX.hit();
  game.hitNumbers.push({
    x: enemy.x + enemy.w / 2,
    y: enemy.y,
    value: damage,
    color: "#fff6e8",
    scale: 0.9,
    life: 0.62,
  });
  burst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, enemy.color, 12, game.player.facing);
  applyOnHitEffects();
}

function applyOnHitEffects() {
  const heal = game.appliedLoot.healOnHit || 0;
  if (heal > 0 && game.player.hp < game.player.maxHp) {
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + heal);
    game.hitNumbers.push({
      x: game.player.x + game.player.w / 2,
      y: game.player.y - 10,
      value: `+${heal}`,
      color: "#62d28f",
      scale: 0.8,
      life: 0.58,
    });
  }
}

function hurtPlayer(amount) {
  const p = game.player;
  if (p.invuln > 0) return;
  if ((game.appliedLoot.projectileImmunity || 0) > 0 && Math.random() < game.appliedLoot.projectileImmunity) {
    toast("装备触发：免疫");
    game.hitNumbers.push({
      x: p.x + p.w / 2,
      y: p.y - 6,
      value: "免疫",
      color: "#54d4e8",
      scale: 0.9,
      life: 0.72,
    });
    return;
  }
  const reduction = game.appliedLoot.damageReduction || 0;
  const finalDamage = Math.max(1, Math.round(amount * (1 - reduction)));
  p.hp = Math.max(0, p.hp - finalDamage);
  game.stats.taken += finalDamage;
  p.invuln = 0.42;
  p.state = "hurt";
  p.stateTime = 0;
  triggerShake(7, -p.facing);
  SFX.hurt();
  vibrate([26, 40, 26]);
  game.hitNumbers.push({
    x: p.x + p.w / 2,
    y: p.y + 4,
    value: `-${Math.round(finalDamage)}`,
    color: "#f0524f",
    scale: 1,
    life: 0.72,
  });
  burst(p.x + p.w / 2, p.y + p.h / 2, "#e5484d", 14, -p.facing);
}

function burst(x, y, color, count, dirX = 0) {
  for (let i = 0; i < count; i += 1) {
    const cone = dirX ? dirX * (90 + Math.random() * 230) : (Math.random() - 0.5) * 290;
    game.particles.push({
      x,
      y,
      vx: cone + (Math.random() - 0.5) * 90,
      vy: (Math.random() - 0.9) * 260,
      life: 0.44 + Math.random() * 0.28,
      color,
    });
  }
}

function updateParticles(dt) {
  game.particles = game.particles.filter((dot) => {
    dot.x += dot.vx * dt;
    dot.y += dot.vy * dt;
    dot.vy += 520 * dt;
    dot.life -= dt;
    return dot.life > 0;
  });
}

function updateSlashes(dt) {
  game.slashes = game.slashes.filter((slash) => {
    slash.life -= dt;
    return slash.life > 0;
  });
}

function updateTelegraphs(dt) {
  game.telegraphs = game.telegraphs.filter((mark) => {
    mark.life -= dt;
    return mark.life > 0;
  });
}

function updateHitNumbers(dt) {
  game.hitNumbers = game.hitNumbers.filter((item) => {
    item.age = (item.age || 0) + dt;
    item.life -= dt;
    return item.life > 0;
  });
}

function spawnHitSpark(x, y, crit) {
  game.sparks.push({
    x,
    y,
    rotation: Math.random() * Math.PI * 2,
    size: crit ? 86 : 54,
    life: 0.16,
    maxLife: 0.16,
    crit,
  });
}

function updateSparks(dt) {
  game.sparks = game.sparks.filter((spark) => {
    spark.life -= dt;
    spark.rotation += dt * 7;
    return spark.life > 0;
  });
}

function triggerShake(amp, dirX = 0) {
  const s = game.shakeState;
  s.amp = Math.max(s.amp, amp);
  s.life = 0.2;
  s.vx += dirX * amp * 3.8;
  s.vy += -amp * 2.1;
}

function updateShake(dt) {
  const s = game.shakeState;
  if (s.life <= 0) {
    s.x += (0 - s.x) * Math.min(1, dt * 16);
    s.y += (0 - s.y) * Math.min(1, dt * 16);
    return;
  }
  s.life -= dt;
  const stiffness = 480;
  const damping = 12;
  s.vx += (-stiffness * s.x - damping * s.vx) * dt;
  s.vy += (-stiffness * s.y - damping * s.vy) * dt;
  s.x += s.vx * dt;
  s.y += s.vy * dt;
  const noise = s.amp * Math.max(0, s.life / 0.2);
  s.x += (Math.random() - 0.5) * noise * 0.4;
  s.y += (Math.random() - 0.5) * noise * 0.4;
  s.amp *= 0.9;
}

function toast(text) {
  game.messages.unshift({ text, life: 1.2 });
  game.messages = game.messages.slice(0, 3);
}

function updateHud() {
  const playerRatio = clamp(game.player.hp / game.player.maxHp, 0, 1);
  const bossRatio = clamp(game.boss.hp / game.boss.maxHp, 0, 1);
  els.playerHpBar.style.width = `${playerRatio * 100}%`;
  els.playerHpLag.style.width = `${playerRatio * 100}%`;
  els.playerHpText.textContent = `${Math.ceil(game.player.hp)}/${game.player.maxHp}`;
  els.bossHpBar.style.width = `${bossRatio * 100}%`;
  els.bossHpLag.style.width = `${bossRatio * 100}%`;
  els.bossHpText.textContent = `${Math.ceil(game.boss.hp)}/${game.boss.maxHp}`;
  const phaseLabel = ["PHASE 1/3", "PHASE 2/3", "PHASE 3/3"][game.boss.phase] || "PHASE 3/3";
  const wave = game.level.waves[game.waveIndex];
  els.bossPhaseText.textContent = game.bossActive
    ? `${phaseLabel} · ${currentBoss.skills[game.boss.phase]?.name || "情绪暴走"}`
    : `${wave?.title || "副本推进中"} · 敌人 ${game.enemies.length}`;
  updateCdRing(els.attackCdRing, 1 - game.player.attackCd / (BALANCE.attackCd * game.playerTuning.cd));
  updateCdRing(els.dodgeCdRing, 1 - game.player.dodgeCd / (BALANCE.dodgeCd * game.playerTuning.cd));
  updateCdRing(els.skillCdRing, 1 - game.player.skillCd / (BALANCE.skillCd * game.playerTuning.cd));
  game.messages.forEach((message) => {
    message.life -= 0.016;
  });
  game.messages = game.messages.filter((message) => message.life > 0);
}

function updateCdRing(ring, ratio) {
  const circumference = 2 * Math.PI * 21;
  const value = clamp(ratio, 0, 1);
  ring.style.strokeDasharray = `${circumference}`;
  ring.style.strokeDashoffset = `${circumference * (1 - value)}`;
  ring.closest(".skill-btn")?.classList.toggle("ready", value >= 0.99);
}

function drawGame() {
  ctx.save();
  ctx.clearRect(0, 0, 960, 540);
  ctx.translate(480, 270);
  ctx.scale(game.cameraZoom, game.cameraZoom);
  ctx.translate(-480 + game.shakeState.x, -270 + game.shakeState.y);
  drawBackground();
  drawTelegraphs();
  drawPlayer();
  drawEnemies();
  drawBoss();
  drawProjectiles();
  drawHazards();
  drawSlashes();
  drawParticles();
  drawSparks();
  drawHitNumbers();
  drawBattleOverlay();
  drawMessages();
  if (game.flash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${game.flash * 0.16})`;
    ctx.fillRect(0, 0, 960, 540);
  }
  drawVignette();
  ctx.restore();
}

function drawBackground() {
  const t = performance.now() / 1000;
  const camOffset = ((game?.player?.x || 480) - 480) * 0.3;
  const gradient = ctx.createLinearGradient(0, 0, 960, 540);
  const palette = themePalette(currentBoss.theme);
  gradient.addColorStop(0, palette.skyA);
  gradient.addColorStop(0.48, palette.skyB);
  gradient.addColorStop(1, palette.skyC);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 960, 540);

  const glow = ctx.createRadialGradient(720, 170, 20, 720, 170, 360);
  glow.addColorStop(0, hexToRgba(currentBoss.color, 0.34));
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 960, 540);

  ctx.save();
  ctx.translate(-camOffset * 0.22, 0);
  drawStageSet(palette, t, "far");
  ctx.restore();
  ctx.save();
  ctx.translate(-camOffset * 0.52, 0);
  drawStageSet(palette, t, "mid");
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = "rgba(255,246,232,0.12)";
  for (let y = 78; y < 430; y += 38) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(t + y) * 2);
    ctx.lineTo(960, y + Math.cos(t + y) * 2);
    ctx.stroke();
  }
  ctx.restore();

  const floor = ctx.createLinearGradient(0, 430, 0, 540);
  floor.addColorStop(0, "rgba(255,246,232,0.13)");
  floor.addColorStop(0.08, "rgba(0,0,0,0.55)");
  floor.addColorStop(1, "rgba(0,0,0,0.9)");
  ctx.fillStyle = floor;
  ctx.fillRect(0, 430, 960, 110);
  ctx.fillStyle = hexToRgba(currentBoss.color, 0.62);
  ctx.fillRect(0, 430, 960, 3);
  ctx.fillStyle = "rgba(255,246,232,0.08)";
  for (let x = -60; x < 1020; x += 92) {
    drawQuad(x, 540, x + 58, 540, x + 142, 430, x + 108, 430);
  }
  ctx.save();
  ctx.translate(-camOffset * 1.15, 0);
  drawForegroundProps(t);
  ctx.restore();
}

function drawPlayer() {
  const p = game.player;
  const t = p.stateTime;
  const run = Math.sin(t * 14) * (p.state === "run" ? 1 : 0);
  let bodyRot = 0;
  let bodyY = Math.sin(t * 3) * 1.4;
  let armSwing = run * 0.6;
  let squashX = 1;
  let squashY = 1;
  if (p.state === "jump") {
    squashY = p.vy < 0 ? 1.1 : 0.92;
    squashX = p.vy < 0 ? 0.95 : 1.06;
    armSwing = -0.45;
  } else if (p.state === "attack") {
    bodyRot = -0.18 + t * 4.2;
    armSwing = 1.15;
  } else if (p.state === "dodge") {
    bodyRot = -0.62;
    bodyY = Math.sin(t * 10) * 6;
  } else if (p.state === "hurt") {
    bodyRot = Math.sin(t * 40) * 0.1;
  }
  ctx.save();
  ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
  ctx.scale(p.facing, 1);
  ctx.scale(1.2, 1.2);
  ctx.rotate(bodyRot);
  ctx.translate(0, bodyY);
  ctx.scale(squashX, squashY);
  if (p.invuln > 0) ctx.globalAlpha = 0.58 + Math.sin(performance.now() / 28) * 0.22;

  ctx.shadowColor = "rgba(84,212,232,0.55)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "rgba(84,212,232,0.22)";
  ellipse(0, 32, 34, 8);
  ctx.shadowBlur = 0;

  ctx.strokeStyle = "#0b0d10";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-8, -2);
  ctx.lineTo(-20, 24 + run * 7);
  ctx.moveTo(10, -2);
  ctx.lineTo(22, 25 - run * 7);
  ctx.stroke();

  ctx.fillStyle = "#fff6e8";
  roundedRect(-15, -26, 30, 42, 10);
  ctx.fill();
  ctx.fillStyle = "#20242b";
  roundedRect(-17, -11, 34, 27, 8);
  ctx.fill();
  ctx.fillStyle = "#54d4e8";
  roundedRect(-21, -21, 42, 23, 8);
  ctx.fill();
  ctx.fillStyle = "#fff6e8";
  ellipse(0, -42, 15, 16);
  ctx.fillStyle = "#24272e";
  ctx.beginPath();
  ctx.arc(-2, -49, 17, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#54d4e8";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(8, -12);
  ctx.lineTo(34, -22 + run * 3 - armSwing * 8);
  ctx.stroke();
  ctx.strokeStyle = "#f3bd58";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(30, -24 + run * 3 - armSwing * 8);
  ctx.lineTo(64, -32 + run * 4 - armSwing * 18);
  ctx.stroke();

  ctx.fillStyle = "#111214";
  ctx.fillRect(5, -44, 4, 4);
  ctx.fillStyle = "#f3bd58";
  ctx.fillRect(-12, -31, 24, 4);
  ctx.restore();
}

function drawEnemies() {
  game.enemies.forEach((enemy) => {
    ctx.save();
    ctx.translate(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
    if (enemy.hurt > 0) ctx.translate(Math.sin(performance.now() / 16) * 4, 0);
    ctx.shadowColor = enemy.color;
    ctx.shadowBlur = enemy.type === "elite" ? 20 : 12;
    ctx.fillStyle = enemy.type === "elite" ? hexToRgba(enemy.color, 0.9) : "rgba(255,200,87,0.86)";
    if (enemy.type === "elite") {
      jaggedBossShape(-enemy.w / 2, -enemy.h / 2, enemy.w, enemy.h, 9);
      ctx.fillStyle = "#111214";
      ellipse(0, -12, 8, 7);
    } else {
      roundedRect(-enemy.w / 2, -enemy.h / 2, enemy.w, enemy.h, 9);
      ctx.fill();
      ctx.fillStyle = "#111214";
      ctx.font = "900 18px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("!", 0, 1);
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(0,0,0,0.62)";
    roundedRect(-enemy.w / 2, -enemy.h / 2 - 13, enemy.w, 5, 3);
    ctx.fill();
    ctx.fillStyle = "#62d28f";
    roundedRect(-enemy.w / 2, -enemy.h / 2 - 13, enemy.w * (enemy.hp / enemy.maxHp), 5, 3);
    ctx.fill();
    ctx.restore();
  });
}

function drawBoss() {
  if (!game.bossActive) return;
  const b = game.boss;
  const t = performance.now() / 1000;
  ctx.save();
  ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
  ctx.scale(1.08, 1.08);
  if (b.hurt > 0) ctx.translate(Math.sin(performance.now() / 18) * 5, 0);
  drawBossBody(t, true);
  drawBossBody(t, false);
  ctx.restore();
}

function drawBossBody(t, ghost) {
  ctx.save();
  const phase = game?.boss?.phase || 0;
  if (ghost) {
    ctx.globalAlpha = 0.25;
    ctx.translate(-10, 8);
  }

  ctx.shadowColor = hexToRgba(currentBoss.color, 0.72);
  ctx.shadowBlur = 34;
  ctx.fillStyle = hexToRgba(currentBoss.color, 0.24);
  ellipse(0, 58, 86, 14);
  ctx.shadowBlur = 0;

  ctx.strokeStyle = hexToRgba(currentBoss.color, 0.72);
  ctx.lineWidth = 4;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(0, -24, 56 + i * 16 + Math.sin(t * 2 + i) * 4, 46 + i * 10, Math.sin(t + i) * 0.18, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "#171014";
  jaggedBossShape(-64, -34, 128, 112, 18);
  ctx.fillStyle = currentBoss.color;
  ctx.globalAlpha = 1;
  jaggedBossShape(-52, -48, 104, 116, 16);
  ctx.fillStyle = "#fff6e8";
  ellipse(0, -66, 31, 30);
  ctx.fillStyle = "#1A0000";
  ellipse(0, -68, 16, 13);
  ctx.fillStyle = currentBoss.color;
  ctx.shadowColor = currentBoss.color;
  ctx.shadowBlur = 18;
  ellipse(0, -68, 9, 8);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#FFFFFF";
  ellipse(3, -71, 2.5, 2.5);

  ctx.strokeStyle = "#fff6e8";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-42, -12);
  ctx.lineTo(-86, 8 + Math.sin(t * 4) * 7);
  ctx.moveTo(42, -12);
  ctx.lineTo(86, 8 - Math.sin(t * 4) * 7);
  ctx.stroke();

  ctx.fillStyle = "#11110f";
  ctx.font = "900 38px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(currentBoss.glyph, 0, 8);
  if (!ghost) drawBossProp(t);

  ctx.fillStyle = "rgba(0,0,0,0.54)";
  roundedRect(-80, -116, 160, 28, 8);
  ctx.fill();
  ctx.fillStyle = "#fff6e8";
  ctx.font = "900 14px sans-serif";
  ctx.fillText(currentBoss.skills[phase]?.name || "情绪暴走", 0, -101);
  ctx.restore();
}

function drawProjectiles() {
  game.projectiles.forEach((shot) => {
    ctx.save();
    ctx.beginPath();
    const g = ctx.createRadialGradient(shot.x, shot.y, 2, shot.x, shot.y, shot.r * 2.4);
    g.addColorStop(0, "#fff6e8");
    g.addColorStop(0.42, shot.color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.shadowColor = shot.color;
    ctx.shadowBlur = 24;
    ctx.arc(shot.x, shot.y, shot.r * 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = shot.color;
    roundedRect(shot.x - shot.r * 1.4, shot.y - shot.r * 0.48, shot.r * 2.8, shot.r * 0.96, shot.r);
    ctx.fill();
    ctx.restore();
  });
}

function drawBossProp(t) {
  ctx.save();
  ctx.rotate(Math.sin(t * 2) * 0.08);
  if (currentBoss.theme === "office") {
    ctx.fillStyle = "#111214";
    roundedRect(58, -18, 42, 26, 6);
    ctx.fill();
    ctx.fillStyle = "#f3bd58";
    ctx.fillRect(66, -11, 24, 4);
    ctx.fillRect(66, -3, 16, 4);
  } else if (currentBoss.theme === "rain") {
    ctx.strokeStyle = "#b596ff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(70, -18, 24, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#fff6e8";
    roundedRect(56, -12, 30, 50, 8);
    ctx.fill();
  } else if (currentBoss.theme === "campus") {
    ctx.fillStyle = "#fff6e8";
    roundedRect(60, -28, 48, 64, 4);
    ctx.fill();
    ctx.fillStyle = "#54d4e8";
    ctx.fillRect(68, -16, 30, 5);
    ctx.fillRect(68, -2, 22, 5);
  } else if (currentBoss.theme === "family") {
    ctx.fillStyle = "#f3bd58";
    ellipse(74, 8, 32, 11);
    ctx.fillStyle = "#f0524f";
    ellipse(74, 5, 20, 6);
  } else {
    ctx.strokeStyle = "#62d28f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(72, 0, 24, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawHazards() {
  game.hazards.forEach((hazard) => {
    ctx.save();
    ctx.shadowColor = hazard.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = hazard.color;
    drawDiamond(hazard.x + hazard.w / 2, hazard.y + hazard.h / 2, hazard.w * 0.75, hazard.h * 0.72);
    ctx.fillStyle = "rgba(255,246,232,0.76)";
    roundedRect(hazard.x + 8, hazard.y + 12, hazard.w - 16, 7, 4);
    ctx.fill();
    ctx.restore();
  });
}

function drawTelegraphs() {
  game.telegraphs.forEach((mark) => {
    ctx.save();
    ctx.globalAlpha = Math.min(0.72, mark.life * 2.4);
    ctx.strokeStyle = mark.color;
    ctx.fillStyle = hexToRgba(mark.color, 0.18);
    ctx.lineWidth = 2;
    roundedRect(mark.x, mark.y, mark.w, mark.h, 10);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
}

function drawSlashes() {
  game.slashes.forEach((slash) => {
    ctx.save();
    ctx.translate(slash.x, slash.y);
    ctx.scale(slash.facing, 1);
    ctx.rotate(-0.22);
    ctx.globalAlpha = Math.min(1, slash.life * 8);
    const g = ctx.createLinearGradient(-70, 0, 82, 0);
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(0.28, slash.hit ? "#f3bd58" : "#fff6e8");
    g.addColorStop(0.62, "#fff6e8");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-72, -16);
    ctx.quadraticCurveTo(18, -42, 86, -6);
    ctx.quadraticCurveTo(20, 18, -72, 16);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawParticles() {
  game.particles.forEach((dot) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, dot.life);
    ctx.fillStyle = dot.color;
    ctx.shadowColor = dot.color;
    ctx.shadowBlur = 10;
    roundedRect(dot.x, dot.y, 5, 5, 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawSparks() {
  game.sparks.forEach((spark) => {
    ctx.save();
    ctx.translate(spark.x, spark.y);
    ctx.rotate(spark.rotation);
    const t = spark.life / spark.maxLife;
    const size = spark.size * (1.45 - t * 0.38);
    ctx.globalAlpha = t;
    ctx.strokeStyle = spark.crit ? "#FFC857" : "#FFFFFF";
    ctx.fillStyle = spark.crit ? "#FFC857" : "#FFFFFF";
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 32;
    ctx.lineWidth = size * 0.08;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.moveTo(0, -size * 0.28);
    ctx.lineTo(0, size * 0.28);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawHitNumbers() {
  game.hitNumbers.forEach((item) => {
    const progress = 1 - item.life / 0.72;
    const ease = progress < 0.2 ? progress * 5 : 1;
    const bounce = progress < 0.2 ? Math.sin(ease * Math.PI) * 0.4 : 0;
    const yOffset = -progress * 60 + (progress > 0.72 ? (progress - 0.72) * 90 : 0);
    ctx.save();
    ctx.globalAlpha = item.life > 0.2 ? 1 : item.life * 5;
    ctx.translate(item.x, item.y + yOffset);
    ctx.scale((item.scale || 1) * (ease + bounce), (item.scale || 1) * (ease + bounce));
    ctx.fillStyle = item.color;
    ctx.strokeStyle = "rgba(0,0,0,0.78)";
    ctx.lineWidth = 5;
    ctx.font = `950 ${item.crit ? 36 : 26}px JetBrains Mono, SF Mono, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText(item.value, 0, 0);
    ctx.fillText(item.value, 0, 0);
    if (item.crit) {
      ctx.font = "900 13px sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("CRIT", 0, -30);
    }
    ctx.restore();
  });
}

function drawBattleOverlay() {
  ctx.save();
  if (game.introTimer > 0 || game.waveTitleTimer > 0) {
    const alpha = Math.min(1, game.introTimer);
    if (game.introTimer > 0) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(0,0,0,0.52)";
      ctx.fillRect(0, 0, 960, 540);
    } else {
      ctx.globalAlpha = Math.min(1, game.waveTitleTimer);
    }
    const wave = game.level.waves[game.waveIndex];
    ctx.fillStyle = "#f3bd58";
    ctx.font = "950 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(game.introTimer > 0 ? "BREAKVERSE DUNGEON" : "BREAKVERSE WAVE", 480, 222);
    ctx.fillStyle = "#fff6e8";
    ctx.font = "950 48px sans-serif";
    ctx.fillText(game.introTimer > 0 ? currentBoss.level : wave.title, 480, 278);
    ctx.fillStyle = "rgba(255,246,232,0.72)";
    ctx.font = "900 18px sans-serif";
    ctx.fillText(game.introTimer > 0 ? `目标：击败 ${currentBoss.name}` : "清理压力源，推进到下一波", 480, 318);
  }
  ctx.restore();
}

function drawCooldownIcon(x, y, label, ratio, color) {
  const clamped = clamp(ratio, 0, 1);
  ctx.save();
  ctx.fillStyle = "rgba(5,7,10,0.72)";
  roundedRect(x, y, 48, 48, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,246,232,0.28)";
  ctx.stroke();
  ctx.fillStyle = hexToRgba(color, 0.22);
  ctx.fillRect(x, y + 48 - clamped * 48, 48, clamped * 48);
  ctx.fillStyle = color;
  ctx.font = "950 18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + 24, y + 25);
  ctx.restore();
}

function drawVignette() {
  const vg = ctx.createRadialGradient(480, 270, 190, 480, 270, 560);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(0.72, "rgba(0,0,0,0.26)");
  vg.addColorStop(1, "rgba(0,0,0,0.58)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, 960, 540);
}

function drawMessages() {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  game.messages.forEach((message, index) => {
    ctx.globalAlpha = Math.min(1, message.life);
    ctx.fillStyle = "rgba(8,9,11,0.78)";
    roundedRect(334, 42 + index * 42, 292, 34, 10);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(currentBoss.color, 0.6);
    ctx.stroke();
    ctx.fillStyle = "#f6f0df";
    ctx.font = "900 18px sans-serif";
    ctx.fillText(message.text, 480, 60 + index * 42);
    ctx.globalAlpha = 1;
  });
}

function finishRun(won) {
  if (!game || game.state !== "playing") return;
  game.state = "done";
  cancelAnimationFrame(animationId);
  const seconds = Math.max(12, Math.round((performance.now() - game.startedAt) / 1000));
  const hp = Math.max(0, Math.round(game.player.hp));
  const shareCode = `${currentBoss.id}-${won ? "WIN" : "TRY"}`;
  const earnedDrop = won ? currentBoss.drop : null;
  if (earnedDrop) addInventoryItem(earnedDrop);
  saveLastRun({
    bossName: currentBoss.name,
    won,
    dropName: earnedDrop?.name || "无掉落",
    code: shareCode,
    at: Date.now(),
  });
  const title = won ? "你夺回了今晚这三分钟" : "这次没赢，但 Boss 已经露血条了";
  const summary = won
    ? `你击败了「${currentBoss.name}」，剩余生命 ${hp}。现实不一定立刻改变，但你已经把它变成了可处理的东西。`
    : `你被「${currentBoss.name}」打回入口，用时 ${seconds} 秒。下一局建议多用闪避和技能。`;
  const share = `我把「${currentBoss.safe}」做成了 Boss：${currentBoss.name}。\n${won ? "刚刚打爆了它" : "这次差点打爆它"}，${earnedDrop ? `掉落：${earnedDrop.name}` : "这次没有掉落"}。\n战报编号：${shareCode}`;

  els.resultTitle.textContent = title;
  els.resultSummary.textContent = summary;
  els.shareBossName.textContent = currentBoss.name;
  els.shareDamage.textContent = `⚔ ${String(game.stats.damage).padStart(4, "0")}`;
  els.shareTime.textContent = `⏱ ${formatTime(seconds)}`;
  els.shareBreaks.textContent = `💢 ${game.stats.breaks}`;
  els.shareDrop.textContent = earnedDrop ? `掉落：${earnedDrop.name}` : "未掉落：下次再打回来";
  els.shareQuote.textContent = won
    ? "不是所有崩溃都要忍着，有些可以被打败。"
    : "失败不是结算，是第二阶段开场。";
  els.shareCode.textContent = `挑战码：${shareCode}`;
  els.lootName.textContent = earnedDrop ? earnedDrop.name : "没有获得装备";
  els.lootEffect.textContent = earnedDrop ? earnedDrop.description : "失败时不会发放装备，下一局仍可挑战同一 Boss。";
  els.shareText.value = share;
  renderLastRun();
  showView("result");
}

function loadInventory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.inventory)) || { items: {} };
  } catch {
    return { items: {} };
  }
}

function saveInventory(inventory) {
  localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(inventory));
}

function addInventoryItem(item) {
  const inventory = loadInventory();
  inventory.items ||= {};
  const existing = inventory.items[item.id] || { id: item.id, count: 0, firstAt: Date.now() };
  existing.count += 1;
  existing.lastAt = Date.now();
  inventory.items[item.id] = existing;
  saveInventory(inventory);
}

function saveLastRun(run) {
  localStorage.setItem(STORAGE_KEYS.lastRun, JSON.stringify(run));
}

function loadLastRun() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.lastRun));
  } catch {
    return null;
  }
}

function renderLastRun() {
  const run = loadLastRun();
  if (!run) {
    els.lastRunStrip.classList.add("hidden");
    return;
  }
  els.lastRunStrip.textContent = `上次副本：${run.bossName} · ${run.won ? "已击败" : "未通关"} · ${run.dropName}`;
  els.lastRunStrip.classList.remove("hidden");
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function circleRect(circle, rect) {
  const x = clamp(circle.x, rect.x, rect.x + rect.w);
  const y = clamp(circle.y, rect.y, rect.y + rect.h);
  return Math.hypot(circle.x - x, circle.y - y) < circle.r;
}

function themePalette(theme) {
  const palettes = {
    office: {
      skyA: "#101116",
      skyB: "#1b1717",
      skyC: "#281014",
      window: "rgba(243,189,88,0.34)",
      prop: "rgba(84,212,232,0.16)",
    },
    rain: {
      skyA: "#111023",
      skyB: "#151b2b",
      skyC: "#20132c",
      window: "rgba(181,150,255,0.34)",
      prop: "rgba(84,212,232,0.22)",
    },
    campus: {
      skyA: "#081b20",
      skyB: "#10252b",
      skyC: "#141b22",
      window: "rgba(84,212,232,0.28)",
      prop: "rgba(255,246,232,0.14)",
    },
    family: {
      skyA: "#20130c",
      skyB: "#231711",
      skyC: "#33130f",
      window: "rgba(243,189,88,0.38)",
      prop: "rgba(240,82,79,0.16)",
    },
    void: {
      skyA: "#0a1010",
      skyB: "#101718",
      skyC: "#10130d",
      window: "rgba(98,210,143,0.3)",
      prop: "rgba(84,212,232,0.14)",
    },
  };
  return palettes[theme] || palettes.void;
}

function drawStageSet(palette, t) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.fillRect(0, 0, 960, 430);

  if (currentBoss.theme === "office") {
    for (let i = 0; i < 9; i += 1) {
      const x = 42 + i * 103;
      ctx.fillStyle = "rgba(5,7,10,0.58)";
      roundedRect(x, 92 + (i % 2) * 14, 62, 258, 3);
      ctx.fill();
      ctx.fillStyle = palette.window;
      for (let r = 0; r < 6; r += 1) {
        ctx.fillRect(x + 12, 114 + r * 35, 12, 12);
        ctx.fillRect(x + 36, 114 + r * 35, 12, 12);
      }
    }
    drawDesk(115, 382, "#3b2b23");
    drawDesk(520, 380, "#2f3139");
    drawMonitor(576, 330, currentBoss.color);
  } else if (currentBoss.theme === "rain") {
    for (let i = 0; i < 38; i += 1) {
      const x = (i * 41 + t * 70) % 980;
      ctx.strokeStyle = "rgba(84,212,232,0.22)";
      ctx.beginPath();
      ctx.moveTo(x, 35);
      ctx.lineTo(x - 24, 210);
      ctx.stroke();
    }
    drawPhoneBubble(130, 150, "已读");
    drawPhoneBubble(618, 118, "在吗");
  } else if (currentBoss.theme === "campus") {
    for (let i = 0; i < 7; i += 1) {
      drawBookStack(70 + i * 124, 340 + (i % 2) * 18);
    }
    drawBlackboard(268, 95);
  } else if (currentBoss.theme === "family") {
    ctx.fillStyle = "rgba(243,189,88,0.14)";
    ellipse(480, 354, 250, 56);
    ctx.strokeStyle = "rgba(243,189,88,0.36)";
    ctx.lineWidth = 3;
    ellipse(480, 354, 250, 56, true);
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      drawBowl(480 + Math.cos(angle) * 145, 354 + Math.sin(angle) * 28);
    }
  } else {
    for (let i = 0; i < 14; i += 1) {
      ctx.strokeStyle = i % 2 ? palette.window : palette.prop;
      ctx.beginPath();
      ctx.arc(480, 245, 50 + i * 26 + Math.sin(t + i) * 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawDesk(x, y, color) {
  ctx.fillStyle = color;
  roundedRect(x, y, 190, 22, 5);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.42)";
  ctx.fillRect(x + 18, y + 22, 12, 48);
  ctx.fillRect(x + 160, y + 22, 12, 48);
}

function drawMonitor(x, y, color) {
  ctx.fillStyle = "rgba(5,7,10,0.85)";
  roundedRect(x, y, 92, 54, 6);
  ctx.fill();
  ctx.fillStyle = hexToRgba(color, 0.32);
  ctx.fillRect(x + 10, y + 10, 72, 9);
  ctx.fillRect(x + 10, y + 27, 46, 8);
}

function drawPhoneBubble(x, y, text) {
  ctx.fillStyle = "rgba(255,246,232,0.12)";
  roundedRect(x, y, 112, 46, 14);
  ctx.fill();
  ctx.fillStyle = "#fff6e8";
  ctx.font = "900 18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + 56, y + 23);
}

function drawBookStack(x, y) {
  const colors = ["#54d4e8", "#f3bd58", "#fff6e8"];
  colors.forEach((color, index) => {
    ctx.fillStyle = color;
    roundedRect(x + index * 4, y - index * 20, 84, 14, 3);
    ctx.fill();
  });
}

function drawBlackboard(x, y) {
  ctx.fillStyle = "rgba(4,20,16,0.72)";
  roundedRect(x, y, 360, 134, 5);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,246,232,0.22)";
  ctx.stroke();
  ctx.fillStyle = "rgba(255,246,232,0.42)";
  ctx.font = "900 26px sans-serif";
  ctx.fillText("DEADLINE", x + 180, y + 68);
}

function drawBowl(x, y) {
  ctx.fillStyle = "rgba(255,246,232,0.7)";
  ellipse(x, y, 28, 10);
  ctx.fillStyle = "rgba(240,82,79,0.5)";
  ellipse(x, y - 2, 18, 5);
}

function roundedRect(x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function ellipse(x, y, rx, ry, strokeOnly = false) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (strokeOnly) ctx.stroke();
  else ctx.fill();
}

function drawQuad(x1, y1, x2, y2, x3, y3, x4, y4) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x4, y4);
  ctx.closePath();
  ctx.fill();
}

function drawDiamond(x, y, rx, ry) {
  ctx.beginPath();
  ctx.moveTo(x, y - ry);
  ctx.lineTo(x + rx, y);
  ctx.lineTo(x, y + ry);
  ctx.lineTo(x - rx, y);
  ctx.closePath();
  ctx.fill();
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);
  return `rgba(${red},${green},${blue},${alpha})`;
}

function jaggedBossShape(x, y, w, h, cut) {
  ctx.beginPath();
  ctx.moveTo(x + cut, y);
  ctx.lineTo(x + w - cut * 0.7, y + 5);
  ctx.lineTo(x + w, y + cut * 1.2);
  ctx.lineTo(x + w - 8, y + h - cut);
  ctx.lineTo(x + w - cut * 1.5, y + h);
  ctx.lineTo(x + cut * 0.7, y + h - 3);
  ctx.lineTo(x, y + h - cut * 1.1);
  ctx.lineTo(x + 6, y + cut);
  ctx.closePath();
  ctx.fill();
}

function drawForegroundProps(t) {
  ctx.save();
  ctx.globalAlpha = 0.72;
  if (currentBoss.theme === "office") {
    drawMonitor(84, 404, currentBoss.color);
    drawPaper(712, 392, t);
    drawPaper(758, 408, t + 1.3);
  } else if (currentBoss.theme === "rain") {
    for (let i = 0; i < 70; i += 1) {
      const x = (i * 71 + t * 230) % 1040 - 40;
      const y = (i * 37 + t * 620) % 620 - 50;
      ctx.strokeStyle = "rgba(180,210,230,0.34)";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 5, y + 17);
      ctx.stroke();
    }
  } else if (currentBoss.theme === "campus") {
    drawPaper(150, 410, t);
    drawPaper(805, 392, t + 2);
  } else if (currentBoss.theme === "family") {
    drawBowl(150, 418);
    drawBowl(780, 404);
  }
  ctx.restore();
}

function drawPaper(x, y, t) {
  ctx.save();
  ctx.translate(x, y + Math.sin(t * 2) * 3);
  ctx.rotate(Math.sin(t) * 0.08);
  ctx.fillStyle = "rgba(255,246,232,0.62)";
  roundedRect(-20, -14, 40, 28, 3);
  ctx.fill();
  ctx.fillStyle = "rgba(10,12,16,0.32)";
  ctx.fillRect(-12, -5, 24, 3);
  ctx.fillRect(-12, 4, 16, 3);
  ctx.restore();
}

async function runGenerationLoader() {
  ensureAudio();
  els.generateBtn.disabled = true;
  els.loaderOverlay.classList.remove("hidden");
  const steps = ["扫描关键词...", "匹配人生原型...", "生成 Boss 战档案...", "校准情绪强度...", "副本就绪。"];
  for (const step of steps) {
    els.loaderDetail.textContent = step;
    SFX.generate();
    await wait(260);
  }
  els.loaderOverlay.classList.add("hidden");
  els.generateBtn.disabled = false;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureAudio() {
  if (!audioCtx) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (AudioCtor) audioCtx = new AudioCtor();
  }
  if (audioCtx?.state === "suspended") audioCtx.resume();
}

function playTone(freq, dur, type = "sine", vol = 0.2) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * 0.52), audioCtx.currentTime + dur);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
}

function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

function updateClock() {
  const now = new Date();
  els.brandClock.textContent = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function updateRantCounter() {
  const len = els.rantInput.value.length;
  els.rantCounter.textContent = `${len}/180`;
  els.rantInput.closest(".terminal-input")?.classList.toggle("is-hot", len > 100);
  els.rantInput.closest(".terminal-input")?.classList.toggle("is-max", len >= 180);
}

document.addEventListener("keydown", (event) => {
  keys.add(event.key.toLowerCase());
  if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())) {
    event.preventDefault();
  }
});

document.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

document.querySelectorAll("[data-touch]").forEach((button) => {
  const name = button.dataset.touch;
  const start = (event) => {
    event.preventDefault();
    touch.add(name);
  };
  const end = (event) => {
    event.preventDefault();
    touch.delete(name);
  };
  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", end);
  button.addEventListener("pointercancel", end);
  button.addEventListener("pointerleave", end);
});

els.identityChips.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    els.identityChips.querySelectorAll(".chip").forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");
    els.identitySelect.value = chip.dataset.value;
    SFX.generate();
  });
});

els.rantInput.addEventListener("input", updateRantCounter);
document.addEventListener("pointerdown", ensureAudio, { once: true });
els.generateBtn.addEventListener("click", generateBoss);
els.regenBtn.addEventListener("click", generateBoss);
els.startBtn.addEventListener("click", initGame);
els.againBtn.addEventListener("click", () => {
  showView("intro");
  els.rantInput.focus();
});
els.copyBtn.addEventListener("click", async () => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(els.shareText.value);
  } else {
    els.shareText.select();
    document.execCommand("copy");
  }
  els.copyBtn.textContent = "已复制";
  setTimeout(() => {
    els.copyBtn.textContent = "复制分享文案";
  }, 1400);
});
els.downloadCardBtn.addEventListener("click", downloadShareCard);

els.rantInput.value = "老板周日晚上让我改方案，还说年轻人要多锻炼，我真的快疯了。";
updateRantCounter();
updateClock();
renderLastRun();
setInterval(updateClock, 1000 * 30);

const bootParams = new URLSearchParams(window.location.search);
if (bootParams.get("autostart") === "battle") {
  buildBossConfig();
  renderBoss();
  initGame();
} else if (bootParams.get("autostart") === "boss") {
  buildBossConfig();
  renderBoss();
  showView("boss");
} else if (bootParams.get("autostart") === "result") {
  buildBossConfig();
  renderBoss();
  initGame();
  game.stats.damage = 1247;
  game.stats.breaks = 12;
  game.startedAt = performance.now() - 158000;
  finishRun(true);
}

function downloadShareCard() {
  const card = document.createElement("canvas");
  card.width = 1080;
  card.height = 1440;
  const c = card.getContext("2d");
  const gradient = c.createLinearGradient(0, 0, 1080, 1440);
  gradient.addColorStop(0, "#17191f");
  gradient.addColorStop(0.5, "#090a0d");
  gradient.addColorStop(1, "#230d12");
  c.fillStyle = gradient;
  c.fillRect(0, 0, 1080, 1440);

  const glow = c.createRadialGradient(740, 270, 20, 740, 270, 520);
  glow.addColorStop(0, hexToRgba(currentBoss.color, 0.48));
  glow.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = glow;
  c.fillRect(0, 0, 1080, 1440);

  c.strokeStyle = "rgba(255,200,87,0.55)";
  c.lineWidth = 3;
  c.strokeRect(70, 70, 940, 1300);
  c.fillStyle = "#ffc857";
  c.font = "900 36px sans-serif";
  c.fillText("BREAKVERSE", 104, 132);
  c.fillStyle = "#ffffff";
  c.font = "950 74px sans-serif";
  wrapCanvasText(c, `击败：${currentBoss.name}`, 104, 260, 860, 86);

  c.fillStyle = currentBoss.color;
  roundCanvasRect(c, 330, 380, 420, 420, 44);
  c.fill();
  c.fillStyle = "#ffffff";
  c.beginPath();
  c.arc(540, 470, 78, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#111214";
  c.font = "950 130px sans-serif";
  c.textAlign = "center";
  c.fillText(currentBoss.glyph, 540, 650);
  c.textAlign = "left";

  c.fillStyle = "rgba(255,255,255,0.09)";
  roundCanvasRect(c, 104, 860, 872, 150, 18);
  c.fill();
  c.fillStyle = "#e8eaf0";
  c.font = "900 40px sans-serif";
  c.fillText(els.shareDamage.textContent, 150, 930);
  c.fillText(els.shareTime.textContent, 430, 930);
  c.fillText(els.shareBreaks.textContent, 710, 930);

  c.fillStyle = "#62d28f";
  c.font = "900 44px sans-serif";
  c.fillText(`掉落：${currentBoss.drop.name}`, 104, 1090);
  c.fillStyle = "#e8eaf0";
  c.font = "700 32px sans-serif";
  wrapCanvasText(c, "不是所有崩溃都要忍着，有些可以被打败。", 104, 1160, 850, 44);
  c.fillStyle = "#ffc857";
  c.font = "900 30px monospace";
  c.fillText(els.shareCode.textContent.replace("挑战码：", "#"), 104, 1310);

  const link = document.createElement("a");
  link.download = `${currentBoss.id}-breakverse-card.png`;
  link.href = card.toDataURL("image/png");
  link.click();
}

function roundCanvasRect(c, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + radius, y);
  c.lineTo(x + w - radius, y);
  c.quadraticCurveTo(x + w, y, x + w, y + radius);
  c.lineTo(x + w, y + h - radius);
  c.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  c.lineTo(x + radius, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - radius);
  c.lineTo(x, y + radius);
  c.quadraticCurveTo(x, y, x + radius, y);
  c.closePath();
}

function wrapCanvasText(c, text, x, y, maxWidth, lineHeight) {
  let line = "";
  [...text].forEach((char) => {
    const test = line + char;
    if (c.measureText(test).width > maxWidth && line) {
      c.fillText(line, x, y);
      y += lineHeight;
      line = char;
    } else {
      line = test;
    }
  });
  if (line) c.fillText(line, x, y);
}
