// OpenAI(GPT + 웹검색)로 회사별·연도별 설비 포트폴리오(고로/전기로, 판재/봉형강 비중)와 주요 사업장을 생성하고,
// 사업장 도시를 OpenStreetMap Nominatim으로 지오코딩해 data/facilities.js 에 저장한다.
// API 키는 C:\Users\USER\Desktop\Python\.env 의 OPENAI_API_KEY (브라우저 코드에는 넣지 않음).
//
// 실행:  node scripts/fetch_facilities.mjs                 # 없는 항목만 생성
//        node scripts/fetch_facilities.mjs --only posco --year 2025 --force
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "data", "facilities.js");
const GEO_CACHE = path.join(ROOT, "scripts", ".geocode-cache.json");
const ENV_PATH = process.env.ENV_PATH ?? "C:/Users/USER/Desktop/Python/.env";
const MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 4);

const args = process.argv.slice(2);
const arg = (n) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : null);
const FORCE = args.includes("--force");
const ONLY = arg("only");
const ONLY_YEAR = arg("year") ? Number(arg("year")) : null;

const env = fs.readFileSync(ENV_PATH, "utf8");
const API_KEY = env.match(/^\s*OPENAI_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/m)?.[1]?.trim();
if (!API_KEY) throw new Error(`OPENAI_API_KEY not found in ${ENV_PATH}`);

const readWindowVar = (file) => {
  const s = fs.readFileSync(file, "utf8");
  return JSON.parse(s.slice(s.indexOf("{"), s.lastIndexOf("}") + 1));
};
const { years, companies } = readWindowVar(path.join(ROOT, "data", "companies.js"));
const facilities = fs.existsSync(OUT) ? readWindowVar(OUT) : {};
const geoCache = fs.existsSync(GEO_CACHE) ? JSON.parse(fs.readFileSync(GEO_CACHE, "utf8")) : {};

const num = { type: ["number", "null"] };
const share = {
  type: "object",
  additionalProperties: false,
  required: ["aPct", "bPct", "basis", "url"],
  properties: {
    aPct: num,
    bPct: num,
    basis: { type: "string", description: "근거 한 문장, 80자 이내 (예: '2025 사업보고서 공정별 조강 생산량으로 계산')" },
    url: { type: ["string", "null"] }
  }
};
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["route", "product", "plants"],
  properties: {
    route: { ...share, description: "조강 생산 공정 비중: aPct=고로(BF-BOF) %, bPct=전기로(EAF) %, 합 100" },
    product: { ...share, description: "강재 제품 비중: aPct=판재(열연·냉연·도금·후판·전기강판 등 flat) %, bPct=봉형강(철근·선재·형강·봉강·레일 등 long) %, 합 100" },
    plants: {
      type: "array",
      description: "주요 제철소/사업장 3~8곳 (조강 또는 압연 설비가 있는 곳)",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "city", "region", "country", "process", "products", "capacityMt", "url"],
        properties: {
          name: { type: "string", description: "사업장명 — 반드시 한국어 (예: 포항제철소, 크라카타우포스코)" },
          city: { type: "string", description: "영문 도시명 하나만, 괄호·슬래시 금지 (지오코딩용, 예: Pohang)" },
          region: { type: "string", description: "영문 성/주/도 (동명 도시 구분용, 예: Ba Ria-Vung Tau, Jiangsu)" },
          country: { type: "string", description: "영문 국가명" },
          process: { type: "string", enum: ["고로", "전기로", "고로+전기로", "압연"] },
          products: { type: "array", items: { type: "string", enum: ["판재", "봉형강"] } },
          capacityMt: { ...num, description: "조강 생산능력 (백만톤/년), 확인 안 되면 null" },
          url: { type: ["string", "null"] }
        }
      }
    }
  }
};

