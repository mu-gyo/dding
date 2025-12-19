

function setButtonLoading(btn, isLoading, loadingText="계산 중…"){
  if(!btn) return;

  if(isLoading){
    if(!btn.dataset.label){
      btn.dataset.label = btn.textContent.trim();
    }
    btn.classList.add("loading");
    btn.innerHTML = `<span class="spinner"></span>${loadingText}`;
    btn.disabled = true;
  }else{
    btn.classList.remove("loading");
    btn.disabled = false;
    btn.textContent = btn.dataset.label || btn.textContent;
  }
}


// ================================
// 64개 단위 세트 표기
// - n이 0이면 "0개"
// - 64 이상이면 "x세트 + y개" (y=0이면 "+ y개" 생략)
// ================================
function fmtSet64(n) {
  const v = Math.max(0, Math.floor(Number(n || 0)));
  const set = Math.floor(v / 64);
  const rem = v % 64;

  if (set <= 0) return `${v}개`;
  if (rem <= 0) return `${set}세트`;
  return `${set}세트 + ${rem}개`;
}


// ================================
// 제작량 y(길이 9) → 어패류 소모량 need(길이 15) 계산
// need[i] = Σ_j A[i][j] * y[j]
// ================================
function calcFishNeed(y) {
  const A = buildFishMatrix(); // 15x9
  const rows = 15;
  const cols = 9;

  const yy = Array.isArray(y) ? y : [];
  const need = Array(rows).fill(0);

  for (let i = 0; i < rows; i++) {
    let s = 0;
    for (let j = 0; j < cols; j++) {
      const aij = Number(A[i][j] || 0);
      const yj  = Number(yy[j] || 0);
      s += aij * yj;
    }
    need[i] = s;
  }

  return need;
}

// =========================
// 어패류 판별 유틸 (반드시 calcMatNeed보다 위!)
// =========================
const FISH_BASE = [
  "굴", "소라", "문어", "미역", "성게",
  "익히지 않은 새우", "익히지 않은 도미", "익히지 않은 청어",
  "금붕어", "농어"
];

const STAR_LV = ["★", "★★", "★★★"];

const FISH_SET = new Set(
  FISH_BASE.flatMap(b => [
    ...STAR_LV.map(s => `${b} ${s}`),
    ...STAR_LV.map(s => `${b}${s}`)
  ])
);

function isFishItem(name){
  return FISH_SET.has(String(name || "").trim());
}

// ================================
// 중간재(정수/에센스/엘릭서 등) 재고 → 어패류 절약분(= supply에 더해줄 값) 계산
// - "이미 만들어진 중간재"는 그걸 만들 때 썼을 어패류를 아낀 것으로 간주
// - 결과: { "굴 ★": n, "소라 ★★": n, ... } 형태
// ================================
const MID_ITEMS = [
  // =========================
  // 1성 정수 ★
  // =========================
  "수호의 정수 ★",
  "파동의 정수 ★",
  "혼란의 정수 ★",
  "생명의 정수 ★",
  "부식의 정수 ★",

  // =========================
  // 1성 핵 ★
  // =========================
  "물결 수호의 핵 ★",
  "파동 오염의 핵 ★",
  "질서 파괴의 핵 ★",
  "활력 붕괴의 핵 ★",
  "침식 방어의 핵 ★",

  // =========================
  // 2성 에센스 ★★
  // =========================
  "수호 에센스 ★★",
  "파동 에센스 ★★",
  "혼란 에센스 ★★",
  "생명 에센스 ★★",
  "부식 에센스 ★★",

  // =========================
  // 2성 결정 ★★  (중간재 맞음)
  // =========================
  "활기 보존의 결정 ★★",
  "파도 침식의 결정 ★★",
  "방어 오염의 결정 ★★",
  "격류 재생의 결정 ★★",
  "맹독 혼란의 결정 ★★",

  // =========================
  // 3성 엘릭서 ★★★
  // =========================
  "수호의 엘릭서 ★★★",
  "파동의 엘릭서 ★★★",
  "혼란의 엘릭서 ★★★",
  "생명의 엘릭서 ★★★",
  "부식의 엘릭서 ★★★",

  // =========================
  // 3성 영약 ★★★  (중간재 맞음)
  // =========================
  "불멸 재생의 영약 ★★★",
  "파동 장벽의 영약 ★★★",
  "타락 침식의 영약 ★★★",
  "생명 광란의 영약 ★★★",
  "맹독 파동의 영약 ★★★"
];


const MID_SECTIONS = [
  { title:"정수 ★", items:[
    "수호의 정수 ★","파동의 정수 ★","혼란의 정수 ★","생명의 정수 ★","부식의 정수 ★"
  ]},
  { title:"핵 ★", items:[
    "물결 수호의 핵 ★","파동 오염의 핵 ★","질서 파괴의 핵 ★","활력 붕괴의 핵 ★","침식 방어의 핵 ★"
  ]},
  { title:"에센스 ★★", items:[
    "수호 에센스 ★★","파동 에센스 ★★","혼란 에센스 ★★","생명 에센스 ★★","부식 에센스 ★★"
  ]},
  { title:"결정 ★★", items:[
    "활기 보존의 결정 ★★","파도 침식의 결정 ★★","방어 오염의 결정 ★★","격류 재생의 결정 ★★","맹독 혼란의 결정 ★★"
  ]},
  { title:"엘릭서 ★★★", items:[
    "수호의 엘릭서 ★★★","파동의 엘릭서 ★★★","혼란의 엘릭서 ★★★","생명의 엘릭서 ★★★","부식의 엘릭서 ★★★"
  ]},
  { title:"영약 ★★★", items:[
    "불멸 재생의 영약 ★★★","파동 장벽의 영약 ★★★","타락 침식의 영약 ★★★","생명 광란의 영약 ★★★","맹독 파동의 영약 ★★★"
  ]},
];



// calcMatNeed 안에 있던 레시피를 "중간재 전개용"으로 재사용 (복붙이지만 1차 구현은 이게 안전)
function getAllRecipesForMid(){
  const R1 = {
    "수호의 정수 ★": { "굴 ★": 1, "점토": 1 },
    "파동의 정수 ★": { "소라 ★": 1, "모래": 3 },
    "혼란의 정수 ★": { "문어 ★": 1, "흙": 4 },
    "생명의 정수 ★": { "미역 ★": 1, "자갈": 2 },
    "부식의 정수 ★": { "성게 ★": 1, "화강암": 1 },

    "물결 수호의 핵 ★": { "수호의 정수 ★": 1, "파동의 정수 ★": 1, "익히지 않은 새우": 1 },
    "파동 오염의 핵 ★": { "파동의 정수 ★": 1, "혼란의 정수 ★": 1, "익히지 않은 도미": 1 },
    "질서 파괴의 핵 ★": { "혼란의 정수 ★": 1, "생명의 정수 ★": 1, "익히지 않은 청어": 1 },
    "활력 붕괴의 핵 ★": { "생명의 정수 ★": 1, "부식의 정수 ★": 1, "금붕어": 1 },
    "침식 방어의 핵 ★": { "부식의 정수 ★": 1, "수호의 정수 ★": 1, "농어": 1 },

    "영생의 아쿠티스 ★": { "물결 수호의 핵 ★": 1, "질서 파괴의 핵 ★": 1, "활력 붕괴의 핵 ★": 1 },
    "크라켄의 광란체 ★": { "질서 파괴의 핵 ★": 1, "활력 붕괴의 핵 ★": 1, "파동 오염의 핵 ★": 1 },
    "리바이던의 깃털 ★": { "침식 방어의 핵 ★": 1, "파동 오염의 핵 ★": 1, "물결 수호의 핵 ★": 1 }
  };

  const R2 = {
    "수호 에센스 ★★": { "굴 ★★": 1, "해초": 2, "죽은 관 산호 블록": 1 },
    "파동 에센스 ★★": { "소라 ★★": 1, "해초": 2, "죽은 사방 산호 블록": 1 },
    "혼란 에센스 ★★": { "문어 ★★": 1, "해초": 2, "죽은 거품 산호 블록": 1 },
    "생명 에센스 ★★": { "미역 ★★": 1, "해초": 2, "죽은 불 산호 블록": 1 },
    "부식 에센스 ★★": { "성게 ★★": 1, "해초": 2, "죽은 뇌 산호 블록": 1 },
    "활기 보존의 결정 ★★": { "수호 에센스 ★★": 1, "생명 에센스 ★★": 1, "먹물 주머니": 1, "청금석 블록": 1 },
    "파도 침식의 결정 ★★": { "파동 에센스 ★★": 1, "부식 에센스 ★★": 1, "먹물 주머니": 1, "레드스톤 블록": 1 },
    "방어 오염의 결정 ★★": { "혼란 에센스 ★★": 1, "수호 에센스 ★★": 1, "먹물 주머니": 1, "철 주괴": 1 },
    "격류 재생의 결정 ★★": { "생명 에센스 ★★": 1, "파동 에센스 ★★": 1, "먹물 주머니": 1, "금 주괴": 1 },
    "맹독 혼란의 결정 ★★": { "부식 에센스 ★★": 1, "혼란 에센스 ★★": 1, "먹물 주머니": 1, "다이아몬드": 1 },
    "해구 파동의 코어 ★★": { "활기 보존의 결정 ★★": 1, "파도 침식의 결정 ★★": 1, "격류 재생의 결정 ★★": 1 },
    "침묵의 심해 비약 ★★": { "파도 침식의 결정 ★★": 1, "격류 재생의 결정 ★★": 1, "맹독 혼란의 결정 ★★": 1 },
    "청해룡의 날개 ★★": { "방어 오염의 결정 ★★": 1, "맹독 혼란의 결정 ★★": 1, "활기 보존의 결정 ★★": 1 },
  };

  const R3 = {
    "수호의 엘릭서 ★★★": { "굴 ★★★": 1, "불우렁쉥이": 1, "유리병": 3, "네더랙": 16 },
    "파동의 엘릭서 ★★★": { "소라 ★★★": 1, "불우렁쉥이": 1, "유리병": 3, "마그마 블록": 8 },
    "혼란의 엘릭서 ★★★": { "문어 ★★★": 1, "불우렁쉥이": 1, "유리병": 3, "영혼 흙": 8 },
    "생명의 엘릭서 ★★★": { "미역 ★★★": 1, "불우렁쉥이": 1, "유리병": 3, "진홍빛 자루": 4 },
    "부식의 엘릭서 ★★★": { "성게 ★★★": 1, "불우렁쉥이": 1, "유리병": 3, "뒤틀린 자루": 4 },
    "불멸 재생의 영약 ★★★": { "수호의 엘릭서 ★★★": 1, "생명의 엘릭서 ★★★": 1, "발광 먹물 주머니": 1, "발광 열매": 2, "수레국화": 1 },
    "파동 장벽의 영약 ★★★": { "파동의 엘릭서 ★★★": 1, "수호의 엘릭서 ★★★": 1, "발광 먹물 주머니": 1, "발광 열매": 2, "민들레": 1 },
    "타락 침식의 영약 ★★★": { "혼란의 엘릭서 ★★★": 1, "부식의 엘릭서 ★★★": 1, "발광 먹물 주머니": 1, "발광 열매": 2, "데이지": 1 },
    "생명 광란의 영약 ★★★": { "생명의 엘릭서 ★★★": 1, "혼란의 엘릭서 ★★★": 1, "발광 먹물 주머니": 1, "발광 열매": 2, "양귀비": 1 },
    "맹독 파동의 영약 ★★★": { "부식의 엘릭서 ★★★": 1, "파동의 엘릭서 ★★★": 1, "발광 먹물 주머니": 1, "발광 열매": 2, "선애기별꽃": 1 },
    "아쿠아 펄스 파편 ★★★": { "불멸 재생의 영약 ★★★": 1, "파동 장벽의 영약 ★★★": 1, "맹독 파동의 영약 ★★★": 1 },
    "나우틸러스의 손 ★★★": { "파동 장벽의 영약 ★★★": 1, "생명 광란의 영약 ★★★": 1, "불멸 재생의 영약 ★★★": 1 },
    "무저의 척추 ★★★": { "타락 침식의 영약 ★★★": 1, "맹독 파동의 영약 ★★★": 1, "생명 광란의 영약 ★★★": 1 },
  };

  return { ...R1, ...R2, ...R3 };
}

// 탭2 표기용: (최종품 yFinal 기준) 중간재 재고를 먼저 쓰고, 부족분만 재료로 분해
function calcNetNeedsForActualWithMidInv(yFinal){
  const recipes = getAllRecipesForMid();    // 최종품 9개 포함
  const fishSet = new Set(FISH_ROWS);

  const inv0 = (typeof loadMidInv === "function") ? (loadMidInv() || {}) : {};
  const inv = {};
  for(const [k,v] of Object.entries(inv0)) inv[k] = Math.max(0, Math.floor(Number(v||0)));

  const needFish = new Map();
  const needMat  = new Map();

  const addNeed = (map, k, v) => {
    if(v <= 0) return;
    map.set(k, (map.get(k) || 0) + v);
  };

  const expandNeed = (item, qty, depth=0) => {
    qty = Math.max(0, Math.floor(Number(qty||0)));
    if(qty <= 0) return;
    if(depth > 40) return;

    // ✅ 중간재 재고 먼저 소비
    const have = Math.max(0, Math.floor(Number(inv[item] || 0)));
    if(have > 0){
      const use = Math.min(have, qty);
      inv[item] = have - use;
      qty -= use;
      if(qty <= 0) return;
    }

    const r = recipes[item];
    if(!r){
      if(fishSet.has(item)) addNeed(needFish, item, qty);
      else addNeed(needMat, item, qty);
      return;
    }
    for(const [ing, q] of Object.entries(r)){
      expandNeed(ing, qty * Number(q||0), depth+1);
    }
  };

  // 최종품 9개에서 시작
  PRODUCTS.forEach((p, i)=>{
    const q = Math.max(0, Math.floor(Number(yFinal[i] || 0)));
    if(q) expandNeed(p.name, q, 0);
  });

  // fish 표 렌더 편의
  FISH_ROWS.forEach(f=>{
    if(!needFish.has(f)) needFish.set(f, 0);
  });

  return {needFish, needMat};
}



// ================================
// TAB1: 표기용 '필요 어패류/부재료' (중간재 재고 차감 반영)
// - 탭1은 계획(기대) 화면이라 "중간재 재고"는 이미 완성된 것으로 보고,
//   그 중간재를 만들기 위해 필요한 어패류/부재료는 '필요량'에서 차감해서 표기한다.
// - (최적화 자체는 기존 방식 유지, 표기만 정확하게)
// ================================
// 탭1 표기용: "중간재 재고를 먼저 소비"하고, 부족분만 재료로 분해해서 needFish/needMat 계산
function calcNetNeedsForExpectedWithMidInv(qtys){
  // qtys 안 주면 DOM에서 읽어도 되게
  if(!Array.isArray(qtys)){
    qtys = PRODUCTS.map((p, idx)=> Math.max(0, Math.floor(Number(document.getElementById(`qty_${idx}`)?.value || 0))));
  }

  // ✅ 탭1(기대값) 원칙:
  // - 중간재 재고는 "어패류 환산 credit"으로만 사용
  // - 부재료/블럭 등의 필요량(needMat)은 중간재 재고로 차감하지 않음
  const recipes = getAllRecipesForMid();
  const fishSet = new Set(FISH_ROWS);

  const needFish = new Map();
  const needMat  = new Map();

  const addNeed = (map, k, v) => {
    if(v <= 0) return;
    map.set(k, (map.get(k) || 0) + v);
  };

  // ✅ 재고 소비 없이 "총 필요량"만 전개
  const expandGross = (item, qty, depth=0) => {
    qty = Math.max(0, Math.floor(Number(qty||0)));
    if(qty <= 0) return;
    if(depth > 40) return;

    const r = recipes[item];
    if(!r){
      if(fishSet.has(item)) addNeed(needFish, item, qty);
      else addNeed(needMat, item, qty);
      return;
    }
    for(const [ing, q] of Object.entries(r)){
      expandGross(ing, qty * Number(q||0), depth+1);
    }
  };

  qtys.forEach((q, i)=>{
    const qq = Math.max(0, Math.floor(Number(q || 0)));
    if(!qq) return;
    expandGross(PRODUCTS[i].name, qq, 0);
  });

  // ✅ 중간재 재고의 어패류 환산 credit만 적용(needFish에만 적용)
  try{
    const credit = getFishCreditFromMidInv(); // { fishName: qty }
    for(const [fishName, c] of Object.entries(credit || {})){
      const cc = Math.max(0, Math.floor(Number(c || 0)));
      if(cc <= 0) continue;
      const before = Math.max(0, Math.floor(Number(needFish.get(fishName) || 0)));
      const after  = Math.max(0, before - cc);
      if(after > 0) needFish.set(fishName, after);
      else needFish.delete(fishName);
    }
  }catch(e){}

  // fish는 표에서 항상 모든 행이 필요하니 0도 채워줌(렌더 편의)
  FISH_ROWS.forEach(f=>{
    if(!needFish.has(f)) needFish.set(f, 0);
  });

  return {needFish, needMat};
}

