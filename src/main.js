const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const screens = {
  intro: $('#introScreen'),
  dossier: $('#dossierScreen'),
  battle: $('#battleScreen'),
  result: $('#resultScreen'),
  universe: $('#universeScreen'),
  account: $('#accountScreen'),
};

const canvas = $('#battleCanvas');
const ctx = canvas.getContext('2d');
const miniCanvas = $('#miniCanvas');
const miniCtx = miniCanvas.getContext('2d');
const portraitCanvas = $('#portraitCanvas');
const portraitCtx = portraitCanvas.getContext('2d');

const CONTENT = {
  worlds: {
    office: {
      name: '办公室风云', color: '#ff4fd8', accent: '#35f2ff', floor: '#27212c',
      prop: '文件堆', mechanic: '打碎文件堆会制造滑倒区',
      backdrop: ['闪烁屏幕', '咖啡蒸汽', '飞行便签'], enemy: '红点便签'
    },
    social: {
      name: '社交风暴', color: '#b66dff', accent: '#ff5aa5', floor: '#242034',
      prop: '点赞红点', mechanic: '打碎红点可补充怒气',
      backdrop: ['滚动信息流', '点赞粒子', '气泡弹幕'], enemy: '表情包团子'
    },
    family: {
      name: '家庭饭局', color: '#4ee18a', accent: '#ff4fd8', floor: '#1d2b25',
      prop: '旋转汤碗', mechanic: '汤碗会把问题泡弹回去',
      backdrop: ['旋转餐桌', '热气小云', '筷子桥'], enemy: '问题泡泡'
    },
    commute: {
      name: '路途奇遇', color: '#4de0ff', accent: '#ff4fd8', floor: '#17303b',
      prop: '站牌风扇', mechanic: '站牌会吹出顺风位移',
      backdrop: ['公交灯带', '快递柜', '电梯叮声'], enemy: '验证码小柜'
    },
    creative: {
      name: '创意堵车', color: '#ff5aa5', accent: '#4ee18a', floor: '#301b2b',
      prop: '灵感灯泡', mechanic: '点亮灯泡会让怪兽露出弱点',
      backdrop: ['漂浮便利贴', '施工路障', '脑洞井盖'], enemy: '路障便签'
    },
    time: {
      name: '时间乱斗', color: '#8b5cf6', accent: '#b66dff', floor: '#2d2730',
      prop: '贪睡按钮', mechanic: '踩按钮会让全场慢动作一拍',
      backdrop: ['日历山', '闹钟云', '倒计时星星'], enemy: '日程小块'
    },
  },
  chapters: {
    melee: {
      name:'第一关 · 近战器械库', short:'近战器械库', need:'近战武器', color:'#4ee18a',
      intro:'贴脸敲、打断前摇、第三段收尾。这里奖励敢上去讲道理的人。',
      route:[
        {world:'office', label:'键盘热身房', type:'melee', recommend:'近战', mechanic:'近战命中加成，远程伤害降低'},
        {world:'family', label:'拖鞋回旋廊', type:'melee', recommend:'近战', mechanic:'精英怪会贴脸插话'},
        {world:'creative', label:'章鱼路障阵', type:'melee', recommend:'破甲', mechanic:'第三段攻击更容易打出弱点'},
        {world:'social', label:'红点肉搏场', type:'hybrid', recommend:'近战+闪避', mechanic:'连击越高怒气越快'},
        {world:'office', label:'近战总复盘', type:'boss', recommend:'近战武器', mechanic:'首领弱点更靠近身体'}
      ]
    },
    ranged: {
      name:'第二关 · 远程吐槽台', short:'远程吐槽台', need:'远程武器', color:'#35f2ff',
      intro:'别急着冲，先拉开距离，冷笑话、激光笔和小票弩会帮你把场面按住。',
      route:[
        {world:'social', label:'弹幕靶场', type:'ranged', recommend:'远程', mechanic:'远程伤害加成，近战容易空挥'},
        {world:'commute', label:'验证码狙击巷', type:'ranged', recommend:'穿透', mechanic:'小怪会站远处发弹'},
        {world:'office', label:'激光笔走廊', type:'ranged', recommend:'副武器', mechanic:'打掉红点可刷新副武器'},
        {world:'time', label:'闹钟飞盘台', type:'dodge', recommend:'远程+闪避', mechanic:'弹幕密度提高'},
        {world:'social', label:'远程总复盘', type:'boss', recommend:'远程武器', mechanic:'首领弱点会短暂远离身体'}
      ]
    },
    hybrid: {
      name:'第三关 · 远近混合站', short:'远近混合站', need:'远程+近战', color:'#ff5aa5',
      intro:'先远程开罐，再近战收尾。像炒饭，锅气要有，手速也要有。',
      route:[
        {world:'creative', label:'先喷后敲训练', type:'hybrid', recommend:'远近切换', mechanic:'近战和远程交替命中会多给怒气'},
        {world:'office', label:'需求反复横跳', type:'hybrid', recommend:'主副武器', mechanic:'敌人会频繁换站位'},
        {world:'family', label:'问题泡回收站', type:'ranged', recommend:'远程打回', mechanic:'投射物反弹更有价值'},
        {world:'social', label:'表情包贴脸赛', type:'melee', recommend:'近战爆发', mechanic:'近战清场更快'},
        {world:'creative', label:'混合总复盘', type:'boss', recommend:'远程+近战', mechanic:'首领每阶段切换抗性'}
      ]
    },
    dodge: {
      name:'第四关 · 躲避跑酷塔', short:'躲避跑酷塔', need:'闪避/跑酷装备', color:'#b66dff',
      intro:'这关不是谁打得响，是谁脚下不乱。像超级马里奥误入公司群。',
      route:[
        {world:'commute', label:'电梯夹夹桥', type:'dodge', recommend:'闪避', mechanic:'机关密集，完美闪避奖励翻倍'},
        {world:'time', label:'闹钟跳台', type:'dodge', recommend:'二段跳', mechanic:'地面机关会连环弹起'},
        {world:'creative', label:'路障跑酷街', type:'dodge', recommend:'喷射', mechanic:'顺风区和滑倒区交替出现'},
        {world:'family', label:'汤碗弹簧房', type:'hybrid', recommend:'闪避+控场', mechanic:'汤碗会弹回投射物'},
        {world:'commute', label:'跑酷总复盘', type:'boss', recommend:'闪避装备', mechanic:'首领招式更依赖预判'}
      ]
    }
  },
  difficulties: {
    roll: { name:'休闲', hp:.9, dmg:.85, speed:.92, rate:.92, loot:.16, score:1, note:'适合轻松爆破' },
    very: { name:'进阶', hp:1.1, dmg:1, speed:1, rate:1, loot:.22, score:1.25, note:'有点忙，但还能笑' },
    super: { name:'大师', hp:1.34, dmg:1.18, speed:1.12, rate:1.12, loot:.3, score:1.55, note:'手会热，嘴会硬' },
    dead: { name:'宗师', hp:1.65, dmg:1.38, speed:1.24, rate:1.25, loot:.42, score:2.1, note:'给硬核玩家的离谱试休闲' },
  },
  species: {
    knight:{ name:'键帽小骑士', title:'会把确认键当锤子', stats:{attack:5, maxHp:8}, color:'#35f2ff' },
    bubble:{ name:'奶茶能量体', title:'被珍珠保护的圆润战士', stats:{shield:18, maxHp:12, speed:-.03}, color:'#4ee18a' },
    shadow:{ name:'社交隐形人', title:'只要没被看见就很强', stats:{dodgeInvuln:.11, speed:.06, maxHp:-8}, color:'#b66dff' },
    skater:{ name:'电梯滑板客', title:'开门前已经滑走', stats:{speed:.12, doubleJump:1, maxHp:-10}, color:'#4de0ff' },
    guardian:{ name:'锅盖守门员', title:'主打一个礼貌反弹', stats:{projectileResist:.18, maxHp:18, speed:-.05}, color:'#ff5aa5' },
  },
  presets: {
    melee:{ name:'近战开荒', topic:'office', chapter:'melee', species:'knight', difficulty:'roll', rant:'老板让我周末改PPT，还说只是顺手微调一下', equip:{weapon1:'keyboard', weapon2:'slipper', skill1:'milkTea', skill2:'memeBelt'}, unlock:['slipper'] },
    ranged:{ name:'远程冷场', topic:'social', chapter:'ranged', species:'shadow', difficulty:'very', rant:'群里未读消息一直冒红点，还每个人都在问在吗', equip:{weapon1:'loudspeaker', weapon2:'laserPointer', skill1:'clientRadar', skill2:'redPacketDrone'}, unlock:['laserPointer','clientRadar','redPacketDrone'] },
    hybrid:{ name:'远近双修', topic:'creative', chapter:'hybrid', species:'knight', difficulty:'very', rant:'灵感卡住了，需求还在反复横跳，素材像在躲猫猫', equip:{weapon1:'dualPens', weapon2:'receiptCrossbow', skill1:'stickyMine', skill2:'coffeeDash'}, unlock:['dualPens','receiptCrossbow','stickyMine','coffeeDash'] },
    dodge:{ name:'闪避跑酷', topic:'commute', chapter:'dodge', species:'skater', difficulty:'super', rant:'电梯等不来，验证码过期，路上每一步都像小关卡', equip:{weapon1:'slipper', weapon2:'bubbleWand', skill1:'alarmBoots', skill2:'jetpack'}, unlock:['slipper','bubbleWand','alarmBoots','jetpack'] },
  },
  achievements: [
    {id:'firstWin', name:'第一只被说服', desc:'完成任意一局胜利。', reward:'表情包碎片 +2'},
    {id:'combo30', name:'手速像在抢电梯', desc:'单局最高连击达到 30。', reward:'解锁称号：连击嘴替'},
    {id:'perfect3', name:'擦边但很礼貌', desc:'单局完美闪避 3 次。', reward:'门缝通行证'},
    {id:'collector12', name:'杂物间馆长', desc:'收集 12 件装备。', reward:'装备卡闪光边框'},
    {id:'meleeClear', name:'贴脸讲道理', desc:'通关近战器械库。', reward:'盖章锤掉率提升'},
    {id:'rangedClear', name:'远程阴阳师', desc:'通关远程吐槽台。', reward:'激光笔掉率提升'},
    {id:'hybridClear', name:'左右互搏办公版', desc:'通关远近混合站。', reward:'双笔掉率提升'},
    {id:'dodgeClear', name:'脚底抹了咖啡', desc:'通关躲避跑酷塔。', reward:'跑酷装备掉率提升'},
    {id:'deadClear', name:'宗师也要下班', desc:'在宗师难度胜利。', reward:'分享卡专属抬头'},
    {id:'eggHunter', name:'彩蛋不是早餐', desc:'打破一个随机关卡彩蛋。', reward:'彩蛋计数 +1'},
  ],
  equipment: [
    { id:'keyboard', name:'冒烟键盘', short:'键盘', rarity:'common', slot:'weapon', icon:'键', stats:{attack:6, attackSpeed:.08}, source:'初始装备', visual:'keyboard',
      effect:'第三段攻击喷出键帽散弹，连续命中会哒哒补刀。', flavor:'别问，问就是机械轴的正义。' },
    { id:'slipper', name:'伸缩拖鞋', short:'拖鞋', rarity:'rare', slot:'weapon', icon:'拖', stats:{reach:.28, crit:-.03}, source:'家庭饭局掉落', visual:'slipper',
      effect:'完美闪避后下一击变成精准拖鞋制裁，击退并加倍好笑。', flavor:'全家最古老的远程武器。' },
    { id:'loudspeaker', name:'冷笑话扩音器', short:'冷话', rarity:'common', slot:'weapon', icon:'冷', stats:{projectileCd:-.2, attack:2}, source:'社交碎片合成', visual:'speaker',
      effect:'远程命中会短暂冻住对方节奏，浮字会变得很尴尬。', flavor:'伤害不高，气氛很低。' },
    { id:'stampHammer', name:'盖章锤', short:'盖章', rarity:'rare', slot:'weapon', icon:'章', stats:{attack:12, attackSpeed:-.08, reach:.12}, source:'近战器械库掉落', visual:'hammer',
      effect:'第三段攻击会砸出“已阅”冲击波，适合贴脸清场。', flavor:'章盖下去，争议暂时不存在。' },
    { id:'laserPointer', name:'激光笔', short:'激光', rarity:'rare', slot:'weapon', icon:'光', stats:{projectileCd:-.28, crit:.05}, source:'远程吐槽台掉落', visual:'laser',
      effect:'副武器发射高速激光点，打中弱点会多给怒气。', flavor:'指哪儿哪儿开始心虚。' },
    { id:'receiptCrossbow', name:'小票弩', short:'小票', rarity:'legendary', slot:'weapon', icon:'票', stats:{projectileCd:-.12, reach:.12, crit:.04}, source:'远程吐槽台精英掉落', visual:'crossbow',
      effect:'发射会拐弯的小票箭，远处命中伤害更高。', flavor:'每一张小票都写着“这也能报？”' },
    { id:'dualPens', name:'双笔流', short:'双笔', rarity:'epic', slot:'weapon', icon:'双', stats:{attack:4, attackSpeed:.16, comboGrace:.28}, source:'远近混合站掉落', visual:'pens',
      effect:'近战命中后短时间提高副武器伤害，适合远近切换。', flavor:'左手改需求，右手写备注。' },
    { id:'bubbleWand', name:'反问泡泡杖', short:'泡杖', rarity:'epic', slot:'weapon', icon:'泡', stats:{projectileCd:-.05, weakBonus:.18}, source:'跑酷塔彩蛋', visual:'wand',
      effect:'副武器吐出追踪问题泡，命中后让目标短暂迷糊。', flavor:'你说得对，那然后呢？' },
    { id:'milkTea', name:'奶茶护盾杯', short:'奶盾', rarity:'common', slot:'skill', icon:'茶', cooldown:7.5, stats:{shield:26, maxHp:8}, source:'初始装备', visual:'cup',
      effect:'站着喘口气会回一点血，护盾碎裂时喷出珍珠弹。', flavor:'半糖，三分命，去冰加盾。' },
    { id:'overtimeCape', name:'加班披风', short:'冲刺', rarity:'legendary', slot:'skill', icon:'披', cooldown:12, stats:{maxHp:30, speed:-.04}, source:'办公室掉落', visual:'cape',
      effect:'受到最后一击时保留 1 点血，并进入 4 秒下班冲刺。', flavor:'人可以累，但不能白累。' },
    { id:'potLid', name:'反内耗锅盖', short:'锅盖', rarity:'legendary', slot:'skill', icon:'锅', cooldown:6.5, stats:{projectileResist:.25, maxHp:14}, source:'饭局首领掉落', visual:'lid',
      effect:'每隔几秒弹回一次投射物，回礼是笑脸弹。', flavor:'锅可以背，锅盖必须拿稳。' },
    { id:'socialCharm', name:'社恐护符', short:'隐身', rarity:'legendary', slot:'skill', icon:'隐', cooldown:8.5, stats:{dodgeInvuln:.09}, source:'初始装备', visual:'bubble',
      effect:'低血量时有概率让攻击闪开，并弹出“我先下了”。', flavor:'只要我不出现，伤害就追不上我。' },
    { id:'clientRadar', name:'甲方雷达', short:'雷达', rarity:'legendary', slot:'skill', icon:'雷', cooldown:9, stats:{weakBonus:.42}, source:'办公室高分评价', visual:'radar',
      effect:'弱点更亮；打中弱点额外给怒气。', flavor:'提前三秒闻到“再调一点”的味道。' },
    { id:'memeBelt', name:'表情包腰带', short:'表包', rarity:'common', slot:'skill', icon:'包', cooldown:7, stats:{comboGrace:.65}, source:'初始装备', visual:'belt',
      effect:'每 12 连击自动放出表情包冲击波。', flavor:'沉默不是金，是还没找到图。' },
    { id:'jetpack', name:'灵感喷射背包', short:'喷射', rarity:'epic', slot:'skill', icon:'喷', cooldown:5.5, stats:{airDamage:.22, doubleJump:1}, source:'创意碎片合成', visual:'jet',
      effect:'二段跳喷出便利贴弹，落地会稍微滑一下。', flavor:'起飞靠灵感，刹车靠缘分。' },
    { id:'stickyMine', name:'便利贴地雷', short:'地雷', rarity:'epic', slot:'skill', icon:'贴', cooldown:6.8, stats:{attack:3, comboGrace:.2}, source:'远近混合站掉落', visual:'mine',
      effect:'在脚边贴一张爆炸便利贴，怪兽踩到会被弹成会议纪要。', flavor:'这不是陷阱，这是待办。' },
    { id:'alarmBoots', name:'准点弹簧鞋', short:'弹鞋', rarity:'legendary', slot:'skill', icon:'跳', cooldown:5.2, stats:{speed:.08, dodgeInvuln:.05, doubleJump:1}, source:'躲避跑酷塔掉落', visual:'boots',
      effect:'向上弹跳并刷新闪避手感，跑酷关卡额外好用。', flavor:'迟到不可怕，落地要优雅。' },
    { id:'redPacketDrone', name:'红包无人机', short:'红包', rarity:'legendary', slot:'skill', icon:'红', cooldown:8.2, stats:{projectileCd:-.1, weakBonus:.12}, source:'社交风暴彩蛋', visual:'drone',
      effect:'召唤 6 个红包弹自动追踪，重复命中会掉更多碎片。', flavor:'打开不是钱，是一点点战斗热情。' },
    { id:'coffeeDash', name:'咖啡滑步杯', short:'滑步', rarity:'legendary', slot:'skill', icon:'咖', cooldown:6.2, stats:{speed:.1, dodgeInvuln:.04}, source:'办公室风云精英掉落', visual:'coffee',
      effect:'向前滑步并留下一条咖啡轨迹，路过的怪会脚下一紧。', flavor:'提神醒脑，顺便漂移。' },
    { id:'confettiShield', name:'彩带护盾球', short:'彩盾', rarity:'legendary', slot:'skill', icon:'彩', cooldown:9.5, stats:{shield:18, maxHp:10}, source:'宗师难度掉落', visual:'confetti',
      effect:'获得彩带护盾，护盾碎裂时全屏撒花并震退敌人。', flavor:'防御可以很浮夸。' },
  ],
    affixes: [
    { id: 'vampiric', name: '吸血', desc: '攻击附带吸血效果', color: '#ff6b6b' },
    { id: 'berserk', name: '狂暴', desc: '低血量时攻击速度翻倍', color: '#ff4fd8' },
    { id: 'tank', name: '坚壁', desc: '拥有额外护盾', color: '#4de0ff' },
    { id: 'swift', name: '迅捷', desc: '移动速度极大提升', color: '#35f2ff' },
    { id: 'thorns', name: '反伤', desc: '反弹部分受到的近战伤害', color: '#b66dff' },
  ],
  bosses: [
    {
      id:'ppt-v8', world:'office', glyph:'P', color:'#ff4fd8',
      match:['老板','领导','客户','需求','加班','ppt','PPT','方案','会议','改','版本','周末'],
      name:'PPT 改到第八版', title:'最终版_真的最终版 管理员',
      intro:'它每次受击都会认真点头，然后补一句“这里再微调一下”。',
      tags:['文件雨','激光笔','版本复制'], weak:'它切换模板时，背后的插头会发光；打插头，立刻安静三秒。',
      attacks:[['激光笔横扫','一道认真过头的红线扫过地面。','sweep'],['最终版坠落','很多个“最终版”从天而降。','rain'],['再微调冲刺','抱着投影仪横向冲刺。','dash']],
      death:'纸片雨、彩带和一个自动保存提示同时弹出。', drops:['keyboard','clientRadar','overtimeCape','stampHammer','coffeeDash']
    },
    {
      id:'unread-octo', world:'social', glyph:'99', color:'#b66dff',
      match:['微信','消息','未读','群','朋友圈','点赞','回复','在吗','社交','通知','红点'],
      name:'未读消息章鱼', title:'每只触手都拿着一个红点',
      intro:'它最大的本事是用八种语气发“在吗”，但走路会自己绊自己。',
      tags:['红点雨','转发链条','已读蓝勾'], weak:'它发“在吗”后头顶出现蓝勾，打蓝勾会让它进入反省模式。',
      attacks:[['红点雨','一串红点落地爆开。','rain'],['转发链条','旋转气泡链横扫。','bubbles'],['在吗诱导','假装可怜然后小跑撞人。','dash']],
      death:'爆成一地已读回执和点赞小烟花。', drops:['socialCharm','memeBelt','loudspeaker','redPacketDrone','bubbleWand']
    },
    {
      id:'dinner-pot', world:'family', glyph:'锅', color:'#4ee18a',
      match:['家里','亲戚','饭局','相亲','结婚','孩子','成绩','过年','吃饭','父母'],
      name:'饭局连环提问锅', title:'汤底越滚，问题越准时',
      intro:'一口表情严肃的鸳鸯锅，喜欢把所有问题煮成气泡。',
      tags:['筷子夹击','问题泡','汤底喷泉'], weak:'问题泡可以被远程打回去，怪兽会被自己的礼貌噎住。',
      attacks:[['问题泡追踪','慢悠悠的问题泡跟着你。','homing'],['筷子夹击','两根巨筷从两侧合拢。','clamp'],['汤底喷泉','热气小柱从地面冒出。','rain']],
      death:'变成一锅甜豆花，还送你一张免问券。', drops:['slipper','potLid','milkTea','stampHammer']
    },
    {
      id:'elevator-king', world:'commute', glyph:'叮', color:'#4de0ff',
      match:['电梯','地铁','公交','堵车','快递','验证码','迟到','排队','路上','通勤'],
      name:'电梯等不来大王', title:'按钮越按越亮，门越不开',
      intro:'它总能在你赶时间时显示“即将到达”，然后去隔壁楼层兜风。',
      tags:['楼层故障','门夹夹','满员冲撞'], weak:'它发出“叮”之前顶灯会亮，跳起来敲灯能让它开门冷静。',
      attacks:[['楼层数字弹幕','数字方块沿直线飞来。','bubbles'],['门夹夹','左右门板同步合拢。','clamp'],['满员冲撞','整座电梯横向平移。','dash']],
      death:'叮一声开门，里面飘出袜子、彩纸和一个空座位。', drops:['jetpack','potLid','loudspeaker','alarmBoots']
    },
    {
      id:'idea-cone', world:'creative', glyph:'灯', color:'#ff5aa5',
      match:['灵感','创意','方案','写不出','画不出','卡住','素材','剪辑','设计','脑洞'],
      name:'灵感堵车雪糕筒', title:'施工牌写着“稍后再想”',
      intro:'它把所有好点子拦在路口，自己却戴着反光背心跳方块舞。',
      tags:['路障阵','井盖弹起','绕路箭头'], weak:'连续三连段会把路牌打反，怪兽会短暂找不到借口。',
      attacks:[['路障掉落','三角路障从上面蹦下来。','rain'],['脑洞井盖','地面井盖突然弹起。','floor'],['绕路箭头','箭头风把你推到奇怪位置。','gust']],
      death:'喷出彩色灯泡和“就这？”便利贴。', drops:['jetpack','clientRadar','memeBelt','dualPens','stickyMine']
    },
    {
      id:'alarm-rooster', world:'time', glyph:'闹', color:'#8b5cf6',
      match:['周一','闹钟','早起','日程','迟到','ddl','DDL','截止','时间','拖延'],
      name:'周一闹钟公鸡', title:'叫声是键盘提示音',
      intro:'穿西装的闹钟鸡，喜欢把“再睡五分钟”翻译成十个日程块。',
      tags:['音波圈','贪睡飞盘','日程砸地'], weak:'完美闪避音波后，它会打嗝露出电池仓。',
      attacks:[['起床音波','圆形音波横向扩散。','sweep'],['贪睡飞盘','按钮飞盘来回弹。','bubbles'],['日程砸地','日程块排队落下。','rain']],
      death:'变成周末抱枕，顺便帮你关掉三个提醒。', drops:['overtimeCape','socialCharm','jetpack','alarmBoots','confettiShield']
    },
    {
      id:'locker-riddle', world:'commute', glyph:'码', color:'#2ec4b6',
      match:['快递','取件','柜','验证码','门禁','扫码','排队','超时','短信'],
      name:'快递柜谜语人', title:'验证码永远差一位',
      intro:'它每个格口都很热情，除了你真正需要打开的那个。',
      tags:['柜门弹幕','验证码墙','超时收费'], weak:'打亮三个同色柜门会触发开锁眩晕。',
      attacks:[['柜门弹幕','彩色柜门轮流弹出。','bubbles'],['验证码墙','数字墙向前滚动。','sweep'],['超时提醒','收费小牌从天而降。','rain']],
      death:'柜门全开，掉出袜子、贴纸和一张“辛苦了”。', drops:['loudspeaker','potLid','clientRadar','receiptCrossbow']
    },
    {
      id:'meeting-mic', world:'office', glyph:'麦', color:'#ff6b6b',
      match:['会议','麦克风','听得到','回音','静音','线上','摄像头','共享屏幕'],
      name:'会议麦克风回音侠', title:'听得到吗听得到吗听得到吗',
      intro:'它说一句话会回响七遍，但每次都忘记自己没开降噪。',
      tags:['回音波','静音陷阱','头像冲撞'], weak:'远程攻击打掉降噪耳机后，近战伤害翻倍。',
      attacks:[['回音波','矩形音浪横扫。','sweep'],['头像冲撞','会议头像排队冲过来。','dash'],['静音按钮雨','静音图标从上面掉下。','rain']],
      death:'静音图标碎成彩带，大家终于听见掌声。', drops:['keyboard','loudspeaker','socialCharm','laserPointer']
    },
  ],
  loaderLines:['把小事搓成圆滚滚怪兽','给它贴上今日最烦标签','校准拖鞋弹道','检查彩带库存','海报可以出摊了'],
  quips:['它很努力，但方向完全不对。','你这套连招像开会时突然会魔法。','怪兽刚才那下主要输在表情管理。','友情提示：红点不是命运，是经验包。','像素世界一致认为你今天很有礼貌。'],
};

