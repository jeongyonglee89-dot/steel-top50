// PRD §8 수용 기준 중 현재 구현 범위(1단계 + WSA 데이터) E2E 테스트
const { test, expect } = require("@playwright/test");
const path = require("path");
const { pathToFileURL } = require("url");

const PAGE_URL = pathToFileURL(path.join(__dirname, "..", "index.html")).href;
const TOTAL = 50; // WSA Top 50

test.describe("Global Steel Top 50 대시보드", () => {
  let consoleErrors;
  let tileErrors;

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    tileErrors = [];
    page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
    page.on("pageerror", (e) => consoleErrors.push(e.message));
    page.on("response", (r) => {
      if (r.request().resourceType() === "image" && r.status() >= 400) tileErrors.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(PAGE_URL);
    await page.waitForLoadState("networkidle");
  });

  test("페이지 로딩 시 콘솔 에러 0건", async () => {
    expect(consoleErrors).toEqual([]);
  });

  test("세계 지도(국가 경계)가 그려지고 외부 이미지 오류 없음", async ({ page }) => {
    expect(await page.locator("path.country").count()).toBeGreaterThan(150);
    // 타일 서버 미사용: "API KEY REQUIRED" 같은 200 응답 오류 이미지가 섞이지 않도록 타일 자체가 없어야 함
    await expect(page.locator("img.leaflet-tile")).toHaveCount(0);
    expect(tileErrors).toEqual([]);
  });

  test("마커 50개(본사)가 지도에 표시됨", async ({ page }) => {
    await expect(page.locator("path.company-marker")).toHaveCount(TOTAL);
  });

  test("실적 탭 2023~2025, 전망 탭 2026E~2028E, 기본값 2025 실적", async ({ page }) => {
    await expect(page.locator(".tab-actual .tab-label")).toHaveText("실적");
    await expect(page.locator("#year-actual button")).toHaveText(["2023", "2024", "2025"]);
    await expect(page.locator(".tab-forecast .tab-label")).toHaveText("전망");
    await expect(page.locator("#year-forecast button")).toHaveText(["2026E", "2027E", "2028E"]);
    await expect(page.locator(".year-selector button.active")).toHaveText("2025");
    await expect(page.locator("body")).toHaveClass(/mode-actual/);
  });

  test("연도 전환 시 팝업 값이 WSA 해당 연도 값으로 바뀜", async ({ page }) => {
    const popup = page.locator(".leaflet-popup-content").last();
    const openBaowu = () => page.locator("path.marker-baowu").dispatchEvent("click");

    await openBaowu();
    await expect(popup).toContainText("China Baowu Group");
    await expect(popup).toContainText("2025년 실적 · WSA #1");
    await expect(popup).toContainText("124.8 Mt");

    await page.getByRole("button", { name: "2024" }).click();
    await openBaowu();
    await expect(popup).toContainText("2024년 실적 · WSA #1");
    await expect(popup).toContainText("130.1 Mt");

    await page.getByRole("button", { name: "2023" }).click();
    await openBaowu();
    await expect(popup).toContainText("130.8 Mt");
  });

  test("비상장사는 재무지표가 'N/A (비상장)'으로 표시됨", async ({ page }) => {
    await page.locator("path.marker-jianlong").dispatchEvent("click");
    const popup = page.locator(".leaflet-popup-content").last();
    await expect(popup).toContainText("Jianlong Group");
    await expect(popup.getByText("N/A (비상장)")).toHaveCount(4);
  });

  test("하단에 데이터 출처 표시", async ({ page }) => {
    await expect(page.locator("#source-text")).toContainText("World Steel Association");
    await expect(page.locator("#source-text")).toContainText("Yahoo Finance");
  });

  // ---------- 순위표 ----------
  const rows = (page) => page.locator("#rank-table tbody tr");
  const firstName = (page) => rows(page).first().locator("td.name .nm");

  test("순위표에 50개 회사와 지표 열이 표시됨 (기본: 조강량 순)", async ({ page }) => {
    await expect(rows(page)).toHaveCount(TOTAL);
    await expect(page.locator("#rank-table thead th")).toHaveText([
      "순위", "회사", /조강량/, /매출액/, /EBITDA/, /PBR/, /DPS/
    ]);
    await expect(page.locator("#table-title")).toHaveText("2025년 실적 · 조강량 순위 (50개사)");
    await expect(firstName(page)).toHaveText("China Baowu Group");
  });

  test("상장사는 재무지표 값이 채워져 있음 (POSCO 2025)", async ({ page }) => {
    const posco = page.locator('#rank-table tr[data-id="posco"] td');
    for (const i of [3, 4, 5]) await expect(posco.nth(i)).toHaveText(/^-?\d+\.\d+$/);
    // 원화 회사는 원화 금액 그대로 (POSCO 2025 DPS 10,000원)
    await expect(posco.nth(6)).toHaveText("10,000");
  });

  for (const [key, col] of [["revenue", 3], ["ebitdaPct", 4], ["pbr", 5]]) {
    test(`'${key}' 머리글 클릭 시 내림차순 → 다시 클릭 시 오름차순 정렬`, async ({ page }) => {
      const th = page.locator(`#rank-table th[data-sort="${key}"]`);
      const values = async () =>
        (await page.locator(`#rank-table tbody tr td:nth-child(${col + 1})`).allTextContents())
          .map((t) => Number(t.replace(/,/g, ""))).filter((v) => !Number.isNaN(v));

      await th.click();
      await expect(th).toHaveAttribute("aria-sort", "descending");
      let v = await values();
      expect(v.length).toBeGreaterThan(15);
      expect(v).toEqual([...v].sort((a, b) => b - a));
      await expect(rows(page).first().locator("td.rank")).toHaveText("1");

      await th.click();
      await expect(th).toHaveAttribute("aria-sort", "ascending");
      v = await values();
      expect(v).toEqual([...v].sort((a, b) => a - b));
      // 값 없는 회사(비상장)는 항상 맨 아래
      await expect(rows(page).last().locator("td.rank")).toHaveText("-");
    });
  }

  test("주당배당금 정렬은 원화 환산 기준", async ({ page }) => {
    await page.locator('#rank-table th[data-sort="dps"]').click();
    const ids = await rows(page).evaluateAll((trs) => trs.map((tr) => tr.dataset.id));
    const usd = await page.evaluate((ids) => {
      const byId = Object.fromEntries(window.STEEL_DATA.companies.map((c) => [c.id, c.years[2025].dpsKrw]));
      return ids.map((id) => byId[id]).filter((v) => v != null);
    }, ids);
    expect(usd).toEqual([...usd].sort((a, b) => b - a));
  });

  test("중국 철강사 제외 시 지도·표에서 중국 회사가 빠지고 순위가 다시 매겨짐", async ({ page }) => {
    const chinaCount = await page.evaluate(
      () => window.STEEL_DATA.companies.filter((c) => c.country === "China").length
    );
    await page.getByLabel("중국 철강사 제외").check();

    await expect(rows(page)).toHaveCount(TOTAL - chinaCount);
    await expect(page.locator("path.company-marker")).toHaveCount(TOTAL - chinaCount);
    await expect(page.locator("#rank-table tbody")).not.toContainText("China ·");
    await expect(page.locator("#table-title")).toContainText("중국 제외");
    await expect(firstName(page)).toHaveText("ArcelorMittal");
    await expect(rows(page).first().locator("td.rank")).toHaveText("1");

    // 연도·정렬을 바꿔도 제외 상태 유지
    await page.getByRole("button", { name: "2023" }).click();
    await page.locator('#rank-table th[data-sort="revenue"]').click();
    await expect(rows(page)).toHaveCount(TOTAL - chinaCount);

    await page.getByLabel("중국 철강사 제외").uncheck();
    await expect(rows(page)).toHaveCount(TOTAL);
    await expect(page.locator("path.company-marker")).toHaveCount(TOTAL);
  });

  test("표 행 클릭 시 해당 회사 팝업이 열림", async ({ page }) => {
    await page.locator('#rank-table tr[data-id="hyundaisteel"]').click();
    await expect(page.locator(".leaflet-popup-content").last()).toContainText("Hyundai Steel");
    await expect(page.locator('#rank-table tr[data-id="hyundaisteel"]')).toHaveClass(/selected/);
  });

  // ---------- 원화 환산 / 환율 기준 ----------
  test("상단에 환율 기준일과 통화별 환율이 표시됨", async ({ page }) => {
    const fx = await page.evaluate(() => window.STEEL_DATA.meta.fx);
    const info = page.locator("#fx-info");
    await expect(info).toContainText(`환율 기준 ${fx.date}`);
    for (const ccy of ["USD", "CNY", "JPY", "EUR"]) await expect(info).toContainText(ccy);
    // 나머지 통화는 마우스오버(title)에 전부 표시
    const title = await info.getAttribute("title");
    for (const ccy of Object.keys(fx.rates)) expect(title).toContain(ccy);
  });

  test("매출액·주당배당금이 기준일 환율로 원화 환산됨 (Nucor 2025)", async ({ page }) => {
    const { d, rate } = await page.evaluate(() => {
      const D = window.STEEL_DATA;
      const d = D.companies.find((c) => c.id === "nucor").years[2025];
      return { d, rate: D.meta.fx.rates.USD };
    });
    expect(d.revenueKrw).toBeCloseTo((d.revenueLocal * rate) / 1e12, 1);
    expect(d.dpsKrw).toBeCloseTo(d.dps * rate, 0);
    await expect(page.locator("#rank-table thead")).toContainText("조원");
  });

  // ---------- CI ----------
  test("CI 이미지가 깨지지 않고 표시되며, 없는 회사는 이니셜 배지", async ({ page }) => {
    const imgs = page.locator("#rank-table img.logo");
    const n = await page.evaluate(() => window.STEEL_DATA.companies.filter((c) => c.logo).length);
    await expect(imgs).toHaveCount(n);
    const broken = await imgs.evaluateAll((els) => els.filter((e) => !e.complete || e.naturalWidth === 0).map((e) => e.alt));
    expect(broken).toEqual([]);
    await expect(page.locator("#rank-table .logo-fallback")).toHaveCount(TOTAL - n);
  });

  // ---------- 회사 인사이트 박스 ----------
  test("회사 클릭 시 선택 연도 기준 GPT 요약 박스가 표시되고 연도 변경 시 갱신됨", async ({ page }) => {
    const box = page.locator("#insight-box");
    await expect(box).toBeHidden();

    await page.locator("path.marker-posco").dispatchEvent("click");
    await expect(box).toBeVisible();
    await expect(box).toContainText("POSCO Holdings");
    await expect(box).toContainText("2025년 기준");
    for (const h of ["주요 제품 포트폴리오", "전략", "최근 보도자료", "이슈"]) {
      await expect(box.locator("h4", { hasText: h })).toBeVisible();
    }
    // 보도자료 날짜는 모두 선택 연도
    const dates = await box.locator(".news .date").allTextContents();
    expect(dates.length).toBeGreaterThan(0);
    for (const dt of dates) expect(dt.startsWith("2025")).toBe(true);

    await page.getByRole("button", { name: "2024" }).click();
    await expect(box).toContainText("2024년 기준");
    for (const dt of await box.locator(".news .date").allTextContents()) expect(dt.startsWith("2024")).toBe(true);

    await box.getByRole("button", { name: "닫기" }).click();
    await expect(box).toBeHidden();
  });

  test("중국 제외 시 중국 회사 요약 박스는 닫힘", async ({ page }) => {
    await page.locator('#rank-table tr[data-id="baowu"]').click();
    await expect(page.locator("#insight-box")).toContainText("China Baowu Group");
    await page.getByLabel("중국 철강사 제외").check();
    await expect(page.locator("#insight-box")).toBeHidden();
  });

  // ---------- 전망 탭 ----------
  const bg = (loc) => loc.evaluate((el) => getComputedStyle(el).backgroundColor);

  test("전망 탭 선택 시 표·탭 색상이 실적과 다르게 표시됨", async ({ page }) => {
    const th = page.locator('#rank-table th[data-sort="crude"]').first();
    const actualTh = await bg(page.locator("#rank-table thead th").first());
    const fg = (loc) => loc.evaluate((el) => getComputedStyle(el).color);
    const actualTab = await fg(page.locator(".tab-actual button.active"));

    await page.getByRole("button", { name: "2026E" }).click();
    await expect(page.locator("body")).toHaveClass(/mode-forecast/);
    const forecastTh = await bg(page.locator("#rank-table thead th").first());
    const forecastTab = await fg(page.locator(".tab-forecast button.active"));

    expect(forecastTh).not.toBe(actualTh);
    expect(forecastTab).not.toBe(actualTab);
    await expect(th).toBeVisible();
  });

  test("전망 탭: 시나리오 선택, 영업이익 열, 모델링 대기 안내", async ({ page }) => {
    const scenarios = page.locator("#scenario-selector");
    await expect(scenarios).toBeHidden();

    await page.getByRole("button", { name: "2027E" }).click();
    await expect(scenarios).toBeVisible();
    await expect(scenarios.locator("button")).toHaveText(["Bear", "Base", "Bull"]);
    await expect(page.locator("#table-title")).toContainText("2027E 전망 (Base)");
    await expect(page.locator('#rank-table th[data-sort="revenue"]')).toContainText("영업이익");
    await expect(page.locator("#forecast-banner")).toBeVisible();

    await scenarios.getByRole("button", { name: "Bear" }).click();
    await expect(page.locator("#table-title")).toContainText("2027E 전망 (Bear)");

    // 실적 탭으로 돌아오면 원래대로
    await page.getByRole("button", { name: "2025" }).click();
    await expect(scenarios).toBeHidden();
    await expect(page.locator("#forecast-banner")).toBeHidden();
    await expect(page.locator('#rank-table th[data-sort="revenue"]')).toContainText("매출액");
  });

  test("전망 연도에서 회사 클릭 시 최근 실적(2025) 기준 요약 표시", async ({ page }) => {
    await page.getByRole("button", { name: "2026E" }).click();
    await page.locator("path.marker-posco").dispatchEvent("click");
    await expect(page.locator("#insight-box")).toContainText("2025년 기준 (최근 실적)");
    await expect(page.locator(".leaflet-popup-content").last()).toContainText("2026E 전망");
  });

  // ---------- Top 50 / 본사 국적 ----------
  test("팝업과 요약 박스에 본사 국적(한글) 표시", async ({ page }) => {
    await page.locator('#rank-table tr[data-id="thyssenkrupp"]').click();
    await expect(page.locator(".leaflet-popup-content").last()).toContainText("본사 독일 Essen");
    await expect(page.locator("#insight-box .sub")).toContainText("본사 독일 Essen");
  });

  test("상장사지만 데이터가 없는 회사(러시아·Yahoo 미제공)는 '데이터 없음'으로 표기", async ({ page }) => {
    await expect(page.locator('#rank-table tr[data-id="mobarakeh"] td.na')).toHaveText("데이터 없음");
    for (const id of ["nlmk", "severstal", "mmk"]) {
      await expect(page.locator(`#rank-table tr[data-id="${id}"] td.na`)).toHaveText("데이터 없음");
    }
    // 2023년 Severstal은 일부 값만 있음 → 빈 칸만 "데이터 없음"
    await page.getByRole("button", { name: "2023", exact: true }).click();
    await expect(page.locator('#rank-table tr[data-id="severstal"]')).toContainText("데이터 없음");
    await expect(page.locator('#rank-table tr[data-id="severstal"]')).not.toContainText("N/A");
    await expect(page.locator('#rank-table tr[data-id="jianlong"] td.na')).toHaveText("N/A (비상장)");
  });

  // ---------- 설비 포트폴리오 / 제품 사진 / 보도자료 형식 ----------
  test("요약 박스: 설비 포트폴리오가 제품 포트폴리오 위에, Material balance 도식 포함", async ({ page }) => {
    await page.locator('#rank-table tr[data-id="posco"]').click();
    const box = page.locator("#insight-box");
    const headings = await box.locator("h4").allTextContents();
    expect(headings.indexOf("설비 포트폴리오")).toBeLessThan(headings.indexOf("주요 제품 포트폴리오"));
    const svg = box.locator("svg.material-balance");
    await expect(svg).toBeVisible();
    for (const t of ["고로", "전기로", "조강", "판재", "봉형강"]) await expect(svg).toContainText(t);
  });

  test("Material balance: 투입(고로+전기로) = 조강 = 산출(판재+봉형강)", async ({ page }) => {
    const ok = await page.evaluate(() => {
      const bad = [];
      for (const [id, byYear] of Object.entries(window.STEEL_FACILITIES)) {
        for (const [y, f] of Object.entries(byYear)) {
          for (const [a, b] of [[f.route.bfPct, f.route.eafPct], [f.product.flatPct, f.product.longPct]]) {
            if (a == null && b == null) continue;
            if (a == null || b == null || Math.abs(a + b - 100) > 0.6 || a < 0 || b < 0) bad.push(`${id} ${y} ${a}/${b}`);
          }
        }
      }
      return bad;
    });
    expect(ok).toEqual([]);
  });

  test("제품 포트폴리오: 항목마다 제품 사진(또는 카테고리 타일)이 깨지지 않고 표시", async ({ page }) => {
    await page.locator('#rank-table tr[data-id="posco"]').click();
    const cards = page.locator("#insight-box .product-card");
    expect(await cards.count()).toBeGreaterThan(0);
    const broken = await page
      .locator("#insight-box .product-card img.thumb")
      .evaluateAll((els) => els.filter((e) => !e.complete || e.naturalWidth === 0).map((e) => e.alt));
    expect(broken).toEqual([]);
  });

  test("보도자료는 전략·이슈와 같은 형식 (본문 텍스트 + '출처' 링크, 제목은 링크 아님)", async ({ page }) => {
    await page.locator('#rank-table tr[data-id="posco"]').click();
    const items = page.locator("#insight-box ul.news li");
    expect(await items.count()).toBeGreaterThan(0);
    const links = await items.evaluateAll((lis) => lis.map((li) => [...li.querySelectorAll("a")].map((a) => a.textContent)));
    for (const l of links) expect(l).toEqual(["출처"]);
  });

  test("클릭 전에는 본사 마커만, 회사 클릭 시 해당 회사 주요 사업장(◆)이 지도에 표시", async ({ page }) => {
    await expect(page.locator(".plant-marker")).toHaveCount(0);
    const expected = await page.evaluate(
      () => (window.STEEL_FACILITIES.posco?.[2025]?.plants ?? []).filter((p) => p.lat != null).length
    );
    test.skip(expected === 0, "POSCO 2025 사업장 좌표 없음");
    await page.locator('#rank-table tr[data-id="posco"]').click();
    await expect(page.locator(".plant-marker")).toHaveCount(expected);
    // 닫으면 사라짐
    await page.locator("#insight-box").getByRole("button", { name: "닫기" }).click();
    await expect(page.locator(".plant-marker")).toHaveCount(0);
  });

  // ---------- F8 마커 겹침 / F9 KPI ----------
  const hiddenMarkers = (page) =>
    page.evaluate(() => {
      const hidden = [];
      for (const el of document.querySelectorAll("path.company-marker")) {
        const r = el.getBoundingClientRect();
        const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        if (top !== el) hidden.push([...el.classList].find((c) => c.startsWith("marker-")));
      }
      return hidden;
    });

  test("F8: 겹치는 본사 마커를 펼쳐 50개 모두 클릭 가능 (줌 2, 4)", async ({ page }) => {
    expect(await hiddenMarkers(page)).toEqual([]);
    await page.evaluate(() => document.querySelector(".leaflet-control-zoom-in").click());
    await page.evaluate(() => document.querySelector(".leaflet-control-zoom-in").click());
    await page.waitForTimeout(600);
    // 화면 밖 마커는 제외하고 검사
    const hidden = await page.evaluate(() => {
      const map = document.getElementById("map").getBoundingClientRect();
      const out = [];
      for (const el of document.querySelectorAll("path.company-marker")) {
        const r = el.getBoundingClientRect();
        const x = r.x + r.width / 2, y = r.y + r.height / 2;
        if (r.width < 4 || x < map.left || x > map.right || y < map.top || y > map.bottom) continue; // 화면 밖(클리핑된) 마커 제외
        if (document.elementFromPoint(x, y) !== el) out.push([...el.classList].find((c) => c.startsWith("marker-")));
      }
      return out;
    });
    expect(hidden).toEqual([]);
  });

  test("F9: KPI(조강량 합계 등)가 선택 연도·중국 제외에 맞게 계산됨", async ({ page }) => {
    const expected = (ex) =>
      page.evaluate((ex) => {
        const cs = window.STEEL_DATA.companies.filter((c) => !(ex && c.country === "China"));
        return cs.reduce((s, c) => s + c.years[2025].crude, 0);
      }, ex);
    const kpi = page.locator("#kpi-bar .kpi").first();
    await expect(kpi).toContainText("조강량 합계");
    const fmt = (v) => v.toLocaleString("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    await expect(kpi).toContainText(`${fmt(await expected(false))} Mt`);
    await page.getByLabel("중국 철강사 제외").check();
    await expect(kpi).toContainText(`${fmt(await expected(true))} Mt`);
    await expect(page.locator("#kpi-bar")).toContainText("PBR 중앙값");
  });

  // ---------- 전망 모델 (FRED·OECD 회귀) ----------
  test("전망 탭: 회귀 전망값과 R²가 표시됨", async ({ page }) => {
    await page.getByRole("button", { name: "2026E" }).click();
    const banner = page.locator("#forecast-banner");
    await expect(banner).toContainText("R²");
    await expect(banner).toContainText("within");
    for (const k of ["crude", "revenue", "ebitdaPct", "pbr"]) {
      await expect(page.locator(`#rank-table th[data-sort="${k}"] .r2`)).toHaveText(/^R² \d\.\d{2}$/);
    }
    await expect(page.locator('#rank-table th[data-sort="dps"] .r2')).toHaveText("규칙 기반");
    // 상장사(POSCO)는 숫자 전망, 비상장(Jianlong)은 조강량만
    const posco = page.locator('#rank-table tr[data-id="posco"] td');
    for (const i of [2, 3, 4, 5]) await expect(posco.nth(i)).toHaveText(/^-?[\d,]+\.\d+$/);
    await expect(page.locator('#rank-table tr[data-id="jianlong"] td').nth(2)).toHaveText(/^[\d,]+\.\d$/);
    await expect(page.locator('#rank-table tr[data-id="jianlong"] td.na')).toHaveText("N/A (비상장)");
    // 러시아: 조강량 전망은 있고 재무는 데이터 없음
    await expect(page.locator('#rank-table tr[data-id="severstal"] td.na')).toHaveText("데이터 없음");
    // 실적 탭으로 돌아가면 R² 표기 사라짐
    await page.getByRole("button", { name: "2025", exact: true }).click();
    await expect(page.locator('#rank-table th[data-sort="crude"] .r2')).toHaveText("");
  });

  test("전망 시나리오 순서: Bear ≤ Base ≤ Bull (조강량·영업이익, 상장사 전체)", async ({ page }) => {
    const bad = await page.evaluate(() => {
      const out = [];
      for (const [id, byYear] of Object.entries(window.STEEL_FORECAST.companies)) {
        for (const [y, sc] of Object.entries(byYear)) {
          for (const k of ["crude", "opIncomeUsdMn"]) {
            const [a, b, c] = ["bear", "base", "bull"].map((s) => sc[s]?.[k]);
            if (a == null) continue;
            if (!(a <= b + 1e-9 && b <= c + 1e-9)) out.push(`${id} ${y} ${k} ${a}/${b}/${c}`);
          }
        }
      }
      return out;
    });
    expect(bad).toEqual([]);
  });

  test("전망 팝업에 80% 예측구간 표시", async ({ page }) => {
    await page.getByRole("button", { name: "2027E" }).click();
    await page.locator("path.marker-posco").dispatchEvent("click");
    const popup = page.locator(".leaflet-popup-content").last();
    await expect(popup).toContainText("80% 예측구간");
    await expect(popup.locator(".pi").first()).toHaveText(/\(.+~.+\)/);
  });

  // ---------- 3단계: 범례(F11), 지표별 마커(F6), 반응형(F12) ----------
  const radii = (page) =>
    page.evaluate(() =>
      Object.fromEntries([...document.querySelectorAll("path.company-marker")].map((el) => [
        [...el.classList].find((c) => c.startsWith("marker-")).slice(7),
        el.getBoundingClientRect().width
      ]))
    );

  test("F6/F11: 마커 크기가 선택 지표를 따르고 범례가 함께 바뀜", async ({ page }) => {
    const legend = page.locator(".map-legend");
    await expect(legend).toContainText("본사 ● 조강량");
    let r = await radii(page);
    expect(r.baowu).toBeGreaterThan(r.hyundaisteel); // 조강량 124.8 > 18.0
    // 비상장사는 매출액 기준에서 '값 없음' (최소 크기)
    await page.locator('#rank-table th[data-sort="revenue"]').click();
    await expect(legend).toContainText("본사 ● 매출액");
    await expect(legend).toContainText("값 없음");
    r = await radii(page);
    expect(r.nipponsteel).toBeGreaterThan(r.baowu); // 매출 85.2조 > 63.8조
    expect(r.jianlong).toBeLessThan(r.nipponsteel);
    for (const t of ["고로", "전기로", "고로+전기로", "압연"]) await expect(legend).toContainText(t);
  });

  test("사업장 ◆는 공정별 클래스(고로/전기로/혼합/압연)로 표시", async ({ page }) => {
    await page.locator('#rank-table tr[data-id="nipponsteel"]').click();
    await expect(page.locator(".plant-marker.proc-bf").first()).toBeVisible();
    const classes = await page.locator(".plant-marker").evaluateAll((els) => els.map((e) => [...e.classList].find((c) => c.startsWith("proc-"))));
    for (const c of classes) expect(["proc-bf", "proc-eaf", "proc-mix", "proc-roll"]).toContain(c);
  });

  for (const w of [1000, 420]) {
    test(`F12: ${w}px — 가로 스크롤 없음, 표는 지도 아래, 요약 박스는 지도를 덮지 않음`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 860 });
      await page.reload();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      const mapBox = await page.locator("#map").boundingBox();
      const panelBox = await page.locator(".side-panel").boundingBox();
      expect(panelBox.y).toBeGreaterThanOrEqual(mapBox.y + mapBox.height - 1);
      await page.locator('#rank-table tr[data-id="posco"]').click();
      // 클릭으로 스크롤되므로 클릭 후 다시 측정
      const map2 = await page.locator("#map").boundingBox();
      const box = await page.locator("#insight-box").boundingBox();
      expect(box.y).toBeGreaterThanOrEqual(map2.y + map2.height - 1);
    });
  }

  // ---------- BCG 톤앤매너 / 인터랙션 / 한자 ----------
  test("액션 타이틀이 선택 지표의 핵심 메시지를 문장으로 보여줌", async ({ page }) => {
    const title = page.locator("#action-title");
    await expect(title).toHaveText(/^상위 10개사가 Top 50 조강량의 \d+% 차지 — 1위 .+ Mt$/);
    await page.locator('#rank-table th[data-sort="pbr"]').click();
    await expect(title).toContainText("PBR 1배 미만");
    await page.getByLabel("중국 철강사 제외").check();
    await page.locator('#rank-table th[data-sort="crude"]').click();
    await expect(title).toContainText("중국 외 조강량");
  });

  test("▶ 연도 재생: 2023부터 차례로 넘어가고 다시 누르면 정지", async ({ page }) => {
    const btn = page.locator("#play-btn");
    await btn.click();
    await expect(btn).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".year-selector button.active")).toHaveText("2023");
    await expect(page.locator(".year-selector button.active")).toHaveText("2024", { timeout: 4000 });
    await btn.click();
    await expect(btn).toHaveAttribute("aria-pressed", "false");
    const y = await page.locator(".year-selector button.active").textContent();
    await page.waitForTimeout(2200);
    await expect(page.locator(".year-selector button.active")).toHaveText(y);
  });

  test("표 행에 마우스를 올리면 지도 마커가 강조됨", async ({ page }) => {
    await page.locator('#rank-table tr[data-id="posco"]').hover();
    await expect(page.locator("path.marker-posco")).toHaveClass(/\bhl\b/);
    await page.locator("#action-title").hover();
    await expect(page.locator("path.marker-posco")).not.toHaveClass(/\bhl\b/);
  });

  test("화면에 한자·일본어 가나가 표시되지 않음 (데이터 전체 + 요약 박스)", async ({ page }) => {
    const HANJA = /[㐀-䶿一-鿿豈-﫿぀-ヿ]/;
    const found = await page.evaluate((src) => {
      const re = new RegExp(src);
      const hits = [];
      const scan = (o, path) => {
        if (typeof o === "string") { if (re.test(o) && !/url$/.test(path)) hits.push(`${path}: ${o.slice(0, 40)}`); return; }
        if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) scan(v, `${path}.${k}`);
      };
      scan(window.STEEL_DATA, "data"); scan(window.STEEL_INSIGHTS, "insights"); scan(window.STEEL_FACILITIES, "facilities");
      return hits.slice(0, 10);
    }, HANJA.source);
    expect(found).toEqual([]);
    for (const id of ["ansteel", "hbis", "nipponsteel"]) {
      await page.locator(`#rank-table tr[data-id="${id}"]`).click();
      expect(await page.locator("#insight-box").innerText()).not.toMatch(HANJA);
    }
  });

  // ---------- 4단계 검수에서 발견·수정한 버그 회귀 테스트 ----------
  test("배당 전망: 영업손실이면 배당 0, 최근 3년 무배당이면 전망도 0", async ({ page }) => {
    const bad = await page.evaluate(() => {
      const C = Object.fromEntries(window.STEEL_DATA.companies.map((c) => [c.id, c]));
      const out = [];
      for (const [id, ys] of Object.entries(window.STEEL_FORECAST.companies)) {
        const noPay = [2023, 2024, 2025].every((y) => C[id].years[y].dps === 0);
        for (const [y, sc] of Object.entries(ys))
          for (const [s, r] of Object.entries(sc)) {
            if (r.dps > 0 && r.opIncomeUsdMn <= 0) out.push(`${id} ${y} ${s} 적자인데 배당 ${r.dps}`);
            if (noPay && r.dps > 0) out.push(`${id} ${y} ${s} 무배당사인데 배당 ${r.dps}`);
          }
      }
      return out;
    });
    expect(bad).toEqual([]);
  });

  test("깨진 출처 링크(404)는 링크 대신 '출처 확인 불가'로 표시", async ({ page }) => {
    const target = await page.evaluate(() => {
      for (const [id, ys] of Object.entries(window.STEEL_INSIGHTS))
        for (const [y, ins] of Object.entries(ys))
          if (["strategy", "issues"].some((k) => ins[k].some((it) => it.urlBroken)) && ["2023", "2024", "2025"].includes(y)) return { id, y };
      return null;
    });
    test.skip(!target, "깨진 링크 없음");
    await page.getByRole("button", { name: target.y, exact: true }).click();
    await page.locator(`#rank-table tr[data-id="${target.id}"]`).click();
    await expect(page.locator("#insight-box .src-broken").first()).toHaveText("출처 확인 불가");
    // 깨진 링크는 a 태그로 남아 있지 않음
    const brokenHrefs = await page.evaluate(() => {
      const bad = new Set();
      const walk = (o) => { if (o && typeof o === "object") for (const v of Object.values(o)) walk(v); if (o && o.urlBroken && o.url) bad.add(o.url); };
      walk(window.STEEL_INSIGHTS);
      return [...bad];
    });
    expect(brokenHrefs).toEqual([]);
  });

  test("키보드만으로 정렬·회사 선택 가능 (Tab + Enter)", async ({ page }) => {
    const th = page.locator('#rank-table th[data-sort="pbr"]');
    await th.focus();
    await page.keyboard.press("Enter");
    await expect(th).toHaveAttribute("aria-sort", "descending");
    const row = page.locator('#rank-table tr[data-id="posco"]');
    await row.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#insight-box")).toContainText("POSCO Holdings");
  });

  test("하단 출처에 전망 데이터(FRED·OECD)와 위치 데이터 출처 표기", async ({ page }) => {
    const src = page.locator("#source-text");
    for (const t of ["World Steel Association", "Yahoo Finance", "FRED", "OECD", "OpenAI", "Wikimedia", "OpenStreetMap"]) await expect(src).toContainText(t);
  });
});