// ================================
// 중간재 재고: localStorage 기반
// ================================
const LS_KEY_MIDINV = "DDTY_MIDINV_V1";

const LS_KEY_MIDINV_SAVED_AT = "DDTY_MIDINV_SAVED_AT_V1";

function anyMidInv(inv){
  return Object.values(inv || {}).some(v => Number(v) > 0);
}

function updateMidInvBadge(){
  const inv = loadMidInv();
  const els = [
    document.getElementById("midInvBadge"),
    document.getElementById("midInvBadgeA"),
  ].filter(Boolean);

  if(els.length === 0) return;

  if(!anyMidInv(inv)){
    els.forEach(e => e.textContent = "미입력");
    return;
  }

  const t = Number(localStorage.getItem(LS_KEY_MIDINV_SAVED_AT) || 0);
  const d = t ? new Date(t) : null;
  const hhmm = d ? `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}` : "";
  els.forEach(e => e.textContent = hhmm ? `저장됨 ${hhmm}` : "저장됨");
}

function clearMidInvAll(){
  localStorage.removeItem(LS_KEY_MIDINV);
  localStorage.removeItem(LS_KEY_MIDINV_SAVED_AT);
}



function updateMidInvHint(){
  // 두 패널 모두 갱신
  const hintEls = document.querySelectorAll("#midInvDetails .midHint, #midInvDetailsA .midHint");

  let sum = 0;
  try{
    const credit = getFishCreditFromMidInv();
    for(const v of Object.values(credit || {})){
      sum += Number(v || 0);
    }
  }catch(e){}

  const n = Math.max(0, Math.floor(sum));
  hintEls.forEach(h=>{
    h.textContent = (n > 0) ? `어패류 환산 +${n}` : `필요할 때만 열어서 입력`;
  });
}

function renderMidInvGrid(){
  const hosts = [
    document.getElementById("midInvGrid"),
    document.getElementById("midInvGridA"),
  ].filter(Boolean);

  if(hosts.length === 0) return;

  const inv = loadMidInv();

  const html = (MID_SECTIONS || []).map(sec => {
    const rows = (sec.items || []).map(name => {
      const v = Math.max(0, Math.floor(Number(inv[name] ?? 0)));
      return `
        <div class="midInvRow">
          <div class="midLabel">${matLabel(name)}</div>
          <input type="number" min="0" step="1" inputmode="numeric"
                 value="${v}" data-mid="${name}" aria-label="${name} 재고"/>
        </div>
      `;
    }).join("");

    return `
      <div class="midSec">
        <div class="midSecTitle">${sec.title}</div>
        <div class="midSecGrid">${rows}</div>
      </div>
    `;
  }).join("");

  hosts.forEach(h => h.innerHTML = html);

  // 이벤트 바인딩
  hosts.forEach(host=>{
    host.querySelectorAll('input[data-mid]').forEach((inp)=>{
      const name = inp.getAttribute("data-mid");

      const commit = ()=>{
        const v = Math.max(0, Math.floor(Number(inp.value || 0)));
        inp.value = String(v);

        setMidInvQty(name, v);

        // 다른 패널 동기화
        document.querySelectorAll(`input[data-mid="${CSS.escape(name)}"]`).forEach(x=>{
          if(x !== inp) x.value = String(v);
        });

        try{ recalcFromCurrent(); }catch(e){}
        try{ updateTotalsActual(); }catch(e){}
        updateMidInvHint();
        updateMidInvBadge(); // ✅ 추가
      };

      inp.addEventListener("change", commit);
      inp.addEventListener("blur", commit);
      inp.addEventListener("keydown", (e)=>{
        if(e.key === "Enter"){
          e.preventDefault();
          commit();
          inp.blur();
        }
      });
    });
  });

  updateMidInvHint();
  updateMidInvBadge(); // ✅ 추가
}

function bindMidInvResetButtons(){
  const btns = [
    document.getElementById("midInvReset"),
    document.getElementById("midInvResetA"),
  ].filter(Boolean);

  btns.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      if(!confirm("중간재 재고를 모두 0으로 초기화할까요?")) return;
      clearMidInvAll();
      renderMidInvGrid();
      try{ recalcFromCurrent(); }catch(e){}
      try{ updateTotalsActual(); }catch(e){}
      updateMidInvHint();
      updateMidInvBadge();
    });
  });
}

function loadMidInv(){
  const raw = localStorage.getItem(LS_KEY_MIDINV);
  if(!raw) return {};
  try{
    const obj = JSON.parse(raw);
    return (obj && typeof obj === "object") ? obj : {};
  }catch(e){
    return {};
  }
}

function saveMidInv(obj){
  localStorage.setItem(LS_KEY_MIDINV, JSON.stringify(obj || {}));
  localStorage.setItem(LS_KEY_MIDINV_SAVED_AT, String(Date.now())); // ✅ 추가
}


function getMidInvQty(name){
  const inv = loadMidInv();
  const v = Number(inv[name] ?? 0);
  return Math.max(0, Math.floor(v || 0));
}

function setMidInvQty(name, qty){
  const inv = loadMidInv();
  inv[name] = Math.max(0, Math.floor(Number(qty || 0)));
  saveMidInv(inv);
}


// 중간재 1개를 만들 때 들어가는 "어패류"만 전개해서 모으기
function expandToFishOnly(itemName, qty, ALL, out){
  const recipe = ALL[itemName];
  if(!recipe){
    if(isFishItem(itemName)){
      out[itemName] = (out[itemName] || 0) + qty;
    }
    return;
  }
  for(const [child, cqty] of Object.entries(recipe)){
    expandToFishOnly(child, qty * cqty, ALL, out);
  }
}

// 중간재 재고 전체 → 어패류 절약분 합산
function getFishCreditFromMidInv(){
  const ALL = getAllRecipesForMid();
  const fishCredit = {}; // { "굴 ★": n, ... }

  for(const mid of MID_ITEMS){
    const q = getMidInvQty(mid);
    if(q <= 0) continue;
    expandToFishOnly(mid, q, ALL, fishCredit);
  }
  return fishCredit;
}


// ================================
// 제작량 y(9개 최종품) → 전체 재료 필요량 계산 (부재료/중간재 포함)
// 반환: { items: [{name, qty}], totals: { [name]: qty } }
// ================================
function calcMatNeed(y) {
  const yy = Array.isArray(y) ? y.map(v => Number(v || 0)) : Array(9).fill(0);

  // --- 유틸 ---
  const add = (totals, name, qty) => {
    if (!qty) return;
  if (isFishItem(name)) return;
    totals[name] = (totals[name] || 0) + qty;
  };

  // --- 레시피 정의 (네가 준 그대로) ---
  // 1성 정수
  const R1 = {
    "수호의 정수 ★": { "굴 ★": 1, "점토": 1 },
    "파동의 정수 ★": { "소라 ★": 1, "모래": 3 },
    "혼란의 정수 ★": { "문어 ★": 1, "흙": 4 },
    "생명의 정수 ★": { "미역 ★": 1, "자갈": 2 },
    "부식의 정수 ★": { "성게 ★": 1, "화강암": 1 },

    "물결 수호의 핵 ★": { "수호의 정수 ★": 1, "파동의 정수 ★": 1, "익히지 않은 새우": 1 },
    "파동 오염의 핵 ★": { "파동의 정수 ★": 1, "혼란의 정수 ★": 1, "익히지 않은 도미": 1 },
    "질서 파괴의 핵 ★": { "혼란의 정수 ★": 1, "생명의 정수 ★": 1, "익히지 않은 청어": 1 },
    "활력 붕괴의 핵 ★": { "생명의 정수 ★": 1, "부식의 정수 ★": 1, "금붕어": 1 },
    "침식 방어의 핵 ★": { "부식의 정수 ★": 1, "수호의 정수 ★": 1, "농어": 1 },

    "영생의 아쿠티스 ★": { "물결 수호의 핵 ★": 1, "질서 파괴의 핵 ★": 1, "활력 붕괴의 핵 ★": 1 },
    "크라켄의 광란체 ★": { "질서 파괴의 핵 ★": 1, "활력 붕괴의 핵 ★": 1, "파동 오염의 핵 ★": 1 },
    "리바이던의 깃털 ★": { "침식 방어의 핵 ★": 1, "파동 오염의 핵 ★": 1, "물결 수호의 핵 ★": 1 }
  };

  // 2성
  const R2 = {
    "수호 에센스 ★★": { "굴 ★★": 1, "해초": 2, "죽은 관 산호 블록": 1 },
    "파동 에센스 ★★": { "소라 ★★": 1, "해초": 2, "죽은 사방 산호 블록": 1 },
    "혼란 에센스 ★★": { "문어 ★★": 1, "해초": 2, "죽은 거품 산호 블록": 1 },
    "생명 에센스 ★★": { "미역 ★★": 1, "해초": 2, "죽은 불 산호 블록": 1 },
    "부식 에센스 ★★": { "성게 ★★": 1, "해초": 2, "죽은 뇌 산호 블록": 1 },
    "활기 보존의 결정 ★★": { "수호 에센스 ★★": 1, "생명 에센스 ★★": 1, "먹물 주머니": 1, "청금석 블록": 1 },
    "파도 침식의 결정 ★★": { "파동 에센스 ★★": 1, "부식 에센스 ★★": 1, "먹물 주머니": 1, "레드스톤 블록": 1 },
    "방어 오염의 결정 ★★": { "혼란 에센스 ★★": 1, "수호 에센스 ★★": 1, "먹물 주머니": 1, "철 주괴": 1 },
    "격류 재생의 결정 ★★": { "생명 에센스 ★★": 1, "파동 에센스 ★★": 1, "먹물 주머니": 1, "금 주괴": 1 },
    "맹독 혼란의 결정 ★★": { "부식 에센스 ★★": 1, "혼란 에센스 ★★": 1, "먹물 주머니": 1, "다이아몬드": 1 },
    "해구 파동의 코어 ★★": { "활기 보존의 결정 ★★": 1, "파도 침식의 결정 ★★": 1, "격류 재생의 결정 ★★": 1 },
    "침묵의 심해 비약 ★★": { "파도 침식의 결정 ★★": 1, "격류 재생의 결정 ★★": 1, "맹독 혼란의 결정 ★★": 1 },
    "청해룡의 날개 ★★": { "방어 오염의 결정 ★★": 1, "맹독 혼란의 결정 ★★": 1, "활기 보존의 결정 ★★": 1 },
  };

  // 3성
  const R3 = {
    "수호의 엘릭서 ★★★": { "굴 ★★★": 1, "불우렁쉥이": 1, "유리병": 3, "네더랙": 16 },
    "파동의 엘릭서 ★★★": { "소라 ★★★": 1, "불우렁쉥이": 1, "유리병": 3, "마그마 블록": 8 },
    "혼란의 엘릭서 ★★★": { "문어 ★★★": 1, "불우렁쉥이": 1, "유리병": 3, "영혼 흙": 8 },
    "생명의 엘릭서 ★★★": { "미역 ★★★": 1, "불우렁쉥이": 1, "유리병": 3, "진홍빛 자루": 4 },
    "부식의 엘릭서 ★★★": { "성게 ★★★": 1, "불우렁쉥이": 1, "유리병": 3, "뒤틀린 자루": 4 },
    "불멸 재생의 영약 ★★★": { "수호의 엘릭서 ★★★": 1, "생명의 엘릭서 ★★★": 1, "발광 먹물 주머니": 1, "발광 열매": 2, "수레국화": 1 },
    "파동 장벽의 영약 ★★★": { "파동의 엘릭서 ★★★": 1, "수호의 엘릭서 ★★★": 1, "발광 먹물 주머니": 1, "발광 열매": 2, "민들레": 1 },
    "타락 침식의 영약 ★★★": { "혼란의 엘릭서 ★★★": 1, "부식의 엘릭서 ★★★": 1, "발광 먹물 주머니": 1, "발광 열매": 2, "데이지": 1 },
    "생명 광란의 영약 ★★★": { "생명의 엘릭서 ★★★": 1, "혼란의 엘릭서 ★★★": 1, "발광 먹물 주머니": 1, "발광 열매": 2, "양귀비": 1 },
    "맹독 파동의 영약 ★★★": { "부식의 엘릭서 ★★★": 1, "파동의 엘릭서 ★★★": 1, "발광 먹물 주머니": 1, "발광 열매": 2, "선애기별꽃": 1 },
    "아쿠아 펄스 파편 ★★★": { "불멸 재생의 영약 ★★★": 1, "파동 장벽의 영약 ★★★": 1, "맹독 파동의 영약 ★★★": 1 },
    "나우틸러스의 손 ★★★": { "파동 장벽의 영약 ★★★": 1, "생명 광란의 영약 ★★★": 1, "불멸 재생의 영약 ★★★": 1 },
    "무저의 척추 ★★★": { "타락 침식의 영약 ★★★": 1, "맹독 파동의 영약 ★★★": 1, "생명 광란의 영약 ★★★": 1 },
  };

  // 최종 9개와 y 인덱스 매핑
  const FINAL = [
    "영생의 아쿠티스 ★",
    "크라켄의 광란체 ★",
    "리바이던의 깃털 ★",
    "해구 파동의 코어 ★★",
    "침묵의 심해 비약 ★★",
    "청해룡의 날개 ★★",
    "아쿠아 펄스 파편 ★★★",
    "나우틸러스의 손 ★★★",
    "무저의 척추 ★★★"
  ];

  // --- 전개(재귀 확장) ---
  const totals = {};

  // 모든 레시피를 하나로 조회할 수 있게
  const ALL = { ...R1, ...R2, ...R3 };

  function expand(itemName, qty) {
    const recipe = ALL[itemName];
    if (!recipe) {
      // 기본 재료
      add(totals, itemName, qty);
      return;
    }
    // 중간재: 하위 재료로 분해
    for (const [child, cqty] of Object.entries(recipe)) {
      expand(child, qty * cqty);
    }
  }

  // 최종품에서 시작
  for (let i = 0; i < FINAL.length; i++) {
    const q = yy[i] || 0;
    if (q > 0) expand(FINAL[i], q);
  }

  // --- 표시 순서(레시피 순서대로) ---
  const order = [
    // 1티어: 굴/소라/문어/미역/성게 기본 + 그 다음 생선류
    "굴 ★","점토",
    "소라 ★","모래",
    "문어 ★","흙",
    "미역 ★","자갈",
    "성게 ★","화강암",
    "익히지 않은 새우","익히지 않은 도미","익히지 않은 청어","금붕어","농어",

    // 2티어 공통/블록/부재료
    "굴 ★★","소라 ★★","문어 ★★","미역 ★★","성게 ★★",
    "해초",
    "죽은 관 산호 블록","죽은 사방 산호 블록","죽은 거품 산호 블록","죽은 불 산호 블록","죽은 뇌 산호 블록",
    "먹물 주머니",
    "청금석 블록","레드스톤 블록","철 주괴","금 주괴","다이아몬드",

    // 3티어 공통/네더/꽃류
    "굴 ★★★","소라 ★★★","문어 ★★★","미역 ★★★","성게 ★★★",
    "불우렁쉥이","유리병",
    "네더랙","마그마 블록","영혼 흙","진홍빛 자루","뒤틀린 자루",
    "발광 먹물 주머니","발광 열매",
    "수레국화","민들레","데이지","양귀비","선애기별꽃"
  ];

  const items = [];

  // order에 있는 것 먼저
  for (const name of order) {
    if (totals[name]) items.push({ name, qty: totals[name] });
  }
  // 나머지(혹시 신규 재료가 생겼을 때) 뒤에 붙이기
  for (const [name, qty] of Object.entries(totals)) {
    if (!order.includes(name)) items.push({ name, qty });
  }

return totals;

}

