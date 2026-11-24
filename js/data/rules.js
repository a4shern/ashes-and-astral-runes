/**
 * rules.js — 種族權重、四大職業、27點購點制、屬性調整值與道具圖鑑
 */

export const POINT_BUY_BUDGET = 27;
export const STAT_MIN = 8;
export const STAT_MAX = 15;

export const POINT_BUY_COST = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export const STATS_META = [
  { key: "str", name: "力量", en: "STR", desc: "近戰武力、破門與正面衝擊" },
  { key: "dex", name: "敏捷", en: "DEX", desc: "潛行偵察、閃避與靈巧身法" },
  { key: "con", name: "體質", en: "CON", desc: "初始 HP、抗性與硬扛傷害" },
  { key: "int", name: "智力", en: "INT", desc: "遺跡解謎、古文破譯與戰術" },
  { key: "luk", name: "幸運", en: "LUK", desc: "命運眷顧、尋寶與意外轉機" },
  { key: "cha", name: "魅力", en: "CHA", desc: "交涉議價、威嚇與靈魂共鳴" },
];

export const RANDOM_FANTASY_NAMES = [
  "艾莉亞·晨星",
  "凱爾文·灰燼",
  "賽琳娜·夜語",
  "雷歐納德·鐵誓",
  "奧莉薇亞·銀月",
  "索林·赤錘",
  "伊芙琳·星霜",
  "格雷戈里·烏鴉",
  "米拉·琥珀",
  "亞瑟·黑曜",
];

/**
 * 種族設定（權重依規格：人類 90%、矮人 3%、精靈 1%、魔族 1%）
 */
export const RACES = [
  {
    id: "human",
    name: "人類",
    weight: 90,
    displayChance: "90%",
    rarity: "常見血脈",
    tier: "common",
    emblem: "🛡️",
    desc: "遍布大陸各國的堅韌族群，憑藉不屈意志與適應力書寫歷史。",
    passiveName: "凡人之韌",
    passiveDesc: "所有屬性檢定額外獲得 +2 加值，適應任何險境。",
    hpBonus: 0,
    damageReduction: 0,
    allCheckBonus: 2,
    statCheckBonus: {},
  },
  {
    id: "dwarf",
    name: "矮人",
    weight: 3,
    displayChance: "3%",
    rarity: "稀有血脈",
    tier: "rare",
    emblem: "⛏️",
    desc: "群山鍛爐的子嗣，骨骼如玄鐵般堅實，對伏擊與傷痛極具耐性。",
    passiveName: "磐石血脈",
    passiveDesc: "初始最大 HP 額外 +4，且所有戰鬥與陷阱傷害減少 1 點。",
    hpBonus: 4,
    damageReduction: 1,
    allCheckBonus: 0,
    statCheckBonus: {},
  },
  {
    id: "elf",
    name: "精靈",
    weight: 1,
    displayChance: "1%",
    rarity: "傳說血脈",
    tier: "legend",
    emblem: "🌿",
    desc: "沐浴古代星輝的長生貴族，舉手投足間流轉著敏銳靈感與奧術親和。",
    passiveName: "星辰敏銳",
    passiveDesc: "敏捷與智力檢定額外獲得 +6 加值。",
    hpBonus: 0,
    damageReduction: 0,
    allCheckBonus: 0,
    statCheckBonus: { dex: 6, int: 6 },
  },
  {
    id: "demon",
    name: "魔族",
    weight: 1,
    displayChance: "1%",
    rarity: "傳說血脈",
    tier: "abyss",
    emblem: "🔥",
    desc: "體內流淌深淵餘燼的異界血裔，渾身散發令人敬畏的壓迫感與爆發力。",
    passiveName: "深淵契約",
    passiveDesc: "力量與魅力檢定額外獲得 +6 加值。",
    hpBonus: 2,
    damageReduction: 0,
    allCheckBonus: 0,
    statCheckBonus: { str: 6, cha: 6 },
  },
];

/**
 * 四大冒險職業
 */
