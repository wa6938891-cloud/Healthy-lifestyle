(() => {
"use strict";

const KEY = "dshc_v1";
const NAV = [
  ["dashboard","⌂","Dashboard"],["today","✓","Today's Plan"],["program","30","30-Day Program"],
  ["workout","◈","Workout"],["nutrition","◌","Nutrition"],["sleep","☾","Sleep"],["stress","≈","Stress"],
  ["sexual","♡","Sexual Wellbeing"],["supplements","＋","Supplements"],["progress","↗","Progress"],
  ["learn","i","Learn"],["coach","✦","Ask Coach"],["settings","⚙","Settings"],["privacy","▣","Privacy & Safety"]
];

const exercises = {
  squat:["Bodyweight Squat","3 × 8–12","60–90 sec","Keep knees tracking over toes; use a chair for support."],
  push:["Incline Push-up","3 × 8–12","60–90 sec","Hands on a stable elevated surface; keep body braced."],
  row:["Backpack/DB Row","3 × 8–12 / side","60–90 sec","Keep spine neutral; pull toward your hip."],
  hinge:["Hip Hinge / Romanian Deadlift","3 × 8–12","90 sec","Move from the hips; stop if you feel sharp pain."],
  plank:["Front Plank","3 × 20–40 sec","45–60 sec","Brace gently and breathe; stop before form breaks."],
  lunge:["Reverse Lunge","3 × 8 / side","60–90 sec","Hold support if needed; controlled range."],
  press:["DB/Backpack Overhead Press","3 × 8–12","60–90 sec","Use a comfortable load; avoid painful overhead range."],
  carry:["Farmer Carry","4 × 30–45 sec","60 sec","Walk tall with a manageable load."]
};

const program = [
 ["Full Body Foundation","Full body",["squat","push","row","hinge"],"10–15 min easy walk"],
 ["Zone 2 Cardio + Mobility","Cardio",[],"20–30 min conversational-pace cardio"],
 ["Upper Body Strength","Upper",["push","row","press","plank"],"8–10 min easy walk"],
 ["Recovery + Stress Control","Recovery",[],"15–25 min relaxed walk"],
 ["Lower Body Strength","Lower",["squat","hinge","lunge","plank"],"10 min easy cardio"],
 ["Full Body Strength","Full body",["squat","push","row","carry"],"10 min easy walk"],
 ["Recovery Day","Recovery",[],"Optional easy walk + mobility"],
 ["Full Body Foundation","Full body",["squat","push","row","hinge"],"15 min easy cardio"],
 ["Cardio Intervals","Cardio",[],"6 × 1 min brisk / 2 min easy, after warm-up"],
 ["Upper Body Strength","Upper",["push","row","press","plank"],"10 min easy walk"],
 ["Recovery + Breathing","Recovery",[],"20 min easy walk"],
 ["Lower Body Strength","Lower",["squat","hinge","lunge","plank"],"10 min easy cardio"],
 ["Full Body Strength","Full body",["squat","push","row","carry"],"15 min easy walk"],
 ["Recovery Day","Recovery",[],"Optional mobility"],
 ["Full Body Progression","Full body",["squat","push","row","hinge","plank"],"15 min easy cardio"],
 ["Zone 2 Cardio","Cardio",[],"25–35 min conversational pace"],
 ["Upper Body Progression","Upper",["push","row","press","plank"],"10 min easy walk"],
 ["Recovery + Stress Control","Recovery",[],"20–30 min easy walk"],
 ["Lower Body Progression","Lower",["squat","hinge","lunge","plank"],"10 min easy cardio"],
 ["Full Body Progression","Full body",["squat","push","row","carry"],"15 min easy walk"],
 ["Recovery Day","Recovery",[],"Optional mobility"],
 ["Full Body Progression","Full body",["squat","push","row","hinge"],"20 min easy cardio"],
 ["Cardio Intervals","Cardio",[],"8 × 1 min brisk / 2 min easy, after warm-up"],
 ["Upper Body Progression","Upper",["push","row","press","plank"],"10–15 min easy walk"],
 ["Recovery + Breathing","Recovery",[],"20–30 min easy walk"],
 ["Lower Body Progression","Lower",["squat","hinge","lunge","plank"],"15 min easy cardio"],
 ["Full Body Progression","Full body",["squat","push","row","carry","plank"],"15–20 min easy walk"],
 ["Recovery Day","Recovery",[],"Optional mobility"],
 ["Full Body Benchmark","Full body",["squat","push","row","hinge","plank"],"Easy 15 min walk"],
 ["Reflection + Recovery","Recovery",[],"Gentle walk + mobility"]
];

const defaultData = {
  version:1, startedAt:new Date().toISOString(), onboarding:null, currentDay:1, streak:0,
  checkins:{}, completions:{}, strength:{}, coach:[], weight:[], settings:{theme:"dark"}
};

let data = load();
let page = location.hash.replace("#","") || (data.onboarding ? "dashboard" : "onboarding");

function load(){ try{return {...defaultData,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(e){return {...defaultData}}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function setPage(p){page=p; location.hash=p; render();}
window.addEventListener("hashchange",()=>{page=location.hash.replace("#","")||"dashboard";render();});
function day(){return Math.min(30,Math.max(1,Number(data.currentDay)||1));}
function dayObj(n=day()){const p=program[n-1];return {n,title:p[0],type:p[1],keys:p[2],cardio:p[3]};}
function completionCount(n=day()){const c=data.completions[n]||{};return ["workout","nutrition","sleep","stress","checkin"].filter(k=>c[k]).length;}
function overallPct(){let total=0,done=0;for(let n=1;n<=30;n++){total+=5;done+=completionCount(n)}return Math.round(done/total*100);}
function calcStreak(){let s=0;for(let n=day();n>=1;n--){if(completionCount(n)>=3)s++;else break}return s;}
function escVal(v){return esc(v).replace(/"/g,"&quot;");}

function shell(content){
 return `<div class="app-shell"><header class="topbar"><div class="topbar-inner">
  <div class="brand"><div class="brand-mark">30</div><div><div class="brand-title">30-DAY SEXUAL HEALTH COACH</div><div class="brand-sub">Wellness • Fitness • Recovery</div></div></div>
  <nav class="desktop-nav">${NAV.slice(0,10).map(n=>navBtn(n)).join("")}</nav>
  <button class="btn primary" onclick="setPage('coach')">✦ Coach</button>
 </div></header><main>${content}</main>
 <nav class="bottom-nav">${NAV.slice(0,5).map(n=>navBtn(n,true)).join("")}</nav></div>`;
}
function navBtn(n,mobile=false){return `<button class="${page===n[0]?'active':''} nav-btn" onclick="setPage('${n[0]}')">${mobile?`<span class="ico">${n[1]}</span>`:""}${n[2]}</button>`}
function header(title,sub=""){return `<div class="hero"><div class="eyebrow">30-DAY PROGRAM</div><h1>${title}</h1>${sub?`<p>${sub}</p>`:""}</div>`}
function card(title,body,extra=""){return `<section class="card">${title?`<h2>${title}</h2>`:""}${body}${extra}</section>`}
function metric(label,value){return `<div class="stat"><b>${esc(value)}</b><span>${esc(label)}</span></div>`}

function onboarding(){
 return `<div class="page">${header("Build your sexual wellbeing foundation.","A private, local-first 30-day coaching program for adult lifestyle habits. It does not diagnose or treat medical conditions.")}
 <div class="grid grid-main"><section class="card"><h2>Personalize your plan</h2><p class="muted small">All fields stay in this browser in V1. You can change them later in Settings.</p>
 <form id="onboardForm" class="form-grid">
 ${field("Age","age","number","18","120","",true)}
 ${select("Sex","sex",["Prefer not to say","Male","Female","Intersex"],"Prefer not to say")}
 ${field("Height (cm)","height","number","100","250","")}
 ${field("Weight (kg, optional)","weight","number","30","300","")}
 ${select("Fitness level","fitness",["Beginner","Intermediate","Advanced"],"Beginner")}
 ${select("Training experience","experience",["New to structured training","Some experience","Consistent training"],"New to structured training")}
 ${select("Training days/week","days",["2","3","4","5","6"],"3")}
 ${select("Main goal","goal",["General sexual wellbeing","Fitness & body composition","Energy & recovery","Strength & confidence","Healthy routine"],"General sexual wellbeing")}
 ${select("Typical sleep","sleep",["<6 hours","6–7 hours","7–9 hours",">9 hours / variable"],"7–9 hours")}
 ${select("Current activity","activity",["Mostly sedentary","Lightly active","Moderately active","Very active"],"Mostly sedentary")}
 ${select("Dietary preference","diet",["No specific preference","Vegetarian","Vegan","Halal","Other"],"No specific preference")}
 ${select("Equipment","equipment",["Bodyweight only","Dumbbells / bands","Home gym","Full gym"],"Bodyweight only")}
 ${select("Training level","level",["Beginner","Intermediate","Advanced"],"Beginner")}
 <div class="btn-row" style="grid-column:1/-1"><button class="btn primary" type="submit">Start Day 1 →</button></div>
 </form></section>
 ${card("What this app does",`<ul class="list"><li><span class="check">✓</span><span>Builds consistent exercise, sleep, nutrition, hydration and stress habits.</span></li><li><span class="check">✓</span><span>Tracks optional sexual-wellbeing measures privately on-device.</span></li><li><span class="check">✓</span><span>Uses cautious, evidence-informed education instead of guaranteed libido or hormone claims.</span></li></ul><div class="notice" style="margin-top:14px">For adults 18+. If you have persistent or sudden sexual-function changes or other concerning symptoms, seek medical evaluation.</div>`)}
 </div></div>`;
}
function field(label,name,type,min="",max="",value="",req=false){return `<div class="field"><label>${label}</label><input name="${name}" type="${type}" ${min?`min="${min}"`:""} ${max?`max="${max}"`:""} value="${escVal(value)}" ${req?"required":""}></div>`}
function select(label,name,opts,value){return `<div class="field"><label>${label}</label><select name="${name}">${opts.map(o=>`<option ${o===value?"selected":""}>${esc(o)}</option>`).join("")}</select></div>`}

function dashboard(){
 const d=dayObj(), pct=overallPct(), c=data.completions[d.n]||{}, ci=data.checkins[d.n]||{};
 const items=[["workout","Workout",`${d.title} • ${d.keys.length?d.keys.length+" movements":"recovery focus"}`],["nutrition","Nutrition","Protein + plants + whole-food carbohydrates + healthy fats"],["sleep","Sleep","Aim for a consistent schedule and ~7–9 hours for most adults"],["stress","Stress","5 minutes of slow breathing + a relaxed walk"],["checkin","Sexual wellbeing","Private 1–10 check-in, only if you want to record it"]];
 return `<div class="page">${header(`Day ${d.n} / 30`,d.title+" — "+d.type)}
 <div class="grid grid-4" style="margin-bottom:13px">${metric("Program completion",pct+"%")}${metric("Current streak",calcStreak()+" days")}${metric("Energy",ci.energy||"—")}${metric("Recovery",ci.sleepQuality||"—")}</div>
 <section class="card"><div style="display:flex;justify-content:space-between;gap:10px"><div><div class="kicker">Overall progress</div><h2 style="margin-top:5px">${pct}% complete</h2></div><span class="badge green">${completionCount()} / 5 today</span></div><div class="progress" style="margin-top:10px"><i style="width:${pct}%"></i></div></section>
 <div class="grid grid-2" style="margin-top:13px">${items.map(([k,t,s])=>`<section class="card ${c[k]?'done':''}"><div class="kicker">${t}</div><h3>${s}</h3><div class="btn-row"><button class="btn ${c[k]?'primary':'ghost'}" onclick="${k==='checkin'?"setPage('sexual')":`setPage('${k==='workout'?'workout':k}')`}">${c[k]?"Completed ✓":"Open"}</button></div></section>`).join("")}</div>
 <div class="grid grid-2" style="margin-top:13px">${card("Today's targets",`<ul class="list"><li><span class="check">•</span><span>Move your body and complete today's planned session at a manageable effort.</span></li><li><span class="check">•</span><span>Build meals around protein, vegetables/fruit, whole grains or starchy carbs, and unsaturated fats.</span></li><li><span class="check">•</span><span>Hydrate regularly; needs vary with body size, heat and activity.</span></li></ul>`)}${card("Quick Coach",`<p class="muted">Ask for a shorter workout, travel-friendly plan, recovery day, meal ideas or help interpreting your logged trends.</p><div class="btn-row"><button class="btn primary" onclick="setPage('coach')">Ask Coach ✦</button></div>`)}</div>
 <div class="footer">Private by default: your V1 logs are stored in this browser only.</div></div>`;
}

function today(){
 const d=dayObj(), c=data.completions[d.n]||{}, ci=data.checkins[d.n]||{};
 return `<div class="page">${header(`Today's Plan — Day ${d.n}`,d.title+". Keep the goal sustainable: consistency matters more than perfect days.")}
 <div class="grid grid-2">${card("1 · Workout",workoutBody(d.n),`<div class="btn-row"><button class="btn primary" onclick="setPage('workout')">Open workout</button><button class="btn ${c.workout?'primary':'ghost'}" onclick="toggleCompletion('workout')">${c.workout?'Completed ✓':'Mark complete'}</button></div>`)}
 ${card("2 · Nutrition",nutritionBody(),`<div class="btn-row"><button class="btn ${c.nutrition?'primary':'ghost'}" onclick="toggleCompletion('nutrition')">${c.nutrition?'Completed ✓':'Mark nutrition goal complete'}</button></div>`)}
 ${card("3 · Sleep",`<p>Target a regular sleep/wake window and roughly <b>7–9 hours</b> for most adults.</p><p class="muted small">Record actual sleep in the daily check-in.</p>`,`<div class="btn-row"><button class="btn ${c.sleep?'primary':'ghost'}" onclick="toggleCompletion('sleep')">${c.sleep?'Completed ✓':'Mark sleep goal complete'}</button></div>`)}
 ${card("4 · Stress",`<p>5 minutes of slow breathing: inhale gently, exhale a little longer. Then take a 10–20 minute easy walk if practical.</p>`,`<div class="btn-row"><button class="btn ${c.stress?'primary':'ghost'}" onclick="toggleCompletion('stress')">${c.stress?'Completed ✓':'Mark stress goal complete'}</button></div>`)}
 </div></div>`;
}

function workoutBody(n=day()){
 const d=dayObj(n);
 if(!d.keys.length)return `<p><span class="badge green">Recovery / cardio</span></p><p>Today is deliberately lighter. Use easy movement, mobility and recovery rather than forcing a hard session.</p><p class="muted small">${esc(d.cardio)}</p>`;
 return `<div class="exercise-list">${d.keys.map(k=>{let e=exercises[k];return `<div class="exercise"><div class="exercise-top"><b>${e[0]}</b><span>${e[1]}</span></div><span>Rest: ${e[2]}</span><span>${e[3]}</span></div>`}).join("")}</div><p class="muted small" style="margin-bottom:0"><b>Warm-up:</b> 5–8 minutes easy movement + 1 light practice set. <b>Cool-down:</b> 3–5 minutes easy movement and comfortable mobility. Stop for sharp pain, chest pain, fainting or unusual symptoms and seek appropriate care.</p>`;
}
function workout(){
 const d=dayObj(), c=data.completions[d.n]||{};
 return `<div class="page">${header("Workout",d.title+" • "+d.type)}
 <div class="grid grid-main"><section class="card"><div class="kicker">Day ${d.n}</div><h2>${d.title}</h2>${workoutBody(d.n)}<div class="btn-row"><button class="btn primary" onclick="toggleCompletion('workout')">${c.workout?'Workout completed ✓':'Complete workout'}</button><button class="btn ghost" onclick="setPage('coach')">Modify with Coach</button></div></section>
 ${card("Progressive approach",`<ul class="list"><li><span class="check">1</span><span>Start with a load/version that leaves good technique intact.</span></li><li><span class="check">2</span><span>When the top of the rep range feels controlled, add a small amount of resistance or 1–2 reps.</span></li><li><span class="check">3</span><span>Recovery days are part of the plan—not missed workouts.</span></li></ul><div class="notice" style="margin-top:12px">Exercise supports cardiovascular health, fitness, body composition, confidence and overall wellbeing. No individual exercise is guaranteed to increase testosterone or libido.</div>`)}
 </div></div>`;
}

function nutritionBody(){return `<ul class="list"><li><span class="check">P</span><span><b>Protein:</b> eggs, chicken, fish, lean meat, yogurt, milk or legumes.</span></li><li><span class="check">C</span><span><b>Carbs:</b> oats, rice, potatoes, whole grains and fruit.</span></li><li><span class="check">F</span><span><b>Fats:</b> nuts, seeds, olive oil, avocado and fatty fish.</span></li><li><span class="check">+</span><span><b>Plants:</b> aim for variety across vegetables, fruits and legumes.</span></li><li><span class="check">×</span><span><b>Limit:</b> frequent excess alcohol, highly processed foods and added sugars without needing an all-or-nothing diet.</span></li></ul>`}
function nutrition(){return `<div class="page">${header("Nutrition Coach","Build a sustainable eating pattern. Food supports general health; avoid claims that individual foods reliably raise testosterone or libido.")}
 <div class="grid grid-2">${card("Build your plate",nutritionBody())}${card("Simple meal formula",`<div class="stat-row">${metric("1","Protein anchor")}${metric("2","Plants")}${metric("3","Whole-food carbs")}${metric("4","Healthy fats")}</div><p class="muted small" style="margin-bottom:0">Adjust portions to hunger, activity, goals and body size. Extreme restriction is not required.</p>`)}</div>
 <div class="grid grid-3" style="margin-top:13px">${card("Breakfast","Oats + yogurt/milk + fruit + nuts/seeds.")}${card("Lunch","Rice/whole grain + chicken/fish/legumes + vegetables + olive oil.")}${card("Dinner","Potatoes/whole grains + lean protein + vegetables + healthy fat.")}</div>
 ${card("Foods and supplements: what we actually know",`<p>A balanced diet helps supply energy, protein, essential fats, vitamins and minerals. Supplements can be useful when a deficiency or specific need exists, but they are not automatically necessary and should not be treated as guaranteed libido or testosterone boosters.</p><p class="muted small">If you take medicines, have a medical condition, are pregnant/trying to conceive, or are considering high-dose supplements, discuss them with a qualified clinician/pharmacist.</p>`)}
 </div>`}

function sleep(){const ci=data.checkins[day()]||{};return `<div class="page">${header("Sleep","Sleep is a core recovery habit. Aim for approximately 7–9 hours for most adults, while recognizing individual variation.")}
 <div class="grid grid-2">${card("Tonight's routine",`<ul class="list"><li><span class="check">1</span><span>Choose a consistent wake time.</span></li><li><span class="check">2</span><span>Give yourself enough time in bed for your target duration.</span></li><li><span class="check">3</span><span>Dim lights and reduce stimulating screen use before bed if it helps.</span></li><li><span class="check">4</span><span>Keep the bedroom comfortable, dark and quiet where practical.</span></li></ul>`)}
 ${card("Your latest log",`<div class="stat-row">${metric("Sleep duration",ci.sleepHours?ci.sleepHours+" h":"—")}${metric("Quality",ci.sleepQuality?ci.sleepQuality+"/10":"—")}</div><div class="btn-row"><button class="btn primary" onclick="setPage('sexual')">Open daily check-in</button></div>`)}</div></div>`}

function stress(){const c=data.completions[day()]||{};return `<div class="page">${header("Stress Management","Lowering stress is not about being calm all the time. Build small, repeatable recovery moments.")}
 <div class="grid grid-3">${card("Breathing · 5 min","Inhale gently for ~4 seconds and exhale for ~6 seconds. Keep it comfortable; don't force breath holds.")}${card("Walk · 10–30 min","Easy walking can be a practical way to add movement and downtime. Keep the intensity conversational.")}${card("Mindful reset · 5 min","Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste—or simply sit quietly.")}</div>
 <section class="card" style="margin-top:13px"><h2>Daily stress goal</h2><p class="muted">Pick one small action rather than trying to overhaul your day.</p><div class="pill-row"><button class="pill" onclick="toast('5-minute breathing started — use a timer on your phone.')">Breathing</button><button class="pill" onclick="toast('Take a relaxed walk when practical.')">Walking</button><button class="pill" onclick="toast('Set aside 20 minutes of screen-free downtime.')">Downtime</button></div><div class="btn-row"><button class="btn ${c.stress?'primary':'ghost'}" onclick="toggleCompletion('stress')">${c.stress?'Completed ✓':'Mark stress goal complete'}</button></div></section></div>`}

function sexual(){const ci=data.checkins[day()]||{};return `<div class="page">${header("Sexual Wellbeing","A private, optional check-in for patterns over time. These ratings are not diagnostic tests.")}
 <div class="grid grid-main"><section class="card"><form id="checkinForm"><div class="form-grid three">
 ${field("Sleep hours","sleepHours","number","0","24",ci.sleepHours||"")}
 ${range("Sleep quality","sleepQuality",ci.sleepQuality||5)}
 ${range("Energy","energy",ci.energy||5)}
 ${range("Stress","stress",ci.stress||5)}
 ${range("Libido","libido",ci.libido||5)}
 ${range("Sexual wellbeing","sexualWellbeing",ci.sexualWellbeing||5)}
 ${range("Confidence","confidence",ci.confidence||5)}
 ${select("Morning erection frequency (optional)","morningErections",["Prefer not to record","Rarely","Sometimes","Often","Not applicable"],ci.morningErections||"Prefer not to record")}
 ${select("Erectile-function concern (optional)","erectileConcern",["Prefer not to record","No concern","Occasional concern","Persistent concern"],ci.erectileConcern||"Prefer not to record")}
 </div><div class="field" style="margin-top:12px"><label>Any unusual symptoms? (optional)</label><textarea name="symptoms" placeholder="For example: pain, blood in urine/semen, sudden change, medication side effect...">${esc(ci.symptoms||"")}</textarea></div><div class="btn-row"><button class="btn primary">Save private check-in</button></div></form></section>
 ${card("When to seek medical care",`<p>Consider professional medical evaluation for persistent erectile difficulties, persistent loss of libido, genital pain, blood in urine or semen, significant hormonal symptoms, sudden sexual-function changes, medication-related sexual side effects, or other concerning symptoms.</p><div class="notice">Do not self-diagnose low testosterone from symptoms alone. A clinician can assess symptoms, medicines, health history and—when appropriate—testing.</div>`)}
 </div></div>`}
function range(label,name,val){return `<div class="field"><label>${label}</label><div class="range-wrap"><input type="range" min="1" max="10" name="${name}" value="${Number(val)||5}" oninput="this.nextElementSibling.value=this.value"><output>${Number(val)||5}</output></div></div>`}

function supplements(){const supp=[
 ["Vitamin D","Essential nutrient involved in bone, immune and other functions.","Correcting deficiency is useful; routine high-dose use is not established as a universal libido treatment.","Avoid unsupervised high doses; excess can be harmful. Testing and advice may be appropriate when deficiency is suspected."],
 ["Zinc","Mineral required for normal physiological functions.","Adequate intake matters; supplementation is most relevant when intake/levels are inadequate.","High chronic intakes can cause copper deficiency and other problems. Check interactions and total intake."],
 ["Magnesium","Mineral involved in many cellular processes and muscle/nerve function.","Useful for meeting needs when dietary intake is low; not a guaranteed sexual-health enhancer.","Some forms can cause diarrhea; kidney disease warrants professional advice."],
 ["Omega-3","Fatty acids commonly obtained from fish and some supplements.","Supports cardiovascular and general health in appropriate dietary patterns.","Do not assume more is better; high supplemental doses can matter for bleeding risk and medicines."],
 ["Creatine","A well-studied compound used to support high-intensity exercise performance and training adaptations.","Evidence supports exercise-performance benefits; it is not a required libido or testosterone supplement.","Use standard products/doses rather than megadoses; discuss with a clinician if you have kidney disease or relevant medical concerns."]
];return `<div class="page">${header("Supplements","Education, not prescriptions. Food-first nutrition and appropriate medical care come before chasing supplement stacks.")}
 <div class="grid grid-2">${supp.map(s=>card(s[0],`<p><b>What it is:</b> ${s[1]}</p><p><b>What evidence suggests:</b> ${s[2]}</p><p><b>What evidence does NOT show:</b> It is not a guaranteed way to improve libido, erections or testosterone for everyone.</p><p><b>Safety:</b> ${s[3]}</p>`)).join("")}</div>
 <div class="notice" style="margin-top:13px">Supplements can interact with medicines and may be inappropriate in some conditions. Ask a clinician or pharmacist when unsure. Avoid megadoses and products with unclear ingredients.</div></div>`}

function programPage(){return `<div class="page">${header("30-Day Program","A balanced progression: strength, cardio, mobility and recovery. Select any day to inspect it.")}
 <div class="day-strip">${program.map((p,i)=>`<button class="day-dot ${i+1===day()?'active':''} ${completionCount(i+1)>=3?'done':''}" onclick="goDay(${i+1})">${i+1}</button>`).join("")}</div>
 <div class="grid grid-2">${program.map((p,i)=>`<section class="card"><div class="kicker">Day ${i+1} • ${p[1]}</div><h3>${p[0]}</h3><p class="muted small">${p[2].length?p[2].map(k=>exercises[k][0]).join(" • "):"Recovery / cardio focus"}</p><p class="small">${p[3]}</p><div class="btn-row"><button class="btn ${i+1===day()?'primary':'ghost'}" onclick="goDay(${i+1})">${i+1===day()?'Current day':'View day'}</button></div></section>`).join("")}</div></div>`}
function goDay(n){data.currentDay=n;save();setPage("today");}

function progress(){const labels=[],vals=[],sleep=[],stress=[],libido=[],energy=[];for(let n=Math.max(1,day()-13);n<=day();n++){labels.push(n);const c=data.checkins[n]||{};vals.push(completionCount(n)/5*100);sleep.push(Number(c.sleepHours)||0);stress.push(Number(c.stress)||0);libido.push(Number(c.libido)||0);energy.push(Number(c.energy)||0)}return `<div class="page">${header("Progress","See trends without turning health into a score. Your logs remain local in V1.")}
 <div class="grid grid-4">${metric("Workout completion",Math.round(Object.values(data.completions).filter(x=>x.workout).length/30*100)+"%")}${metric("Check-ins",Object.keys(data.checkins).length+"/30")}${metric("Streak",calcStreak()+" days")}${metric("30-day completion",overallPct()+"%")}</div>
 ${chartCard("Completion trend",labels,vals,"%")}${chartCard("Sleep hours",labels,sleep,"h")}${chartCard("Stress / Libido / Energy",labels,libido,"libido /10")}
 <div class="card" style="margin-top:13px"><h2>Strength progress</h2><p class="muted small">Log a movement and a comfortable working load/reps below. This is a training record, not a medical metric.</p><form id="strengthForm" class="form-grid"><input name="exercise" placeholder="Exercise (e.g. squat)" required><input name="value" placeholder="e.g. 12 kg × 10 reps" required><button class="btn primary">Save strength note</button></form><ul class="list">${Object.entries(data.strength).slice(-10).reverse().map(([k,v])=>`<li><span class="check">↗</span><span><b>${esc(k)}</b> — ${esc(v)}</span></li>`).join("")||"<li>No strength notes yet.</li>"}</ul></div>
 </div>`}
function chartCard(title,labels,vals,suffix){return `<section class="card" style="margin-top:13px"><h2>${title}</h2><div class="chart">${labels.map((l,i)=>`<div class="bar-wrap"><div class="bar" title="${vals[i]}${suffix}" style="height:${Math.min(100,Math.max(2,(vals[i]/(suffix==="h"?10:10))*100))}%"></div><div class="bar-label">D${l}</div></div>`).join("")}</div></section>`}

function learn(){return `<div class="page">${header("Learn","Short, practical education for sexual and reproductive health.")}
 <div class="grid grid-2">${card("Sexual function is multifactorial","Desire, arousal and erectile function can be affected by sleep, stress, cardiovascular health, physical activity, relationships, mental wellbeing, medications and medical conditions. Lifestyle habits can support health without guaranteeing a specific sexual outcome.")}${card("Erections & cardiovascular health","Erectile difficulties can sometimes share risk factors with cardiovascular and metabolic health. Persistent problems deserve medical evaluation rather than self-treatment.")}${card("Hormones","Symptoms alone cannot diagnose low testosterone. If clinically appropriate, a healthcare professional can assess symptoms and decide whether testing is warranted.")}${card("Fertility basics","Fertility depends on multiple factors in both partners. General healthy habits support health, but fertility concerns often need individualized evaluation.")}${card("Medication effects","Some medicines can affect libido or sexual function. Do not stop prescribed medicines on your own; ask the prescriber about alternatives or side effects.")}${card("Red flags","Seek medical care for persistent or sudden sexual-function changes, genital pain, blood in urine/semen, significant hormonal symptoms or other concerning symptoms.")}</div>
 <div class="notice" style="margin-top:13px">This app provides general health and wellness information. It does not diagnose or treat medical conditions.</div></div>`}

function coach(){return `<div class="page">${header("Ask Coach","V1 uses a local rule-based coach so no private sexual-health data is sent to a server. A secure backend can replace it later.")}
 <div class="grid grid-main"><section class="card"><div id="coachHistory">${data.coach.length?data.coach.map(m=>`<div class="coach-msg ${m.role==='user'?'user':'ai'}">${esc(m.text)}</div>`).join(""):`<div class="empty">Try: “I only have 20 minutes.”<br>“I didn't sleep well.”<br>“Give me a home workout.”</div>`}</div>
 <form id="coachForm" style="display:flex;gap:8px;margin-top:12px"><input name="message" style="flex:1;background:#0b0e14;border:1px solid var(--line);border-radius:13px;padding:12px;color:var(--text)" placeholder="Ask about today's plan..." required><button class="btn primary">Send</button></form></section>
 ${card("Coach context",`<p class="muted small">Day ${day()} • ${data.onboarding?.fitness||"Beginner"} • ${data.onboarding?.equipment||"Bodyweight only"} • ${data.onboarding?.days||3} training days/week</p><p class="muted small">The local coach can personalize general wellness advice from these stored settings and your check-in trends. It does not diagnose conditions.</p>`)}</div></div>`}

function localCoach(q){q=q.toLowerCase();const d=dayObj();if(q.includes("20 minute")||q.includes("short"))return `For 20 minutes today: 3 minutes easy warm-up, then 3 rounds of ${d.keys.slice(0,3).map(k=>exercises[k][0]).join(", ")} for 8–12 controlled reps each, with short rests. Finish with 3 minutes easy movement. If today is a recovery day, keep it as an easy walk + mobility session.`;if(q.includes("sleep")||q.includes("didn't sleep")||q.includes("didnt sleep"))return `If you slept poorly, don't try to “make up” for it with an all-out workout. Reduce volume or intensity, choose an easy walk/mobility session, hydrate normally, and prioritize a consistent bedtime tonight. If poor sleep is persistent, consider discussing it with a clinician.`;if(q.includes("eat")||q.includes("food")||q.includes("meal"))return `Build today around a protein source, vegetables/fruit, a whole-food carbohydrate, and a healthy fat. Example: eggs + oats + fruit at breakfast; chicken/fish/legumes + rice + vegetables at lunch; yogurt/fruit/nuts as a snack. Adjust portions to your hunger and activity.`;if(q.includes("travel"))return `Travel mode: aim for 10–20 minutes of walking, 2–3 simple bodyweight sets when practical, regular hydration, protein + produce at meals, and protect your sleep window. Don't worry about making the routine perfect.`;if(q.includes("home"))return `Home option: squat, incline push-up, backpack row, hip hinge and plank. Do 2–3 sets each, 8–12 reps (20–40 sec for plank), with controlled technique. Use a stable support and stop if you have pain or unusual symptoms.`;if(q.includes("recovery"))return `Make tomorrow a recovery day by keeping activity easy: 15–30 minutes walking, 5–10 minutes comfortable mobility, normal meals and hydration, and a consistent sleep opportunity.`;if(q.includes("energy")||q.includes("low"))return `Low energy can have many causes, including sleep, stress, nutrition, training load, illness and medicines. Check your recent sleep and recovery logs, reduce training intensity if needed, and don't assume a hormone problem from energy alone. Persistent or significant symptoms merit professional evaluation.`;return `For Day ${day()}, your focus is ${d.title}. I can help shorten or modify the workout, build a simple meal plan, create a recovery day, or adapt the plan for home/travel. I’ll keep suggestions general and won't diagnose medical conditions.`;}

function settings(){const p=data.onboarding||{};return `<div class="page">${header("Settings","Change your plan, export your data, or reset this browser's local copy.")}
 <div class="grid grid-2">${card("Profile",`<form id="settingsForm" class="form-grid">${select("Fitness level","fitness",["Beginner","Intermediate","Advanced"],p.fitness||"Beginner")}${select("Equipment","equipment",["Bodyweight only","Dumbbells / bands","Home gym","Full gym"],p.equipment||"Bodyweight only")}${select("Training days/week","days",["2","3","4","5","6"],p.days||"3")}${select("Main goal","goal",["General sexual wellbeing","Fitness & body composition","Energy & recovery","Strength & confidence","Healthy routine"],p.goal||"General sexual wellbeing")}<div class="btn-row" style="grid-column:1/-1"><button class="btn primary">Save settings</button></div></form>`)}
 ${card("Data controls",`<p class="muted small">Export creates a JSON backup. Import restores a backup into this browser.</p><div class="btn-row"><button class="btn" onclick="exportData()">Export data</button><label class="btn" style="display:inline-block">Import data<input id="importFile" type="file" accept="application/json" hidden></label><button class="btn danger" onclick="clearData()">Clear all data</button></div>`)}
 </div></div>`}

function privacy(){return `<div class="page">${header("Privacy & Safety","V1 is designed to keep private check-ins on-device.")}
 <div class="grid grid-2">${card("Local-first storage","Your onboarding, check-ins, progress, weight notes and coach history are stored in browser localStorage. V1 does not send this data to an AI service or analytics server.")}${card("Your control","Use Export data to keep a backup, Import data to restore it, or Clear all data to remove the app's local storage from this browser.")}${card("Medical boundary","This app provides general health and wellness information. It does not diagnose or treat medical conditions. It is not a substitute for a clinician.")}${card("Get evaluated when needed","Persistent erectile difficulties, persistent loss of libido, genital pain, blood in urine/semen, sudden sexual-function changes, significant hormonal symptoms, medication-related sexual side effects, or other concerning symptoms warrant professional evaluation.")}</div>
 <div class="notice" style="margin-top:13px">For the safest AI integration, send only the minimum necessary data from a user-approved request to a server-side endpoint. Never put a provider API key in browser JavaScript.</div></div>`}

function render(){let content;switch(page){case"onboarding":content=onboarding();break;case"dashboard":content=dashboard();break;case"today":content=today();break;case"program":content=programPage();break;case"workout":content=workout();break;case"nutrition":content=nutrition();break;case"sleep":content=sleep();break;case"stress":content=stress();break;case"sexual":content=sexual();break;case"supplements":content=supplements();break;case"progress":content=progress();break;case"learn":content=learn();break;case"coach":content=coach();break;case"settings":content=settings();break;case"privacy":content=privacy();break;default:page="dashboard";content=dashboard()}document.getElementById("app").innerHTML=shell(content);bind();}
function bind(){
 const o=document.getElementById("onboardForm");if(o)o.onsubmit=e=>{e.preventDefault();const f=new FormData(o);data.onboarding=Object.fromEntries(f.entries());data.currentDay=1;save();setPage("dashboard");};
 const c=document.getElementById("checkinForm");if(c)c.onsubmit=e=>{e.preventDefault();const f=new FormData(c);data.checkins[day()]=Object.fromEntries(f.entries());data.completions[day()]={...(data.completions[day()]||{}),checkin:true};save();toast("Private check-in saved.");render();};
 const s=document.getElementById("strengthForm");if(s)s.onsubmit=e=>{e.preventDefault();const f=new FormData(s);data.strength[f.get("exercise")]=f.get("value");save();toast("Strength note saved.");render();};
 const cf=document.getElementById("coachForm");if(cf)cf.onsubmit=e=>{e.preventDefault();const f=new FormData(cf),q=String(f.get("message")).trim();if(!q)return;data.coach.push({role:"user",text:q});data.coach.push({role:"ai",text:localCoach(q)});save();render();};
 const sf=document.getElementById("settingsForm");if(sf)sf.onsubmit=e=>{e.preventDefault();data.onboarding={...data.onboarding,...Object.fromEntries(new FormData(sf).entries())};save();toast("Settings saved.");render();};
 const imp=document.getElementById("importFile");if(imp)imp.onchange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x||x.version!==1)throw Error();data={...defaultData,...x};save();toast("Data imported.");render()}catch(err){alert("That backup file is not valid for this V1.")}};r.readAsText(file);}
}
function toggleCompletion(k){data.completions[day()]={...(data.completions[day()]||{}),[k]:!(data.completions[day()]||{})[k]};if(day()<30&&completionCount(day())>=5)data.currentDay=day()+1;save();render();}
function exportData(){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="30-day-sexual-health-coach-backup.json";a.click();URL.revokeObjectURL(a.href);}
function clearData(){if(confirm("Clear all 30-Day Sexual Health Coach data from this browser? This cannot be undone unless you have an export.")){localStorage.removeItem(KEY);data=load();page="onboarding";location.hash="onboarding";render();}}
function toast(msg){const el=document.createElement("div");el.textContent=msg;Object.assign(el.style,{position:"fixed",left:"50%",bottom:"82px",transform:"translateX(-50%)",background:"#151a24",border:"1px solid #394251",padding:"11px 15px",borderRadius:"13px",zIndex:100,boxShadow:"0 15px 40px rgba(0,0,0,.4)",fontSize:"13px"});document.body.appendChild(el);setTimeout(()=>el.remove(),2200);}
window.setPage=setPage;window.toggleCompletion=toggleCompletion;window.goDay=goDay;window.exportData=exportData;window.clearData=clearData;window.toast=toast;
render();
})();