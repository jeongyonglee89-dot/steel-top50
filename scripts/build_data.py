"""WSA 조강량 데이터를 받아 data/companies.js 를 생성한다.

실행: python scripts/build_data.py
- WSA: extranet.worldsteel.org 공개 API (사이트의 Top producers 표가 쓰는 엔드포인트)
- 재무지표(매출액/EBITDA%/PBR)는 Yahoo Finance 단계에서 채움 → 현재 null 유지
"""
import json
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "companies.js"
LOGOS = ROOT / "assets" / "logos" / "logos.json"  # 회사 CI: Wikimedia Commons(Wikidata P154) 또는 공식 사이트 아이콘

YEARS = [2025, 2024, 2023]
TOP_N = 50
WSA_URL = "https://extranet.worldsteel.org/wp-admin/admin-ajax.php?action=tonnage_report_top_producers_all"

# WSA company_name(strip) → 메타데이터. Top 30에 새 회사가 들어오면 여기에 추가.
META = {
    "China Baowu Group":        dict(id="baowu", nameKo="중국 바오우", hq="Shanghai", lat=31.23, lng=121.47, ticker="600019.SS", tickerNote="Baoshan I&S (상장 자회사)", fyEnd="12"),
    "ArcelorMittal":            dict(id="arcelormittal", nameKo="아르셀로미탈", hq="Luxembourg", lat=49.61, lng=6.13, ticker="MT", tickerNote=None, fyEnd="12"),
    "Nippon Steel Corporation": dict(id="nipponsteel", nameKo="일본제철", hq="Tokyo", lat=35.68, lng=139.76, ticker="5401.T", tickerNote=None, fyEnd="03"),
    "Ansteel Group":            dict(id="ansteel", nameKo="안산강철", hq="Anshan", lat=41.11, lng=122.99, ticker="000898.SZ", tickerNote="Angang Steel (상장 자회사)", fyEnd="12"),
    "HBIS Group":               dict(id="hbis", nameKo="허베이강철", hq="Shijiazhuang", lat=38.04, lng=114.51, ticker="000709.SZ", tickerNote="HBIS Co. (상장 자회사)", fyEnd="12"),
    "Shagang Group":            dict(id="shagang", nameKo="사강그룹", hq="Zhangjiagang", lat=31.88, lng=120.55, ticker="002075.SZ", tickerNote="Jiangsu Shagang (상장 자회사)", fyEnd="12"),
    "Jianlong Group":           dict(id="jianlong", nameKo="건룡그룹", hq="Beijing", lat=39.90, lng=116.40, ticker=None, tickerNote="비상장", fyEnd="12"),
    "POSCO Holdings":           dict(id="posco", nameKo="포스코홀딩스", hq="Pohang", lat=36.02, lng=129.34, ticker="005490.KS", tickerNote=None, fyEnd="12"),
    "Delong Steel":             dict(id="delong", nameKo="덕룡강철", hq="Xingtai", lat=37.07, lng=114.50, ticker=None, tickerNote="비상장", fyEnd="12"),
    "Tata Steel Group":         dict(id="tatasteel", nameKo="타타스틸", hq="Mumbai", lat=18.93, lng=72.83, ticker="TATASTEEL.NS", tickerNote=None, fyEnd="03"),
    "JSW Steel Limited":        dict(id="jsw", nameKo="JSW스틸", hq="Mumbai", lat=19.06, lng=72.86, ticker="JSWSTEEL.NS", tickerNote=None, fyEnd="03"),
    "Shougang Group":           dict(id="shougang", nameKo="수강그룹", hq="Beijing", lat=39.91, lng=116.17, ticker="000959.SZ", tickerNote="Beijing Shougang (상장 자회사)", fyEnd="12"),
    "Jingye Group":             dict(id="jingye", nameKo="경업그룹", hq="Shijiazhuang", lat=38.06, lng=114.48, ticker=None, tickerNote="비상장", fyEnd="12"),
    "JFE Steel Corporation":    dict(id="jfe", nameKo="JFE스틸", hq="Tokyo", lat=35.69, lng=139.77, ticker="5411.T", tickerNote="JFE Holdings (지주사)", fyEnd="03"),
    "Hunan Steel Group":        dict(id="hunansteel", nameKo="후난강철", hq="Changsha", lat=28.23, lng=112.94, ticker="000932.SZ", tickerNote="Hunan Valin (상장 자회사)", fyEnd="12"),
    "Nucor Corporation":        dict(id="nucor", nameKo="뉴코어", hq="Charlotte", lat=35.23, lng=-80.84, ticker="NUE", tickerNote=None, fyEnd="12"),
    "Liuzhou Steel":            dict(id="liuzhou", nameKo="류저우강철", hq="Liuzhou", lat=24.33, lng=109.41, ticker="601003.SS", tickerNote="Liuzhou I&S (상장 자회사)", fyEnd="12"),
    "SAIL":                     dict(id="sail", nameKo="인도철강공사(SAIL)", hq="New Delhi", lat=28.61, lng=77.21, ticker="SAIL.NS", tickerNote=None, fyEnd="03"),
    "Shandong Steel Group":     dict(id="shandong", nameKo="산둥강철", hq="Jinan", lat=36.65, lng=117.12, ticker="600022.SS", tickerNote="Shandong Iron & Steel (상장 자회사)", fyEnd="12"),
    "Hyundai Steel":            dict(id="hyundaisteel", nameKo="현대제철", hq="Incheon", lat=37.46, lng=126.71, ticker="004020.KS", tickerNote=None, fyEnd="12"),
    "Fangda Steel":             dict(id="fangda", nameKo="팡다강철", hq="Nanchang", lat=28.68, lng=115.86, ticker="600507.SS", tickerNote="Fangda Special Steel (상장 자회사)", fyEnd="12"),
    "Cleveland-Cliffs Inc.":    dict(id="clevelandcliffs", nameKo="클리블랜드클리프스", hq="Cleveland", lat=41.50, lng=-81.69, ticker="CLF", tickerNote=None, fyEnd="12"),
    "Rizhao Steel":             dict(id="rizhao", nameKo="르자오강철", hq="Rizhao", lat=35.42, lng=119.53, ticker=None, tickerNote="비상장", fyEnd="12"),
    "Techint Group":            dict(id="techint", nameKo="테킨트그룹", hq="Buenos Aires", lat=-34.60, lng=-58.38, ticker="TX", tickerNote="Ternium (상장 자회사)", fyEnd="12", adrRatio=10),
    "Tsingshan Holding":        dict(id="tsingshan", nameKo="칭산홀딩스", hq="Wenzhou", lat=28.00, lng=120.67, ticker=None, tickerNote="비상장", fyEnd="12"),
    "CITIC Special Steel":      dict(id="citicsteel", nameKo="중신특강", hq="Jiangyin", lat=31.92, lng=120.28, ticker="000708.SZ", tickerNote=None, fyEnd="12"),
    "Baotou Steel":             dict(id="baotou", nameKo="바오터우강철", hq="Baotou", lat=40.66, lng=109.84, ticker="600010.SS", tickerNote=None, fyEnd="12"),
    "Shenglong Metallurgy":     dict(id="shenglong", nameKo="성룽야금", hq="Fuzhou", lat=26.07, lng=119.30, ticker=None, tickerNote="비상장", fyEnd="12"),
    "Jinan Steel":              dict(id="jinansteel", nameKo="지난강철", hq="Jinan", lat=36.67, lng=117.00, ticker=None, tickerNote="비상장", fyEnd="12"),
    "Novolipetsk Steel (NLMK)": dict(id="nlmk", nameKo="NLMK", hq="Lipetsk", lat=52.61, lng=39.59, ticker="NLMK.ME", tickerNote="Yahoo 데이터 결손 가능", fyEnd="12"),
    # ---- 31~50위 ----
    "Gerdau S.A.":              dict(id="gerdau", nameKo="게르다우", hq="São Paulo", lat=-23.55, lng=-46.63, ticker="GGBR4.SA", tickerNote=None, fyEnd="12"),
    "Tosyalı Holding":          dict(id="tosyali", nameKo="토스얄르홀딩", hq="Istanbul", lat=40.99, lng=29.12, ticker=None, tickerNote="비상장", fyEnd="12"),
    "Sinogiant Group":          dict(id="sinogiant", nameKo="신화연합야금(Sinogiant)", hq="Cangzhou", lat=38.30, lng=116.84, ticker=None, tickerNote="비상장 (허베이신화연합야금)", fyEnd="12"),
    "China Steel Corporation":  dict(id="chinasteel", nameKo="중국강철(CSC)", hq="Kaohsiung", lat=22.62, lng=120.30, ticker="2002.TW", tickerNote=None, fyEnd="12"),
    "Nanjing Steel":            dict(id="nanjing", nameKo="난징강철", hq="Nanjing", lat=32.06, lng=118.80, ticker="600282.SS", tickerNote="Nanjing Iron & Steel (상장 자회사)", fyEnd="12"),
    "Anyang Steel":             dict(id="anyang", nameKo="안양강철", hq="Anyang", lat=36.10, lng=114.39, ticker="600569.SS", tickerNote="Anyang Iron & Steel (상장 자회사)", fyEnd="12"),
    "Zenith Steel":             dict(id="zenith", nameKo="중톈강철", hq="Changzhou", lat=31.81, lng=119.97, ticker=None, tickerNote="비상장", fyEnd="12"),
    "Hoa Phat Steel":           dict(id="hoaphat", nameKo="호아팟", hq="Hanoi", lat=21.03, lng=105.85, ticker="HPG.VN", tickerNote="Hoa Phat Group", fyEnd="12"),
    "Severstal":                dict(id="severstal", nameKo="세베르스탈", hq="Cherepovets", lat=59.13, lng=37.90, ticker="CHMF.ME", tickerNote="Yahoo 데이터 결손 가능", fyEnd="12"),
    "Steel Dynamics, Inc.":     dict(id="stld", nameKo="스틸다이내믹스", hq="Fort Wayne", lat=41.08, lng=-85.14, ticker="STLD", tickerNote=None, fyEnd="12"),
    "Sanming Steel":            dict(id="sanming", nameKo="싼밍강철", hq="Sanming", lat=26.26, lng=117.64, ticker="002110.SZ", tickerNote="Sansteel MinGuang (상장 자회사)", fyEnd="12"),
    "Puyang Steel":             dict(id="puyang", nameKo="푸양강철", hq="Wu'an", lat=36.70, lng=114.20, ticker=None, tickerNote="비상장 (허베이푸양강철)", fyEnd="12"),
    "Mobarakeh Steel Company":  dict(id="mobarakeh", nameKo="모바라케스틸", hq="Isfahan", lat=32.65, lng=51.67, ticker=None, listed=True, tickerNote="테헤란 증시(FOOLAD) 상장 · Yahoo 미제공", fyEnd="12"),
    "Magnitogorsk Iron & Steel Works (MMK)": dict(id="mmk", nameKo="마그니토고르스크(MMK)", hq="Magnitogorsk", lat=53.41, lng=58.98, ticker="MAGN.ME", tickerNote="Yahoo 데이터 결손 가능", fyEnd="12"),
    "Donghua Steel":            dict(id="donghua", nameKo="둥화강철", hq="Tangshan", lat=39.63, lng=118.18, ticker=None, tickerNote="비상장 (탕산둥화강철)", fyEnd="12"),
    "Shaanxi Steel":            dict(id="shaanxi", nameKo="산시강철", hq="Xi'an", lat=34.34, lng=108.94, ticker=None, tickerNote="비상장 (산시강철그룹)", fyEnd="12"),
    "thyssenkrupp":             dict(id="thyssenkrupp", nameKo="티센크루프", hq="Essen", lat=51.46, lng=7.01, ticker="TKA.DE", tickerNote="thyssenkrupp AG (철강 외 사업 포함)", fyEnd="09"),
    "Jindal Steel Limited":     dict(id="jindal", nameKo="진달스틸", hq="New Delhi", lat=28.58, lng=77.25, ticker="JINDALSTEL.NS", tickerNote=None, fyEnd="03"),
    "Jiuquan Steel":            dict(id="jiuquan", nameKo="주취안강철", hq="Jiayuguan", lat=39.77, lng=98.29, ticker="600307.SS", tickerNote="Gansu Jiu Steel Hongxing (상장 자회사)", fyEnd="12"),
    "EVRAZ":                    dict(id="evraz", nameKo="에브라즈", hq="Moscow", lat=55.76, lng=37.62, ticker=None, tickerNote="비상장 (2022 LSE 상장폐지)", fyEnd="12"),
}

