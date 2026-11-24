/**
 * main.js — 應用程式入口、畫面切換、Toast 提示與背景微光餘燼粒子特效
 */

import { gameState, initAdventureFromDraft } from "./state.js";
import { initCreator, renderAllCreatorSections } from "./systems/creator.js";
import { initAdventureController, renderAdventureScreen } from "./systems/adventure.js";

function switchPhase(phase) {
  const creatorScreen = document.getElementById("creator-screen");
  const adventureScreen = document.getElementById("adventure-screen");
  const phaseIndicator = document.getElementById("phase-indicator");
  const btnRestart = document.getElementById("btn-restart-creator");

  gameState.phase = phase;

  if (phase === "adventure") {
    creatorScreen.classList.add("hidden");
    adventureScreen.classList.remove("hidden");
    phaseIndicator.textContent = "冒險進行中";
    btnRestart.classList.remove("hidden");
  } else {
    adventureScreen.classList.add("hidden");
    creatorScreen.classList.remove("hidden");
    phaseIndicator.textContent = "創角階段";
    btnRestart.classList.add("hidden");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message, variant = "") {
  const container = document.getElementById("toast-container");
  const el = document.createElement("div");
  el.className = `toast ${variant}`;
  el.textContent = message;
  container.appendChild(el);

  window.setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.25s ease";
    window.setTimeout(() => el.remove(), 260);
  }, 2600);
}

/**
 * 輕量金色餘燼微光粒子動畫
 */
function startAmbientEmbers() {
  const canvas = document.getElementById("ember-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = Array.from({ length: 34 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.9 + 0.6,
    vy: -(Math.random() * 0.35 + 0.12),
    vx: (Math.random() - 0.5) * 0.22,
    alpha: Math.random() * 0.55 + 0.15,
    phase: Math.random() * Math.PI * 2,
  }));

  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.phase) * 0.12;
      p.phase += 0.015;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const flicker = 0.65 + 0.35 * Math.sin(p.phase * 2);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 214, 134, ${p.alpha * flicker})`;
      ctx.fill();
    }
    window.requestAnimationFrame(loop);
  }

  loop();
}

document.addEventListener("DOMContentLoaded", () => {
  startAmbientEmbers();

  initAdventureController({
    onReturnToCreator: () => {
      renderAllCreatorSections();
      switchPhase("creator");
    },
    showToast,
  });

  initCreator(() => {
    initAdventureFromDraft();
    switchPhase("adventure");
    renderAdventureScreen();
    showToast(`歡迎來到鏽錨酒館，${gameState.hero.name}！`);
  });

  document.getElementById("btn-restart-creator").addEventListener("click", () => {
    renderAllCreatorSections();
    switchPhase("creator");
  });
});
