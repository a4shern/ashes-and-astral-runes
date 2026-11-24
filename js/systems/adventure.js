/**
 * adventure.js — 三欄式冒險介面渲染、劇情推進、戰鬥扣血與背包藥水互動
 */

import {
  ITEMS_CATALOG,
  STATS_META,
  calcModifier,
  formatModifier,
  getStatMeta,
} from "../data/rules.js";
import { SCENARIO_NODES } from "../data/scenario.js";
import {
  addItemToInventory,
  addLog,
  applyDamage,
  applyHeal,
  consumeItem,
  gameState,
  hasAnyItem,
  initAdventureFromDraft,
} from "../state.js";
import { computeCheckBonus, runDiceCheckModal } from "./dice.js";

let isTransitioning = false;
let onReturnToCreatorCb = null;
let showToastCb = null;

export function initAdventureController({ onReturnToCreator, showToast }) {
  onReturnToCreatorCb = onReturnToCreator;
  showToastCb = showToast;
}

export function renderAdventureScreen() {
  renderHeroHud();
  renderCurrentScene();
  renderInventory();
  renderAdventureLog();
}

/* ==================== 左欄：角色狀態卡 ==================== */
export function renderHeroHud() {
  const hero = gameState.hero;
  if (!hero) return;

  document.getElementById("hud-crest").textContent = hero.classObj.emblem;
  document.getElementById("hud-name").textContent = hero.name;
  document.getElementById("hud-race").textContent = `${hero.race.emblem} ${hero.race.name}`;
  document.getElementById("hud-class").textContent = hero.classObj.name;

  // HP 血條
  const hpPercent = Math.max(0, Math.min(100, (hero.hp / hero.maxHp) * 100));
  document.getElementById("hud-hp-text").textContent = `${hero.hp} / ${hero.maxHp}`;
  const hpBar = document.getElementById("hud-hp-bar");
  hpBar.style.width = `${hpPercent}%`;
  hpBar.classList.toggle("low", hpPercent <= 35);

  // 六大屬性網格
  const statsGrid = document.getElementById("hud-stats-grid");
  statsGrid.innerHTML = STATS_META.map((meta) => {
    const score = hero.stats[meta.key];
    const mod = calcModifier(score);
    const modCls = mod > 0 ? "pos" : mod < 0 ? "neg" : "";
    return `
      <div class="hud-stat-tile" title="${meta.desc}">
        <span class="hud-stat-name">${meta.name}</span>
        <span class="hud-stat-nums">
          <span class="hud-stat-val">${score}</span>
          <span class="hud-stat-mod ${modCls}">(${formatModifier(mod)})</span>
        </span>
      </div>
    `;
  }).join("");

  // 職業被動與種族天賦
  document.getElementById("hud-class-passive").innerHTML = `
    <span class="passive-title">⚔ 職業被動 · ${hero.classObj.passiveName}</span>
    <p class="passive-desc">${hero.classObj.passiveDesc}</p>
  `;

  document.getElementById("hud-race-passive").innerHTML = `
    <span class="passive-title">${hero.race.emblem} 種族天賦 · ${hero.race.passiveName}</span>
    <p class="passive-desc">${hero.race.passiveDesc}</p>
  `;
}

function triggerHpFeedback(type, amount) {
  if (!amount) return;
  const section = document.getElementById("hud-hp-section");
  const floatBox = document.getElementById("hp-float-container");

  section.classList.remove("damage-shake", "heal-glow");
  void section.offsetWidth;
  section.classList.add(type === "dmg" ? "damage-shake" : "heal-glow");

  const floater = document.createElement("span");
  floater.className = `hp-float ${type}`;
  floater.textContent = type === "dmg" ? `-${amount} HP` : `+${amount} HP`;
  floatBox.appendChild(floater);

  window.setTimeout(() => {
    floater.remove();
    section.classList.remove("damage-shake", "heal-glow");
  }, 1150);
}

