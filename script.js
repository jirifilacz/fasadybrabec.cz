(function () {
  "use strict";

  var CONTACT_EMAIL = "fasadybrabec@seznam.cz";

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");

  function closeMenu() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Otevřít menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Logo -> scroll to the very top (anchor jump is unreliable with sticky header)
  var logo = document.querySelector('.logo[href^="#"]');
  if (logo) {
    logo.addEventListener("click", function (e) {
      e.preventDefault();
      if (toggle && nav) closeMenu();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    });
  }

  // Header shadow on scroll
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form -> opens e-mail client with prefilled message
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = form.querySelector(".form-status");

  function setStatus(text, type) {
    status.textContent = text;
    status.className = "form-status" + (type ? " " + type : "");
  }

  function markField(input, valid) {
    input.closest(".field").classList.toggle("invalid", !valid);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.elements.name;
    var phone = form.elements.phone;
    var email = form.elements.email;
    var message = form.elements.message;
    var type = form.elements.type;

    var phoneOk = /^[+\d][\d\s]{8,}$/.test(phone.value.trim());
    var emailOk = email.value.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    var checks = [
      [name, name.value.trim().length > 1],
      [phone, phoneOk],
      [email, emailOk],
      [message, message.value.trim().length > 2]
    ];

    var firstInvalid = null;
    checks.forEach(function (c) {
      markField(c[0], c[1]);
      if (!c[1] && !firstInvalid) firstInvalid = c[0];
    });

    if (firstInvalid) {
      setStatus("Zkontrolujte prosím označená pole.", "error");
      firstInvalid.focus();
      return;
    }

    var subject = "Poptávka z webu – " + type.value;
    var body =
      "Jméno: " + name.value.trim() + "\n" +
      "Telefon: " + phone.value.trim() + "\n" +
      "E-mail: " + (email.value.trim() || "-") + "\n" +
      "Zájem o: " + type.value + "\n\n" +
      message.value.trim();

    window.location.href =
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    setStatus("Otevírá se váš e-mail. Pokud se nic nestalo, napište nám přímo na " + CONTACT_EMAIL + " nebo zavolejte.", "ok");
  });

  form.querySelectorAll("input, textarea").forEach(function (el) {
    el.addEventListener("input", function () {
      el.closest(".field").classList.remove("invalid");
    });
  });
})();