const EQUIP = Object.fromEntries(CONTENT.equipment.map(e => [e.id, e]));
const SAVE_KEY = 'breakverse-fun-save-v2';
const slotMeta = [
  ['weapon1','主武器','主'],
  ['weapon2','副武器','副'],
  ['skill1','技能一','技'],
  ['skill2','技能二','技'],
];

let save = loadSave();
let currentScreen = 'intro';
let currentTopic = 'office';
let selectedSlot = 'weapon1';
let current大首领 = null;
let currentDrop = null;
let audioCtx = null;
let game = null;
let animId = 0;
let lastFrame = 0;
let miniTime = 0;
let portraitTime = 0;
let keys = new Set();
let pressed = new Set();
let touch = new Set();
let particlePool = [];
let accountState = { ready:false, available:true, user:null, authMode:'login', accounts:[], saveTimer:0 };

function updateViewportHeight() {
  const h = window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight;
  if (h) document.documentElement.style.setProperty('--app-height', `${h}px`);
}

function defaultSave() {
  return {
    unlocked:['keyboard','loudspeaker','milkTea','memeBelt'],
    equipped:{ weapon1:'keyboard', weapon2:'loudspeaker', skill1:'milkTea', skill2:'memeBelt' },
    fragments:{ unread:0, joke:0, sticker:0, idea:0, ticket:0 },
    stats:{ battles:0, wins:0, bosses:0, damage:0, bestCombo:0, perfect:0, supers:0, eggs:0, shares:0 },
    codex:{}, achievements:[], chapterWins:{}, history:[], updatedAt:0,
  };
}
function normalizeSave(raw) {
  const base = defaultSave();
  const data = raw && typeof raw === 'object' ? raw : {};
  const validGear = new Set(CONTENT.equipment.map(e => e.id));
  const valid大首领es = new Set(CONTENT.bosses.map(b => b.id));
  const validChapters = new Set(Object.keys(CONTENT.chapters));
  const validAchievements = new Set(CONTENT.achievements.map(a => a.id));
  const text = (value, max=80) => String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, '').slice(0, max);
  const int = (value, max=9999999) => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(0, Math.min(max, Math.floor(n))) : 0;
  };
  const idList = (list, allowed, max=120) => Array.isArray(list)
    ? [...new Set(list.filter(id => typeof id === 'string' && (!allowed || allowed.has(id))))].slice(0, max)
    : [];
  const old = data.equipped && typeof data.equipped === 'object' ? data.equipped : {};
  const pickGear = (...ids) => ids.find(id => typeof id === 'string' && validGear.has(id));
  const equipped = {
    weapon1: pickGear(old.weapon1, old.weapon, base.equipped.weapon1) || base.equipped.weapon1,
    weapon2: pickGear(old.weapon2, base.equipped.weapon2) || base.equipped.weapon2,
    skill1: pickGear(old.skill1, old.armor, old.charm1, base.equipped.skill1) || base.equipped.skill1,
    skill2: pickGear(old.skill2, old.charm2, base.equipped.skill2) || base.equipped.skill2,
  };
  const stats = Object.fromEntries(Object.keys(base.stats).map(key => [key, int(data.stats?.[key])]));
  const fragments = Object.fromEntries(Object.keys(base.fragments).map(key => [key, int(data.fragments?.[key], 9999)]));
  const codex = {};
  if (data.codex && typeof data.codex === 'object') {
    Object.entries(data.codex).forEach(([id, item]) => {
      if (!valid大首领es.has(id) || !item || typeof item !== 'object') return;
      codex[id] = { name:text(item.name), world:text(item.world, 40), wins:int(item.wins, 9999), at:int(item.at, 9999999999999) };
    });
  }
  const chapterWins = {};
  if (data.chapterWins && typeof data.chapterWins === 'object') {
    Object.entries(data.chapterWins).forEach(([id, wins]) => { if (validChapters.has(id)) chapterWins[id] = int(wins, 9999); });
  }
  const history = Array.isArray(data.history) ? data.history.filter(item => item && typeof item === 'object').slice(0, 10).map(item => ({
    boss:text(item.boss), won:!!item.won, drop:text(item.drop, 64), damage:int(item.damage), combo:int(item.combo),
    time:int(item.time, 3600), chapter:validChapters.has(item.chapter) ? item.chapter : '', difficulty:text(item.difficulty, 24),
    rewards:Array.isArray(item.rewards) ? item.rewards.slice(0, 8).map(r => ({ text:text(r?.text || r, 80) })) : [],
    achievements:idList(item.achievements, validAchievements, 20), at:int(item.at, 9999999999999),
  })) : [];
  return {
    ...base,
    unlocked:[...new Set([...(base.unlocked || []), ...idList(data.unlocked, validGear)])],
    equipped,
    stats:{...base.stats, ...stats},
    fragments:{...base.fragments, ...fragments},
    codex,
    achievements:idList(data.achievements, validAchievements),
    chapterWins,
    history,
    updatedAt: int(data.updatedAt, 9999999999999),
  };
}
function loadSave() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY));
    return normalizeSave(raw);
  } catch(e) { return defaultSave(); }
}
function saveNow(options={}) {
  try {
    save.updatedAt = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    if (options.sync !== false) scheduleCloudSave();
  } catch(e) {}
}

function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
function rand(min,max){ return min + Math.random() * (max-min); }
function seeded(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = s * 16807 % 2147483647) / 2147483647; }
function hashText(text){ return [...text].reduce((s,c)=>((s*31 + c.charCodeAt(0)) >>> 0), 2166136261); }
function rects(a,b){ return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }
function circleRect(c,r){ const x=clamp(c.x,r.x,r.x+r.w), y=clamp(c.y,r.y,r.y+r.h); return Math.hypot(c.x-x,c.y-y) <= c.r; }
function rgba(hex,a){ const h=hex.replace('#',''); return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`; }
function fmtTime(sec){ return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`; }

function selectedChapterId() { return $('#chapterSelect')?.value || 'melee'; }
function selectedDifficultyId() { return $('#difficultySelect')?.value || 'roll'; }
function selectedSpeciesId() { return $('#speciesSelect')?.value || 'knight'; }
function chapterInfo(id=current大首领?.chapter || selectedChapterId()) { return CONTENT.chapters[id] || CONTENT.chapters.melee; }
function difficultyInfo(id=current大首领?.difficulty || selectedDifficultyId()) { return CONTENT.difficulties[id] || CONTENT.difficulties.roll; }
function speciesInfo(id=current大首领?.species || selectedSpeciesId()) { return CONTENT.species[id] || CONTENT.species.knight; }

function buildRoute(home, rng=Math.random, chapterId=selectedChapterId()) {
  const chapter = chapterInfo(chapterId);
  const route = chapter.route.map((node, i) => ({
    ...node,
    chapter: chapterId,
    boss: i === chapter.route.length - 1,
    egg: false,
  }));
  const eggIndex = 1 + Math.floor(rng() * Math.max(1, route.length - 2));
  if (rng() < .52 && route[eggIndex]) route[eggIndex].egg = true;
  route[route.length-1].world = home;
  return route;
}

function chapterDropPool(chapterId, baseDrops=[]) {
  const pools = {
    melee:['keyboard','slipper','stampHammer','coffeeDash','memeBelt'],
    ranged:['loudspeaker','laserPointer','receiptCrossbow','clientRadar','redPacketDrone'],
    hybrid:['dualPens','receiptCrossbow','stickyMine','bubbleWand','coffeeDash'],
    dodge:['alarmBoots','jetpack','socialCharm','confettiShield','bubbleWand'],
  };
  return [...new Set([...(baseDrops || []), ...(pools[chapterId] || [])])];
}

function stageDropPool(type, chapterId, baseDrops=[]) {
  const pools = {
    melee:['keyboard','slipper','stampHammer','milkTea','memeBelt','coffeeDash'],
    ranged:['loudspeaker','laserPointer','receiptCrossbow','clientRadar','redPacketDrone'],
    hybrid:['dualPens','receiptCrossbow','stickyMine','bubbleWand','coffeeDash','memeBelt'],
    dodge:['alarmBoots','jetpack','socialCharm','potLid','confettiShield','bubbleWand'],
    boss: chapterDropPool(chapterId, baseDrops),
  };
  return [...new Set([...(pools[type] || []), ...chapterDropPool(chapterId, baseDrops)])].filter(id => EQUIP[id]);
}

function stageDamageMultiplier(kind) {
  if (!game?.stageNode) return 1;
  const type = game.stageNode.type;
  if (type === 'melee') return kind === 'melee' ? 1.35 : .76;
  if (type === 'ranged') return kind === 'ranged' ? 1.35 : .78;
  if (type === 'hybrid') return kind === 'melee' || kind === 'ranged' ? 1.12 + Math.min(.22, game.player.combo * .006) : 1;
  if (type === 'dodge') return kind === 'perfect' ? 1.55 : 1;
  return 1;
}

function unlockAchievement(id) {
  if (!id || save.achievements.includes(id)) return false;
  save.achievements.push(id);
  const a = CONTENT.achievements.find(x => x.id === id);
  if (a && game?.state === 'playing') addFloat(game.player.x+game.player.w/2, game.player.y-28, `成就：${a.name}`, '#b66dff', 1.05);
  return true;
}

function safeRewrite(text) {
  let t = (text || '').trim() || '老板让我周末改PPT，还说只是顺手微调一下';
  t = t.replace(/1[3-9]\d{9}/g, '某串神秘号码')
       .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '某个邮箱')
       .replace(/\d{6,}/g, '一串神秘数字')
       .replace(/([一-龥]{2,4})(总|经理|老师|主管|老板)/g, 'X$2');
  [
    [new RegExp('\\u5d29\\u6e83','g'), '脑袋冒烟'],
    [new RegExp('\\u7126\\u8651','g'), '心里转圈'],
    [new RegExp('\\u70bc\\u72f1|\\u5730\\u72f1','g'), '离谱现场'],
    [new RegExp('\\u9ed1\\u6697','g'), '灯没开'],
    [new RegExp('\\u541e\\u566c\\u7075\\u9b42|\\u541e\\u566c','g'), '偷吃零食'],
    [/疯了/g, '表情包加载到 99%'],
  ].forEach(([re, to]) => t = t.replace(re, to));
  return t.slice(0, 180);
}

function screenTo(name) {
  if (!screens[name]) return;
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  currentScreen = name;
  document.body.classList.toggle('battle-mode', name === 'battle');
  if (name === 'battle') updateViewportHeight();
  else touch.clear();
  if (name === 'universe') renderUniverse();
  if (name === 'account') renderAccount();
  if (name === 'dossier') drawPortrait();
}

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx?.state === 'suspended') audioCtx.resume();
}
function tone(freq, dur, type='sine', gain=.12, slide=.6) {
  if (!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, audioCtx.currentTime);
  o.frequency.exponentialRampToValueAtTime(Math.max(30, freq*slide), audioCtx.currentTime + dur);
  g.gain.setValueAtTime(gain, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + dur);
  o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + dur);
}
const SFX = {
  clack(){ tone(460,.055,'square',.08,.85); setTimeout(()=>tone(720,.04,'square',.05,.7),30); },
  hit(){ tone(150,.08,'square',.14,.42); },
  crit(){ tone(560,.13,'sawtooth',.16,.5); },
  boing(){ tone(320,.16,'sine',.12,1.8); },
  splat(){ tone(95,.18,'triangle',.16,.35); },
  dodge(){ tone(720,.09,'sine',.1,1.4); },
  super(){ tone(180,.22,'sawtooth',.16,2.6); setTimeout(()=>tone(660,.18,'square',.12,.55),60); },
  loot(){ tone(520,.12,'triangle',.12,1.5); setTimeout(()=>tone(780,.15,'triangle',.1,1.2),90); },
};

function loadoutIds() { return [save.equipped.weapon1, save.equipped.weapon2, save.equipped.skill1, save.equipped.skill2].filter(Boolean); }
function hasEquip(id) { return loadoutIds().includes(id); }
function getLoadout() { return loadoutIds().map(id => EQUIP[id]).filter(Boolean); }
function derivedStats() {
  const s = { maxHp:140, shield:0, attack:28, speed:250, attackCd:.31, reach:1, crit:.1, dodgeInvuln:.34, projectileCd:1.6, projectileResist:0, weakBonus:1.55, comboGrace:1.25, airDamage:0, doubleJump:0 };
  const sp = speciesInfo().stats || {};
  if (sp.maxHp) s.maxHp += sp.maxHp;
  if (sp.shield) s.shield += sp.shield;
  if (sp.attack) s.attack += sp.attack;
  if (sp.speed) s.speed *= 1 + sp.speed;
  if (sp.dodgeInvuln) s.dodgeInvuln += sp.dodgeInvuln;
  if (sp.projectileResist) s.projectileResist += sp.projectileResist;
  if (sp.doubleJump) s.doubleJump += sp.doubleJump;
  getLoadout().forEach(e => {
    const st = e.stats || {};
    if (st.maxHp) s.maxHp += st.maxHp;
    if (st.shield) s.shield += st.shield;
    if (st.attack) s.attack += st.attack;
    if (st.speed) s.speed *= 1 + st.speed;
    if (st.attackSpeed) s.attackCd *= 1 - st.attackSpeed;
    if (st.reach) s.reach += st.reach;
    if (st.crit) s.crit += st.crit;
    if (st.dodgeInvuln) s.dodgeInvuln += st.dodgeInvuln;
    if (st.projectileCd) s.projectileCd += st.projectileCd;
    if (st.projectileResist) s.projectileResist += st.projectileResist;
    if (st.weakBonus) s.weakBonus += st.weakBonus;
    if (st.comboGrace) s.comboGrace += st.comboGrace;
    if (st.airDamage) s.airDamage += st.airDamage;
    if (st.doubleJump) s.doubleJump += st.doubleJump;
  });
  s.projectileCd = Math.max(.65, s.projectileCd);
  return s;
}

function make大首领() {
  const mode = $('#modeSelect').value;
  const chapterId = selectedChapterId();
  const difficultyId = selectedDifficultyId();
  const speciesId = selectedSpeciesId();
  const raw = $('#rantInput').value;
  const safe = safeRewrite(raw);
  const seedBase = mode === 'daily' ? `${new Date().toISOString().slice(0,10)}:${currentTopic}:${chapterId}:${difficultyId}` : `${safe}:${chapterId}:${difficultyId}:${Date.now()}`;
  const seed = hashText(mode === 'random' ? `${seedBase}:${Math.random()}` : seedBase);
  const rng = seeded(seed);
  const low = safe.toLowerCase();
  let ranked = CONTENT.bosses.map((b,i) => ({
    boss:b, index:i,
    score: (b.world === currentTopic ? 4 : 0) + b.match.reduce((n,w) => n + (low.includes(String(w).toLowerCase()) ? Math.min(6, String(w).length) : 0), 0)
  })).sort((a,b)=> b.score - a.score || a.index - b.index);
  let base = ranked[0].score > 0 && mode !== 'random' ? ranked[0].boss : CONTENT.bosses[Math.floor(rng()*CONTENT.bosses.length)];
  const variants = ['圆滚滚版','嘴硬版','加戏版','彩带版','超会找借口版'];
  const posterNo = String(seed % 10000).padStart(4,'0');
  const dropPool = chapterDropPool(chapterId, base.drops);
    const drop = dropPool[Math.floor(rng()*dropPool.length)] || base.drops[0];
  
  // Commercialization: Elite Affixes
  let activeAffix = null;
  if (difficultyId === 'super' || difficultyId === 'dead') {
    const affixList = CONTENT.affixes;
    activeAffix = affixList[Math.floor(rng() * affixList.length)];
  }
  
  current大首领 = {
    ...base,
    safe,
    seed,
    posterNo,
    mode,
    chapter: chapterId,
    difficulty: difficultyId,
    species: speciesId,
    displayName: `${base.name} · ${variants[Math.floor(rng()*variants.length)]}`,
    hpScale: (mode === 'practice' ? .72 : mode === 'daily' ? 1.08 : 1) * difficultyInfo(difficultyId).hp,
        drop,
    affix: activeAffix,
    route: buildRoute(base.world, rng, chapterId),
    patterns: [...base.attacks.map(a => a[2]), 'summon', base.world === 'social' ? 'bubbles' : 'floor'],
  };
  currentDrop = EQUIP[drop];
  renderDossier();
  showLoader(() => screenTo('dossier'));
}

