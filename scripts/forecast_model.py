"""2026E~2028E 전망 모델 — FRED·OECD 거시지표 + 패널 회귀(기업 고정효과), 추정기간 최근 3년(2023~2025).

실행: python scripts/forecast_model.py   (data/companies.js 필요 → npm run data 먼저)
산출: data/forecast.js (대시보드 전망 탭), forecast/02_전망모델_결과.md (계수·R²·가정)

모델 (i = 회사, t = 연도, α_i = 회사 고정효과)
  M1 조강 증가율(%)   = a + β1·GDP성장률(본사국) + β2·중국 더미          (풀링 OLS — 고정효과를 쓰면 M&A 등 일회성 성장이 매년 반복됨)
  M2 EBITDA 마진(%)   = α_i + β1·철광석가격 변화율 + β2·GDP성장률
  M3 영업이익률(%)    = α_i + β1·철광석가격 변화율 + β2·GDP성장률
  M4 PBR(배)          = α_i + β1·EBITDA 마진 + β2·GDP성장률
  매출                = 전년 × (1 + 조강 증가율)   (가격 효과는 마진 모델의 철광석 계수로 반영)
  DPS                 = 3년 평균 배당성향 × 전망 순이익 / 주식수   (규칙 기반, 회귀 아님)
거시변수
  FRED  PIORECRUSDM  철광석 가격 (IMF, 연평균 변화율) — 글로벌 철강 경기 대용
  OECD  Economic Outlook 119, GDPV_ANNPCT  실질 GDP 성장률 (2026·2027 전망 포함)
  검토 후 제외: FRED WPU101(미국 철강 PPI — 2025~26 관세로 미국만 급등, 글로벌 대용 부적합),
               FRED GS10(미국 10년물 — 계수 부호가 이론과 반대(+), 2023~25 금리 상승과 재평가가 겹친 우연)
표준 라이브러리만 사용 (pandas/statsmodels 미설치 환경).
"""
import csv
import io
import json
import math
import statistics
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EST_YEARS = [2023, 2024, 2025]
FC_YEARS = [2026, 2027, 2028]
HIST_START = 2012
UA = {"User-Agent": "SteelTop50Dashboard/1.0 (internal research)"}

FRED = {"ore": "PIORECRUSDM"}
OECD_URL = (
    "https://sdmx.oecd.org/public/rest/data/OECD.ECO.MAD,DSD_EO@DF_EO,1.5/"
    "{areas}.GDPV_ANNPCT.A?startPeriod={start}&format=csvfilewithlabels"
)
# 본사 국가(WSA 표기) → OECD EO 지역 코드. EO에 없는 국가는 가장 가까운 집계 지역으로 대체
COUNTRY_AREA = {
    "China": "CHN", "Japan": "JPN", "South Korea": "KOR", "India": "IND", "United States": "USA",
    "Germany": "DEU", "Brazil": "BRA", "Türkiye": "TUR", "Russia": "RUS", "Argentina": "ARG",
    "Luxembourg": "W",            # ArcelorMittal: 글로벌 사업 → 세계
    "Viet Nam": "DAE",            # Dynamic Asian economies
    "Taiwan, China": "DAE",
    "Iran": "OIL_SAU_O",          # Other oil producers
}