// ================================
// 프리미엄 한정가 배율 (강화 단계 → 배율)
// ================================
function premiumMulFromLevel(level) {
  const map = { 0:1.0, 1:1.05, 2:1.07, 3:1.10, 4:1.15, 5:1.20, 6:1.30, 7:1.40, 8:1.50 };
  return map[level] ?? 1.0;
}

// ================================
// 탭2(실제 제작) 제약용 어패류 사용 계수 행렬
// - 행: (굴/소라/문어/미역/성게) x (★/★★/★★★) = 15종
// - 열: 연금품 9종 (★ 3, ★★ 3, ★★★ 3)
// 값: "연금품 1개 제작에 필요한 해당 어패류 개수"
// ================================
// ================================
// 탭2(실제 제작) 제약용 어패류 사용 계수 행렬
// - 반환값: 2D 배열 A[15][9]
// - 추가로 A.fishRows, A.products 메타도 붙여둠(필요 시 사용 가능)
// ================================
function buildFishMatrix() {
  // fish row order (15)
  const fishRows = [
    "굴★","굴★★","굴★★★",
    "소라★","소라★★","소라★★★",
    "문어★","문어★★","문어★★★",
    "미역★","미역★★","미역★★★",
    "성게★","성게★★","성게★★★"
  ];

  // product col order (9)
  const products = [
    "영생의 아쿠티스 ★",
    "크라켄의 광란체 ★",
    "리바이던의 깃털 ★",
    "해구 파동의 코어 ★★",
    "침묵의 심해 비약 ★★",
    "청해룡의 날개 ★★",
    "아쿠아 펄스 파편 ★★★",
    "나우틸러스의 손 ★★★",
    "무저의 척추 ★★★"
  ];

  // 빈 벡터
  const col = () => Object.fromEntries(fishRows.map(k => [k, 0]));
  const req = {};

  // ★ tier (최종품 1개 기준 어패류 소모량 전개)
  req[products[0]] = { ...col(), "굴★":1, "소라★":1, "문어★":1, "미역★":2, "성게★":1 };
  req[products[1]] = { ...col(), "굴★":0, "소라★":1, "문어★":2, "미역★":2, "성게★":1 };
  req[products[2]] = { ...col(), "굴★":2, "소라★":2, "문어★":1, "미역★":0, "성게★":1 };

  // ★★ tier
  req[products[3]] = { ...col(), "굴★★":1, "소라★★":2, "문어★★":0, "미역★★":2, "성게★★":1 };
  req[products[4]] = { ...col(), "굴★★":0, "소라★★":2, "문어★★":1, "미역★★":1, "성게★★":2 };
  req[products[5]] = { ...col(), "굴★★":2, "소라★★":0, "문어★★":2, "미역★★":1, "성게★★":1 };

  // ★★★ tier
  req[products[6]] = { ...col(), "굴★★★":2, "소라★★★":2, "문어★★★":0, "미역★★★":1, "성게★★★":1 };
  req[products[7]] = { ...col(), "굴★★★":2, "소라★★★":1, "문어★★★":1, "미역★★★":2, "성게★★★":0 };
  req[products[8]] = { ...col(), "굴★★★":0, "소라★★★":1, "문어★★★":2, "미역★★★":1, "성게★★★":2 };

  // A[15][9] 생성
  const A = fishRows.map(fr => products.map(p => req[p][fr] || 0));

  // 메타 붙여두기(필요할 때 디버그/표시용)
  A.fishRows = fishRows;
  A.products = products;

  return A;
}


/* DDTYCOON Optimizer v4
 * - Enumerate stamina allocation blocks across 5 fish (sum = totalStamina/100)
 * - For each allocation, compute fish supply (inventory + expected catch with storm/star)
 * - Solve LP: maximize revenue with fish constraints (<= supply), x>=0
 * - Pick best allocation + craft quantities
 * - Render needs (fish + materials using decomposition)
 */

const MATERIAL_ICON_URL = {
  "점토": "https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/38/Clay_JE1_BE1.png",
  "모래": "https://static.wikia.nocookie.net/minecraft_gamepedia/images/7/71/Sand_JE5_BE3.png",
  "흙": "https://minecraft.wiki/images/Dirt.png",
  "자갈": "https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/9d/Gravel_JE5_BE4.png",
  "화강암": "https://static.wikia.nocookie.net/minecraft_ko_gamepedia/images/0/0b/Polished_Granite_JE1_BE1.png",
 "익히지 않은 새우": "icons/shrimp.png",
 "익히지 않은 도미": "icons/bream.png",
 "익히지 않은 청어": "icons/herring.png",
 "금붕어": "icons/goldfish.png",
 "농어": "icons/bass.png",
  "해초": "https://static.wikia.nocookie.net/minecraft_ko_gamepedia/images/c/c5/Grass.png",
  "죽은 관 산호 블록": "https://minecraft.wiki/images/thumb/Tube_Coral_Block_JE2_BE1.png/150px-Tube_Coral_Block_JE2_BE1.png",
  "죽은 사방 산호 블록": "https://minecraft.wiki/images/thumb/Horn_Coral_Block_JE2_BE2.png/150px-Horn_Coral_Block_JE2_BE2.png",
  "죽은 거품 산호 블록": "https://minecraft.wiki/images/thumb/Bubble_Coral_Block_JE2_BE1.png/150px-Bubble_Coral_Block_JE2_BE1.png",
  "죽은 불 산호 블록": "https://minecraft.wiki/images/thumb/Fire_Coral_Block_JE2_BE1.png/150px-Fire_Coral_Block_JE2_BE1.png",
  "죽은 뇌 산호 블록": "https://minecraft.wiki/images/thumb/Brain_Coral_Block_JE2_BE1.png/150px-Brain_Coral_Block_JE2_BE1.png",
  "먹물 주머니": "https://minecraft.wiki/images/Ink_Sac_JE2_BE2.png",
  "청금석 블록": "https://minecraft.wiki/images/Block_of_Lapis_Lazuli_JE3_BE3.png",
  "레드스톤 블록": "https://minecraft.wiki/images/Block_of_Redstone_JE2_BE2.png",
  "철 주괴": "https://minecraft.wiki/images/Iron_Ingot_JE3_BE2.png",
  "금 주괴": "https://minecraft.wiki/images/Gold_Ingot_JE4_BE2.png",
  "다이아몬드": "https://minecraft.wiki/images/Diamond_JE3_BE3.png",
  "유리병": "https://minecraft.wiki/images/Glass_Bottle_JE2_BE2.png",
  "네더랙": "https://static.wikia.nocookie.net/minecraft_ko_gamepedia/images/0/02/Netherrack_JE4_BE2.png",
  "마그마 블록": "https://ru.minecraft.wiki/images/thumb/%D0%9C%D0%B0%D0%B3%D0%BC%D0%BE%D0%B2%D1%8B%D0%B9_%D0%B1%D0%BB%D0%BE%D0%BA.png/160px-%D0%9C%D0%B0%D0%B3%D0%BC%D0%BE%D0%B2%D1%8B%D0%B9_%D0%B1%D0%BB%D0%BE%D0%BA.png?7243c",
  "영혼 흙": "https://static.wikia.nocookie.net/minecraft_ko_gamepedia/images/8/86/Soul_Soil_JE1.png",
  "진홍빛 자루": "https://kkukowiki.kr/images/9/91/%EC%A7%84%ED%99%8D%EB%B9%9B%EC%9E%90%EB%A3%A8.gif",
  "뒤틀린 자루": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_vytHwPLMa46iNFxvxPA9eZiLZyDj9jzvTQ&s",
  "발광 먹물 주머니": "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20/assets/minecraft/textures/item/glow_ink_sac.png",
  "발광 열매": "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20/assets/minecraft/textures/item/glow_berries.png",
  "수레국화": "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcWOUPK%2FbtsOKBrtCkB%2FAAAAAAAAAAAAAAAAAAAAAP1jGCIE8pDD47n962FOk0xyN3d-8e5uzOwgy3bYsEhW%2Fimg.webp%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1767193199%26allow_ip%3D%26allow_referer%3D%26signature%3DJYgMehI4WE7k5Mvk2hFuGfAIt8c%253D",
  "민들레": "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F1HODq%2FbtsOMJgWN5V%2FAAAAAAAAAAAAAAAAAAAAALDelE7slV2EYGq9Q75vtWWnovs-4zOHTRmiFgnlexE7%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1767193199%26allow_ip%3D%26allow_referer%3D%26signature%3DYKytH2qi4j5ZHENPlCUXFi6j5ec%253D",
  "데이지": "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbhcHcT%2FbtsOLstJjag%2FAAAAAAAAAAAAAAAAAAAAAGQpf97TvqkGZcDnUwjlRuZENMidDVwwtvYTWfgHKfit%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1767193199%26allow_ip%3D%26allow_referer%3D%26signature%3DYf%252Fzo2oPEJG90FDw6kisjPCkQzQ%253D",
  "양귀비": "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F2ECXF%2FbtsOLjqg4ht%2FAAAAAAAAAAAAAAAAAAAAAPdhEtXp9rAJYq6BfI0L53tCwSuBGlxbET92Ib9SMnAh%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1767193199%26allow_ip%3D%26allow_referer%3D%26signature%3D4RQ6CFYR%252FpdvPwa%252FvnYSNlWx6vg%253D",
  "선애기별꽃": "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fd2rEka%2FbtsOL91vgFw%2FAAAAAAAAAAAAAAAAAAAAAD5OASnVJcphynyYUPEL0g_H3mc7ZBtNQBixJrdI3tCc%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1767193199%26allow_ip%3D%26allow_referer%3D%26signature%3D6GJeyef5jnTayKs1pFJSSot5Pcg%253D",
  "불우렁쉥이": "https://i.namu.wiki/i/CBEgUc-J1DNSqRXuNRVe-pSAfCPgTGpusBPd6LB4U9EgufWNknGIXJUL5yV4YgO_Lcx563vo3ai_KiVJluhyig.webp",

// 어패류(등급) 아이콘
"굴 ★": "icons/fish/oyster.png",
"굴 ★★": "icons/fish/oyster.png",
"굴 ★★★": "icons/fish/oyster.png",

"소라 ★": "icons/fish/conch.png",
"소라 ★★": "icons/fish/conch.png",
"소라 ★★★": "icons/fish/conch.png",

"문어 ★": "icons/fish/octopus.png",
"문어 ★★": "icons/fish/octopus.png",
"문어 ★★★": "icons/fish/octopus.png",

"미역 ★": "icons/fish/kelp.png",
"미역 ★★": "icons/fish/kelp.png",
"미역 ★★★": "icons/fish/kelp.png",

"성게 ★": "icons/fish/urchin.png",
"성게 ★★": "icons/fish/urchin.png",
"성게 ★★★": "icons/fish/urchin.png",



  // ===== 중간재 아이콘 =====
  "수호의 정수 ★": "icons/mid/essence1_guard.png",
  "파동의 정수 ★": "icons/mid/essence1_wave.png",
  "혼란의 정수 ★": "icons/mid/essence1_chaos.png",
  "생명의 정수 ★": "icons/mid/essence1_life.png",
  "부식의 정수 ★": "icons/mid/essence1_corrosion.png",

  "물결 수호의 핵 ★": "icons/mid/core1_guard.png",
  "파동 오염의 핵 ★": "icons/mid/core1_wave.png",
  "질서 파괴의 핵 ★": "icons/mid/core1_chaos.png",
  "활력 붕괴의 핵 ★": "icons/mid/core1_life.png",
  "침식 방어의 핵 ★": "icons/mid/core1_corrosion.png",

  "수호 에센스 ★★": "icons/mid/essence2_guard.png",
  "파동 에센스 ★★": "icons/mid/essence2_wave.png",
  "혼란 에센스 ★★": "icons/mid/essence2_chaos.png",
  "생명 에센스 ★★": "icons/mid/essence2_life.png",
  "부식 에센스 ★★": "icons/mid/essence2_corrosion.png",

  "활기 보존의 결정 ★★": "icons/mid/crystal_guard.png",
  "파도 침식의 결정 ★★": "icons/mid/crystal_wave.png",
  "방어 오염의 결정 ★★": "icons/mid/crystal_chaos.png",
  "격류 재생의 결정 ★★": "icons/mid/crystal_life.png",
  "맹독 혼란의 결정 ★★": "icons/mid/crystal_corrosion.png",

  "수호의 엘릭서 ★★★": "icons/mid/essence3_guard.png",
  "파동의 엘릭서 ★★★": "icons/mid/essence3_wave.png",
  "혼란의 엘릭서 ★★★": "icons/mid/essence3_chaos.png",
  "생명의 엘릭서 ★★★": "icons/mid/essence3_life.png",
  "부식의 엘릭서 ★★★": "icons/mid/essence3_corrosion.png",

  "불멸 재생의 영약 ★★★": "icons/mid/elixir_regen.png",
  "파동 장벽의 영약 ★★★": "icons/mid/elixir_barrier.png",
  "타락 침식의 영약 ★★★": "icons/mid/elixir_corrupt.png",
  "생명 광란의 영약 ★★★": "icons/mid/elixir_frenzy.png",
  "맹독 파동의 영약 ★★★": "icons/mid/elixir_venom.png"

 
};




const PRODUCT_ICON_URL = {
  "영생의 아쿠티스": "icons/akutis.png",
  "크라켄의 광란체": "icons/kraken.png",
  "리바이던의 깃털": "icons/leviathan.png",
  "해구 파동의 코어": "icons/trench_core.png",
  "침묵의 심해 비약": "icons/silence_elixir.png",
  "청해룡의 날개": "icons/azure_dragon.png",
  "아쿠아 펄스 파편": "icons/aqua.png",
  "나우틸러스의 손": "icons/nautilus.png",
  "무저의 척추": "icons/abyss_tentacle.png"
};

function stripStars(name){
  return name.replace(/★+/g, "").trim();
}