function showLoader(done) {
  const loader = $('#loader');
  loader.classList.remove('hidden');
  let i = 0;
  const timer = setInterval(() => {
    $('#loaderText').textContent = CONTENT.loaderLines[i % CONTENT.loaderLines.length];
    SFX.clack();
    i++;
    if (i > 4) {
      clearInterval(timer);
      setTimeout(() => { loader.classList.add('hidden'); done(); }, 180);
    }
  }, 210);
}

function renderDossier() {
  const w = CONTENT.worlds[current大首领.world];
  const chapter = chapterInfo(current大首领.chapter);
  const diff = difficultyInfo(current大首领.difficulty);
  const species = speciesInfo(current大首领.species);
  document.documentElement.style.setProperty('--boss', current大首领.color);
  $('#caseId').textContent = `海报 #${current大首领.posterNo}`;
  $('#worldName').textContent = `${chapter.name} · ${diff.name} · ${species.name}`;
  $('#bossName').textContent = current大首领.displayName;
  $('#bossIntro').textContent = `已把“${current大首领.safe}”登记成：${current大首领.intro} 本关推荐：${chapter.need}。`;
  $('#bossTags').innerHTML = [...current大首领.tags, w.name, diff.note].map(t => `<span class="pill">${t}</span>`).join('');
  if (current大首领.affix) {
    $('#bossTags').innerHTML += `<span class="pill" style="color:#000;background:${current大首领.affix.color};border:none;">精英词缀：${current大首领.affix.name} (${current大首领.affix.desc})</span>`;
  }
  $('#skillList').innerHTML = current大首领.attacks.map(a => `<li><span class="pattern-badge">${patternIcon(a[2])}</span><span><strong>${a[0]}</strong><br>${a[1]}</span></li>`).join('');
  $('#weakHint').textContent = current大首领.weak;
  $('#dropPreview').textContent = `${currentDrop.name}：${currentDrop.effect} 通关还会结算大关卡收集。`;
  $('#bossHudName').textContent = current大首领.displayName;
  renderRoute();
  renderLoadout();
  portraitTime = 0;
}

function renderRoute() {
  const route = current大首领.route || buildRoute(current大首领.world);
  $('#routeStrip').innerHTML = `<div class="route-title"><b>大关卡路线</b><span>${route.length} 个小关</span></div>` + route.map((r, i) => {
    const w = CONTENT.worlds[r.world];
    return `<article class="route-card">
      <span class="route-glyph" style="background:${w.accent};">${r.boss ? '烦' : i+1}</span>
      <span><strong>${r.label}${r.egg ? ' · 彩蛋?' : ''}</strong><small>${w.name} · ${r.mechanic}</small><em>${r.recommend}</em></span>
    </article>`;
  }).join('');
}

function patternIcon(type) {
  return ({ sweep:'↔', rain:'▾', dash:'➜', bubbles:'○', homing:'◎', clamp:'><', floor:'▴', gust:'~', summon:'+' })[type] || '!';
}

function gearArtHtml(eq, tiny=false) {
  if (!eq) return `<span class="gear-art ${tiny ? 'tiny' : ''}"></span>`;
  return `<span class="gear-art gear-${eq.visual} ${tiny ? 'tiny' : ''}" aria-hidden="true"></span>`;
}

function statGlyphs(eq) {
  const map = {
    attack:'攻', attackSpeed:'速', reach:'距', crit:'暴',
    projectileCd:'冷', shield:'盾', maxHp:'命', speed:'移',
    projectileResist:'抗', dodgeInvuln:'闪', weakBonus:'弱',
    comboGrace:'连', airDamage:'空', doubleJump:'跳'
  };
  return Object.keys(eq.stats || {}).map(k => `<span class="stat-glyph">${map[k] || '技'}</span>`).join('');
}

function effectShort(eq, unlocked) {
  if (!unlocked) return `未解锁 · ${eq.source}`;
  return eq.effect.replace(/，/g, ' · ').replace(/。/g, '').slice(0, 34);
}

function recommendedIds(chapterId=current大首领?.chapter || selectedChapterId()) {
  return chapterDropPool(chapterId, []).filter(id => EQUIP[id]);
}

function renderLoadout() {
  $('#slotList').innerHTML = slotMeta.map(([id,label,icon]) => {
    const eqId = save.equipped[id];
    const eq = EQUIP[eqId];
    return `<button class="slot-btn ${selectedSlot===id?'active':''}" data-slot="${id}">
      <span class="slot-icon">${eq ? gearArtHtml(eq, true) : icon}</span>
      <span><span class="slot-title">${label}</span><span class="slot-item">${eq?.name || '空槽'}</span></span>
    </button>`;
  }).join('');
  $$('#slotList [data-slot]').forEach(btn => btn.addEventListener('click', () => { selectedSlot = btn.dataset.slot; renderLoadout(); }));

  const slotType = selectedSlot.startsWith('weapon') ? 'weapon' : 'skill';
  const rec = recommendedIds();
  const chapter = chapterInfo();
  $('#gearHelp').textContent = `${chapter.short} 推荐：${rec.map(id => EQUIP[id]?.short || EQUIP[id]?.name).filter(Boolean).slice(0, 4).join('、')}`;
  $('#gearGrid').innerHTML = CONTENT.equipment
    .filter(e => e.slot === slotType)
    .sort((a,b) => Number(rec.includes(b.id)) - Number(rec.includes(a.id)) || Number(save.unlocked.includes(b.id)) - Number(save.unlocked.includes(a.id)) || a.name.localeCompare(b.name, 'zh-CN'))
    .map(e => {
    const unlocked = save.unlocked.includes(e.id);
    const equipped = loadoutIds().includes(e.id);
    const trial = equipped && !unlocked;
    const hot = rec.includes(e.id);
    return `<button class="gear-card rarity-${e.rarity || 'common'} ${unlocked || trial?'':'locked'} ${equipped?'equipped':''} ${hot?'recommended':''}" data-gear="${e.id}">
      ${gearArtHtml(e)}
      <span class="gear-copy">
        <strong>${e.name}${hot ? '<span class="gear-note">本关</span>' : ''}</strong>
        <span class="stat-icons">${statGlyphs(e)}</span>
        <small>${trial ? `预设试用 · ${effectShort(e, true)}` : effectShort(e, unlocked)}</small>
      </span>
    </button>`;
  }).join('');
  $$('#gearGrid [data-gear]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.gear;
    const eq = EQUIP[id];
    if (!save.unlocked.includes(id) && !loadoutIds().includes(id)) return;
    const siblings = selectedSlot.startsWith('weapon') ? ['weapon1','weapon2'] : ['skill1','skill2'];
    siblings.forEach(other => { if (other !== selectedSlot && save.equipped[other] === id) save.equipped[other] = null; });
    save.equipped[selectedSlot] = id;
    saveNow();
    renderLoadout();
  }));
}

function initBattle() {
  ensureAudio();
  cancelAnimationFrame(animId);
  const stats = derivedStats();
  const maxHp = Math.round(stats.maxHp);
  const bossMax = Math.round((480 + (current大首领.seed % 120)) * current大首领.hpScale * (current大首领.affix?.id === 'tank' ? 1.5 : 1));
  const bossSpeedScale = current大首领.affix?.id === 'swift' ? 1.5 : 1;
  const modeName = $('#modeSelect').selectedOptions[0].textContent;
  const chapter = chapterInfo(current大首领.chapter);
  const diff = difficultyInfo(current大首领.difficulty);
  const species = speciesInfo(current大首领.species);
  game = {
    mode: current大首领.mode,
    chapter: current大首领.chapter,
    difficulty: diff,
    species,
    startedAt: performance.now(),
    state:'playing',
    stats:{ damage:0, taken:0, maxCombo:0, perfect:0, supers:0, hits:0 },
    shake:{x:0,y:0,life:0,amp:0}, flash:0, hitStop:0, slowMo:0, camera:1, bigTimer:0, bigTitle:'开打', bigSub:'把它教育得明明白白',
    particles:[], floats:[], slashes:[], telegraphs:[], projectiles:[], hazards:[], pending:[], enemies:[], props:[], zones:[], confetti:[],
    wave:0, waveTimer:0, bossActive:false, endlessClears:0, stageWorld:current大首领.world, stageNode:null, stageCleared:false, stageClearTimer:0, stageRewards:[], eggsFound:0,
    gear:getLoadout(), derived:stats,
    player:{ x:135,y:368,w:38,h:62,vx:0,vy:0,facing:1,grounded:false,jumps:0,maxJumps:1+stats.doubleJump,
      hp:maxHp,maxHp,shield:stats.shield,maxShield:stats.shield,rage:0,combo:0,comboTtl:0,attackCd:0,projectileCd:0,dodgeCd:0,activeCd:{skill1:0,skill2:0},invuln:0,dodgeTime:0,dodgePerfect:0,
      attackTime:0,comboStep:0,comboTimer:0,hurtFlash:0,idle:0,deathSave:false,overclock:0,perfectCharge:0,reflectCd:0,memeAt:0,slide:0 },
    boss:{ x:700,y:300,w:110,h:126,hp:bossMax,maxHp:bossMax,phase:0,lastPhase:0,attackTimer:1.2,patternIndex:0,hurt:0,weakTimer:1.2,slow:0,stun:0,face:'ಠ_ಠ' },
  };
  $('#modeHud').textContent = `${chapter.short} · ${diff.name} · ${modeName}`;
  $('#playerName').textContent = `你 · ${species.name}`;
  startWave(0);
  screenTo('battle');
  showBig('开打', current大首领.displayName);
  updateHud();
  lastFrame = performance.now();
  animId = requestAnimationFrame(loop);
}

function setupWorldProps() {
  const world = game.stageWorld || current大首领.world;
  const propNames = { office:'文件堆', social:'点赞红点', family:'旋转汤碗', commute:'站牌风扇', creative:'灵感灯泡', time:'贪睡按钮' };
  game.props = [
    { type:world, label:propNames[world], x:385, y:386, w:62, h:42, hp:2, live:true, pulse:0 },
    { type:world, label:propNames[world], x:575, y:386, w:62, h:42, hp:2, live:true, pulse:1.2 },
  ];
  if (game.stageNode?.egg) {
    game.props.push({ type:'egg', label:'离谱彩蛋', x:760, y:360, w:46, h:46, hp:1, live:true, pulse:2.1, egg:true });
  }
}

function startWave(i) {
  const route = current大首领.route || buildRoute(current大首领.world);
  const last = route.length - 1;
  const stop = route[Math.min(i, last)];
  game.wave = i; game.waveTimer = 0; game.stageCleared = false; game.stageClearTimer = 0;
  game.enemies = []; game.bossActive = false; game.stageWorld = stop.world; game.stageNode = stop;
  setupWorldProps();
  game.runProgressKey = '';
  renderRunProgress();
  const w = CONTENT.worlds[stop.world];
  if (i < last) {
    showBig(`第 ${i+1} 站`, `${w.name} · ${stop.label}`);
    const smallCount = stop.type === 'dodge' ? 2 + i : 3 + Math.min(i, 2);
    for (let n=0;n<smallCount;n++) spawnEnemy(stop.type === 'ranged' ? 'turret' : 'small', 500+n*74+rand(-20,20));
    if (i >= 1) spawnEnemy(stop.type === 'dodge' ? 'jumper' : 'elite', 690 + rand(-50,40));
    if (i >= 3) spawnEnemy(stop.type === 'ranged' ? 'turret' : 'elite', 560);
    setupStageMechanics(stop, i);
  } else {
    game.bossActive = true;
    showBig('今日最烦', current大首领.displayName);
  }
}

function setupStageMechanics(stop, i) {
  const color = CONTENT.worlds[stop.world]?.accent || current大首领.color;
  if (stop.type === 'dodge') {
    for (let n=0;n<3+i;n++) {
      game.pending.push({ t:.55+n*.45, fn:() => {
        const x = 170 + ((n*180 + current大首领.seed) % 620);
        addTelegraph(x-28, 410, 56, 22, .28, color);
        game.hazards.push({type:'pop', x:x-28, y:390, w:56, h:40, damage:10+i*2, ttl:.55, color, perfect:false});
      }});
    }
    game.zones.push({type:'bounce', x:260, y:408, w:90, h:20, ttl:12, color:'#4de0ff'});
    game.zones.push({type:'bounce', x:640, y:408, w:90, h:20, ttl:12, color:'#4de0ff'});
  }
  if (stop.type === 'ranged') {
    game.zones.push({type:'focus', x:90, y:408, w:130, h:20, ttl:12, color:'#35f2ff'});
  }
  if (stop.type === 'hybrid') {
    game.zones.push({type:'tempo', x:420, y:408, w:130, h:20, ttl:12, color:'#ff5aa5'});
  }
}

function spawnEnemy(type, x) {
  const elite = type === 'elite';
  const turret = type === 'turret';
  const jumper = type === 'jumper';
  const world = game.stageWorld || current大首领.world;
  const hpMul = game?.difficulty?.hp || 1;
  game.enemies.push({
    type, world, x, y: elite?344:turret?356:jumper?350:372, w: elite?52:turret?42:jumper?42:36, h: elite?58:turret?50:jumper?48:38,
    hp: Math.round((elite?105:turret?62:jumper?72:42)*hpMul), maxHp: Math.round((elite?105:turret?62:jumper?72:42)*hpMul), atk: elite?13:turret?10:jumper?11:7, cd: rand(.5,1.5), hurt:0,
    color: elite ? CONTENT.worlds[world].color : CONTENT.worlds[world].accent,
  });
}

function loop(now) {
  const raw = Math.min(.033, (now-lastFrame)/1000 || .016);
  lastFrame = now;
  game.hitStop = Math.max(0, game.hitStop - raw);
  game.slowMo = Math.max(0, game.slowMo - raw);
  const dt = raw * (game.hitStop > 0 ? .04 : game.slowMo > 0 ? .46 : 1);
  update(dt, raw);
  draw();
  if (game?.state === 'playing') animId = requestAnimationFrame(loop);
}

function consume(name) {
  if (!pressed.has(name)) return false;
  pressed.delete(name);
  return true;
}

function update(dt, raw) {
  const p = game.player;
  const left = keys.has('a') || keys.has('arrowleft') || touch.has('left');
  const right = keys.has('d') || keys.has('arrowright') || touch.has('right');
  const move = (right?1:0) - (left?1:0);
  p.attackCd = Math.max(0, p.attackCd-dt);
  p.projectileCd = Math.max(0, p.projectileCd-dt);
  p.dodgeCd = Math.max(0, p.dodgeCd-dt);
  p.activeCd.skill1 = Math.max(0, p.activeCd.skill1-dt);
  p.activeCd.skill2 = Math.max(0, p.activeCd.skill2-dt);
  p.invuln = Math.max(0, p.invuln-dt);
  p.dodgePerfect = Math.max(0, p.dodgePerfect-dt);
  p.attackTime = Math.max(0, p.attackTime-dt);
  p.comboTimer = Math.max(0, p.comboTimer-dt);
  p.hurtFlash = Math.max(0, p.hurtFlash-dt*4);
  p.overclock = Math.max(0, p.overclock-dt);
  p.reflectCd = Math.max(0, p.reflectCd-dt);
  game.flash = Math.max(0, game.flash-dt*2.8);
  game.bigTimer = Math.max(0, game.bigTimer-raw);
  updateBigText();
  updateShake(raw);

  if (consume('jump')) jumpPlayer();
  if (consume('dodge')) tryDodge();
  if (consume('attack')) tryMelee();
  if (consume('skill')) trySkill();
  if (consume('skill1')) castActiveSkill('skill1');
  if (consume('skill2')) castActiveSkill('skill2');

  if (p.dodgeTime > 0) {
    p.dodgeTime -= dt;
  } else {
    p.vx = move * game.derived.speed;
    if (move) p.facing = move;
  }
  if (p.slide > 0 && p.grounded) { p.vx += p.facing * 130 * p.slide; p.slide -= dt; }
  p.vy += 1320 * dt;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  if (p.y >= 368) { p.y = 368; p.vy = 0; p.grounded = true; p.jumps = 0; if (hasEquip('jetpack') && Math.abs(p.vx)>80) p.slide = Math.max(p.slide, .08); }
  p.x = clamp(p.x, 20, 900);
  p.idle = Math.abs(move) < .1 && p.grounded && p.attackTime <= 0 ? p.idle + dt : 0;
  if (hasEquip('milkTea') && p.idle > 1.05 && p.hp < p.maxHp) {
    p.hp = Math.min(p.maxHp, p.hp + dt * 4);
    if (Math.random() < dt * 7) addFloat(p.x+p.w/2, p.y, '吸珍珠回血', '#4de0ff', .8);
  }
  if (p.combo > 0) {
    p.comboTtl -= dt;
    if (p.comboTtl <= 0) p.combo = 0;
  }

  updatePending(dt);
  updateEnemies(dt);
  update大首领(dt);
  updateProjectiles(dt);
  updateHazards(dt);
  updateProps(dt);
  updateEffects(dt);

  game.waveTimer += dt;
  if (!game.bossActive && game.enemies.length === 0 && game.waveTimer > .9) {
    if (!game.stageCleared) completeStageReward();
    game.stageClearTimer -= dt;
    if (game.stageClearTimer <= 0) startWave(game.wave + 1);
  }
  if (game.bossActive && game.boss.hp <= 0) handle大首领Defeat();
  if (p.hp <= 0) finishBattle(false);
  updateHud();
}

function jumpPlayer() {
  const p = game.player;
  if (p.grounded || p.jumps < p.maxJumps) {
    p.vy = p.grounded ? -540 : -470;
    p.grounded = false; p.jumps++;
    burst(p.x+p.w/2, p.y+p.h, hasEquip('jetpack') && p.jumps>1 ? '#ff5aa5' : '#4de0ff', hasEquip('jetpack') && p.jumps>1 ? 20 : 8, 0, 'square');
    if (hasEquip('jetpack') && p.jumps > 1) {
      addFloat(p.x+p.w/2, p.y, '灵感喷射!', '#ff5aa5', 1);
      for (let i=0;i<5;i++) game.projectiles.push({ from:'player', type:'note', x:p.x+p.w/2, y:p.y+20, vx:rand(-220,220), vy:rand(-120,-40), r:8, damage:12, color:'#ff5aa5', ttl:1.1 });
    }
    SFX.boing();
  }
}

function tryDodge() {
  const p = game.player;
  if (p.dodgeCd > 0) return;
  p.dodgeCd = .88;
  p.dodgeTime = .18;
  p.invuln = game.derived.dodgeInvuln;
  p.dodgePerfect = .22;
  p.vx = p.facing * 650;
  burst(p.x+p.w/2, p.y+p.h/2, '#4de0ff', 16, -p.facing, 'dash');
  SFX.dodge();
}

function tryMelee() {
  const p = game.player;
  if (p.attackCd > 0) return;
  const step = p.comboTimer > 0 ? (p.comboStep % 3) + 1 : 1;
  p.comboStep = step; p.comboTimer = .58; p.attackTime = .2;
  p.attackCd = game.derived.attackCd * (step === 3 ? 1.18 : .82);
  const reach = [58, 66, 78][step-1] * game.derived.reach;
  const h = step === 3 ? 54 : 44;
  const box = { x:p.facing>0 ? p.x+p.w-4 : p.x-reach+4, y:p.y+8, w:reach, h };
  p.x += p.facing * [5,10,16][step-1];
  const base = game.derived.attack * [1,1.14,1.42][step-1] * (p.overclock>0 ? 1.35 : 1);
  performHitbox(box, base, { step, air:!p.grounded, kind:'melee' });
  game.slashes.push({ x:box.x+box.w/2, y:box.y+box.h/2, facing:p.facing, step, life:.16, hit:false });
  game.hitStop = Math.max(game.hitStop, .025);
  SFX.clack();
}

