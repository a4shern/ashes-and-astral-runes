/**
 * creator.js — 創角系統（名稱、機率抽選種族、職業選擇、27點購點制與即時 HP 計算）
 */

import {
  CLASSES,
  ITEMS_CATALOG,
  POINT_BUY_BUDGET,
  POINT_BUY_COST,
  RACES,
  RANDOM_FANTASY_NAMES,
  STAT_MAX,
  STAT_MIN,
  STATS_META,
  calcInitialHp,
  calcModifier,
  calcSpentPoints,
  formatModifier,
  rollWeightedRace,
} from "../data/rules.js";
import { gameState } from "../state.js";

let isRollingRace = false;

export function initCreator(onStartAdventure) {
  const nameInput = document.getElementById("char-name");
  const btnRandomName = document.getElementById("btn-random-name");
  const btnRollRace = document.getElementById("btn-roll-race");
  const btnRandomClass = document.getElementById("btn-random-class");
  const btnRecommended = document.getElementById("btn-recommended-stats");
  const btnRandomStats = document.getElementById("btn-random-stats");
  const btnResetStats = document.getElementById("btn-reset-stats");
  const btnStart = document.getElementById("btn-start-adventure");

  // 預設選擇第一個職業，讓玩家立即看到完整互動與即時 HP 計算
  if (!gameState.draft.classObj) {
    gameState.draft.classObj = CLASSES[0];
  }

  nameInput.addEventListener("input", () => {
    gameState.draft.name = nameInput.value;
    hideError();
  });

  btnRandomName.addEventListener("click", () => {
    const pick = RANDOM_FANTASY_NAMES[Math.floor(Math.random() * RANDOM_FANTASY_NAMES.length)];
    nameInput.value = pick;
    gameState.draft.name = pick;
    hideError();
  });

  btnRollRace.addEventListener("click", () => {
    if (isRollingRace) return;
    animateRaceRoll();
  });

  btnRandomClass.addEventListener("click", () => {
    const pick = CLASSES[Math.floor(Math.random() * CLASSES.length)];
    gameState.draft.classObj = pick;
    renderClassCards();
    renderPreview();
    hideError();
  });

  btnRecommended.addEventListener("click", () => {
    const cls = gameState.draft.classObj || CLASSES[0];
    gameState.draft.stats = { ...cls.recommendedStats };
    renderStatsAllocator();
    renderPreview();
    hideError();
  });

  btnRandomStats.addEventListener("click", () => {
    gameState.draft.stats = generateRandomPointBuyStats();
    renderStatsAllocator();
    renderPreview();
    hideError();
  });

  btnResetStats.addEventListener("click", () => {
    gameState.draft.stats = { str: 8, dex: 8, con: 8, int: 8, luk: 8, cha: 8 };
    renderStatsAllocator();
    renderPreview();
    hideError();
  });

  btnStart.addEventListener("click", () => {
    const err = validateDraft();
    if (err) {
      showError(err);
      return;
    }
    hideError();
    onStartAdventure();
  });

  renderAllCreatorSections();
}

export function renderAllCreatorSections() {
  const nameInput = document.getElementById("char-name");
  nameInput.value = gameState.draft.name;
  renderRaceCard(gameState.draft.race);
  renderClassCards();
  renderStatsAllocator();
  renderPreview();
}

function animateRaceRoll() {
  isRollingRace = true;
  const card = document.getElementById("race-result-card");
  const emblemEl = document.getElementById("race-emblem");
  const nameEl = document.getElementById("race-name");
  const rarityEl = document.getElementById("race-rarity");
  const descEl = document.getElementById("race-desc");
  const traitEl = document.getElementById("race-trait");

  card.className = "race-result-card rolling";
  traitEl.classList.add("hidden");

  const finalRace = rollWeightedRace();
  let ticks = 0;
  const maxTicks = 10;

  const timer = window.setInterval(() => {
    const sample = RACES[ticks % RACES.length];
    emblemEl.textContent = sample.emblem;
    nameEl.textContent = sample.name;
    rarityEl.textContent = "命運轉動中...";
    descEl.textContent = "星盤正在喚醒你的先天血脈...";
    ticks += 1;

    if (ticks >= maxTicks) {
      window.clearInterval(timer);
      gameState.draft.race = finalRace;
      renderRaceCard(finalRace);
      renderPreview();
      hideError();
      isRollingRace = false;
    }
  }, 65);
}

