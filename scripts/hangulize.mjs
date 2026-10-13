// data/insights.js · data/facilities.js 의 문자열 중 한자(및 일본어 가나)가 들어간 것을 한글로 바꾼다.
// 중국·일본 지명/회사명은 한국어 외래어 표기(예: 鞍钢 → 안강, 湛江 → 잔장, 日鉄 → 닛테쓰)로, 일반 단어는 한국어 뜻으로.
// OpenAI(gpt-5-mini, 웹검색 없음) 사용, 결과는 scripts/.hangul-cache.json 에 캐시 → 재실행 시 새 문자열만 변환.
//
// 실행: node scripts/hangulize.mjs   (fetch_insights / fetch_facilities 이후)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, "scripts", ".hangul-cache.json");
const ENV_PATH = process.env.ENV_PATH ?? "C:/Users/USER/Desktop/Python/.env";
const MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";
const FILES = [
  { file: path.join(ROOT, "data", "insights.js"), name: "STEEL_INSIGHTS", header: "// 자동 생성 파일 — scripts/fetch_insights.mjs (OpenAI GPT + 웹검색) + hangulize.mjs. 직접 수정 금지.\n" },
  { file: path.join(ROOT, "data", "facilities.js"), name: "STEEL_FACILITIES", header: "// 자동 생성 파일 — scripts/fetch_facilities.mjs (OpenAI GPT + 웹검색, Nominatim 지오코딩) + hangulize.mjs. 직접 수정 금지.\n" }
];
// 한자(CJK 통합·확장A·호환) + 가나
const FOREIGN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff]/;
// 변환 대상 필드 (URL·영문 도시명 등은 건드리지 않음)
const SKIP_KEYS = new Set(["url", "city", "region", "country", "date", "model", "generatedAt"]);

const API_KEY = fs.readFileSync(ENV_PATH, "utf8").match(/^\s*OPENAI_API_KEY\s*=\s*["']?([^"'\r\n]+)/m)?.[1]?.trim();
if (!API_KEY) throw new Error(`OPENAI_API_KEY not found in ${ENV_PATH}`);

const readWindowVar = (file) => {
  const s = fs.readFileSync(file, "utf8");
  return JSON.parse(s.slice(s.indexOf("{"), s.lastIndexOf("}") + 1));
};
const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, "utf8")) : {};

// 객체를 돌며 대상 문자열 수집/치환
function walk(node, fn, key = null) {
  if (typeof node === "string") return SKIP_KEYS.has(key) ? node : fn(node);
  if (Array.isArray(node)) return node.map((v) => walk(v, fn, key));
  if (node && typeof node === "object") return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v, fn, k)]));
  return node;
}

const docs = FILES.map((f) => ({ ...f, data: readWindowVar(f.file) }));
const todo = new Set();
for (const d of docs) walk(d.data, (s) => (FOREIGN.test(s) && !cache[s] && todo.add(s), s));
console.log(`변환 대상 ${todo.size}건 (캐시 ${Object.keys(cache).length}건)`);

const SCHEMA = {
  type: "object", additionalProperties: false, required: ["items"],
  properties: { items: { type: "array", items: { type: "object", additionalProperties: false, required: ["i", "ko"], properties: { i: { type: "integer" }, ko: { type: "string" } } } } }
};

async function translate(batch) {
  const input = [
    "철강 대시보드 문구다. 각 문자열의 한자(중국어 간체·번체, 일본어 한자)와 일본어 가나를 모두 한글로 바꿔라.",
    "- 중국·일본의 지명·회사명·제철소명은 한국어 외래어 표기법의 현지 발음으로 (예: 鞍钢→안강, 湛江→잔장, 宝武→바오우, 河钢乐亭→허강 러팅, 日鉄ステンレス→닛테쓰 스테인리스).",
    "- 일반 단어·용어는 한국어 뜻으로 (예: 削減→감축, 竪炉→샤프트로, 无缝→무계목, 双碳→탄소중립·탄소피크).",
    "- 괄호 안에 한자 원문만 있고 앞에 이미 한글 표기가 있으면 괄호째 삭제 (예: '스자좡 시강 신구(石钢新区)' → '스자좡 시강 신구').",
    "- 영어·숫자·기호·나머지 한글은 그대로. 의미를 바꾸거나 내용을 더하지 말 것. 결과에 한자·가나가 하나도 남으면 안 됨.",
    "",
    ...batch.map((s, i) => `${i}\t${s}`)
  ].join("\n");
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, input, text: { format: { type: "json_schema", name: "hangul", strict: true, schema: SCHEMA } } })
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${body.error?.message ?? ""}`);
  const text = body.output.filter((o) => o.type === "message").flatMap((o) => o.content).find((p) => p.type === "output_text").text;
  return JSON.parse(text).items;
}

const list = [...todo];
const BATCH = 30;
const batches = [];
for (let i = 0; i < list.length; i += BATCH) batches.push(list.slice(i, i + BATCH));
let bad = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (batches.length) {
      const batch = batches.shift();
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const items = await translate(batch);
          for (const { i, ko } of items) {
            if (batch[i] == null) continue;
            if (FOREIGN.test(ko)) { bad++; continue; } // 여전히 한자가 있으면 저장 안 함 → 재실행 시 재시도
            cache[batch[i]] = ko;
          }
          fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1));
          console.log(`✓ ${batch.length}건`);
          break;
        } catch (e) {
          console.log(`  재시도 ${attempt}: ${e.message}`);
        }
      }
    }
  })
);

let remaining = 0;
for (const d of docs) {
  const out = walk(d.data, (s) => {
    if (!FOREIGN.test(s)) return s;
    if (cache[s]) return cache[s];
    remaining++;
    return s;
  });
  fs.writeFileSync(d.file, d.header + `window.${d.name} = ` + JSON.stringify(out, null, 2) + ";\n", "utf8");
}
console.log(`완료. 한자 남은 문자열 ${remaining}건${bad ? ` (변환 결과에 한자가 남아 거부 ${bad}건 — 재실행)` : ""}`);
process.exitCode = remaining ? 1 : 0;