function trySkill() {
  const p = game.player;
  if (p.rage >= 100) { castSuper(); return; }
  if (p.projectileCd > 0) return;
  p.projectileCd = game.derived.projectileCd;
  const secondary = save.equipped.weapon2 || 'loudspeaker';
  const cold = secondary === 'loudspeaker';
  const slipper = secondary === 'slipper';
  const laser = secondary === 'laserPointer';
  const receipt = secondary === 'receiptCrossbow';
  const bubble = secondary === 'bubbleWand';
  const dual = secondary === 'dualPens';
  game.projectiles.push({
    from:'player', type:cold?'cold':slipper?'slipper':laser?'laserDot':receipt?'receipt':bubble?'homingBubble':dual?'pen':'keyshot',
    x:p.x+p.w/2+p.facing*22, y:p.y+25, vx:p.facing*(laser?720:cold?430:slipper?500:receipt?580:bubble?380:560), vy:slipper?-40:receipt?-20:0,
    r:laser?8:cold?15:slipper?17:bubble?14:10, damage:laser?38:cold?34:slipper?42:receipt?36:bubble?30:dual?32:28,
    color:laser?'#ff4fd8':cold?'#4de0ff':slipper?'#ff4fd8':receipt?'#4ee18a':bubble?'#b66dff':'#35f2ff',
    ttl:laser?1.1:receipt?1.7:bubble?2.2:1.8,
    homing:bubble
  });
  addFloat(p.x+p.w/2, p.y, laser ? '激光点名' : receipt ? '小票发射' : bubble ? '反问泡泡' : cold ? '冷场发射' : slipper ? '拖鞋飞行' : '键帽飞行', laser?'#ff4fd8':receipt?'#4ee18a':bubble?'#b66dff':cold?'#4de0ff':slipper?'#ff4fd8':'#35f2ff', .9);
  SFX.boing();
}

function castActiveSkill(slot) {
  const p = game.player;
  const id = save.equipped[slot];
  const eq = EQUIP[id];
  if (!eq || eq.slot !== 'skill' || p.activeCd[slot] > 0) return;
  p.activeCd[slot] = eq.cooldown || 8;
  const cx = p.x + p.w/2, cy = p.y + p.h/2;
  if (id === 'milkTea') {
    p.shield = Math.min(p.maxShield + 34, p.shield + 34);
    p.hp = Math.min(p.maxHp, p.hp + 18);
    pearlBurst();
    addFloat(cx, p.y, '奶茶护盾续杯!', '#4de0ff', 1.05);
  } else if (id === 'potLid') {
    p.invuln = Math.max(p.invuln, 1.05);
    p.reflectCd = 0;
    shockwave(cx, cy);
    addFloat(cx, p.y, '锅盖弹反架好!', '#4ee18a', 1.05);
  } else if (id === 'socialCharm') {
    p.invuln = Math.max(p.invuln, 1.35);
    game.slowMo = Math.max(game.slowMo, .45);
    burst(cx, cy, '#b66dff', 24, 0, 'dash');
    addFloat(cx, p.y, '我先下了!', '#b66dff', 1.12);
  } else if (id === 'clientRadar') {
    if (game.bossActive) game.boss.weakTimer = Math.max(game.boss.weakTimer, 4);
    game.enemies.forEach(e => e.cd += .8);
    burst(cx, cy, '#35f2ff', 26, 0, 'spark');
    addFloat(cx, p.y, '弱点扫描完成!', '#35f2ff', 1.05);
  } else if (id === 'memeBelt') {
    shockwave(cx, cy);
  } else if (id === 'jetpack') {
    p.vy = -690; p.grounded = false; p.jumps = Math.max(p.jumps, 1);
    for (let i=0;i<8;i++) game.projectiles.push({ from:'player', type:'note', x:cx, y:cy, vx:rand(-240,240), vy:rand(-260,-80), r:8, damage:12, color:'#ff5aa5', ttl:1.15 });
    addFloat(cx, p.y, '灵感喷射!', '#ff5aa5', 1.05);
  } else if (id === 'stickyMine') {
    game.zones.push({type:'mine', x:p.x-18, y:400, w:76, h:22, ttl:5.8, color:'#ff5aa5', armed:true});
    addFloat(cx, p.y, '便利贴地雷!', '#ff5aa5', 1.05);
  } else if (id === 'alarmBoots') {
    p.vy = -760; p.grounded = false; p.jumps = 0; p.dodgeCd = 0; p.invuln = Math.max(p.invuln, .5);
    burst(cx, cy, '#35f2ff', 26, 0, 'dash');
    addFloat(cx, p.y, '准点弹跳!', '#35f2ff', 1.05);
  } else if (id === 'redPacketDrone') {
    for (let i=0;i<6;i++) game.pending.push({t:i*.16, fn:() => {
      const target = game.enemies[0] || game.boss;
      const dir = target && target.x < p.x ? -1 : 1;
      game.projectiles.push({from:'player', type:'receipt', x:p.x+p.w/2, y:p.y+6, vx:dir*rand(420,560), vy:rand(-120,30), r:9, damage:18, color:'#4ee18a', ttl:1.5});
    }});
    addFloat(cx, p.y, '红包无人机起飞!', '#4ee18a', 1.05);
  } else if (id === 'coffeeDash') {
    p.vx = p.facing * 780; p.dodgeTime = .2; p.invuln = Math.max(p.invuln, .55);
    game.zones.push({type:'coffee', x:p.x-p.facing*18, y:410, w:150, h:16, ttl:3.6, color:'#35f2ff'});
    addFloat(cx, p.y, '咖啡滑步!', '#35f2ff', 1.05);
  } else if (id === 'confettiShield') {
    p.shield = Math.min(p.maxShield + 44, p.shield + 44);
    shockwave(cx, cy);
    burst(cx, cy, '#ff4fd8', 42, 0, 'confetti');
    addFloat(cx, p.y, '彩带护盾!', '#ff4fd8', 1.05);
  } else if (id === 'overtimeCape') {
    p.overclock = Math.max(p.overclock, 5);
    p.rage = Math.min(100, p.rage + 30);
    p.invuln = Math.max(p.invuln, .45);
    showBig('下班冲刺', '这五秒你很会');
  }
  triggerShake(8);
  SFX.super();
}

function castSuper() {
  const p = game.player;
  p.rage = 0; game.stats.supers++; save.stats.supers = (save.stats.supers || 0) + 1;
  game.flash = .45; game.hitStop = .14; triggerShake(18); SFX.super();
  const weapon = save.equipped.weapon1;
  if (weapon === 'slipper') {
    showBig('拖鞋奥义', '礼貌但响亮');
    damageAll(118, '#35f2ff', '拖鞋奥义!');
    for (let i=0;i<44;i++) burst(rand(100,860), rand(120,420), '#35f2ff', 1, 0, 'confetti');
  } else if (weapon === 'loudspeaker') {
    showBig('冷笑话扩音', '全场短暂安静');
    game.boss.slow = Math.max(game.boss.slow, 3.2); game.boss.weakTimer = Math.max(game.boss.weakTimer, 2.2);
    damageAll(86, '#4de0ff', '哈哈哈...哈?');
  } else if (weapon === 'stampHammer') {
    showBig('全员已阅', '章盖到桌子冒烟');
    damageAll(132, '#4ee18a', '已阅!');
    shockwave(p.x+p.w/2, p.y+18);
  } else if (weapon === 'laserPointer') {
    showBig('激光点名', '弱点请自觉站出来');
    if (game.bossActive) game.boss.weakTimer = Math.max(game.boss.weakTimer, 4.2);
    for (let i=0;i<10;i++) game.pending.push({ t:i*.05, fn:() => game.projectiles.push({from:'player', type:'laserDot', x:p.x+p.w/2, y:p.y+22+rand(-20,20), vx:p.facing*760, vy:rand(-20,20), r:8, damage:20, color:'#ff4fd8', ttl:1}) });
  } else if (weapon === 'receiptCrossbow' || weapon === 'dualPens' || weapon === 'bubbleWand') {
    showBig('远近混合批注', '它被你改到不会了');
    damageAll(96, '#ff5aa5', '批注爆破!');
    for (let i=0;i<12;i++) game.projectiles.push({from:'player', type:weapon==='bubbleWand'?'homingBubble':'receipt', x:p.x+p.w/2, y:p.y+20, vx:p.facing*rand(360,560), vy:rand(-180,80), r:10, damage:16, color:weapon==='bubbleWand'?'#b66dff':'#4ee18a', ttl:1.6, homing:weapon==='bubbleWand'});
  } else {
    showBig('键帽暴雨', '确认键说它先上');
    for (let i=0;i<16;i++) game.pending.push({ t:i*.035, fn:() => game.projectiles.push({from:'player', type:'key', x:rand(120,860), y:40, vx:rand(-40,40), vy:rand(420,580), r:9, damage:18, color:'#35f2ff', ttl:1.3}) });
  }
}

function damageAll(amount, color, text) {
  game.enemies.forEach(e => damageEnemy(e, amount));
  if (game.bossActive) damage大首领(amount, { x:game.boss.x, y:game.boss.y, w:game.boss.w, h:game.boss.h }, { forced:true, weak:true, text, color });
}

function performHitbox(box, amount, meta={}) {
  let hit = false;
  game.enemies.forEach(e => {
    if (e.hp > 0 && rects(box,e)) { damageEnemy(e, amount, meta); hit = true; }
  });
  game.props.forEach(prop => {
    if (prop.live && rects(box, prop)) { hitProp(prop); hit = true; }
  });
  if (game.bossActive && rects(box, game.boss)) {
    damage大首领(amount, box, meta);
    hit = true;
  }
  const slash = game.slashes[game.slashes.length-1];
  if (slash) slash.hit = hit;
  if (hit && meta.step === 3 && hasEquip('keyboard')) {
    const p = game.player;
    for (let i=-2;i<=2;i++) game.projectiles.push({ from:'player', type:'key', x:p.x+p.w/2, y:p.y+22+i*3, vx:p.facing*(420+Math.abs(i)*30), vy:i*55, r:7, damage:10, color:'#35f2ff', ttl:1.1 });
    addFloat(p.x+p.w/2, p.y, '键帽×5', '#35f2ff', .9);
  }
  if (hit && meta.step === 3 && hasEquip('stampHammer')) {
    shockwave(game.player.x+game.player.w/2, game.player.y+18);
  }
  if (hit && hasEquip('dualPens')) {
    game.player.projectileCd = Math.max(0, game.player.projectileCd - .18);
  }
}

function damage大首领(amount, box, meta={}) {
  const b = game.boss, p = game.player;
  const weak = meta.weak || b.weakTimer > 0 || rects(box || {}, getWeakRect());
  let mul = (weak ? game.derived.weakBonus : 1) * stageDamageMultiplier(meta.kind || 'melee');
  if (meta.air && hasEquip('jetpack')) mul += game.derived.airDamage;
  if (p.perfectCharge > 0 && hasEquip('slipper')) { mul += .8; p.perfectCharge = 0; addFloat(b.x+b.w/2, b.y, '精准拖鞋制裁!', '#35f2ff', 1.2); b.x += p.facing * 38; }
  const crit = Math.random() < game.derived.crit + (weak ? .12 : 0);
  const dmg = Math.round(amount * mul * (crit ? 1.55 : 1));
  b.hp = Math.max(0, b.hp - dmg);
  if (current大首领.affix?.id === 'thorns' && dmg > 0) hurtPlayer(Math.round(dmg * 0.1), {_thorn:true});
  b.hurt = .16; b.face = weak ? '⊙▽⊙' : 'ಠ_ಠ';
  game.stats.damage += dmg; game.stats.hits++;
  game.hitStop = Math.max(game.hitStop, crit ? .09 : .055);
  triggerShake(crit ? 12 : 7, p.facing);
  addCombo(weak ? 2 : 1);
  p.rage = Math.min(100, p.rage + (weak ? 10 : 5) + (crit ? 3 : 0));
  addFloat(b.x+b.w/2, b.y-6, meta.text || dmg, crit?'#8b5cf6':weak?'#4ee18a':'#f4fbff', crit?1.35:1);
  burst(b.x+b.w/2, b.y+50, meta.color || (weak?'#4ee18a':'#35f2ff'), crit?32:18, p.facing, 'spark');
  if (weak) addFloat(b.x+b.w/2, b.y+24, '弱点命中!', '#4ee18a', .92);
  if (hasEquip('memeBelt') && p.combo >= 12 && p.combo - p.memeAt >= 12) {
    p.memeAt = p.combo;
    shockwave(p.x+p.w/2, p.y+20);
  }
  crit ? SFX.crit() : SFX.hit();
}

function damageEnemy(e, amount, meta={}) {
  const dmg = Math.round(amount * stageDamageMultiplier(meta.kind || 'melee'));
  e.hp = Math.max(0, e.hp - dmg); e.hurt = .12;
  game.stats.damage += dmg;
  addCombo(1);
  game.player.rage = Math.min(100, game.player.rage + 4);
  addFloat(e.x+e.w/2, e.y, dmg, '#f4fbff', .86);
  burst(e.x+e.w/2, e.y+e.h/2, e.color, 12, game.player.facing, 'spark');
  game.hitStop = Math.max(game.hitStop, .04);
  SFX.hit();
}

function addCombo(n) {
  const p = game.player;
  p.combo += n;
  p.comboTtl = game.derived.comboGrace;
  game.stats.maxCombo = Math.max(game.stats.maxCombo, p.combo);
}

function shockwave(x,y) {
  addFloat(x, y-30, '表情包腰带!', '#b66dff', 1.05);
  game.enemies.forEach(e => { if (Math.abs((e.x+e.w/2)-x)<190) damageEnemy(e, 24); });
  if (game.bossActive && Math.abs((game.boss.x+game.boss.w/2)-x)<230) damage大首领(28, {x:x-120,y:y-60,w:240,h:120}, {forced:true, text:'表情包冲击'});
  burst(x,y,'#b66dff',34,0,'confetti');
}

function hitProp(prop) {
  prop.hp--;
  prop.pulse = .5;
  burst(prop.x+prop.w/2, prop.y+prop.h/2, (CONTENT.worlds[prop.type] || CONTENT.worlds[current大首领.world]).accent, 14, 0, 'square');
  if (prop.hp > 0) return;
  prop.live = false;
  const cx = prop.x+prop.w/2;
  const type = prop.type;
  if (type === 'egg') {
    game.eggsFound += 1;
    save.stats.eggs = (save.stats.eggs || 0) + 1;
    save.fragments.joke += 3;
    unlockAchievement('eggHunter');
    addFloat(cx, prop.y, '彩蛋：老板的撤回键!', '#b66dff', 1.1);
    for (let i=0;i<26;i++) burst(cx, prop.y+20, i%2?'#4ee18a':'#ff4fd8', 1, 0, 'confetti');
    saveNow();
    return;
  }
  if (type === 'office') game.zones.push({type:'slip', x:prop.x-20, y:410, w:110, h:18, ttl:4, color:'#f4fbff'});
  if (type === 'social') { game.player.rage = Math.min(100, game.player.rage+18); addFloat(cx, prop.y, '红点变怒气!', '#ff5aa5', 1); }
  if (type === 'family') game.zones.push({type:'soup', x:prop.x-10, y:410, w:90, h:18, ttl:4, color:'#4ee18a'});
  if (type === 'commute') { game.player.vx += game.player.facing*320; addFloat(cx, prop.y, '顺风车!', '#4de0ff', 1); }
  if (type === 'creative') { game.boss.weakTimer = Math.max(game.boss.weakTimer, 2.8); addFloat(cx, prop.y, '灵感灯亮!', '#ff5aa5', 1); }
  if (type === 'time') { game.slowMo = .8; addFloat(cx, prop.y, '慢一拍!', '#8b5cf6', 1); }
  SFX.splat();
}

function updateEnemies(dt) {
  const p = game.player;
  game.enemies = game.enemies.filter(e => {
    e.hurt = Math.max(0, e.hurt-dt);
    if (e.hp <= 0) {
      rollEnemyDrop(e);
      burst(e.x+e.w/2, e.y+e.h/2, e.color, 18, 0, 'confetti');
      return false;
    }
    const dir = p.x < e.x ? -1 : 1;
    const speedMul = game?.difficulty?.speed || 1;
    if (e.type !== 'turret') e.x += dir * (e.type==='elite'?38:e.type==='jumper'?72:56) * speedMul * dt;
    if (e.type === 'jumper') e.y = 350 + Math.sin(performance.now()/180 + e.x*.02) * 18;
    e.cd -= dt;
    if (e.cd <= 0) {
      e.cd = (e.type==='elite' ? 1.4 : e.type==='turret' ? 1.15 : 2.1) / (game?.difficulty?.rate || 1);
      game.projectiles.push({ from:'enemy', type:e.type==='turret'?'receipt':'dot', x:e.x+e.w/2, y:e.y+18, vx:dir*(e.type==='elite'?270:e.type==='turret'?330:210), vy:e.type==='turret'?rand(-35,35):0, r:e.type==='elite'?11:8, damage:e.atk, color:e.color, ttl:2, perfect:false });
      addTelegraph(e.x-10, e.y+8, e.w+20, 18, .22, e.color);
    }
    if (rects(e, p)) hurtPlayer(e.type==='elite'?12:6, e);
    return true;
  });
}

function rollEnemyDrop(e) {
  if (e.dropped) return;
  e.dropped = true;
  const chance = (e.type === 'elite' ? .62 : e.type === 'turret' ? .22 : .16) + (game?.difficulty?.loot || 0);
  if (Math.random() > chance) return;
  const worldPool = CONTENT.equipment
    .filter(item => item.source.includes(CONTENT.worlds[e.world]?.name || '') || current大首领.drops.includes(item.id))
    .map(item => item.id);
  const pool = [...new Set([...worldPool, ...stageDropPool(game.stageNode?.type || current大首领.chapter, current大首领.chapter, current大首领.drops), 'memeBelt','milkTea','loudspeaker'])];
  const id = pool[Math.floor(Math.random()*pool.length)];
  const eq = EQUIP[id];
  if (!eq) return;
  if (!save.unlocked.includes(id)) {
    save.unlocked.push(id);
    addFloat(e.x+e.w/2, e.y-12, `掉落 ${eq.name}!`, '#4ee18a', 1);
    SFX.loot();
  } else {
    save.fragments.sticker += 1;
    addFloat(e.x+e.w/2, e.y-12, '重复装备变碎片 +1', '#b66dff', .9);
  }
  saveNow();
}

function completeStageReward() {
  game.stageCleared = true;
  game.stageClearTimer = .68;
  const stop = game.stageNode;
  if (!stop || stop.boss) return;
  const pool = stageDropPool(stop.type, current大首领.chapter, current大首领.drops);
  const chance = .3 + (game.difficulty?.loot || 0) + (stop.egg ? .08 : 0);
  let text = '小关结算：表情包碎片 +1';
  if (pool.length && Math.random() < chance) {
    const id = pool[Math.floor(Math.random() * pool.length)];
    const eq = EQUIP[id];
    if (eq && !save.unlocked.includes(id)) {
      save.unlocked.push(id);
      text = `小关奖励：${eq.name}`;
      SFX.loot();
    } else {
      save.fragments.sticker += 2;
      text = '重复奖励：表情包碎片 +2';
    }
  } else {
    save.fragments.sticker += 1;
  }
  game.stageRewards.push({ stage:stop.label, text, type:stop.type });
  addFloat(480, 164, text, '#4ee18a', 1.05);
  showBig('小关通过', text);
  saveNow();
}

function update大首领(dt) {
  if (!game.bossActive) return;
  const b = game.boss;
  const hpR = b.hp / b.maxHp;
  b.lastPhase = b.phase;
  b.phase = hpR < .34 ? 2 : hpR < .67 ? 1 : 0;
  if (b.phase !== b.lastPhase) {
    const words = ['它开始认真找借口', '它把借口加粗了'][b.phase-1] || '阶段切换';
    showBig(`阶段 ${b.phase+1}`, words);
    b.weakTimer = Math.max(b.weakTimer, 1.2);
    game.flash = .35; triggerShake(14); burst(b.x+b.w/2, b.y+60, current大首领.color, 42, 0, 'confetti');
  }
  b.hurt = Math.max(0, b.hurt-dt);
  b.weakTimer = Math.max(0, b.weakTimer-dt);
  b.slow = Math.max(0, b.slow-dt);
  b.stun = Math.max(0, b.stun-dt);
  if (b.stun > 0) return;
  const p = game.player;
  b.x += Math.sin(performance.now()/520) * dt * 18;
  b.x = clamp(b.x, 520, 820);
  b.attackTimer -= dt * (b.slow > 0 ? .46 : 1) * (game?.difficulty?.rate || 1) * (current大首领.affix?.id === 'berserk' ? 1.5 : 1);
  if (b.attackTimer > 0) return;
  const pool = current大首领.patterns;
  const type = pool[(b.patternIndex + b.phase) % pool.length];
  b.patternIndex++;
  b.attackTimer = Math.max(.72, 1.55 - b.phase*.16 - game.endlessClears*.08);
  queue大首领Pattern(type);
}