const FALLBACK_ICON_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="6" fill="rgba(0,0,0,.08)"/>
    <path d="M7 13c3-5 7-5 10 0-3 3-7 3-10 0z" fill="rgba(0,0,0,.28)"/>
    <circle cx="15.5" cy="11" r="1" fill="rgba(0,0,0,.45)"/>
  </svg>`
);

function escHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function productLabel(name){
  const base = stripStars(name);
  const url = PRODUCT_ICON_URL[base];
  if(!url) return name;

  return `
    <span class="item-label">
      <img src="${url}" class="item-icon">
      <span>${name}</span>
    </span>
  `;
}


function matLabel(name){
  const url = MATERIAL_ICON_URL[name] || FALLBACK_ICON_SVG;
  return `<span class="mat"><img class="icon" src="${url}" alt="" onerror="this.src='${FALLBACK_ICON_SVG}'"/>${escHtml(name)}</span>`;
}

const PRODUCTS = [
{ name:"영생의 아쿠티스 ★", base:3436 },
  { name:"크라켄의 광란체 ★", base:3486 },
  { name:"리바이던의 깃털 ★", base:3592 },
  { name:"해구 파동의 코어 ★★", base:7413 },
  { name:"침묵의 심해 비약 ★★", base:7487 },
  { name:"청해룡의 날개 ★★", base:7592 },
  { name:"아쿠아 펄스 파편 ★★★", base:10699 },
  { name:"나우틸러스의 손 ★★★", base:10824 },
  { name:"무저의 척추 ★★★", base:10892 },
];

const FISH_ROWS = [
  "굴 ★","굴 ★★","굴 ★★★",
  "소라 ★","소라 ★★","소라 ★★★",
  "문어 ★","문어 ★★","문어 ★★★",
  "미역 ★","미역 ★★","미역 ★★★",
  "성게 ★","성게 ★★","성게 ★★★"
];

const FISH_NAMES = ["굴","소라","문어","미역","성게"];


// 부재료 표시 순서(레시피 기준: 1티어 → 2티어 → 3티어)
const MAT_ORDER = ["점토", "모래", "흙", "자갈", "화강암", "익히지 않은 새우", "익히지 않은 도미", "익히지 않은 청어", "금붕어", "농어", "해초", "죽은 관 산호 블록", "죽은 사방 산호 블록", "죽은 거품 산호 블록", "죽은 불 산호 블록", "죽은 뇌 산호 블록", "먹물 주머니", "청금석 블록", "레드스톤 블록", "철 주괴", "금 주괴", "다이아몬드", "불우렁쉥이", "유리병", "네더랙", "마그마 블록", "영혼 흙", "진홍빛 자루", "뒤틀린 자루", "발광 먹물 주머니", "발광 열매", "수레국화", "민들레", "데이지", "양귀비", "선애기별꽃", "발광 먹물"];
function matRank(name){
  const i = MAT_ORDER.indexOf(name);
  return i >= 0 ? i : 9999;
}

/** Decomposition per final product (fish + materials) */
const DECOMP = {
  "영생의 아쿠티스 ★": {
    "굴 ★":1,
    "소라 ★":1,
    "문어 ★":1,
    "미역 ★":2,
    "성게 ★":1,
    "금붕어":1,
    "모래":3,
    "익히지 않은 새우":1,
    "익히지 않은 청어":1,
    "자갈":4,
    "점토":1,
    "화강암":1,
    "흙":4,
  },
  "크라켄의 광란체 ★": {
    "소라 ★":1,
    "문어 ★":2,
    "미역 ★":2,
    "성게 ★":1,
    "금붕어":1,
    "모래":3,
    "익히지 않은 도미":1,
    "익히지 않은 청어":1,
    "자갈":4,
    "화강암":1,
    "흙":8,
  },
  "리바이던의 깃털 ★": {
    "굴 ★":2,
    "소라 ★":2,
    "문어 ★":1,
    "성게 ★":1,
    "농어":1,
    "모래":6,
    "익히지 않은 도미":1,
    "익히지 않은 새우":1,
    "점토":2,
    "화강암":1,
    "흙":4,
  },
  "해구 파동의 코어 ★★": {
    "굴 ★★":1,
    "소라 ★★":2,
    "미역 ★★":2,
    "성게 ★★":1,
    "금 주괴":1,
    "레드스톤 블록":1,
    "먹물 주머니":3,
    "죽은 관 산호 블록":1,
    "죽은 뇌 산호 블록":1,
    "죽은 불 산호 블록":2,
    "죽은 사방 산호 블록":2,
    "청금석 블록":1,
    "해초":12,
  },
  "침묵의 심해 비약 ★★": {
    "소라 ★★":2,
    "문어 ★★":1,
    "미역 ★★":1,
    "성게 ★★":2,
    "금 주괴":1,
    "다이아몬드":1,
    "레드스톤 블록":1,
    "먹물 주머니":3,
    "죽은 거품 산호 블록":1,
    "죽은 뇌 산호 블록":2,
    "죽은 불 산호 블록":1,
    "죽은 사방 산호 블록":2,
    "해초":12,
  },
  "청해룡의 날개 ★★": {
    "굴 ★★":2,
    "문어 ★★":2,
    "미역 ★★":1,
    "성게 ★★":1,
    "다이아몬드":1,
    "먹물 주머니":3,
    "죽은 거품 산호 블록":2,
    "죽은 관 산호 블록":2,
    "죽은 뇌 산호 블록":1,
    "죽은 불 산호 블록":1,
    "철 주괴":1,
    "청금석 블록":1,
    "해초":12,
  },
  "아쿠아 펄스 파편 ★★★": {
    "굴 ★★★":2,
    "소라 ★★★":2,
    "미역 ★★★":1,
    "성게 ★★★":1,
    "네더랙":32,
    "뒤틀린 자루":4,
    "마그마 블록":16,
    "민들레":1,
    "발광 먹물 주머니":3,
    "발광 열매":6,
    "불우렁쉥이":6,
    "선애기별꽃":1,
    "수레국화":1,
    "유리병":18,
    "진홍빛 자루":4,
  },
  "나우틸러스의 손 ★★★": {
    "굴 ★★★":2,
    "소라 ★★★":1,
    "문어 ★★★":1,
    "미역 ★★★":2,
    "네더랙":32,
    "마그마 블록":8,
    "민들레":1,
    "발광 먹물 주머니":3,
    "발광 열매":6,
    "불우렁쉥이":6,
    "수레국화":1,
    "양귀비":1,
    "영혼 흙":8,
    "유리병":18,
    "진홍빛 자루":8,
  },
  "무저의 척추 ★★★": {
    "소라 ★★★":1,
    "문어 ★★★":2,
    "미역 ★★★":1,
    "성게 ★★★":2,
    "데이지":1,
    "뒤틀린 자루":8,
    "마그마 블록":8,
    "발광 먹물 주머니":3,
    "발광 열매":6,
    "불우렁쉥이":6,
    "선애기별꽃":1,
    "양귀비":1,
    "영혼 흙":16,
    "유리병":18,
    "진홍빛 자루":4,
  },
};

// fish usage matrix A[fishIdx][prodIdx]
const A = FISH_ROWS.map(fr => PRODUCTS.map(p => (DECOMP[p.name] && DECOMP[p.name][fr]) ? DECOMP[p.name][fr] : 0));

function clampInt(v, lo, hi){
  v = Number(v);
  if(!Number.isFinite(v)) return lo;
  v = Math.round(v);
  return Math.max(lo, Math.min(hi, v));
}
function premiumMultiplier(level){
  const map = {0:1.00, 1:1.05, 2:1.07, 3:1.10, 4:1.15, 5:1.20, 6:1.30, 7:1.40, 8:1.50};
  return map[level] ?? 1.00;
}
function stormProb(level){
  const map = {0:0.00, 1:0.01, 2:0.03, 3:0.05, 4:0.07, 5:0.10};
  return map[level] ?? 0.00;
}
function star3Bonus(level){
  const map = {0:0.00, 1:0.01, 2:0.02, 3:0.03, 4:0.04, 5:0.05, 6:0.07};
  return map[level] ?? 0.00;
}
function applyStarBonus(base, level){
  const bonus = star3Bonus(level);

  return {
    p1: base.p1,
    p2: base.p2,
    p3: base.p3 + bonus
  };
}

function baseDropFromTool(level){
  // level: representative value for range
  const map = {3:2, 6:3, 9:4, 12:5};
  return map[level] ?? 4;
}

function fmtWon(n){
  const v = Math.round(Number(n) || 0);
  return v.toLocaleString("ko-KR", { maximumFractionDigits: 0 });
}

function fmtGold(n){
  return `${fmtWon(n)} G`;
}




function fmtSmart(n, maxD = 2){
  const v = Number(n);
  if(!Number.isFinite(v)) return "-";
  const r = Math.round(v);
  if (Math.abs(v - r) < 1e-9){
    return r.toLocaleString();
  }
  // round to maxD decimals to avoid float noise, then print with locale separators
  const vv = Number(v.toFixed(maxD));
  return vv.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: maxD });
}

function fmtNum(n, maxD = 4){
  return fmtSmart(n, maxD);
}
function set64(x){
  x = Math.max(0, Math.floor(x));
  const sets = Math.floor(x/64);
  const rem = x % 64;
  if(sets===0) return `${rem}개`;
  if(rem===0) return `${sets}세트`;
  return `${sets}세트 + ${rem}개`;
}

/** -------- UI build -------- */
const craftBody = document.querySelector("#craftTbl tbody");
const invBody = document.querySelector("#invTbl tbody");
const allocBody = document.querySelector("#allocTbl tbody");

function buildTables(){
  craftBody.innerHTML = "";
  PRODUCTS.forEach((p, idx)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
<td><span class="tipName" data-tipname="${p.name}">${productLabel(p.name)}</span></td>
      <td class="mono">${fmtGold(p.base)}</td>
      <td class="mono" id="final_${idx}">-</td>
      <td><input type="number" min="0" step="1" value="0" style="width:120px;max-width:100%" id="qty_${idx}"></td>
      <td class="mono" id="rev_${idx}">0</td>
    `;
    craftBody.appendChild(tr);
  });

  invBody.innerHTML = "";
  FISH_ROWS.forEach((name, i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${matLabel(name)}</td>
      <td><input type="number" min="0" step="1" value="0" style="width:120px;max-width:100%" id="inv_${i}"></td>
    `;
    invBody.appendChild(tr);
  });

  renderAlloc([0,0,0,0,0], 0, 15);
}
buildTables();

function readInputs(){
  const totalStamina = Number(document.getElementById("totalStamina").value) || 0;
  const staminaPerCast = Math.max(1, Number(document.getElementById("staminaPerCast").value) || 15);
  const toolLevel = Number(document.getElementById("toolLevel").value) || 9;

  const premiumLevel = clampInt(document.getElementById("premiumLevel").value, 0, 8);
  const stormLevel = clampInt(document.getElementById("stormLevel").value, 0, 5);
  const starLevel = clampInt(document.getElementById("starLevel").value, 0, 6);

  const p1 = Number(document.getElementById("p1").value) || 0;
  const p2 = Number(document.getElementById("p2").value) || 0;
  const p3 = Number(document.getElementById("p3").value) || 0;

  return { totalStamina, staminaPerCast, toolLevel, premiumLevel, stormLevel, starLevel, p1, p2, p3 };
}

function getDerived(){
  const inp = readInputs();
  const premiumMul = premiumMultiplier(inp.premiumLevel);
const stormP = stormProb(inp.stormLevel);
const baseDrop = baseDropFromTool(inp.toolLevel);

// (변경) 기본 드랍 k개 각각이 확률 p로 +1개 추가되는 모델 => 기대값: k + k*p = k*(1+p)
const dropPerCast = baseDrop * (1 + stormP);


  const baseProbs = {p1:inp.p1, p2:inp.p2, p3:inp.p3};
  const probs = applyStarBonus(baseProbs, inp.starLevel);

  const casts = inp.totalStamina > 0 ? (inp.totalStamina / inp.staminaPerCast) : 0;
  const totalDrops = casts * dropPerCast;

  return {inp, premiumMul, stormP, baseDrop, dropPerCast, probs, casts, totalDrops};
}

function renderSummary(d){
  document.getElementById("outPremium").textContent = fmtSmart(d.premiumMul, 2);
  document.getElementById("outStorm").textContent   = fmtSmart(d.stormP, 2);
  document.getElementById("outDropPerCast").textContent = fmtSmart(d.dropPerCast, 2);
  document.getElementById("outCasts").textContent = fmtSmart(d.casts, 2);
  document.getElementById("outTotalDrops").textContent = fmtSmart(d.totalDrops, 2);

  document.getElementById("outP1").textContent = fmtSmart(d.probs.p1, 4);
  document.getElementById("outP2").textContent = fmtSmart(d.probs.p2, 4);
  document.getElementById("outP3").textContent = fmtSmart(d.probs.p3, 4);
}

function renderAlloc(blocks, castsPer100, staminaPerCast){
  allocBody.innerHTML = "";
  for(let i=0;i<5;i++){
    const tr = document.createElement("tr");
    const casts = blocks[i] * castsPer100;
    tr.innerHTML = `
      <td>${FISH_NAMES[i]}</td>
      <td class="mono">${blocks[i]}</td>
      <td class="mono">${blocks[i]*100}</td>
      <td class="mono">${fmtSmart(casts, 2)}</td>
    `;
    allocBody.appendChild(tr);
  }
}

/** -------- Simplex LP solver (max c^T x, Ax <= b, x>=0) -------- */
function simplexMax(A, b, c){
  const m = A.length;
  const n = c.length;

  // tableau size: (m+1) x (n+m+1)
  const cols = n + m + 1;
  const T = Array.from({length:m+1}, ()=>Array(cols).fill(0));

  // constraints
  for(let i=0;i<m;i++){
    for(let j=0;j<n;j++) T[i][j] = A[i][j];
    T[i][n+i] = 1; // slack
    T[i][cols-1] = b[i];
  }
  // objective row: maximize => put -c
  for(let j=0;j<n;j++) T[m][j] = -c[j];

  // basis: slack vars
  const basis = Array.from({length:m}, (_,i)=> n+i);

  const EPS = 1e-9;

  function pivot(row, col){
    const piv = T[row][col];
    if(Math.abs(piv) < EPS) return false;
    // normalize row
    for(let j=0;j<cols;j++) T[row][j] /= piv;
    // eliminate col in other rows
    for(let i=0;i<m+1;i++){
      if(i===row) continue;
      const f = T[i][col];
      if(Math.abs(f) < EPS) continue;
      for(let j=0;j<cols;j++){
        T[i][j] -= f * T[row][j];
      }
    }
    basis[row] = col;
    return true;
  }

  let iter = 0;
  const MAX_ITER = 4000;

  while(iter++ < MAX_ITER){
    // entering variable: most negative in objective row
    let col = -1;
    let minVal = -EPS;
    for(let j=0;j<cols-1;j++){
      const v = T[m][j];
      if(v < minVal){
        minVal = v;
        col = j;
      }
    }
    if(col === -1) break; // optimal

    // leaving variable: min ratio
    let row = -1;
    let best = Infinity;
    for(let i=0;i<m;i++){
      const a = T[i][col];
      if(a > EPS){
        const ratio = T[i][cols-1] / a;
        if(ratio < best - 1e-12){
          best = ratio; row = i;
        }
      }
    }
    if(row === -1){
      // unbounded
      return {status:"unbounded", x:Array(n).fill(0), value:Infinity};
    }
    pivot(row, col);
  }

  // extract solution for original vars
  const x = Array(n).fill(0);
  for(let i=0;i<m;i++){
    const varIdx = basis[i];
    if(varIdx < n){
      x[varIdx] = T[i][cols-1];
    }
  }
  const value = T[m][cols-1]; // because objective in tableau
  return {status:"optimal", x, value};
}


function floorAndGreedyIntegerize(A, supply, prices, xFrac){
  // Start with floor
  const n = prices.length;
  const m = supply.length;
  const x = xFrac.map(v => Math.max(0, Math.floor(v + 1e-9)));
  // remaining resources
  const rem = supply.slice();
  for(let i=0;i<m;i++){
    let used = 0;
    for(let j=0;j<n;j++) used += A[i][j]*x[j];
    rem[i] = rem[i] - used;
  }

  function fits(j){
    for(let i=0;i<m;i++){
      if(rem[i] + 1e-9 < A[i][j]) return false;
    }
    return true;
  }
  function consume(j){
    for(let i=0;i<m;i++) rem[i] -= A[i][j];
  }

  // Greedy: add best price-per-weighted-scarcity item that fits
  const MAX_ADD = 20000;
  let steps = 0;
  while(steps++ < MAX_ADD){
    let best = -1;
    let bestScore = -1;

    for(let j=0;j<n;j++){
      if(!fits(j)) continue;
      // scarcity-weighted cost: sum (a_ij / max(rem_i,1))
      let cost = 0;
      for(let i=0;i<m;i++){
        const a = A[i][j];
        if(a<=0) continue;
        cost += a / Math.max(1, rem[i]);
      }
      const score = prices[j] / Math.max(1e-9, cost);
      if(score > bestScore){
        bestScore = score;
        best = j;
      }
    }
    if(best === -1) break;
    x[best] += 1;
    consume(best);
  }

  // objective value
  let value = 0;
  for(let j=0;j<n;j++) value += prices[j]*x[j];
  return {x, value, rem};
}

function computeSupplyForBlocks(blocks, d){
  // inventory
  const supply = Array(FISH_ROWS.length).fill(0);
  for(let i=0;i<FISH_ROWS.length;i++){
    const inv = Math.max(0, Math.floor(Number(document.getElementById(`inv_${i}`).value) || 0));
    supply[i] = inv;
  }

  // expected catch
  const castsPer100 = 100 / Math.max(1, d.inp.staminaPerCast);
  for(let f=0; f<5; f++){
    const casts = blocks[f] * castsPer100;
    const drops = casts * d.dropPerCast; // total fish items expected from that fish (independent of star)
    const base = f*3;
    supply[base+0] += drops * d.probs.p1;
    supply[base+1] += drops * d.probs.p2;
    supply[base+2] += drops * d.probs.p3;
  }

  // ✅ 중간재 재고가 절약해주는 어패류를 supply에 가산
  const fishCredit = getFishCreditFromMidInv();
  for(const [fishName, qty] of Object.entries(fishCredit)){
    const idx = FISH_ROWS.indexOf(fishName);
if(idx >= 0) supply[idx] += Math.max(0, Math.floor(Number(qty || 0)));

  }


  return supply;
}

function optimize(){
  const d = getDerived();
  renderSummary(d);

  const blocksTotal = Math.floor(d.inp.totalStamina / 100);
  if(blocksTotal <= 0){
    alert("총 스태미나가 너무 작습니다.");
    return;
  }

  // prices with premium
  const prices = PRODUCTS.map(p => p.base * d.premiumMul);

  // enumerate all compositions of blocksTotal into 5 parts
  let best = {rev:-1, blocks:[0,0,0,0,0], y:Array(PRODUCTS.length).fill(0), supply:null};

  const m = FISH_ROWS.length;
  const n = PRODUCTS.length;

  // enumerate using 4 nested loops (faster than recursion)
  for(let a=0; a<=blocksTotal; a++){
    for(let b=0; b<=blocksTotal-a; b++){
      for(let c=0; c<=blocksTotal-a-b; c++){
        for(let d4=0; d4<=blocksTotal-a-b-c; d4++){
          const e = blocksTotal - a - b - c - d4;
          const blocks = [a,b,c,d4,e];

          const supply = computeSupplyForBlocks(blocks, d);

          // Solve LP: maximize prices^T y subject to A*y <= supply, y>=0
          const res = simplexMax(A, supply, prices);
          if(res.status !== "optimal") continue;

          // 제작량 정수 강제: floor + 잔여 재고로 greedy 추가
          const intRes = floorAndGreedyIntegerize(A, supply, prices, res.x);
          const rev = intRes.value;

          if(rev > best.rev + 1e-6){
            best = {rev, blocks, y:intRes.x, supply};
          }
        }
      }
    }
  }

  // render alloc
  const castsPer100 = 100 / Math.max(1, d.inp.staminaPerCast);
  renderAlloc(best.blocks, castsPer100, d.inp.staminaPerCast);

  // set craft quantities (editable)
  PRODUCTS.forEach((p, idx)=>{
    document.getElementById(`qty_${idx}`).value = (best.y[idx] || 0).toString();
  });

  // update derived tables
  recalcFromCurrent();
}

function recalcFromCurrent(){
  const d = getDerived();
  renderSummary(d);

  let revenueSum = 0;

  const needFish = new Map();
  const needMat  = new Map();

  PRODUCTS.forEach((p, idx)=>{
const finalPrice = Math.round(p.base * d.premiumMul);
document.getElementById(`final_${idx}`).textContent = fmtGold(finalPrice);

const qty = Math.max(0, Number(document.getElementById(`qty_${idx}`).value) || 0);
const rev = finalPrice * qty;   // finalPrice가 정수니까 rev도 정수
revenueSum += rev;
document.getElementById(`rev_${idx}`).textContent = fmtGold(rev);


    const dec = DECOMP[p.name];
    if(dec){
      for(const [k,v] of Object.entries(dec)){
        const add = v * qty;
        if(FISH_ROWS.includes(k)){
          needFish.set(k, (needFish.get(k)||0) + add);
        }else{
          needMat.set(k, (needMat.get(k)||0) + add);
        }
      }
    }
  });

  document.getElementById("revSum").textContent = fmtGold(revenueSum);
  document.getElementById("outRevenue").textContent = fmtGold(revenueSum);

  
  // ✅ 표기용 필요량: 중간재 재고는 이미 완성된 것으로 보고(=필요량에서 차감)
  try{
    const nn = calcNetNeedsForExpectedWithMidInv();
    if(nn && nn.needFish && nn.needMat){
      needFish.clear(); nn.needFish.forEach((v,k)=> needFish.set(k,v));
      needMat.clear();  nn.needMat.forEach((v,k)=>  needMat.set(k,v));
    }
  }catch(e){ /* 표시만 실패해도 UI는 계속 */ }

// inventory fish
  const invFish = new Map();
  FISH_ROWS.forEach((name, i)=>{
    invFish.set(name, Math.max(0, Math.floor(Number(document.getElementById(`inv_${i}`).value) || 0)));
  });

  // render need fish
  const fishTBody = document.querySelector("#needFishTbl tbody");
  fishTBody.innerHTML = "";
  FISH_ROWS.forEach((name)=>{
    const need = needFish.get(name) || 0;
    const inv  = invFish.get(name) || 0;
    const lack = Math.max(0, need - inv);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${matLabel(name)}</td>
      <td class="mono ${inv===0?'zero':''}">${inv}</td>
      <td class="mono ${need===0?'zero':''}">${fmtNum(need)}</td>
      <td class="mono ${lack>0?'neg':'zero'}">${fmtNum(lack)}</td>
    `;
    fishTBody.appendChild(tr);
  });

  // render materials
  const matTBody = document.querySelector("#needMatTbl tbody");
  matTBody.innerHTML = "";
  const mats = Array.from(needMat.entries()).sort((a,b)=> (matRank(a[0]) - matRank(b[0])) || (b[1]-a[1]) || a[0].localeCompare(b[0]));
  mats.forEach(([name, qty])=>{
    if(qty <= 1e-9) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${matLabel(name)}</td>
      <td class="mono">${fmtNum(qty)}</td>
      <td class="mono">${set64(qty)}</td>
    `;
    matTBody.appendChild(tr);
  });
}


/** -------- Actual(채집 후) panel -------- */
let LAST_ACTUAL = null;
const LS_KEY_BASE = "ddtycoon_baseInv_v1";



const LS_KEY_EXPECTED = "ddtycoon_expectedInv_v1";
const LS_KEY_CRAFTCHECK = "ddtycoon_craftcheck_v1";

function getExpectedInv(){
  return FISH_ROWS.map((_, i)=> Math.max(0, Math.floor(Number(document.getElementById(`inv_${i}`).value || 0))));
}
function setExpectedInv(arr){
  if(!Array.isArray(arr) || arr.length !== FISH_ROWS.length) return;
  arr.forEach((v,i)=>{ 
    const el = document.getElementById(`inv_${i}`);
    if(el) el.value = Math.max(0, Math.floor(Number(v||0))); 
  });
}
function saveExpectedInv(){
  localStorage.setItem(LS_KEY_EXPECTED, JSON.stringify(getExpectedInv()));
}
function loadExpectedInv(){
  const raw = localStorage.getItem(LS_KEY_EXPECTED);
  if(!raw) return;
  try{
    const arr = JSON.parse(raw);
    if(Array.isArray(arr) && arr.length===FISH_ROWS.length){
        }
  }catch(e){}
}

// 탭1(기댓값) 재고 → 탭2(기존 재고) 자동 복사
function syncExpectedToBase(){
  const arr = getExpectedInv();
  arr.forEach((v,i)=>{
    const el = document.getElementById(`base_${i}`);
    if(el) el.value = v;
  });
  updateTotalsActual();
}


function buildInvActual(){
  const tb = document.querySelector("#invActualTbl tbody");
  tb.innerHTML = "";
  FISH_ROWS.forEach((label, i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
<td>${matLabel(label)}</td>
      <td><input id="base_${i}" type="number" min="0" step="1" value="0"/></td>
      <td><input id="harv_${i}" type="number" min="0" step="1" value="0"/></td>
      <td class="right" id="tot_${i}">0</td>
    `;
    tb.appendChild(tr);
  });

  // change listeners
  FISH_ROWS.forEach((_, i)=>{
    document.getElementById(`base_${i}`).addEventListener("change", updateTotalsActual);
    document.getElementById(`harv_${i}`).addEventListener("change", updateTotalsActual);
  });

  updateTotalsActual();
}

