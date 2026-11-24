function variante(corect, generator){
  const set = new Set([String(corect)]);
  let paza = 0;
  while(set.size < 4 && paza++ < 60) set.add(String(generator()));
  return amesteca([...set]);
}
const esteprim = n => { if(n<2) return false; for(let i=2;i*i<=n;i++) if(n%i===0) return false; return true; };
const cmmdc = (a,b)=> b ? cmmdc(b,a%b) : a;

/* ====== JOCURI ====== */
const JOCURI = {
  calcul:{
    ic:"⚡", nume:"Calcul rapid",
    desc:"Adunări, scăderi, înmulțiri, împărțiri și puteri.",
    gen(){
      const tip = alege(["+","−","·",":","putere"]);
      if(tip==="putere"){
        const b = ri(2,9), e = alege([2,2,3]);
        const r = Math.pow(b,e);
        return {q:`${b}<sup>${e}</sup> =`, corect:String(r), opt:variante(r,()=>r+ri(-12,12)*alege([1,2]))};
      }
      if(tip==="+"){ const a=ri(45,480), b=ri(45,480); return {q:`${a} + ${b} =`, corect:String(a+b), opt:variante(a+b,()=>a+b+ri(-30,30))}; }
      if(tip==="−"){ const a=ri(120,700), b=ri(20,a-10); return {q:`${a} − ${b} =`, corect:String(a-b), opt:variante(a-b,()=>a-b+ri(-25,25))}; }
      if(tip==="·"){ const a=ri(7,19), b=ri(4,15); return {q:`${a} · ${b} =`, corect:String(a*b), opt:variante(a*b,()=>a*b+ri(-15,15))}; }
      const b=ri(3,12), r=ri(4,15), a=b*r;
      return {q:`${a} : ${b} =`, corect:String(r), opt:variante(r,()=>Math.max(1,r+ri(-6,6)))};
    }
  },
  ordine:{
    ic:"🧮", nume:"Ordinea operațiilor",
    desc:"Paranteze, puteri, apoi înmulțiri și împărțiri.",
    gen(){
      const a=ri(2,9), b=ri(2,9), c=ri(2,6), d=ri(2,5);
      const forme = [
        {t:`${a} + ${b} · ${c} =`, v:a+b*c},
        {t:`(${a} + ${b}) · ${c} =`, v:(a+b)*c},
        {t:`${a} · ${b} − ${c} · ${d} =`, v:a*b-c*d},
        {t:`${a*b*c} : ${a} : ${b} =`, v:c},
        {t:`${a} + ${b}<sup>2</sup> · ${c} =`, v:a+b*b*c},
        {t:`${c}<sup>2</sup> + ${d}<sup>2</sup> − ${c} =`, v:c*c+d*d-c}
      ];
      const f = alege(forme);
      return {q:f.t, corect:String(f.v), opt:variante(f.v,()=>f.v+ri(-14,14))};
    }
  },
  divizibil:{
    ic:"🔢", nume:"Divizibilitate",
    desc:"Reguli pentru 2, 3, 5, 9, 10 și numere prime.",
    gen(){
      if(Math.random()<0.5){
        const d = alege([2,3,5,9,10]);
        const bun = (()=>{ let n; do{ n=ri(2,60)*d; }while(n>900); return n; })();
        const rele = [];
        let paza=0;
        while(rele.length<3 && paza++<200){ const n=ri(20,900); if(n%d!==0 && !rele.includes(n)) rele.push(n); }
        return {q:`Care număr se împarte exact la ${d}?`, corect:String(bun), opt:amesteca([String(bun),...rele.map(String)])};
      }
      const n = alege([...Array(80)].map((_,i)=>i+11));
      const prim = esteprim(n);
      return {
        q:`Numărul ${n} este prim?`, corect: prim?"Da":"Nu",
        opt:["Da","Nu"],
        info: prim ? `${n} are exact doi divizori: 1 și ${n}.` : `${n} se împarte și la ${(()=>{for(let i=2;i*i<=n;i++) if(n%i===0) return i;})()}.`
      };
    }
  },
  fractii:{
    ic:"🍕", nume:"Fracții",
    desc:"Compară, simplifică și transformă în zecimale.",
    gen(){
      const tip = alege(["compara","simplifica","zecimal"]);
      if(tip==="compara"){
        let a,b,c,d;
        do{ a=ri(1,9); b=ri(2,12); c=ri(1,9); d=ri(2,12); }while(a/b===c/d);
        const mai = a/b > c/d ? `${a}/${b}` : `${c}/${d}`;
        return {q:`Care fracție este mai mare: ${a}/${b} sau ${c}/${d}?`, corect:mai, opt:amesteca([`${a}/${b}`,`${c}/${d}`])};
      }
      if(tip==="simplifica"){
        const k=ri(2,7), a=ri(2,9), b=ri(2,9)+9;
        const g=cmmdc(a,b), sa=a/g, sb=b/g;
        return {
          q:`Simplifică fracția ${a*k}/${b*k}`, corect:`${sa}/${sb}`,
          opt:variante(`${sa}/${sb}`, ()=>`${sa+ri(0,3)}/${sb+ri(1,4)}`),
          info:`Se împarte și numărătorul, și numitorul la ${k*g}.`
        };
      }
      const a=alege([1,2,3,4,5,6,7,9]), b=alege([2,4,5,8,10,20,25]);
      const v=(a/b).toFixed(3).replace(/0+$/,"").replace(/\.$/,"");
      return {q:`${a}/${b} scris ca număr zecimal este`, corect:v, opt:variante(v,()=>(a/b + ri(-9,9)/10).toFixed(2).replace(/0+$/,"").replace(/\.$/,""))};
    }
  }
};

