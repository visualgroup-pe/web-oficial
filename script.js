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

  /* Hide shortly after the page finishes loading */
  window.addEventListener("load", function () { setTimeout(hide, 2200); });
  /* Failsafe: hide regardless of the load event */
  setTimeout(hide, 3600);
})();

/* ─── HERO BACKGROUND VIDEO ─── */
(function () {
  var v = document.getElementById("hero-video");
  if (!v) return;
  v.muted = true;               /* required for autoplay */
  var attempt = v.play();
  if (attempt && typeof attempt.catch === "function") {
    attempt.catch(function () { /* autoplay blocked: poster stays visible */ });
  }
})();

/* ─── REVEAL ON SCROLL (IntersectionObserver, no CDN dependency) ─── */
(function () {
  var reveals = document.querySelectorAll(".reveal");

  function showAll() {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  if (!("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  reveals.forEach(function (el) { io.observe(el); });

  /* Failsafe: if something goes wrong, reveal everything after 2.5s */
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

/* ─── SMOOTH ANCHOR SCROLL ─── */
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

/* ─── WHATSAPP FLOAT ENTRANCE ─── */
(function () {
  var waFloat = document.getElementById("wa-float");
  if (!waFloat) return;
  setTimeout(function () { waFloat.classList.add("ready"); }, 1400);
})();

/* ─── CONTACT FORM (dual notification) ─── */
(function () {
  var contactForm = document.getElementById("contact-form");
  var formStatus  = document.getElementById("form-status");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var waText = "Hola, me comunico desde visualgroup.net. Me interesa conocer más sobre los servicios de VISUAL Group.";
    window.open("https://wa.me/51981218584?text=" + encodeURIComponent(waText), "_blank");

    var data = new FormData(contactForm);

    fetch(contactForm.action, {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    })
    .then(function (res) {
      if (res.ok) {
        formStatus.className = "form-status success";
        formStatus.textContent = "¡Mensaje enviado! Te contactaremos pronto.";
        contactForm.reset();
      } else {
        throw new Error("server");
      }
    })
    .catch(function () {
      formStatus.className = "form-status error";
      formStatus.textContent = "Ocurrió un error. Escríbenos a administracion@visualgroup.net";
    });
  });
})();