/* ==================== 中欄：主劇情顯示與互動選項 ==================== */
function renderCurrentScene() {
  const node = SCENARIO_NODES[gameState.currentNodeId];
  if (!node) return;

  document.getElementById("scene-chapter").textContent = node.chapter;
  document.getElementById("scene-location").textContent = `📍 ${node.location}`;
  document.getElementById("scene-title").textContent = node.title;

  // 上一步檢定或行動結果橫幅
  const outcomeBanner = document.getElementById("outcome-banner");
  if (gameState.lastOutcome) {
    const out = gameState.lastOutcome;
    outcomeBanner.className = `outcome-banner ${out.cssClass || ""}`;
    outcomeBanner.innerHTML = `
      <div class="outcome-banner-head">
        <span>${out.title}</span>
        ${out.diceSummary ? `<small style="opacity:0.85;">${out.diceSummary}</small>` : ""}
      </div>
      <div>${out.text}</div>
    `;
    outcomeBanner.classList.remove("hidden");
  } else {
    outcomeBanner.classList.add("hidden");
  }

  // 線索提示條
  const clueBanner = document.getElementById("clue-banner");
  if (node.clueFlag && gameState.flags[node.clueFlag]) {
    clueBanner.textContent = node.clueText;
    clueBanner.classList.remove("hidden");
  } else {
    clueBanner.classList.add("hidden");
  }

  // 主劇情段落
  const storyBody = document.getElementById("story-body");
  let html = node.paragraphs.map((p) => `<p>${p}</p>`).join("");
  if (node.quote) {
    html += `<blockquote class="story-quote">${node.quote}</blockquote>`;
  }

  // 結局統計摘要卡
  if (node.isEnding) {
    const hero = gameState.hero;
    html += `
      <div class="ending-summary-card">
        <strong>📜 冒險結算摘要</strong>
        <div class="ending-summary-grid">
          <div class="ending-stat">
            <strong>${hero.hp} / ${hero.maxHp}</strong>
            <span>最終剩餘 HP</span>
          </div>
          <div class="ending-stat">
            <strong>${gameState.statsTracker.rollsCount} 次</strong>
            <span>命運檢定次數</span>
          </div>
          <div class="ending-stat">
            <strong>${gameState.inventory.reduce((s, i) => s + i.qty, 0)} 件</strong>
            <span>背包持有物品</span>
          </div>
        </div>
      </div>
    `;
  }

  storyBody.innerHTML = html;

  // 選項渲染
  const choicesLabel = document.getElementById("choices-label");
  const choicesList = document.getElementById("choices-list");
  choicesList.innerHTML = "";

  if (node.isEnding) {
    choicesLabel.textContent = "命運終章";
    const replayBtn = document.createElement("button");
    replayBtn.type = "button";
    replayBtn.className = "choice-btn special-choice";
    replayBtn.innerHTML = `
      <div class="choice-top-row">
        <span class="choice-label">↺ 以同一角色重新挑戰《斷星遺跡的委託》</span>
        <span class="check-badge item-badge">保留角色重玩</span>
      </div>
      <div class="choice-sub"><span>回到鏽錨酒館，嘗試不同檢定分支與結局</span></div>
    `;
    replayBtn.addEventListener("click", () => {
      initAdventureFromDraft();
      renderAdventureScreen();
      showToastCb?.("已重返鏽錨酒館，命運之輪重新轉動！", "warn");
    });

    const newCharBtn = document.createElement("button");
    newCharBtn.type = "button";
    newCharBtn.className = "choice-btn";
    newCharBtn.innerHTML = `
      <div class="choice-top-row">
        <span class="choice-label">✦ 返回創角畫面，鑄造全新冒險者</span>
        <span class="check-badge story-badge">重新創角</span>
      </div>
      <div class="choice-sub"><span>重新抽取種族、切換職業與配點</span></div>
    `;
    newCharBtn.addEventListener("click", () => {
      onReturnToCreatorCb?.();
    });

    choicesList.appendChild(replayBtn);
    choicesList.appendChild(newCharBtn);
    return;
  }

  choicesLabel.textContent = "抉擇時刻";

  for (const choice of node.choices) {
    // 若此選項需要特定道具，檢查背包
    if (choice.requiresAnyItem && !hasAnyItem(choice.requiresAnyItem)) {
      continue;
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `choice-btn${choice.special ? " special-choice" : ""}`;

    let badgeHtml = `<span class="check-badge story-badge">無需檢定</span>`;
    let modHintHtml = "";

    if (choice.check) {
      const statName = getStatMeta(choice.check.stat)?.name || choice.check.stat;
      const bonusInfo = computeCheckBonus(gameState.hero, choice.check, gameState.flags);
      badgeHtml = `<span class="check-badge">[${statName}檢定 DC ${choice.check.dc}]</span>`;
      modHintHtml = `<span class="choice-mod-hint">1d100 ${formatModifier(bonusInfo.totalBonus)}（調整值 ${formatModifier(bonusInfo.statMod)}${bonusInfo.extraBonus ? ` + 加值 ${formatModifier(bonusInfo.extraBonus)}` : ""}）</span>`;
    } else if (choice.special) {
      badgeHtml = `<span class="check-badge item-badge">關鍵道具解鎖</span>`;
    }

    btn.innerHTML = `
      <div class="choice-top-row">
        <span class="choice-label">${choice.label}</span>
        ${badgeHtml}
      </div>
      <div class="choice-sub">
        <span>${choice.sub || ""}</span>
        ${modHintHtml}
      </div>
    `;

    btn.addEventListener("click", () => handleChoiceSelected(choice));
    choicesList.appendChild(btn);
  }
}

async function handleChoiceSelected(choice) {
  if (isTransitioning) return;
  isTransitioning = true;

  try {
    gameState.turnCount += 1;

    // 無檢定直接推進
    if (!choice.check && choice.directOutcome) {
      applyOutcome(choice.directOutcome, {
        title: "📜 行動結果",
        cssClass: "success",
        diceSummary: "",
      });
      return;
    }

    // 執行 1d100 檢定彈窗
    const result = await runDiceCheckModal(gameState.hero, choice.check, gameState.flags);
    gameState.statsTracker.rollsCount += 1;

    const diceSummary = `1d100(${result.naturalRoll}) ${formatModifier(result.bonusInfo.totalBonus)} = ${result.total} vs DC ${result.dc}`;
    addLog(
      "dice",
      `[${result.bonusInfo.statName}檢定 DC ${result.dc}] 擲出 ${result.naturalRoll} ${formatModifier(result.bonusInfo.totalBonus)} = ${result.total} → 【${result.verdict.label}】`
    );

    const outcome = choice.outcomes[result.verdict.key];
    applyOutcome(outcome, {
      title: `🎲 ${result.bonusInfo.statName}檢定：${result.verdict.label}`,
      cssClass: result.verdict.cssClass,
      diceSummary,
    });
  } finally {
    isTransitioning = false;
  }
}

function applyOutcome(outcome, bannerMeta) {
  let damageTaken = 0;
  let healed = 0;

  if (outcome.damage) {
    const dmgRes = applyDamage(outcome.damage);
    damageTaken = dmgRes.actual;
  }

  if (outcome.heal) {
    healed = applyHeal(outcome.heal, "遺跡星光祝福");
  }

  if (outcome.addItems) {
    for (const item of outcome.addItems) {
      addItemToInventory(item.id, item.qty);
    }
  }

  if (outcome.setFlags) {
    Object.assign(gameState.flags, outcome.setFlags);
  }

  gameState.lastOutcome = {
    ...bannerMeta,
    text: outcome.text,
  };

  // 若生命值歸零，直接轉入隕落結局
  if (gameState.hero.hp <= 0) {
    gameState.currentNodeId = "ending_death";
    addLog("damage", `${gameState.hero.name} 傷重不支倒下，旅途戛然而止。`);
  } else {
    gameState.currentNodeId = outcome.nextNode;
    const nextNode = SCENARIO_NODES[outcome.nextNode];
    if (nextNode) {
      addLog("story", `進入節點：${nextNode.title}（${nextNode.location}）`);
    }
  }

  renderAdventureScreen();

  if (damageTaken > 0) {
    triggerHpFeedback("dmg", damageTaken);
  } else if (healed > 0) {
    triggerHpFeedback("heal", healed);
  }

  // 捲動回中欄頂部方便閱讀新劇情
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==================== 右欄：背包物品欄 ==================== */
export function renderInventory() {
  const listEl = document.getElementById("inventory-list");
  const countEl = document.getElementById("inv-count");
  const hero = gameState.hero;
  const node = SCENARIO_NODES[gameState.currentNodeId];
  const isDeadOrEnded = Boolean(node?.isEnding);

  const totalCount = gameState.inventory.reduce((sum, i) => sum + i.qty, 0);
  countEl.textContent = String(totalCount);

  if (gameState.inventory.length === 0) {
    listEl.innerHTML = `<p class="muted-text" style="text-align:center;padding:12px 0;">背包空空如也。</p>`;
    return;
  }

  listEl.innerHTML = "";

  // 藥水排在最上方方便快速使用
  const sorted = [...gameState.inventory].sort((a, b) => {
    const typeOrder = { consumable: 0, quest: 1, equipment: 2, loot: 3 };
    const ta = ITEMS_CATALOG[a.id]?.type || "loot";
    const tb = ITEMS_CATALOG[b.id]?.type || "loot";
    return (typeOrder[ta] ?? 9) - (typeOrder[tb] ?? 9);
  });

  for (const entry of sorted) {
    const meta = ITEMS_CATALOG[entry.id];
    if (!meta) continue;

    const row = document.createElement("div");
    row.className = `inv-item ${meta.type}`;

    let actionHtml = "";
    if (meta.type === "consumable" && meta.healAmount) {
      const fullHp = hero.hp >= hero.maxHp;
      const healTotal = meta.healAmount + (hero.classObj.healBonus || 0);
      const disabled = fullHp || isDeadOrEnded;
      const titleText = isDeadOrEnded
        ? "冒險已結束"
        : fullHp
          ? "生命值已滿，無需飲用"
          : `點擊飲用回復 ${healTotal} HP`;

      actionHtml = `
        <button type="button" class="btn-use-potion" data-use="${meta.id}" ${disabled ? "disabled" : ""} title="${titleText}">
          飲用 +${healTotal}
        </button>
      `;
    }

    row.innerHTML = `
      <div class="inv-left">
        <span class="inv-icon">${meta.icon}</span>
        <div class="inv-meta">
          <div class="inv-name-row">
            <span class="inv-name">${meta.name}</span>
            <span class="inv-qty">×${entry.qty}</span>
            <span class="inv-type-tag">${meta.typeLabel}</span>
          </div>
          <p class="inv-desc">${meta.desc}</p>
        </div>
      </div>
      ${actionHtml}
    `;

    const useBtn = row.querySelector("[data-use]");
    if (useBtn) {
      useBtn.addEventListener("click", () => handleUsePotion(meta));
    }

    listEl.appendChild(row);
  }
}

function handleUsePotion(itemMeta) {
  const hero = gameState.hero;
  if (!hero || hero.hp <= 0 || hero.hp >= hero.maxHp) return;

  if (!consumeItem(itemMeta.id)) return;

  const bonus = hero.classObj.healBonus || 0;
  const totalHeal = itemMeta.healAmount + bonus;
  const label = bonus > 0 ? `飲用 ${itemMeta.name}（含${hero.classObj.passiveName} +${bonus}）` : `飲用 ${itemMeta.name}`;
  const gained = applyHeal(totalHeal, label);

  gameState.statsTracker.potionsUsed += 1;

  renderHeroHud();
  renderInventory();
  renderAdventureLog();
  triggerHpFeedback("heal", gained);
  showToastCb?.(`${itemMeta.icon} 飲用「${itemMeta.name}」，回復 ${gained} HP！`, "heal");
}

/* ==================== 右欄：冒險日誌 ==================== */
export function renderAdventureLog() {
  const logEl = document.getElementById("adventure-log");
  if (gameState.logs.length === 0) {
    logEl.innerHTML = `<p class="muted-text" style="text-align:center;">尚無冒險記錄。</p>`;
    return;
  }

  logEl.innerHTML = gameState.logs
    .map(
      (entry) => `
      <div class="log-entry type-${entry.type}">
        <span class="log-meta">第 ${entry.turn} 回合</span>
        <div>${entry.text}</div>
      </div>
    `
    )
    .join("");
}