export const CLASSES = [
  {
    id: "warrior",
    name: "戰士",
    emblem: "⚔️",
    baseHp: 20,
    passiveName: "鋼鐵意志",
    passiveDesc: "戰鬥與陷阱傷害額外減免 2 點；進行【力量】檢定時額外 +8。",
    damageReduction: 2,
    healBonus: 0,
    statCheckBonus: { str: 8 },
    recommendedStats: { str: 15, con: 14, dex: 13, cha: 11, luk: 10, int: 9 },
    starterItems: [
      { id: "steel_sword", qty: 1 },
      { id: "wooden_shield", qty: 1 },
      { id: "minor_potion", qty: 2 },
    ],
  },
  {
    id: "mage",
    name: "法師",
    emblem: "🔮",
    baseHp: 14,
    passiveName: "奧術洞察",
    passiveDesc: "進行【智力】與遺跡解謎檢定時額外 +10，能迅速洞悉古符文。",
    damageReduction: 0,
    healBonus: 0,
    statCheckBonus: { int: 10 },
    recommendedStats: { int: 15, con: 14, cha: 12, luk: 12, dex: 11, str: 8 },
    starterItems: [
      { id: "oak_staff", qty: 1 },
      { id: "astral_robe", qty: 1 },
      { id: "minor_potion", qty: 2 },
    ],
  },
  {
    id: "ranger",
    name: "遊俠",
    emblem: "🏹",
    baseHp: 17,
    passiveName: "荒野直覺",
    passiveDesc: "進行【敏捷】與【幸運】檢定時額外 +8，擅長反制森林伏擊。",
    damageReduction: 0,
    healBonus: 0,
    statCheckBonus: { dex: 8, luk: 8 },
    recommendedStats: { dex: 15, con: 13, luk: 13, str: 12, int: 11, cha: 9 },
    starterItems: [
      { id: "yew_bow", qty: 1 },
      { id: "hunter_cloak", qty: 1 },
      { id: "minor_potion", qty: 2 },
    ],
  },
  {
    id: "cleric",
    name: "牧師",
    emblem: "✨",
    baseHp: 17,
    passiveName: "聖光庇佑",
    passiveDesc: "飲用治療藥水時額外回復 +4 HP；進行【魅力】檢定時額外 +8。",
    damageReduction: 0,
    healBonus: 4,
    statCheckBonus: { cha: 8 },
    recommendedStats: { cha: 15, con: 14, int: 12, luk: 12, str: 11, dex: 8 },
    starterItems: [
      { id: "silver_mace", qty: 1 },
      { id: "holy_amulet", qty: 1 },
      { id: "minor_potion", qty: 3 },
    ],
  },
];

/**
 * 物品圖鑑
 */