# 본사 국적 한글 표기
COUNTRY_KO = {
    "China": "중국", "Luxembourg": "룩셈부르크", "Japan": "일본", "South Korea": "대한민국", "India": "인도",
    "United States": "미국", "Argentina": "아르헨티나", "Russia": "러시아", "Brazil": "브라질", "Türkiye": "튀르키예",
    "Taiwan, China": "대만", "Viet Nam": "베트남", "Iran": "이란", "Germany": "독일",
}


def fetch_wsa():
    body = json.dumps({"filters": {
        "year": str(YEARS[0]), "num_companies": 50, "include_rank_for_other_years": 1,
        "lang": "en", "other_years": YEARS[1:],
    }}).encode()
    req = urllib.request.Request(WSA_URL, data=body, headers={"Content-Type": "application/json"})
    # WSA 서버가 간헐적으로 응답하지 않음 → 지수 백오프로 최대 5회 재시도
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                res = json.load(r)
            break
        except OSError as e:
            if attempt == 4:
                raise SystemExit(f"WSA API 응답 없음 (5회 시도) — 기존 data/companies.js 유지: {e}")
            wait = 5 * 2 ** attempt
            print(f"WSA 재시도 {attempt + 1}/4 ({wait}초 후): {e}")
            time.sleep(wait)
    if res.get("status") != "ok":
        raise RuntimeError(f"WSA API error: {res}")
    return res["data"]["records"]


