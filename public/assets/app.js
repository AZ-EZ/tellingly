import { QUESTIONS, TRAITS, getQuestion, optionSeedCount } from "./questions.js";

const ROUND_SIZE = 5;
const STORAGE_KEY = "tellingly.v1";
const PLUS_ENTITLEMENT = "plus";
const PLUS_MONTHLY_PRODUCT_ID = "app.tellingly.plus.monthly";
const PLUS_ANNUAL_PRODUCT_ID = "app.tellingly.plus.annual";
const API_ORIGIN = "https://tellingly.zandrews77.workers.dev";
const app = document.getElementById("app");
const nativePlugins = () => window.Capacitor?.Plugins || {};

const state = {
  ready: false,
  mode: "daily",
  compare: null,
  dateKey: "",
  deck: [],
  index: 0,
  picked: null,
  result: null,
  answers: [],
  profile: loadLocal().profile || { traits: {}, days: 0, lastDate: "", streak: 0 },
  anonymousId: loadLocal().anonymousId,
  toast: "",
  sharing: false,
  final: null,
  plus: {
    configured: false,
    enabled: false,
    active: false,
    ready: false,
    offering: null,
    selectedPlan: "annual",
    open: false,
    busy: false,
    error: ""
  }
};

if (!state.anonymousId) {
  state.anonymousId = crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2);
  saveLocal();
}

init();

async function init() {
  await initRevenueCat();
  const compareToken = getCompareToken();
  if (compareToken) {
    await loadCompare(compareToken);
  } else {
    await loadDaily();
  }
  state.ready = true;
  render();
}

async function loadDaily() {
  try {
    const data = await api("/api/today");
    state.dateKey = data.dateKey;
    state.deck = data.questions;
  } catch {
    state.dateKey = todayKey();
    state.deck = dailyDeck(state.dateKey).map(toClientQuestion);
  }
}

async function loadCompare(token) {
  state.mode = "compare";
  try {
    const data = await api(`/api/share/${encodeURIComponent(token)}`);
    state.compare = data.share;
    state.dateKey = data.share.dateKey;
    state.deck = data.share.questionIds
      .map((id) => getQuestion(id))
      .filter(Boolean)
      .map(toClientQuestion);
  } catch {
    state.mode = "daily";
    showToast("That comparison link expired, so today's question is loaded.");
    await loadDaily();
  }
}

function render() {
  if (!state.ready) {
    app.innerHTML = `<div class="loading">Loading Tellingly...</div>`;
    return;
  }

  app.innerHTML = `
    ${renderTopbar()}
    ${state.final ? renderFinal() : renderQuestion()}
    ${state.plus.open ? renderPaywall() : ""}
    ${state.toast ? `<div class="toast">${esc(state.toast)}</div>` : ""}
  `;

  bindActions();
}

function renderTopbar() {
  const day = state.mode === "compare" ? "compare" : formatDay(state.dateKey);
  const streak = state.profile.streak || 1;
  return `
    <header class="topbar">
      <div class="brand"><span class="brand-mark">T</span><span>TELLINGLY</span></div>
      <div class="day-chip">${esc(day)}</div>
      ${state.plus.enabled ? `<button class="plus-chip ${state.plus.active ? "active" : ""}" data-action="plus">${state.plus.active ? "Plus" : "Try Plus"}</button>` : ""}
      <div class="streak-chip">${streak || 1} day${streak === 1 ? "" : "s"}</div>
    </header>
  `;
}

function renderQuestion() {
  const question = state.deck[state.index];
  if (!question) return `<section class="screen loading">No question found.</section>`;
  const distribution = state.result?.distribution || question.distribution || seedDistribution(question);
  const compareName = state.compare ? "You and a friend are answering the same set." : "Today";

  return `
    <section class="screen question-stage">
      <div class="mode-note">
        <span>${esc(compareName)}</span>
        ${renderProgress()}
      </div>
      <article class="question-card">
        <p class="eyebrow">question ${state.index + 1} of ${state.deck.length}</p>
        <h1 class="question-text">${esc(question.question)}</h1>
      </article>
      <div class="options">
        ${question.options.map((option) => renderOption(option, distribution)).join("")}
      </div>
      ${state.result ? renderResult(question) : ""}
    </section>
  `;
}