function prompt(c, year) {
  return [
    `철강사 "${c.name}" (${c.nameKo}, ${c.country}, 본사 ${c.hq}${c.ticker ? `, 상장법인 ${c.ticker} ${c.tickerNote ?? ""}` : ""})의`,
    `${year}년 기준 설비 포트폴리오를 웹검색으로 확인해 정리하라. (${year}년 조강량 ${c.years[year]?.crude ?? "?"} Mt, WSA 그룹 기준)`,
    `- route: 조강 생산 공정 비중 — 고로(BF-BOF) %와 전기로(EAF) % (합 100). 그룹 전체 기준.`,
    `- product: 강재 제품 비중 — 판재(flat) %와 봉형강(long) % (합 100). 스테인리스·강관은 형태에 따라 판재/봉형강에 포함.`,
    `- plants: ${year}년에 가동 중인 주요 제철소·사업장 3~8곳 (해외 포함, 규모 큰 순).`,
    `규칙: 회사 공시·IR·신뢰할 수 있는 기사로 확인한 값만. 비중을 공시에서 직접 못 찾으면 설비 구성(고로/전기로 생산능력)으로 계산하고 basis에 그 방법을 적어라.`,
    `그래도 판단할 수 없으면 null. 생산능력 수치를 지어내지 말 것. 출처 URL은 http(s) 실제 주소.`,
    `basis는 80자 이내 한 문장, 사업장명은 한국어(한자·가나 금지, 중국·일본 고유명사는 한글 외래어 표기), city는 영문 도시명 하나만.`
  ].join("\n");
}

// gpt-5 + 웹검색은 응답이 길어 Node fetch 기본 타임아웃(5분)에 걸릴 수 있음 → 재시도
async function generate(c, year, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      return await generateOnce(c, year);
    } catch (e) {
      if (i >= tries) throw e;
      console.log(`  재시도 ${c.id} ${year} (${i}/${tries - 1}): ${e.message}`);
    }
  }
}

async function generateOnce(c, year) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      ...(MODEL.startsWith("gpt-5") ? { reasoning: { effort: "low" } } : {}),
      tools: [{ type: "web_search" }],
      input: prompt(c, year),
      text: { format: { type: "json_schema", name: "facility_portfolio", strict: true, schema: SCHEMA } }
    })
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${body.error?.message ?? ""}`);
  const text = body.output.filter((o) => o.type === "message").flatMap((o) => o.content).find((p) => p.type === "output_text")?.text;
  const r = JSON.parse(text);
  // 비중 정규화: 합이 100이 아니면 비율 유지하며 100으로 맞춤, 한쪽만 있으면 나머지 계산
  for (const k of ["route", "product"]) {
    const s = r[k];
    if (s.aPct != null && s.bPct == null) s.bPct = 100 - s.aPct;
    if (s.bPct != null && s.aPct == null) s.aPct = 100 - s.bPct;
    if (s.aPct != null && s.bPct != null && s.aPct + s.bPct > 0 && Math.abs(s.aPct + s.bPct - 100) > 0.5) {
      const t = s.aPct + s.bPct;
      s.aPct = Math.round((s.aPct / t) * 1000) / 10;
      s.bPct = Math.round((100 - s.aPct) * 10) / 10;
    }
    s.url = cleanUrl(s.url);
  }
  r.plants = r.plants.map((p) => ({ ...p, url: cleanUrl(p.url) }));
  return {
    route: { bfPct: r.route.aPct, eafPct: r.route.bPct, basis: r.route.basis, url: r.route.url },
    product: { flatPct: r.product.aPct, longPct: r.product.bPct, basis: r.product.basis, url: r.product.url },
    plants: r.plants,
    model: MODEL,
    generatedAt: new Date().toISOString().slice(0, 10)
  };
}

function cleanUrl(u) {
  if (!u || !/^https?:\/\//.test(u)) return null;
  try {
    const url = new URL(u);
    url.searchParams.delete("utm_source");
    return url.toString();
  } catch {
    return null;
  }
}

// ---------- 지오코딩 (Nominatim: 1초 1건, User-Agent 필수) ----------
let lastGeo = 0;
async function geocode(city, region, country) {
  const key = `${city}|${region}|${country}`;
  if (geoCache[key]) return geoCache[key];
  if (key in geoCache && geoCache[`${key}|fallback`] !== undefined) return geoCache[`${key}|fallback`];
  const wait = 1100 - (Date.now() - lastGeo);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastGeo = Date.now();
  const q = async (params) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&${params}`, {
      headers: { "User-Agent": "SteelTop50Dashboard/1.0 (internal research)" }
    });
    return res.ok ? res.json() : [];
  };
  // 도시+성/주+국가 → 도시+국가 → 띄어쓰기 복원(GPT가 "OuroBranco"처럼 붙여 씀) → 자유 검색
  const spaced = city.replace(/([a-z])([A-Z])/g, "$1 $2");
  const attempts = [
    `city=${encodeURIComponent(city)}&state=${encodeURIComponent(region)}&country=${encodeURIComponent(country)}`,
    `city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`,
    ...(spaced !== city ? [`city=${encodeURIComponent(spaced)}&country=${encodeURIComponent(country)}`] : []),
    `q=${encodeURIComponent(`${spaced}, ${region}, ${country}`)}`
  ];
  let j = [];
  for (const [i, a] of attempts.entries()) {
    if (i) await new Promise((r) => setTimeout(r, 1100));
    j = await q(a);
    if (j[0]) break;
  }
  if (key in geoCache) {
    // 예전에 실패한 항목 재시도 결과는 별도 키에 저장
    geoCache[`${key}|fallback`] = j[0] ? { lat: Number(Number(j[0].lat).toFixed(3)), lng: Number(Number(j[0].lon).toFixed(3)) } : null;
    fs.writeFileSync(GEO_CACHE, JSON.stringify(geoCache, null, 1));
    return geoCache[`${key}|fallback`];
  }
  geoCache[key] = j[0] ? { lat: Number(Number(j[0].lat).toFixed(3)), lng: Number(Number(j[0].lon).toFixed(3)) } : null;
  fs.writeFileSync(GEO_CACHE, JSON.stringify(geoCache, null, 1));
  return geoCache[key];
}