function updateTotalsActual(){
  FISH_ROWS.forEach((_, i)=>{
    const b = Number(document.getElementById(`base_${i}`).value || 0);
    const h = Number(document.getElementById(`harv_${i}`).value || 0);
    const t = Math.max(0, Math.floor(b) + Math.floor(h));
    document.getElementById(`tot_${i}`).textContent = String(t);
  });
}

function saveBaseInv(){
  // baseInv 저장

  const base = FISH_ROWS.map((_, i)=> Math.max(0, Math.floor(Number(document.getElementById(`base_${i}`).value || 0))));
  localStorage.setItem(LS_KEY_BASE, JSON.stringify(base));
  // 탭1에도 동일하게 저장
  localStorage.setItem(LS_KEY_EXPECTED, JSON.stringify(base));
}

function loadBaseInv(){
  const raw = localStorage.getItem(LS_KEY_BASE);
  if(!raw) return;
  try{
    const arr = JSON.parse(raw);
    if(Array.isArray(arr) && arr.length === FISH_ROWS.length){
      arr.forEach((v,i)=>{ document.getElementById(`base_${i}`).value = Math.max(0, Math.floor(Number(v||0))); });
      updateTotalsActual();
    }
  }catch(e){}
}

function getActualSupply(){
  const supply = FISH_ROWS.map((_, i)=> Number(document.getElementById(`tot_${i}`).textContent || 0));
   // ✅ 중간재 재고가 절약해주는 어패류를 supply에 가산
  const fishCredit = getFishCreditFromMidInv();
  for(const [fishName, qty] of Object.entries(fishCredit)){
    const idx = FISH_ROWS.indexOf(fishName);
if(idx >= 0) supply[idx] += Math.max(0, Math.floor(Number(qty || 0)));

  }

 return supply.map(v=>Math.max(0, Math.floor(v)));
}

function renderActualResult(y, prices, supply, usedFish){
  // craft table
  const tb = document.querySelector("#craftTblA tbody");
  tb.innerHTML = "";
  let sum = 0;
  PRODUCTS.forEach((p, i)=>{
    const qty = Math.max(0, Math.floor(y[i]||0));
    const rev = qty * prices[i];
    sum += rev;
    const tr = document.createElement("tr");
    const ck = getCraftCheck(i);
   tr.innerHTML =
`<td><span class="tipName"
      data-tipname="${p.name}"
      data-tipkind="final"
      data-tipqty="${qty}"
    >${productLabel(p.name)}</span></td>
 <td class="right">${fmtGold(prices[i])}</td>
 <td class="right">${qty}</td>
 <td class="right">${fmtGold(rev)}</td>` +
  `<td class="center checkCell">
     <label class="checkbox">
       <input class="chk" type="checkbox" ${ck?"checked":""} data-idx="${i}">
     </label>
   </td>`;

    tb.appendChild(tr);
  });
  document.getElementById("revSumA").textContent = fmtGold(sum);
  const badge = document.getElementById("revBadgeA");
  if(badge) badge.textContent = fmtGold(sum);

const {needFish, needMat} = calcNetNeedsForActualWithMidInv(y);
renderNeedFishTableTo("#needFishTblA tbody", needFish, supply);
renderNeedMatTableTo("#needMatTblA tbody", needMat);

  const craftPlan = calcNetCraftPlanFromActual(y);
  renderNeedCraftTableTo("#needCraftTblA tbody", craftPlan);


}


function renderNeedFishTableTo(sel, needFish, supply){
  const tb = document.querySelector(sel);
  if(!tb) return;
  tb.innerHTML = "";

  const isMap = (needFish instanceof Map);

  FISH_ROWS.forEach((label, i)=>{
    const useRaw = isMap ? (needFish.get(label) || 0) : (needFish[i] || 0);
    const used = Math.round(Number(useRaw || 0));      // ✅ 소모
    const have = Math.floor(Number(supply[i] || 0));   // ✅ 재고
    const remain = Math.max(0, have - used);           // ✅ 잔여

    const tr = document.createElement("tr");
        const remCls  = remain > 0 ? "pos" : "muted";

    // 컬럼: 재고 / 소모 / 잔여
    tr.innerHTML =
      `<td>${matLabel(label)}</td>` +
      `<td class="right">${have}</td>` +
      `<td class="right">${used}</td>` +
      `<td class="right ${remCls}">${remain}</td>`;
    tb.appendChild(tr);
  });
}