export const ITEMS_CATALOG = {
  // 消耗品（可點擊使用回血）
  minor_potion: {
    id: "minor_potion",
    name: "初級治療藥水",
    type: "consumable",
    typeLabel: "藥水",
    icon: "🧪",
    healAmount: 8,
    desc: "散發淡淡草藥與赤紅微光的玻璃瓶，飲用後回復 8 HP。",
  },
  moonlight_elixir: {
    id: "moonlight_elixir",
    name: "月光甘露",
    type: "consumable",
    typeLabel: "珍稀藥水",
    icon: "⚗️",
    healAmount: 14,
    desc: "以銀月露水煉製的高階靈藥，飲用後回復 14 HP。",
  },

  // 初始裝備
  steel_sword: {
    id: "steel_sword",
    name: "精鋼長劍",
    type: "equipment",
    typeLabel: "裝備",
    icon: "🗡️",
    desc: "劍身銘刻簡樸血槽的制式長劍，均衡而可靠。",
  },
  wooden_shield: {
    id: "wooden_shield",
    name: "鐵箍圓盾",
    type: "equipment",
    typeLabel: "裝備",
    icon: "🛡️",
    desc: "包覆熟鐵邊緣的橡木圓盾，能擋下林間冷箭。",
  },
  oak_staff: {
    id: "oak_staff",
    name: "橡木法杖",
    type: "equipment",
    typeLabel: "裝備",
    icon: "🪄",
    desc: "頂端鑲嵌微光晶石的法杖，便於導引星辰魔力。",
  },
  astral_robe: {
    id: "astral_robe",
    name: "星紋法袍",
    type: "equipment",
    typeLabel: "裝備",
    icon: "🧥",
    desc: "織入銀線符文的深藍長袍，輕盈且隔絕陰寒。",
  },
  yew_bow: {
    id: "yew_bow",
    name: "紫杉長弓",
    type: "equipment",
    typeLabel: "裝備",
    icon: "🏹",
    desc: "張力上乘的獵手長弓，在幽影林地中格外順手。",
  },
  hunter_cloak: {
    id: "hunter_cloak",
    name: "暗影斗篷",
    type: "equipment",
    typeLabel: "裝備",
    icon: "🧣",
    desc: "深苔綠色的連帽斗篷，有助於融入迷霧與林蔭。",
  },
  silver_mace: {
    id: "silver_mace",
    name: "銀輝權杖",
    type: "equipment",
    typeLabel: "裝備",
    icon: "⚜️",
    desc: "鍍銀戰錘權杖，對邪祟與幽暗魔物具有震懾力。",
  },
  holy_amulet: {
    id: "holy_amulet",
    name: "聖徽項鍊",
    type: "equipment",
    typeLabel: "裝備",
    icon: "📿",
    desc: "垂墜於胸前的晨曦聖印，時刻散發溫暖微光。",
  },

  // 任務與探索道具
  wax_contract: {
    id: "wax_contract",
    name: "雇主火漆契約",
    type: "quest",
    typeLabel: "任務道具",
    icon: "📜",
    desc: "艾德溫親手封蠟的委託書，憑此可在回城時領取賞金。",
  },
  silver_pouch: {
    id: "silver_pouch",
    name: "沉甸銀幣袋",
    type: "loot",
    typeLabel: "戰利品",
    icon: "💰",
    desc: "裝著三十枚王國銀幣的鹿皮錢袋，叮噹作響。",
  },
  ancient_charm: {
    id: "ancient_charm",
    name: "古代星辰護符",
    type: "loot",
    typeLabel: "遺物",
    icon: "🧿",
    desc: "夾藏在委託卷軸中的精靈銀飾，觸之冰涼清神。",
  },
  iron_dagger: {
    id: "iron_dagger",
    name: "黑鐵斥候匕首",
    type: "equipment",
    typeLabel: "戰利品",
    icon: "🔪",
    desc: "從哥布林斥候手中奪來的鋒利短刃。",
  },
  runic_key: {
    id: "runic_key",
    name: "染血的符文鑰匙",
    type: "quest",
    typeLabel: "關鍵道具",
    icon: "🗝️",
    desc: "刻有精靈星紋的青銅古鑰，似乎能開啟斷星遺跡的暗門。",
  },
  star_silver_key: {
    id: "star_silver_key",
    name: "星銀鑰匙",
    type: "quest",
    typeLabel: "關鍵道具",
    icon: "🔑",
    desc: "前任冒險者遺落的星銀密鑰，對斷星遺跡大門產生共鳴。",
  },
  tablet_fragment: {
    id: "tablet_fragment",
    name: "古代石板碎片",
    type: "loot",
    typeLabel: "線索遺物",
    icon: "🪨",
    desc: "殘缺的星象碑文，記載著『熾日、寒月、碎星』的古訓。",
  },
  star_seal: {
    id: "star_seal",
    name: "星辰護佑聖印",
    type: "loot",
    typeLabel: "珍稀遺物",
    icon: "🌟",
    desc: "由解謎祭壇賜予的星輝徽章，象徵古代星靈的認可。",
  },
  mana_crystal: {
    id: "mana_crystal",
    name: "凝結魔力晶石",
    type: "loot",
    typeLabel: "戰利品",
    icon: "💎",
    desc: "從碎裂結界中凝華而成的純淨奧術結晶，價值連城。",
  },
  astral_compass: {
    id: "astral_compass",
    name: "星蝕羅盤",
    type: "quest",
    typeLabel: "核心目標",
    icon: "🧭",
    desc: "懸浮著微弱星火的古代精靈羅盤，指針永遠朝向隱秘星界。",
  },
  guardian_core: {
    id: "guardian_core",
    name: "守衛者的星核",
    type: "loot",
    typeLabel: "傳奇戰利品",
    icon: "☄️",
    desc: "黑曜石像鬼崩解後遺留的熾金魔核，蘊含驚人魔力。",
  },
  astral_gem: {
    id: "astral_gem",
    name: "星輝寶石",
    type: "loot",
    typeLabel: "傳奇戰利品",
    icon: "💠",
    desc: "祭壇穹頂鑲嵌的無瑕藍金寶石，在暗處如銀河般閃爍。",
  },
  elven_blessing: {
    id: "elven_blessing",
    name: "精靈王庭的祝福",
    type: "loot",
    typeLabel: "傳奇印記",
    icon: "👑",
    desc: "古代守衛所贈的靈魂禮讚，象徵穿越千年的高潔榮耀。",
  },
  astral_manuscript: {
    id: "astral_manuscript",
    name: "古代星紋手稿",
    type: "loot",
    typeLabel: "傳奇遺物",
    icon: "📖",
    desc: "完整記錄遺跡魔導迴路的羊皮卷，足以轟動整個法師塔。",
  },
};

/* ---------- 純函式工具 ---------- */

export function calcModifier(score) {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function calcSpentPoints(stats) {
  return Object.values(stats).reduce((sum, val) => sum + (POINT_BUY_COST[val] ?? 0), 0);
}

export function calcInitialHp(classObj, raceObj, conScore) {
  if (!classObj) return 0;
  const conMod = calcModifier(conScore);
  const raceBonus = raceObj ? raceObj.hpBonus : 0;
  return Math.max(8, classObj.baseHp + conMod + raceBonus);
}

export function getStatMeta(statKey) {
  return STATS_META.find((s) => s.key === statKey);
}

export function getRaceById(id) {
  return RACES.find((r) => r.id === id) || null;
}

export function getClassById(id) {
  return CLASSES.find((c) => c.id === id) || null;
}

/**
 * 依權重隨機抽選種族（90 : 3 : 1 : 1）
 */
export function rollWeightedRace() {
  const totalWeight = RACES.reduce((acc, r) => acc + r.weight, 0);
  let cursor = Math.random() * totalWeight;
  for (const race of RACES) {
    cursor -= race.weight;
    if (cursor <= 0) {
      return race;
    }
  }
  return RACES[0];
}