// ---------- 실행 ----------
const save = () =>
  fs.writeFileSync(
    OUT,
    "// 자동 생성 파일 — scripts/fetch_facilities.mjs (OpenAI GPT + 웹검색, Nominatim 지오코딩). 직접 수정 금지.\n" +
      "window.STEEL_FACILITIES = " + JSON.stringify(facilities, null, 2) + ";\n",
    "utf8"
  );

const jobs = [];
for (const c of companies) {
  if (ONLY && c.id !== ONLY) continue;
  for (const y of years) {
    if (ONLY_YEAR && y !== ONLY_YEAR) continue;
    if (!FORCE && facilities[c.id]?.[y]) continue;
    jobs.push([c, y]);
  }
}
console.log(`생성 대상 ${jobs.length}건 (model: ${MODEL})`);

let failed = 0;
const done = [];
async function worker() {
  while (jobs.length) {
    const [c, y] = jobs.shift();
    try {
      const r = await generate(c, y);
      (facilities[c.id] ??= {})[y] = r;
      done.push(r);
      save();
      console.log(`✓ ${c.id} ${y} BF ${r.route.bfPct}/EAF ${r.route.eafPct} · 판재 ${r.product.flatPct}/봉형강 ${r.product.longPct} · 사업장 ${r.plants.length}`);
    } catch (e) {
      failed += 1;
      console.log(`✗ ${c.id} ${y}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// 지오코딩은 순차 (Nominatim 정책)
let geoMiss = 0;
for (const byYear of Object.values(facilities)) {
  for (const f of Object.values(byYear)) {
    for (const p of f.plants) {
      if (p.lat != null) continue;
      const g = await geocode(p.city, p.region, p.country);
      if (g) Object.assign(p, g);
      else geoMiss += 1;
    }
  }
}
save();
console.log(`완료. 실패 ${failed}건, 지오코딩 실패 ${geoMiss}곳 → ${OUT}`);
process.exitCode = failed ? 1 : 0;