def year_entry(rec):
    return {"rank": rec["index"], "crude": round(float(rec["total_production"]), 2),
            "crudeEstimate": bool(rec["is_estimate"]),
            "revenueKrw": None, "ebitdaPct": None, "pbr": None, "dps": None, "dpsCcy": None, "dpsKrw": None, "opMarginPct": None, "payoutPct": None}


def main():
    records = fetch_wsa()[:TOP_N]
    missing = [r["company_name"].strip() for r in records if r["company_name"].strip() not in META]
    if missing:
        raise SystemExit(f"META에 없는 회사: {missing}")

    logos = json.loads(LOGOS.read_text(encoding="utf-8")) if LOGOS.exists() else {}
    companies = []
    for rec in records:
        name = rec["company_name"].strip()
        years = {YEARS[0]: year_entry(rec)}
        for o in rec["other_years"]:
            y = int(o["year"])
            if y in YEARS:
                years[y] = year_entry(o)
        for y in YEARS:
            years.setdefault(y, {"rank": None, "crude": None, "crudeEstimate": False,
                                 "revenueKrw": None, "ebitdaPct": None, "pbr": None, "dps": None, "dpsCcy": None, "dpsKrw": None, "opMarginPct": None, "payoutPct": None})
        logo = logos.get(META[name]["id"], {})
        meta = {"listed": META[name]["ticker"] is not None, **META[name]}
        country = rec["company_country_name"]
        companies.append({"name": name, "country": country, "countryKo": COUNTRY_KO.get(country, country), **meta,
                          "logo": logo.get("file"), "logoSource": logo.get("source"), "years": years})

    data = {
        "years": YEARS,
        "meta": {
            "sources": ["World Steel Association (worldsteel.org)", "Yahoo Finance (finance.yahoo.com)"],
            "asOf": None,
            "fxNote": None,
        },
        "companies": companies,
    }
    OUT.write_text(
        "// 자동 생성 파일 — scripts/build_data.py 로 재생성. 직접 수정 금지.\n"
        "window.STEEL_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"{len(companies)}개 회사 → {OUT}")


if __name__ == "__main__":
    main()