function renderProgress() {
  return `<div class="progress" aria-hidden="true">${state.deck
    .map((_, index) => `<i class="${index <= state.index ? "on" : ""}"></i>`)
    .join("")}</div>`;
}

function renderOption(option, distribution) {
  const picked = state.picked === option.id;
  const percent = distribution.options.find((row) => row.id === option.id)?.percent || option.seedPct || 0;
  const revealed = Boolean(state.result);
  return `
    <button class="option ${picked ? "picked" : ""}" data-action="choose" data-option="${escAttr(option.id)}" ${revealed ? "disabled" : ""}>
      <span class="option-fill" style="width:${revealed ? percent : 0}%"></span>
      <span class="option-text">${esc(option.text)}</span>
      ${revealed ? `<span class="option-pct">${percent}%</span>` : ""}
    </button>
  `;
}

function renderResult(question) {
  const chosen = question.options.find((option) => option.id === state.picked);
  const percent = state.result.distribution.options.find((row) => row.id === chosen.id)?.percent || chosen.seedPct;
  const total = state.result.distribution.total.toLocaleString();
  const nextLabel = state.index + 1 >= state.deck.length ? "See pattern" : "Next";
  return `
    <section class="result-panel">
      <div class="stat-line">
        <strong>${percent}%</strong>
        <span>among ${total} answers</span>
      </div>
      <p class="read">${esc(state.result.read)}</p>
      <button class="btn hot" data-action="next">${esc(nextLabel)} ${icon("i-arrow")}</button>
    </section>
  `;
}

function renderFinal() {
  if (state.final.type === "compare") return renderCompareFinal();
  const topTrait = TRAITS[state.final.topTrait];
  return `
    <section class="screen question-stage">
      <section class="pattern-panel">
        <div class="pattern-hero">
          <div>
            <p class="eyebrow">this week's card</p>
            <h1 class="pattern-title">${esc(topTrait?.name || "Still forming")}</h1>
            <p class="fine">${esc(topTrait?.short || "A pattern needs a few more answers before it says anything useful.")}</p>
          </div>
          <div class="rarity-score">${state.final.rarity}<small>%</small></div>
        </div>
        ${renderTraitBars(state.final.traits)}
        <p class="verdict">"${esc(state.final.verdict)}"</p>
        <div class="actions two">
          <button class="btn secondary" data-action="download">${icon("i-download")} Card</button>
          <button class="btn" data-action="share" ${state.sharing ? "disabled" : ""}>${icon("i-link")} Compare</button>
        </div>
        ${state.plus.enabled && !state.plus.active ? `<button class="btn hot full" data-action="plus">Unlock Plus</button>` : ""}
        <button class="btn secondary full" data-action="remind">${icon("i-bell")} Remind tomorrow</button>
      </section>
      ${renderShareCard()}
      <button class="btn secondary" data-action="restart">${icon("i-rotate")} Start over</button>
    </section>
  `;
}

function renderShareCard() {
  return `
    <article class="share-card" id="shareCardPreview" aria-label="Shareable Tellingly card">
      <div class="share-top">Tellingly</div>
      <div class="share-score">${state.final.rarity}<small>%</small></div>
      <p class="share-line">"${esc(state.final.verdict)}"</p>
      <div class="share-bottom">Answer today's question</div>
    </article>
  `;
}

