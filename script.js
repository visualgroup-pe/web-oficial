/* ═══════════════════════════════════════════════════════
   VISUAL Group — script.js
   ═══════════════════════════════════════════════════════ */

/* Número oficial de WhatsApp */
var WA_NUMBER = "51912461505";
var WA_DEFAULT = "Hola, me comunico desde visualgroup.net. Me interesa conocer más sobre los servicios de VISUAL Group.";
function waLink(msg) {
  return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg || WA_DEFAULT);
}

/* ─── PRELOADER ─── */
(function () {
  var pre = document.getElementById("preloader");
  var body = document.body;
  var hidden = false;

  function hide() {
    if (hidden) return;
    hidden = true;
    if (pre) pre.classList.add("done");
    body.classList.remove("is-loading");
  }

  if (!pre) { body.classList.remove("is-loading"); return; }

  window.addEventListener("load", function () { setTimeout(hide, 2200); });
  setTimeout(hide, 3600);
})();

/* ─── HERO BACKGROUND VIDEO ─── */
(function () {
  var v = document.getElementById("hero-video");
  if (!v) return;
  v.muted = true;
  var attempt = v.play();
  if (attempt && typeof attempt.catch === "function") {
    attempt.catch(function () { /* autoplay blocked: poster stays visible */ });
  }
})();

/* ─── REVEAL ON SCROLL ─── */
(function () {
  var reveals = document.querySelectorAll(".reveal");

  function showAll() {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  if (!("IntersectionObserver" in window)) { showAll(); return; }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  reveals.forEach(function (el) { io.observe(el); });
  setTimeout(showAll, 2500);
})();

/* ─── LENIS SMOOTH SCROLL (optional, guarded) ─── */
var lenis = null;
try {
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
} catch (err) { lenis = null; }

/* ─── NAVBAR SCROLL STATE ─── */
(function () {
  var navbar = document.getElementById("navbar");
  if (!navbar) return;
  function onScroll() {
    if (window.scrollY > 60) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  if (lenis) lenis.on("scroll", onScroll);
  onScroll();
})();

/* ─── MOBILE MENU ─── */
(function () {
  var mobileMenu  = document.getElementById("mobile-menu");
  var navToggle   = document.getElementById("nav-toggle");
  var mobileClose = document.getElementById("mobile-close");
  if (!mobileMenu || !navToggle) return;

  function openMenu() {
    mobileMenu.classList.add("open");
    navToggle.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    mobileMenu.classList.remove("open");
    navToggle.classList.remove("open");
    document.body.style.overflow = "";
  }

  window.__closeMobileMenu = closeMenu;

  navToggle.addEventListener("click", openMenu);
  if (mobileClose) mobileClose.addEventListener("click", closeMenu);
  document.querySelectorAll(".mobile-link, .mobile-wa-btn").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
})();

/* ─── SMOOTH ANCHOR SCROLL (same-page anchors only) ─── */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    var href = this.getAttribute("href");
    if (href === "#" || href.length < 2) return;
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (window.__closeMobileMenu) window.__closeMobileMenu();
    if (lenis) {
      lenis.scrollTo(target, { offset: -76, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ═══════════════════════════════════════════════════════
   WIDGET DE WHATSAPP · RAQUEL
   ═══════════════════════════════════════════════════════ */
(function () {
  var widget   = document.getElementById("wa-widget");
  if (!widget) return;

  var launcher = document.getElementById("wa-launcher");
  var panel    = document.getElementById("wa-panel");
  var headX    = document.getElementById("wa-head-x");
  var teaser   = document.getElementById("wa-teaser");
  var teaserX  = document.getElementById("wa-teaser-x");
  var cta      = document.getElementById("wa-cta");
  var quick    = document.getElementById("wa-quick");

  /* entrance of launcher */
  setTimeout(function () { if (launcher) launcher.classList.add("ready"); }, 1200);

  function openPanel() {
    if (!panel) return;
    panel.classList.add("open");
    hideTeaser(true);
  }
  function closePanel() {
    if (panel) panel.classList.remove("open");
  }
  function togglePanel() {
    if (!panel) return;
    if (panel.classList.contains("open")) closePanel();
    else openPanel();
  }
  function hideTeaser(remember) {
    if (teaser) teaser.classList.remove("show");
    if (remember) { try { sessionStorage.setItem("waTeaserSeen", "1"); } catch (e) {} }
  }
  function showTeaser() {
    var seen = false;
    try { seen = sessionStorage.getItem("waTeaserSeen") === "1"; } catch (e) {}
    if (seen) return;
    if (panel && panel.classList.contains("open")) return;
    if (teaser) teaser.classList.add("show");
  }

  /* launcher: open the chat panel instead of navigating (anchor is a no-JS fallback) */
  if (launcher) {
    launcher.addEventListener("click", function (e) {
      e.preventDefault();
      togglePanel();
    });
  }
  if (headX)   headX.addEventListener("click", closePanel);

  /* teaser interactions */
  if (teaser) {
    teaser.addEventListener("click", function (e) {
      if (e.target === teaserX) return;
      openPanel();
    });
  }
  if (teaserX) {
    teaserX.addEventListener("click", function (e) {
      e.stopPropagation();
      hideTeaser(true);
    });
  }

  /* quick replies → set CTA message and open WhatsApp */
  if (quick) {
    quick.querySelectorAll("button[data-msg]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var url = waLink(btn.getAttribute("data-msg"));
        if (cta) cta.setAttribute("href", url);
        window.open(url, "_blank", "noopener");
      });
    });
  }

  /* auto-show teaser after a few seconds (once per session) */
  setTimeout(showTeaser, 6000);

  /* close panel on Escape */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePanel();
  });
})();

/* ─── CONTACT FORM (WhatsApp + FormSubmit) ─── */
(function () {
  var contactForm = document.getElementById("contact-form");
  var formStatus  = document.getElementById("form-status");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var data = new FormData(contactForm);
    var nombre   = (data.get("nombre") || "").toString().trim();
    var servicio = (data.get("servicio") || "").toString().trim();
    var mensaje  = (data.get("mensaje") || "").toString().trim();

    var waMsg = "Hola, soy " + (nombre || "un visitante") + " y me comunico desde visualgroup.net.";
    if (servicio) waMsg += " Me interesa: " + servicio + ".";
    if (mensaje)  waMsg += " " + mensaje;

    window.open(waLink(waMsg), "_blank", "noopener");

    fetch(contactForm.action, {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    })
    .then(function (res) {
      if (res.ok) {
        if (formStatus) {
          formStatus.className = "form-status success";
          formStatus.textContent = "¡Mensaje enviado! Te contactaremos pronto.";
        }
        contactForm.reset();
      } else {
        throw new Error("server");
      }
    })
    .catch(function () {
      if (formStatus) {
        formStatus.className = "form-status error";
        formStatus.textContent = "Abrimos WhatsApp con tu mensaje. Si prefieres, escríbenos a administracion@visualgroup.net";
      }
    });
  });
})();
