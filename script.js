/* ═══════════════════════════════════════════════════════
   VISUAL Group — script.js
   ═══════════════════════════════════════════════════════ */

/* Número oficial de WhatsApp */
var WA_NUMBER = "51924171401";
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
   ASISTENTE CONVERSACIONAL · RAQUEL (chatbot + derivación a WhatsApp)
   ═══════════════════════════════════════════════════════ */
(function () {
  var widget = document.getElementById("wa-widget");
  if (!widget) return;

  var launcher = document.getElementById("wa-launcher");
  var panel    = document.getElementById("wa-panel");
  var headX    = document.getElementById("wa-head-x");
  var teaser   = document.getElementById("wa-teaser");
  var teaserX  = document.getElementById("wa-teaser-x");
  var cta      = document.getElementById("wa-cta");
  var body     = document.getElementById("wa-body") || panel && panel.querySelector(".wa-body");
  var quick    = document.getElementById("wa-quick");
  var foot      = panel && panel.querySelector(".wa-foot");

  /* ── normalización de texto (minúsculas, sin tildes ni signos) ── */
  function norm(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9ñ\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* ── atajos para derivar a WhatsApp con contexto ── */
  function waChip(label, msg) { return { t: label, wa: msg }; }
  var ASESOR = waChip("💬 Hablar con una asesora", "Hola Raquel, quisiera hablar con una asesora de VISUAL Group.");

  /* ═══ BASE DE CONOCIMIENTO ═══
     Cada intención: kw (palabras clave), a (respuesta HTML), c (chips de seguimiento). */
  var KB = [
    {
      id: "saludo",
      kw: ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "que tal", "hey", "holi", "saludos"],
      a: "¡Hola! 👋 Soy <strong>Raquel</strong>, de VISUAL Group. Puedo contarte sobre nuestros <strong>servicios, precios, proyectos</strong> y ayudarte a dar el siguiente paso. ¿Qué te gustaría saber? 😊",
      c: [{ t: "Ver servicios", q: "servicios" }, { t: "Precios y planes", q: "precios" }, { t: "Ver proyectos", q: "portafolio" }]
    },
    {
      id: "servicios",
      kw: ["servicio", "servicios", "que hacen", "que ofrecen", "a que se dedican", "que ofreces", "ayudan", "rubro", "hacen"],
      a: "En VISUAL Group hacemos que tu marca <strong>entre por los ojos</strong> 👀. Te ayudamos con:<br><br>📱 <strong>Gestión de redes & contenido</strong> (reels, historias, flyers, carruseles)<br>🎬 <strong>Producción de reels y video</strong><br>🚀 <strong>Campañas de Ads</strong> (Meta / Instagram)<br>🎨 <strong>Branding y diseño gráfico</strong><br>💻 <strong>Páginas web y tiendas online</strong><br>📸 <strong>Cobertura audiovisual de eventos</strong><br><br>¿Sobre cuál te cuento más?",
      c: [{ t: "Redes & contenido", q: "redes" }, { t: "Página web", q: "web" }, { t: "Precios", q: "precios" }]
    },
    {
      id: "precios",
      kw: ["precio", "precios", "cuanto cuesta", "cuanto sale", "costo", "costos", "tarifa", "tarifas", "plan", "planes", "paquete", "paquetes", "cotizacion", "presupuesto", "inversion", "vale", "cuanto"],
      a: "Con gusto 😊 Estos son nuestros rangos (en soles S/):<br><br>📱 <strong>Redes & contenido</strong> — desde <strong>S/ 849/mes</strong> (Start), S/ 1,149 (Mid), S/ 1,549 (Pro).<br>🚀 <strong>Redes + Ads</strong> — desde <strong>S/ 2,990/mes</strong> con community management y campañas.<br>💻 <strong>Web</strong> — Landing <strong>S/ 1,990</strong> · Sitio corporativo desde <strong>S/ 3,490</strong> · Tienda online desde <strong>S/ 6,490</strong> (pago único).<br>📸 <strong>Cobertura audiovisual</strong> — desde <strong>S/ 200</strong> por jornada.<br><br>👉 Mira el detalle en <a href=\"/servicios\">Servicios</a>. ¿Te preparo una propuesta a tu medida?",
      c: [{ t: "Ver tabla completa", q: "__link:/servicios" }, waChip("💬 Cotizar por WhatsApp", "Hola Raquel, quisiera una cotización de VISUAL Group. Mi marca/negocio es:")]
    },
    {
      id: "redes",
      kw: ["redes", "red social", "redes sociales", "contenido", "community", "instagram", "tiktok", "social media", "publicaciones", "posts", "historias", "stories", "manejo de redes"],
      a: "📱 Nuestra <strong>gestión de redes</strong> incluye reels, historias, flyers y carruseles con estrategia, copy y publicación. Los planes van <strong>desde S/ 849/mes</strong>, y los planes con <strong>Community Management + Ads</strong> desde S/ 2,990/mes.<br><br>Creamos contenido que conecta y hace crecer tu comunidad ✨. ¿Te armo un plan según tus metas?",
      c: [{ t: "Ver planes", q: "__link:/servicios" }, { t: "Producción de reels", q: "reels" }, ASESOR]
    },
    {
      id: "reels",
      kw: ["reel", "reels", "video", "videos", "grabacion", "produccion", "edicion", "audiovisual contenido"],
      a: "🎬 Producimos <strong>reels y video</strong> pensados para captar atención en los primeros segundos: guion, grabación y edición dinámica. Están incluidos en todos los planes de redes (de 4 a 15 reels al mes según el plan).<br><br>¿Quieres ver ejemplos o cotizar?",
      c: [{ t: "Ver proyectos", q: "portafolio" }, { t: "Precios", q: "precios" }, ASESOR]
    },
    {
      id: "ads",
      kw: ["ads", "publicidad", "campana", "campanas", "pauta", "meta ads", "facebook ads", "anuncios", "pauta publicitaria", "performance"],
      a: "🚀 Gestionamos <strong>campañas de Ads</strong> en Meta (Facebook / Instagram) para traer tráfico, leads y ventas. Vienen dentro de nuestros <strong>planes Redes + Ads desde S/ 2,990/mes</strong>, con community management y reporte mensual.<br><br>¿Te interesa escalar con publicidad?",
      c: [{ t: "Ver planes + Ads", q: "__link:/servicios" }, waChip("💬 Cotizar Ads", "Hola Raquel, me interesan los planes de redes + Ads de VISUAL Group.")]
    },
    {
      id: "web",
      kw: ["web", "pagina", "pagina web", "sitio", "sitio web", "landing", "tienda", "tienda online", "ecommerce", "e commerce", "online", "desarrollo web", "pagina de ventas"],
      a: "💻 Desarrollamos <strong>webs que venden</strong>:<br><br>• <strong>Landing page</strong> — S/ 1,990 (pago único)<br>• <strong>Sitio web corporativo</strong> — desde S/ 3,490<br>• <strong>Tienda online</strong> — desde S/ 6,490<br><br>Diseño UX/UI a medida, WhatsApp + redes, Google Maps y Analytics. ¿Qué tipo de web necesitas?",
      c: [{ t: "Ver proyectos web", q: "__link:/portafolio" }, waChip("💬 Quiero mi web", "Hola Raquel, quiero cotizar una página web / tienda online con VISUAL Group.")]
    },
    {
      id: "cobertura",
      kw: ["cobertura", "foto", "fotos", "fotografia", "evento", "eventos", "sesion", "grabacion evento", "audiovisual", "filmacion"],
      a: "📸 Hacemos <strong>cobertura audiovisual</strong> de eventos y marcas, cotizada por jornada:<br><br>• <strong>Básica</strong> (1–2 h) — S/ 200–400<br>• <strong>Intermedia</strong> (3–5 h) — S/ 600–1,000<br>• <strong>Completa</strong> (6–8 h) — S/ 1,200–1,600<br><br>Incluye fotos editadas, reels e historias. ¿Para qué fecha lo necesitas?",
      c: [waChip("💬 Reservar cobertura", "Hola Raquel, quiero reservar una cobertura audiovisual. La fecha/evento es:")]
    },
    {
      id: "branding",
      kw: ["branding", "marca", "logo", "logotipo", "identidad", "diseno grafico", "diseno", "imagen de marca", "manual de marca"],
      a: "🎨 Construimos tu <strong>identidad de marca</strong>: diseño gráfico, línea visual coherente, flyers y piezas que se reconocen al instante. Lo integramos con tu estrategia de contenido para que todo hable el mismo idioma.<br><br>¿Partes de cero o ya tienes una marca?",
      c: [{ t: "Ver proyectos", q: "portafolio" }, ASESOR]
    },
    {
      id: "portafolio",
      kw: ["portafolio", "proyectos", "casos", "trabajos", "ejemplos", "clientes", "referencias", "casos de exito", "muestras", "han hecho"],
      a: "✨ Hemos impulsado marcas como <strong>Impacto Evangelístico, Online Impacto, Colegio Elim, Perú Crafted Experiences, Transportes Bracar, Obimedic y Full Car Gavilán</strong>, entre otras.<br><br>👉 Mira los casos y webs en <a href=\"/portafolio\">Portafolio</a>.",
      c: [{ t: "Abrir portafolio", q: "__link:/portafolio" }, { t: "Precios", q: "precios" }, ASESOR]
    },
    {
      id: "nosotros",
      kw: ["nosotros", "quienes son", "quien es", "empresa", "agencia", "fundadores", "equipo", "historia", "mathias", "raquel", "sobre ustedes", "acerca"],
      a: "Somos <strong>VISUAL Group</strong>, una agencia creativa y digital en Lima 🇵🇪, fundada por <strong>Mathías Guevara</strong> y <strong>Raquel Joswe</strong>. Combinamos estrategia, contenido y desarrollo para que las marcas crezcan de verdad.<br><br>Conócenos más en <a href=\"/nosotros\">Nosotros</a>.",
      c: [{ t: "Ver servicios", q: "servicios" }, { t: "Ver proyectos", q: "portafolio" }]
    },
    {
      id: "contacto",
      kw: ["contacto", "contactar", "telefono", "numero", "celular", "correo", "email", "mail", "escribir", "llamar", "como los contacto", "comunicar"],
      a: "¡Hablemos! 💬<br><br>📞 WhatsApp: <strong>+51 924 171 401</strong><br>✉️ Correo: <strong>administracion@visualgroup.net</strong><br>📷 Instagram / TikTok: <strong>@visualgroup_pe</strong><br><br>Puedo abrirte WhatsApp ahora mismo 👇",
      c: [ASESOR, { t: "Ir a Contacto", q: "__link:/contacto" }]
    },
    {
      id: "ubicacion",
      kw: ["ubicacion", "donde estan", "direccion", "lima", "peru", "presencial", "oficina", "ciudad", "atienden en"],
      a: "📍 Estamos en <strong>Lima, Perú</strong>. Trabajamos con clientes de todo el país de forma <strong>online</strong>, y coordinamos sesiones o coberturas <strong>presenciales</strong> según el proyecto.<br><br>¿De qué ciudad nos escribes?",
      c: [ASESOR, { t: "Ver servicios", q: "servicios" }]
    },
    {
      id: "horario",
      kw: ["horario", "atencion", "cuando atienden", "horarios", "disponible", "abierto", "atienden"],
      a: "🕐 Atendemos de <strong>lunes a sábado</strong> y respondemos muy rápido por WhatsApp. Escríbenos cuando quieras y te contactamos enseguida.",
      c: [ASESOR]
    },
    {
      id: "tiempos",
      kw: ["tiempo", "cuanto demora", "cuanto tarda", "entrega", "plazo", "demora", "cuando entregan", "rapido"],
      a: "⏱️ Depende del servicio: las <strong>webs</strong> tienen entrega ágil (una landing en pocos días, un sitio corporativo en 2–4 semanas según alcance), y en <strong>redes</strong> trabajamos con un calendario mensual de contenido. Te damos un cronograma claro desde el inicio.",
      c: [{ t: "Precios", q: "precios" }, ASESOR]
    },
    {
      id: "pago",
      kw: ["pago", "pagos", "formas de pago", "factura", "facturacion", "boleta", "yape", "plin", "transferencia", "medios de pago"],
      a: "💳 Manejamos distintas <strong>formas de pago</strong> y emitimos comprobante. Los planes de redes son mensuales, el desarrollo web es pago único y la cobertura por jornada. Una asesora te detalla las condiciones según tu caso 👇",
      c: [ASESOR]
    },
    {
      id: "porque",
      kw: ["por que", "porque elegir", "ventaja", "diferencia", "mejor", "garantia", "confianza", "resultados"],
      a: "💡 Porque no solo publicamos: <strong>pensamos en resultados</strong>. Unimos estrategia, contenido que detiene el scroll y desarrollo web, con atención cercana de los propios fundadores. Tu marca crece con intención, no por inercia. ✨",
      c: [{ t: "Ver proyectos", q: "portafolio" }, { t: "Precios", q: "precios" }, ASESOR]
    },
    {
      id: "contratar",
      kw: ["contratar", "quiero empezar", "empezar", "comenzar", "contrato", "adquirir", "comprar", "si quiero", "me interesa", "quiero el plan", "como contrato"],
      a: "¡Genial! 🙌 Me encanta. Para dejar todo listo y armar tu propuesta, te paso con una asesora por WhatsApp ahora mismo 👇",
      c: [waChip("💬 Empezar por WhatsApp", "Hola Raquel, quiero empezar con VISUAL Group. Me interesa:")]
    },
    {
      id: "asesor",
      kw: ["asesor", "asesora", "humano", "persona", "hablar con alguien", "agente", "whatsapp", "representante", "ejecutivo", "atencion personal"],
      a: "¡Claro! 💬 Te conecto con una asesora de VISUAL Group por WhatsApp para una atención personalizada 👇",
      c: [ASESOR]
    },
    {
      id: "gracias",
      kw: ["gracias", "muchas gracias", "ok gracias", "genial gracias", "perfecto gracias"],
      a: "¡Un gusto! 🙌 Aquí estaré para lo que necesites. Y si quieres avanzar, con un clic te paso con una asesora por WhatsApp. ✨",
      c: [ASESOR, { t: "Ver servicios", q: "servicios" }]
    }
  ];

  var FALLBACK = {
    a: "¡Buena pregunta! 🤔 No estoy segura de tener ese detalle aquí, pero una asesora te puede ayudar al instante por WhatsApp. También puedo contarte sobre nuestros servicios, precios o proyectos.",
    c: [ASESOR, { t: "Servicios", q: "servicios" }, { t: "Precios", q: "precios" }]
  };

  /* ── motor de coincidencia por palabras clave ── */
  function match(text) {
    var q = " " + norm(text) + " ";
    var best = null, bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var intent = KB[i], score = 0;
      for (var j = 0; j < intent.kw.length; j++) {
        var kw = intent.kw[j];
        if (q.indexOf(" " + kw + " ") !== -1 || q.indexOf(" " + kw) !== -1 && kw.length > 4) {
          score += kw.indexOf(" ") !== -1 ? 3 : 2; /* frases pesan más */
        }
      }
      if (score > bestScore) { bestScore = score; best = intent; }
    }
    return bestScore >= 2 ? best : FALLBACK;
  }

  /* ── render de mensajes ── */
  function scrollDown() { if (body) body.scrollTop = body.scrollHeight; }

  function addMsg(html, who) {
    if (!body) return;
    var el = document.createElement("div");
    el.className = "wa-msg" + (who === "user" ? " wa-msg--user" : "");
    el.innerHTML = html + '<span class="wa-time">' + (who === "user" ? "Tú" : "Raquel · ahora") + "</span>";
    body.appendChild(el);
    scrollDown();
  }

  var typingEl = null;
  function showTyping() {
    if (!body || typingEl) return;
    typingEl = document.createElement("div");
    typingEl.className = "wa-typing";
    typingEl.innerHTML = "<i></i><i></i><i></i>";
    body.appendChild(typingEl);
    scrollDown();
  }
  function hideTyping() {
    if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
    typingEl = null;
  }

  /* ── chips de sugerencia dinámicos ── */
  function renderChips(chips) {
    if (!quick) return;
    quick.innerHTML = "";
    (chips || []).forEach(function (chip) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = chip.t;
      if (chip.wa) {
        btn.className = "wa-chip-wa";
        btn.addEventListener("click", function () { goWhatsApp(chip.wa); });
      } else if (chip.q && chip.q.indexOf("__link:") === 0) {
        var href = chip.q.slice(7);
        btn.addEventListener("click", function () { window.location.href = href; });
      } else {
        btn.addEventListener("click", function () { handleUser(chip.t, chip.q); });
      }
      quick.appendChild(btn);
    });
  }

  function goWhatsApp(msg) {
    var url = waLink(msg);
    if (cta) cta.setAttribute("href", url);
    addMsg("Te abro WhatsApp para continuar por ahí 💬✅", "bot");
    window.open(url, "_blank", "noopener");
  }

  /* ── flujo de respuesta ── */
  function respond(intent) {
    showTyping();
    var delay = 500 + Math.min(900, (intent.a.length / 90) * 500);
    setTimeout(function () {
      hideTyping();
      addMsg(intent.a, "bot");
      renderChips(intent.c);
    }, delay);
  }

  /* handleUser: query opcional fuerza una intención (desde chips); si no, se infiere del texto */
  function handleUser(displayText, forcedQuery) {
    var text = displayText || "";
    addMsg(text.replace(/</g, "&lt;"), "user");
    renderChips([]);
    var intent;
    if (forcedQuery && forcedQuery.indexOf("__link:") !== 0) {
      intent = findById(forcedQuery) || match(forcedQuery);
    } else {
      intent = match(text);
    }
    respond(intent);
  }
  function findById(id) {
    for (var i = 0; i < KB.length; i++) if (KB[i].id === id) return KB[i];
    return null;
  }

  /* ── construir barra de entrada (input + enviar) ── */
  var input = null;
  (function buildInput() {
    if (!foot) return;
    if (cta) cta.style.display = "none"; /* reemplazamos el CTA fijo por el chat + chip verde */
    var bar = document.createElement("div");
    bar.className = "wa-inputbar";
    bar.innerHTML =
      '<input type="text" class="wa-input" id="wa-input" autocomplete="off" ' +
      'placeholder="Escribe tu pregunta…" aria-label="Escribe tu mensaje para Raquel">' +
      '<button type="button" class="wa-send" id="wa-send" aria-label="Enviar">' +
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>';
    var hint = document.createElement("p");
    hint.className = "wa-hint";
    hint.textContent = "Respuestas al instante · o te paso con una asesora";
    foot.appendChild(bar);
    foot.appendChild(hint);

    input = bar.querySelector("#wa-input");
    var send = bar.querySelector("#wa-send");

    function submit() {
      var v = (input.value || "").trim();
      if (!v) return;
      input.value = "";
      handleUser(v, null);
    }
    send.addEventListener("click", submit);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); submit(); }
    });
  })();

  /* chips iniciales (bajo el saludo que ya está en el HTML) */
  renderChips([
    { t: "Ver servicios", q: "servicios" },
    { t: "Precios y planes", q: "precios" },
    { t: "Ver proyectos", q: "portafolio" },
    ASESOR
  ]);

  /* ───── apertura / cierre del panel y teaser ───── */
  setTimeout(function () { if (launcher) launcher.classList.add("ready"); }, 1200);

  var greeted = false;
  function openPanel() {
    if (!panel) return;
    panel.classList.add("open");
    hideTeaser(true);
    if (!greeted) { greeted = true; setTimeout(function () { if (input) input.focus(); }, 350); }
  }
  function closePanel() { if (panel) panel.classList.remove("open"); }
  function togglePanel() {
    if (!panel) return;
    panel.classList.contains("open") ? closePanel() : openPanel();
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

  if (launcher) {
    launcher.addEventListener("click", function (e) { e.preventDefault(); togglePanel(); });
  }
  if (headX) headX.addEventListener("click", closePanel);
  if (teaser) {
    teaser.addEventListener("click", function (e) { if (e.target === teaserX) return; openPanel(); });
  }
  if (teaserX) {
    teaserX.addEventListener("click", function (e) { e.stopPropagation(); hideTeaser(true); });
  }

  setTimeout(showTeaser, 6000);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePanel(); });
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
