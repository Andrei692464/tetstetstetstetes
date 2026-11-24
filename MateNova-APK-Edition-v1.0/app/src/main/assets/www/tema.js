/* MateNova — setări, teme de culori și Developer Mode (explorer) */
(function(){
  var TEME = [
    {id:"nova",   nume:"Nova",      desc:"Mov închis — tema normală", culori:["#0a0610","#a855f7","#7c3aed","#150d22"], bara:"#0a0610"},
    {id:"ocean",  nume:"Ocean",     desc:"Albastru adânc",            culori:["#05101a","#38bdf8","#0284c7","#0b1c2c"], bara:"#05101a"},
    {id:"padure", nume:"Pădure",    desc:"Verde liniștit",            culori:["#06120c","#34d399","#059669","#0c1f15"], bara:"#06120c"},
    {id:"zi",     nume:"Zi senină", desc:"Luminoasă, pentru zi",      culori:["#faf7ff","#7c3aed","#6d28d9","#ffffff"], bara:"#faf7ff"}
  ];

  /* ——— Catalogul fișierelor + ce face fiecare ——— */
  var FISIERE = [
    {
      id:"index",
      nume:"index.html",
      tip:"html",
      rol:"Pagina principală (hub)",
      desc:"Prima pagină pe care o vezi. Conține hero-ul, cardurile către toate secțiunile (Teme, Fișe, Proiecte, Quiz, Jocuri, Orar, Catalog) și un quiz rapid.",
      face:[
        "Afișează numele elevului (localStorage)",
        "Exercițiul zilei (generat aleator)",
        "Lista de carduri către celelalte pagini",
        "Quiz rapid (5 întrebări) încărcat din quiz.js / Supabase"
      ],
      legaturi:["tema.js","style.css","common.js (parțial)","quiz.js"]
    },
    {
      id:"orar",
      nume:"orar.html",
      tip:"html",
      rol:"Orarul clasei",
      desc:"Pagina unde elevii văd programul orelor. Datele se încarcă din Supabase (tabela orar).",
      face:[
        "Citește orarul din baza de date",
        "Afișează zilele și orele într-o grilă",
        "Folosește common.js pentru nume elev + stil comun"
      ],
      legaturi:["common.js","tema.js","style.css"]
    },
    {
      id:"teme",
      nume:"teme.html",
      tip:"html",
      rol:"Lista de teme",
      desc:"Aici apar temele publicate de profesor. Elevul poate bifa „Am făcut-o” — se salvează în localStorage + Supabase.",
      face:[
        "Încarcă temele din Supabase",
        "Buton „Am făcut-o” / „Făcută” (common.js)",
        "Salvează pe device_id + nume elev"
      ],
      legaturi:["common.js","tema.js","style.css"]
    },
    {
      id:"fise",
      nume:"fise.html",
      tip:"html",
      rol:"Fișe de lucru",
      desc:"Fișe PDF / documente pe care elevii le pot deschide sau descărca. Link-urile vin din Supabase.",
      face:[
        "Listează fișele publicate",
        "Detectează tipul de fișier (PDF, DOCX etc.)",
        "Deschide în lightbox sau tab nou"
      ],
      legaturi:["common.js","tema.js","style.css"]
    },
    {
      id:"proiecte",
      nume:"proiecte.html",
      tip:"html",
      rol:"Proiecte de clasă",
      desc:"Pagina proiectelor pe care le faceți împreună la clasă. Similară structural cu Teme și Fișe.",
      face:[
        "Încarcă proiectele din baza de date",
        "Carduri cu descriere și eventual fișiere atașate"
      ],
      legaturi:["common.js","tema.js","style.css"]
    },
    {
      id:"quiz",
      nume:"quiz.html",
      tip:"html",
      rol:"Quiz-uri interactive",
      desc:"Pagina unde apar toate quiz-urile. Logica de întrebări, răspunsuri și scor este în quiz.js.",
      face:[
        "Listează quiz-urile disponibile",
        "Deschide un quiz într-un modal",
        "Calculează scorul și arată rezultatul"
      ],
      legaturi:["quiz.js","common.js","tema.js","style.css"]
    },
    {
      id:"jocuri",
      nume:"jocuri.html",
      tip:"html",
      rol:"Jocuri de matematică",
      desc:"Pagina jocurilor (calcul rapid, fracții etc.). Logica fiecărui joc e în jocuri.js.",
      face:[
        "Afișează lista de jocuri",
        "Pornește jocul ales într-un modal / fullscreen",
        "Ține scorul pe sesiune"
      ],
      legaturi:["jocuri.js","common.js","tema.js","style.css"]
    },
    {
      id:"catalog",
      nume:"catalog.html",
      tip:"html",
      rol:"Catalog Viva (note)",
      desc:"Integrare cu Catalog Viva. Elevul poate vedea / gestiona notele. Are interfață tip „fereastră” cu tab-uri.",
      face:[
        "Tab-uri pentru diferite vizualizări",
        "Fereastră fullscreen pentru catalog",
        "Stil propriu + stiluri din style.css"
      ],
      legaturi:["tema.js","style.css","common.js"]
    },
    {
      id:"common",
      nume:"common.js",
      tip:"js",
      rol:"Cod comun pentru toate paginile",
      desc:"Inima logică a site-ului. Se încarcă pe paginile care au nevoie de nume elev, teme făcute, raportare erori, lightbox, overlay de mentenanță și legătura cu Supabase.",
      face:[
        "Gestionează numele elevului (localStorage)",
        "Generează / salvează device_id",
        "Bifează teme (insert/delete în Supabase)",
        "Lightbox pentru imagini",
        "Buton „Raportează o problemă” + formular",
        "Overlay „Site temporar indisponibil”",
        "Funcții utile: esc(), dataRo(), amesteca() etc."
      ],
      legaturi:["Supabase","localStorage","toate paginile HTML"]
    },
    {
      id:"tema",
      nume:"tema.js",
      tip:"js",
      rol:"Setări + teme + Developer Mode",
      desc:"Acest fișier. Se încarcă pe aproape toate paginile. Gestionează temele de culori, butonul Setări și întregul Developer Mode (explorer-ul pe care îl vezi acum).",
      face:[
        "Aplică tema aleasă (data-tema pe <html>)",
        "Panoul de Setări (teme + Developer Mode)",
        "Explorer-ul de fișiere (lista dreapta, detalii stânga)",
        "Badge „DEV” când modul e activ",
        "Salvează preferințele în localStorage"
      ],
      legaturi:["style.css (variabile CSS)","localStorage"]
    },
    {
      id:"quizjs",
      nume:"quiz.js",
      tip:"js",
      rol:"Logică quiz-uri",
      desc:"Tot ce ține de pornirea unui quiz, afișarea întrebărilor, verificarea răspunsurilor și calculul scorului.",
      face:[
        "Încarcă întrebările unui quiz",
        "Afișează variante de răspuns",
        "Verifică răspunsul și trece la următoarea întrebare",
        "Afișează scorul final + butoane „Din nou” / „Gata”"
      ],
      legaturi:["quiz.html","common.js","Supabase"]
    },
    {
      id:"jocuriJS",
      nume:"jocuri.js",
      tip:"js",
      rol:"Logică jocuri",
      desc:"Conține jocurile propriu-zise (calcul rapid, fracții etc.), generarea de întrebări și interfața de joc.",
      face:[
        "Definește jocurile disponibile",
        "Generează exerciții aleatoare",
        "Gestionează timp / scor / nivel",
        "Modal de joc + închidere"
      ],
      legaturi:["jocuri.html","common.js"]
    },
    {
      id:"style",
      nume:"style.css",
      tip:"css",
      rol:"Stiluri globale + teme",
      desc:"Toate stilurile vizuale ale site-ului. Folosește variabile CSS (--bg, --p, --ink etc.) care se schimbă în funcție de data-tema setat de tema.js.",
      face:[
        "Variabile CSS pentru culori (temă)",
        "Layout: header, carduri, grilă, butoane",
        "Stiluri pentru modal, lightbox, raport",
        "Responsive (mobile / desktop)",
        "Stiluri speciale pentru fiecare temă (nova, ocean, pădure, zi)"
      ],
      legaturi:["toate paginile","tema.js"]
    }
  ];

  function citeste(){ try{ return localStorage.getItem("tema"); }catch(_){ return null; } }
  function scrie(v){ try{ localStorage.setItem("tema", v); }catch(_){} }
  function citesteDev(){ try{ return localStorage.getItem("dev_mode") === "1"; }catch(_){ return false; } }
  function scrieDev(v){ try{ localStorage.setItem("dev_mode", v ? "1" : "0"); }catch(_){} }
  function citesteGlass(){ try{ return localStorage.getItem("liquid_glass") === "1"; }catch(_){ return false; } }
  function scrieGlass(v){ try{ localStorage.setItem("liquid_glass", v ? "1" : "0"); }catch(_){} }
  function gaseste(id){ for(var i=0;i<TEME.length;i++) if(TEME[i].id===id) return TEME[i]; return TEME[0]; }
  function aplica(id){
    var t = gaseste(id);
    document.documentElement.setAttribute("data-tema", t.id);
    var m = document.querySelector('meta[name="theme-color"]');
    if(m) m.setAttribute("content", t.bara);
    return t.id;
  }
  var curenta = aplica(citeste());
  var devActiv = citesteDev();
  var glassActiv = citesteGlass();
  var fisierSelectat = FISIERE[0].id;

  /* Stiluri Liquid Glass — injectate o singură dată */
  (function injectGlassCSS(){
    if(document.getElementById("liquidGlassCSS")) return;
    var s = document.createElement("style");
    s.id = "liquidGlassCSS";
    s.textContent =
      "html.liquid-glass header.sus{" +
      "background:rgba(var(--bgr),.45)!important;" +
      "backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%);" +
      "border-bottom:1px solid rgba(255,255,255,.08)}" +
      "html.liquid-glass .card,html.liquid-glass .quiz,html.liquid-glass .zi," +
      "html.liquid-glass .set-panou,html.liquid-glass .modal .panou,html.liquid-glass .fereastra{" +
      "background:rgba(255,255,255,.06)!important;" +
      "backdrop-filter:blur(20px) saturate(150%);-webkit-backdrop-filter:blur(20px) saturate(150%);" +
      "border:1px solid rgba(255,255,255,.14)!important;" +
      "box-shadow:0 8px 32px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.12)}" +
      "html.liquid-glass .card:hover,html.liquid-glass .quiz:hover{" +
      "background:rgba(255,255,255,.1)!important;" +
      "border-color:rgba(255,255,255,.22)!important;" +
      "box-shadow:0 12px 40px rgba(var(--pr),.25),inset 0 1px 0 rgba(255,255,255,.18)}" +
      "html.liquid-glass .chip,html.liquid-glass .btn.gol{" +
      "background:rgba(255,255,255,.08)!important;" +
      "backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);" +
      "border:1px solid rgba(255,255,255,.15)!important}" +
      "html.liquid-glass .btn{" +
      "box-shadow:0 4px 24px rgba(var(--pr),.4),inset 0 1px 0 rgba(255,255,255,.2)}" +
      "html.liquid-glass footer{" +
      "background:rgba(var(--bgr),.5)!important;" +
      "backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);" +
      "border-top:1px solid rgba(255,255,255,.08)}" +
      "html.liquid-glass .set-tema,html.liquid-glass .dev-toggle,html.liquid-glass .btn-explorer{" +
      "background:rgba(255,255,255,.06)!important;" +
      "backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);" +
      "border-color:rgba(255,255,255,.12)!important}" +
      "html.liquid-glass body{" +
      "background-image:" +
      "radial-gradient(ellipse 80% 50% at 90% -10%,rgba(var(--pr2),.4),transparent 55%)," +
      "radial-gradient(ellipse 55% 40% at 5% 30%,rgba(var(--pr),.2),transparent 55%)," +
      "radial-gradient(ellipse 40% 30% at 60% 90%,rgba(var(--pr2),.15),transparent 50%)!important}" +
      /* iOS + liquid glass: sticlă deschisă */
      "html.liquid-glass[data-device=ios] header.sus{" +
      "background:rgba(255,255,255,.55)!important;border-bottom:0.5px solid rgba(0,0,0,.08)}" +
      "html.liquid-glass[data-device=ios] .card,html.liquid-glass[data-device=ios] .quiz,html.liquid-glass[data-device=ios] .zi," +
      "html.liquid-glass[data-device=ios] .set-panou,html.liquid-glass[data-device=ios] .modal .panou{" +
      "background:rgba(255,255,255,.65)!important;" +
      "border:1px solid rgba(255,255,255,.5)!important;" +
      "box-shadow:0 8px 32px rgba(0,0,0,.08),inset 0 1px 0 rgba(255,255,255,.8)}" +
      "html.liquid-glass[data-device=ios] body{background-image:none!important;background:#e8e8ed!important}" +
      "html.liquid-glass[data-device=ios] footer{background:rgba(255,255,255,.5)!important}";
    document.head.appendChild(s);
  })();

  function aplicaGlass(on){
    glassActiv = !!on;
    scrieGlass(glassActiv);
    document.documentElement.classList.toggle("liquid-glass", glassActiv);
  }

  function aplicaDevMode(on){
    devActiv = !!on;
    scrieDev(devActiv);
    document.documentElement.classList.toggle("dev-mode", devActiv);
    var badge = document.getElementById("devBadge");
    if(devActiv){
      if(!badge){
        badge = document.createElement("div");
        badge.id = "devBadge";
        badge.className = "dev-badge";
        badge.innerHTML = "🛠️ DEV";
        badge.title = "Developer Mode — click pentru explorer";
        badge.addEventListener("click", function(){ deschideExplorer(); });
        document.body.appendChild(badge);
      }
    } else if(badge){
      badge.remove();
    }
  }

  /* ——— Explorer full-screen ——— */
  function creeazaExplorer(){
    if(document.getElementById("devExplorer")) return;

    var st = document.createElement("style");
    st.id = "devExplorerStyles";
    st.textContent =
      ".dev-explorer{position:fixed;inset:0;z-index:90;display:none;background:var(--bg);color:var(--ink);font-family:inherit}" +
      ".dev-explorer.activ{display:flex;flex-direction:column}" +
      ".dev-top{display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--line);background:var(--surface);flex-shrink:0}" +
      ".dev-top h2{margin:0;font-size:1.15rem;flex:1}" +
      ".dev-top .dev-inchide{font:inherit;cursor:pointer;border:1px solid var(--line);background:var(--surface2);color:var(--ink);width:38px;height:38px;border-radius:10px;font-size:1.1rem}" +
      ".dev-top .dev-inchide:hover{border-color:var(--p)}" +
      ".dev-corp{flex:1;display:flex;min-height:0;overflow:hidden}" +
      /* stânga = detalii */
      ".dev-stanga{flex:1;overflow:auto;padding:28px 32px;border-right:1px solid var(--line)}" +
      ".dev-stanga .tip-mare{display:inline-block;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;padding:4px 10px;border-radius:6px;background:var(--p);color:#fff;margin-bottom:10px}" +
      ".dev-stanga .tip-mare.css{background:#0ea5e9}" +
      ".dev-stanga .tip-mare.js{background:#eab308;color:#111}" +
      ".dev-stanga h3{margin:0 0 6px;font-size:1.6rem;font-family:'Bricolage Grotesque',sans-serif}" +
      ".dev-stanga .rol{color:var(--muted);margin:0 0 18px;font-size:1rem}" +
      ".dev-stanga .desc{line-height:1.55;margin:0 0 22px}" +
      ".dev-stanga h4{margin:0 0 10px;font-size:.85rem;text-transform:uppercase;letter-spacing:.07em;color:var(--p)}" +
      ".dev-stanga ul{margin:0 0 22px;padding-left:20px}" +
      ".dev-stanga li{margin:5px 0;line-height:1.4}" +
      ".dev-stanga .taguri{display:flex;flex-wrap:wrap;gap:8px}" +
      ".dev-stanga .tag{font-size:.8rem;padding:5px 10px;border-radius:8px;background:var(--surface2);border:1px solid var(--line)}" +
      /* dreapta = lista fișiere */
      ".dev-dreapta{width:min(320px,38vw);flex-shrink:0;overflow:auto;background:var(--surface);padding:12px 0}" +
      ".dev-dreapta .grup{padding:8px 16px 4px;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}" +
      ".dev-fis{display:flex;align-items:center;gap:10px;width:100%;text-align:left;font:inherit;cursor:pointer;border:none;background:transparent;color:var(--ink);padding:10px 16px;border-left:3px solid transparent;transition:.12s}" +
      ".dev-fis:hover{background:var(--surface2)}" +
      ".dev-fis.activ{background:var(--surface2);border-left-color:var(--p)}" +
      ".dev-fis .tip{font-size:.65rem;font-weight:800;text-transform:uppercase;padding:2px 6px;border-radius:4px;background:var(--p);color:#fff;flex-shrink:0}" +
      ".dev-fis .tip.css{background:#0ea5e9}" +
      ".dev-fis .tip.js{background:#eab308;color:#111}" +
      ".dev-fis .nume{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.84rem;font-weight:600}" +
      ".dev-fis .mic{display:block;font-size:.75rem;color:var(--muted);margin-top:1px}" +
      ".dev-badge{position:fixed;bottom:16px;left:16px;z-index:70;background:var(--p);color:#fff;font-size:.75rem;font-weight:800;padding:6px 10px;border-radius:999px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3);letter-spacing:.04em}" +
      ".dev-badge:hover{filter:brightness(1.1)}" +
      "@media(max-width:700px){.dev-corp{flex-direction:column-reverse}.dev-dreapta{width:100%;max-height:40vh;border-top:1px solid var(--line)}.dev-stanga{padding:20px}}";
    document.head.appendChild(st);

    var exp = document.createElement("div");
    exp.id = "devExplorer";
    exp.className = "dev-explorer";
    exp.setAttribute("role","dialog");
    exp.setAttribute("aria-modal","true");
    exp.setAttribute("aria-label","Developer Mode — explorer fișiere");

    var html = '<div class="dev-top">' +
      '<h2>🛠️ Developer Mode — Explorer</h2>' +
      '<button type="button" class="dev-inchide" id="devExpInchide" aria-label="Închide">✕</button>' +
      '</div><div class="dev-corp">' +
      '<div class="dev-stanga" id="devDetalii"></div>' +
      '<div class="dev-dreapta" id="devLista"></div>' +
      '</div>';
    exp.innerHTML = html;
    document.body.appendChild(exp);

    // construiește lista din dreapta
    var lista = document.getElementById("devLista");
    var grupe = {html:"Pagini HTML", js:"Scripturi JS", css:"Stiluri CSS"};
    var ordine = ["html","js","css"];
    ordine.forEach(function(tip){
      var g = document.createElement("div");
      g.className = "grup";
      g.textContent = grupe[tip];
      lista.appendChild(g);
      FISIERE.filter(function(f){ return f.tip === tip; }).forEach(function(f){
        var b = document.createElement("button");
        b.type = "button";
        b.className = "dev-fis";
        b.dataset.id = f.id;
        b.innerHTML = '<span class="tip ' + f.tip + '">' + f.tip + '</span>' +
          '<span><span class="nume">' + f.nume + '</span><span class="mic">' + f.rol + '</span></span>';
        b.addEventListener("click", function(){
          fisierSelectat = f.id;
          afiseazaDetalii();
          lista.querySelectorAll(".dev-fis").forEach(function(x){ x.classList.toggle("activ", x.dataset.id === f.id); });
        });
        lista.appendChild(b);
      });
    });

    document.getElementById("devExpInchide").addEventListener("click", inchideExplorer);
    exp.addEventListener("keydown", function(e){
      if(e.key === "Escape"){ inchideExplorer(); e.preventDefault(); }
    });
  }

  function afiseazaDetalii(){
    var f = null;
    for(var i=0;i<FISIERE.length;i++) if(FISIERE[i].id === fisierSelectat){ f = FISIERE[i]; break; }
    if(!f) f = FISIERE[0];
    var box = document.getElementById("devDetalii");
    if(!box) return;
    var html = '<span class="tip-mare ' + f.tip + '">' + f.tip + '</span>' +
      '<h3>' + f.nume + '</h3>' +
      '<p class="rol">' + f.rol + '</p>' +
      '<p class="desc">' + f.desc + '</p>' +
      '<h4>Ce face acest fișier</h4><ul>';
    f.face.forEach(function(x){ html += '<li>' + x + '</li>'; });
    html += '</ul><h4>Legături / dependențe</h4><div class="taguri">';
    f.legaturi.forEach(function(x){ html += '<span class="tag">' + x + '</span>'; });
    html += '</div>';
    box.innerHTML = html;
  }

  function deschideExplorer(){
    creeazaExplorer();
    var exp = document.getElementById("devExplorer");
    exp.classList.add("activ");
    afiseazaDetalii();
    var lista = document.getElementById("devLista");
    if(lista){
      lista.querySelectorAll(".dev-fis").forEach(function(x){
        x.classList.toggle("activ", x.dataset.id === fisierSelectat);
      });
    }
    setTimeout(function(){
      var btn = document.getElementById("devExpInchide");
      if(btn) btn.focus();
    }, 30);
  }
  function inchideExplorer(){
    var exp = document.getElementById("devExplorer");
    if(exp) exp.classList.remove("activ");
  }

  function init(){
    aplica(curenta);
    aplicaGlass(glassActiv);
    aplicaDevMode(devActiv);

    var bara = document.querySelector("header.sus .bara");
    if(!bara || document.getElementById("btnSetari")) return;

    var st = document.createElement("style");
    st.textContent =
      ".btn-setari{white-space:nowrap}" +
      ".set-fundal{position:fixed;inset:0;z-index:80;display:none;place-items:center;padding:18px;background:rgba(5,2,10,.72);backdrop-filter:blur(6px)}" +
      ".set-fundal.activ{display:grid}" +
      ".set-panou{width:min(520px,100%);max-height:92vh;overflow:auto;background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:22px;padding:24px;box-shadow:0 20px 70px -10px rgba(var(--pr),.5)}" +
      ".set-cap{display:flex;align-items:center;gap:10px;margin-bottom:4px}" +
      ".set-cap h2{margin:0;font-size:1.4rem;flex:1}" +
      ".set-x{font:inherit;cursor:pointer;border:1px solid var(--line);background:var(--surface2);color:var(--ink);width:36px;height:36px;border-radius:10px}" +
      ".set-x:hover{border-color:var(--p)}" +
      ".set-sub{margin:0 0 16px;color:var(--muted);font-size:.92rem}" +
      ".set-sec{font-weight:800;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:var(--p);margin:18px 0 10px}" +
      ".set-teme{display:grid;grid-template-columns:1fr 1fr;gap:12px}" +
      "@media(max-width:420px){.set-teme{grid-template-columns:1fr}}" +
      ".set-tema{font:inherit;text-align:left;cursor:pointer;color:var(--ink);background:var(--surface2);border:2px solid var(--line);border-radius:16px;padding:10px;transition:.15s;position:relative}" +
      ".set-tema:hover{border-color:var(--p);transform:translateY(-2px)}" +
      ".set-tema[aria-checked=true]{border-color:var(--p);box-shadow:0 0 0 4px var(--p-soft)}" +
      ".set-prev{height:64px;border-radius:10px;border:1px solid rgba(128,128,128,.3);padding:8px;display:flex;flex-direction:column;gap:6px;justify-content:center;margin-bottom:8px}" +
      ".set-prev i{display:block;height:9px;border-radius:5px}" +
      ".set-prev i:nth-child(1){width:60%}.set-prev i:nth-child(2){width:85%;opacity:.55}.set-prev i:nth-child(3){width:38%}" +
      ".set-tema b{display:block;font-family:'Bricolage Grotesque',sans-serif;font-size:1rem}" +
      ".set-tema small{color:var(--muted);font-size:.78rem;line-height:1.3;display:block}" +
      ".set-bifa{position:absolute;top:8px;right:8px;width:24px;height:24px;border-radius:50%;background:var(--p);color:#fff;display:none;place-items:center;font-size:.8rem;font-weight:800}" +
      ".set-tema[aria-checked=true] .set-bifa{display:grid}" +
      ".dev-toggle{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--surface2);border:1px solid var(--line);border-radius:14px;cursor:pointer;user-select:none}" +
      ".dev-toggle:hover{border-color:var(--p)}" +
      ".dev-toggle input{position:absolute;opacity:0;width:0;height:0}" +
      ".dev-switch{width:44px;height:24px;background:#555;border-radius:12px;position:relative;flex-shrink:0;transition:.2s}" +
      ".dev-switch::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;background:#fff;border-radius:50%;transition:.2s}" +
      ".dev-toggle input:checked + .dev-switch{background:var(--p)}" +
      ".dev-toggle input:checked + .dev-switch::after{transform:translateX(20px)}" +
      ".dev-toggle b{display:block;font-size:.95rem}" +
      ".dev-toggle small{color:var(--muted);font-size:.8rem}" +
      ".btn-explorer{display:block;width:100%;margin-top:12px;font:inherit;font-weight:700;cursor:pointer;border:1px solid var(--line);background:var(--surface2);color:var(--ink);border-radius:12px;padding:12px 16px;text-align:left}" +
      ".btn-explorer:hover{border-color:var(--p);background:var(--surface)}" +
      ".btn-explorer span{display:block;font-size:.8rem;font-weight:400;color:var(--muted);margin-top:2px}";
    document.head.appendChild(st);

    var btn = document.createElement("button");
    btn.id = "btnSetari"; btn.type = "button"; btn.className = "chip btn-setari";
    btn.setAttribute("aria-haspopup","dialog"); btn.title = "Setări";
    btn.textContent = "⚙️ Setări";
    bara.appendChild(btn);

    var fundal = document.createElement("div");
    fundal.className = "set-fundal"; fundal.id = "setFundal";

    var html = '<div class="set-panou" role="dialog" aria-modal="true" aria-labelledby="setTitlu">' +
      '<div class="set-cap"><h2 id="setTitlu">⚙️ Setări</h2><button type="button" class="set-x" id="setInchide" aria-label="Închide setările">✕</button></div>' +
      '<p class="set-sub">Alege cum arată MateNova. Se salvează pe acest dispozitiv.</p>' +
      '<p class="set-sec">Tema culorilor</p><div class="set-teme" role="radiogroup" aria-label="Tema culorilor">';

    TEME.forEach(function(t){
      html += '<button type="button" class="set-tema" role="radio" data-tema="' + t.id + '" aria-checked="false">' +
        '<span class="set-bifa" aria-hidden="true">✓</span>' +
        '<div class="set-prev" style="background:' + t.culori[0] + '"><i style="background:' + t.culori[1] + '"></i><i style="background:' + t.culori[3] + '"></i><i style="background:' + t.culori[2] + '"></i></div>' +
        '<b>' + t.nume + '</b><small>' + t.desc + '</small></button>';
    });
    html += '</div>';

    /* Liquid Glass */
    html += '<p class="set-sec">Efect vizual</p>';
    html += '<label class="dev-toggle">' +
      '<input type="checkbox" id="glassToggle"' + (glassActiv ? ' checked' : '') + '>' +
      '<span class="dev-switch" aria-hidden="true"></span>' +
      '<span><b>🫧 Liquid Glass</b><small>Sticlă mată pe carduri, header și panouri</small></span>' +
      '</label>';

    /* Dispozitiv */
    var devCurent = (window.MateNovaBoot && window.MateNovaBoot.getDevice) ? window.MateNovaBoot.getDevice() : (function(){ try{ return localStorage.getItem("mn_device")||"desktop"; }catch(_){ return "desktop"; } })();
    html += '<p class="set-sec">Dispozitiv / interfață</p>';
    html += '<div class="set-teme" style="grid-template-columns:1fr" id="setDeviceGroup">';
    [
      {id:"desktop", ico:"💻", nume:"Calculator", desc:"Stil desktop clasic"},
      {id:"android", ico:"🤖", nume:"Android", desc:"Material Design"},
      {id:"ios", ico:"🍎", nume:"iOS", desc:"Design luminos Apple"}
    ].forEach(function(d){
      html += '<button type="button" class="set-tema set-device" data-device="'+d.id+'" aria-checked="'+(devCurent===d.id?"true":"false")+'" style="display:flex;align-items:center;gap:12px;padding:12px 14px">' +
        '<span style="font-size:1.5rem">'+d.ico+'</span><span style="flex:1"><b>'+d.nume+'</b><small>'+d.desc+'</small></span>' +
        '<span class="set-bifa" aria-hidden="true">✓</span></button>';
    });
    html += '</div>';
    html += '<button type="button" class="btn-explorer" id="btnReselectDevice" style="margin-top:10px">🔄 Reia alegerea la pornire<span>Șterge preferința și arată din nou ecranul Calculator / Telefon</span></button>';

    html += '<p class="set-sec">Developer Mode</p>';
    html += '<label class="dev-toggle">' +
      '<input type="checkbox" id="devToggle"' + (devActiv ? ' checked' : '') + '>' +
      '<span class="dev-switch" aria-hidden="true"></span>' +
      '<span><b>🛠️ Activează Developer Mode</b><small>Badge DEV + acces la explorer-ul de fișiere</small></span>' +
      '</label>';
    html += '<button type="button" class="btn-explorer" id="btnDeschideExplorer">' +
      '📂 Deschide Explorer-ul de fișiere' +
      '<span>Listă fișiere în dreapta · detalii în stânga</span></button>';

    html += '</div>';
    fundal.innerHTML = html;
    document.body.appendChild(fundal);

    // teme de culori (nu și butoanele de dispozitiv)
    var carduri = fundal.querySelectorAll(".set-tema[data-tema]");
    function marcheaza(){
      for(var i=0;i<carduri.length;i++) carduri[i].setAttribute("aria-checked", carduri[i].getAttribute("data-tema")===curenta ? "true" : "false");
    }
    marcheaza();
    for(var i=0;i<carduri.length;i++){
      carduri[i].addEventListener("click", function(){
        curenta = aplica(this.getAttribute("data-tema"));
        scrie(curenta); marcheaza();
      });
    }

    // Liquid Glass
    var glassToggle = document.getElementById("glassToggle");
    if(glassToggle) glassToggle.addEventListener("change", function(){
      aplicaGlass(glassToggle.checked);
    });

    // toggle dev
    var toggle = document.getElementById("devToggle");
    toggle.addEventListener("change", function(){
      aplicaDevMode(toggle.checked);
    });

    // dispozitiv
    fundal.querySelectorAll(".set-device").forEach(function(btn){
      btn.addEventListener("click", function(){
        var d = this.getAttribute("data-device");
        if(window.MateNovaBoot && window.MateNovaBoot.setDevice) window.MateNovaBoot.setDevice(d);
        else { try{ localStorage.setItem("mn_device", d); }catch(_){ } document.documentElement.setAttribute("data-device", d); }
        fundal.querySelectorAll(".set-device").forEach(function(b){ b.setAttribute("aria-checked", b.getAttribute("data-device")===d ? "true" : "false"); });
      });
    });
    var btnReselect = document.getElementById("btnReselectDevice");
    if(btnReselect) btnReselect.addEventListener("click", function(){
      try{ localStorage.removeItem("mn_device"); }catch(_){}
      inchideSetari();
      if(window.MateNovaBoot && window.MateNovaBoot.openPicker) window.MateNovaBoot.openPicker();
    });

    // buton explorer
    document.getElementById("btnDeschideExplorer").addEventListener("click", function(){
      inchideSetari();
      deschideExplorer();
    });

    function deschideSetari(){
      fundal.classList.add("activ");
      var sel = fundal.querySelector('.set-tema[aria-checked="true"]') || carduri[0];
      setTimeout(function(){ sel.focus(); }, 30);
    }
    function inchideSetari(){ fundal.classList.remove("activ"); btn.focus(); }

    btn.addEventListener("click", deschideSetari);
    document.getElementById("setInchide").addEventListener("click", inchideSetari);
    fundal.addEventListener("click", function(e){ if(e.target===fundal) inchideSetari(); });
    document.addEventListener("keydown", function(e){
      if(!fundal.classList.contains("activ")) return;
      if(e.key==="Escape"){ inchideSetari(); return; }
      if(e.key==="Tab"){
        var f = fundal.querySelectorAll("button, input"), p = f[0], u = f[f.length-1];
        if(e.shiftKey && document.activeElement===p){ e.preventDefault(); u.focus(); }
        else if(!e.shiftKey && document.activeElement===u){ e.preventDefault(); p.focus(); }
      }
    });
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