function renderNeedMatTableTo(sel, needMat){
  const tb = document.querySelector(sel);
  if(!tb) return;
  tb.innerHTML = "";

  // ✅ Map / Object 둘 다 지원
  const entries = (needMat instanceof Map)
    ? Array.from(needMat.entries())
    : Object.entries(needMat || {});

  entries
    .sort((a,b)=> (matRank(a[0]) - matRank(b[0])) || a[0].localeCompare(b[0]))
    .forEach(([k, val])=>{
      const v = Math.round(Number(val || 0));
      if(v <= 0) return; // 0은 숨기고 싶지 않으면 이 줄 지워도 됨
      const set = fmtSet64(v);
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${matLabel(k)}</td><td class="right">${v}</td><td class="right">${set}</td>`;
      tb.appendChild(tr);
    });
}


// ===============================
// TAB2: 하위 제작 필요량(중간재) - 재고 반영
// - 추천 제작량(y)로부터 하위(정수/핵/에센스/결정/엘릭서/영약) 총 필요량을 전개
// - 중간재 재고(loadMidInv)를 먼저 소진하고, 부족분만 "추가 제작"으로 집계
// ===============================
function isMidItemName(name){
  // MID_SECTIONS 정의 순서를 그대로 사용
  for(const sec of MID_SECTIONS){
    if(sec.items && sec.items.includes(name)) return true;
  }
  return false;
}

function calcNetCraftPlanFromActual(yFinal){
  const recipes = getAllRecipesForMid(); // 최종품 포함(키:아이템명, 값:재료맵)
  const inv0 = (typeof loadMidInv === "function") ? (loadMidInv() || {}) : {};
  const inv = {};
  for(const [k,v] of Object.entries(inv0)) inv[k] = Math.max(0, Math.floor(Number(v||0)));

  const gross = {}; // 총 필요
  const net   = {}; // 추가 제작(재고 반영)

  const add = (obj, k, v) => {
    if(v <= 0) return;
    obj[k] = (obj[k] || 0) + v;
  };

  const expandGross = (item, qty, depth=0) => {
    qty = Math.max(0, Math.floor(Number(qty||0)));
    if(qty <= 0) return;
    if(depth > 60) return;

    if(isMidItemName(item)) add(gross, item, qty);

    const r = recipes[item];
    if(!r) return;
    for(const [mat, per] of Object.entries(r)){
      expandGross(mat, qty * Number(per||0), depth+1);
    }
  };

  const expandNet = (item, qty, depth=0) => {
    qty = Math.max(0, Math.floor(Number(qty||0)));
    if(qty <= 0) return;
    if(depth > 60) return;

    const r = recipes[item];
    if(!r) return;

    // ✅ 중간재면 재고를 먼저 소비하고, 부족분만 제작/전개
    if(isMidItemName(item)){
      const have = Math.max(0, Math.floor(Number(inv[item] || 0)));
      const use = Math.min(have, qty);
      if(use > 0) inv[item] = have - use;
      qty -= use;
      if(qty <= 0) return;

      add(net, item, qty);
    }

    for(const [mat, per] of Object.entries(r)){
      expandNet(mat, qty * Number(per||0), depth+1);
    }
  };

  PRODUCTS.forEach((p,i)=>{
    const qty = Math.max(0, Math.floor(Number(yFinal[i]||0)));
    if(!qty) return;
    expandGross(p.name, qty, 0);
    expandNet(p.name, qty, 0);
  });

  // 출력용 rows: MID_SECTIONS 순서로, 필요/재고/추가제작이 있는 것만
  const rows = [];
  for(const sec of MID_SECTIONS){
    for(const name of (sec.items || [])){
      const need = Math.max(0, Math.floor(Number(gross[name] || 0)));
      const invv = Math.max(0, Math.floor(Number(inv0[name] || 0)));
      const craft = Math.max(0, Math.floor(Number(net[name] || 0)));
      if(need <= 0 && invv <= 0 && craft <= 0) continue;
      rows.push({ name, need, inv: invv, craft });
    }
  }
  return rows;
}

function renderNeedCraftTableTo(sel, rows){
  const tb = document.querySelector(sel);
  if(!tb) return;
  tb.innerHTML = "";

  (rows || []).forEach(r=>{
    const tr = document.createElement("tr");
    const craftCls = r.craft > 0 ? "neg" : "muted";
    const totalNeed = Math.max(0, Math.floor(Number(r.craft || 0)) + Math.floor(Number(r.inv || 0)));
    tr.innerHTML =
      `<td><span class="tipName" data-tipname="${r.name}" data-tipcraft="${r.craft}">${matLabel(r.name)}</span></td>` +
      `<td class="right ${craftCls}">${r.craft}</td>` +
      `<td class="right">${r.inv}</td>` +
      `<td class="right">${totalNeed}</td>`;
    tb.appendChild(tr);
  });

  if(!rows || rows.length === 0){
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="muted" colspan="4">필요한 하위 제작템이 없습니다.</td>`;
    tb.appendChild(tr);
  }
}

// ===============================
// TAB2: Actual optimization with MID inventory balance (NO fish-credit)
// ===============================

// (중요) 탭2에서는 getActualSupply()를 쓰지 않는다.
// getActualSupply()가 mid credit을 더하고 있을 수 있으니, DOM에서 base_ + harv_만 직접 읽는다.
function readActualFishSupplyNoMid(){
  const out = Array(FISH_ROWS.length).fill(0);
  for(let i=0;i<FISH_ROWS.length;i++){
    const base = Math.max(0, Math.floor(Number(document.getElementById(`base_${i}`)?.value || 0)));
    const harv = Math.max(0, Math.floor(Number(document.getElementById(`harv_${i}`)?.value || 0)));
    out[i] = base + harv;
  }
  return out;
}

// resources(행) = fish(15) + mid items 전체
// items(열)     = recipes의 모든 산출물(중간재 + 최종품 9개 포함)
// 제약          = 소비 - 생산 <= 보유량  (생산은 자기 자신 -1)
function buildActualBalanceLP(pricesFinal){
  const fishNames = FISH_ROWS.slice();
  const midNames  = MID_ITEMS.slice();
  const resources = fishNames.concat(midNames);

  const fishSupply = readActualFishSupplyNoMid(); // ✅ mid credit 없음
  const midInv = loadMidInv();                    // ✅ 중간재 재고(그대로)

  // "중간재+최종품 레시피" 맵
const TIP_RECIPES = getAllRecipesForMid();

function getRecipeForTip(name){
  return TIP_RECIPES[name] || null;
}

  const items = Object.keys(recipes);
  const A = resources.map(()=> Array(items.length).fill(0));
  const b = resources.map(()=> 0);

  // b(보유량)
  for(let i=0;i<fishNames.length;i++) b[i] = Number(fishSupply[i] || 0);
  for(let j=0;j<midNames.length;j++){
    const nm = midNames[j];
    b[fishNames.length + j] = Math.max(0, Math.floor(Number(midInv[nm] || 0)));
  }

  // A(소비-생산)
  items.forEach((item, colIdx)=>{
    const ing = recipes[item] || {};

    // 재료 소비: +qty
    for(const [k, qty] of Object.entries(ing)){
      const rIdx = resources.indexOf(k);
      if(rIdx >= 0) A[rIdx][colIdx] += Number(qty || 0);
    }

    // 자신 생산: -1
    const selfIdx = resources.indexOf(item);
    if(selfIdx >= 0) A[selfIdx][colIdx] += -1;
  });

  // 목적함수 c: 최종품만 가격, 중간재는 0
  const c = items.map(()=> 0);
  PRODUCTS.forEach((p, i)=>{
    const idx = items.indexOf(p.name);
    if(idx >= 0) c[idx] = pricesFinal[i];
  });

  return {A, b, c, items, resources, fishSupply};
}

// A*x 의 fish 부분(첫 15행) = 실제 어패류 사용량
function calcFishUsedFromLP(A, x){
  const fishCount = FISH_ROWS.length;
  const used = Array(fishCount).fill(0);
  for(let i=0;i<fishCount;i++){
    let s = 0;
    for(let j=0;j<x.length;j++) s += (A[i][j] || 0) * (x[j] || 0);
    used[i] = Math.max(0, Math.round(s));
  }
  return used;
}

function optimizeActual(){
  updateTotalsActual();

  // prices use premium level only (storm/star irrelevant after harvest)
  const premiumLevel = Number(document.getElementById("premiumLevel").value || 0);
  const premiumMul = premiumMulFromLevel(premiumLevel);
  const prices = PRODUCTS.map(p=> Math.round(p.base * premiumMul));

  // ✅ 탭2는 "재고 밸런스 LP"로 풂 (중간재를 중간재로 사용)
  const {A, b, c, items, fishSupply} = buildActualBalanceLP(prices);

  const res = simplexMax(A, b, c);
  if(res.status !== "optimal"){
    alert("최적화 실패: 입력 재고를 확인해줘.");
    return;
  }

  const intRes = floorAndGreedyIntegerize(A, b, c, res.x);

  // ✅ 기존 UI는 최종품 9개만 그리므로 yFinal만 추출
  const yFinal = PRODUCTS.map(p=>{
    const idx = items.indexOf(p.name);
    return idx >= 0 ? (intRes.x[idx] || 0) : 0;
  });

  LAST_ACTUAL = {
    x: intRes.x,          // 전체 변수(중간재 제작량 포함)
    y: yFinal,            // 최종품만
    prices,
    fishSupply,
    A
  };

const usedFish = calcFishUsedFromLP(LAST_ACTUAL.A, LAST_ACTUAL.x);
renderActualResult(yFinal, prices, fishSupply, usedFish);

}

 

// ===============================
// TAB2: Actual optimization with MID inventory balance (NO fish-credit)
// ===============================

// (중요) 탭2에서는 getActualSupply()를 쓰지 않는다.
// getActualSupply()가 mid credit을 더하고 있을 수 있으니, DOM에서 base_ + harv_만 직접 읽는다.
function readActualFishSupplyNoMid(){
  const out = Array(FISH_ROWS.length).fill(0);
  for(let i=0;i<FISH_ROWS.length;i++){
    const base = Math.max(0, Math.floor(Number(document.getElementById(`base_${i}`)?.value || 0)));
    const harv = Math.max(0, Math.floor(Number(document.getElementById(`harv_${i}`)?.value || 0)));
    out[i] = base + harv;
  }
  return out;
}



// resources(행) = fish(15) + mid items 전체
// items(열)     = recipes의 모든 산출물(중간재 + 최종품 9개 포함)
// 제약          = 소비 - 생산 <= 보유량  (생산은 자기 자신 -1)
function buildActualBalanceLP(pricesFinal){
  const fishNames = FISH_ROWS.slice();
  const midNames  = MID_ITEMS.slice(); // 네 프로젝트에 이미 존재
  const resources = fishNames.concat(midNames);

  const fishSupply = readActualFishSupplyNoMid(); // ✅ mid credit 없음
  const midInv = loadMidInv();                    // ✅ 중간재 재고(그대로)

  // 네 프로젝트에 이미 있는 "중간재+최종품 레시피" 함수 사용
  const recipes = getAllRecipesForMid(); // { itemName: {ingredientName: qty, ...}, ... }

  const items = Object.keys(recipes);
  const A = resources.map(()=> Array(items.length).fill(0));
  const b = resources.map(()=> 0);

  // b 채우기
  for(let i=0;i<fishNames.length;i++) b[i] = Number(fishSupply[i] || 0);
  for(let j=0;j<midNames.length;j++){
    const nm = midNames[j];
    b[fishNames.length + j] = Math.max(0, Math.floor(Number(midInv[nm] || 0)));
  }

  // A 채우기: (소비 +) (생산 -)
  items.forEach((item, colIdx)=>{
    const ing = recipes[item] || {};

    // 재료 소비
    for(const [k, qty] of Object.entries(ing)){
      const rIdx = resources.indexOf(k);
      if(rIdx >= 0) A[rIdx][colIdx] += Number(qty || 0);
    }

    // 자신 생산(1개 생김) => 소비-생산 형태라 -1
    const selfIdx = resources.indexOf(item);
    if(selfIdx >= 0) A[selfIdx][colIdx] += -1;
  });

  // 목적함수 c: 최종품만 가격, 중간재는 0
  const c = items.map(()=> 0);
  PRODUCTS.forEach((p, i)=>{
    const idx = items.indexOf(p.name);
    if(idx >= 0) c[idx] = pricesFinal[i];
  });

  return {A, b, c, items, resources, fishSupply};
}

// A*x 의 fish 부분(첫 15행) = 실제 어패류 순소비량(양수면 소모, 음수면 생산인데 fish는 생산 없으니 거의 양수)
function calcFishUsedFromLP(A, x){
  const fishCount = FISH_ROWS.length;
  const used = Array(fishCount).fill(0);
  for(let i=0;i<fishCount;i++){
    let s = 0;
    for(let j=0;j<x.length;j++) s += (A[i][j] || 0) * (x[j] || 0);
    used[i] = Math.max(0, Math.round(s));
  }
  return used;
}



function getCraftChecks(){
  const raw = localStorage.getItem(LS_KEY_CRAFTCHECK);
  if(!raw) return {};
  try{ const obj = JSON.parse(raw); return obj && typeof obj==="object" ? obj : {}; }catch(e){ return {}; }
}
function getCraftCheck(i){
  const obj = getCraftChecks();
  return !!obj[i];
}
function setCraftCheck(i, v){
  const obj = getCraftChecks();
  obj[i] = !!v;
  localStorage.setItem(LS_KEY_CRAFTCHECK, JSON.stringify(obj));
}

// hooks
document.getElementById("btnOpt").addEventListener("click", () => {
  const btn = document.getElementById("btnOpt");
  setButtonLoading(btn, true, "최적화 중…");

  // 버튼 UI가 먼저 그려지게 한 프레임 넘김
  requestAnimationFrame(() => {
    try {
      optimize(); // ✅ 기존 함수 그대로 호출
    } finally {
      setButtonLoading(btn, false);
    }
  });
});

document.getElementById("btnSolveActual").addEventListener("click", () => {
  const btn = document.getElementById("btnSolveActual");
  setButtonLoading(btn, true, "계산 중…");

  requestAnimationFrame(() => {
    try {
      optimizeActual(); // ✅ 기존 함수 그대로 호출
    } finally {
      setButtonLoading(btn, false);
    }
  });
});


document.getElementById("craftTblA").addEventListener("change",(e)=>{
  const t = e.target;
  if(t && t.classList && t.classList.contains("chk")){
    const idx = Number(t.getAttribute("data-idx"));
    setCraftCheck(idx, t.checked);
  }
});


// tabs
const tabExpected = document.getElementById("tabExpected");
const tabActual   = document.getElementById("tabActual");
const tabRecipe   = document.getElementById("tabRecipe");

const panelExpected = document.getElementById("panelExpected");
const panelActual   = document.getElementById("panelActual");
const panelRecipe   = document.getElementById("panelRecipe");

function showPanel(which){
  // 기본: 다 숨김
  if(panelExpected) panelExpected.style.display = "none";
  if(panelActual)   panelActual.style.display   = "none";
  if(panelRecipe)   panelRecipe.style.display   = "none";

  // active 처리
  [tabExpected, tabActual, tabRecipe].filter(Boolean).forEach(t=>t.classList.remove("active"));

  if(which === "expected"){
    tabExpected?.classList.add("active");
    if(panelExpected) panelExpected.style.display = "block";
  }else if(which === "actual"){
    tabActual?.classList.add("active");
    if(panelActual) panelActual.style.display = "block";
  }else{ // recipe
    tabRecipe?.classList.add("active");
    if(panelRecipe) panelRecipe.style.display = "block";
    // 첫 진입 시 렌더/포커스
    try{ initRecipeUI(); }catch(e){}
    const inp = document.getElementById("recipeSearch");
    if(inp) inp.focus({preventScroll:true});
  }
}
tabExpected?.addEventListener("click", ()=>showPanel("expected"));
tabActual?.addEventListener("click", ()=>showPanel("actual"));
tabRecipe?.addEventListener("click", ()=>showPanel("recipe"));


document.getElementById("btnZero").addEventListener("click", ()=>{
  FISH_ROWS.forEach((_, i)=> document.getElementById(`inv_${i}`).value = 0);
  buildInvActual();
loadExpectedInv();
syncExpectedToBase();
loadBaseInv();
recalcFromCurrent();
});
document.querySelectorAll("#panelExpected input,#panelExpected select").forEach(el=>{
  el.addEventListener("change", ()=>recalcFromCurrent());
});

// 탭1 재고 변경 시 탭2 기존재고에도 자동 반영 + 저장
FISH_ROWS.forEach((_, i)=>{
  const el = document.getElementById(`inv_${i}`);
  if(el){
    el.addEventListener("change", ()=>{ saveExpectedInv(); syncExpectedToBase(); });
  }
});


/* =========================
   Tooltip (hover + pin)
   - no flicker: mousemove only moves position
   - click pin / outside click close / ESC close
   ========================= */

(() => {
  const tip = document.getElementById("recipeTip");
  if (!tip) return;

  let pinned = false;
  let pinnedEl = null;   // 고정시킨 원본 요소(수량 갱신용)
  let lastHtml = "";     // 같은 내용이면 innerHTML 재세팅 방지

  // 레시피 테이블 lazy init
  let TIP_RECIPES = null;
  const getRecipe = (name) => {
    if (!TIP_RECIPES) {
      TIP_RECIPES = (typeof getAllRecipesForMid === "function") ? (getAllRecipesForMid() || {}) : {};
    }
    return TIP_RECIPES[name] || null;
  };

  // 완성품 판별(없으면 PRODUCTS 기반으로라도)
  const isFinalProductName = (name) => {
    if (typeof isFinalProduct === "function") return !!isFinalProduct(name);
    return (typeof PRODUCTS !== "undefined") && PRODUCTS.some(p => p.name === name);
  };

  // ✅ 툴팁 라벨: ★ 숨기지 않음(원본 그대로 표시)
  // - 완성품: productLabel 사용
  // - 중간재/재료: matLabel 사용
  function tipLabel(name) {
    const raw = String(name || "");
    if (isFinalProductName(raw)) {
      return (typeof productLabel === "function") ? productLabel(raw) : raw;
    }
    return (typeof matLabel === "function") ? matLabel(raw) : raw;
  }


  function clampPos(x, y) {
    const pad = 12;
    const rect = tip.getBoundingClientRect();
    let nx = x, ny = y;

    if (nx + rect.width > window.innerWidth - pad) nx = window.innerWidth - pad - rect.width;
    if (nx < pad) nx = pad;

    if (ny + rect.height > window.innerHeight - pad) ny = window.innerHeight - pad - rect.height;
    if (ny < pad) ny = pad;

    return { nx, ny };
  }

  function setPosNearCursor(clientX, clientY) {
    // 기본: 커서 위쪽에 띄우고, 위가 부족하면 아래로
    tip.style.left = (clientX + 14) + "px";
    tip.style.top  = (clientY + 14) + "px";

    const rect = tip.getBoundingClientRect();
    let x = clientX + 14;
    let y = clientY - rect.height - 14;
    if (y < 12) y = clientY + 18;

    const p = clampPos(x, y);
    tip.style.left = p.nx + "px";
    tip.style.top  = p.ny + "px";
  }

  function buildTipHtml(name, meta) {
    const r = getRecipe(name);
    if (!r) return null;

    const kind  = meta?.kind || (isFinalProductName(name) ? "final" : "mid");
  const qty   = Math.max(0, Math.floor(Number(meta?.qty ?? 0)));
const craft = Math.max(0, Math.floor(Number(meta?.craft ?? qty ?? 0)));
const need  = Math.max(0, Math.floor(Number(meta?.need ?? craft ?? 0)));

    const inv   = Math.max(0, Math.floor(Number(meta?.inv || 0)));

    // 레시피 수량 배수는 “추가 제작” 기준(A 선택)
const mul = (kind === "final")
  ? Math.max(1, Math.floor(Number(qty ?? craft ?? 0))) // rec와 같은 기준
  : Math.max(1, craft);


const titleHtml = (kind === "final") ? productLabel(name) : matLabel(name);


// 배지 규칙
let badges = "";

if (kind === "final") {
  const rec = Math.max(0, Number(qty || craft || 0));

  badges = rec > 0
    ? `<span class="tipBadge">추천 제작 ${rec}</span>`
    : `<span class="tipBadge">레시피</span>`;
} else {
  badges = craft > 0
    ? `<span class="tipBadge">추가 제작 ${craft}</span>`
    : `<span class="tipBadge">레시피</span>`;
}




   const lines = Object.entries(r)
  .map(([mat, per]) => {
    const total = Math.max(0, Math.floor(Number(per || 0) * mul));
    return `
      <div class="tipRow">
        <div class="tipLeft">${matLabel(mat)}</div>
        <div class="tipQty">×${total}</div>
      </div>
    `;
  })
  .join("");


    return `
      <div class="tipTop">
        <div class="tipTitle">${titleHtml}</div>
        <div class="tipBadges">${badges}</div>
      </div>
      <div class="tipList">${lines}</div>
    `;
  }

  function showTip(clientX, clientY, name, meta) {
    const html = buildTipHtml(name, meta);
    if (!html) return;

    // 내용이 바뀔 때만 innerHTML (깜빡임 방지 핵심)
    if (html !== lastHtml) {
      tip.innerHTML = html;
      lastHtml = html;
    }

    tip.hidden = false;
    setPosNearCursor(clientX, clientY);
  }

  function hideTip() {
    tip.hidden = true;
    tip.classList.remove("pinned");
    lastHtml = "";
  }

  function unpin() {
    pinned = false;
    pinnedEl = null;
    hideTip();
  }

  // ✅ hover
  document.addEventListener("pointerover", (e) => {
    if (pinned) return;
    const el = e.target.closest("[data-tipname]");
    if (!el) return;

    const name = el.getAttribute("data-tipname");
    const meta = {
      kind: el.getAttribute("data-tipkind") || undefined,
      qty:  el.getAttribute("data-tipqty"),
      craft:el.getAttribute("data-tipcraft"),
      need: el.getAttribute("data-tipneed"),
      inv:  el.getAttribute("data-tipinv"),
    };

    showTip(e.clientX, e.clientY, name, meta);
  });

  // ✅ move: 위치만 이동(내용 X)
  document.addEventListener("pointermove", (e) => {
    if (tip.hidden) return;
    if (pinned) return;
    setPosNearCursor(e.clientX, e.clientY);
  });

  // ✅ out: 숨김(고정 중이면 유지)
  document.addEventListener("pointerout", (e) => {
    if (pinned) return;
    const el = e.target.closest("[data-tipname]");
    if (!el) return;
    hideTip();
  });

  // ✅ click pin / outside click close
  document.addEventListener("click", (e) => {
    // tooltip 자체 클릭은 유지
    if (e.target.closest("#recipeTip")) return;

    const el = e.target.closest("[data-tipname]");
    if (el) {
      // 클릭한 항목 고정
      pinned = true;
      pinnedEl = el;
      tip.classList.add("pinned");

      const name = el.getAttribute("data-tipname");
      const meta = {
        kind: el.getAttribute("data-tipkind") || undefined,
        qty:  el.getAttribute("data-tipqty"),
        craft:el.getAttribute("data-tipcraft"),
        need: el.getAttribute("data-tipneed"),
        inv:  el.getAttribute("data-tipinv"),
      };

      showTip(e.clientX, e.clientY, name, meta);
      return;
    }

    // 다른 곳 클릭하면 닫기
    if (pinned) unpin();
  });

  // ✅ ESC 해제
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && pinned) unpin();
  });

  // (선택) 아이콘 늦게 뜨는 거 줄이기: 미리 로드
  window.addEventListener("DOMContentLoaded", () => {
    try {
      const urls = [];
      if (typeof PRODUCT_ICON_URL === "object") urls.push(...Object.values(PRODUCT_ICON_URL));
      if (typeof MATERIAL_ICON_URL === "object") urls.push(...Object.values(MATERIAL_ICON_URL));
      urls.filter(Boolean).forEach(u => { const im = new Image(); im.src = u; });
    } catch (_) {}
  });
})();



