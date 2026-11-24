/**
 * state.js — 集中式遊戲狀態管理
 */

import { calcInitialHp, ITEMS_CATALOG } from "./data/rules.js";

export const gameState = {
  phase: "creator", // "creator" | "adventure"

  // 創角草稿狀態
  draft: {
    name: "",
    race: null,
    classObj: null,
    stats: {
      str: 8,
      dex: 8,
      con: 8,
      int: 8,
      luk: 8,
      cha: 8,
    },
  },

  // 冒險進行中狀態
  hero: null,
  inventory: [], // [{ id, qty }]
  logs: [], // [{ turn, type, text }]
  flags: {}, // { knowsRuneHint: true, ... }
  currentNodeId: "tavern_intro",
  lastOutcome: null, // { tier, title, text, diceSummary }
  turnCount: 0,
  statsTracker: {
    rollsCount: 0,
    potionsUsed: 0,
    totalDamageTaken: 0,
  },
};

/**
 * 依據創角草稿初始化新冒險
 */
export function initAdventureFromDraft() {
  const { name, race, classObj, stats } = gameState.draft;
  const maxHp = calcInitialHp(classObj, race, stats.con);

  gameState.phase = "adventure";
  gameState.hero = {
    name: name.trim(),
    race,
    classObj,
    stats: { ...stats },
    hp: maxHp,
    maxHp,
  };

  gameState.inventory = classObj.starterItems.map((entry) => ({
    id: entry.id,
    qty: entry.qty,
  }));

  gameState.logs = [];
  gameState.flags = {};
  gameState.currentNodeId = "tavern_intro";
  gameState.lastOutcome = null;
  gameState.turnCount = 1;
  gameState.statsTracker = {
    rollsCount: 0,
    potionsUsed: 0,
    totalDamageTaken: 0,
  };

  addLog("story", `${gameState.hero.name}（${race.name}·${classObj.name}）踏入鏽錨酒館，初始生命值 ${maxHp} HP。`);
}

export function addLog(type, text) {
  gameState.logs.unshift({
    turn: gameState.turnCount,
    type, // "story" | "dice" | "damage" | "heal" | "item"
    text,
  });
}

export function addItemToInventory(itemId, qty = 1) {
  const itemMeta = ITEMS_CATALOG[itemId];
  if (!itemMeta) return;

  const existing = gameState.inventory.find((entry) => entry.id === itemId);
  if (existing) {
    existing.qty += qty;
  } else {
    gameState.inventory.push({ id: itemId, qty });
  }
  addLog("item", `獲得道具：${itemMeta.icon} ${itemMeta.name} ×${qty}`);
}

export function hasAnyItem(itemIds = []) {
  return itemIds.some((id) =>
    gameState.inventory.some((entry) => entry.id === id && entry.qty > 0)
  );
}

export function consumeItem(itemId) {
  const idx = gameState.inventory.findIndex((entry) => entry.id === itemId);
  if (idx === -1) return false;
  gameState.inventory[idx].qty -= 1;
  if (gameState.inventory[idx].qty <= 0) {
    gameState.inventory.splice(idx, 1);
  }
  return true;
}

/**
 * 計算實際承受傷害（套用職業與種族減傷）
 */
export function applyDamage(rawDamage) {
  if (!gameState.hero || rawDamage <= 0) return { actual: 0, reduced: 0 };
  const classRed = gameState.hero.classObj.damageReduction || 0;
  const raceRed = gameState.hero.race.damageReduction || 0;
  const totalRed = classRed + raceRed;
  const actual = Math.max(1, rawDamage - totalRed);
  const reduced = Math.max(0, rawDamage - actual);

  gameState.hero.hp = Math.max(0, gameState.hero.hp - actual);
  gameState.statsTracker.totalDamageTaken += actual;

  const redNote = reduced > 0 ? `（被動減免 ${reduced}）` : "";
  addLog("damage", `受到 ${actual} 點傷害${redNote}，剩餘 HP：${gameState.hero.hp}/${gameState.hero.maxHp}。`);

  return { actual, reduced };
}

/**
 * 回復生命值
 */
export function applyHeal(amount, sourceLabel = "回復") {
  if (!gameState.hero || amount <= 0) return 0;
  const before = gameState.hero.hp;
  gameState.hero.hp = Math.min(gameState.hero.maxHp, gameState.hero.hp + amount);
  const gained = gameState.hero.hp - before;
  if (gained > 0) {
    addLog("heal", `${sourceLabel}：回復 ${gained} HP，目前 HP：${gameState.hero.hp}/${gameState.hero.maxHp}。`);
  }
  return gained;
}
