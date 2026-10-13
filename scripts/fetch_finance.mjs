// Yahoo Finance 재무지표를 data/companies.js 에 채운다.
// 실행 순서: python scripts/build_data.py → node scripts/fetch_finance.mjs  (= npm run data)
//
// 정의 (PRD §4.1)
//   매출액   = 회계연도 totalRevenue(현지통화) × 오늘자 환율 → 원화 (조원, revenueKrw)
//   EBITDA % = EBITDA / totalRevenue × 100
//   PBR      = 회계연도 말 시가총액 / 자기자본(stockholdersEquity)
//              시가총액 = 회계연도 말 종가 × 발행주식수 (이후 액면분할 보정, 통화 환산)
//   DPS      = 회계기간 중 배당락일이 속한 주당 배당금 합계 (거래 통화, 분할 소급 반영) × 오늘자 환율 → 원 (dpsKrw)
//   환율     = 스크립트 실행일의 Yahoo Finance 시세 ({CCY}KRW=X), meta.fx 에 기록 → 화면 상단에 표시
// 연도 매핑: 종료월 6~12월 → FY Y = Y년 종료 (예: 09 → Y-1.10 ~ Y.9), 1~5월 → FY Y = Y+1년 종료 (예: 03 → Y.4 ~ Y+1.3)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YahooFinance from "yahoo-finance2";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "data", "companies.js");
const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

const src = fs.readFileSync(OUT, "utf8");
const data = JSON.parse(src.slice(src.indexOf("{"), src.lastIndexOf("}") + 1));

const DAY = 86400_000;
const fxCache = new Map();

// 1 단위 현지통화 → USD 의 기간 평균 (월봉 종가 평균)
async function fxToUsd(ccy, start, end) {
  if (ccy === "USD") return 1;
  const key = `${ccy}|${start.toISOString()}|${end.toISOString()}`;
  if (!fxCache.has(key)) {
    const r = await yf.chart(`${ccy}=X`, { period1: start, period2: end, interval: "1mo" });
    const closes = r.quotes.map((q) => q.close).filter((v) => v != null);
    // USDKRW=X 는 1 USD 당 현지통화 → 역수
    fxCache.set(key, 1 / (closes.reduce((a, b) => a + b, 0) / closes.length));
  }
  return fxCache.get(key);
}

// 오늘자 환율: 1 단위 통화 → 원
const krwRates = { KRW: 1 };
async function krwRate(ccy) {
  if (!(ccy in krwRates)) {
    const q = await yf.quote(ccy === "USD" ? "KRW=X" : `${ccy}KRW=X`);
    if (q?.regularMarketPrice) {
      krwRates[ccy] = q.regularMarketPrice;
    } else {
      // 직접 환율이 없는 통화(VND, RUB 등)는 USD 경유: (KRW/USD) ÷ (CCY/USD)
      const usdKrw = await krwRate("USD");
      const usdCcy = (await yf.quote(`${ccy}=X`))?.regularMarketPrice;
      if (!usdCcy) throw new Error(`환율 없음: ${ccy}`);
      krwRates[ccy] = usdKrw / usdCcy;
    }
  }
  return krwRates[ccy];
}

// 회계연도 말 종가 + 이후 액면분할 누적배율
async function priceAtFyEnd(ticker, fyEndDate) {
  const r = await yf.chart(ticker, {
    period1: new Date(fyEndDate - 14 * DAY),
    period2: new Date(),
    interval: "1d",
    events: "split"
  });
  const before = r.quotes.filter((q) => q.date <= new Date(fyEndDate.getTime() + DAY) && q.close != null);
  if (!before.length) return null;
  const splits = (r.events?.splits ?? []).filter((s) => s.date > fyEndDate);
  const splitFactor = splits.reduce((f, s) => f * (s.numerator / s.denominator), 1);
  return { close: before.at(-1).close, splitFactor, currency: r.meta.currency };
}

function fyRange(year, fyEnd) {
  const endMonth = Number(fyEnd); // 3 or 12
  const endYear = endMonth >= 6 ? year : year + 1;
  const end = new Date(Date.UTC(endYear, endMonth, 0)); // 해당 월 말일
  const start = new Date(Date.UTC(endYear - 1, endMonth, 1));
  return { start, end };
}

// 배당 이력 (배당락일 기준, 거래 통화)
async function dividends(ticker) {
  const r = await yf.chart(ticker, { period1: "2022-01-01", period2: new Date(), interval: "1mo", events: "div|split" });
  const splits = r.events?.splits ?? [];
  // Yahoo 버그 보정: 분할일과 같은 날 배당락된 배당금은 분할 소급이 안 돼 있음 (예: 5401.T 2025-09-29)
  const list = (r.events?.dividends ?? []).map((d) => {
    const s = splits.find((s) => s.date.toISOString().slice(0, 10) === d.date.toISOString().slice(0, 10));
    return s ? { ...d, amount: d.amount / (s.numerator / s.denominator) } : d;
  });
  return { list, currency: r.meta.currency };
}

const sameMonth = (a, b) => a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth();