buildInvActual();
renderMidInvGrid();   // ✅ 이 줄
bindMidInvResetButtons();
updateMidInvBadge();
loadExpectedInv();
syncExpectedToBase();
loadBaseInv();
recalcFromCurrent();
updateTotalsActual();




/* =========================
   TAB3: 연금 레시피 UI (복구)
   - index.html의 #panelRecipe/#recipeList 구조를 그대로 사용
   - 새 기능/리디자인 없이 "목록이 안 뜨는" 문제만 해결
   ========================= */

let __RECIPE_UI_INITED__ = false;

function initRecipeUI(){
  if(__RECIPE_UI_INITED__) return;
  __RECIPE_UI_INITED__ = true;

  const host = document.getElementById("recipeList");
  if(!host) return;

  // 데이터: 기존 레시피 맵 재사용(중간재 + 최종품 포함)
  const RECIPES = (typeof getAllRecipesForMid === "function") ? (getAllRecipesForMid() || {}) : {};
  const NAMES = Object.keys(RECIPES);

  const FINAL_SET = new Set(((typeof PRODUCTS !== "undefined") && Array.isArray(PRODUCTS)) ? PRODUCTS.map(p=>p.name) : []);

  const hostDlg = document.getElementById("recipeListDlg");

  const inp = document.getElementById("recipeSearch");
  const btnClear = document.getElementById("btnRecipeClear");

  const dlg = document.getElementById("recipeDialog");
  const btnPop = document.getElementById("btnRecipePopup");
  const btnClose = document.getElementById("btnRecipePopClose");
  const inpDlg = document.getElementById("recipeSearchDlg");
  const btnClearDlg = document.getElementById("btnRecipeClearDlg");

  const kindText = (name) => FINAL_SET.has(name) ? "완성품" : "중간재";
  const titleHtml = (name) => FINAL_SET.has(name)
    ? (typeof productLabel === "function" ? productLabel(name) : escapeHtml(name))
    : (typeof matLabel === "function" ? matLabel(name) : escapeHtml(name));

  function normQ(q){
    return String(q||"").trim().toLowerCase();
  }

  function matchRecipe(name, q){
    if(!q) return true;
    const nq = normQ(q);
    if(String(name).toLowerCase().includes(nq)) return true;
    const ing = RECIPES[name] || {};
    return Object.keys(ing).some(k => String(k).toLowerCase().includes(nq));
  }

  // ---- 섹션/정렬 정책 ----
  // index.html에 이미 있는 .recipeGroup/.recipeGroupTitle UI를 그대로 사용
  // 별(★) 단계별로: (중간재 2개) → (완성품) 순서 고정
  // 1티어: 정수/핵, 2티어: 에센스/결정, 3티어: 엘릭서/영약

  const SECTIONS = [];
  const used = new Set();

  const starCount = (name)=>{
    const m = String(name).match(/★+/);
    return m ? m[0].length : 0;
  };

  const kindKey = (name)=>{
    name = String(name);
    if(name.includes("정수")) return "mid1a";
    if(name.includes("핵")) return "mid1b";
    if(name.includes("에센스")) return "mid2a";
    if(name.includes("결정")) return "mid2b";
    if(name.includes("엘릭서")) return "mid3a";
    if(name.includes("영약")) return "mid3b";
    return "final";
  };

  const ORDER = [
    { tier:1, kind:"mid1a", title:"정수 ★" },
    { tier:1, kind:"mid1b", title:"핵 ★" },
    { tier:1, kind:"final", title:"1티어 완성품 ★" },

    { tier:2, kind:"mid2a", title:"에센스 ★★" },
    { tier:2, kind:"mid2b", title:"결정 ★★" },
    { tier:2, kind:"final", title:"2티어 완성품 ★★" },

    { tier:3, kind:"mid3a", title:"엘릭서 ★★★" },
    { tier:3, kind:"mid3b", title:"영약 ★★★" },
    { tier:3, kind:"final", title:"3티어 완성품 ★★★" },
  ];

  // NAMES는 RECIPES 키 목록(원본 삽입 순서 유지)
  ORDER.forEach(sec=>{
    const items = NAMES.filter(n=>{
      if(starCount(n) !== sec.tier) return false;
      if(kindKey(n) !== sec.kind) return false;
      return true;
    });
    if(items.length){
      items.forEach(n=>used.add(n));
      SECTIONS.push({ title: sec.title, items });
    }
  });

  // 나머지(혹시 누락된 레시피가 있다면): 기존처럼 가나다 정렬
  const rest = NAMES.filter(n => !used.has(n));
  if(rest.length){
    rest.sort((a,b)=> a.localeCompare(b, "ko"));
    SECTIONS.push({ title: "기타", items: rest });
  }

  function renderCards(items){
    return items.map(name=>{
      const ing = RECIPES[name] || {};
      const ingHtml = Object.entries(ing).map(([mat, qty])=>{
        const qn = Math.max(0, Math.floor(Number(qty||0)));
        // tooltip 호버/핀 동작을 그대로 사용하기 위해 data-tipname 부여
        return `
          <div class="recipeIng" data-tipname="${escapeHtml(mat)}" data-tipkind="mid">
            ${typeof matLabel === "function" ? matLabel(mat) : escapeHtml(mat)}
            <span class="qty">×${qn}</span>
          </div>
        `;
      }).join("");

      return `
        <div class="recipeCard">
          <div class="recipeCardTop">
            <div><span class="tipName" data-tipname="${escapeHtml(name)}" data-tipkind="${FINAL_SET.has(name) ? "final" : "mid"}">${titleHtml(name)}</span></div>
            <div class="recipeKind">${kindText(name)}</div>
          </div>
          <div class="recipeIngs">${ingHtml}</div>
        </div>
      `;
    }).join("");
  }

  function renderInto(el, q){
    if(!el) return;
    const qq = normQ(q);

    const groups = SECTIONS
      .map(sec=>{
        const items = sec.items.filter(n => matchRecipe(n, qq));
        return { title: sec.title, items };
      })
      .filter(g => g.items.length > 0);

    if(groups.length === 0){
      el.innerHTML = `<div class="small" style="padding:6px 2px;opacity:.75">검색 결과가 없습니다.</div>`;
      return;
    }

    const html = groups.map(g=>{
      const cards = renderCards(g.items);
      return `
        <div class="recipeGroup">
          <div class="recipeGroupTitle">${escapeHtml(g.title)}</div>
          <div class="recipeCards">${cards}</div>
        </div>
      `;
    }).join("");

    el.innerHTML = html;
  }

  function syncAndRender(from){
    // from: "main" | "dlg"
    const qMain = inp ? inp.value : "";
    const qDlg  = inpDlg ? inpDlg.value : "";
    const q = (from === "dlg") ? qDlg : qMain;

    // 서로 검색어 동기화(UX)
    if(from === "dlg" && inp) inp.value = q;
    if(from === "main" && inpDlg) inpDlg.value = q;

    renderInto(host, q);
    renderInto(hostDlg, q);
  }

  // 초기 렌더
  syncAndRender("main");

  // 이벤트: 메인
  if(inp){
    inp.addEventListener("input", ()=>syncAndRender("main"));
  }
  if(btnClear){
    btnClear.addEventListener("click", ()=>{
      if(inp) inp.value = "";
      if(inpDlg) inpDlg.value = "";
      syncAndRender("main");
      inp?.focus({preventScroll:true});
    });
  }

  // 이벤트: 다이얼로그(있으면)
  if(inpDlg){
    inpDlg.addEventListener("input", ()=>syncAndRender("dlg"));
  }
  if(btnClearDlg){
    btnClearDlg.addEventListener("click", ()=>{
      if(inp) inp.value = "";
      if(inpDlg) inpDlg.value = "";
      syncAndRender("dlg");
      inpDlg?.focus({preventScroll:true});
    });
  }

  // 다이얼로그 열기/닫기 (기존 UI 존재 시에만)
  if(btnPop && dlg && typeof dlg.showModal === "function"){
    btnPop.addEventListener("click", ()=>{
      try{ dlg.showModal(); }catch(e){}
      syncAndRender("main");
      inpDlg?.focus({preventScroll:true});
    });
  }
  if(btnClose && dlg){
    btnClose.addEventListener("click", ()=>{ try{ dlg.close(); }catch(e){} });
  }
}


// 아주 작은 HTML escape (data-* 안전)
function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}



/* =========================
   TODO BAR (개인 체크리스트)
   - 로그인/서버 없이 localStorage에 저장
   - 매일 00:00 초기화 그룹 / 매일 03:00 초기화 그룹
   - 남은 시간 타이머 표시
   - B 정책: 기본 펼침, 해당 그룹 모두 체크되면 자동 접힘, 초기화 시 자동 펼침
   ========================= */

