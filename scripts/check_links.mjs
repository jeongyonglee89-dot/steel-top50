// GPT가 만든 출처 링크(insights·facilities의 url)를 실제로 열어 보고, 확실히 깨진 링크를 정리한다.
//   - 확실히 깨짐 = HTTP 404/410 또는 도메인 없음(ENOTFOUND)  ※ 403(봇 차단)·인증서 오류는 브라우저에선 열리는 경우가 많아 정상 취급
//   - 보도자료(news): 링크가 깨졌으면 항목 삭제 (존재하지 않는 보도자료일 가능성이 큼)
//   - 그 외 항목: 본문은 유지, url → null, urlBroken: true  → 화면에 "출처 확인 불가"
// 결과는 scripts/.link-cache.json 에 캐시 (재실행 시 새 링크만 확인, --recheck 로 전체 재확인)
//
// 실행: node scripts/check_links.mjs   (fetch_insights / fetch_facilities / hangulize 이후)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, "scripts", ".link-cache.json");
const RECHECK = process.argv.includes("--recheck");
const FILES = [
  { file: path.join(ROOT, "data", "insights.js"), name: "STEEL_INSIGHTS", header: "// 자동 생성 파일 — fetch_insights.mjs + hangulize.mjs + check_links.mjs. 직접 수정 금지.\n" },
  { file: path.join(ROOT, "data", "facilities.js"), name: "STEEL_FACILITIES", header: "// 자동 생성 파일 — fetch_facilities.mjs + hangulize.mjs + check_links.mjs. 직접 수정 금지.\n" }
];
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";

const readWindowVar = (f) => {
  const s = fs.readFileSync(f, "utf8");
  return JSON.parse(s.slice(s.indexOf("{"), s.lastIndexOf("}") + 1));
};
const cache = !RECHECK && fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, "utf8")) : {};
const docs = FILES.map((f) => ({ ...f, data: readWindowVar(f.file) }));

const urls = new Set();
const collect = (o) => {
  if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) (k === "url" && typeof v === "string" ? urls.add(v) : collect(v));
};
docs.forEach((d) => collect(d.data));
const todo = [...urls].filter((u) => !(u in cache));
console.log(`링크 ${urls.size}개 (새로 확인 ${todo.length}개)`);

async function check(u) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 15000);
      const r = await fetch(u, { method, redirect: "follow", signal: ctl.signal, headers: { "User-Agent": UA } });
      clearTimeout(t);
      if (method === "HEAD" && [400, 403, 405].includes(r.status)) continue; // HEAD 미지원 서버 → GET 재시도
      return r.status;
    } catch (e) {
      if (method === "GET") return `ERR:${e.name === "AbortError" ? "timeout" : e.cause?.code ?? e.message}`;
    }
  }
}
let i = 0;
await Promise.all(
  Array.from({ length: 16 }, async () => {
    while (i < todo.length) {
      const u = todo[i++];
      cache[u] = await check(u);
    }
  })
);
fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1));

const broken = (u) => [404, 410].includes(cache[u]) || cache[u] === "ERR:ENOTFOUND";
let droppedNews = 0, unlinked = 0;
function clean(node) {
  if (Array.isArray(node)) {
    return node
      .filter((x) => !(x && typeof x === "object" && "title" in x && "date" in x && x.url && broken(x.url) && ++droppedNews))
      .map(clean);
  }
  if (node && typeof node === "object") {
    const out = Object.fromEntries(Object.entries(node).map(([k, v]) => [k, clean(v)]));
    if (typeof out.url === "string" && broken(out.url)) {
      out.url = null;
      out.urlBroken = true;
      unlinked++;
    }
    return out;
  }
  return node;
}
for (const d of docs) {
  fs.writeFileSync(d.file, d.header + `window.${d.name} = ` + JSON.stringify(clean(d.data), null, 2) + ";\n", "utf8");
}
const ok = [...urls].filter((u) => typeof cache[u] === "number" && cache[u] < 400).length;
console.log(`정상 ${ok}/${urls.size} · 깨진 보도자료 삭제 ${droppedNews}건 · 링크 제거(출처 확인 불가) ${unlinked}건`);
