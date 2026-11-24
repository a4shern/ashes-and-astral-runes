/**
 * dice.js — 1d100 檢定與擲骰動畫彈窗系統
 * 明確判定：大成功 (100)、成功、失敗、大失敗 (1)
 */

import { calcModifier, formatModifier, getStatMeta } from "../data/rules.js";

/**
 * 計算角色在指定檢定上的所有加值明細
 */
export function computeCheckBonus(hero, check, flags) {
  const statKey = check.stat;
  const statScore = hero.stats[statKey] ?? 10;
  const statMod = calcModifier(statScore);

  const extraParts = [];
  let extraBonus = 0;

  // 職業被動加值
  const classBonus = hero.classObj.statCheckBonus?.[statKey] || 0;
  if (classBonus !== 0) {
    extraBonus += classBonus;
    extraParts.push(`${hero.classObj.passiveName} ${formatModifier(classBonus)}`);
  }

  // 種族天賦加值
  const raceAll = hero.race.allCheckBonus || 0;
  const raceStat = hero.race.statCheckBonus?.[statKey] || 0;
  const raceTotal = raceAll + raceStat;
  if (raceTotal !== 0) {
    extraBonus += raceTotal;
    extraParts.push(`${hero.race.passiveName} ${formatModifier(raceTotal)}`);
  }

  // 劇情線索旗標加值
  if (check.flagBonus && flags?.[check.flagBonus.flag]) {
    extraBonus += check.flagBonus.amount;
    extraParts.push(`${check.flagBonus.label} ${formatModifier(check.flagBonus.amount)}`);
  }

  return {
    statKey,
    statName: getStatMeta(statKey)?.name || statKey,
    statMod,
    extraBonus,
    extraLabel: extraParts.join("、"),
    totalBonus: statMod + extraBonus,
  };
}

/**
 * 根據自然擲骰 (1~100)、總和與 DC 判定四種結果
 */
export function evaluateRoll(naturalRoll, total, dc) {
  if (naturalRoll === 100) {
    return {
      key: "critSuccess",
      cssClass: "crit-success",
      label: "大成功 (100)",
      desc: "自然骰出 100！星辰眷顧，觸發最高榮耀與額外奇遇！",
    };
  }
  if (naturalRoll === 1) {
    return {
      key: "critFailure",
      cssClass: "crit-failure",
      label: "大失敗 (1)",
      desc: "自然骰出 1！厄運驟降，情勢急轉直下！",
    };
  }
  if (total >= dc) {
    return {
      key: "success",
      cssClass: "success",
      label: "成功",
      desc: `總和 ${total} 達到難度 DC ${dc}，你穩健地克服了難關！`,
    };
  }
  return {
    key: "failure",
    cssClass: "failure",
    label: "失敗",
    desc: `總和 ${total} 未達難度 DC ${dc}，行動受挫並付出了代價。`,
  };
}

/**
 * 開啟 1d100 擲骰彈窗，播放滾動動畫，等待玩家點擊確認後回傳檢定結果
 */
export function runDiceCheckModal(hero, check, flags) {
  return new Promise((resolve) => {
    const modal = document.getElementById("dice-modal");
    const modalCard = document.getElementById("dice-modal-card");
    const titleEl = document.getElementById("dice-modal-title");
    const dcTargetEl = document.getElementById("dice-dc-target");
    const polyEl = document.getElementById("dice-polyhedron");
    const numEl = document.getElementById("dice-number");
    const subLabelEl = document.getElementById("dice-sub-label");
    const breakdownEl = document.getElementById("dice-breakdown");
    const calcRollEl = document.getElementById("calc-roll");
    const calcStatLabelEl = document.getElementById("calc-stat-label");
    const calcStatModEl = document.getElementById("calc-stat-mod");
    const calcBonusRowEl = document.getElementById("calc-bonus-row");
    const calcBonusLabelEl = document.getElementById("calc-bonus-label");
    const calcBonusValEl = document.getElementById("calc-bonus-val");
    const calcDcEl = document.getElementById("calc-dc");
    const calcTotalEl = document.getElementById("calc-total");
    const verdictEl = document.getElementById("dice-verdict");
    const verdictBadgeEl = document.getElementById("verdict-badge");
    const verdictDescEl = document.getElementById("verdict-desc");
    const confirmBtn = document.getElementById("btn-dice-confirm");

    const bonusInfo = computeCheckBonus(hero, check, flags);
    const naturalRoll = Math.floor(Math.random() * 100) + 1; // 1 ~ 100
    const total = naturalRoll + bonusInfo.totalBonus;
    const verdict = evaluateRoll(naturalRoll, total, check.dc);

    // 重置彈窗狀態
    modalCard.className = "gilded-frame dice-modal-card";
    titleEl.textContent = `${bonusInfo.statName}檢定`;
    dcTargetEl.textContent = `難度目標 DC ${check.dc}`;
    subLabelEl.textContent = "1d100 命運之骰轉動中...";
    breakdownEl.classList.add("hidden");
    verdictEl.classList.add("hidden");
    confirmBtn.classList.add("hidden");
    polyEl.classList.remove("settled");
    polyEl.classList.add("rolling");

    modal.classList.remove("hidden");

    // 播放減速擲骰動畫（約 950ms）
    const steps = [45, 50, 55, 65, 75, 90, 110, 140, 180, 220];
    let stepIndex = 0;

    function tick() {
      if (stepIndex < steps.length) {
        const fakeNum = Math.floor(Math.random() * 100) + 1;
        numEl.textContent = String(fakeNum).padStart(2, "0");
        const delay = steps[stepIndex];
        stepIndex += 1;
        window.setTimeout(tick, delay);
      } else {
        // 停定於真實結果
        polyEl.classList.remove("rolling");
        polyEl.classList.add("settled");
        numEl.textContent = String(naturalRoll);
        subLabelEl.textContent = `自然骰面：${naturalRoll}（1d100）`;

        calcRollEl.textContent = String(naturalRoll);
        calcStatLabelEl.textContent = `${bonusInfo.statName}調整值`;
        calcStatModEl.textContent = formatModifier(bonusInfo.statMod);

        if (bonusInfo.extraBonus !== 0) {
          calcBonusRowEl.classList.remove("hidden");
          calcBonusLabelEl.textContent = bonusInfo.extraLabel;
          calcBonusValEl.textContent = formatModifier(bonusInfo.extraBonus);
        } else {
          calcBonusRowEl.classList.add("hidden");
        }

        calcDcEl.textContent = `DC ${check.dc}`;
        calcTotalEl.textContent = String(total);

        verdictBadgeEl.className = `verdict-badge ${verdict.cssClass}`;
        verdictBadgeEl.textContent = verdict.label;
        verdictDescEl.textContent = verdict.desc;

        if (verdict.key === "critSuccess") {
          modalCard.classList.add("result-crit-success");
        } else if (verdict.key === "critFailure") {
          modalCard.classList.add("result-crit-failure");
        }

        breakdownEl.classList.remove("hidden");
        verdictEl.classList.remove("hidden");
        confirmBtn.classList.remove("hidden");
        confirmBtn.focus();
      }
    }

    tick();

    function handleConfirm() {
      confirmBtn.removeEventListener("click", handleConfirm);
      modal.classList.add("hidden");
      resolve({
        naturalRoll,
        total,
        dc: check.dc,
        bonusInfo,
        verdict,
      });
    }

    confirmBtn.addEventListener("click", handleConfirm);
  });
}