async function fillCompany(c) {
  if (!c.ticker) return "비상장";
  const quote = await yf.quote(c.ticker);
  const finCcy = quote.financialCurrency ?? quote.currency;
  const ts = await yf.fundamentalsTimeSeries(c.ticker, {
    period1: "2022-06-01",
    type: "annual",
    module: "all"
  });

  const divs = await dividends(c.ticker);
  const log = [];
  for (const y of data.years) {
    const d = c.years[y];
    const { start, end } = fyRange(y, c.fyEnd);
    const row = ts.find((r) => r.date && sameMonth(new Date(r.date), end));
    d.fyLabel = c.fyEnd === "12" ? `FY${y}` : `FY${y} (${start.getUTCFullYear()}.${start.getUTCMonth() + 1}~${end.getUTCFullYear()}.${end.getUTCMonth() + 1})`;
    if (!row || !row.totalRevenue) {
      log.push(`${y}:없음`);
      continue;
    }
    // 주당 배당금: 배당 미지급 연도는 0
    const dps = divs.list
      .filter((v) => v.date >= start && v.date <= new Date(end.getTime() + DAY))
      .reduce((sum, v) => sum + v.amount, 0);
    d.dps = round(dps, 4);
    d.dpsCcy = divs.currency;
    d.dpsKrw = round(dps * (await krwRate(divs.currency)), 1);

    d.finCcy = finCcy;
    d.revenueLocal = row.totalRevenue;
    d.revenueKrw = round((row.totalRevenue * (await krwRate(finCcy))) / 1e12, 2);
    const ebitda = row.EBITDA ?? row.normalizedEBITDA;
    d.ebitdaPct = ebitda == null ? null : round((ebitda / row.totalRevenue) * 100, 1);

    // 전망 모델용: 영업이익·순이익·배당총액·배당성향·주식수 (현지통화)
    const opInc = row.operatingIncome ?? row.EBIT ?? null;
    d.opIncomeLocal = opInc;
    d.opMarginPct = opInc == null ? null : round((opInc / row.totalRevenue) * 100, 1);
    d.netIncomeLocal = row.netIncomeCommonStockholders ?? row.netIncome ?? null;
    d.dividendsPaidLocal = row.cashDividendsPaid != null ? -row.cashDividendsPaid : null;
    d.payoutPct =
      d.netIncomeLocal > 0 && d.dividendsPaidLocal != null ? round((d.dividendsPaidLocal / d.netIncomeLocal) * 100, 1) : null;

    const equity = row.stockholdersEquity ?? row.commonStockEquity;
    const shares = row.ordinarySharesNumber ?? row.shareIssued;
    d.shares = shares ?? null;
    const px = equity && shares ? await priceAtFyEnd(c.ticker, end) : null;
    if (px) {
      // 시가총액(가격 통화) → 재무 통화 환산 (회계연도 말 월 기준)
      const pxFx = px.currency === finCcy ? 1
        : (await fxToUsd(px.currency, new Date(end.getTime() - 31 * DAY), new Date(end.getTime() + DAY))) /
          (await fxToUsd(finCcy, new Date(end.getTime() - 31 * DAY), new Date(end.getTime() + DAY)));
      // Yahoo 종가는 분할 소급 반영. 과거 주식수도 소급 수정된 경우(현재 주식수와 비슷)엔 분할 배율을 곱하지 않음
      const cur = quote.sharesOutstanding;
      const restated = !cur || Math.abs(Math.log(shares / cur)) < Math.abs(Math.log((shares * px.splitFactor) / cur));
      const splitFactor = restated ? 1 : px.splitFactor;
      // ADR 은 1 ADR = adrRatio 주 → 주식수를 ADR 기준으로 환산
      const mcap = px.close * splitFactor * (shares / (c.adrRatio ?? 1)) * pxFx;
      d.pbr = round(mcap / equity, 2);
    }
    log.push(`${y}:✓`);
  }
  return `${finCcy} ${log.join(" ")}`;
}

const round = (v, n) => Math.round(v * 10 ** n) / 10 ** n;

for (const c of data.companies) {
  try {
    console.log(c.name.padEnd(28), c.ticker ?? "-", await fillCompany(c));
  } catch (e) {
    console.log(c.name.padEnd(28), c.ticker, "실패:", e.message.split("\n")[0]);
  }
}

data.meta.asOf = new Date().toISOString().slice(0, 10);
data.meta.fx = {
  date: data.meta.asOf,
  base: "KRW",
  rates: Object.fromEntries(Object.entries(krwRates).filter(([k]) => k !== "KRW").map(([k, v]) => [k, round(v, 4)])),
  source: "Yahoo Finance"
};
data.meta.fxNote = "매출액·주당배당금: 현지통화 × 기준일 환율(원화 환산) · PBR: 회계연도 말 종가 기준";

fs.writeFileSync(
  OUT,
  "// 자동 생성 파일 — npm run data 로 재생성. 직접 수정 금지.\n" +
    "window.STEEL_DATA = " + JSON.stringify(data, null, 2) + ";\n",
  "utf8"
);
console.log("저장:", OUT);