const TOTAL = 10;
let stare = null;

function recordul(cheie){ try{ return Number(localStorage.getItem("mate_"+cheie)||0); }catch(e){ return 0; } }
function salveazaRecord(cheie,scor){ try{ if(scor>recordul(cheie)) localStorage.setItem("mate_"+cheie,scor); }catch(e){} }

document.getElementById("listaJocuri").innerHTML = Object.entries(JOCURI).map(([k,j])=>`
  <button class="joc" data-joc="${k}">
    <div class="ic">${j.ic}</div>
    <h3>${j.nume}</h3>
    <p>${j.desc}</p>
    <div class="rec" data-rec="${k}">${recordul(k)?`record: ${recordul(k)}/${TOTAL}`:""}</div>
  </button>`).join("");

document.getElementById("listaJocuri").addEventListener("click", e=>{
  const b = e.target.closest("[data-joc]");
  if(b) porneste(b.dataset.joc);
});

const modal = document.getElementById("modalJoc");
const corp = document.getElementById("corpJoc");

function porneste(cheie){
  stare = {cheie, joc:JOCURI[cheie], nr:0, scor:0, serie:0};
  document.getElementById("titluJoc").textContent = stare.joc.nume;
  modal.classList.add("activ");
  intrebareNoua();
}
function intrebareNoua(){
  if(stare.nr >= TOTAL) return final();
  stare.nr++;
  const q = stare.joc.gen();
  stare.q = q;
  corp.innerHTML = `
    <div class="scor">
      <span>Întrebarea ${stare.nr}/${TOTAL}</span>
      <span>Puncte: ${stare.scor}</span>
      <span>La rând: ${stare.serie}</span>
    </div>
    <div class="intrebare">${q.q}</div>
    <div class="variante">${q.opt.map(o=>`<button class="var" data-v="${esc(o)}">${o}</button>`).join("")}</div>
    <div class="feedback" id="fb"></div>`;
  corp.querySelectorAll(".var").forEach(b=> b.addEventListener("click", ()=>raspunde(b)));
}
function raspunde(btn){
  const bun = btn.dataset.v === String(stare.q.corect);
  corp.querySelectorAll(".var").forEach(b=>{
    b.disabled = true;
    if(b.dataset.v === String(stare.q.corect)) b.classList.add("bun");
  });
  if(bun){ stare.scor++; stare.serie++; }
  else { btn.classList.add("rau"); stare.serie = 0; }
  const fb = document.getElementById("fb");
  fb.textContent = bun
    ? alege(["Corect!","Exact așa.","Bravo!","Perfect."])
    : `Răspunsul corect era ${stare.q.corect}.` + (stare.q.info ? " " + stare.q.info : "");
  fb.style.color = bun ? "var(--ok)" : "var(--bad)";
  setTimeout(intrebareNoua, bun ? 700 : 1900);
}
function final(){
  salveazaRecord(stare.cheie, stare.scor);
  const r = document.querySelector(`[data-rec="${stare.cheie}"]`);
  if(r) r.textContent = `record: ${recordul(stare.cheie)}/${TOTAL}`;
  const mesaj = stare.scor === TOTAL ? "Tot punctajul. Impecabil."
    : stare.scor >= 7 ? "Foarte bine. Încă puțin până la zece din zece."
    : stare.scor >= 4 ? "Bun început. Mai încearcă o rundă."
    : "Mai exersează pe fișe și revino.";
  corp.innerHTML = `<div class="final">
    <div class="puncte">${stare.scor}/${TOTAL}</div>
    <p>${mesaj}</p>
    <div class="butoane" style="justify-content:center">
      <button class="btn" id="dinNou">Mai joacă o dată</button>
      <button class="btn gol" id="gata">Închide</button>
    </div></div>`;
  document.getElementById("dinNou").addEventListener("click", ()=>porneste(stare.cheie));
  document.getElementById("gata").addEventListener("click", inchideModal);
}
function inchideModal(){ modal.classList.remove("activ"); corp.innerHTML=""; stare=null; }
document.getElementById("inchideJoc").addEventListener("click", inchideModal);
modal.addEventListener("click", e=>{ if(e.target===modal) inchideModal(); });
document.addEventListener("keydown", e=>{
  if(e.key==="Escape"){ inchideModal(); inchideLightbox(); }
});
verifica().then(e=>{ if(e.jocuri) document.getElementById("listaJocuri").innerHTML = bannerEroare(e.jocuri); });
