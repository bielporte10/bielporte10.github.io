(function () {
  "use strict";

  var SUPPORTED = ["en", "es", "ca", "fr"];
  var LABELS = { en: "English", es: "Español", ca: "Català", fr: "Français" };
  var DEFAULT_LANG = "en";
  var cache = {};

  function detectLang() {
    try {
      var saved = window.localStorage.getItem("auren-lang");
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(nav) !== -1 ? nav : DEFAULT_LANG;
  }

  function loadDict(lang) {
    // Dictionaries are loaded as plain <script> tags (window.AurenDict.<lang>) rather than
    // fetched as JSON, so this works when the page is opened directly via file:// with no server.
    if (cache[lang]) return Promise.resolve(cache[lang]);
    var dict = window.AurenDict && window.AurenDict[lang];
    if (!dict) return Promise.reject(new Error("Missing dictionary for " + lang));
    cache[lang] = dict;
    return Promise.resolve(dict);
  }

  function resolve(dict, key) {
    var parts = key.split(".");
    var node = dict;
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return null;
      node = node[parts[i]];
    }
    return typeof node === "string" ? node : null;
  }

  function apply(dict) {
    document.documentElement.setAttribute("lang", window.AurenI18n.current);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = resolve(dict, el.getAttribute("data-i18n"));
      if (value != null) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var value = resolve(dict, el.getAttribute("data-i18n-placeholder"));
      if (value != null) el.setAttribute("placeholder", value);
    });

    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var value = resolve(dict, el.getAttribute("data-i18n-title"));
      if (value != null) document.title = value;
    });

    document.querySelectorAll("[data-i18n-error-required]").forEach(function (el) {
      var value = resolve(dict, el.getAttribute("data-i18n-error-required"));
      if (value != null) el.setAttribute("data-error-required", value);
    });

    document.querySelectorAll("[data-i18n-error-email]").forEach(function (el) {
      var value = resolve(dict, el.getAttribute("data-i18n-error-email"));
      if (value != null) el.setAttribute("data-error-email", value);
    });

    var langBtnLabel = document.querySelector("[data-lang-current]");
    if (langBtnLabel) langBtnLabel.textContent = window.AurenI18n.current.toUpperCase();

    document.querySelectorAll("[data-lang-option]").forEach(function (btn) {
      var code = btn.getAttribute("data-lang-option");
      btn.setAttribute("aria-current", code === window.AurenI18n.current ? "true" : "false");
    });

    document.dispatchEvent(new CustomEvent("auren:i18n-applied", { detail: { lang: window.AurenI18n.current } }));
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    window.AurenI18n.current = lang;
    try {
      window.localStorage.setItem("auren-lang", lang);
    } catch (e) {}
    return loadDict(lang).then(apply);
  }

  window.AurenI18n = {
    supported: SUPPORTED,
    labels: LABELS,
    current: detectLang(),
    setLang: setLang,
    init: function () {
      return setLang(window.AurenI18n.current);
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    window.AurenI18n.init();

    var langBtn = document.querySelector("[data-lang-toggle]");
    var langMenu = document.querySelector("[data-lang-menu]");
    if (langBtn && langMenu) {
      langBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        langMenu.classList.toggle("open");
        langBtn.setAttribute("aria-expanded", langMenu.classList.contains("open") ? "true" : "false");
      });
      document.addEventListener("click", function () {
        langMenu.classList.remove("open");
        langBtn.setAttribute("aria-expanded", "false");
      });
      document.querySelectorAll("[data-lang-option]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          window.AurenI18n.setLang(btn.getAttribute("data-lang-option"));
          langMenu.classList.remove("open");
        });
      });
    }
  });
})();