function renderRaceCard(race) {
  const card = document.getElementById("race-result-card");
  const emblemEl = document.getElementById("race-emblem");
  const nameEl = document.getElementById("race-name");
  const rarityEl = document.getElementById("race-rarity");
  const descEl = document.getElementById("race-desc");
  const traitEl = document.getElementById("race-trait");

  card.className = "race-result-card";
  if (!race) {
    emblemEl.textContent = "?";
    nameEl.textContent = "尚未抽選";
    rarityEl.textContent = "點擊「命運抽選種族」";
    descEl.textContent = "依權重隨機決定血脈：人類 90%、矮人 3%、精靈 1%、魔族 1%。";
    traitEl.classList.add("hidden");
    return;
  }

  card.classList.add(`tier-${race.tier}`);
  emblemEl.textContent = race.emblem;
  nameEl.textContent = race.name;
  rarityEl.textContent = `${race.rarity} · ${race.displayChance}`;
  descEl.textContent = race.desc;
  traitEl.textContent = `✦ 種族天賦【${race.passiveName}】：${race.passiveDesc}`;
  traitEl.classList.remove("hidden");
}

function renderClassCards() {
  const grid = document.getElementById("class-grid");
  grid.innerHTML = "";

  for (const cls of CLASSES) {
    const isSelected = gameState.draft.classObj?.id === cls.id;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `class-card${isSelected ? " selected" : ""}`;
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", String(isSelected));
    btn.innerHTML = `
      <div class="class-card-top">
        <span class="class-name"><span>${cls.emblem}</span>${cls.name}</span>
        <span class="class-hp-tag">基礎 HP ${cls.baseHp}</span>
      </div>
      <p class="class-passive-line"><strong>${cls.passiveName}：</strong>${cls.passiveDesc}</p>
    `;
    btn.addEventListener("click", () => {
      gameState.draft.classObj = cls;
      renderClassCards();
      renderPreview();
      hideError();
    });
    grid.appendChild(btn);
  }
}

function renderStatsAllocator() {
  const container = document.getElementById("stats-allocator");
  const remainingEl = document.getElementById("points-remaining");
  const badgeEl = document.getElementById("points-badge");

  const stats = gameState.draft.stats;
  const spent = calcSpentPoints(stats);
  const remaining = POINT_BUY_BUDGET - spent;

  remainingEl.textContent = String(remaining);
  badgeEl.classList.toggle("complete", remaining === 0);

  container.innerHTML = "";

  for (const meta of STATS_META) {
    const score = stats[meta.key];
    const mod = calcModifier(score);
    const modClass = mod > 0 ? "pos" : mod < 0 ? "neg" : "";

    const canDec = score > STAT_MIN;
    const nextCostDelta =
      score < STAT_MAX ? POINT_BUY_COST[score + 1] - POINT_BUY_COST[score] : Infinity;
    const canInc = score < STAT_MAX && remaining >= nextCostDelta;

    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `
      <div class="stat-name-col">
        <span class="stat-label-main">${meta.name} <small style="color:var(--text-muted);font-weight:500;">${meta.en}</small></span>
        <span class="stat-label-sub">${meta.desc}</span>
      </div>
      <div class="stat-controls">
        <button type="button" class="stepper-btn" data-action="dec" ${canDec ? "" : "disabled"} aria-label="降低${meta.name}">−</button>
        <span class="stat-score">${score}</span>
        <button type="button" class="stepper-btn" data-action="inc" ${canInc ? "" : "disabled"} title="${score < STAT_MAX ? `升至 ${score + 1} 需消耗 ${nextCostDelta} 點` : "已達上限"}" aria-label="提升${meta.name}">+</button>
      </div>
      <div class="stat-mod-pill ${modClass}" title="屬性調整值">${formatModifier(mod)}</div>
    `;

    row.querySelector('[data-action="dec"]').addEventListener("click", () => {
      if (stats[meta.key] > STAT_MIN) {
        stats[meta.key] -= 1;
        renderStatsAllocator();
        renderPreview();
      }
    });

    row.querySelector('[data-action="inc"]').addEventListener("click", () => {
      const cur = stats[meta.key];
      if (cur < STAT_MAX) {
        const delta = POINT_BUY_COST[cur + 1] - POINT_BUY_COST[cur];
        if (POINT_BUY_BUDGET - calcSpentPoints(stats) >= delta) {
          stats[meta.key] += 1;
          renderStatsAllocator();
          renderPreview();
        }
      }
    });

    container.appendChild(row);
  }
}

