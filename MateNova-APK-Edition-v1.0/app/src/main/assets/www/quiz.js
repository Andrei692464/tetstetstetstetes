/* ====== QUIZURI ====== */
/* fiecare întrebare: [enunț, răspuns corect, greșit, greșit, greșit] */
const QUIZURI = {
  numere:{ ic:"🔢", nume:"Numere și puteri", desc:"Puteri, numere prime, ordinea operațiilor.", q:[
    ["2<sup>5</sup> =","32","25","10","16"],
    ["Care este cel mai mic număr prim?","2","1","3","0"],
    ["5 + 3 · 4 =","17","32","20","12"],
    ["Care număr se împarte exact la 9?","504","512","623","710"],
    ["10<sup>3</sup> =","1000","30","100","10000"]]},
  fractii:{ ic:"🍕", nume:"Fracții", desc:"Comparare, simplificare, zecimale.", q:[
    ["Care fracție este cea mai mare?","3/4","2/3","1/2","3/5"],
    ["Simplifică fracția 12/18","2/3","3/4","1/2","6/8"],
    ["1/4 scris ca zecimal este","0,25","0,4","0,14","0,5"],
    ["1/2 + 1/4 =","3/4","2/6","1/8","2/4"],
    ["3/5 din 20 este","12","15","8","10"]]},
  geometrie:{ ic:"📐", nume:"Geometrie", desc:"Unghiuri, perimetre și arii.", q:[
    ["Cât măsoară un unghi drept?","90°","180°","45°","360°"],
    ["Suma unghiurilor unui triunghi este","180°","90°","360°","270°"],
    ["Perimetrul unui pătrat cu latura de 6 cm","24 cm","36 cm","12 cm","18 cm"],
    ["Aria unui dreptunghi cu laturile 5 cm și 3 cm","15 cm²","16 cm²","8 cm²","30 cm²"],
    ["Câte laturi are un hexagon?","6","5","7","8"]]},
  mix:{ ic:"⚡", nume:"Mix pentru campioni", desc:"Unități de măsură, mulțimi și divizori.", q:[
    ["1 km = … m","1000","100","10","10000"],
    ["2,5 kg = … g","2500","250","25","25000"],
    ["Câte elemente are mulțimea A = {1, 2, 3, 4, 5}?","5","4","6","15"],
    ["Care dintre numere este par?","148","147","255","93"],
    ["cmmdc(12, 18) =","6","3","36","2"]]}
};

const modal=document.getElementById("modal"), corp=document.getElementById("corp");
let st=null;
const record = k => Number(ls("quiz_"+k)||0);

document.getElementById("listaQuiz").innerHTML = Object.entries(QUIZURI).map(([k,z])=>`
  <button class="quiz" data-k="${k}">
    <div class="ic">${z.ic}</div><h3>${z.nume}</h3><p>${z.desc}</p>
    <div class="rec" data-rec="${k}">${record(k)?`record: ${record(k)}/${z.q.length}`:""}</div>
  </button>`).join("");
document.getElementById("listaQuiz").addEventListener("click", e=>{
  const b=e.target.closest("[data-k]"); if(b) porneste(b.dataset.k);
});

