/* MateNova — boot: loading + alegere dispozitiv (Calculator / Telefon → Android / iOS) + PWA */
(function () {
  var KEY_DEVICE = "mn_device"; // desktop | android | ios
  var MAX_LOAD_MS = 6000;
  var MIN_LOAD_MS = 1800;

  function lsGet(k) {
    try { return localStorage.getItem(k); } catch (_) { return null; }
  }
  function lsSet(k, v) {
    try { localStorage.setItem(k, v); } catch (_) {}
  }

  function aplicaDevice(dev) {
    document.documentElement.setAttribute("data-device", dev || "desktop");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      if (dev === "ios") meta.setAttribute("content", "#f2f2f7");
      else if (dev === "android") meta.setAttribute("content", "#121212");
      else meta.setAttribute("content", "#0a0610");
    }
  }

  var salvat = lsGet(KEY_DEVICE);
  if (salvat === "desktop" || salvat === "android" || salvat === "ios") {
    aplicaDevice(salvat);
  }

  /* ——— Stiluri boot (splash + picker + UI Android/iOS) ——— */
  var style = document.createElement("style");
  style.id = "bootStyles";
  style.textContent =
    "#bootOverlay{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;" +
    "background:#0a0610;color:#f5f0ff;font-family:system-ui,-apple-system,sans-serif;transition:opacity .4s ease}" +
    "#bootOverlay.fade{opacity:0;pointer-events:none}" +
    "#bootOverlay .logo-boot{font-size:3.2rem;line-height:1;margin-bottom:12px;animation:bootPulse 1.4s ease-in-out infinite}" +
    "#bootOverlay h1{margin:0 0 6px;font-size:1.7rem;font-weight:800;letter-spacing:-.03em}" +
    "#bootOverlay .sub{color:#a99bc4;margin:0 0 28px;font-size:.95rem}" +
    "#bootOverlay .bar-wrap{width:min(240px,70vw);height:4px;background:#2c1d45;border-radius:99px;overflow:hidden}" +
    "#bootOverlay .bar{height:100%;width:0%;background:linear-gradient(90deg,#a855f7,#7c3aed);border-radius:99px;transition:width .15s linear}" +
    "@keyframes bootPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:.85}}" +
    "#bootPicker{position:fixed;inset:0;z-index:9998;display:none;align-items:center;justify-content:center;" +
    "background:rgba(5,2,12,.92);backdrop-filter:blur(12px);padding:20px;font-family:system-ui,-apple-system,sans-serif}" +
    "#bootPicker.activ{display:flex}" +
    "#bootPicker .cutie{width:min(440px,100%);background:#150d22;border:1px solid #2c1d45;border-radius:24px;padding:28px 24px;color:#f5f0ff;box-shadow:0 24px 80px -12px rgba(168,85,247,.4)}" +
    "#bootPicker h2{margin:0 0 6px;font-size:1.45rem;font-weight:800}" +
    "#bootPicker .desc{margin:0 0 20px;color:#a99bc4;font-size:.92rem;line-height:1.45}" +
    "#bootPicker .optiuni{display:grid;gap:12px}" +
    "#bootPicker .opt{display:flex;align-items:center;gap:14px;width:100%;text-align:left;font:inherit;cursor:pointer;" +
    "border:2px solid #2c1d45;background:#1d1230;color:#f5f0ff;border-radius:16px;padding:16px 18px;transition:.15s}" +
    "#bootPicker .opt:hover,#bootPicker .opt:focus-visible{border-color:#a855f7;transform:translateY(-2px);outline:none}" +
    "#bootPicker .opt .ico{font-size:1.8rem;width:48px;height:48px;display:grid;place-items:center;background:rgba(168,85,247,.15);border-radius:14px;flex-shrink:0}" +
    "#bootPicker .opt b{display:block;font-size:1.05rem}" +
    "#bootPicker .opt small{display:block;color:#a99bc4;font-size:.82rem;margin-top:2px}" +
    "#bootPicker .inapoi{margin-top:14px;background:none;border:none;color:#a99bc4;font:inherit;cursor:pointer;text-decoration:underline;font-size:.88rem}" +
    "#bootPicker .inapoi:hover{color:#f5f0ff}" +
    "#pwaBanner{position:fixed;bottom:0;left:0;right:0;z-index:60;display:none;align-items:center;gap:12px;flex-wrap:wrap;" +
    "padding:14px 18px;background:#1d1230;border-top:1px solid #2c1d45;color:#f5f0ff;font-family:system-ui,sans-serif;font-size:.9rem}" +
    "#pwaBanner.activ{display:flex}" +
    "#pwaBanner .btn-inst{font:inherit;font-weight:700;cursor:pointer;border:none;border-radius:10px;padding:10px 16px;" +
    "background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff}" +
    "#pwaBanner .btn-later{font:inherit;cursor:pointer;border:1px solid #2c1d45;background:transparent;color:#a99bc4;border-radius:10px;padding:10px 14px}" +
    /* Android */
    "html[data-device=android] body{font-family:Roboto,'Atkinson Hyperlegible',system-ui,sans-serif}" +
    "html[data-device=android] header.sus{background:#1e1e1e;border-bottom:none;box-shadow:0 2px 4px rgba(0,0,0,.3)}" +
    "html[data-device=android] .logo i{border-radius:50%;box-shadow:none}" +
    "html[data-device=android] nav a{border-radius:20px}" +
    "html[data-device=android] .card,html[data-device=android] .quiz,html[data-device=android] .zi{border-radius:12px;border:none;box-shadow:0 1px 3px rgba(0,0,0,.35)}" +
    "html[data-device=android] .btn{border-radius:24px;text-transform:uppercase;letter-spacing:.04em;font-size:.88rem}" +
    "html[data-device=android] .chip{border-radius:16px}" +
    "html[data-device=android] footer{border-top:none;background:#121212}" +
    /* iOS */
    "html[data-device=ios]{color-scheme:light}" +
    "html[data-device=ios] body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Atkinson Hyperlegible',system-ui,sans-serif;background:#f2f2f7;color:#1c1c1e;background-image:none}" +
    "html[data-device=ios] header.sus{background:rgba(242,242,247,.82);backdrop-filter:saturate(180%) blur(20px);border-bottom:0.5px solid rgba(0,0,0,.12)}" +
    "html[data-device=ios] .logo{color:#1c1c1e}" +
    "html[data-device=ios] .logo i{border-radius:11px;box-shadow:none}" +
    "html[data-device=ios] .clasa{background:rgba(0,122,255,.12);color:#007aff;border-color:transparent}" +
    "html[data-device=ios] .chip{background:rgba(120,120,128,.12);border:none;color:#1c1c1e;border-radius:10px}" +
    "html[data-device=ios] nav a{color:#8e8e93;border-radius:10px}" +
    "html[data-device=ios] nav a:hover,html[data-device=ios] nav a[aria-current=page]{color:#007aff;background:rgba(0,122,255,.1)}" +
    "html[data-device=ios] h1,html[data-device=ios] h2,html[data-device=ios] h3{color:#1c1c1e}" +
    "html[data-device=ios] .intro,html[data-device=ios] .cap p,html[data-device=ios] .card p{color:#636366}" +
    "html[data-device=ios] .card,html[data-device=ios] .quiz,html[data-device=ios] .zi{background:#fff;border:none;border-radius:14px;box-shadow:0 1px 3px rgba(0,0,0,.06)}" +
    "html[data-device=ios] .btn{background:#007aff;border-radius:12px;box-shadow:none}" +
    "html[data-device=ios] .btn.gol{background:transparent;color:#007aff;border:1.5px solid #007aff}" +
    "html[data-device=ios] .zi{border-top:3px solid #007aff}" +
    "html[data-device=ios] .zi .et,html[data-device=ios] .eticheta{color:#007aff}" +
    "html[data-device=ios] h1 em{background:linear-gradient(90deg,#007aff,#5856d6);-webkit-background-clip:text;background-clip:text}" +
    "html[data-device=ios] footer{background:#f2f2f7;border-top:0.5px solid rgba(0,0,0,.1);color:#8e8e93}" +
    "html[data-device=ios] .modal .panou,html[data-device=ios] .set-panou{background:#fff;color:#1c1c1e}" +
    "html[data-device=ios] a{color:#007aff}";
  document.head.appendChild(style);

  function arataSplash() {
    var ov = document.createElement("div");
    ov.id = "bootOverlay";
    ov.innerHTML =
      '<div class="logo-boot">✨</div>' +
      "<h1>MateNova</h1>" +
      '<p class="sub">matematică pentru clasa a V-a</p>' +
      '<div class="bar-wrap"><div class="bar" id="bootBar"></div></div>';
    document.documentElement.appendChild(ov);
    return ov;
  }

  function ruleazaLoading(done) {
    var ov = arataSplash();
    var bar = document.getElementById("bootBar");
    var start = Date.now();
    var finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      clearInterval(timer);
      clearTimeout(maxTimer);
      if (bar) bar.style.width = "100%";
      setTimeout(function () {
        ov.classList.add("fade");
        setTimeout(function () {
          if (ov.parentNode) ov.remove();
          done();
        }, 400);
      }, 120);
    }

    var timer = setInterval(function () {
      var elapsed = Date.now() - start;
      if (bar) bar.style.width = Math.min(92, (elapsed / MAX_LOAD_MS) * 100) + "%";
      if (elapsed >= MAX_LOAD_MS) finish();
    }, 40);

    function tryEarly() {
      var wait = Math.max(0, MIN_LOAD_MS - (Date.now() - start));
      setTimeout(finish, wait);
    }
    if (document.readyState === "complete") tryEarly();
    else window.addEventListener("load", tryEarly);

    var maxTimer = setTimeout(finish, MAX_LOAD_MS + 200);
  }

  function arataPicker() {
    if (document.getElementById("bootPicker")) return;
    var p = document.createElement("div");
    p.id = "bootPicker";
    p.className = "activ";
    p.setAttribute("role", "dialog");
    p.setAttribute("aria-modal", "true");
    p.setAttribute("aria-labelledby", "bootPickTitlu");

    function ecran1() {
      p.innerHTML =
        '<div class="cutie">' +
        '<h2 id="bootPickTitlu">Alege dispozitivul</h2>' +
        '<p class="desc">Cum vrei să arate MateNova? Poți schimba oricând din Setări.</p>' +
        '<div class="optiuni">' +
        '<button type="button" class="opt" data-go="desktop">' +
        '<span class="ico">💻</span><span><b>Calculator</b><small>Interfață desktop — stilul actual</small></span></button>' +
        '<button type="button" class="opt" data-go="telefon">' +
        '<span class="ico">📱</span><span><b>Telefon</b><small>Alege între Android și iOS</small></span></button>' +
        "</div></div>";
      p.querySelector('[data-go="desktop"]').onclick = function () { alege("desktop"); };
      p.querySelector('[data-go="telefon"]').onclick = ecran2;
    }

    function ecran2() {
      p.innerHTML =
        '<div class="cutie">' +
        '<h2 id="bootPickTitlu">Ce telefon folosești?</h2>' +
        '<p class="desc">Interfața se adaptează la sistemul ales.</p>' +
        '<div class="optiuni">' +
        '<button type="button" class="opt" data-go="android">' +
        '<span class="ico">🤖</span><span><b>Android</b><small>Material Design — butoane rotunde, umbre</small></span></button>' +
        '<button type="button" class="opt" data-go="ios">' +
        '<span class="ico">🍎</span><span><b>iOS</b><small>Design luminos, stil Apple</small></span></button>' +
        "</div>" +
        '<button type="button" class="inapoi" id="bootInapoi">← Înapoi</button></div>';
      p.querySelector('[data-go="android"]').onclick = function () { alege("android"); };
      p.querySelector('[data-go="ios"]').onclick = function () { alege("ios"); };
      document.getElementById("bootInapoi").onclick = ecran1;
    }

    function alege(dev) {
      lsSet(KEY_DEVICE, dev);
      aplicaDevice(dev);
      p.classList.remove("activ");
      setTimeout(function () {
        if (p.parentNode) p.remove();
        window.dispatchEvent(new CustomEvent("mn-device-ready", { detail: { device: dev } }));
      }, 200);
    }

    document.body.appendChild(p);
    ecran1();
  }

  /* PWA */
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (lsGet("pwa_dismiss") === "1") return;
    if (document.getElementById("pwaBanner")) return;
    var b = document.createElement("div");
    b.id = "pwaBanner";
    b.className = "activ";
    b.innerHTML =
      "<span>📦 Instalează MateNova pe dispozitiv — funcționează și offline.</span>" +
      '<button type="button" class="btn-inst" id="pwaInstall">Instalează</button>' +
      '<button type="button" class="btn-later" id="pwaLater">Mai târziu</button>';
    document.body.appendChild(b);
    document.getElementById("pwaInstall").onclick = function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () {
        deferredPrompt = null;
        b.remove();
      });
    };
    document.getElementById("pwaLater").onclick = function () {
      lsSet("pwa_dismiss", "1");
      b.remove();
    };
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }

  function dupaLoad() {
    var d = lsGet(KEY_DEVICE);
    if (d === "desktop" || d === "android" || d === "ios") {
      aplicaDevice(d);
      window.dispatchEvent(new CustomEvent("mn-device-ready", { detail: { device: d } }));
    } else {
      arataPicker();
    }
  }

  function start() {
    ruleazaLoading(dupaLoad);
  }
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);

  window.MateNovaBoot = {
    getDevice: function () { return lsGet(KEY_DEVICE) || "desktop"; },
    setDevice: function (dev) {
      if (dev !== "desktop" && dev !== "android" && dev !== "ios") return;
      lsSet(KEY_DEVICE, dev);
      aplicaDevice(dev);
      window.dispatchEvent(new CustomEvent("mn-device-ready", { detail: { device: dev } }));
    },
    openPicker: function () { arataPicker(); }
  };
})();