function queue大首领Pattern(type) {
  const b = game.boss, p = game.player, color = current大首领.color;
  const name = current大首领.attacks.find(a => a[2] === type)?.[0] || ({summon:'叫小弟递台词', floor:'地面小惊喜', gust:'绕路箭头'}[type] || '花式找借口');
  addFloat(b.x+b.w/2, b.y-18, name, color, .9);
  if (type === 'rain') {
    for (let i=0;i<5+game.boss.phase;i++) {
      const x = 130 + ((i*157 + Math.floor(performance.now()/10)) % 700);
      addTelegraph(x-24, 412, 48, 18, .55, color);
      game.pending.push({ t:.48+i*.04, fn:() => game.hazards.push({type:'fall', x:x-18, y:-60, w:36, h:52, vy:420, damage:14+game.boss.phase*3, ttl:2.2, color, perfect:false}) });
    }
  } else if (type === 'sweep') {
    const y = p.y + 22;
    addTelegraph(80, y-16, 800, 34, .52, color);
    game.pending.push({ t:.52, fn:() => {
      game.hazards.push({type:'laser', x:80, y:y-16, w:800, h:34, damage:18+game.boss.phase*4, ttl:.16, color, perfect:false});
      triggerShake(8); SFX.boing();
    }});
  } else if (type === 'dash') {
    const dir = p.x < b.x ? -1 : 1;
    const lane = { x: Math.min(p.x, b.x)-20, y:400, w: Math.abs(p.x-b.x)+150, h:30 };
    addTelegraph(lane.x, lane.y, lane.w, lane.h, .45, color);
    game.pending.push({ t:.45, fn:() => {
      b.x += dir * 190; triggerShake(13, dir); burst(b.x+b.w/2,b.y+70,color,28,dir,'spark');
      if (rects(b, game.player)) hurtPlayer(22+game.boss.phase*5, b);
      b.weakTimer = Math.max(b.weakTimer, .85);
    }});
  } else if (type === 'bubbles' || type === 'homing') {
    for (let i=0;i<4+game.boss.phase;i++) {
      game.pending.push({ t:.2+i*.12, fn:() => {
        const dir = game.player.x < b.x ? -1 : 1;
        game.projectiles.push({ from:'boss', type, x:b.x+b.w/2, y:b.y+35+i*4, vx:dir*rand(190,280), vy:rand(-40,50), r:type==='homing'?13:10, damage:type==='homing'?13:11, color, ttl:2.8, homing:type==='homing', perfect:false });
      }});
    }
  } else if (type === 'clamp') {
    addTelegraph(70, 386, 170, 44, .58, color);
    addTelegraph(720, 386, 170, 44, .58, color);
    game.pending.push({ t:.58, fn:() => {
      game.hazards.push({type:'door', x:70, y:386, w:170, h:44, vx:280, damage:17, ttl:.5, color, perfect:false});
      game.hazards.push({type:'door', x:720, y:386, w:170, h:44, vx:-280, damage:17, ttl:.5, color, perfect:false});
    }});
  } else if (type === 'floor') {
    const x = clamp(p.x + rand(-70,70), 90, 820);
    addTelegraph(x-35, 410, 70, 20, .45, color);
    game.pending.push({ t:.45, fn:() => game.hazards.push({type:'pop', x:x-35, y:388, w:70, h:42, damage:15, ttl:.3, color, perfect:false}) });
  } else if (type === 'gust') {
    addFloat(b.x+b.w/2, b.y, '绕路箭头!', '#4de0ff', .9);
    game.player.vx += (game.player.x < b.x ? -1 : 1) * 260;
    for (let i=0;i<14;i++) burst(rand(120,840), rand(150,380), '#4de0ff', 1, game.player.x < b.x ? -1 : 1, 'dash');
  } else {
    spawnEnemy('small', 850);
    spawnEnemy('small', 760);
  }
}

function updatePending(dt) {
  game.pending = game.pending.filter(job => {
    job.t -= dt;
    if (job.t <= 0) { job.fn(); return false; }
    return true;
  });
}

function updateProjectiles(dt) {
  const p = game.player;
  game.projectiles = game.projectiles.filter(s => {
    s.ttl -= dt;
    if (s.homing) {
      const dir = Math.sign((p.x+p.w/2)-s.x);
      s.vx += dir * 160 * dt;
      s.vy += Math.sign((p.y+30)-s.y) * 70 * dt;
    }
    s.x += s.vx * dt; s.y += (s.vy||0) * dt;
    if (s.type === 'key' || s.type === 'note') s.vy += 620 * dt;
    if (s.from === 'player') {
      const e = game.enemies.find(en => en.hp > 0 && circleRect(s,en));
      if (e) { damageEnemy(e, s.damage, {kind:'ranged'}); return false; }
      if (game.bossActive && circleRect(s, game.boss)) {
        if (s.type === 'cold') { game.boss.slow = Math.max(game.boss.slow, 1.4); addFloat(game.boss.x+55, game.boss.y, '场面冷住了', '#4de0ff', .85); }
        damage大首领(s.damage, {x:s.x-s.r,y:s.y-s.r,w:s.r*2,h:s.r*2}, {weak:s.type==='note' || s.type==='laserDot', kind:'ranged'});
        return false;
      }
    } else if (circleRect(s, p)) {
      if (hasEquip('potLid') && p.reflectCd <= 0) {
        p.reflectCd = 3.2; s.from = 'player'; s.vx *= -1.25; s.color = '#4ee18a'; s.damage *= 1.25; addFloat(p.x+p.w/2, p.y, '锅盖反弹!', '#4ee18a', .95); return true;
      }
      hurtPlayer(s.damage, s);
      return false;
    }
    return s.ttl > 0 && s.x > -80 && s.x < 1040 && s.y < 620;
  });
}

function updateHazards(dt) {
  const p = game.player;
  game.hazards = game.hazards.filter(h => {
    h.ttl -= dt;
    if (h.vy) h.y += h.vy * dt;
    if (h.vx) h.x += h.vx * dt;
    if (rects(h, p)) { hurtPlayer(h.damage, h); h.ttl = Math.min(h.ttl, .04); }
    return h.ttl > 0 && h.y < 560;
  });
}

function updateProps(dt) {
  const b = game.boss;
  const p = game.player;
  game.props.forEach(prop => prop.pulse += dt);
  game.zones = game.zones.filter(z => {
    z.ttl -= dt;
    if (rects(z, p)) {
      if (z.type === 'bounce') { p.vy = Math.min(p.vy, -620); p.grounded = false; addFloat(p.x+p.w/2, p.y, '弹簧脚感!', '#4de0ff', .8); z.ttl -= .25; }
      if (z.type === 'focus') { p.rage = Math.min(100, p.rage + dt*16); }
      if (z.type === 'tempo') { p.comboTtl = Math.max(p.comboTtl, game.derived.comboGrace + .3); }
    }
    if (z.type === 'mine' || z.type === 'coffee') {
      game.enemies.forEach(e => {
        if (e.hp > 0 && rects(z, e)) {
          damageEnemy(e, z.type === 'mine' ? 24 : 10, {kind:'ranged'});
          if (z.type === 'mine') z.ttl = Math.min(z.ttl, .08);
        }
      });
      if (game.bossActive && rects(z, b)) {
        damage大首领(z.type === 'mine' ? 28 : 12, z, {kind:'ranged', text:z.type === 'mine' ? '便利贴爆' : '咖啡打滑'});
        z.ttl = Math.min(z.ttl, z.type === 'mine' ? .08 : z.ttl);
      }
    }
    if (game.bossActive && rects(z, b)) {
      b.weakTimer = Math.max(b.weakTimer, 1.8);
      b.stun = Math.max(b.stun, .35);
      addFloat(b.x+b.w/2, b.y, z.type === 'slip' ? '它滑了一下!' : '它开始认真喝汤!', '#4ee18a', .9);
      z.ttl = Math.min(z.ttl, .1);
    }
    return z.ttl > 0;
  });
}

function hurtPlayer(amount, source={}) {
  const p = game.player;
  if (p.dodgePerfect > 0 && !source.perfect) {
    source.perfect = true;
    perfectDodge();
    return;
  }
  if (p.invuln > 0) return;
  if (hasEquip('socialCharm') && p.hp < p.maxHp*.36 && Math.random() < .28) {
    addFloat(p.x+p.w/2, p.y, '社恐护符：我先下了', '#b66dff', .9);
    p.invuln = .4; return;
  }
  let dmg = Math.max(1, Math.round(amount * (game?.difficulty?.dmg || 1) * (1 - game.derived.projectileResist)));
  if (p.shield > 0) {
    const used = Math.min(p.shield, dmg);
    p.shield -= used; dmg -= used;
    if (hasEquip('milkTea')) {
      addFloat(p.x+p.w/2, p.y, '珍珠护盾!', '#4de0ff', .75);
      if (p.shield <= 0) pearlBurst();
    }
  }
  if (dmg > 0) p.hp = Math.max(0, p.hp-dmg);
  if (game.bossActive && current大首领.affix?.id === 'vampiric' && dmg > 0 && !source._thorn) {
    game.boss.hp = Math.min(game.boss.maxHp, game.boss.hp + Math.round(dmg * 0.2));
    addFloat(game.boss.x+game.boss.w/2, game.boss.y, '吸血恢复', '#ff4fd8', .8);
  }
  if (p.hp <= 0 && hasEquip('overtimeCape') && !p.deathSave) {
    p.deathSave = true; p.hp = 1; p.overclock = 4; p.rage = 100;
    addFloat(p.x+p.w/2, p.y, '下班冲刺!', '#35f2ff', 1.2);
    showBig('还没下班', '披风把你拽回来了');
  }
  p.hurtFlash = 1; p.invuln = .42; game.stats.taken += dmg;
  addFloat(p.x+p.w/2, p.y, dmg ? `-${dmg}` : '护盾', dmg?'#ff6b6b':'#4de0ff', 1);
  burst(p.x+p.w/2, p.y+p.h/2, '#ff6b6b', 14, -p.facing, 'spark');
  triggerShake(8, -p.facing); SFX.splat();
}

function perfectDodge() {
  const p = game.player;
  p.dodgePerfect = 0; p.perfectCharge = 1.4; p.rage = Math.min(100, p.rage + 18);
  game.stats.perfect++; game.slowMo = .22; game.hitStop = .06;
  addFloat(p.x+p.w/2, p.y-10, '漂亮!', '#4de0ff', 1.25);
  if (game.stageNode?.type === 'dodge') {
    p.rage = Math.min(100, p.rage + 12);
    addFloat(p.x+p.w/2, p.y-34, '跑酷关奖励!', '#b66dff', .9);
  }
  burst(p.x+p.w/2, p.y+p.h/2, '#4de0ff', 24, -p.facing, 'dash');
  SFX.dodge();
}

function pearlBurst() {
  const p = game.player;
  for (let i=0;i<8;i++) game.projectiles.push({ from:'player', type:'pearl', x:p.x+p.w/2, y:p.y+24, vx:Math.cos(i/8*Math.PI*2)*260, vy:Math.sin(i/8*Math.PI*2)*170, r:7, damage:9, color:'#4de0ff', ttl:1.1 });
}

function handle大首领Defeat() {
  if (game.mode === 'endless' && game.endlessClears < 2) {
    game.endlessClears++;
    game.boss.hp = Math.round(game.boss.maxHp * (1.12 + game.endlessClears*.22));
    game.boss.maxHp = game.boss.hp;
    game.boss.phase = 0; game.boss.attackTimer = 1.1;
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + 42);
    game.player.shield = Math.min(game.player.maxShield, game.player.shield + 12);
    showBig(`无尽 ${game.endlessClears+1}`, '同一只怪兽换了个借口');
    burst(game.boss.x+game.boss.w/2, game.boss.y+60, current大首领.color, 60, 0, 'confetti');
    return;
  }
  finishBattle(true);
}

function finishBattle(won) {
  if (!game || game.state !== 'playing') return;
  game.state = 'done';
  cancelAnimationFrame(animId);
  const seconds = Math.max(1, Math.round((performance.now()-game.startedAt)/1000));
  const code = `爆-${current大首领.posterNo}-${won?'完成':'再来'}`;
  const chapterDrop = chapterInfo(current大首领.chapter)?.drops?.[0];
  const drop = currentDrop || EQUIP[chapterDrop] || EQUIP.keyboard || CONTENT.equipment[0];
  let lootText = won ? `掉落：${drop.name}` : '掉落：一张“下次它就懂了”贴纸';
  if (won) {
    if (!save.unlocked.includes(drop.id)) {
      save.unlocked.push(drop.id); SFX.loot();
    } else {
      save.fragments.sticker += 1;
      lootText = `重复掉落转化为表情包碎片 +1`;
    }
  } else {
    save.fragments.ticket += 1;
  }
  save.stats.battles += 1;
  save.stats.wins += won ? 1 : 0;
  save.stats.bosses += won ? 1 : 0;
  save.stats.damage += game.stats.damage;
  save.stats.bestCombo = Math.max(save.stats.bestCombo, game.stats.maxCombo);
  save.stats.perfect += game.stats.perfect;
  if (won) save.chapterWins[current大首领.chapter] = (save.chapterWins[current大首领.chapter] || 0) + 1;
  const newAchievements = checkAchievements(won);
  const rewardLine = (game.stageRewards || []).map(r => r.text.replace(/^小关奖励：|^重复奖励：|^小关结算：/, '')).slice(-4).join('、') || '暂无小关奖励';
  save.codex[current大首领.id] = { name:current大首领.displayName, world:current大首领.world, wins:(save.codex[current大首领.id]?.wins||0)+(won?1:0), at:Date.now() };
  save.history.unshift({ boss:current大首领.displayName, won, drop:drop.name, damage:game.stats.damage, combo:game.stats.maxCombo, time:seconds, chapter:current大首领.chapter, difficulty:current大首领.difficulty, rewards:game.stageRewards, achievements:newAchievements, at:Date.now() });
  save.history = save.history.slice(0, 10);
  saveNow();
  updateLastRunBadge();

  const title = won ? '小烦恼已完成礼貌反省' : '这局它先保住了面子';
  const chapter = chapterInfo(current大首领.chapter);
  const diff = difficultyInfo(current大首领.difficulty);
  const summary = won
    ? `你用 ${fmtTime(seconds)} 连续打完「${chapter.short}」5 个小关，最高连击 ${game.stats.maxCombo}，完美闪避 ${game.stats.perfect} 次。小关奖励：${rewardLine}。`
    : `你把「${current大首领.displayName}」打到还剩 ${Math.ceil(game.boss.hp)} 点体面。下一局多抓弱点发光和完美闪避，胜算很高。`;
  const brag = buildShareHook(won, seconds, newAchievements);
  const share = `${brag}\n我今天把「${current大首领.safe}」登记成了小烦恼：${current大首领.displayName}。\n${won ? `${chapter.short} · ${diff.name} 难度 · 5 个小关连续完成` : '它暂时保住了面子'}，用时 ${fmtTime(seconds)}，最高连击 ${game.stats.maxCombo}。\n${lootText}，小关奖励：${rewardLine}。\n${code} #解压大冒险 #谁来接力`;
  $('#resultKicker').textContent = won ? '结算出炉' : '下次更响亮';
  $('#resultTitle').textContent = title;
  $('#resultSummary').textContent = summary;
  $('#shareGlyph').textContent = current大首领.glyph;
  $('#shareStage').textContent = won ? `${chapter.short} · ${diff.name}` : `${chapter.short} · 再来`;
  $('#share大首领Name').textContent = current大首领.displayName;
  $('#shareTitleLine').textContent = won
    ? brag
    : `这只小烦恼暂时没服，但它已经开始整理发言稿了。`;
  $('#shareDamage').textContent = `伤害 ${String(game.stats.damage).padStart(4,'0')}`;
  $('#shareTime').textContent = fmtTime(seconds);
  $('#shareCombo').textContent = `连击 ${game.stats.maxCombo}`;
  $('#shareLootIcon').innerHTML = won ? gearArtHtml(drop, true) : gearArtHtml(EQUIP.memeBelt, true);
  $('#shareDrop').textContent = lootText;
  $('#shareQuote').textContent = won ? (current大首领.death || '今天的小烦恼很努力，但你的连招更努力。') : '它只是这局多撑了一会儿，不代表它真的很会。';
  $('#shareCode').textContent = `战报号 ${code}`;
  $('#shareText').value = share;
  screenTo('result');
}

function checkAchievements(won) {
  const before = new Set(save.achievements);
  if (won) unlockAchievement('firstWin');
  if (game.stats.maxCombo >= 30) unlockAchievement('combo30');
  if (game.stats.perfect >= 3) unlockAchievement('perfect3');
  if (save.unlocked.length >= 12) unlockAchievement('collector12');
  if (won && current大首领.chapter === 'melee') unlockAchievement('meleeClear');
  if (won && current大首领.chapter === 'ranged') unlockAchievement('rangedClear');
  if (won && current大首领.chapter === 'hybrid') unlockAchievement('hybridClear');
  if (won && current大首领.chapter === 'dodge') unlockAchievement('dodgeClear');
  if (won && current大首领.difficulty === 'dead') unlockAchievement('deadClear');
  return save.achievements.filter(id => !before.has(id));
}

function buildShareHook(won, seconds, achievements=[]) {
  if (!won) return '今日小烦恼暂时逃过一劫，但它已经被我打到开始写检讨。';
  if (achievements.includes('deadClear')) return '我在「宗师」难度把小烦恼打成了可收藏物，建议朋友圈给我发一张虚拟奖状。';
  if (achievements.length) {
    const a = CONTENT.achievements.find(x => x.id === achievements[0]);
    return `刚解锁成就「${a?.name || '离谱操作'}」，这把不发出来都对不起我的手指。`;
  }
  if (game.stats.maxCombo >= 30) return `我打出了 ${game.stats.maxCombo} 连击，小烦恼全程只来得及说“等一下”。`;
  if (seconds <= 90) return '我把今天的小破事速通成了战报，爽感来得比下班提醒还快。';
  return '今天的离谱小事被我做成海报，又被我一路拆到只剩礼貌。';
}

function renderRunProgress() {
  const el = $('#runProgress');
  if (!el || !game || !current大首领?.route) return;
  const key = `${game.wave}:${game.stageCleared}:${game.bossActive}`;
  if (game.runProgressKey === key) return;
  game.runProgressKey = key;
  el.innerHTML = current大首领.route.map((r, i) => {
    const w = CONTENT.worlds[r.world];
    const state = i < game.wave ? 'done' : i === game.wave ? 'active' : '';
    const mark = i < game.wave ? '✓' : r.boss ? '烦' : i + 1;
    return `<article class="run-node ${state}">
      <span class="run-node-glyph" style="background:${w.accent};">${mark}</span>
      <span><strong>${r.label}</strong><small>${r.recommend} · ${state === 'done' ? '已通过' : state === 'active' ? '进行中' : '待挑战'}</small></span>
    </article>`;
  }).join('');
}

function updateHud() {
  if (!game) return;
  const p = game.player, b = game.boss;
  $('#playerHpText').textContent = `${Math.ceil(p.hp)}/${p.maxHp}`;
  $('#playerHpFill').style.width = `${clamp(p.hp/p.maxHp,0,1)*100}%`;
  $('#playerShieldFill').style.width = `${p.maxShield ? clamp(p.shield/p.maxShield,0,1)*100 : 0}%`;
  $('#bossHudName').textContent = current大首领.displayName;
  $('#bossHpText').textContent = game.bossActive ? `${Math.ceil(b.hp)}/${b.maxHp}` : `小怪 ${game.enemies.length}`;
  $('#bossHpFill').style.width = `${game.bossActive ? clamp(b.hp/b.maxHp,0,1)*100 : 100}%`;
  $('#phaseText').textContent = game.bossActive ? `阶段 ${b.phase+1} · ${b.weakTimer>0?'弱点发光':'观察前摇'}` : `第 ${game.wave+1} 站 · 清清场`;
  $('#rageFill').style.width = `${p.rage}%`;
  $('#comboText').innerHTML = `${p.combo}<small>连击</small>`;
  renderRunProgress();
  $$('.skill-btn').forEach(btn => {
    const a = btn.dataset.touch;
    let ready = true, cool = 0;
    if (a === 'attack') { ready = p.attackCd <= 0; cool = p.attackCd / .42; }
    else if (a === 'dodge') { ready = p.dodgeCd <= 0; cool = p.dodgeCd / .88; }
    else if (a === 'skill') {
      ready = p.projectileCd <= 0 || p.rage >= 100; cool = p.rage >= 100 ? 0 : p.projectileCd / game.derived.projectileCd;
      const eq = EQUIP[save.equipped.weapon2];
      btn.querySelector('.skill-name').textContent = p.rage >= 100 ? '大招' : (eq?.short || '副武');
      btn.querySelector('.skill-icon').textContent = p.rage >= 100 ? '爆' : (eq?.icon || '◇');
    } else if (a === 'skill1' || a === 'skill2') {
      const eq = EQUIP[save.equipped[a]];
      const max = eq?.cooldown || 8;
      ready = p.activeCd[a] <= 0; cool = p.activeCd[a] / max;
      btn.querySelector('.skill-name').textContent = eq?.short || (a === 'skill1' ? '技能一' : '技能二');
      btn.querySelector('.skill-icon').textContent = eq?.icon || '技';
    }
    btn.classList.toggle('ready', ready);
    btn.classList.toggle('cooling', !ready);
    btn.style.setProperty('--cool', clamp(cool,0,1));
  });
}

