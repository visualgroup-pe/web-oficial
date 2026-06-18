/* ==============================
   VISUAL GROUP — PREMIUM INTERACTIONS
   ============================== */

(function () {
    "use strict";

    /* ── Register GSAP plugins first ── */
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* ── Detect touch / mobile ── */
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;

    /* ──────────────────────────────────
       1. LOADER
    ────────────────────────────────── */
    const loader = document.getElementById("loader");
    const loaderBar = document.getElementById("loader-bar");
    const loaderCounter = document.getElementById("loader-counter");
    const loaderVisual = document.getElementById("loader-visual");
    const loaderGroup = document.getElementById("loader-group");
    const loaderSep = document.getElementById("loader-sep");
    const loaderTagline = document.getElementById("loader-tagline");

    /* Generate particles */
    const particlesContainer = document.getElementById("loader-particles");
    if (particlesContainer) {
        for (let i = 0; i < 60; i++) {
            const p = document.createElement("div");
            p.className = "loader-particle";
            p.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: ${Math.random() > 0.5 ? "#56B5BF" : "#F2CC85"};
            `;
            particlesContainer.appendChild(p);
        }
    }

    let progress = 0;
    const counterInterval = setInterval(() => {
        progress += Math.random() * 4 + 1;
        if (progress >= 100) {
            progress = 100;
            clearInterval(counterInterval);
        }
        if (loaderCounter) loaderCounter.textContent = Math.floor(progress);
        if (loaderBar) loaderBar.style.width = progress + "%";
    }, 40);

    function dismissLoader() {
        if (!loader) return;
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                loader.style.display = "none";
                document.body.style.overflow = "";
                initLenis();
                heroEntrance();
            }
        });
    }

    /* Fallback: dismiss loader after 5s in case CDN is slow */
    const loaderFallback = setTimeout(dismissLoader, 5000);

    const tl = gsap.timeline({
        onComplete: () => {
            clearTimeout(loaderFallback);
            dismissLoader();
        }
    });

    document.body.style.overflow = "hidden";

    /* Animate letters in */
    tl.to(loaderVisual ? loaderVisual.querySelectorAll("span") : [], {
        y: 0,
        stagger: 0.06,
        duration: 0.9,
        ease: "power4.out",
        delay: 0.3
    })
    .to(loaderSep, {
        width: "80px",
        duration: 0.5,
        ease: "power3.out"
    }, "-=0.2")
    .to(loaderGroup ? loaderGroup.querySelectorAll("span") : [], {
        y: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "power4.out"
    }, "-=0.4")
    .to(loaderTagline, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out"
    }, "-=0.2")
    .to(particlesContainer ? particlesContainer.querySelectorAll(".loader-particle") : [], {
        opacity: () => Math.random() * 0.8 + 0.2,
        x: () => (Math.random() - 0.5) * 200,
        y: () => (Math.random() - 0.5) * 200,
        stagger: { each: 0.01, from: "random" },
        duration: 1.5,
        ease: "power2.out"
    }, 0.5)
    .to({}, { duration: 1.4 });

    /* ──────────────────────────────────
       2. LENIS SMOOTH SCROLL
    ────────────────────────────────── */
    let lenis;

    function initLenis() {
        if (typeof Lenis === "undefined") return;
        try {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                smoothWheel: true,
                syncTouch: false
            });

            lenis.on("scroll", () => {
                if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update();
            });

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        } catch(e) {
            /* Lenis failed, native scroll still works */
        }
    }

    /* ──────────────────────────────────
       3. (ScrollTrigger already registered at top)
    ────────────────────────────────── */

    /* ──────────────────────────────────
       4. CUSTOM CURSOR
    ────────────────────────────────── */
    if (!isMobile) {
        const cursor = document.getElementById("cursor");
        const cursorDot = document.getElementById("cursor-dot");
        let mouseX = -100, mouseY = -100;
        let curX = -100, curY = -100;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            gsap.to(cursorDot, {
                x: mouseX - 3,
                y: mouseY - 3,
                duration: 0.08,
                ease: "none"
            });
        });

        gsap.ticker.add(() => {
            curX += (mouseX - curX) * 0.12;
            curY += (mouseY - curY) * 0.12;
            gsap.set(cursor, { x: curX - 20, y: curY - 20 });
        });

        document.querySelectorAll("a, button, .filter-btn, .svc-card, .pf-item, .pkg-card, .testi-btn, .tdot, .cmo-tab, .pkg-toggle-btn, .vweb-plan-toggle").forEach(el => {
            el.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
            el.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
        });

        document.addEventListener("mousedown", () => cursor.classList.add("is-clicking"));
        document.addEventListener("mouseup", () => cursor.classList.remove("is-clicking"));
    }

    /* ──────────────────────────────────
       5. NAVBAR
    ────────────────────────────────── */
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    }, { passive: true });

    /* Mobile menu */
    const navToggle = document.getElementById("nav-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileClose = document.getElementById("mobile-close");

    function openMobileMenu() {
        mobileMenu.classList.add("open");
        navToggle.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove("open");
        navToggle.classList.remove("open");
        document.body.style.overflow = "";
    }

    if (navToggle) navToggle.addEventListener("click", openMobileMenu);
    if (mobileClose) mobileClose.addEventListener("click", closeMobileMenu);

    document.querySelectorAll(".mobile-link, .mobile-cta").forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });

    /* ──────────────────────────────────
       6. HERO ENTRANCE
    ────────────────────────────────── */
    function heroEntrance() {
        const heroTl = gsap.timeline({ delay: 0.1 });

        /* Set initial states */
        gsap.set(".hero-headline .reveal-line", { opacity: 0, y: 40 });

        /* Scale hero bg */
        heroTl.to("#hero-bg-img", {
            scale: 1,
            duration: 2.5,
            ease: "power3.out"
        }, 0)
        .to(".hero-eyebrow", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        }, 0.2)
        .to(".hero-headline .reveal-line", {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 1,
            ease: "power4.out"
        }, 0.4)
        .to(".hero-sub", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        }, 0.9)
        .to(".hero-ctas", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        }, 1.1);
    }

    /* ──────────────────────────────────
       7. REVEAL ON SCROLL
    ────────────────────────────────── */
    function initRevealAnimations() {
        gsap.utils.toArray(".reveal-up").forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 60 },
                {
                    opacity: 1, y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 88%",
                        once: true
                    }
                }
            );
        });
    }

    /* ──────────────────────────────────
       8. MANIFESTO SCROLL
    ────────────────────────────────── */
    function initManifesto() {
        const lines = document.querySelectorAll("[data-manifesto]");

        lines.forEach(line => {
            ScrollTrigger.create({
                trigger: line,
                start: "top 65%",
                end: "bottom 35%",
                onEnter: () => line.classList.add("is-active"),
                onLeave: () => line.classList.remove("is-active"),
                onEnterBack: () => line.classList.add("is-active"),
                onLeaveBack: () => line.classList.remove("is-active")
            });
        });
    }

    /* ──────────────────────────────────
       9. STATS COUNTER (tab-triggered)
    ────────────────────────────────── */
    let statsDone = false;

    function runResultados() {
        if (statsDone) return;
        statsDone = true;
        document.querySelectorAll(".stat-num").forEach(el => {
            const target = parseInt(el.dataset.count) || 0;
            const suffix = el.dataset.suffix || "";
            gsap.fromTo({ val: 0 },
                { val: 0 },
                {
                    val: target,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: function () {
                        el.textContent = Math.floor(this.targets()[0].val) + suffix;
                    }
                }
            );
        });
    }

    /* Legacy stub — stats now live inside cmo tabs */
    function initStats() {}

    /* ──────────────────────────────────
       10. PORTFOLIO FILTER
    ────────────────────────────────── */
    function initPortfolioFilter() {
        const filterBtns = document.querySelectorAll(".filter-btn");
        const items = document.querySelectorAll(".pf-item");

        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filter = btn.dataset.filter;

                items.forEach(item => {
                    const show = filter === "all" || item.dataset.cat === filter;
                    gsap.to(item, {
                        opacity: show ? 1 : 0.12,
                        scale: show ? 1 : 0.94,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                    item.style.pointerEvents = show ? "auto" : "none";
                    item.style.filter = show ? "" : "grayscale(1)";
                });
            });
        });
    }

    /* ──────────────────────────────────
       11. PACKAGE CARD TILT
    ────────────────────────────────── */
    function initPackageTilt() {
        if (isMobile) return;
        document.querySelectorAll("[data-tilt]").forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(card, {
                    rotateY: x * 12,
                    rotateX: -y * 12,
                    transformPerspective: 800,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    rotateY: 0, rotateX: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.5)"
                });
            });
        });
    }

    /* ──────────────────────────────────
       12. TESTIMONIALS SLIDER
    ────────────────────────────────── */
    function initTestiSlider() {
        const track = document.getElementById("testi-track");
        const dots = document.querySelectorAll(".tdot");
        const prevBtn = document.getElementById("testi-prev");
        const nextBtn = document.getElementById("testi-next");

        if (!track) return;

        const cards = track.querySelectorAll(".testi-card");
        let current = 0;
        const perView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
        const maxSlide = Math.max(0, cards.length - perView);

        function goTo(idx) {
            current = Math.max(0, Math.min(idx, maxSlide));
            const offset = current * (100 / cards.length);
            gsap.to(track, {
                x: `-${offset}%`,
                duration: 0.7,
                ease: "power3.out"
            });
            dots.forEach((d, i) => d.classList.toggle("active", i === current));
        }

        if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1));
        if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1));
        dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

        /* Auto advance */
        setInterval(() => goTo(current < maxSlide ? current + 1 : 0), 5000);
    }

    /* ──────────────────────────────────
       13. MAGNETIC BUTTONS
    ────────────────────────────────── */
    function initMagneticButtons() {
        if (isMobile) return;
        document.querySelectorAll(".magnetic").forEach(btn => {
            btn.addEventListener("mousemove", (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, {
                    x: x * 0.25,
                    y: y * 0.25,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
            btn.addEventListener("mouseleave", () => {
                gsap.to(btn, {
                    x: 0, y: 0,
                    duration: 0.7,
                    ease: "elastic.out(1, 0.4)"
                });
            });
        });
    }

    /* ──────────────────────────────────
       14. WORD-OJOS CURSOR FOLLOW
    ────────────────────────────────── */
    function initOjosEffect() {
        const ojosEl = document.getElementById("word-ojos");
        if (!ojosEl || isMobile) return;

        document.addEventListener("mousemove", (e) => {
            const rect = ojosEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / window.innerWidth * 8;
            const dy = (e.clientY - cy) / window.innerHeight * 8;
            gsap.to(ojosEl, {
                x: dx, y: dy,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    }

    /* ──────────────────────────────────
       15. PARALLAX HERO
    ────────────────────────────────── */
    function initHeroParallax() {
        if (isMobile) return;
        ScrollTrigger.create({
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            onUpdate: (self) => {
                gsap.to("#hero-bg-img", {
                    y: self.progress * 120,
                    ease: "none",
                    duration: 0
                });
                gsap.to(".hero-content", {
                    y: self.progress * 60,
                    opacity: 1 - self.progress * 1.2,
                    ease: "none",
                    duration: 0
                });
            }
        });
    }

    /* ──────────────────────────────────
       16. SERVICE CARDS (svc-card uses reveal-up — handled by initRevealAnimations)
    ────────────────────────────────── */
    function initServiceCards() {} /* no-op: .svc-card uses .reveal-up */

    /* ──────────────────────────────────
       16b. ACCORDION — vweb plan feature lists
    ────────────────────────────────── */
    function initAccordion() {
        document.querySelectorAll("[data-plan-toggle]").forEach(btn => {
            btn.addEventListener("click", () => {
                const plan = btn.closest(".vweb-plan");
                if (!plan) return;
                const extras = plan.querySelectorAll(".vwi-extra");
                const expanding = !plan.classList.contains("is-expanded");
                plan.classList.toggle("is-expanded", expanding);
                const label = btn.querySelector(".vpt-label");
                if (label) label.textContent = expanding ? "Ver menos" : "Ver todas las características";
                btn.setAttribute("aria-expanded", expanding);
                extras.forEach(li => {
                    if (expanding) {
                        gsap.set(li, { display: "flex", height: 0, opacity: 0 });
                        gsap.to(li, { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" });
                    } else {
                        gsap.to(li, {
                            height: 0, opacity: 0, duration: 0.3, ease: "power2.in",
                            onComplete: () => gsap.set(li, { display: "none" })
                        });
                    }
                });
            });
        });
    }

    /* ──────────────────────────────────
       16c. CMO TABS
    ────────────────────────────────── */
    function initCmoTabs() {
        const tabs = document.querySelectorAll(".cmo-tab[data-tab]");
        const panels = document.querySelectorAll(".cmo-panel[data-panel]");
        if (!tabs.length) return;

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const target = tab.dataset.tab;
                tabs.forEach(t => t.classList.toggle("active", t === tab));
                panels.forEach(p => {
                    p.classList.toggle("active", p.dataset.panel === target);
                });
                if (target === "resultados") runResultados();
            });
        });
    }

    /* ──────────────────────────────────
       16d. PACKAGE TOGGLE
    ────────────────────────────────── */
    function initPkgToggle() {
        const btns = document.querySelectorAll(".pkg-toggle-btn[data-pkg-tab]");
        const panels = document.querySelectorAll(".pkg-panel[data-pkg-panel]");
        if (!btns.length) return;

        btns.forEach(btn => {
            btn.addEventListener("click", () => {
                const target = btn.dataset.pkgTab;
                btns.forEach(b => b.classList.toggle("active", b === btn));
                panels.forEach(p => {
                    p.classList.toggle("active", p.dataset.pkgPanel === target);
                });
            });
        });
    }

    /* ──────────────────────────────────
       16e. CONTACT FORM — dual notification
    ────────────────────────────────── */
    function initContactForm() {
        const form = document.getElementById("contact-form");
        const statusEl = document.getElementById("form-status");
        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nombre = (document.getElementById("f-nombre") || {}).value || "";
            const servicioEl = document.getElementById("f-servicio");
            const servicio = servicioEl ? (servicioEl.options[servicioEl.selectedIndex] || {}).text || "" : "";
            const mensaje = (document.getElementById("f-mensaje") || {}).value || "";

            /* 1. Open WhatsApp */
            const waText = `Hola, soy ${nombre}. Estoy interesado en ${servicio}.\n\n${mensaje}`;
            const waUrl = `https://wa.me/51981218584?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, "_blank", "noopener,noreferrer");

            /* 2. Submit to FormSubmit via AJAX */
            if (statusEl) {
                statusEl.className = "form-status";
                statusEl.textContent = "Enviando…";
            }
            try {
                const res = await fetch(form.action, {
                    method: "POST",
                    body: new FormData(form),
                    headers: { Accept: "application/json" }
                });
                if (res.ok) {
                    if (statusEl) {
                        statusEl.className = "form-status success";
                        statusEl.textContent = "¡Mensaje enviado! Te contactaremos pronto.";
                    }
                    form.reset();
                } else {
                    throw new Error("Server error");
                }
            } catch {
                if (statusEl) {
                    statusEl.className = "form-status error";
                    statusEl.textContent = "Hubo un problema. Por favor escríbenos directamente a WhatsApp.";
                }
            }
        });
    }

    /* ──────────────────────────────────
       17. PORTFOLIO ITEMS REVEAL
    ────────────────────────────────── */
    function initPortfolioReveal() {
        gsap.utils.toArray(".pf-item").forEach((item, i) => {
            gsap.fromTo(item,
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1, scale: 1,
                    duration: 0.7,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 90%",
                        once: true
                    },
                    delay: (i % 3) * 0.08
                }
            );
        });
    }

    /* ──────────────────────────────────
       18. STATS REVEAL (section removed — stats now in cmo tabs)
    ────────────────────────────────── */
    function initStatsReveal() {} /* no-op */

    /* ──────────────────────────────────
       19. PLAY BUTTON HOVER
    ────────────────────────────────── */
    function initShowreelHover() {
        const frame = document.querySelector(".showreel-frame");
        if (!frame) return;
        frame.addEventListener("mouseenter", () => {
            gsap.to(".play-circle", { scale: 1.1, duration: 0.4 });
        });
        frame.addEventListener("mouseleave", () => {
            gsap.to(".play-circle", { scale: 1, duration: 0.4 });
        });
    }

    /* ──────────────────────────────────
       20. WHATSAPP BUTTON ENTRANCE
    ────────────────────────────────── */
    function initWAButton() {
        const wa = document.getElementById("wa-float");
        if (!wa) return;
        gsap.fromTo(wa,
            { opacity: 0, scale: 0, y: 20 },
            {
                opacity: 1, scale: 1, y: 0,
                duration: 0.6,
                ease: "back.out(1.7)",
                delay: 3
            }
        );
    }

    /* ──────────────────────────────────
       21. FOOTER REVEAL
    ────────────────────────────────── */
    function initFooterReveal() {
        gsap.fromTo(".footer-bg-word",
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".footer",
                    start: "top 90%",
                    once: true
                }
            }
        );
    }

    /* ──────────────────────────────────
       22. SMOOTH ANCHOR SCROLL
    ────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
            const target = document.querySelector(anchor.getAttribute("href"));
            if (!target) return;
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(target, { offset: -80, duration: 1.4 });
            } else {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    /* ──────────────────────────────────
       23. FORM FIELD ANIMATIONS
    ────────────────────────────────── */
    document.querySelectorAll(".f-input").forEach(input => {
        input.addEventListener("focus", () => {
            gsap.to(input, { scale: 1.01, duration: 0.2, ease: "power2.out" });
        });
        input.addEventListener("blur", () => {
            gsap.to(input, { scale: 1, duration: 0.2, ease: "power2.out" });
        });
    });

    /* ──────────────────────────────────
       INIT ALL (after loader)
    ────────────────────────────────── */
    initRevealAnimations();
    initManifesto();
    initPortfolioFilter();
    initPackageTilt();
    initTestiSlider();
    initMagneticButtons();
    initOjosEffect();
    initHeroParallax();
    initPortfolioReveal();
    initShowreelHover();
    initWAButton();
    initFooterReveal();
    initAccordion();
    initCmoTabs();
    initPkgToggle();
    initContactForm();

})();
