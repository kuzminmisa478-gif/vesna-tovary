const RATE=11.5;
const items=D.map((r,i)=>{const y=(r[3]+r[4])/2,p=(r[5]+r[6])/2;return{n:i+1,cat:r[0],name:r[1],why:r[2],y1:r[3],y2:r[4],p1:r[5],p2:r[6],peak:r[7],comp:r[8],risk:r[9],mk:p/(y*RATE),pm:p}});
const peakOrder=["фев","мар","апр","май"];
const key="spring50-sel";let sel=new Set();
try{sel=new Set(JSON.parse(localStorage.getItem(key)||"[]"))}catch(e){}
function save(){try{localStorage.setItem(key,JSON.stringify([...sel]))}catch(e){}}
const cats=["Все",...new Set(items.map(i=>i.cat))];let cur="Все";
const chips=document.getElementById("chips");
cats.forEach(c=>{const b=document.createElement("button");b.className="chip";b.type="button";b.textContent=c;b.setAttribute("aria-pressed",c===cur);b.onclick=()=>{cur=c;[...chips.children].forEach(x=>x.setAttribute("aria-pressed",x.textContent===cur));render()};chips.appendChild(b)});
const fmt=n=>n.toLocaleString("ru-RU");
function render(){
  const s=document.getElementById("sort").value,only=document.getElementById("only").checked;
  let list=items.filter(i=>(cur==="Все"||i.cat===cur)&&(!only||sel.has(i.n)));
  if(s==="mk")list.sort((a,b)=>b.mk-a.mk);
  if(s==="price")list.sort((a,b)=>b.pm-a.pm);
  if(s==="peak")list.sort((a,b)=>peakOrder.indexOf(a.peak.slice(0,3))-peakOrder.indexOf(b.peak.slice(0,3)));
  const L=document.getElementById("list");L.innerHTML="";
  list.forEach(i=>{
    const d=document.createElement("div");d.className="row"+(sel.has(i.n)?" sel":"");
    const mkc=i.mk>=5?"p-hi":"p-mid";
    d.innerHTML=`<input type="checkbox" id="c${i.n}" ${sel.has(i.n)?"checked":""} aria-label="Отобрать: ${i.name}">
    <div class="main"><div class="top"><span class="num">${i.n}</span><label for="c${i.n}" class="name">${i.name}</label><span class="cat">${i.cat}</span></div>
    <p class="why">${i.why}</p>
    <div class="meta"><span>Закупка <b>¥${i.y1}–${i.y2}</b></span><span>Цена на МП <b>${fmt(i.p1)}–${fmt(i.p2)} ₽</b></span><span class="pill ${mkc}">×${i.mk.toFixed(1)}</span><span>Пик <b>${i.peak}</b></span><span>Конкуренция <b>${i.comp===1?"высокая":"средняя"}</b></span></div>
    ${i.risk?`<div class="warn">${i.risk}</div>`:""}</div>`;
    d.querySelector("input").onchange=e=>{e.target.checked?sel.add(i.n):sel.delete(i.n);save();d.classList.toggle("sel",e.target.checked);count()};
    L.appendChild(d)});
  count()}
function count(){document.getElementById("cnt").textContent=sel.size}
document.getElementById("sort").onchange=render;
document.getElementById("only").onchange=render;
document.getElementById("clear").onclick=()=>{sel.clear();save();document.getElementById("out").hidden=true;render()};
document.getElementById("copy").onclick=async()=>{
  const t=items.filter(i=>sel.has(i.n)).map(i=>`${i.n}. ${i.name} — ¥${i.y1}–${i.y2}, ${i.p1}–${i.p2} ₽, пик ${i.peak}`).join("\n")||"Ничего не отобрано";
  const o=document.getElementById("out");o.value=t;o.hidden=false;
  try{await navigator.clipboard.writeText(t);document.getElementById("copy").textContent="Скопировано"}catch(e){o.select()}
  setTimeout(()=>document.getElementById("copy").textContent="Скопировать отобранные",1800)};
render();
