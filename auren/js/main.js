(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // Mobile nav toggle
    var toggle = document.querySelector("[data-nav-toggle]");
    var links = document.querySelector("[data-nav-links]");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var isOpen = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    // Active nav link
    var current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav-links] a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === current || (current === "" && href === "index.html")) {
        a.setAttribute("aria-current", "page");
      }
    });

    // Reveal-on-scroll. Elements are visible by default in CSS (no-JS safe); only once
    // JS confirms IntersectionObserver support do we hide them pending their scroll-in.
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.remove("pending");
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach(function (el) {
        el.classList.add("pending");
        io.observe(el);
      });
    }

    // Contact form (front-end only demo, no backend)
    var form = document.querySelector("[data-contact-form]");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var dict = window.AurenI18n && window.AurenI18n.current;
        var valid = true;

        form.querySelectorAll("[data-field]").forEach(function (field) {
          var input = field.querySelector("input, textarea");
          var errorEl = field.querySelector("[data-field-error]");
          var value = input.value.trim();
          var message = "";

          if (input.hasAttribute("required") && !value) {
            message = input.getAttribute("data-error-required") || "Required";
          } else if (input.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            message = input.getAttribute("data-error-email") || "Invalid email";
          }

          if (message) {
            valid = false;
            errorEl.textContent = message;
            input.setAttribute("aria-invalid", "true");
          } else {
            errorEl.textContent = "";
            input.removeAttribute("aria-invalid");
          }
        });

        if (!valid) return;

        var success = document.querySelector("[data-form-success]");
        form.classList.add("hidden");
        if (success) success.classList.add("show");
      });
    }
  });
})();