function renderTraitBars(traits) {
  const max = Math.max(1, ...Object.values(traits));
  return `
    <div class="trait-bars">
      ${Object.entries(TRAITS)
        .map(([key, trait]) => {
          const value = traits[key] || 0;
          const width = Math.round((value / max) * 100);
          return `
            <div class="trait-row">
              <span>${esc(trait.name)}</span>
              <span class="trait-meter"><span style="width:${width}%;background:${trait.color}"></span></span>
              <span>${value}</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderCompareFinal() {
  const final = state.final;
  return `
    <section class="screen question-stage">
      <section class="compat-panel">
        <p class="eyebrow">compatibility</p>
        <div class="pattern-hero">
          <div>
            <h1 class="pattern-title">${final.score}% alike</h1>
            <p class="fine">${esc(final.line)}</p>
          </div>
          <div class="rarity-score">${final.matches}<small>/${final.total}</small></div>
        </div>
        <ul class="compat-list">
          ${final.differences.map((row) => `
            <li>
              <strong>${esc(row.question)}</strong>
              <span>You: ${esc(row.you)} · Friend: ${esc(row.friend)}</span>
            </li>
          `).join("")}
        </ul>
        <div class="actions two">
          <button class="btn secondary" data-action="download">${icon("i-download")} Card</button>
          <button class="btn hot" data-action="restart">${icon("i-rotate")} Today</button>
        </div>
      </section>
      ${renderShareCard()}
    </section>
  `;
}

function renderPaywall() {
  const monthly = getPlusPackage("monthly");
  const annual = getPlusPackage("annual");
  const selected = state.plus.selectedPlan === "monthly" ? monthly : annual;
  const monthlyPrice = priceFor(monthly, "$3.99/mo");
  const annualPrice = priceFor(annual, "$24.99/yr");
  return `
    <section class="paywall-backdrop" role="dialog" aria-modal="true" aria-label="Tellingly Plus">
      <div class="paywall">
        <button class="icon-btn paywall-close" data-action="close-paywall" aria-label="Close">${icon("i-x")}</button>
        <p class="eyebrow">Tellingly Plus</p>
        <h2>Keep the pattern, not just the moment.</h2>
        <p class="fine">Unlock the full archive, trait trends, unlimited compatibility links, comparison history, and extra question packs.</p>
        <div class="plan-grid" role="radiogroup" aria-label="Choose a Plus plan">
          <button class="plan ${state.plus.selectedPlan === "annual" ? "selected" : ""}" data-action="select-plan" data-plan="annual">
            <span>Annual</span>
            <strong>${esc(annualPrice)}</strong>
            <small>Best for the weekly card habit</small>
          </button>
          <button class="plan ${state.plus.selectedPlan === "monthly" ? "selected" : ""}" data-action="select-plan" data-plan="monthly">
            <span>Monthly</span>
            <strong>${esc(monthlyPrice)}</strong>
            <small>Easy to try</small>
          </button>
        </div>
        ${state.plus.error ? `<p class="paywall-error">${esc(state.plus.error)}</p>` : ""}
        <button class="btn hot full" data-action="purchase-plus" ${state.plus.busy || !selected ? "disabled" : ""}>
          ${state.plus.busy ? "Working..." : "Continue"}
        </button>
        <button class="restore-btn" data-action="restore-plus" ${state.plus.busy ? "disabled" : ""}>Restore Purchases</button>
      </div>
    </section>
  `;
}

function bindActions() {
  document.querySelectorAll("[data-action='choose']").forEach((button) => {
    button.addEventListener("click", () => choose(button.dataset.option));
  });
  const next = document.querySelector("[data-action='next']");
  if (next) next.addEventListener("click", goNext);
  const restart = document.querySelector("[data-action='restart']");
  if (restart) restart.addEventListener("click", restartDaily);
  const share = document.querySelector("[data-action='share']");
  if (share) share.addEventListener("click", createShareLink);
  const download = document.querySelector("[data-action='download']");
  if (download) download.addEventListener("click", downloadCard);
  const remind = document.querySelector("[data-action='remind']");
  if (remind) remind.addEventListener("click", scheduleReminder);
  document.querySelectorAll("[data-action='plus']").forEach((button) => {
    button.addEventListener("click", () => openPaywall("manual"));
  });
  const closePaywall = document.querySelector("[data-action='close-paywall']");
  if (closePaywall) closePaywall.addEventListener("click", () => {
    state.plus.open = false;
    state.plus.error = "";
    render();
  });
  document.querySelectorAll("[data-action='select-plan']").forEach((button) => {
    button.addEventListener("click", () => {
      state.plus.selectedPlan = button.dataset.plan === "monthly" ? "monthly" : "annual";
      state.plus.error = "";
      render();
    });
  });
  const purchase = document.querySelector("[data-action='purchase-plus']");
  if (purchase) purchase.addEventListener("click", purchasePlus);
  const restore = document.querySelector("[data-action='restore-plus']");
  if (restore) restore.addEventListener("click", restorePlus);
}

async function choose(optionId) {
  if (state.result) return;
  const question = state.deck[state.index];
  const option = question.options.find((row) => row.id === optionId);
  if (!option) return;

  state.picked = optionId;
  render();

  let distribution = seedDistribution(question, optionId);
  try {
    const data = await api("/api/answer", {
      method: "POST",
      body: {
        dateKey: state.dateKey,
        questionId: question.id,
        optionId,
        anonymousId: state.anonymousId
      }
    });
    distribution = data.distribution;
  } catch {
    showToast("Offline answer saved locally.");
  }

  const percent = distribution.options.find((row) => row.id === optionId)?.percent || option.seedPct;
  const read = microRead(option, percent);
  state.result = { distribution, read };
  state.answers.push({
    questionId: question.id,
    question: question.question,
    optionId,
    choice: option.text,
    percent,
    trait: option.trait || ""
  });
  render();
}

function goNext() {
  if (state.index + 1 >= state.deck.length) {
    finish();
    return;
  }
  state.index += 1;
  state.picked = null;
  state.result = null;
  render();
}

function finish() {
  const rarity = calculateRarity(state.answers);
  const traits = mergeTraits(state.answers);
  const topTrait = Object.entries(traits).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

  if (state.mode === "compare" && state.compare) {
    state.final = buildCompareFinal(rarity, traits, topTrait);
  } else {
    state.final = {
      type: "daily",
      rarity,
      traits,
      topTrait,
      verdict: verdictFor(topTrait, rarity)
    };
    saveProfile(traits);
  }
  render();
}

function buildCompareFinal(rarity, traits, topTrait) {
  const theirs = new Map(state.compare.answers.map((answer) => [answer.questionId, answer]));
  const rows = state.answers.map((answer) => {
    const friend = theirs.get(answer.questionId);
    return {
      question: answer.question,
      you: answer.choice,
      friend: friend?.choice || "unknown",
      match: friend?.optionId === answer.optionId
    };
  });
  const matches = rows.filter((row) => row.match).length;
  const total = rows.length || 1;
  const score = Math.round((matches / total) * 100);
  const differences = rows.filter((row) => !row.match).slice(0, 3);
  const line = score >= 80
    ? "Same operating system, different passwords."
    : score >= 50
      ? "You agree on instincts, then diverge on consequences."
      : "The chemistry is real because the defaults are not.";

  return {
    type: "compare",
    rarity,
    traits,
    topTrait,
    verdict: line,
    matches,
    total,
    score,
    differences: differences.length ? differences : rows.slice(0, 2),
    line
  };
}

async function createShareLink() {
  if (!state.final || state.sharing) return;
  if (shouldGateAdditionalComparison()) {
    await openPaywall("comparison");
    return;
  }
  state.sharing = true;
  render();
  try {
    const data = await api("/api/share", {
      method: "POST",
      body: {
        dateKey: state.dateKey,
        questionIds: state.deck.map((question) => question.id),
        answers: state.answers,
        profile: {
          topTrait: state.final.topTrait,
          traits: state.final.traits
        },
        verdict: state.final.verdict,
        rarity: state.final.rarity
      }
    });
    rememberShareCreated();
    await shareComparison(data.url);
  } catch {
    showToast("Could not create the link yet.");
  } finally {
    state.sharing = false;
    render();
  }
}

async function initRevenueCat() {
  const Purchases = nativePlugins().Purchases;
  const apiKey = revenueCatIosKey();
  state.plus.enabled = Boolean(isNativeIos() && Purchases && apiKey);
  if (!state.plus.enabled) return;

  try {
    await Purchases.configure({ apiKey, appUserID: state.anonymousId });
    state.plus.configured = true;
    const info = await Purchases.getCustomerInfo();
    updatePlusEntitlement(info.customerInfo);
    await loadPlusOffering();
  } catch (error) {
    state.plus.enabled = false;
    state.plus.error = friendlyPurchaseError(error);
  } finally {
    state.plus.ready = true;
  }
}

async function loadPlusOffering() {
  if (!state.plus.configured) return null;
  const Purchases = nativePlugins().Purchases;
  const offerings = await Purchases.getOfferings();
  state.plus.offering = offerings.current || offerings.all?.default || Object.values(offerings.all || {})[0] || null;
  return state.plus.offering;
}

async function openPaywall() {
  if (!state.plus.enabled) {
    showToast("Plus will be available in the iOS app.");
    return;
  }
  state.plus.open = true;
  state.plus.error = "";
  if (!state.plus.offering && state.plus.configured) {
    try {
      await loadPlusOffering();
    } catch (error) {
      state.plus.error = friendlyPurchaseError(error);
    }
  }
  render();
}

async function purchasePlus() {
  const Purchases = nativePlugins().Purchases;
  const aPackage = getPlusPackage(state.plus.selectedPlan);
  if (!Purchases || !aPackage) {
    state.plus.error = "Plus is still loading. Try again in a moment.";
    render();
    return;
  }

  state.plus.busy = true;
  state.plus.error = "";
  render();
  try {
    const result = await Purchases.purchasePackage({ aPackage });
    updatePlusEntitlement(result.customerInfo);
    state.plus.open = !state.plus.active;
    showToast(state.plus.active ? "Plus is unlocked." : "Purchase finished, but Plus is still syncing.");
  } catch (error) {
    if (!error?.userCancelled) state.plus.error = friendlyPurchaseError(error);
  } finally {
    state.plus.busy = false;
    render();
  }
}

async function restorePlus() {
  const Purchases = nativePlugins().Purchases;
  if (!Purchases) return;
  state.plus.busy = true;
  state.plus.error = "";
  render();
  try {
    const result = await Purchases.restorePurchases();
    updatePlusEntitlement(result.customerInfo);
    state.plus.open = !state.plus.active;
    showToast(state.plus.active ? "Purchases restored." : "No active Plus subscription found.");
  } catch (error) {
    state.plus.error = friendlyPurchaseError(error);
  } finally {
    state.plus.busy = false;
    render();
  }
}

function updatePlusEntitlement(customerInfo) {
  state.plus.active = Boolean(customerInfo?.entitlements?.active?.[PLUS_ENTITLEMENT]?.isActive);
}

function getPlusPackage(plan) {
  const offering = state.plus.offering;
  if (!offering) return null;
  if (plan === "monthly") return offering.monthly || offering.availablePackages?.find((row) => row.product?.identifier === PLUS_MONTHLY_PRODUCT_ID) || null;
  return offering.annual || offering.availablePackages?.find((row) => row.product?.identifier === PLUS_ANNUAL_PRODUCT_ID) || null;
}

function priceFor(aPackage, fallback) {
  const product = aPackage?.product;
  return product?.priceString || product?.localizedPriceString || product?.pricePerMonthString || fallback;
}

function shouldGateAdditionalComparison() {
  const sharesCreated = state.profile.shareLinksCreated || 0;
  return state.plus.enabled && !state.plus.active && sharesCreated >= 1;
}

function rememberShareCreated() {
  state.profile.shareLinksCreated = (state.profile.shareLinksCreated || 0) + 1;
  saveLocal();
}

function revenueCatIosKey() {
  return String(window.TELLINGLY_REVENUECAT_IOS_API_KEY || "").trim();
}

function isNativeIos() {
  return window.Capacitor?.isNativePlatform?.() && window.Capacitor?.getPlatform?.() === "ios";
}

function friendlyPurchaseError(error) {
  const message = error?.message || error?.localizedDescription || "";
  return message ? String(message) : "The store is not ready yet. Try again shortly.";
}

async function shareComparison(url) {
  const Share = nativePlugins().Share;
  if (Share?.share) {
    await Share.share({
      title: "Tellingly",
      text: "Answer today's questions with me and see where we match.",
      url,
      dialogTitle: "Compare on Tellingly"
    });
    showToast("Comparison link ready.");
    return;
  }
  await copy(url);
  showToast("Comparison link copied.");
}

async function scheduleReminder() {
  const LocalNotifications = nativePlugins().LocalNotifications;
  if (!LocalNotifications?.schedule) {
    showToast("Daily reminders are available in the iOS app.");
    return;
  }

  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== "granted") {
    showToast("Turn on notifications to get the daily question.");
    return;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  await LocalNotifications.schedule({
    notifications: [{
      id: 101,
      title: "Today's Tellingly is ready",
      body: "One sharp question. One tap. See where you land.",
      schedule: { at: tomorrow },
      sound: "default"
    }]
  });
  showToast("Reminder set for tomorrow morning.");
}

function restartDaily() {
  history.replaceState(null, "", "/");
  state.mode = "daily";
  state.compare = null;
  state.index = 0;
  state.picked = null;
  state.result = null;
  state.answers = [];
  state.final = null;
  state.ready = false;
  render();
  loadDaily().then(() => {
    state.ready = true;
    render();
  });
}

function saveProfile(traits) {
  const profile = state.profile;
  profile.traits = profile.traits || {};
  Object.entries(traits).forEach(([key, value]) => {
    profile.traits[key] = (profile.traits[key] || 0) + value;
  });
  if (profile.lastDate !== state.dateKey) {
    profile.days = (profile.days || 0) + 1;
    profile.streak = nextStreak(profile.lastDate, state.dateKey, profile.streak || 0);
    profile.lastDate = state.dateKey;
  }
  state.profile = profile;
  saveLocal();
}

function nextStreak(lastDate, currentDate, currentStreak) {
  if (!lastDate) return 1;
  const last = new Date(`${lastDate}T00:00:00Z`);
  const current = new Date(`${currentDate}T00:00:00Z`);
  const diff = Math.round((current - last) / 86400000);
  if (diff === 0) return currentStreak || 1;
  if (diff === 1) return (currentStreak || 0) + 1;
  return 1;
}

function calculateRarity(answers) {
  if (!answers.length) return 50;
  const average = answers.reduce((sum, answer) => sum + Number(answer.percent || 50), 0) / answers.length;
  return clamp(Math.round(100 - average), 2, 98);
}

function mergeTraits(answers) {
  const traits = {};
  answers.forEach((answer) => {
    if (answer.trait) traits[answer.trait] = (traits[answer.trait] || 0) + 1;
  });
  return traits;
}

function microRead(option, percent) {
  const rare = percent <= 25;
  const common = percent >= 60;
  const trait = option.trait ? TRAITS[option.trait] : null;
  if (trait && rare) return `${trait.short} Here, that instinct puts you in the narrow lane.`;
  if (trait && common) return `${trait.short} This time, most people recognized the same pressure.`;
  if (trait) return trait.short;
  if (rare) return "You chose the less available answer, which usually means the tradeoff mattered more to you than the optics.";
  return "You took the answer most people can admit to quickly, which is its own kind of honesty.";
}

function verdictFor(topTrait, rarity) {
  const lines = {
    agency: "You do not mind being wrong. You mind being decided for.",
    candor: "Honest to your own face, diplomatic when required.",
    integrity: "Your convenience has to negotiate with your conscience.",
    distance: "You are warmest when nobody is rushing the door.",
    curiosity: "You would rather carry the answer than invent one.",
    optimism: "You keep doors open longer than most people admit."
  };
  if (rarity >= 72) return "Your default setting is not the room's default.";
  return lines[topTrait] || "You answer from instinct first and edit later.";
}

function dailyDeck(dateKey) {
  const seeded = shuffleWithSeed(QUESTIONS, hashNumber(dateKey));
  return seeded.slice(0, ROUND_SIZE);
}

function seedDistribution(question) {
  const options = question.options.map((option) => ({
    id: option.id,
    count: optionSeedCount(question, option),
    percent: option.seedPct
  }));
  return { questionId: question.id, total: options.reduce((sum, row) => sum + row.count, 0), options };
}

function toClientQuestion(question, distribution) {
  return {
    id: question.id,
    question: question.question,
    seedN: question.seedN,
    options: question.options,
    distribution: distribution || seedDistribution(question)
  };
}

async function downloadCard() {
  if (!state.final) return;
  const canvas = document.createElement("canvas");
  const width = 1080;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#101116";
  ctx.fillRect(0, 0, width, height);
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "rgba(141,230,193,0.28)");
  grad.addColorStop(0.55, "rgba(255,96,70,0.22)");
  grad.addColorStop(1, "rgba(16,17,22,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#f6f0df";
  ctx.font = "800 34px Inter, sans-serif";
  ctx.letterSpacing = "8px";
  ctx.fillText("TELLINGLY", 84, 118);

  ctx.font = "700 190px Georgia, serif";
  ctx.fillText(`${state.final.rarity}`, 82, 415);
  ctx.font = "700 72px Georgia, serif";
  ctx.fillStyle = "#a6a094";
  ctx.fillText("%", 330, 405);

  ctx.fillStyle = "#ff6046";
  ctx.font = "italic 76px Georgia, serif";
  wrapCanvasText(ctx, `"${state.final.verdict}"`, 84, 625, 900, 88);

  ctx.strokeStyle = "rgba(246,240,223,0.25)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(84, 1068);
  ctx.lineTo(996, 990);
  ctx.stroke();

  ctx.fillStyle = "#8de6c1";
  ctx.font = "800 30px Inter, sans-serif";
  ctx.fillText("ANSWER TODAY'S QUESTION", 84, 1224);
  ctx.fillStyle = "#a6a094";
  ctx.font = "600 28px Inter, sans-serif";
  ctx.fillText(location.host || "tellingly.app", 84, 1284);

  const url = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = url;
  link.download = "tellingly-card.png";
  link.click();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  });
  if (line) ctx.fillText(line, x, y);
}

function getCompareToken() {
  const pathMatch = location.pathname.match(/^\/compare\/([^/]+)/);
  if (pathMatch) return pathMatch[1];
  return new URLSearchParams(location.search).get("vs");
}

async function api(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    method: options.method || "GET",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

function apiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  if (window.Capacitor?.isNativePlatform?.()) return `${API_ORIGIN}${path}`;
  return path;
}

async function copy(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  }
}

function showToast(message) {
  state.toast = message;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    state.toast = "";
    render();
  }, 2200);
}

function formatDay(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function shuffleWithSeed(items, seed) {
  const result = [...items];
  let value = seed;
  for (let index = result.length - 1; index > 0; index -= 1) {
    value = (value * 1664525 + 1013904223) >>> 0;
    const swapIndex = value % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function hashNumber(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    anonymousId: state.anonymousId,
    profile: state.profile
  }));
}

function icon(id) {
  return `<svg aria-hidden="true"><use href="#${id}"></use></svg>`;
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function escAttr(value) {
  return esc(value).replace(/`/g, "&#96;");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