function showBig(title, sub) {
  game.bigTitle = title; game.bigSub = sub; game.bigTimer = 1.45;
  updateBigText();
}
function updateBigText() {
  if (!game) return;
  $('#bigText').classList.toggle('show', game.bigTimer > 0);
  $('#bigText b').textContent = game.bigTitle;
  $('#bigText span').textContent = game.bigSub;
}

function addTelegraph(x,y,w,h,life,color) { game.telegraphs.push({x,y,w,h,life,max:life,color}); }
function addFloat(x,y,text,color='#f4fbff',scale=1) { game.floats.push({x,y,text,color,scale,life:.78,max:.78,vy:-62}); }
function burst(x,y,color,count,dir=0,kind='spark') {
  for (let i=0;i<count;i++) {
    const p = particlePool.pop() || {};
    p.x=x; p.y=y; p.color=color; p.kind=kind; p.life=rand(.32,.72); p.max=p.life;
    p.vx=(dir?dir*rand(70,330):rand(-240,240)); p.vy=rand(-260,70); p.size=kind==='confetti'?rand(4,8):rand(3,6); p.rot=rand(0,6);
    game.particles.push(p);
  }
  if (game.particles.length > 360) game.particles.splice(0, game.particles.length-360).forEach(p => particlePool.push(p));
}
function updateEffects(dt) {
  game.telegraphs = game.telegraphs.filter(t => (t.life-=dt) > 0);
  game.slashes = game.slashes.filter(s => (s.life-=dt) > 0);
  game.floats = game.floats.filter(f => { f.life-=dt; f.y += f.vy*dt; return f.life>0; });
  game.particles = game.particles.filter(p => {
    p.life -= dt; p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 560*dt; p.rot += dt*6;
    if (p.life <= 0) { particlePool.push(p); return false; }
    return true;
  });
}
function triggerShake(amp, dir=0) { game.shake.amp = Math.max(game.shake.amp, amp); game.shake.life = .22; game.shake.x += dir*amp*.18; }
function updateShake(dt) {
  const s = game.shake;
  if (s.life > 0) {
    s.life -= dt; const f = s.life/.22;
    s.x = rand(-s.amp,s.amp)*f; s.y = rand(-s.amp,s.amp)*f; s.amp *= .92;
  } else { s.x *= .8; s.y *= .8; }
}

function getWeakRect() {
  const b = game.boss;
  const side = current大首领.world === 'office' || current大首领.world === 'commute' ? -18 : 38;
  return { x:b.x + b.w/2 + side, y:b.y + 14, w:28, h:28 };
}

