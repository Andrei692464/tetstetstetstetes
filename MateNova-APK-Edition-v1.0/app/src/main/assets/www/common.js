/* MateNova — cod comun pentru toate paginile */
document.body.insertAdjacentHTML("beforeend", "<div class=\"lightbox\" id=\"lightbox\"><button class=\"inchide\" id=\"inchideLb\" aria-label=\"\u00cenchide imaginea\">\u2715</button><img id=\"lbImg\" alt=\"\"></div>\n<div class=\"overlay-site\" id=\"overlaySite\" role=\"alertdialog\" aria-modal=\"true\"><div class=\"cutie\"><div class=\"cod-mare\" id=\"overlayCod\"></div><h2>Site temporar indisponibil</h2><p id=\"overlayDesc\"></p></div></div>\n<button class=\"btn-raport\" id=\"deschideRaport\" type=\"button\" aria-haspopup=\"dialog\">\u26a0\ufe0f Raporteaz\u0103</button>\n\n<div class=\"modal\" id=\"modalRaport\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"titluRaport\">\n  <div class=\"panou\">\n    <div class=\"top\">\n      <h3 id=\"titluRaport\">Raporteaz\u0103 o problem\u0103</h3>\n      <button class=\"inchide\" id=\"inchideRaport\" type=\"button\" aria-label=\"\u00cenchide\">\u2715</button>\n    </div>\n    <form id=\"formRaport\" novalidate>\n      <label class=\"camp\">\n        <span>Ce problem\u0103 are site-ul?</span>\n        <textarea id=\"raportText\" maxlength=\"1500\" placeholder=\"Ex: Fi\u0219a de la teme nu se deschide, un joc nu merge\u2026\" required></textarea>\n        <div class=\"contor\"><span id=\"raportContor\">0</span>/1500</div>\n      </label>\n      <label class=\"camp\">\n        <span>Numele t\u0103u <small>(op\u021bional)</small></span>\n        <input id=\"raportNume\" type=\"text\" maxlength=\"80\" autocomplete=\"name\">\n      </label>\n      <div class=\"hp\" aria-hidden=\"true\"><label>Nu completa<input id=\"raportHp\" type=\"text\" tabindex=\"-1\" autocomplete=\"off\"></label></div>\n      <div class=\"raport-mesaj\" id=\"raportMesaj\" role=\"status\" aria-live=\"polite\"></div>\n      <div class=\"butoane\">\n        <button class=\"btn\" id=\"trimiteRaport\" type=\"submit\">Trimite raportul</button>\n        <button class=\"btn gol\" id=\"anuleazaRaport\" type=\"button\">Anuleaz\u0103</button>\n      </div>\n    </form>\n  </div>\n</div>");
const SUPABASE_URL = "https://dkbslssefqvjwcotxcfg.supabase.co";
const SUPABASE_KEY = "sb_publishable_cEnanXvgCQR3DLJDjQ9ytA_u0ZUI2Lv";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const ri = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const alege = a => a[ri(0,a.length-1)];
function amesteca(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=ri(0,i);[a[i],a[j]]=[a[j],a[i]];} return a; }
let _idMem = null;
function ls(k, v){
  try{ if(v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }catch(_){ return null; }
}
function numeElev(){ return (ls("elev_nume") || "").trim(); }
function idDispozitiv(){
  let id = ls("elev_id") || _idMem;
  if(!id){
    id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : "d" + Date.now() + Math.random().toString(36).slice(2);
    _idMem = id; ls("elev_id", id);
  }
  return id;
}
function temeFacute(){ try{ return JSON.parse(ls("teme_facute") || "[]"); }catch(_){ return []; } }
function esteFacuta(id){ return temeFacute().includes(id); }
function seteazaFacuta(id, val){
  const l = temeFacute().filter(x => x !== id);
  if(val) l.push(id);
  ls("teme_facute", JSON.stringify(l));
}
function textFacut(f){ return f ? "✅ Făcută" : "☐ Am făcut-o"; }
const btnNume = document.getElementById("btnNume");
function arataNume(){ btnNume.textContent = "👤 " + (numeElev() || "Scrie-ți numele"); }
function deschideNume(){
  const n = prompt("Nume și prenume:", numeElev());
  if(n && n.trim().length > 1){ ls("elev_nume", n.trim().replace(/\s+/g, " ")); arataNume(); }
}
btnNume.addEventListener("click", deschideNume);
arataNume();
(document.getElementById("listaTeme")||document.body).addEventListener("click", async e=>{
  const b = e.target.closest("[data-facut]");
  if(!b || b.disabled) return;
  const id = b.dataset.facut, nume = numeElev();
  if(!nume){ deschideNume(); return; }
  const era = esteFacuta(id);
  b.disabled = true; b.textContent = "Se salvează…";
  try{
    if(era){
      const { error } = await db.rpc("anuleaza_tema", { p_tema:id, p_device:idDispozitiv() });
      if(error) throw error;
      seteazaFacuta(id, false);
    }else{
      const { error } = await db.from("teme_facute").insert({ tema_id:id, nume, device_id:idDispozitiv() });
      if(error && error.code !== "23505") throw error; /* 23505 = deja bifată */
      seteazaFacuta(id, true);
    }
  }catch(err){
    alert("Nu s-a putut salva. Verifică internetul și încearcă din nou.");
  }
  const f = esteFacuta(id);
  b.classList.toggle("gata", f);
  b.textContent = textFacut(f);
  b.disabled = false;
});

function esteFisier(url){ return /\.(pdf|docx?|pptx?|zip)(\?|$)/i.test(url || ""); }
function dataRo(s){
  try{ return new Date(s).toLocaleDateString("ro-RO",{day:"numeric",month:"long",year:"numeric"}); }
  catch(e){ return ""; }
}
function esc(t){ const d=document.createElement("div"); d.textContent=t??""; return d.innerHTML; }

function deseneaza(lista, container, contor, gol){
  const el = document.getElementById(container);
  document.getElementById(contor).textContent = lista.length ? lista.length + (lista.length===1?" element":" elemente") : "";
  if(!lista.length){
    el.innerHTML = `<div class="gol-msg" style="grid-column:1/-1"><b>${gol.titlu}</b>${gol.text}</div>`;
    return;
  }

  /* proiecte: doar titlu + descriere */
  if(container === "listaProiecte"){
    el.innerHTML = lista.map(x=>`
      <article class="proiect">
        <h3>${esc(x.title)}</h3>
        ${x.description ? `<p>${esc(x.description)}</p>` : ""}
        <div class="data">${dataRo(x.created_at)}</div>
      </article>`).join("");
    return;
  }

  el.innerHTML = lista.map(x=>{
    const url = x.image_url || "";

    /* orarul este un link, nu o poză */
    if(container === "listaOrar"){
      return `<article class="fisa">
        <a class="pdf" href="${esc(url)}" target="_blank" rel="noopener"><span>🔗</span>Deschide orarul</a>
        <div class="txt">
          <h3>${esc(x.title)}</h3>
          ${x.description ? `<p>${esc(x.description)}</p>` : ""}
          <div class="data">${dataRo(x.created_at)}</div>
        </div>
        <a class="desc" href="${esc(url)}" target="_blank" rel="noopener">Deschide orarul</a>
      </article>`;
    }

    const media = esteFisier(url)
      ? `<a class="pdf" href="${esc(url)}" target="_blank" rel="noopener"><span>📄</span>Deschide fișierul</a>`
      : `<img class="poza" src="${esc(url)}" alt="${esc(x.title)}" loading="lazy" data-zoom="${esc(url)}">`;
    return `<article class="fisa">
      ${media}
      <div class="txt">
        <h3>${esc(x.title)}</h3>
        ${x.description ? `<p>${esc(x.description)}</p>` : ""}
        <div class="data">${dataRo(x.created_at)}</div>
      </div>
      <a class="desc" href="${esc(url)}" target="_blank" rel="noopener" download>Descarcă</a>
      ${container === "listaTeme" ? `<button class="facut ${esteFacuta(x.id) ? "gata" : ""}" type="button" data-facut="${esc(x.id)}">${textFacut(esteFacuta(x.id))}</button>` : ""}
    </article>`;
  }).join("");
}

function filtru(sursa, q){
  q = q.trim().toLowerCase();
  if(!q) return sursa;
  return sursa.filter(x => (x.title||"").toLowerCase().includes(q) || (x.description||"").toLowerCase().includes(q));
}

function bannerEroare(e){
  return `<div class="banner-eroare" style="grid-column:1/-1">
    <div class="cod">${esc(e.cod)}</div>
    <div class="txt"><b>Secțiune indisponibilă</b><p>${esc(e.descriere)}</p></div>
  </div>`;
}

async function incarcaErori(){
  const { data, error } = await db.from("erori").select("*").eq("activ", true).order("created_at",{ascending:false});
  if(error || !data) return {};
  const map = {};
  data.forEach(e=>{ if(!map[e.sectiune]) map[e.sectiune] = e; });
  return map;
}
/* lightbox */
const lb = document.getElementById("lightbox"), lbImg = document.getElementById("lbImg");
document.addEventListener("click", e=>{
  const z = e.target.closest("[data-zoom]");
  if(z){ lbImg.src = z.dataset.zoom; lb.classList.add("activ"); }
});
function inchideLightbox(){ lb.classList.remove("activ"); lbImg.src=""; }
document.getElementById("inchideLb").addEventListener("click", inchideLightbox);
lb.addEventListener("click", e=>{ if(e.target===lb) inchideLightbox(); });

async function verifica(){
  const e = await incarcaErori();
  if(e.tot){
    document.getElementById("overlayCod").textContent = e.tot.cod;
    document.getElementById("overlayDesc").textContent = e.tot.descriere;
    document.getElementById("overlaySite").classList.add("activ");
    document.body.style.overflow = "hidden";
  }
  return e;
}
async function pagina(c){
  const erori = await verifica(); if(erori.tot) return;
  const el = document.getElementById(c.lista), cauta = document.getElementById("cauta");
  if(erori[c.sect]){ el.innerHTML = bannerEroare(erori[c.sect]); if(cauta) cauta.style.display = "none"; return; }
  const r = await db.from(c.tabel).select("*").order("created_at", {ascending:false});
  if(r.error){ el.innerHTML = `<div class="gol-msg" style="grid-column:1/-1"><b>Nu s-a încărcat.</b>Verifică legătura la internet și reîncarcă pagina.</div>`; return; }
  const date = r.data || [];
  deseneaza(date, c.lista, c.nr, c.gol);
  if(cauta) cauta.addEventListener("input", e=> deseneaza(filtru(date, e.target.value), c.lista, c.nr, {titlu:"Niciun rezultat.", text:"Încearcă alt cuvânt."}));
}

(function(){
  const EMAIL = "rosca8324@gmail.com";
  const modalR = document.getElementById("modalRaport");
  const form = document.getElementById("formRaport");
  const txt = document.getElementById("raportText");
  const nume = document.getElementById("raportNume");
  const hp = document.getElementById("raportHp");
  const msg = document.getElementById("raportMesaj");
  const btn = document.getElementById("trimiteRaport");
  const contor = document.getElementById("raportContor");
  const PAUZA = 30000; /* 30 s între rapoarte */

  function arata(t, tip){ msg.textContent = t; msg.className = "raport-mesaj" + (tip ? " " + tip : ""); }
  function deschide(){ modalR.classList.add("activ"); arata(""); if(!nume.value) nume.value = numeElev(); setTimeout(()=>txt.focus(), 50); }
  function inchide(){ modalR.classList.remove("activ"); }

  document.getElementById("deschideRaport").addEventListener("click", deschide);
  document.getElementById("inchideRaport").addEventListener("click", inchide);
  document.getElementById("anuleazaRaport").addEventListener("click", inchide);
  modalR.addEventListener("click", e=>{ if(e.target===modalR) inchide(); });
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") inchide(); });
  txt.addEventListener("input", ()=>{ contor.textContent = txt.value.length; });

  form.addEventListener("submit", async e=>{
    e.preventDefault();
    const text = txt.value.trim();
    if(text.length < 5){ arata("Descrie pe scurt problema (minim câteva cuvinte).", "er"); txt.focus(); return; }
    if(hp.value){ inchide(); return; } /* bot */

    let ultima = 0;
    try{ ultima = Number(localStorage.getItem("raport_ultimul")||0); }catch(_){}
    if(Date.now() - ultima < PAUZA){ arata("Așteaptă puțin înainte de un nou raport.", "er"); return; }

    btn.disabled = true; btn.textContent = "Se trimite…"; arata("");
    try{
      const r = await fetch("https://formsubmit.co/ajax/" + EMAIL, {
        method:"POST",
        headers:{ "Content-Type":"application/json", "Accept":"application/json" },
        body: JSON.stringify({
          _subject: "Raport problemă — MateNova",
          _template: "table",
          _captcha: "false",
          Problema: text,
          Nume: nume.value.trim() || "(anonim)",
          Pagina: location.href,
          Browser: navigator.userAgent,
          Data: new Date().toLocaleString("ro-RO")
        })
      });
      const d = await r.json().catch(()=>({}));
      if(!r.ok || (d.success !== true && d.success !== "true")){
        const e2 = new Error(d.message || ("HTTP " + r.status));
        e2.server = true; throw e2;
      }
      try{ localStorage.setItem("raport_ultimul", Date.now()); }catch(_){}
      arata("Mulțumim! Raportul a fost trimis.", "ok");
      txt.value = ""; contor.textContent = "0";
      setTimeout(inchide, 1800);
    }catch(err){
      let m;
      if(err.server && /activat|activation/i.test(err.message)){
        m = "Prima dată trebuie activat: deschide Gmail-ul rosca8324@gmail.com, apasă linkul din mailul de la FormSubmit (verifică și Spam), apoi trimite din nou.";
      }else if(err.server){
        m = "Serverul a răspuns: " + err.message;
      }else{
        m = "Nu s-a putut trimite. Verifică internetul. Dacă ai deschis pagina direct din fișier, trimiterea merge doar de pe site-ul publicat.";
      }
      arata(m, "er");
    }finally{
      btn.disabled = false; btn.textContent = "Trimite raportul";
    }
  });
})();
if("serviceWorker" in navigator) window.addEventListener("load", ()=> navigator.serviceWorker.register("sw.js").catch(()=>{}));