(function(){
  const TODO_SPEC = [
    {
      key: "daily00",
      title: "00:00 초기화",
      resetHour: 0,
      items: [
        { id: "vote",  label: "👍추천", link: "https://minelist.kr/servers/16527-ddingtycoon.kr/votes/new" },
        { id: "login", label: "🎁접속 보상" },
        { id: "trade", label: "🚢무역" },
      ],
    },
    {
      key: "daily03",
      title: "03:00 초기화",
      resetHour: 3,
      items: [
        { id: "stam",  label: "⚡스태미나" },
        { id: "req",   label: "📝의뢰" },
      ],
    },
  ];

  const LS_KEY = "dd_todo_state_v1";
  const LS_UI_KEY = "dd_todo_ui_v1";
  const INACTIVITY_MS = 10 * 60 * 1000; // 상호작용 없으면 자동 숨김(10분)
  let _inactTimer = null;


  // --- 체크 사운드 (로그인 없이/외부 파일 없이 WebAudio로 아주 짧게) ---
  let _audioCtx = null;
  let _audioArmed = false;

  function armAudioOnce(){
    if(_audioArmed) return;
    _audioArmed = true;
    try{
      _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if(_audioCtx.state === "suspended"){
        _audioCtx.resume().catch(()=>{});
      }
    }catch(_e){
      _audioCtx = null;
    }
  }

  // 유저 제스처가 한 번이라도 있으면 사운드 가능
  window.addEventListener("pointerdown", armAudioOnce, { once:true });
  window.addEventListener("keydown", armAudioOnce, { once:true });

  function playCheckTick(){
    if(!_audioCtx) return;
    try{
      if(_audioCtx.state === "suspended"){
        _audioCtx.resume().catch(()=>{});
      }
      const t0 = _audioCtx.currentTime;

      const osc = _audioCtx.createOscillator();
      const gain = _audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, t0);

      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.05, t0 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.08);

      osc.connect(gain);
      gain.connect(_audioCtx.destination);

      osc.start(t0);
      osc.stop(t0 + 0.09);
    }catch(_e){}
  }

  function popAnim(labelEl){
    if(!labelEl) return;
    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    labelEl.classList.remove("todoPop");
    // reflow to restart animation
    void labelEl.offsetWidth;
    labelEl.classList.add("todoPop");
  }


  function setupAutoHide(bar){
    if(!bar || bar.__todoAutoHideBound) return;
    bar.__todoAutoHideBound = true;

    const bump = ()=> resetInactivity(bar);

    // 페이지 어디서든 상호작용이면 타이머 갱신
    ["mousemove","mousedown","keydown","scroll","touchstart","pointerdown","wheel"].forEach(ev=>{
      window.addEventListener(ev, bump, { passive:true });
    });

    // 패널 내부 상호작용도 포함
    bar.addEventListener("mouseenter", bump, { passive:true });
    bar.addEventListener("click", bump);

    resetInactivity(bar);
  }

  function resetInactivity(bar){
    if(_inactTimer) clearTimeout(_inactTimer);
    _inactTimer = setTimeout(()=>{
      try{
        const ui = loadTodoUI();
        if(ui && !ui.hidden){
          bar.classList.add("hidden");
          saveTodoUI({ hidden:true });
        }
      }catch(_e){}
    }, INACTIVITY_MS);
  }


  function now(){ return new Date(); }

  function pad2(n){ return String(n).padStart(2,"0"); }
  function fmtRemain(ms){
    // HH:MM:SS
    const s = Math.max(0, Math.floor(ms/1000));
    const h = pad2(Math.floor(s/3600));
    const m = pad2(Math.floor((s%3600)/60));
    const sec = pad2(s%60);
    return `${h}:${m}:${sec}`;
  }

  function dayKeyForReset(hour){
    // "리셋 기준일" 키: 해당 hour 기준으로 하루가 시작되는 날짜 문자열(YYYY-MM-DD)
    const d = now();
    const base = new Date(d);
    base.setHours(hour,0,0,0);
    // 현재 시간이 리셋 시각 이전이면 "어제"가 아직 같은 사이클
    if(d < base) base.setDate(base.getDate()-1);
    return `${base.getFullYear()}-${pad2(base.getMonth()+1)}-${pad2(base.getDate())}`;
  }

  function nextResetAt(hour){
    const d = now();
    const t = new Date(d);
    t.setHours(hour,0,0,0);
    if(d >= t) t.setDate(t.getDate()+1);
    return t;
  }

  function loadState(){
    try{
      return JSON.parse(localStorage.getItem(LS_KEY) || "{}") || {};
    }catch(_){ return {}; }
  }

  function loadTodoUI(){
    try{
      const raw = localStorage.getItem(LS_UI_KEY);
      if(!raw) return { hidden:false };
      const u = JSON.parse(raw);
      return { hidden: !!u.hidden };
    }catch(_e){
      return { hidden:false };
    }
  }

  function saveTodoUI(u){
    try{ localStorage.setItem(LS_UI_KEY, JSON.stringify({ hidden: !!u.hidden })); }catch(_e){}
  }
  function saveState(state){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(state||{})); }catch(_){}
  }

  function ensureCycle(state, groupKey, resetHour){
    state[groupKey] = state[groupKey] || { cycleDay:"", checked:{} , collapsed:false };
    const cycleDay = dayKeyForReset(resetHour);
    if(state[groupKey].cycleDay !== cycleDay){
      // 초기화
      state[groupKey].cycleDay = cycleDay;
      state[groupKey].checked = {};
      state[groupKey].collapsed = false; // 초기화 시 자동 펼침
    }
  }

  function isAllChecked(state, groupKey, items){
    const checked = state[groupKey]?.checked || {};
    return items.every(it => !!checked[it.id]);
  }

  function mountTodoBar(){
    // 이미 있으면 스킵
    if(document.getElementById("todoBar")) return;

    const tabs = document.querySelector(".tabs");
    if(!tabs) return;

    // style inject (기존 UI를 크게 바꾸지 않는 최소 스타일)
    if(!document.getElementById("todoBarStyle")){
      const st = document.createElement("style");
      st.id = "todoBarStyle";
      st.textContent = `
#todoBar{
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 40;
  width: min(260px, calc(100vw - 32px));
  pointer-events: auto;
}
#todoBar .todoCard{
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 14px;
  padding: 8px 10px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.08);
}
#todoBar .todoHead{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  margin-bottom: 6px;
}
#todoBar .todoTitle{
  font-weight: 700;
  font-size: 13px;
}
#todoBar .todoHint{
  font-size: 11px;
  opacity: 0.75;
}
#todoBar .todoToggle{
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.60);
  border-radius: 10px;
  padding: 4px 8px;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
}
#todoBar .todoToggle:hover{ background: rgba(255,255,255,0.80); }
#todoBar .groups{
  display:flex;
  flex-direction:column;
  gap:8px;
  max-height: 42vh;
  overflow:auto;
  padding-right: 4px;
}
#todoBar .group{
  border-top: 1px solid rgba(0,0,0,0.06);
  padding-top: 8px;
}
#todoBar .group:first-child{
  border-top: 0;
  padding-top: 0;
}
#todoBar .gTop{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  cursor:pointer;
  user-select:none;
}
#todoBar .gName{
  font-weight: 700;
  font-size: 12px;
}
#todoBar .timer{
  font-variant-numeric: tabular-nums;
  font-size: 11px;
  opacity: 0.75;
  white-space: nowrap;
}
#todoBar .items{
  margin-top: 6px;
  display:flex;
  flex-wrap:wrap;
  gap:8px 12px;
}
#todoBar label.todoItem{
  display:inline-flex;
  align-items:center;
  gap:6px;
  flex: 0 0 auto;
  cursor: pointer;
  white-space: nowrap;
}
#todoBar label.todoItem input[type=checkbox]{
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  transform: none !important;
  margin: 0;
}
#todoBar label.todoItem span{ display:inline; }
#todoBar label.todoItem a{ text-decoration: underline; }
#todoBar label.todoItem.todoPop{ animation: todoPop 180ms ease-out; }
@keyframes todoPop { 0%{ transform: scale(1); } 60%{ transform: scale(1.06); } 100%{ transform: scale(1); } }
@media (prefers-reduced-motion: reduce){
  #todoBar label.todoItem.todoPop{ animation: none; }
}

#todoBar .collapsed .items{ display:none; }
#todoBar .doneHint{
  font-size: 12px;
  opacity: 0.75;
}
#todoBar label{ flex: initial !important; width: auto !important; }

#todoBar.hidden{ width:auto; display:flex; justify-content:flex-end; }
#todoBar.hidden .todoCard{ display:none; }
#todoBar .todoMini{
  display:none;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 999px;
  padding: 8px 10px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.08);
  font-size: 12px;
  cursor: pointer;
  user-select:none;
}
#todoBar.hidden .todoMini{ display:inline-flex; align-items:center; gap:8px; }
      `.trim();
      document.head.appendChild(st);
    }

    const bar = document.createElement("div");
    bar.id = "todoBar";
    bar.innerHTML = `
<div class="todoCard">
  <div class="todoHead">
    <div class="todoTitle">✅ TO-DO LIST</div>
    <div style="display:flex; align-items:center; gap:8px;">
      <div class="todoHint">완료 시 자동 접힘</div>
      <button type="button" class="todoToggle" id="todoHideBtn" title="숨기기">숨김</button>
    </div>
  </div>
  <div class="todoGroups groups" id="todoGroups"></div>
</div>
<div class="todoMini" id="todoMiniBtn" title="체크리스트 펼치기">✅ TO-DO</div>
    `.trim();

    tabs.parentNode.insertBefore(bar, tabs);

    // hide/show
    const ui = loadTodoUI();
    if(ui.hidden) bar.classList.add("hidden");
    const hideBtn = bar.querySelector("#todoHideBtn");
    const miniBtn = bar.querySelector("#todoMiniBtn");
    if(hideBtn) hideBtn.addEventListener("click", (e)=>{
      e.preventDefault();
      e.stopPropagation();
      bar.classList.add("hidden");
      saveTodoUI({ hidden:true });
    });
    if(miniBtn) miniBtn.addEventListener("click", (e)=>{
      e.preventDefault();
      e.stopPropagation();
      bar.classList.remove("hidden");
      saveTodoUI({ hidden:false });
      resetInactivity(bar);
    });

    setupAutoHide(bar);
  }

  function renderTodo(state){
    const host = document.getElementById("todoGroups");
    if(!host) return;
    host.innerHTML = "";

    TODO_SPEC.forEach(g=>{
      const gState = state[g.key] || {checked:{}, collapsed:false};
      const allDone = isAllChecked(state, g.key, g.items);

      // B 정책: 모두 체크되면 자동 접힘(사용자가 다시 펼쳐도 다음 렌더에서 다시 접히지 않도록, collapsed만 강제 true)
      if(allDone) gState.collapsed = true;

      const group = document.createElement("div");
      group.className = "group" + (gState.collapsed ? " collapsed" : "");
      group.dataset.group = g.key;

      const arrow = gState.collapsed ? "▸" : "▾";
      const doneHint = allDone ? `<span class="doneHint">✔ 완료됨</span>` : ``;

      group.innerHTML = `
<div class="gTop" title="클릭해서 펼치기/접기">
  <div class="gName">${arrow} ${g.title} ${doneHint}</div>
  <div class="timer" id="timer_${g.key}">--:--:--</div>
</div>
<div class="items"></div>
      `.trim();

      const itemsHost = group.querySelector(".items");

      g.items.forEach(it=>{
        const id = `${g.key}__${it.id}`;
        const checked = !!(gState.checked && gState.checked[it.id]);

        const label = document.createElement("label");
        label.className = "todoItem";

        const labelText = it.link
          ? `${it.label} (<a href="${it.link}" target="_blank" rel="noopener noreferrer">링크</a>)`
          : it.label;

        label.innerHTML = `<input type="checkbox" id="${id}" ${checked ? "checked":""}/> <span>${labelText}</span>`;
        itemsHost.appendChild(label);

        const cb = label.querySelector("input");
        cb.addEventListener("change", ()=>{
          const st = loadState();
          ensureCycle(st, g.key, g.resetHour);
          st[g.key].checked = st[g.key].checked || {};
          st[g.key].checked[it.id] = !!cb.checked;


          // 체크 완료 시: 사운드 + 미세 애니메이션
          if(cb.checked){
            playCheckTick();
            popAnim(label);
          }
          resetInactivity(document.getElementById('todoBar'));

          // 완료되면 자동 접힘
          const doneNow = g.items.every(x => !!st[g.key].checked[x.id]);
          if(doneNow) st[g.key].collapsed = true;

          saveState(st);
          renderTodo(st);
        });
      });

      // 접기/펼치기(완료된 그룹은 펼쳐도 체크 하나라도 풀리면 다음 렌더에서 자동 펼침됨)
      group.querySelector(".gTop").addEventListener("click", (e)=>{
        // 링크 클릭은 토글 막기
        if(e.target && e.target.closest && e.target.closest("a")) return;

        const st = loadState();
        ensureCycle(st, g.key, g.resetHour);

        const allDone2 = g.items.every(x => !!(st[g.key].checked||{})[x.id]);
        // 완료된 상태에서는 접힘 유지(원하면 펼치기는 허용)
        st[g.key].collapsed = !st[g.key].collapsed;

        // 다만 완료되어 있는데 펼쳤다면, UI만 펼쳐진 상태로 두되(사용자 선택) 다음 렌더에서 강제로 접히지 않게:
        // -> B 정책과 충돌할 수 있어서, '완료된 그룹은 기본 접힘'만 유지하고 사용자 펼침은 허용
        // renderTodo에서 allDone이면 collapsed=true로 강제하므로 펼침이 다시 접힘으로 돌아감.
        // 사용자가 펼쳐볼 수 있게 하려면 강제 로직을 약하게 해야 함.
        // 여기서는 "완료되면 자동 접힘"만 보장하고, 사용자가 펼치면 유지되도록 강제 로직 제거.
        // 따라서 위에서 강제 true는 제거하고, 완료 시점에만 collapsed=true로 설정한다.
        // (renderTodo의 강제 true는 아래에서 제거됨)

        saveState(st);
        renderTodo(st);
      });

      host.appendChild(group);
      state[g.key] = gState; // keep updated
    });
  }

  function updateTimers(){
    const nowD = now();
    TODO_SPEC.forEach(g=>{
      const el = document.getElementById(`timer_${g.key}`);
      if(el){
        const nx = nextResetAt(g.resetHour);
        el.textContent = `${fmtRemain(nx - nowD)}`;
      }
    });
  }

  function tick(){
    // 사이클 변경(리셋) 감지 + 자동 초기화
    const st = loadState();
    let changed = false;
    TODO_SPEC.forEach(g=>{
      const before = st[g.key]?.cycleDay || "";
      ensureCycle(st, g.key, g.resetHour);
      if(before !== st[g.key].cycleDay) changed = true;
    });
    if(changed) saveState(st);

    renderTodo(st);
    updateTimers();
  }

  function initTodoBar(){
    mountTodoBar();
    const st = loadState();
    TODO_SPEC.forEach(g=>ensureCycle(st, g.key, g.resetHour));
    saveState(st);

    // render + timers
    renderTodo(st);
    updateTimers();

    // 1초마다 타이머, 10초마다 리셋 체크(1초 tick로 해도 부담 적지만, 안전하게 통합)
    setInterval(()=>{
      const st2 = loadState();
      let changed = false;
      TODO_SPEC.forEach(g=>{
        const before = st2[g.key]?.cycleDay || "";
        ensureCycle(st2, g.key, g.resetHour);
        if(before !== st2[g.key].cycleDay) changed = true;
      });
      if(changed){
        saveState(st2);
        renderTodo(st2);
      }
      updateTimers();
    }, 1000);
  }

  // renderTodo에서 "완료면 강제 접힘" 로직 제거(완료 시점에만 접힘 처리)
  // => 위에서 이미 완료 시 change 핸들러에서 collapsed=true로 처리.
  const _renderTodo = renderTodo;
  renderTodo = function(state){
    const host = document.getElementById("todoGroups");
    if(!host) return;
    host.innerHTML = "";
    TODO_SPEC.forEach(g=>{
      const gState = state[g.key] || {checked:{}, collapsed:false};
      const allDone = isAllChecked(state, g.key, g.items);

      const group = document.createElement("div");
      group.className = "group" + (gState.collapsed ? " collapsed" : "");
      group.dataset.group = g.key;

      const arrow = gState.collapsed ? "▸" : "▾";
      const doneHint = allDone ? `<span class="doneHint">✔ 완료됨</span>` : ``;

      group.innerHTML = `
<div class="gTop" title="클릭해서 펼치기/접기">
  <div class="gName">${arrow} ${g.title} ${doneHint}</div>
  <div class="timer" id="timer_${g.key}">--:--:--</div>
</div>
<div class="items"></div>
      `.trim();

      const itemsHost = group.querySelector(".items");

      g.items.forEach(it=>{
        const id = `${g.key}__${it.id}`;
        const checked = !!(gState.checked && gState.checked[it.id]);

        const label = document.createElement("label");
        label.className = "todoItem";

        const labelText = it.link
          ? `${it.label} (<a href="${it.link}" target="_blank" rel="noopener noreferrer">링크</a>)`
          : it.label;

        label.innerHTML = `<input type="checkbox" id="${id}" ${checked ? "checked":""}/> <span>${labelText}</span>`;
        itemsHost.appendChild(label);

        const cb = label.querySelector("input");
        cb.addEventListener("change", ()=>{
          const st = loadState();
          ensureCycle(st, g.key, g.resetHour);
          st[g.key].checked = st[g.key].checked || {};
          st[g.key].checked[it.id] = !!cb.checked;


          // 체크 완료 시: 사운드 + 미세 애니메이션
          if(cb.checked){
            playCheckTick();
            popAnim(label);
          }
          resetInactivity(document.getElementById('todoBar'));

          // 완료되면 자동 접힘
          const doneNow = g.items.every(x => !!st[g.key].checked[x.id]);
          if(doneNow) st[g.key].collapsed = true;
          // 하나라도 풀리면 자동 펼침
          if(!doneNow) st[g.key].collapsed = false;

          saveState(st);
          renderTodo(st);
        });
      });

      group.querySelector(".gTop").addEventListener("click", (e)=>{
        if(e.target && e.target.closest && e.target.closest("a")) return;
        const st = loadState();
        ensureCycle(st, g.key, g.resetHour);
        st[g.key].collapsed = !st[g.key].collapsed;
        saveState(st);
        renderTodo(st);
      });

      host.appendChild(group);
    });

    updateTimers();
  };

  // 앱 초기화 후 DOM이 있을 때 붙이기
  window.addEventListener("DOMContentLoaded", ()=>{
    try{ initTodoBar(); }catch(err){ console.warn("[todoBar] init failed", err); }
  });
})();