function draw() {
  ctx.clearRect(0,0,960,540);
  ctx.save();
  ctx.translate(game.shake.x, game.shake.y);
  drawBg(ctx, 960, 540, game.stageWorld || current大首领.world, performance.now()/1000, game.player.x);
  drawZones();
  drawProps();
  drawTelegraphs();
  drawEnemies();
  drawPlayer();
  if (game.bossActive) draw大首领();
  drawProjectiles();
  drawHazards();
  drawSlashes();
  drawParticles();
  drawFloats();
  if (game.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${game.flash*.28})`; ctx.fillRect(0,0,960,540); }
  const hpR = game.player.hp/game.player.maxHp;
  if (hpR < .28) {
    const vg = ctx.createRadialGradient(480,270,170,480,270,560);
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,`rgba(255,90,165,${(.28-hpR)*1.4})`);
    ctx.fillStyle = vg; ctx.fillRect(0,0,960,540);
  }
  ctx.restore();
}

function drawBg(c,w,h,worldKey,t,playerX=0) {
  const world = CONTENT.worlds[worldKey] || CONTENT.worlds.office;
  const cam = (playerX-480)*.14;
  const g = c.createLinearGradient(0,0,0,h);
  g.addColorStop(0, '#10152a'); g.addColorStop(.52, rgba(world.color,.16)); g.addColorStop(1, '#0a0d15');
  c.fillStyle = g; c.fillRect(0,0,w,h);
  c.save(); c.translate(-cam*.2,0);
  for (let i=0;i<12;i++) {
    c.fillStyle = 'rgba(255,255,255,0.045)';
    const x=i*94-50, bh=110+Math.sin(i*1.4)*50;
    c.fillRect(x, 410-bh, 52, bh);
    c.fillStyle = rgba(world.accent, .16);
    for (let y=420-bh; y<390; y+=20) if ((i+y)%2) c.fillRect(x+8,y,28,6);
  }
  c.restore();
  c.save(); c.translate(-cam*.55,0);
  if (worldKey === 'office') {
    for (let i=0;i<5;i++) drawMonitor(c, 85+i*180, 318+Math.sin(t+i)*4, world.color);
    for (let i=0;i<16;i++) drawPaper(c, (t*70+i*73)%1000-30, 80+(i*31)%300, t+i);
  } else if (worldKey === 'social') {
    for (let i=0;i<8;i++) drawFeed(c, 50+i*130-(t*45%130), 80+i%3*70, i, world.color);
    for (let i=0;i<28;i++) drawLike(c, (i*47+t*90)%980, 70+(i*29)%310, i%3 ? world.accent : world.color);
  } else if (worldKey === 'family') {
    for (let i=0;i<5;i++) drawDish(c, 100+i*175, 345+Math.sin(t+i)*5, world.color, i);
    for (let i=0;i<12;i++) drawSteam(c, 90+i*75, 260+(i%3)*20, t+i);
  } else if (worldKey === 'commute') {
    for (let i=0;i<7;i++) drawLocker(c, 70+i*130, 292, world.color, i);
    c.fillStyle = rgba(world.accent,.28); for(let i=0;i<6;i++) c.fillRect(80+i*155, 250+Math.sin(t+i)*8, 70, 7);
  } else if (worldKey === 'creative') {
    for (let i=0;i<22;i++) drawNote(c, (i*59+t*38)%1000-20, 70+(i*37)%310, i%2?world.color:world.accent, t+i);
    for (let i=0;i<6;i++) drawCone(c, 90+i*160, 372, world.color);
  } else {
    for (let i=0;i<8;i++) drawClock(c, 80+i*120, 105+(i%4)*62, world.color, t+i);
  }
  c.restore();
  const fg = c.createLinearGradient(0,410,0,h);
  fg.addColorStop(0, rgba(world.color,.28)); fg.addColorStop(.06, world.floor); fg.addColorStop(1,'#080a10');
  c.fillStyle = fg; c.fillRect(0,410,w,130);
  c.fillStyle = rgba(world.accent,.72); c.fillRect(0,410,w,3);
  for (let x=0;x<w;x+=32) { c.fillStyle = x%64 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)'; c.fillRect(x, 444, 18, 3); }
}

function drawMonitor(c,x,y,color){ c.fillStyle='rgba(0,0,0,.35)'; c.fillRect(x,y,82,56); c.fillStyle=rgba(color,.24); c.fillRect(x+8,y+8,58,7); c.fillRect(x+8,y+22,38,5); c.fillStyle='rgba(255,255,255,.08)'; c.fillRect(x+26,y+58,28,9); }
function drawPaper(c,x,y,t){ c.save(); c.translate(x,y); c.rotate(Math.sin(t)*.4); c.fillStyle='rgba(255,249,235,.26)'; c.fillRect(-8,-5,16,10); c.restore(); }
function drawFeed(c,x,y,i,color){ c.fillStyle='rgba(255,255,255,.08)'; c.beginPath(); c.roundRect(x,y,88,48,8); c.fill(); c.fillStyle=rgba(color,.32); c.fillRect(x+10,y+10,42,6); c.fillRect(x+10,y+24,60,5); }
function drawLike(c,x,y,color){ c.fillStyle=rgba(color,.38); c.beginPath(); c.arc(x,y,6,0,Math.PI*2); c.fill(); c.fillStyle='rgba(255,255,255,.75)'; c.font='900 8px sans-serif'; c.textAlign='center'; c.fillText('+1',x,y+3); }
function drawDish(c,x,y,color,i){ c.fillStyle=rgba(color,.26); c.beginPath(); c.ellipse(x,y,64,18,0,0,Math.PI*2); c.fill(); c.fillStyle='rgba(255,255,255,.12)'; c.beginPath(); c.ellipse(x,y-4,44,10,0,0,Math.PI*2); c.fill(); }
function drawSteam(c,x,y,t){ c.strokeStyle='rgba(255,255,255,.16)'; c.lineWidth=3; c.beginPath(); c.moveTo(x,y); c.quadraticCurveTo(x+Math.sin(t)*16,y-22,x+6,y-44); c.stroke(); }
function drawLocker(c,x,y,color,i){ c.fillStyle=i%2?rgba(color,.22):'rgba(255,255,255,.08)'; c.beginPath(); c.roundRect(x,y,78,98,8); c.fill(); for(let r=0;r<3;r++) for(let col=0;col<2;col++){ c.strokeStyle='rgba(255,255,255,.16)'; c.strokeRect(x+8+col*30,y+12+r*25,22,16); } }
function drawNote(c,x,y,color,t){ c.save(); c.translate(x,y); c.rotate(Math.sin(t)*.25); c.fillStyle=rgba(color,.34); c.fillRect(-14,-10,28,20); c.restore(); }
function drawCone(c,x,y,color){ c.fillStyle=rgba(color,.45); c.beginPath(); c.moveTo(x,y-44); c.lineTo(x+24,y); c.lineTo(x-24,y); c.closePath(); c.fill(); c.fillStyle='rgba(255,255,255,.55)'; c.fillRect(x-12,y-22,24,6); }
function drawClock(c,x,y,color,t){ c.strokeStyle=rgba(color,.42); c.lineWidth=4; c.beginPath(); c.arc(x,y,24,0,Math.PI*2); c.stroke(); c.beginPath(); c.moveTo(x,y); c.lineTo(x+Math.cos(t)*14,y+Math.sin(t)*14); c.stroke(); }

function drawProps() {
  game.props.forEach(p => {
    if (!p.live) return;
    const bob = Math.sin(performance.now()/260+p.pulse)*3;
    ctx.save(); ctx.translate(p.x+p.w/2, p.y+p.h/2+bob);
    ctx.shadowColor = CONTENT.worlds[p.type]?.accent || CONTENT.worlds[current大首领.world].accent; ctx.shadowBlur = 12;
    drawPropIcon(p.type, p.w, p.h);
    ctx.restore();
  });
}
function drawPropIcon(type, w, h) {
  if (type === 'egg') {
    ctx.fillStyle = '#b66dff'; ctx.beginPath(); ctx.roundRect(-22,-22,44,44,14); ctx.fill();
    ctx.fillStyle = '#f4fbff'; ctx.font='950 24px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('?',0,1);
    ctx.fillStyle = '#4ee18a'; ctx.beginPath(); ctx.arc(13,-14,5,0,Math.PI*2); ctx.fill();
  } else if (type === 'office') {
    for (let i=0;i<4;i++) {
      ctx.save(); ctx.translate(-20+i*12, 8-i*8); ctx.rotate((i-1.5)*.08);
      ctx.fillStyle = i%2 ? '#e7fbff' : '#35f2ff';
      ctx.beginPath(); ctx.roundRect(-13,-8,26,16,3); ctx.fill();
      ctx.fillStyle = 'rgba(11,16,32,.35)'; ctx.fillRect(-8,-2,12,3); ctx.restore();
    }
  } else if (type === 'social') {
    ctx.fillStyle = '#ff4fd8'; ctx.beginPath(); ctx.arc(-6,-3,15,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#e7fbff'; ctx.beginPath(); ctx.arc(8,-9,8,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#101525'; ctx.beginPath(); ctx.arc(-10,-5,3,0,Math.PI*2); ctx.arc(-1,-5,3,0,Math.PI*2); ctx.fill();
  } else if (type === 'family') {
    ctx.fillStyle = '#4ee18a'; ctx.beginPath(); ctx.ellipse(0,5,31,14,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(231,251,255,.55)'; ctx.beginPath(); ctx.ellipse(0,0,23,8,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#e7fbff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-22,-15); ctx.lineTo(24,-2); ctx.moveTo(-18,-21); ctx.lineTo(28,-8); ctx.stroke();
  } else if (type === 'commute') {
    ctx.fillStyle = '#35f2ff'; ctx.beginPath(); ctx.roundRect(-24,-20,48,34,7); ctx.fill();
    ctx.fillStyle = '#101525'; ctx.fillRect(-16,-12,32,6); ctx.fillRect(-16,0,22,5);
    ctx.fillStyle = '#ff4fd8'; ctx.beginPath(); ctx.arc(17,11,5,0,Math.PI*2); ctx.fill();
  } else if (type === 'creative') {
    ctx.fillStyle = '#ff4fd8'; ctx.beginPath(); ctx.arc(0,-9,18,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#35f2ff'; ctx.fillRect(-9,7,18,12); ctx.fillStyle = '#e7fbff'; ctx.fillRect(-6,20,12,4);
  } else {
    ctx.fillStyle = '#8b5cf6'; ctx.beginPath(); ctx.roundRect(-28,-14,56,28,14); ctx.fill();
    ctx.fillStyle = '#e7fbff'; ctx.beginPath(); ctx.arc(0,0,11,0,Math.PI*2); ctx.fill();
  }
}
function drawZones() {
  game.zones.forEach(z => {
    ctx.save(); ctx.globalAlpha = Math.min(.75, z.ttl);
    ctx.fillStyle = rgba(z.color, .26); ctx.strokeStyle = rgba(z.color,.65); ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(z.x,z.y,z.w,z.h,9); ctx.fill(); ctx.stroke(); ctx.restore();
  });
}
function drawTelegraphs() {
  game.telegraphs.forEach(t => {
    const a = Math.min(.7, t.life/t.max*.8+.08);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rgba(t.color,.22); ctx.strokeStyle = t.color; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(t.x,t.y,t.w,t.h,8); ctx.fill(); ctx.stroke(); ctx.restore();
  });
}
function drawPlayer() {
  const p = game.player, t = performance.now()/1000;
  const species = speciesInfo(current大首领?.species);
  ctx.save(); ctx.translate(p.x+p.w/2, p.y+p.h/2); ctx.scale(p.facing,1);
  if (p.invuln>0) ctx.globalAlpha = .62 + Math.sin(t*42)*.25;
  if (p.hurtFlash>0) ctx.translate(Math.sin(t*80)*3,0);
  const stride = Math.abs(p.vx)>20 && p.grounded ? Math.sin(t*16) : 0;
  const attackLean = p.attackTime > 0 ? -0.14 : 0;
  ctx.rotate(attackLean);
  ctx.fillStyle='rgba(0,0,0,.36)'; ctx.beginPath(); ctx.ellipse(0,35,25,7,0,0,Math.PI*2); ctx.fill();
  if (hasEquip('overtimeCape')) {
    ctx.fillStyle='rgba(255,79,216,.76)';
    ctx.beginPath(); ctx.moveTo(-14,-9); ctx.bezierCurveTo(-46,-1,-48,30+stride*5,-10,22); ctx.lineTo(-5,-8); ctx.closePath(); ctx.fill();
  }
  if (hasEquip('jetpack')) {
    ctx.fillStyle='#8b5cf6'; ctx.beginPath(); ctx.roundRect(-21,-13,12,31,5); ctx.fill();
    ctx.fillStyle='#35f2ff'; ctx.fillRect(-18,-7,6,15);
    if (!p.grounded) { ctx.fillStyle='rgba(53,242,255,.42)'; ctx.beginPath(); ctx.moveTo(-17,18); ctx.lineTo(-31,46); ctx.lineTo(-7,39); ctx.fill(); }
  }
  if (hasEquip('potLid')) {
    ctx.fillStyle='rgba(78,225,138,.78)'; ctx.beginPath(); ctx.ellipse(-18,4,16,20,-.15,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#e7fbff'; ctx.lineWidth=3; ctx.stroke();
  }
  if (hasEquip('milkTea')) {
    ctx.fillStyle='rgba(53,242,255,.82)'; ctx.beginPath(); ctx.roundRect(-20,-4,13,29,5); ctx.fill();
    ctx.fillStyle='rgba(11,16,32,.55)'; ctx.fillRect(-18,8,9,4); ctx.fillRect(-17,18,7,4);
  }

  ctx.fillStyle = p.overclock>0 ? '#ff4fd8' : '#20283d';
  ctx.beginPath(); ctx.roundRect(-15,-17,30,38,9); ctx.fill();
  ctx.fillStyle=rgba(species.color || '#35f2ff', .26); ctx.fillRect(-12,-12,24,6);
  ctx.fillStyle='#ff4fd8'; ctx.beginPath(); ctx.roundRect(-18,-5,36,8,4); ctx.fill();

  ctx.fillStyle='#e7fbff'; ctx.beginPath(); ctx.roundRect(-16,-45,32,28,11); ctx.fill();
  ctx.fillStyle='#101525'; ctx.beginPath(); ctx.roundRect(-14,-38,28,13,6); ctx.fill();
  const visor = ctx.createLinearGradient(-13,-38,14,-25);
  visor.addColorStop(0,species.color || '#35f2ff'); visor.addColorStop(1,'#ff4fd8');
  ctx.fillStyle=visor; ctx.beginPath(); ctx.roundRect(-11,-36,22,9,5); ctx.fill();
  ctx.fillStyle='#182033'; ctx.beginPath(); ctx.moveTo(-15,-42); ctx.lineTo(-8,-55); ctx.lineTo(0,-47); ctx.lineTo(8,-56); ctx.lineTo(16,-42); ctx.closePath(); ctx.fill();
  if (current大首领?.species === 'bubble') { ctx.fillStyle='#4ee18a'; ctx.beginPath(); ctx.arc(0,-58,7,0,Math.PI*2); ctx.fill(); }
  if (current大首领?.species === 'shadow') { ctx.globalAlpha *= .92; ctx.strokeStyle='#b66dff'; ctx.lineWidth=3; ctx.strokeRect(-18,-46,36,32); }
  if (current大首领?.species === 'skater') { ctx.fillStyle='#4de0ff'; ctx.fillRect(-22,43,45,5); }
  if (current大首领?.species === 'guardian') { ctx.fillStyle='#4ee18a'; ctx.beginPath(); ctx.arc(-23,-6,9,0,Math.PI*2); ctx.fill(); }
  ctx.fillStyle='#ff4fd8'; ctx.fillRect(-3,-22,9,3);

  ctx.strokeStyle='#20283d'; ctx.lineWidth=7; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-10,-7); ctx.quadraticCurveTo(-23,4,-25,13-stride*7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10,-7); ctx.quadraticCurveTo(21,2,25,10+stride*7); ctx.stroke();
  drawWeapon(p);

  ctx.strokeStyle='#151b2b'; ctx.lineWidth=8; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-8,18); ctx.lineTo(-15,36+stride*5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8,18); ctx.lineTo(14,36-stride*5); ctx.stroke();
  ctx.fillStyle='#35f2ff'; ctx.beginPath(); ctx.roundRect(-24,34+stride*5,19,8,4); ctx.fill();
  ctx.fillStyle='#ff4fd8'; ctx.beginPath(); ctx.roundRect(4,34-stride*5,21,8,4); ctx.fill();
  drawCharms(t);
  ctx.restore();
}
function drawWeapon(p) {
  const weapon = save.equipped.weapon1;
  ctx.save(); ctx.translate(24, p.attackTime>0 ? -9 : 1); ctx.rotate(p.attackTime>0 ? -.55 : .12);
  if (weapon === 'slipper') {
    ctx.fillStyle='#ff4fd8'; ctx.beginPath(); ctx.ellipse(20,0,28,11,-.22,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.65)'; ctx.fillRect(11,-4,16,4);
  } else if (weapon === 'loudspeaker') {
    ctx.fillStyle='#35f2ff'; ctx.fillRect(0,-8,18,16); ctx.beginPath(); ctx.moveTo(18,-12); ctx.lineTo(45,-23); ctx.lineTo(45,23); ctx.lineTo(18,12); ctx.fill();
    ctx.strokeStyle='rgba(53,242,255,.55)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(48,0,12,-.5,.5); ctx.arc(51,0,20,-.5,.5); ctx.stroke();
  } else if (weapon === 'stampHammer') {
    ctx.fillStyle='#4ee18a'; ctx.beginPath(); ctx.roundRect(5,-15,38,22,6); ctx.fill();
    ctx.fillStyle='#e7fbff'; ctx.fillRect(23,6,8,32);
  } else if (weapon === 'laserPointer') {
    ctx.fillStyle='#ff4fd8'; ctx.beginPath(); ctx.roundRect(5,-6,42,12,6); ctx.fill();
    ctx.fillStyle='#35f2ff'; ctx.beginPath(); ctx.arc(48,0,6,0,Math.PI*2); ctx.fill();
  } else if (weapon === 'receiptCrossbow') {
    ctx.strokeStyle='#4ee18a'; ctx.lineWidth=7; ctx.beginPath(); ctx.arc(22,0,22,-1.1,1.1); ctx.stroke();
    ctx.fillStyle='#e7fbff'; ctx.fillRect(4,-4,48,8);
  } else if (weapon === 'dualPens') {
    ctx.strokeStyle='#35f2ff'; ctx.lineWidth=7; ctx.beginPath(); ctx.moveTo(8,-18); ctx.lineTo(42,10); ctx.stroke();
    ctx.strokeStyle='#ff4fd8'; ctx.beginPath(); ctx.moveTo(8,16); ctx.lineTo(42,-10); ctx.stroke();
  } else if (weapon === 'bubbleWand') {
    ctx.strokeStyle='#e7fbff'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(6,16); ctx.lineTo(42,-14); ctx.stroke();
    ctx.strokeStyle='#b66dff'; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(11,-17,11,0,Math.PI*2); ctx.stroke();
  } else {
    ctx.fillStyle='#e7fbff'; ctx.beginPath(); ctx.roundRect(0,-10,50,20,5); ctx.fill();
    ctx.fillStyle='#101525'; for(let i=0;i<5;i++) ctx.fillRect(6+i*8,-4,5,4);
    ctx.fillStyle='#35f2ff'; ctx.fillRect(43,-6,5,12);
  }
  ctx.restore();
}
function drawCharms(t) {
  const gadgets = [save.equipped.skill1, save.equipped.skill2].map(id=>EQUIP[id]).filter(Boolean);
  gadgets.forEach((e,i) => {
    const a = t*2 + i*Math.PI;
    ctx.save(); ctx.translate(Math.cos(a)*31, -10+Math.sin(a)*13);
    ctx.fillStyle = i ? '#b66dff' : '#4ee18a'; ctx.beginPath(); ctx.arc(0,0,9,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#081018'; ctx.font='900 9px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(e.icon,0,1);
    ctx.restore();
  });
}
function drawEnemies() {
  game.enemies.forEach(e => {
    ctx.save(); ctx.translate(e.x+e.w/2, e.y+e.h/2);
    if (e.hurt>0) ctx.scale(1.16,.86);
    ctx.fillStyle=e.color; ctx.shadowColor=e.color; ctx.shadowBlur=12;
    if (e.type==='elite') {
      ctx.beginPath(); ctx.roundRect(-e.w/2,-e.h/2,e.w,e.h,10); ctx.fill();
      ctx.fillStyle='#f4fbff'; ctx.beginPath(); ctx.arc(0,-12,15,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#111525'; ctx.beginPath(); ctx.arc(0,-12,7,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#111525'; ctx.font='900 20px sans-serif'; ctx.textAlign='center'; ctx.fillText('!',0,18);
    } else {
      ctx.beginPath(); ctx.roundRect(-e.w/2,-e.h/2+4,e.w,e.h-4,11); ctx.fill();
      ctx.fillStyle='#f4fbff'; ctx.beginPath(); ctx.arc(8,-e.h/2+3,10,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#111525'; ctx.font='900 8px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('99',8,-e.h/2+3);
      ctx.fillStyle='#111525'; ctx.beginPath(); ctx.arc(-5,0,3,0,Math.PI*2); ctx.arc(6,0,3,0,Math.PI*2); ctx.fill();
    }
    ctx.shadowBlur=0; ctx.fillStyle='rgba(0,0,0,.45)'; ctx.fillRect(-e.w/2,-e.h/2-10,e.w,4); ctx.fillStyle='#4ee18a'; ctx.fillRect(-e.w/2,-e.h/2-10,e.w*(e.hp/e.maxHp),4);
    ctx.restore();
  });
}
function draw大首领() {
  const b = game.boss, t = performance.now()/1000, color = current大首领.color;
  ctx.save(); ctx.translate(b.x+b.w/2, b.y+b.h/2);
  if (b.hurt>0) ctx.scale(1.12,.9);
  if (b.slow>0) ctx.globalAlpha=.82;
  ctx.fillStyle='rgba(0,0,0,.42)'; ctx.beginPath(); ctx.ellipse(0,70,76,12,0,0,Math.PI*2); ctx.fill();
  for (let i=0;i<4;i++){ ctx.strokeStyle=rgba(color,.12+i*.04); ctx.beginPath(); ctx.ellipse(0,-6,58+i*15,44+i*12,Math.sin(t+i)*.12,0,Math.PI*2); ctx.stroke(); }
  if (current大首领.id.includes('unread')) drawTentacles(color,t);
  if (current大首领.id.includes('dinner')) drawSteam大首领(color,t);
  const grad = ctx.createLinearGradient(-54,-62,54,64); grad.addColorStop(0,color); grad.addColorStop(1,'#272034');
  ctx.fillStyle=grad; ctx.shadowColor=color; ctx.shadowBlur=24; ctx.beginPath();
  if (current大首领.id.includes('dinner')) {
    ctx.ellipse(0,2,70,58,0,0,Math.PI*2);
  } else if (current大首领.id.includes('elevator') || current大首领.id.includes('locker')) {
    ctx.roundRect(-46,-72,92,142,10);
  } else if (current大首领.id.includes('idea')) {
    ctx.moveTo(0,-78); ctx.lineTo(66,58); ctx.lineTo(-66,58); ctx.closePath();
  } else if (current大首领.id.includes('alarm')) {
    ctx.arc(0,0,66,0,Math.PI*2);
  } else if (current大首领.id.includes('meeting')) {
    ctx.roundRect(-44,-76,88,132,44);
  } else {
    ctx.roundRect(-52,-62,104,126,20);
  }
  ctx.fill(); ctx.shadowBlur=0;
  if (current大首领.id.includes('elevator') || current大首领.id.includes('locker')) {
    ctx.fillStyle='rgba(244,251,255,.18)';
    for(let yy=-52; yy<46; yy+=28) for(let xx=-27; xx<30; xx+=28) ctx.fillRect(xx, yy, 18, 12);
  }
  if (current大首领.id.includes('alarm')) {
    ctx.strokeStyle='#f4fbff'; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-28); ctx.moveTo(0,0); ctx.lineTo(24,12); ctx.stroke();
  }
  ctx.strokeStyle='rgba(255,255,255,.24)'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='#f4fbff'; ctx.beginPath(); ctx.arc(-15,-22,17,0,Math.PI*2); ctx.arc(20,-20,15,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#111525'; ctx.beginPath(); ctx.arc(-12+Math.sin(t*2)*3,-22,7,0,Math.PI*2); ctx.arc(23+Math.sin(t*2)*3,-20,6,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#111525'; ctx.beginPath(); ctx.roundRect(-18,12,36,10,5); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.86)'; ctx.font='950 34px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(current大首领.glyph,0,37);
  ctx.strokeStyle='rgba(255,249,235,.58)'; ctx.lineWidth=8; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-50,-5); ctx.quadraticCurveTo(-88,12,-104,38+Math.sin(t*3)*10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(50,-5); ctx.quadraticCurveTo(92,10,106,36-Math.sin(t*3)*10); ctx.stroke();
  if (b.weakTimer > 0 || hasEquip('clientRadar')) {
    const wr = getWeakRect();
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = b.weakTimer>0 ? .95 : .35;
    ctx.fillStyle='#4ee18a'; ctx.shadowColor='#4ee18a'; ctx.shadowBlur=18;
    ctx.beginPath(); ctx.arc(wr.x+wr.w/2, wr.y+wr.h/2, 15+Math.sin(t*10)*3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#081018'; ctx.font='900 12px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('弱', wr.x+wr.w/2, wr.y+wr.h/2+1);
  }
  ctx.restore();
}
function drawTentacles(color,t){ ctx.strokeStyle=rgba(color,.55); ctx.lineWidth=9; for(let i=0;i<4;i++){ const side=i<2?-1:1; ctx.beginPath(); ctx.moveTo(side*38,-30+i*20); ctx.quadraticCurveTo(side*(82+Math.sin(t+i)*15), -44+i*24, side*(120+Math.sin(t*2+i)*12), -8+i*28); ctx.stroke(); } }
function drawSteam大首领(color,t){ ctx.strokeStyle=rgba('#f4fbff',.25); ctx.lineWidth=4; for(let i=0;i<4;i++){ ctx.beginPath(); ctx.moveTo(-40+i*28,-70); ctx.quadraticCurveTo(-50+i*28+Math.sin(t+i)*12,-95,-34+i*28,-120); ctx.stroke(); } }
function drawProjectiles() {
  game.projectiles.forEach(s => {
    ctx.save(); ctx.translate(s.x,s.y); ctx.rotate(Math.atan2(s.vy||0,s.vx||1));
    ctx.fillStyle=s.color; ctx.shadowColor=s.color; ctx.shadowBlur=14;
    if (s.type==='key') { ctx.beginPath(); ctx.roundRect(-10,-6,20,12,3); ctx.fill(); ctx.fillStyle='#111525'; ctx.fillRect(-4,-2,8,4); }
    else if (s.type==='note') { ctx.rotate(Math.sin(performance.now()/120)*.4); ctx.fillRect(-9,-7,18,14); }
    else if (s.type==='receipt') { ctx.fillStyle='#e7fbff'; ctx.beginPath(); ctx.roundRect(-12,-7,24,14,3); ctx.fill(); ctx.fillStyle='#111525'; ctx.fillRect(-7,-2,13,3); }
    else if (s.type==='laserDot') { ctx.fillRect(-18,-3,36,6); ctx.fillStyle='#f4fbff'; ctx.beginPath(); ctx.arc(15,0,5,0,Math.PI*2); ctx.fill(); }
    else if (s.type==='slipper') { ctx.beginPath(); ctx.ellipse(0,0,17,8,-.2,0,Math.PI*2); ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(0,0,s.r,0,Math.PI*2); ctx.fill(); ctx.fillStyle='rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(-s.r*.25,-s.r*.25,s.r*.32,0,Math.PI*2); ctx.fill(); }
    ctx.restore();
  });
}
function drawHazards() {
  game.hazards.forEach(h => {
    ctx.save(); ctx.fillStyle=rgba(h.color,.82); ctx.shadowColor=h.color; ctx.shadowBlur=16;
    if (h.type==='fall') { ctx.beginPath(); ctx.roundRect(h.x,h.y,h.w,h.h,7); ctx.fill(); ctx.fillStyle='#111525'; ctx.font='900 12px sans-serif'; ctx.textAlign='center'; ctx.fillText('!',h.x+h.w/2,h.y+31); }
    else { ctx.beginPath(); ctx.roundRect(h.x,h.y,h.w,h.h,8); ctx.fill(); }
    ctx.restore();
  });
}
function drawSlashes() {
  game.slashes.forEach(s => {
    ctx.save(); ctx.translate(s.x,s.y); ctx.scale(s.facing,1); ctx.rotate(-.18);
    ctx.globalAlpha=Math.min(1,s.life*8);
    const g=ctx.createLinearGradient(-70,0,80,0); g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(.3,s.hit?'#35f2ff':'#f4fbff'); g.addColorStop(.65,'#f4fbff'); g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(-72,-12); ctx.quadraticCurveTo(20,-42,82,-4); ctx.quadraticCurveTo(18,18,-72,13); ctx.closePath(); ctx.fill(); ctx.restore();
  });
}
function drawParticles() {
  game.particles.forEach(p => {
    ctx.save(); ctx.globalAlpha=Math.max(0,p.life/p.max); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
    ctx.fillStyle=p.color; ctx.shadowColor=p.color; ctx.shadowBlur=p.kind==='spark'?9:0;
    if (p.kind==='dash') ctx.fillRect(-p.size*2,-1,p.size*4,2);
    else if (p.kind==='confetti') ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.65);
    else ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
    ctx.restore();
  });
}
function drawFloats() {
  game.floats.forEach(f => {
    const a=f.life/f.max;
    ctx.save(); ctx.globalAlpha=Math.min(1,a*1.3); ctx.translate(f.x,f.y); ctx.scale(f.scale*(1+(1-a)*.15), f.scale*(1+(1-a)*.15));
    ctx.font='950 20px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineWidth=5; ctx.strokeStyle='rgba(0,0,0,.72)'; ctx.fillStyle=f.color;
    ctx.strokeText(String(f.text),0,0); ctx.fillText(String(f.text),0,0); ctx.restore();
  });
}

function drawMini() {
  miniCtx.clearRect(0,0,520,220);
  drawBg(miniCtx,520,220,currentTopic,miniTime,200);
  miniCtx.save(); miniCtx.scale(.55,.55); miniCtx.translate(70,185);
  miniCtx.fillStyle='#f4fbff'; miniCtx.beginPath(); miniCtx.arc(0,-44,13,0,Math.PI*2); miniCtx.fill();
  miniCtx.fillStyle='#273047'; miniCtx.beginPath(); miniCtx.roundRect(-13,-32,26,34,7); miniCtx.fill();
  miniCtx.fillStyle='#35f2ff'; miniCtx.fillRect(18,-28,44,16);
  miniCtx.restore();
  miniCtx.save(); miniCtx.scale(.55,.55); miniCtx.translate(720,175);
  miniCtx.fillStyle=CONTENT.worlds[currentTopic].color; miniCtx.shadowColor=miniCtx.fillStyle; miniCtx.shadowBlur=30; miniCtx.beginPath(); miniCtx.roundRect(-70,-80,140,140,22); miniCtx.fill();
  miniCtx.fillStyle='#f4fbff'; miniCtx.beginPath(); miniCtx.arc(-20,-35,24,0,Math.PI*2); miniCtx.arc(25,-32,22,0,Math.PI*2); miniCtx.fill();
  miniCtx.fillStyle='#111525'; miniCtx.beginPath(); miniCtx.arc(-18,-35,10,0,Math.PI*2); miniCtx.arc(27,-32,9,0,Math.PI*2); miniCtx.fill();
  miniCtx.restore();
  miniTime += .016;
  requestAnimationFrame(() => { if (currentScreen === 'intro') drawMini(); });
}

function drawPortrait() {
  if (!current大首领) return;
  const c=portraitCtx, w=340, h=400, t=portraitTime, world=CONTENT.worlds[current大首领.world];
  c.clearRect(0,0,w,h);
  const g=c.createLinearGradient(0,0,w,h); g.addColorStop(0,rgba(world.color,.34)); g.addColorStop(.58,'#111525'); g.addColorStop(1,rgba(world.accent,.22));
  c.fillStyle=g; c.fillRect(0,0,w,h);
  for(let i=0;i<18;i++) {
    c.fillStyle=i%2?rgba(world.accent,.18):rgba('#f4fbff',.14);
    c.save(); c.translate((i*53+t*35)%380-20, 60+(i*41)%270); c.rotate(Math.sin(t+i)*.3); c.fillRect(-10,-7,20,14); c.restore();
  }
  c.save(); c.translate(w/2, h*.54); c.scale(1+Math.sin(t*2)*.03,1+Math.cos(t*1.7)*.025);
  c.fillStyle='rgba(0,0,0,.34)'; c.beginPath(); c.ellipse(0,105,86,14,0,0,Math.PI*2); c.fill();
  c.fillStyle=current大首领.color; c.shadowColor=current大首领.color; c.shadowBlur=34; c.beginPath(); c.roundRect(-72,-92,144,178,26); c.fill(); c.shadowBlur=0;
  c.strokeStyle='rgba(255,255,255,.25)'; c.lineWidth=3; c.stroke();
  c.fillStyle='#f4fbff'; c.beginPath(); c.arc(-24,-38,28,0,Math.PI*2); c.arc(30,-34,25,0,Math.PI*2); c.fill();
  c.fillStyle='#111525'; c.beginPath(); c.arc(-20,-38,12,0,Math.PI*2); c.arc(34,-34,10,0,Math.PI*2); c.fill();
  c.fillStyle='#111525'; c.beginPath(); c.roundRect(-22,16,44,12,6); c.fill();
  c.fillStyle='#f4fbff'; c.font='950 54px sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(current大首领.glyph,0,58);
  c.strokeStyle='rgba(255,249,235,.58)'; c.lineWidth=10; c.lineCap='round';
  c.beginPath(); c.moveTo(-72,-10); c.quadraticCurveTo(-122,12+Math.sin(t*3)*10,-132,70); c.stroke();
  c.beginPath(); c.moveTo(72,-10); c.quadraticCurveTo(125,14-Math.sin(t*3)*10,136,68); c.stroke();
  c.restore();
  c.fillStyle='rgba(0,0,0,.42)'; c.fillRect(18,324,304,44);
  c.fillStyle='#35f2ff'; c.font='950 13px sans-serif'; c.fillText(`弱点：${current大首领.weak.slice(0,18)}...`, 32, 350);
  portraitTime += .016;
  requestAnimationFrame(() => { if (currentScreen === 'dossier') drawPortrait(); });
}

function updateLastRunBadge() {
  const last = save.history[0];
  const badge = $('#lastRunBadge');
  if (!last) { badge.classList.add('hidden'); return; }
  badge.textContent = `上次战报：${last.boss} · ${last.won?'完成教育':'下次再来'} · ${last.drop}`;
  badge.classList.remove('hidden');
}

function setCollectionTab(name='gear') {
  $$('.collection-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.collectionTab === name));
  $$('.collection-section').forEach(sec => sec.classList.toggle('active', sec.dataset.section === name));
}

function localDay(ts=Date.now()) { return new Date(ts).toLocaleDateString('zh-CN'); }

function dailyGoals() {
  const today = localDay();
  const recent = save.history.filter(h => localDay(h.at) === today);
  const chapterKeys = Object.keys(CONTENT.chapters);
  const dailyChapter = chapterKeys[hashText(today) % chapterKeys.length];
  const chapter = chapterInfo(dailyChapter);
  const todayCombo = recent.reduce((m,h) => Math.max(m, h.combo || 0), 0);
  return [
    {name:'今日接力小关', desc:`用「${chapter.short}」完成一次 5 站路线`, done:recent.some(h => h.won && h.chapter === dailyChapter), progress:recent.some(h => h.chapter === dailyChapter) ? '已挑战' : '未挑战'},
    {name:'连击开胃菜', desc:'今天任意一局打到 20 连击', done:todayCombo >= 20, progress:`今日最高 ${todayCombo}`},
    {name:'晒图触发器', desc:'复制一次战报文案或下载图片后发给朋友', done:(save.stats.shares || 0) > 0, progress:`累计复制 ${save.stats.shares || 0}`},
    {name:'装备收纳癖', desc:'收集 12 件装备，解锁杂物间馆长成就', done:save.unlocked.length >= 12, progress:`${save.unlocked.length}/12`},
  ];
}

function renderUniverse() {
  $('#stat大首领es').textContent = save.stats.bosses;
  $('#statDamage').textContent = save.stats.damage;
  $('#statCombo').textContent = save.stats.bestCombo;
  $('#statTea').textContent = `${save.unlocked.length}/${CONTENT.equipment.length}`;
  $('#statTea').nextElementSibling.textContent = '装备收集进度';

  const activeRec = recommendedIds(selectedChapterId());
  $('#gearCount').textContent = `${save.unlocked.length}/${CONTENT.equipment.length}`;
  $('#equipmentGrid').innerHTML = [...CONTENT.equipment]
    .sort((a,b) => Number(activeRec.includes(b.id)) - Number(activeRec.includes(a.id)) || Number(save.unlocked.includes(b.id)) - Number(save.unlocked.includes(a.id)) || a.slot.localeCompare(b.slot))
    .map(e => {
      const on = save.unlocked.includes(e.id);
      const hot = activeRec.includes(e.id);
      const slot = e.slot === 'weapon' ? '武器' : '技能';
      return `<article class="collect-card gear-collect ${on?'':'locked'} ${hot?'chapter-collect':''}">
        ${gearArtHtml(e)}
        <strong>${slot} · ${e.name}${hot ? '<span class="gear-note">当前关</span>' : ''}</strong>
        <div class="stat-icons">${statGlyphs(e)}</div>
        <small>${on ? effectShort(e, true) : `未解锁 · ${e.source}`}</small>
      </article>`;
    }).join('');

  const chapterEntries = Object.entries(CONTENT.chapters);
  $('#chapterCount').textContent = `${chapterEntries.filter(([id]) => save.chapterWins[id]).length}/${chapterEntries.length}`;
  $('#chapterGrid').innerHTML = chapterEntries.map(([id,ch]) => {
    const wins = save.chapterWins[id] || 0;
    const rec = recommendedIds(id).map(eid => EQUIP[eid]?.short || EQUIP[eid]?.name).filter(Boolean).slice(0, 5).join('、');
    const mini = ch.route.map((r,i) => `<span><b>${i+1}. ${r.label}</b><em>${r.recommend}</em></span>`).join('');
    return `<article class="collect-card chapter-collect ${wins?'':'locked'}">
      <strong style="color:${ch.color}">${ch.name}</strong>
      <small>${ch.need} · ${wins ? `已通关 ${wins} 次` : '等待首次通关'}</small>
      <div class="chapter-progress">${ch.route.map((_,i) => `<span class="chapter-dot ${wins || i === 0 ? 'on' : ''}"></span>`).join('')}</div>
      <small>推荐装备：${rec}</small>
      <div class="mini-route">${mini}</div>
    </article>`;
  }).join('');

  $('#achievementCount').textContent = `${save.achievements.length}/${CONTENT.achievements.length}`;
  $('#achievementGrid').innerHTML = CONTENT.achievements.map(a => {
    const on = save.achievements.includes(a.id);
    return `<article class="collect-card achievement ${on?'unlocked':'locked'}">
      <strong>${on?'✓':'?'} ${a.name}</strong>
      <small>${a.desc}</small>
      <small>${on ? a.reward : '奖励待拿'}</small>
    </article>`;
  }).join('');

  const known大首领es = CONTENT.bosses.filter(b => save.codex[b.id]);
  $('#monsterCount').textContent = `${known大首领es.length}/${CONTENT.bosses.length}`;
  $('#monsterGrid').innerHTML = CONTENT.bosses.map(b => {
    const item = save.codex[b.id];
    const world = CONTENT.worlds[b.world];
    const bossName = escapeHtml(item?.name || b.name);
    const wins = Number.isFinite(Number(item?.wins)) ? Math.max(0, Math.floor(Number(item.wins))) : 0;
    return `<article class="collect-card ${item?'':'locked'}">
      <strong style="color:${b.color}">${escapeHtml(b.glyph)} ${bossName}</strong>
      <small>${escapeHtml(world.name)} · ${item ? `胜场 ${wins}` : '等待登记'}</small>
      <small>${escapeHtml(b.title)}</small>
    </article>`;
  }).join('');

  const goals = dailyGoals();
  const eggs = [
    {name:'撤回键彩蛋', desc:'任意路线中砸开彩蛋道具', done:(save.stats.eggs || 0) >= 1, progress:`${save.stats.eggs || 0}/1`},
    {name:'彩蛋连击账本', desc:'累计发现 5 个彩蛋', done:(save.stats.eggs || 0) >= 5, progress:`${save.stats.eggs || 0}/5`},
    {name:'怪兽海报接力', desc:'累计生成 3 份历史战报', done:(save.history.length || 0) >= 3, progress:`${save.history.length || 0}/3`},
  ];
  $('#eggCount').textContent = `${goals.filter(g => g.done).length}/${goals.length} 今日 · ${save.stats.eggs || 0} 彩蛋`;
  $('#eggGrid').innerHTML = [
    ...goals.map(g => `<article class="collect-card goal ${g.done?'chapter-collect':''}"><strong>${g.done?'✓':'○'} ${g.name}</strong><small>${g.desc}</small><small>${g.progress}</small></article>`),
    ...eggs.map(g => `<article class="collect-card egg ${g.done?'chapter-collect':'locked'}"><strong>${g.done?'✓':'?'} ${g.name}</strong><small>${g.desc}</small><small>${g.progress}</small></article>`),
  ].join('');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function shortDate(value) {
  if (!value) return '暂无';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '暂无' : d.toLocaleString('zh-CN', { month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
}
const CSRF_COOKIE = 'bv_csrf';
function getCookie(name) {
  return document.cookie.split(';').map(item => item.trim()).find(item => item.startsWith(`${name}=`))?.slice(name.length + 1) || '';
}
async function ensureCsrfToken() {
  const existing = getCookie(CSRF_COOKIE);
  if (existing) return existing;
  try {
    const res = await fetch('/api/auth/me', { credentials:'same-origin' });
    await res.json().catch(() => ({}));
  } catch(e) {}
  return getCookie(CSRF_COOKIE);
}
async function apiFetch(path, options={}) {
  const method = (options.method || 'GET').toUpperCase();
  const init = { credentials:'same-origin', ...options };
  init.headers = { ...(options.body ? {'Content-Type':'application/json'} : {}), ...(options.headers || {}) };
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrf = getCookie(CSRF_COOKIE) || await ensureCsrfToken();
    if (csrf) init.headers['X-CSRF-Token'] = csrf;
  }
  if (options.body && typeof options.body !== 'string') init.body = JSON.stringify(options.body);
  const res = await fetch(path, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `请求失败 ${res.status}`);
  return data;
}
function setAccountMessage(id, text='', error=false) {
  const el = $(id);
  if (!el) return;
  el.textContent = text;
  el.classList.toggle('error', !!error);
}
function scheduleCloudSave() {
  if (!accountState?.user) return;
  clearTimeout(accountState.saveTimer);
  accountState.saveTimer = setTimeout(() => uploadCloudSave('云存档已自动同步', true), 1200);
}
function updateAccountNav() {
  const btn = $('#accountNavBtn');
  if (!btn) return;
  btn.textContent = accountState.user ? `账号 · ${accountState.user.displayName}` : '账号';
}
async function loadAccount() {
  try {
    const data = await apiFetch('/api/auth/me');
    accountState.available = true;
    accountState.ready = true;
    accountState.user = data.user;
    updateAccountNav();
    renderAccount();
    if (accountState.user?.role === 'admin') fetchAdminAccounts();
  } catch(e) {
    accountState.available = false;
    accountState.ready = true;
    accountState.user = null;
    updateAccountNav();
    renderAccount('账号服务未连接，当前仍可游客游玩');
  }
}
function renderAccount(message='') {
  const logged = !!accountState.user;
  $('#authPanel').classList.toggle('hidden', logged || !accountState.available);
  $('#accountPanel').classList.toggle('hidden', !logged);
  $('#adminPanel').classList.toggle('hidden', !logged || accountState.user?.role !== 'admin');
  $$('.account-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.authMode === accountState.authMode));
  $('#loginForm').classList.toggle('hidden', accountState.authMode !== 'login');
  $('#registerForm').classList.toggle('hidden', accountState.authMode !== 'register');
  const status = !accountState.available
    ? '账号服务未连接，当前为游客模式'
    : logged
      ? `已登录：${accountState.user.displayName}（${accountState.user.username}）`
      : '未登录：可注册账号或继续游客模式';
  $('#accountStatus').textContent = message || status;
  if (!logged) return;
  $('#accountTitle').textContent = `${accountState.user.displayName} · ${accountState.user.username}`;
  $('#accountRole').textContent = accountState.user.role === 'admin' ? '管理员' : '玩家';
  $('#accountSaveState').textContent = accountState.user.hasCloudSave ? '已同步' : '未上传';
  $('#accountLastLogin').textContent = shortDate(accountState.user.lastLoginAt);
  $('#profileDisplayName').value = accountState.user.displayName || '';
}
async function submitLogin(e) {
  e.preventDefault();
  setAccountMessage('#loginMessage', '登录中...');
  try {
    const data = await apiFetch('/api/auth/login', { method:'POST', body:{
      username: $('#loginUsername').value,
      password: $('#loginPassword').value,
    }});
    accountState.user = data.user;
    updateAccountNav();
    renderAccount(data.cloudSave ? '已登录，发现云存档，可按需拉取' : '已登录，当前存档可上传到账号');
    setAccountMessage('#loginMessage', '');
    if (!data.user.hasCloudSave) uploadCloudSave('当前存档已绑定到账号', true);
    if (data.user.role === 'admin') fetchAdminAccounts();
  } catch(err) {
    setAccountMessage('#loginMessage', err.message, true);
  }
}
async function submitRegister(e) {
  e.preventDefault();
  setAccountMessage('#registerMessage', '创建中...');
  try {
    const data = await apiFetch('/api/auth/register', { method:'POST', body:{
      username: $('#registerUsername').value,
      displayName: $('#registerDisplayName').value,
      password: $('#registerPassword').value,
    }});
    accountState.user = data.user;
    updateAccountNav();
    renderAccount(data.firstAdmin ? '首个账号已成为管理员' : '账号已创建');
    setAccountMessage('#registerMessage', '');
    uploadCloudSave('当前存档已绑定到账号', true);
    if (data.user.role === 'admin') fetchAdminAccounts();
  } catch(err) {
    setAccountMessage('#registerMessage', err.message, true);
  }
}
async function logoutAccount() {
  try { await apiFetch('/api/auth/logout', { method:'POST' }); } catch(e) {}
  accountState.user = null;
  accountState.accounts = [];
  updateAccountNav();
  renderAccount('已退出账号，当前为游客模式');
}
async function saveProfile(e) {
  e.preventDefault();
  setAccountMessage('#accountMessage', '保存中...');
  try {
    const data = await apiFetch('/api/account/profile', { method:'PUT', body:{ displayName: $('#profileDisplayName').value }});
    accountState.user = data.user;
    updateAccountNav();
    renderAccount('资料已保存');
    setAccountMessage('#accountMessage', '资料已保存');
  } catch(err) {
    setAccountMessage('#accountMessage', err.message, true);
  }
}
async function changePassword(e) {
  e.preventDefault();
  setAccountMessage('#passwordMessage', '修改中...');
  try {
    await apiFetch('/api/account/password', { method:'PUT', body:{
      currentPassword: $('#currentPassword').value,
      newPassword: $('#newPassword').value,
    }});
    $('#currentPassword').value = '';
    $('#newPassword').value = '';
    setAccountMessage('#passwordMessage', '密码已修改');
  } catch(err) {
    setAccountMessage('#passwordMessage', err.message, true);
  }
}
async function uploadCloudSave(message='云存档已上传', quiet=false) {
  if (!accountState.user) return;
  if (!quiet) setAccountMessage('#accountMessage', '上传中...');
  try {
    const data = await apiFetch('/api/save', { method:'PUT', body:{ save }});
    accountState.user.hasCloudSave = true;
    accountState.user.saveUpdatedAt = data.saveUpdatedAt;
    renderAccount(message);
    if (!quiet) setAccountMessage('#accountMessage', message);
  } catch(err) {
    if (!quiet) setAccountMessage('#accountMessage', err.message, true);
  }
}
async function loadCloudSave() {
  if (!accountState.user) return;
  setAccountMessage('#accountMessage', '拉取中...');
  try {
    const data = await apiFetch('/api/save');
    if (!data.save) {
      setAccountMessage('#accountMessage', '这个账号还没有云存档', true);
      return;
    }
    save = normalizeSave(data.save);
    saveNow({ sync:false });
    renderUniverse();
    renderAccount('云存档已载入本机');
    updateLastRunBadge();
    setAccountMessage('#accountMessage', '云存档已载入本机');
  } catch(err) {
    setAccountMessage('#accountMessage', err.message, true);
  }
}
async function fetchAdminAccounts(message='') {
  if (accountState.user?.role !== 'admin') return;
  try {
    const data = await apiFetch('/api/admin/accounts');
    accountState.accounts = data.accounts || [];
    renderAdminAccounts();
    if (message) $('#accountStatus').textContent = message;
  } catch(err) {
    $('#adminAccountList').innerHTML = `<div class="account-message error">${escapeHtml(err.message)}</div>`;
  }
}
function renderAdminAccounts() {
  const me = accountState.user?.id;
  const list = accountState.accounts || [];
  $('#adminAccountList').innerHTML = list.map(acc => {
    const isSelf = acc.id === me;
    const active = acc.status === 'active';
    const admin = acc.role === 'admin';
    return `<article class="account-row">
      <div>
        <strong>${escapeHtml(acc.displayName)} <span class="hud-num">@${escapeHtml(acc.username)}</span></strong>
        <small>创建 ${shortDate(acc.createdAt)} · 最近登录 ${shortDate(acc.lastLoginAt)} · 存档 ${Math.round((acc.saveBytes || 0) / 1024)} KB</small>
        <div class="account-badges">
          <span class="role-badge">${admin ? 'ADMIN' : 'PLAYER'}</span>
          <span class="status-badge ${active ? '' : 'disabled'}">${active ? 'ACTIVE' : 'DISABLED'}</span>
        </div>
      </div>
      <div class="account-row-actions">
        <button class="btn small ghost" data-admin-action="role" data-account-id="${acc.id}" ${isSelf ? 'disabled' : ''}>${admin ? '设为玩家' : '设为管理员'}</button>
        <button class="btn small ghost" data-admin-action="status" data-account-id="${acc.id}" ${isSelf ? 'disabled' : ''}>${active ? '停用' : '启用'}</button>
      </div>
    </article>`;
  }).join('') || '<div class="account-message">暂无账号</div>';
  $$('#adminAccountList [data-admin-action]').forEach(btn => btn.addEventListener('click', handleAdminAction));
}
async function handleAdminAction(e) {
  const btn = e.currentTarget;
  const id = btn.dataset.accountId;
  const acc = accountState.accounts.find(item => item.id === id);
  if (!acc) return;
  const patch = btn.dataset.adminAction === 'role'
    ? { role: acc.role === 'admin' ? 'player' : 'admin' }
    : { status: acc.status === 'active' ? 'disabled' : 'active' };
  btn.disabled = true;
  try {
    await apiFetch(`/api/admin/accounts/${id}`, { method:'PATCH', body:patch });
    await fetchAdminAccounts('账号管理已更新');
  } catch(err) {
    $('#accountStatus').textContent = err.message;
    btn.disabled = false;
  }
}

function downloadCard() {
  const card = document.createElement('canvas');
  card.width = 1080; card.height = 1440;
  const c = card.getContext('2d');
  const world = CONTENT.worlds[current大首领.world];
  const g = c.createLinearGradient(0,0,1080,1440);
  g.addColorStop(0,'#141a2f'); g.addColorStop(.45,rgba(world.color,.45)); g.addColorStop(1,'#0b1018');
  c.fillStyle=g; c.fillRect(0,0,1080,1440);
  c.fillStyle='rgba(255,255,255,.06)';
  for(let y=0;y<1440;y+=28) c.fillRect(0,y,1080,1);
  c.strokeStyle=rgba('#35f2ff',.72); c.lineWidth=6; c.strokeRect(66,66,948,1308);
  c.fillStyle='#35f2ff'; c.font='950 36px sans-serif'; c.fillText('今日小烦恼海报战报', 96, 132);
  c.fillStyle='#f4fbff'; c.font='950 76px sans-serif'; wrapText(c, current大首领.displayName, 96, 250, 880, 86);
  c.fillStyle=world.color; c.beginPath(); c.roundRect(170,470,740,300,36); c.fill();
  c.fillStyle='#f4fbff'; c.font='950 122px sans-serif'; c.textAlign='center'; c.fillText(current大首领.glyph, 540, 660); c.textAlign='left';
  c.fillStyle='rgba(0,0,0,.28)'; c.beginPath(); c.roundRect(96,840,888,150,22); c.fill();
  c.fillStyle='#f4fbff'; c.font='950 38px monospace';
  c.fillText($('#shareDamage').textContent, 130, 920);
  c.fillText($('#shareTime').textContent, 430, 920);
  c.fillText($('#shareCombo').textContent, 650, 920);
  c.fillStyle='#4ee18a'; c.font='950 44px sans-serif'; wrapText(c, $('#shareDrop').textContent, 96, 1090, 870, 52);
  c.fillStyle='#f4fbff'; c.font='800 32px sans-serif'; wrapText(c, $('#shareQuote').textContent, 96, 1190, 870, 44);
  c.fillStyle='#35f2ff'; c.font='950 34px monospace'; c.fillText($('#shareCode').textContent, 96, 1320);
  const a = document.createElement('a');
  a.href = card.toDataURL('image/png');
  a.download = `${current大首领.posterNo}-小烦恼战报.png`;
  a.click();
  save.stats.shares = (save.stats.shares || 0) + 1;
  saveNow();
}
function wrapText(c, text, x, y, maxWidth, lineHeight) {
  let line = '', yy = y;
  for (const ch of text) {
    const test = line + ch;
    if (c.measureText(test).width > maxWidth && line) { c.fillText(line, x, yy); line = ch; yy += lineHeight; }
    else line = test;
  }
  if (line) c.fillText(line, x, yy);
}

function bindEvents() {
  $$('[data-nav]').forEach(btn => btn.addEventListener('click', () => screenTo(btn.dataset.nav)));
  $$('#topicChips .chip').forEach(chip => chip.addEventListener('click', () => {
    $$('#topicChips .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active'); currentTopic = chip.dataset.topic;
    if (currentScreen === 'intro') { miniTime = 0; drawMini(); }
  }));
  $$('#presetChips [data-preset]').forEach(btn => btn.addEventListener('click', () => applyPreset(btn.dataset.preset)));
  $('#chapterSelect').addEventListener('change', () => {
    $$('#presetChips [data-preset]').forEach(btn => btn.classList.toggle('active', CONTENT.presets[btn.dataset.preset]?.chapter === selectedChapterId()));
    if (currentScreen === 'dossier') renderLoadout();
    renderUniverse();
  });
  $$('#collectionTabs [data-collection-tab]').forEach(btn => btn.addEventListener('click', () => setCollectionTab(btn.dataset.collectionTab)));
  $('#rantInput').addEventListener('input', () => $('#rantCounter').textContent = `${$('#rantInput').value.length}/180`);
  $('#generateBtn').addEventListener('click', () => { ensureAudio(); make大首领(); });
  $('#regenBtn').addEventListener('click', () => { ensureAudio(); make大首领(); });
  $('#enterBattleBtn').addEventListener('click', initBattle);
  $('#againBtn').addEventListener('click', () => screenTo('intro'));
  $('#copyBtn').addEventListener('click', async () => {
    const txt = $('#shareText').value;
    try { await navigator.clipboard.writeText(txt); } catch(e) { $('#shareText').select(); document.execCommand('copy'); }
    save.stats.shares = (save.stats.shares || 0) + 1; saveNow();
    $('#copyBtn').textContent = '已复制';
    setTimeout(() => $('#copyBtn').textContent = '复制文案', 1200);
  });
  $('#downloadCardBtn').addEventListener('click', downloadCard);
  $$('.account-tab').forEach(tab => tab.addEventListener('click', () => {
    accountState.authMode = tab.dataset.authMode;
    renderAccount();
  }));
  $('#loginForm').addEventListener('submit', submitLogin);
  $('#registerForm').addEventListener('submit', submitRegister);
  $('#logoutBtn').addEventListener('click', logoutAccount);
  $('#profileForm').addEventListener('submit', saveProfile);
  $('#passwordForm').addEventListener('submit', changePassword);
  $('#uploadSaveBtn').addEventListener('click', () => uploadCloudSave());
  $('#loadCloudSaveBtn').addEventListener('click', loadCloudSave);
  $('#refreshAccountsBtn').addEventListener('click', () => fetchAdminAccounts('账号列表已刷新'));

  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if ([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k)) e.preventDefault();
    if (!keys.has(k)) {
      const action = keyAction(k);
      if (action) pressed.add(action);
    }
    keys.add(k);
  });
  document.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
  $$('[data-touch]').forEach(btn => {
    const a = btn.dataset.touch;
    btn.addEventListener('pointerdown', e => { e.preventDefault(); touch.add(a); pressed.add(a); btn.setPointerCapture?.(e.pointerId); });
    btn.addEventListener('pointerup', e => { e.preventDefault(); touch.delete(a); });
    btn.addEventListener('pointercancel', () => touch.delete(a));
    btn.addEventListener('pointerleave', () => { if (a==='left'||a==='right') touch.delete(a); });
  });
  window.addEventListener('blur', () => { keys.clear(); touch.clear(); pressed.clear(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { keys.clear(); touch.clear(); pressed.clear(); }
  });
  document.addEventListener('pointerdown', ensureAudio, { once:true });
}

function applyPreset(id) {
  const preset = CONTENT.presets[id] || CONTENT.presets.melee;
  $$('#presetChips [data-preset]').forEach(btn => btn.classList.toggle('active', btn.dataset.preset === id));
  $('#rantInput').value = preset.rant;
  $('#rantCounter').textContent = `${$('#rantInput').value.length}/180`;
  $('#chapterSelect').value = preset.chapter;
  $('#difficultySelect').value = preset.difficulty;
  $('#speciesSelect').value = preset.species;
  currentTopic = preset.topic;
  $$('#topicChips .chip').forEach(c => c.classList.toggle('active', c.dataset.topic === preset.topic));
  save.equipped = {...save.equipped, ...preset.equip};
  saveNow();
  miniTime = 0;
  drawMini();
}
function keyAction(k) {
  if (k === 'j') return 'attack';
  if (k === 'k') return 'dodge';
  if (k === 'l') return 'skill';
  if (k === 'u') return 'skill1';
  if (k === 'i') return 'skill2';
  if (k === 'w' || k === ' ' || k === 'arrowup') return 'jump';
  return null;
}

function updateClock() {
  $('#clock').textContent = new Date().toLocaleTimeString('zh-CN', {hour:'2-digit', minute:'2-digit'});
}

function init() {
  updateViewportHeight();
  window.addEventListener('resize', updateViewportHeight);
  window.visualViewport?.addEventListener('resize', updateViewportHeight);
  window.visualViewport?.addEventListener('scroll', updateViewportHeight);
  $('#rantInput').value = '老板让我周末改PPT，还说只是顺手微调一下';
  $('#rantCounter').textContent = `${$('#rantInput').value.length}/180`;
  bindEvents();
  applyPreset('melee');
  updateClock(); setInterval(updateClock, 30000);
  updateLastRunBadge();
  renderUniverse();
  loadAccount();
  drawMini();
  console.log('解压大冒险已就绪');
}
init();