function renderPreview() {
  const hpEl = document.getElementById("preview-hp");
  const formulaEl = document.getElementById("preview-hp-formula");
  const gearListEl = document.getElementById("preview-gear");

  const cls = gameState.draft.classObj;
  const race = gameState.draft.race;
  const conScore = gameState.draft.stats.con;
  const conMod = calcModifier(conScore);

  if (!cls) {
    hpEl.textContent = "--";
    formulaEl.textContent = "請選擇冒險職業";
    gearListEl.innerHTML = "<li>選擇職業後顯示初始裝備</li>";
    return;
  }

  const totalHp = calcInitialHp(cls, race, conScore);
  hpEl.textContent = `${totalHp} HP`;

  const racePart = race && race.hpBonus > 0 ? ` + ${race.name} ${race.hpBonus}` : "";
  formulaEl.textContent = `職業基礎 ${cls.baseHp} ${conMod >= 0 ? `+ 體質 ${conMod}` : `- 體質 ${Math.abs(conMod)}`}${racePart}`;

  gearListEl.innerHTML = cls.starterItems
    .map((entry) => {
      const item = ITEMS_CATALOG[entry.id];
      return `<li>${item.icon} ${item.name} ×${entry.qty}</li>`;
    })
    .join("");
}

/**
 * 隨機產生合法的 27 點購點分配
 */
function generateRandomPointBuyStats() {
  const stats = { str: 8, dex: 8, con: 8, int: 8, luk: 8, cha: 8 };
  const keys = Object.keys(stats);
  let remaining = POINT_BUY_BUDGET;
  let guard = 0;

  while (remaining > 0 && guard < 200) {
    guard += 1;
    const candidates = keys.filter((k) => {
      const cur = stats[k];
      if (cur >= STAT_MAX) return false;
      const cost = POINT_BUY_COST[cur + 1] - POINT_BUY_COST[cur];
      return cost <= remaining;
    });
    if (candidates.length === 0) break;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const cost = POINT_BUY_COST[stats[pick] + 1] - POINT_BUY_COST[stats[pick]];
    stats[pick] += 1;
    remaining -= cost;
  }

  return stats;
}

function validateDraft() {
  if (!gameState.draft.name.trim()) {
    return "請先輸入冒險者姓名（或點擊「隨機命名」）。";
  }
  if (!gameState.draft.race) {
    return "請先點擊「命運抽選種族」決定你的出身血脈。";
  }
  if (!gameState.draft.classObj) {
    return "請選擇一個冒險職業。";
  }
  const remaining = POINT_BUY_BUDGET - calcSpentPoints(gameState.draft.stats);
  if (remaining > 0) {
    return `你還有 ${remaining} 點屬性購點尚未分配，請分配完畢或點擊「依職業推薦」。`;
  }
  return null;
}

function showError(msg) {
  const el = document.getElementById("creator-error");
  el.textContent = msg;
  el.classList.remove("hidden");
}

function hideError() {
  const el = document.getElementById("creator-error");
  el.classList.add("hidden");
}
