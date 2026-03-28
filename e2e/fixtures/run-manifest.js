/**
 * ICOIP E2E Run Manifest — single source of truth.
 * Adapted for GAS portal architecture (card-click login, no password auth).
 */
const PORTALS = {
  "00": { name: "Master Suite Demo",      url: "https://script.google.com/macros/s/AKfycbwvqQ8UlVOoXN4UVvCnRmNnVKL99Jp9t6DsBZCrDMFqErNwdP_VmcLm0ahU6dx2-hI/exec" },
  "01": { name: "Volunteer Management",   url: "https://script.google.com/macros/s/AKfycbyBtrFEkLnnlGPYRNb_GyB4puln6m_Gl7aldzscrH3OPrSbhmD6CFlBmlMTO73bEx93/exec" },
  "02": { name: "Intake & Referral",      url: "https://script.google.com/macros/s/AKfycbwOknQ1OUzbGzPITaKDfd4KPgHAyDYZa1D6RUzbt4mQwbqhKcO5sX64v0QX2Sno4oH8/exec" },
  "03": { name: "Counselling Client",     url: "https://script.google.com/macros/s/AKfycbx9g3ptENk5V4x4v7ObNEiSJHvKy1HUOs1qwWELCJwyu7A9WhU4crQ6Zhoigcj1yfWn/exec" },
  "04": { name: "Admin Portal",           url: "https://script.google.com/macros/s/AKfycbwK2t_AMjkd4k6jRptx7O9dF0Dh8HoVj6HVnlmme0C7QmO7zpP-oy891cUyTaxy4l40/exec" },
  "05": { name: "AI Training Curriculum", url: "https://script.google.com/macros/s/AKfycbzLCyX4TYykUkLYc3wRnDHobuqGaExEEJEZvcoQXrMmNb4e3u877hMMaJV81I6uE8Ke/exec" },
};

const TARGET_PORTAL = process.env.PORTAL_ID || "01";

const runManifest = {
  mode:    process.env.E2E_MODE    || "full-live",
  baseURL: process.env.BASE_URL    || PORTALS[TARGET_PORTAL].url,
  portalId: TARGET_PORTAL,
  portals:  PORTALS,
  headless: process.env.HEADED    !== "1",
  retries:  Number(process.env.E2E_RETRIES || 1),
  cleanupAfterRun: process.env.E2E_CLEANUP === "1",

  timeouts: {
    test:       120000,
    expect:      15000,
    action:      20000,
    navigation:  45000,
    auth:        90000,   // card-click login + mock response
    loading:     25000,
    shellWarm:   30000,
    shellCold:   75000,   // GAS cold start can be slow
    mockFired:   15000,   // wait for data-mock-fired sentinel
  },

  // GAS portals use card-click login — no passwords
  roles: {
    Admin:   { displayName: "Admin User",    role: "Admin",   cardText: "Admin",   permissions: ["view","create","edit","delete","workflow","upload","email","export","reset"] },
    Manager: { displayName: "Grace Tan",     role: "Manager", cardText: "Manager", permissions: ["view","create","edit","workflow","upload","email","export"] },
    Officer: { displayName: "Daniel Lee",    role: "Officer", cardText: "Officer", permissions: ["view","create","edit","workflow","upload","email","export"] },
    Viewer:  { displayName: "Client Viewer", role: "Viewer",  cardText: "Viewer",  permissions: ["view","export"] },
  },

  featureFlags: {
    mockInjection:      true,   // inject GAS mock before login
    deterministicFlow:  true,   // wait for data-mock-fired sentinel
    strictConsole:      true,
    strictRoleIsolation: true,
    seedReset:          false,  // no real backend — GAS mock handles data
  },
};

module.exports = { runManifest, PORTALS };
