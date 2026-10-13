// OpenAI(GPT + 웹검색)로 회사별·연도별 인사이트(주요제품/전략/보도자료/이슈)를 생성해 data/insights.js 에 저장한다.
// API 키는 C:\Users\USER\Desktop\Python\.env 의 OPENAI_API_KEY 를 읽는다 (브라우저 코드에는 절대 넣지 않음).
//
// 실행:  node scripts/fetch_insights.mjs                 # 없는 항목만 생성
//        node scripts/fetch_insights.mjs --only posco --year 2025 --force
// 환경변수: OPENAI_MODEL (기본 gpt-5-mini), ENV_PATH (.env 경로)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "data", "insights.js");
const ENV_PATH = process.env.ENV_PATH ?? "C:/Users/USER/Desktop/Python/.env";
const MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";
const CONCURRENCY = 4;

// ---------- 인자 ----------
const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};
const FORCE = args.includes("--force");
const ONLY = arg("only");
const ONLY_YEAR = arg("year") ? Number(arg("year")) : null;

// ---------- .env ----------
function readKey() {
  const env = fs.readFileSync(ENV_PATH, "utf8");
  const m = env.match(/^\s*OPENAI_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/m);
  if (!m) throw new Error(`OPENAI_API_KEY not found in ${ENV_PATH}`);
  return m[1].trim();
}
const API_KEY = readKey();

// ---------- 데이터 ----------
const readWindowVar = (file) => {
  const s = fs.readFileSync(file, "utf8");
  return JSON.parse(s.slice(s.indexOf("{"), s.lastIndexOf("}") + 1));
};
const { years, companies } = readWindowVar(path.join(ROOT, "data", "companies.js"));
const insights = fs.existsSync(OUT) ? readWindowVar(OUT) : {};

// ---------- OpenAI ----------
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["products", "strategy", "news", "issues"],
  properties: {
    products: { type: "array", items: { type: "string" }, description: "주요 제품 포트폴리오 (3~5개)" },
    strategy: { type: "array", items: { type: "string" }, description: "해당 연도 핵심 전략 (3~4개)" },
    news: {
      type: "array",
      description: "해당 연도 주요 보도자료/뉴스 (3~4개, 날짜순)",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["date", "title", "url"],
        properties: {
          date: { type: "string", description: "YYYY-MM 또는 YYYY-MM-DD" },
          title: { type: "string", description: "한국어 한 줄 요약" },
          url: { type: "string" }
        }
      }
    },
    issues: { type: "array", items: { type: "string" }, description: "해당 연도 주요 이슈/리스크 (2~4개)" }
  }
};

function prompt(c, year) {
  return [
    `철강사 "${c.name}" (${c.nameKo}, ${c.country}, 본사 ${c.hq}${c.ticker ? `, 상장 티커 ${c.ticker}` : ", 비상장"})에 대해`,
    `${year}년 1월 1일 ~ ${year}년 12월 31일 기간 기준으로 정리하라.`,
    `- products: 주요 제품 포트폴리오 (예: 자동차강판, 후판, 전기강판 등)`,
    `- strategy: ${year}년 당시 회사가 추진한 핵심 전략 (투자, 탈탄소, M&A, 해외진출 등)`,
    `- news: ${year}년에 나온 실제 보도자료/주요 뉴스. 웹검색으로 확인한 것만, 출처 URL 필수. ${year}년 밖의 기사는 넣지 말 것.`,
    `- issues: ${year}년 주요 이슈·리스크 (실적, 무역규제, 노사, 사고, 지배구조 등)`,
    `규칙: 한국어, 한자·일본어 가나 사용 금지(중국·일본 고유명사는 한글 외래어 표기), 각 항목 한 문장(60자 이내). 확인되지 않은 내용은 쓰지 말고 항목 수를 줄일 것. 수치를 지어내지 말 것.`
  ].join("\n");
}

async function generate(c, year) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      tools: [{ type: "web_search" }],
      input: prompt(c, year),
      text: { format: { type: "json_schema", name: "company_insight", strict: true, schema: SCHEMA } }
    })
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${body.error?.message ?? JSON.stringify(body).slice(0, 200)}`);
  const text = body.output
    .filter((o) => o.type === "message")
    .flatMap((o) => o.content)
    .find((p) => p.type === "output_text")?.text;
  const parsed = JSON.parse(text);
  // 연도 밖 뉴스 제거 (모델이 규칙을 어긴 경우 대비)
  parsed.news = parsed.news
    .filter((n) => n.date.startsWith(String(year)) && /^https?:\/\//.test(n.url))
    .map((n) => ({ ...n, url: cleanUrl(n.url) }));
  for (const k of ["products", "strategy", "issues"]) parsed[k] = parsed[k].map(splitCitation);
  return { ...parsed, model: MODEL, generatedAt: new Date().toISOString().slice(0, 10) };
}

// 웹검색 인용 "문장. ([domain](url))" → { text, url }
function splitCitation(str) {
  const urls = [...str.matchAll(/\[[^\]]*\]\((https?:[^)\s]+)\)/g)].map((m) => cleanUrl(m[1]));
  const text = str.replace(/\s*\(?\[[^\]]*\]\(https?:[^)\s]+\)\)?/g, "").trim();
  return { text, url: urls[0] ?? null };
}

function cleanUrl(u) {
  try {
    const url = new URL(u);
    url.searchParams.delete("utm_source");
    return url.toString();
  } catch {
    return u;
  }
}

// ---------- 실행 ----------
const jobs = [];
for (const c of companies) {
  if (ONLY && c.id !== ONLY) continue;
  for (const y of years) {
    if (ONLY_YEAR && y !== ONLY_YEAR) continue;
    if (!FORCE && insights[c.id]?.[y]) continue;
    jobs.push([c, y]);
  }
}
console.log(`생성 대상 ${jobs.length}건 (model: ${MODEL})`);

const save = () =>
  fs.writeFileSync(
    OUT,
    "// 자동 생성 파일 — scripts/fetch_insights.mjs (OpenAI GPT + 웹검색). 직접 수정 금지.\n" +
      "window.STEEL_INSIGHTS = " + JSON.stringify(insights, null, 2) + ";\n",
    "utf8"
  );

let failed = 0;
async function worker() {
  while (jobs.length) {
    const [c, y] = jobs.shift();
    try {
      const r = await generate(c, y);
      (insights[c.id] ??= {})[y] = r;
      save(); // 중간 저장 — 실패해도 진행분 보존
      console.log(`✓ ${c.id} ${y} (뉴스 ${r.news.length}건)`);
    } catch (e) {
      failed += 1;
      console.log(`✗ ${c.id} ${y}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
save();
console.log(`완료. 실패 ${failed}건 → ${OUT}`);
process.exitCode = failed ? 1 : 0;