# ---------------------------------------------------------------- 데이터 수집
def get(url, retries=3):
    last = None
    for _ in range(retries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return r.read().decode("utf-8-sig")
        except Exception as e:  # noqa: BLE001 — 네트워크 일시 오류 재시도
            last = e
    raise last


def fred_annual(series):
    """월/일 시계열 → 연평균. 올해는 YTD 평균과 관측 개월 수."""
    rows = csv.reader(io.StringIO(get(f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series}")))
    next(rows)
    by_year = {}
    for d, v in rows:
        if v in ("", "."):
            continue
        by_year.setdefault(int(d[:4]), []).append(float(v))
    return {y: sum(v) / len(v) for y, v in by_year.items() if y >= HIST_START - 1}, {y: len(v) for y, v in by_year.items()}


def oecd_gdp(areas):
    text = get(OECD_URL.format(areas="+".join(sorted(areas)), start=HIST_START))
    out = {}
    for r in csv.DictReader(io.StringIO(text)):
        out.setdefault(r["REF_AREA"], {})[int(r["TIME_PERIOD"])] = float(r["OBS_VALUE"])
    return out, text


def read_window_var(path):
    s = Path(path).read_text(encoding="utf-8")
    return json.loads(s[s.index("{"): s.rindex("}") + 1])


# ---------------------------------------------------------------- 회귀 (고정효과, within 변환)
def solve(A, b):
    """작은 선형계 Ax=b (가우스-조던)."""
    n = len(A)
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(M[r][c]))
        if abs(M[p][c]) < 1e-12:
            raise ValueError("특이행렬 — 설명변수가 공선적")
        M[c], M[p] = M[p], M[c]
        piv = M[c][c]
        M[c] = [x / piv for x in M[c]]
        for r in range(n):
            if r != c and M[r][c]:
                f = M[r][c]
                M[r] = [x - f * y for x, y in zip(M[r], M[c])]
    return [M[i][n] for i in range(n)]


def inverse(A):
    n = len(A)
    cols = [solve(A, [1.0 if i == j else 0.0 for i in range(n)]) for j in range(n)]
    return [[cols[j][i] for j in range(n)] for i in range(n)]


def fe_ols(obs, xnames):
    """obs: [{firm, y, x:{name:value}}]. 회사별 관측 2개 이상만 사용."""
    by_firm = {}
    for o in obs:
        by_firm.setdefault(o["firm"], []).append(o)
    by_firm = {f: v for f, v in by_firm.items() if len(v) >= 2}
    rows = [o for v in by_firm.values() for o in v]
    k, n, N = len(xnames), len(rows), len(by_firm)
    mean = {f: (statistics.fmean(o["y"] for o in v), [statistics.fmean(o["x"][x] for o in v) for x in xnames]) for f, v in by_firm.items()}
    Xd = [[o["x"][x] - mean[o["firm"]][1][j] for j, x in enumerate(xnames)] for o in rows]
    yd = [o["y"] - mean[o["firm"]][0] for o in rows]
    XtX = [[sum(r[a] * r[b] for r in Xd) for b in range(k)] for a in range(k)]
    Xty = [sum(r[a] * y for r, y in zip(Xd, yd)) for a in range(k)]
    beta = solve(XtX, Xty)
    resid = [y - sum(b * x for b, x in zip(beta, r)) for r, y in zip(Xd, yd)]
    ssr = sum(e * e for e in resid)
    sst_within = sum(y * y for y in yd)
    ybar = statistics.fmean(o["y"] for o in rows)
    sst_total = sum((o["y"] - ybar) ** 2 for o in rows)
    dof = n - k - N
    sigma2 = ssr / dof if dof > 0 else float("nan")
    inv = inverse(XtX)
    se = [math.sqrt(sigma2 * inv[j][j]) if dof > 0 else float("nan") for j in range(k)]
    alpha = {f: m[0] - sum(b * xm for b, xm in zip(beta, m[1])) for f, m in mean.items()}
    r2 = 1 - ssr / sst_total if sst_total else float("nan")
    r2_within = 1 - ssr / sst_within if sst_within else float("nan")
    adj_r2 = 1 - (1 - r2) * (n - 1) / dof if dof > 0 else float("nan")
    return {
        "beta": dict(zip(xnames, beta)), "se": dict(zip(xnames, se)),
        "t": {x: (b / s if s else float("nan")) for x, b, s in zip(xnames, beta, se)},
        "alpha": alpha, "n": n, "firms": N, "dof": dof,
        "r2": r2, "r2Within": r2_within, "adjR2": adj_r2, "sigma": math.sqrt(sigma2) if dof > 0 else None,
    }


def pooled_ols(obs, xnames):
    """상수항 포함 풀링 OLS."""
    names = ["const"] + xnames
    X = [[1.0] + [o["x"][x] for x in xnames] for o in obs]
    y = [o["y"] for o in obs]
    k, n = len(names), len(y)
    XtX = [[sum(r[a] * r[b] for r in X) for b in range(k)] for a in range(k)]
    beta = solve(XtX, [sum(r[a] * v for r, v in zip(X, y)) for a in range(k)])
    resid = [v - sum(b * x for b, x in zip(beta, r)) for r, v in zip(X, y)]
    ssr = sum(e * e for e in resid)
    ybar = statistics.fmean(y)
    sst = sum((v - ybar) ** 2 for v in y)
    dof = n - k
    sigma2 = ssr / dof
    inv = inverse(XtX)
    se = [math.sqrt(sigma2 * inv[j][j]) for j in range(k)]
    r2 = 1 - ssr / sst
    firms = {o["firm"] for o in obs}
    return {
        "beta": dict(zip(names[1:], beta[1:])), "se": dict(zip(names[1:], se[1:])),
        "t": {x: b / s_ for x, b, s_ in zip(names[1:], beta[1:], se[1:])},
        "const": beta[0], "constSe": se[0],
        "alpha": {f: beta[0] for f in firms}, "n": n, "firms": len(firms), "dof": dof,
        "r2": r2, "r2Within": None, "adjR2": 1 - (1 - r2) * (n - 1) / dof, "sigma": math.sqrt(sigma2), "pooled": True,
    }


def predict(m, firm, x):
    return m["alpha"][firm] + sum(m["beta"][k] * x[k] for k in m["beta"])


# ---------------------------------------------------------------- 메인
def main():
    data = read_window_var(ROOT / "data" / "companies.js")
    companies = data["companies"]
    fx = data["meta"]["fx"]["rates"]
    krw = lambda ccy: 1.0 if ccy == "KRW" else fx.get(ccy)  # noqa: E731

    # --- 거시지표
    ore, ore_n = fred_annual(FRED["ore"])
    pct = lambda s, y: (s[y] / s[y - 1] - 1) * 100  # noqa: E731
    areas = set(COUNTRY_AREA.values())
    gdp, _ = oecd_gdp(areas)
    missing = [c["country"] for c in companies if COUNTRY_AREA.get(c["country"]) not in gdp]
    if missing:
        raise SystemExit(f"OECD GDP 매핑 없음: {set(missing)}")

    this_year = date.today().year
    macro_hist = {y: {"oreChg": pct(ore, y)} for y in range(HIST_START, max(EST_YEARS) + 1)}
    gdp_of = lambda c, y: gdp[COUNTRY_AREA[c["country"]]][y]  # noqa: E731

    # --- 추정 표본 (2023~2025)
    obs = {"crude": [], "ebitda": [], "opm": [], "pbr": []}
    # 조강 증가율은 전년 대비라 companies.js(2023~2025)로는 2024·2025 두 해만 계산됨
    for c in companies:
        for y in EST_YEARS:
            d = c["years"][str(y)]
            m = macro_hist[y]
            g = gdp_of(c, y)
            prev = c["years"].get(str(y - 1))
            if prev and prev.get("crude") and d.get("crude"):
                obs["crude"].append({"firm": c["id"], "y": math.log(d["crude"] / prev["crude"]) * 100,
                                     "x": {"gdp": g, "china": 1.0 if c["country"] == "China" else 0.0}})
            if d.get("ebitdaPct") is not None:
                obs["ebitda"].append({"firm": c["id"], "y": d["ebitdaPct"], "x": {"oreChg": m["oreChg"], "gdp": g}})
            if d.get("opMarginPct") is not None:
                obs["opm"].append({"firm": c["id"], "y": d["opMarginPct"], "x": {"oreChg": m["oreChg"], "gdp": g}})
            if d.get("pbr") is not None and d.get("ebitdaPct") is not None:
                obs["pbr"].append({"firm": c["id"], "y": d["pbr"], "x": {"ebitda": d["ebitdaPct"], "gdp": g}})

    models = {
        "crude": pooled_ols(obs["crude"], ["gdp", "china"]),
        "ebitda": fe_ols(obs["ebitda"], ["oreChg", "gdp"]),
        "opm": fe_ols(obs["opm"], ["oreChg", "gdp"]),
        "pbr": fe_ols(obs["pbr"], ["ebitda", "gdp"]),
    }

    # --- 시나리오 가정
    # 변동성(σ): 2012~2025 연간 값의 표준편차 (코로나 2020·2021 제외)
    hist_years = [y for y in range(HIST_START, max(EST_YEARS) + 1) if y not in (2020, 2021)]
    sd_ore = statistics.stdev(macro_hist[y]["oreChg"] for y in hist_years)
    sd_gdp = {a: statistics.stdev(gdp[a][y] for y in hist_years if y in gdp[a]) for a in areas}
    # 2026은 FRED YTD(관측 개월) 평균 vs 2025 → 나우캐스트, 2027~28은 변화율 0 (최근 수준 유지)
    ore_2026 = pct(ore, this_year) if this_year in ore else 0.0
    shock = {"bear": -1.0, "base": 0.0, "bull": 1.0}
    weight = {2026: 0.5, 2027: 1.0, 2028: 1.0}  # 2026은 이미 상당 부분 실현 → 충격 절반

    def macro_fc(y, sc, area, china=0.0):
        base_ore = ore_2026 if y == 2026 else 0.0
        g = gdp[area].get(y, gdp[area].get(max(gdp[area])))  # 2028은 OECD 전망 없음 → 2027 유지
        s = shock[sc] * weight[y]
        return {"oreChg": base_ore + s * sd_ore, "gdp": g + s * sd_gdp[area], "china": china}

    assumptions = {sc: {y: {"oreChg": macro_fc(y, sc, "W")["oreChg"], "gdpWorld": macro_fc(y, sc, "W")["gdp"],
                            "gdpChina": macro_fc(y, sc, "CHN")["gdp"], "gdpUSA": macro_fc(y, sc, "USA")["gdp"]}
                        for y in FC_YEARS} for sc in shock}

    # --- 회사별 전망
    z80 = 1.2816
    out = {}
    for c in companies:
        area = COUNTRY_AREA[c["country"]]
        base = c["years"][str(max(EST_YEARS))]
        # 배당성향·순이익/영업이익 비율: 최근 3년 평균 (이상치 제한)
        payouts = [min(max(c["years"][str(y)].get("payoutPct") or 0, 0), 100) for y in EST_YEARS
                   if c["years"][str(y)].get("payoutPct") is not None]
        ni_oi = []
        for y in EST_YEARS:
            d = c["years"][str(y)]
            if d.get("opIncomeLocal") and d["opIncomeLocal"] > 0 and d.get("netIncomeLocal") is not None:
                # 0 미만으로 두면 영업손실 × 음수 비율 = 흑자가 되는 오류 → 0~1.5로 제한
                ni_oi.append(min(max(d["netIncomeLocal"] / d["opIncomeLocal"], 0.0), 1.5))
        payout = statistics.fmean(payouts) if payouts else None
        ni_ratio = statistics.fmean(ni_oi) if ni_oi else None
        # DPS 기준점: 최근 3년 평균 DPS·순이익 (실적 DPS와 같은 배당락 기준이라 단위가 일치)
        dps_hist = [c["years"][str(y)].get("dps") for y in EST_YEARS if c["years"][str(y)].get("dps") is not None]
        ni_hist = [c["years"][str(y)].get("netIncomeLocal") for y in EST_YEARS if c["years"][str(y)].get("netIncomeLocal") is not None]
        avg_dps = statistics.fmean(dps_hist) if dps_hist else None
        max_dps = max(dps_hist) if dps_hist else None
        avg_ni = statistics.fmean(ni_hist) if ni_hist else None

        res = {}
        for sc in shock:
            crude, rev = base.get("crude"), base.get("revenueLocal")
            for h, y in enumerate(FC_YEARS, start=1):
                x = macro_fc(y, sc, area, 1.0 if c["country"] == "China" else 0.0)
                r = res.setdefault(y, {}).setdefault(sc, {})
                if crude is not None and c["id"] in models["crude"]["alpha"]:
                    g = predict(models["crude"], c["id"], x)
                    crude = crude * math.exp(g / 100)
                    band = z80 * models["crude"]["sigma"] * math.sqrt(h) / 100
                    r["crude"] = round(crude, 2)
                    r["crudeGrowthPct"] = round(g, 1)
                    r.setdefault("pi80", {})["crude"] = [round(crude * math.exp(-band), 2), round(crude * math.exp(band), 2)]
                else:
                    g = 0.0
                listed_ok = c.get("ticker") and rev and c["id"] in models["opm"]["alpha"]
                if not listed_ok:
                    continue
                rev = rev * (1 + g / 100)
                opm = predict(models["opm"], c["id"], x)
                ebitda = predict(models["ebitda"], c["id"], x) if c["id"] in models["ebitda"]["alpha"] else None
                fin_ccy = base.get("finCcy")
                to_usd = krw(fin_ccy) / krw("USD") if fin_ccy and krw(fin_ccy) else None
                op_local = rev * opm / 100
                if to_usd:
                    r["opIncomeUsdMn"] = round(op_local * to_usd / 1e6, 1)
                    s = z80 * models["opm"]["sigma"]
                    r.setdefault("pi80", {})["opIncomeUsdMn"] = [round(rev * (opm - s) / 100 * to_usd / 1e6, 1), round(rev * (opm + s) / 100 * to_usd / 1e6, 1)]
                r["opMarginPct"] = round(opm, 1)
                if ebitda is not None:
                    r["ebitdaPct"] = round(ebitda, 1)
                    s = z80 * models["ebitda"]["sigma"]
                    r.setdefault("pi80", {})["ebitdaPct"] = [round(ebitda - s, 1), round(ebitda + s, 1)]
                    if c["id"] in models["pbr"]["alpha"]:
                        pbr = max(predict(models["pbr"], c["id"], {**x, "ebitda": ebitda}), 0.05)
                        s = z80 * models["pbr"]["sigma"]
                        r["pbr"] = round(pbr, 2)
                        r["pi80"]["pbr"] = [round(max(pbr - s, 0.05), 2), round(pbr + s, 2)]
                # 배당: 순이익(= 영업이익 × 순이익/영업이익 비율, 영업손실이면 0 이하)에 비례
                #   1순위: 3년 평균 DPS × (전망 순이익 / 3년 평균 순이익), 상한 = 3년 최대 DPS × 2
                #   대체: 3년 평균 배당성향 × 순이익 / 주식수 (평균 순이익이 0 이하인 경우)
                if ni_ratio is not None and base.get("dpsCcy"):
                    ni = op_local * ni_ratio if op_local > 0 else op_local
                    dps = None
                    if dps_hist and max_dps == 0:
                        dps = 0.0  # 최근 3년 무배당 → 무배당 유지
                    elif avg_dps is not None and avg_ni and avg_ni > 0:
                        dps = min(max(avg_dps * ni / avg_ni, 0.0), max_dps * 2)
                    elif payout is not None and base.get("shares"):
                        conv = krw(fin_ccy) / krw(base["dpsCcy"]) if krw(base["dpsCcy"]) else None
                        if conv:
                            dps = max(payout / 100 * ni / base["shares"], 0.0) * (c.get("adrRatio") or 1) * conv
                    if dps is not None:
                        r["dps"] = round(dps, 4)
                        r["dpsCcy"] = base["dpsCcy"]
                        if payout is not None:
                            r["payoutPct"] = round(payout, 1)
        out[c["id"]] = res

    # --- 저장: data/forecast.js
    def model_meta(m, label, xlabels):
        rw = m["r2Within"]
        return {"label": label, "r2": round(m["r2"], 3), "r2Within": None if rw is None else round(rw, 3), "adjR2": round(m["adjR2"], 3),
                "n": m["n"], "firms": m["firms"], "spec": "풀링 OLS" if m.get("pooled") else "회사 고정효과",
                "coef": [{"name": xlabels[k], "beta": round(m["beta"][k], 4), "se": round(m["se"][k], 4), "t": round(m["t"][k], 2)} for k in m["beta"]]}

    XL = {"gdp": "GDP 성장률(%p)", "china": "중국 더미", "oreChg": "철광석가격 변화율(%p)", "ebitda": "EBITDA 마진(%p)"}
    meta = {
        "crude": model_meta(models["crude"], "조강 증가율", XL),
        "ebitda": model_meta(models["ebitda"], "EBITDA 마진", XL),
        "opm": model_meta(models["opm"], "영업이익률", XL),
        "pbr": model_meta(models["pbr"], "PBR", XL),
    }
    fc = {
        "status": "ready",
        "statusNote": "패널 회귀(기업 고정효과) · 추정 2023~2025 · FRED·OECD 거시지표",
        "baseYear": max(EST_YEARS),
        "years": FC_YEARS,
        "scenarios": ["bear", "base", "bull"],
        "generatedAt": date.today().isoformat(),
        "models": meta,
        "assumptions": {sc: {str(y): {k: round(v, 2) for k, v in a.items()} for y, a in v.items()} for sc, v in assumptions.items()},
        "sources": ["FRED PIORECRUSDM (Iron ore, IMF)", "OECD Economic Outlook 119 (Real GDP growth)"],
        "companies": out,
    }
    (ROOT / "data" / "forecast.js").write_text(
        "// 자동 생성 파일 — scripts/forecast_model.py (FRED·OECD + 패널 회귀). 직접 수정 금지.\n"
        "window.STEEL_FORECAST = " + json.dumps(fc, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
    )

    # --- 보고서
    lines = [
        "# 전망 모델 결과 (2026E~2028E)", "",
        f"생성일 {date.today().isoformat()} · `python scripts/forecast_model.py`", "",
        "## 방법", "",
        "- 추정기간: **최근 3년(2023~2025)** 연간 패널",
        "- 조강 증가율: 풀링 OLS (GDP + 중국 더미). 회사 고정효과를 쓰면 일본제철 U.S. Steel 인수 같은 일회성 성장이 매년 반복되어 제외",
        "- EBITDA 마진·영업이익률·PBR: 회사 고정효과(within) 회귀 — 회사별 수준 차이는 고정효과가, 연도별 변화는 거시변수가 설명",
        "- 거시변수: FRED PIORECRUSDM(철광석, 연평균 변화율 — 글로벌 철강 경기 대용), OECD EO 119 실질 GDP 성장률(본사국)",
        "- 전망: 계수 × 시나리오 거시값 (+ 회사 고정효과). 매출 = 전년 × (1+조강 증가율), 영업이익 = 매출 × 영업이익률",
        "- DPS = 3년 평균 DPS × (전망 순이익 ÷ 3년 평균 순이익), 상한 3년 최대 DPS × 2, 영업손실이면 0, 최근 3년 무배당이면 0 (규칙 기반). 순이익 = 영업이익 × 3년 평균 순이익/영업이익(0~1.5). 평균 순이익이 0 이하면 3년 평균 배당성향 × 순이익 ÷ 주식수",
        "- 80% 구간 = 점전망 ± 1.2816 × 잔차 표준편차 (조강량은 √기간 누적)",
        f"- 통화: 현지통화 → 기준일({data['meta']['fx']['date']}) 환율로 USD 환산 (대시보드 표시는 원화)", "",
        "## 회귀 결과", "",
        "| 모델 | 방식 | n | 회사 수 | R² | Within R² (거시변수 설명력) | Adj. R² |",
        "|---|---|---|---|---|---|---|",
    ]
    for m in meta.values():
        rw = "—" if m["r2Within"] is None else f"{m['r2Within']:.3f}"
        lines.append(f"| {m['label']} | {m['spec']} | {m['n']} | {m['firms']} | {m['r2']:.3f} | {rw} | {m['adjR2']:.3f} |")
    lines += ["", "> 고정효과 모델의 R²는 회사 간 수준 차이를 포함하므로 높게 나옴. 거시변수만의 설명력은 Within R²로 판단."]
    for m in meta.values():
        lines += ["", f"### {m['label']}", "", "| 변수 | 계수 | 표준오차 | t |", "|---|---|---|---|"]
        lines += [f"| {c['name']} | {c['beta']:.4f} | {c['se']:.4f} | {c['t']:.2f} |" for c in m["coef"]]
    lines += ["", "## 시나리오 가정", "",
              f"- σ (2012~2025, 2020·2021 제외): 철광석 변화율 {sd_ore:.1f}%p, GDP 성장률은 국가별",
              f"- 2026 철광석 {ore_2026:+.1f}% (FRED {ore_n.get(this_year, 0)}개월 YTD 평균 vs 2025, 나우캐스트), 2027~28 Base는 0% (수준 유지)",
              "- GDP: OECD EO 119 전망 (2028은 2027 유지)",
              "- Bear/Bull = Base ∓/± 1σ (GDP·철광석), 2026은 이미 상당 부분 실현되어 충격 0.5배", "",
              "| 시나리오 | 연도 | 철광석 변화율 | 세계 GDP | 중국 GDP | 미국 GDP |", "|---|---|---|---|---|---|"]
    for sc in ["bear", "base", "bull"]:
        for y in FC_YEARS:
            a = assumptions[sc][y]
            lines.append(f"| {sc.capitalize()} | {y}E | {a['oreChg']:+.1f}% | {a['gdpWorld']:.1f}% | {a['gdpChina']:.1f}% | {a['gdpUSA']:.1f}% |")
    lines += ["", "## 한계", "",
              "- 3개 연도 패널이라 거시변수의 시간 변동이 3개 점뿐 → 계수 불확실성이 큼 (t값·Within R² 참고).",
              "- 조강 증가율 모델의 R²가 매우 낮음 — 3년간 회사별 조강 변화는 GDP보다 개별 요인(증설·감산·M&A·중국 감산정책)이 지배.",
              "- 철강 가격 변수가 없음 — FRED 철강 PPI는 미국 관세로 왜곡되어 제외, 철광석 가격을 경기 대용으로 사용.",
              "- 검토 후 제외: GS10(미국 10년물)은 PBR 계수 부호가 이론과 반대(+)로 나와 제외.",
              "- 고정효과는 3년 평균 수준을 그대로 이어가므로 구조 변화(인수합병, 설비 신증설)는 반영되지 않음 (예: 일본제철 U.S. Steel 인수).",
              "- 비상장사·데이터 없는 회사는 조강량만 전망."]
    out_md = ROOT / "forecast" / "02_전망모델_결과.md"
    out_md.write_text("\n".join(lines) + "\n", encoding="utf-8")

    for m in meta.values():
        rw = "—" if m["r2Within"] is None else f"{m['r2Within']:.3f}"
        print(f"{m['label']:<8} n={m['n']:<4} firms={m['firms']:<3} R²={m['r2']:.3f}  within R²={rw}  "
              + "  ".join(f"{c['name']}={c['beta']:+.3f}(t={c['t']:.1f})" for c in m["coef"]))
    print("저장:", ROOT / "data" / "forecast.js", "/", out_md)


if __name__ == "__main__":
    main()