function porneste(k){
  const z=QUIZURI[k];
  st={k, nume:z.nume, nr:0, scor:0, intrebari:amesteca(z.q)};
  document.getElementById("titlu").textContent=z.nume;
  modal.classList.add("activ");
  urmatoarea();
}
function urmatoarea(){
  const t=st.intrebari.length;
  if(st.nr>=t) return final();
  const [q,corect,...gresite]=st.intrebari[st.nr++];
  st.corect=corect;
  corp.innerHTML=`
    <div class="scor"><span>Întrebarea ${st.nr}/${t}</span><span>Puncte: ${st.scor}</span></div>
    <div class="intrebare">${q}</div>
    <div class="variante">${amesteca([corect,...gresite]).map(o=>`<button class="var" data-v="${String(o).replace(/"/g,'&quot;')}">${o}</button>`).join("")}</div>
    <div class="feedback" id="fb"></div>`;
  corp.querySelectorAll(".var").forEach(b=>b.addEventListener("click",()=>raspunde(b)));
}
function raspunde(btn){
  const bun=btn.dataset.v===st.corect;
  corp.querySelectorAll(".var").forEach(b=>{ b.disabled=true; if(b.dataset.v===st.corect) b.classList.add("bun"); });
  if(bun) st.scor++; else btn.classList.add("rau");
  const fb=document.getElementById("fb");
  fb.textContent = bun ? alege(["Corect!","Exact așa.","Bravo!","Perfect."]) : "Răspunsul corect era: " + st.corect;
  fb.style.color = bun ? "var(--ok)" : "var(--bad)";
  setTimeout(urmatoarea, bun?700:1800);
}
function final(){
  const t=st.intrebari.length;
  if(st.scor>record(st.k)){
    ls("quiz_"+st.k, st.scor);
    const r=document.querySelector(`[data-rec="${st.k}"]`); if(r) r.textContent=`record: ${st.scor}/${t}`;
  }
  const m = st.scor===t ? "Punctaj maxim. Impecabil!" : st.scor>=t*0.7 ? "Foarte bine!" : st.scor>=t*0.4 ? "Bun început. Mai încearcă o rundă." : "Mai exersează pe fișe și revino.";
  corp.innerHTML=`<div class="final"><div class="puncte">${st.scor}/${t}</div><p>${m}</p>
    <div class="btns"><button class="btn" id="dinNou">Mai joacă o dată</button><button class="btn gol" id="gata">Închide</button></div></div>`;
  document.getElementById("dinNou").addEventListener("click",()=>porneste(st.k));
  document.getElementById("gata").addEventListener("click",inchide);
}
function inchide(){ modal.classList.remove("activ"); corp.innerHTML=""; st=null; }
document.getElementById("inchide").addEventListener("click",inchide);
modal.addEventListener("click",e=>{ if(e.target===modal) inchide(); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape") inchide(); });


/* quizurile puse de profesor (Supabase) */
(async function(){
  const e = await verifica(); if(e.tot) return;
  const Lp = document.getElementById("listaProf"), nr = document.getElementById("nrQuiz");
  if(e.quiz){ Lp.innerHTML = bannerEroare(e.quiz); return; }
  const q = await db.from("quizuri").select("*").order("created_at",{ascending:false});
  if(q.error){ Lp.innerHTML = `<div class="gol-msg" style="grid-column:1/-1"><b>Quiz-urile nu s-au încărcat.</b>Reîncarcă pagina.</div>`; return; }
  if(!q.data.length){ Lp.innerHTML = `<div class="gol-msg" style="grid-column:1/-1"><b>Niciun quiz încă.</b>Quiz-urile apar aici imediat ce sunt publicate din panoul profesorului.</div>`; return; }
  nr.textContent = q.data.length + (q.data.length===1 ? " quiz" : " quiz-uri");
  Lp.innerHTML = q.data.map(x=>`<button class="quiz" data-prof="${x.id}"><div class="ic">📝</div><h3>${esc(x.title)}</h3><p>${esc(x.description || "Testează-ți cunoștințele.")}</p></button>`).join("");
  Lp.addEventListener("click", async ev=>{
    const b = ev.target.closest("[data-prof]"); if(!b) return;
    const r = await db.from("quiz_intrebari").select("*").eq("quiz_id", b.dataset.prof).order("ordine",{ascending:true});
    if(r.error || !r.data || !r.data.length){ alert("Quiz-ul nu are întrebări încă."); return; }
    const k = "p" + b.dataset.prof;
    QUIZURI[k] = { nume: b.querySelector("h3").textContent, q: r.data.map(x=>{
      const o = (Array.isArray(x.optiuni) ? x.optiuni : JSON.parse(x.optiuni)).map(String);
      return [esc(x.intrebare), o[x.corect], ...o.filter((_,i)=> i !== x.corect)];
    })};
    porneste(k);
  });
})();
