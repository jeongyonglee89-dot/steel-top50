// 지도·UI 로직. 데이터: data/companies.js (STEEL_DATA, 실적), data/forecast.js (STEEL_FORECAST, 전망),
// data/insights.js (STEEL_INSIGHTS, GPT 요약)

(function () {
  const { years, meta, companies } = window.STEEL_DATA;
  const INSIGHTS = window.STEEL_INSIGHTS ?? {};
  const FACILITIES = window.STEEL_FACILITIES ?? {};
  const FORECAST = window.STEEL_FORECAST ?? { years: [], scenarios: [], companies: {} };
  const SCENARIO_LABEL = { base: "Base", bull: "Bull", bear: "Bear" };
  const krwRate = (ccy) => (ccy === "KRW" ? 1 : meta.fx?.rates?.[ccy] ?? null);
  const isForecast = (y) => FORECAST.years.includes(y);

  // 실적/전망을 같은 모양으로 정규화. 금액은 모두 기준일 환율로 원화 환산
  //   money: 실적 = 매출액(조원), 전망 = 영업이익(조원)
  function vals(c, y) {
    if (!isForecast(y)) {
      const d = c.years[y];
      return { ...d, money: d.revenueKrw };
    }
    const f = FORECAST.companies[c.id]?.[y]?.[state.scenario] ?? {};
    const usd = krwRate("USD");
    const fx = f.dpsCcy ? krwRate(f.dpsCcy) : null;
    return {
      rank: c.years[FORECAST.baseYear]?.rank ?? null, // 전망은 기준연도(2025) WSA 순위 표시
      crude: f.crude ?? null,
      money: f.opIncomeUsdMn != null && usd ? (f.opIncomeUsdMn * usd) / 1e6 : null,
      ebitdaPct: f.ebitdaPct ?? null,
      pbr: f.pbr ?? null,
      dps: f.dps ?? null,
      dpsCcy: f.dpsCcy ?? null,
      dpsKrw: f.dps != null && fx ? f.dps * fx : null,
      payoutPct: f.payoutPct ?? null,
      opMarginPct: f.opMarginPct ?? null,
      // 80% 예측구간 (영업이익은 USD 백만 → 조원)
      pi80: f.pi80
        ? {
            crude: f.pi80.crude,
            money: f.pi80.opIncomeUsdMn && usd ? f.pi80.opIncomeUsdMn.map((v) => (v * usd) / 1e6) : null,
            ebitdaPct: f.pi80.ebitdaPct,
            pbr: f.pi80.pbr
          }
        : {}
    };
  }

  // 정렬 가능한 지표
  const METRICS = {
    crude: { label: "조강량", sortValue: (v) => v.crude },
    revenue: { label: "매출액", forecastLabel: "영업이익", sortValue: (v) => v.money },
    ebitdaPct: { label: "EBITDA %", sortValue: (v) => v.ebitdaPct },
    pbr: { label: "PBR", sortValue: (v) => v.pbr },
    dps: { label: "주당배당금", sortValue: (v) => v.dpsKrw }
  };
  const metricLabel = (key) => (isForecast(state.year) && METRICS[key].forecastLabel) || METRICS[key].label;
  const yearLabel = (y) => (isForecast(y) ? `${y}E 전망 (${SCENARIO_LABEL[state.scenario]})` : `${y}년 실적`);

  const state = {
    year: years[0],
    scenario: "base",
    excludeChina: false,
    sortKey: "crude",
    sortDesc: true,
    selectedId: null,
    markers: {}
  };

  // ---------- 포맷 ----------
  const won = (v, digits = 0) =>
    v.toLocaleString("ko-KR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

  const fmt = {
    crude: (v) => (v == null ? "N/A" : `${v.toFixed(1)} Mt`),
    revenue: (v) => (v == null ? "N/A" : `₩${won(v, 1)}조`),
    ebitdaPct: (v) => (v == null ? "N/A" : `${v.toFixed(1)} %`),
    pbr: (v) => (v == null ? "N/A" : `${v.toFixed(2)} 배`),
    dps: (d) =>
      d.dpsKrw == null
        ? "N/A"
        : `₩${won(d.dpsKrw)}` + (d.dpsCcy !== "KRW" ? ` <small>(${d.dps.toLocaleString("en-US")} ${d.dpsCcy})</small>` : ""),
    rank: (v) => (v == null ? "-" : `#${v}`)
  };

  // 표 셀용: 단위는 헤더에 표시하고 숫자만
  const num = (v, digits) => (v == null ? "N/A" : won(v, digits));

  // 비상장사는 재무지표를 "N/A (비상장)"으로 표시
  // 비상장 → "N/A (비상장)", 상장사인데 값이 없음(러시아 제재, Yahoo 미제공 등) → "데이터 없음"
  const NO_DATA = "데이터 없음";
  const naLabel = (c) => (c.listed ? NO_DATA : "N/A (비상장)");
  const fin = (c, text, v) => (c.ticker == null ? naLabel(c) : v == null ? NO_DATA : text);
  const cell = (v, digits) => (v == null ? `<span class="nd">${NO_DATA}</span>` : won(v, digits));

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

  // CI: 로고 파일이 없으면 이니셜 배지
  function logoHtml(c, size) {
    if (c.logo) return `<img class="logo logo-${size}" src="${c.logo}" alt="${c.name} CI" />`;
    const initials = c.name.replace(/\(.*?\)/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("");
    return `<span class="logo logo-${size} logo-fallback" title="CI 없음">${initials}</span>`;
  }

  const isChina = (c) => c.country === "China";
  const visibleCompanies = () => companies.filter((c) => !(state.excludeChina && isChina(c)));
  const byId = Object.fromEntries(companies.map((c) => [c.id, c]));

  // ---------- 지도 ----------
  const map = L.map("map", { minZoom: 1, maxZoom: 7 }).setView([30, 60], 2);

  // 타일 서버 대신 로컬 국가 경계 GeoJSON(data/world.js) 사용
  // (OSM 타일 403, CARTO "API KEY REQUIRED" — file:// 실행 시 차단됨)
  map.getContainer().style.background = "#ffffff";
  L.geoJSON(window.WORLD_GEO, {
    interactive: false,
    style: { color: "#ffffff", weight: 0.8, fillColor: "#efefec", fillOpacity: 1, className: "country" }
  }).addTo(map);
  map.attributionControl.addAttribution("Boundaries: Natural Earth");

  // 전망 80% 예측구간 표기 "(lo~hi)"
  const pi = (d, key, f) => {
    const r = d.pi80?.[key];
    return r && r[0] != null ? ` <small class="pi">(${f(r[0])}~${f(r[1])})</small>` : "";
  };

  function popupHtml(c, year) {
    const d = vals(c, year);
    const fc = isForecast(year);
    return `
      <div class="popup ${fc ? "popup-forecast" : "popup-actual"}">
        <div class="popup-head">${logoHtml(c, "sm")}<h3>${c.name} <small>${c.nameKo}</small></h3></div>
        <div>본사 <strong>${c.countryKo ?? c.country}</strong> ${c.hq} · <strong>${yearLabel(year)}</strong> · ${fc ? `${FORECAST.baseYear}년 ` : ""}WSA ${fmt.rank(d.rank)}</div>
        <table>
          <tr><td>조강량</td><td>${fmt.crude(d.crude)}${pi(d, "crude", (v) => v.toFixed(1))}</td></tr>
          <tr><td>${fc ? "영업이익" : "매출액"}</td><td>${fin(c, fmt.revenue(d.money) + pi(d, "money", (v) => won(v, 1)), d.money)}</td></tr>
          <tr><td>EBITDA %</td><td>${fin(c, fmt.ebitdaPct(d.ebitdaPct) + pi(d, "ebitdaPct", (v) => v.toFixed(1)), d.ebitdaPct)}</td></tr>
          <tr><td>PBR</td><td>${fin(c, fmt.pbr(d.pbr) + pi(d, "pbr", (v) => v.toFixed(2)), d.pbr)}</td></tr>
          <tr><td>주당배당금</td><td>${fin(c, fmt.dps(d), d.dpsKrw)}</td></tr>
          ${fc ? `<tr><td>배당성향</td><td>${fin(c, `${d.payoutPct?.toFixed(0)} %`, d.payoutPct)}</td></tr>` : ""}
        </table>
        ${fc && FORECAST.status === "pending" ? `<div class="note">전망 모델링 전 — ${FORECAST.statusNote}</div>` : ""}
        ${fc && FORECAST.status === "ready" ? `<div class="note">전망: ${FORECAST.statusNote} · 괄호는 80% 예측구간</div>` : ""}
        ${c.tickerNote ? `<div class="note">${c.ticker ?? ""} ${c.tickerNote}${!fc && d.fyLabel && c.fyEnd !== "12" ? ` · ${d.fyLabel}` : ""}</div>` : ""}
      </div>`;
  }

  // ---------- F6: 마커 크기·색 = 선택(정렬) 지표 ----------
  // 크기: 면적 ∝ |값| (반지름 R_MIN~R_MAX), 색: 단일 색상(파랑) 5단계 분위 — dataviz 검증 통과 램프(지도 육지·바다 대비 2:1 이상)
  // 음수(영업손실 등)는 빨강, 값 없음은 속이 빈 회색
  const RAMP = ["#5fb488", "#2e9566", "#197a56", "#105b40", "#073b28"];
  const NEG_COLOR = "#e34948";
  const NA_COLOR = "#9a9a96";
  const R_MIN = 4, R_MAX = 12;
  let markerScale = null; // renderMarkers에서 계산 → 범례에서 사용

  function computeScale() {
    const get = METRICS[state.sortKey].sortValue;
    const values = visibleCompanies().map((c) => get(vals(c, state.year))).filter((v) => v != null);
    const maxAbs = Math.max(...values.map(Math.abs), 1e-9);
    const pos = values.filter((v) => v > 0).sort((a, b) => a - b);
    // 분위 경계 (양수 값 기준 20/40/60/80%)
    const breaks = [0.2, 0.4, 0.6, 0.8].map((q) => (pos.length ? pos[Math.min(pos.length - 1, Math.floor(q * pos.length))] : 0));
    return { get, maxAbs, breaks, hasNeg: values.some((v) => v < 0), hasNa: values.length < visibleCompanies().length };
  }

  const radiusOf = (v) => (v == null ? R_MIN : R_MIN + (R_MAX - R_MIN) * Math.sqrt(Math.abs(v) / markerScale.maxAbs));
  const colorOf = (v) => {
    if (v == null) return null;
    if (v < 0) return NEG_COLOR;
    return RAMP[markerScale.breaks.filter((b) => v >= b).length];
  };

  // ---------- 모션 (prefers-reduced-motion이면 즉시 적용) ----------
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  function tween(from, to, ms, onStep) {
    if (REDUCED || from === to) return onStep(to);
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min((now - t0) / ms, 1);
      onStep(from + (to - from) * ease(t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function styleMarker(c) {
    const v = markerScale.get(vals(c, state.year));
    const fill = colorOf(v);
    state.markers[c.id].setStyle({
      radius: radiusOf(v),
      fillColor: fill ?? "#ffffff",
      fillOpacity: fill ? 0.9 : 0.6,
      color: fill ? "#ffffff" : NA_COLOR, // 겹친 마커 구분용 흰 테두리, 값 없음은 회색 테두리
      weight: fill ? 1.5 : 1.5,
      dashArray: fill ? null : "2 2"
    });
    // 크기 변화는 부드럽게 (목표 반지름은 겹침 계산용으로 저장)
    const m = state.markers[c.id];
    const target = radiusOf(v);
    const from = m._targetR ?? m.getRadius();
    m._targetR = target;
    m.setRadius(from);
    tween(from, target, 500, (r) => m.setRadius(r));
  }

  companies.forEach((c) => {
    const marker = L.circleMarker([c.lat, c.lng], {
      radius: 7,
      color: "#fff",
      weight: 1.5,
      fillColor: RAMP[2],
      fillOpacity: 0.9,
      className: `company-marker marker-${c.id}`
    });
    marker.bindTooltip(`${c.name}<br><small>${c.nameKo} · ${c.countryKo ?? c.country}</small>`, { direction: "top", offset: [0, -6] });
    marker.on("mouseover", () => linkHover(c.id, true));
    marker.on("mouseout", () => linkHover(c.id, false));
    marker.on("click", () => {
      selectCompany(c.id);
      focusCompany(c);
    });
    state.markers[c.id] = marker;
  });

  function renderMarkers() {
    const visible = new Set(visibleCompanies().map((c) => c.id));
    markerScale = computeScale();
    companies.forEach((c) => {
      const marker = state.markers[c.id];
      marker.bindPopup(popupHtml(c, state.year), {
        maxWidth: 260,
        autoPanPaddingTopLeft: L.point(getComputedStyle(insightBox).position === "absolute" ? insightBox.offsetLeft + 420 : 20, 20)
      });
      if (visible.has(c.id)) {
        marker.addTo(map);
        styleMarker(c);
      } else marker.remove();
    });
    // 큰 마커가 위에 덮지 않도록 작은 값이 위로
    visibleCompanies()
      .slice()
      .sort((a, b) => (state.markers[b.id]._targetR ?? 0) - (state.markers[a.id]._targetR ?? 0))
      .forEach((c) => state.markers[c.id].bringToFront());
    declutter();
    renderLegend();
  }

  // ---------- F8: 겹치는 본사 마커 펼치기 ----------
  // 현재 줌의 화면 좌표에서 겹치는 마커끼리 서로 밀어내고(충돌 완화), 원래 위치로 약하게 당겨
  // 실제 위치 근처에 겹치지 않게 배치. 옮겨진 마커는 실제 위치까지 가는 선을 그림.
  // (클러스터링과 달리 50개 마커가 항상 보이고 클릭 가능)
  const leaderLayer = L.layerGroup().addTo(map);
  const GAP_PX = 2; // 마커 사이 최소 간격

  function declutter() {
    leaderLayer.clearLayers();
    const z = map.getZoom();
    const items = visibleCompanies().map((c, i) => {
      const o = map.project([c.lat, c.lng], z);
      // 완전히 같은 좌표는 순서대로 살짝 벌려 시작 (밀어낼 방향이 생기도록)
      const a = i * 2.399; // 황금각
      const mk = state.markers[c.id];
      return { c, o, r: mk._targetR ?? mk.getRadius(), x: o.x + Math.cos(a) * 0.5, y: o.y + Math.sin(a) * 0.5 };
    });

    for (let iter = 0; iter < 300; iter++) {
      let moved = false;
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i], b = items[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.01;
          const minD = a.r + b.r + GAP_PX;
          if (d < minD) {
            const push = (minD - d) / 2 + 0.01;
            a.x -= (dx / d) * push; a.y -= (dy / d) * push;
            b.x += (dx / d) * push; b.y += (dy / d) * push;
            moved = true;
          }
        }
      }
      // 원래 위치로 당기는 힘 (겹침이 없을 때만 작동해서 수렴)
      if (!moved) break;
      for (const it of items) {
        it.x += (it.o.x - it.x) * 0.02;
        it.y += (it.o.y - it.y) * 0.02;
      }
    }

    for (const it of items) {
      const m = state.markers[it.c.id];
      if (Math.hypot(it.x - it.o.x, it.y - it.o.y) < 1) {
        m.setLatLng([it.c.lat, it.c.lng]);
        continue;
      }
      const ll = map.unproject(L.point(it.x, it.y), z);
      m.setLatLng(ll);
      L.polyline([[it.c.lat, it.c.lng], ll], { color: "#555", weight: 1, opacity: 0.45, interactive: false }).addTo(leaderLayer);
    }
  }
  map.on("zoomend", declutter);

  // ---------- F11: 범례 (지도 우하단) ----------
  const legend = L.control({ position: "bottomright" });
  legend.onAdd = () => {
    const div = L.DomUtil.create("div", "map-legend");
    L.DomEvent.disableClickPropagation(div);
    return div;
  };
  legend.addTo(map);

  const UNIT = { crude: "Mt", revenue: "조원", ebitdaPct: "%", pbr: "배", dps: "원" };
  function renderLegend() {
    const el = document.querySelector(".map-legend");
    if (!el || !markerScale) return;
    const key = state.sortKey;
    const f = (v) => (Math.abs(v) >= 100 ? won(v, 0) : Math.abs(v) >= 10 ? won(v, 1) : won(v, 2));
    const sizes = [markerScale.maxAbs, markerScale.maxAbs / 4, markerScale.maxAbs / 16];
    const sizeSvg = sizes
      .map((v) => {
        const r = radiusOf(v);
        return `<span class="lg-size"><svg width="${R_MAX * 2 + 2}" height="${R_MAX * 2 + 2}"><circle cx="${R_MAX + 1}" cy="${R_MAX + 1}" r="${r}" fill="${RAMP[2]}" stroke="#fff"/></svg>${f(v)}</span>`;
      })
      .join("");
    const b = markerScale.breaks;
    const bins = RAMP.map((col, i) => {
      const label = i === 0 ? `< ${f(b[0])}` : i === RAMP.length - 1 ? `≥ ${f(b[i - 1])}` : `${f(b[i - 1])}~`;
      return `<span class="lg-bin"><i style="background:${col}"></i>${label}</span>`;
    }).join("");
    el.innerHTML = `
      <div class="lg-title">본사 ● ${metricLabel(key)} <small>(${UNIT[key]}, ${isForecast(state.year) ? `${state.year}E` : state.year})</small></div>
      <div class="lg-row">${sizeSvg}</div>
      <div class="lg-row lg-bins">${bins}</div>
      <div class="lg-row">
        ${markerScale.hasNeg ? `<span class="lg-bin"><i style="background:${NEG_COLOR}"></i>음수</span>` : ""}
        ${markerScale.hasNa ? `<span class="lg-bin"><i class="lg-na"></i>값 없음</span>` : ""}
        <span class="lg-bin"><i class="lg-leader"></i>실제 위치</span>
      </div>
      <div class="lg-title lg-sub">주요 사업장 ◆ <small>(회사 클릭 시)</small></div>
      <div class="lg-row">
        <span class="lg-bin"><i class="lg-diamond bf"></i>고로</span>
        <span class="lg-bin"><i class="lg-diamond eaf"></i>전기로</span>
        <span class="lg-bin"><i class="lg-diamond mix"></i>고로+전기로</span>
        <span class="lg-bin"><i class="lg-diamond roll"></i>압연</span>
      </div>
      <div class="lg-note">표 머리글을 클릭하면 마커 기준 지표가 바뀝니다</div>`;
  }

  // ---------- 회사 인사이트 박스 (GPT 요약, 선택 연도 기준) ----------
  const insightBox = document.getElementById("insight-box");

  const listHtml = (items) =>
    items.length
      ? `<ul>${items
          .map((it) => {
            const text = typeof it === "string" ? it : it.text;
            const url = typeof it === "string" ? null : it.url;
            return `<li>${escapeHtml(text)}${Portfolio.srcLink(url, it.urlBroken)}</li>`;
          })
          .join("")}</ul>`
      : `<p class="empty">확인된 내용 없음</p>`;

  // 보도자료도 전략·이슈와 같은 형식: "날짜 제목 출처"
  const newsHtml = (news) =>
    news.length
      ? `<ul class="news">${news
          .map((n) => `<li><span class="date">${escapeHtml(n.date)}</span> ${escapeHtml(n.title)}${Portfolio.srcLink(n.url, n.urlBroken)}</li>`)
          .join("")}</ul>`
      : `<p class="empty">확인된 보도자료 없음</p>`;

  function renderInsight() {
    const c = byId[state.selectedId];
    if (!c || (state.excludeChina && isChina(c))) {
      insightBox.hidden = true;
      return;
    }
    // 전망 연도는 기준연도(최근 실적) 요약을 보여줌
    const y = isForecast(state.year) ? FORECAST.baseYear : state.year;
    const ins = INSIGHTS[c.id]?.[y];
    const fac = FACILITIES[c.id]?.[y];
    insightBox.hidden = false;
    insightBox.innerHTML = `
      <button type="button" class="close" aria-label="닫기">×</button>
      <div class="insight-head">
        ${logoHtml(c, "lg")}
        <div>
          <h3>${c.name}</h3>
          <div class="sub">${c.nameKo} · 본사 ${c.countryKo ?? c.country} ${c.hq} · <strong>${y}년 기준</strong>${isForecast(state.year) ? " (최근 실적)" : ""}</div>
        </div>
      </div>
      <section class="facility"><h4>설비 포트폴리오</h4>${Portfolio.facilitySection(fac, c.years[y]?.crude)}</section>
      ${
        ins
          ? `
        <section><h4>주요 제품 포트폴리오</h4>${Portfolio.productCards(ins.products)}</section>
        <section><h4>전략 방향</h4>${listHtml(ins.strategy)}</section>
        <section><h4>최근 보도자료</h4>${newsHtml(ins.news)}</section>
        <section><h4>이슈·리스크</h4>${listHtml(ins.issues)}</section>`
          : `<p class="empty">${y}년 인사이트 데이터가 없습니다. <code>node scripts/fetch_insights.mjs</code>로 생성하세요.</p>`
      }
      <p class="disclaimer">설비·요약: GPT${fac ? `(${fac.model})` : ""} + 웹검색 자동 생성${ins ? ` · 생성일 ${ins.generatedAt}` : ""} · 사업장 위치: OpenStreetMap Nominatim · 사실관계는 출처로 확인 필요</p>`;
    insightBox.querySelector(".close").addEventListener("click", () => {
      state.selectedId = null;
      insightBox.hidden = true;
      highlightRow(null);
      renderPlants();
    });
    insightBox.scrollTop = 0;
  }

  // ---------- 주요 사업장 (선택한 회사만 지도에 표시) ----------
  const plantLayer = L.layerGroup().addTo(map);

  function selectedPlants() {
    const c = byId[state.selectedId];
    if (!c || (state.excludeChina && isChina(c))) return { c: null, plants: [] };
    const y = isForecast(state.year) ? FORECAST.baseYear : state.year;
    return { c, plants: (FACILITIES[c.id]?.[y]?.plants ?? []).filter((pl) => pl.lat != null) };
  }

  function renderPlants() {
    plantLayer.clearLayers();
    const { c, plants } = selectedPlants();
    if (!c) return;
    plants.forEach((pl) => {
      const color = Portfolio.PROCESS_COLOR[pl.process] ?? Portfolio.PROCESS_COLOR["압연"];
      const procClass = Portfolio.PROCESS_CLASS[pl.process] ?? "roll";
      // 본사와 사업장 연결선
      L.polyline([[c.lat, c.lng], [pl.lat, pl.lng]], { color, weight: 1.2, opacity: 0.8, interactive: false, className: "plant-line" }).addTo(plantLayer);
      L.marker([pl.lat, pl.lng], {
        icon: L.divIcon({ className: `plant-marker proc-${procClass}`, html: "<span></span>", iconSize: [14, 14] }),
        keyboard: false
      })
        .bindTooltip(
          `<strong>${escapeHtml(pl.name)}</strong><br>${escapeHtml(pl.process)} · ${pl.products.map(escapeHtml).join("·")}` +
            (pl.capacityMt != null ? `<br>조강능력 ${pl.capacityMt} Mt` : "")
        )
        .addTo(plantLayer);
    });
  }

  // 요약 박스에 가리지 않도록 박스 오른쪽 영역에 본사+사업장이 들어오게 이동
  function focusCompany(c) {
    const { plants } = selectedPlants();
    // 요약 박스가 지도 위에 떠 있을 때(넓은 화면)만 그만큼 피해서 맞춤
    const overlay = !insightBox.hidden && getComputedStyle(insightBox).position === "absolute";
    const left = overlay ? insightBox.offsetLeft + insightBox.offsetWidth + 30 : 40;
    const pts = [[c.lat, c.lng], ...plants.map((pl) => [pl.lat, pl.lng])];
    if (pts.length > 1) {
      map.flyToBounds(L.latLngBounds(pts), { paddingTopLeft: [left, 60], paddingBottomRight: [170, 40], maxZoom: 6, duration: 0.6 });
    } else {
      const zoom = Math.max(map.getZoom(), 5);
      const offset = (left - 40) / 2;
      map.flyTo(map.unproject(map.project([c.lat, c.lng], zoom).subtract([offset, 0]), zoom), zoom, { duration: 0.6 });
    }
  }

  function selectCompany(id) {
    state.selectedId = id;
    highlightRow(id);
    renderInsight();
    renderPlants();
  }

  // ---------- 순위표 ----------
  const tableBody = document.querySelector("#rank-table tbody");
  const tableTitle = document.getElementById("table-title");

  // 선택 지표 기준 정렬. 값이 없는 회사(비상장 등)는 항상 맨 아래
  function sortedRows() {
    const y = state.year;
    const get = METRICS[state.sortKey].sortValue;
    return visibleCompanies()
      .slice()
      .sort((a, b) => {
        const va = get(vals(a, y));
        const vb = get(vals(b, y));
        if (va == null && vb == null) return (vals(a, y).rank ?? Infinity) - (vals(b, y).rank ?? Infinity);
        if (va == null) return 1;
        if (vb == null) return -1;
        return state.sortDesc ? vb - va : va - vb;
      });
  }

  function renderTable() {
    const y = state.year;
    const get = METRICS[state.sortKey].sortValue;
    const rows = sortedRows();

    tableTitle.textContent =
      `${yearLabel(y)} · ${metricLabel(state.sortKey)} 순위` +
      ` (${rows.length}개사${state.excludeChina ? ", 중국 제외" : ""})`;
    document.getElementById("action-title").textContent = actionTitle(rows, y);
    renderKpis(rows, y);

    // FLIP: 재정렬 전 행 위치 기억 → 새 위치에서 이전 위치로 되돌렸다가 미끄러지듯 이동
    const before = {};
    tableBody.querySelectorAll("tr[data-id]").forEach((tr) => (before[tr.dataset.id] = tr.getBoundingClientRect().top));

    let pos = 0;
    tableBody.innerHTML = rows
      .map((c) => {
        const d = vals(c, y);
        const hasValue = get(d) != null;
        if (hasValue) pos += 1;
        const localDps = d.dps != null && d.dpsCcy !== "KRW" ? ` title="${d.dps.toLocaleString("en-US")} ${d.dpsCcy}"` : "";
        const allMissing = [d.money, d.ebitdaPct, d.pbr, d.dpsKrw].every((v) => v == null);
        const finCells =
          c.ticker == null
            ? `<td class="na" colspan="4">${naLabel(c)}</td>`
            : allMissing
              ? `<td class="na" colspan="4">${NO_DATA}</td>`
              : `<td>${cell(d.money, 1)}</td><td>${cell(d.ebitdaPct, 1)}</td><td>${cell(d.pbr, 2)}</td>` +
                `<td class="dps"${localDps}>${cell(d.dpsKrw, 0)}</td>`;
        return `
          <tr data-id="${c.id}" tabindex="0"${c.id === state.selectedId ? ' class="selected"' : ""}>
            <td class="rank">${hasValue ? pos : "-"}</td>
            <td class="name">
              ${logoHtml(c, "xs")}
              <div><div class="nm">${c.name}</div><small>${c.nameKo} · ${c.countryKo ?? c.country} · ${isForecast(y) ? `${FORECAST.baseYear} ` : ""}WSA #${d.rank ?? "-"}</small></div>
            </td>
            <td>${num(d.crude, 1)}${d.crudeEstimate ? "<sup>e</sup>" : ""}</td>
            ${finCells}
          </tr>`;
      })
      .join("");

    if (!REDUCED && Object.keys(before).length) {
      const moved = [];
      tableBody.querySelectorAll("tr[data-id]").forEach((tr) => {
        const prev = before[tr.dataset.id];
        if (prev == null) return;
        const dy = prev - tr.getBoundingClientRect().top;
        if (Math.abs(dy) < 1) return;
        tr.style.transform = `translateY(${dy}px)`;
        tr.style.transition = "none";
        moved.push(tr);
      });
      requestAnimationFrame(() =>
        moved.forEach((tr) => {
          tr.style.transition = "transform 0.5s cubic-bezier(.2,.7,.2,1)";
          tr.style.transform = "";
        })
      );
    }

    document.querySelector('#rank-table th[data-sort="revenue"] .th-label').textContent = metricLabel("revenue");

    const banner = document.getElementById("forecast-banner");
    banner.hidden = !isForecast(y);
    if (FORECAST.status !== "ready") {
      banner.textContent = `전망 데이터 준비 중 — ${FORECAST.statusNote}`;
    } else {
      const M = FORECAST.models;
      const r2txt = (m) => `R² ${m.r2.toFixed(3)}` + (m.r2Within != null ? ` (within ${m.r2Within.toFixed(3)})` : "");
      banner.innerHTML =
        `<strong>회귀 전망</strong> · ${FORECAST.statusNote} · 생성 ${FORECAST.generatedAt}<br>` +
        ["crude", "opm", "ebitda", "pbr"].map((k) => `${M[k].label} ${r2txt(M[k])}`).join(" · ") +
        ` · 주당배당금 규칙 기반(3년 평균 배당성향)`;
    }

    // 전망 모드: 열 머리글에 해당 회귀모델 R² 병기 (within R²는 툴팁)
    const R2_OF = { crude: "crude", revenue: "opm", ebitdaPct: "ebitda", pbr: "pbr" };
    document.querySelectorAll("#rank-table th[data-sort]").forEach((th) => {
      let el = th.querySelector(".r2");
      if (!el) {
        el = document.createElement("small");
        el.className = "r2";
        th.appendChild(el);
      }
      const m = FORECAST.models?.[R2_OF[th.dataset.sort]];
      const show = isForecast(y) && FORECAST.status === "ready";
      el.textContent = !show ? "" : m ? `R² ${m.r2.toFixed(2)}` : "규칙 기반";
      el.title = show && m ? `${m.label}: R² ${m.r2} · within R² ${m.r2Within ?? "—"} · n=${m.n} · ${m.spec}` : "";
    });

    document.querySelectorAll("#rank-table th[data-sort]").forEach((th) => {
      const active = th.dataset.sort === state.sortKey;
      th.classList.toggle("sorted", active);
      th.querySelector(".arrow").textContent = active ? (state.sortDesc ? "▼" : "▲") : "";
      th.setAttribute("aria-sort", active ? (state.sortDesc ? "descending" : "ascending") : "none");
    });
  }

  // ---------- 액션 타이틀: 선택 지표의 핵심 메시지를 한 문장으로 ----------
  function actionTitle(rows, y) {
    const key = state.sortKey;
    const get = METRICS[key].sortValue;
    const list = rows.map((c) => ({ c, v: get(vals(c, y)) })).filter((x) => x.v != null);
    if (!list.length) return `${yearLabel(y)} — ${metricLabel(key)} 데이터 없음`;
    const top = [...list].sort((a, b) => b.v - a.v);
    const lead = top[0];
    const scope = state.excludeChina ? "중국 외" : "Top 50";
    const name = (x) => x.c.nameKo || x.c.name;
    const sum = (a) => a.reduce((s, x) => s + x.v, 0);
    const share = (k) => Math.round((sum(top.slice(0, k)) / sum(top)) * 100);
    switch (key) {
      case "crude":
        return `상위 10개사가 ${scope} 조강량의 ${share(10)}% 차지 — 1위 ${name(lead)} ${won(lead.v, 1)} Mt`;
      case "revenue":
        return isForecast(y)
          ? `${name(lead)} 영업이익 ₩${won(lead.v, 1)}조로 1위 — 상위 5개사가 합계의 ${share(5)}%`
          : `${name(lead)} 매출 ₩${won(lead.v, 1)}조로 1위 — 상위 5개사가 합계의 ${share(5)}%`;
      case "ebitdaPct": {
        const avg = sum(list) / list.length;
        return `EBITDA 마진 1위 ${name(lead)} ${lead.v.toFixed(1)}% — 평균 ${avg.toFixed(1)}% 대비 +${(lead.v - avg).toFixed(1)}%p`;
      }
      case "pbr": {
        const below = list.filter((x) => x.v < 1).length;
        return `${list.length}개사 중 ${below}개사가 PBR 1배 미만 — 업종 전반 저평가, 1위 ${name(lead)} ${lead.v.toFixed(2)}배`;
      }
      case "dps": {
        const payers = list.filter((x) => x.v > 0).length;
        return `${list.length}개사 중 ${payers}개사 배당 — 주당배당금 1위 ${name(lead)} ₩${won(lead.v, 0)}`;
      }
    }
    return "";
  }

  // ---------- F9: 요약 KPI (선택 연도·필터 기준) ----------
  function renderKpis(rows, y) {
    const v = rows.map((c) => vals(c, y));
    const pick = (k) => v.map((d) => d[k]).filter((x) => x != null);
    const sum = (a) => a.reduce((s, x) => s + x, 0);
    const median = (a) => {
      if (!a.length) return null;
      const s = [...a].sort((x, y) => x - y);
      const m = Math.floor(s.length / 2);
      return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
    };
    const crude = pick("crude"), money = pick("money"), ebitda = pick("ebitdaPct"), pbr = pick("pbr");
    const n = (a) => `${a.length}개사`;
    const tiles = [
      { label: "조강량 합계", v: crude.length ? sum(crude) : null, f: (x) => `${won(x, 1)} Mt`, note: n(crude) },
      { label: `${metricLabel("revenue")} 합계`, v: money.length ? sum(money) : null, f: (x) => `₩${won(x, 1)}조`, note: n(money) },
      { label: "EBITDA 마진 평균", v: ebitda.length ? sum(ebitda) / ebitda.length : null, f: (x) => `${x.toFixed(1)}%`, note: `단순평균 · ${n(ebitda)}` },
      { label: "PBR 중앙값", v: pbr.length ? median(pbr) : null, f: (x) => `${x.toFixed(2)}배`, note: n(pbr) }
    ];
    const bar = document.getElementById("kpi-bar");
    if (bar.children.length !== tiles.length) {
      bar.innerHTML = tiles.map(() => `<div class="kpi"><div class="kpi-label"></div><div class="kpi-value"></div><div class="kpi-note"></div></div>`).join("");
    }
    // 숫자는 이전 값에서 새 값으로 카운트업
    tiles.forEach((t, i) => {
      const el = bar.children[i];
      el.querySelector(".kpi-label").textContent = t.label;
      el.querySelector(".kpi-note").textContent = t.note;
      const valEl = el.querySelector(".kpi-value");
      if (t.v == null) {
        valEl.textContent = "N/A";
        valEl._v = null;
        return;
      }
      const from = valEl._v ?? t.v;
      valEl._v = t.v;
      tween(from, t.v, 600, (x) => (valEl.textContent = t.f(x)));
    });
  }

  function linkHover(id, on) {
    tableBody.querySelector(`tr[data-id="${id}"]`)?.classList.toggle("hover", on);
    const el = state.markers[id]?.getElement();
    if (el) el.classList.toggle("hl", on);
    if (on) state.markers[id]?.bringToFront();
  }
  tableBody.addEventListener("mouseover", (e) => {
    const tr = e.target.closest("tr[data-id]");
    if (tr && !tr.contains(e.relatedTarget)) linkHover(tr.dataset.id, true);
  });
  tableBody.addEventListener("mouseout", (e) => {
    const tr = e.target.closest("tr[data-id]");
    if (tr && !tr.contains(e.relatedTarget)) linkHover(tr.dataset.id, false);
  });

  function highlightRow(id) {
    tableBody.querySelectorAll("tr").forEach((tr) => {
      const on = tr.dataset.id === id;
      tr.classList.toggle("selected", on);
      if (on) tr.scrollIntoView({ block: "nearest" });
    });
  }

  // 키보드: 행에서 Enter/Space = 클릭
  tableBody.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("tr[data-id]")) {
      e.preventDefault();
      e.target.click();
    }
  });

  tableBody.addEventListener("click", (e) => {
    const tr = e.target.closest("tr[data-id]");
    if (!tr) return;
    const marker = state.markers[tr.dataset.id];
    selectCompany(tr.dataset.id);
    focusCompany(byId[tr.dataset.id]);
    // 본사+사업장에 맞춘 화면을 팝업 autoPan이 다시 옮기지 않도록 이때만 autoPan 끔
    map.once("moveend", () => {
      const popup = marker.getPopup();
      popup.options.autoPan = false;
      marker.openPopup();
      popup.options.autoPan = true;
    });
  });

  // 지표 헤더 클릭: 같은 지표면 내림/오름차순 전환, 다른 지표면 내림차순으로 시작
  document.querySelectorAll("#rank-table th[data-sort]").forEach((th) => {
    // 키보드 접근: 탭 이동 + Enter/Space 정렬
    th.tabIndex = 0;
    th.setAttribute("role", "button");
    th.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        th.click();
      }
    });
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      state.sortDesc = state.sortKey === key ? !state.sortDesc : true;
      state.sortKey = key;
      renderTable();
      renderMarkers();
    });
  });

  // ---------- 중국 철강사 제외 ----------
  document.getElementById("exclude-china").addEventListener("change", (e) => {
    state.excludeChina = e.target.checked;
    map.closePopup();
    renderMarkers();
    renderTable();
    renderInsight();
    renderPlants();
  });

  // ---------- 연도 선택 ----------
  // 실적 탭(2023~2025)과 전망 탭(2026E~2028E)
  const addYearButtons = (el, list, suffix) =>
    list
      .slice()
      .sort()
      .forEach((y) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = `${y}${suffix}`;
        btn.dataset.year = y;
        btn.addEventListener("click", () => setYear(y));
        el.appendChild(btn);
      });
  addYearButtons(document.getElementById("year-actual"), years, "");
  addYearButtons(document.getElementById("year-forecast"), FORECAST.years, "E");

  const scenarioSelector = document.getElementById("scenario-selector");
  FORECAST.scenarios.forEach((sc) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = SCENARIO_LABEL[sc];
    btn.dataset.scenario = sc;
    btn.addEventListener("click", () => {
      state.scenario = sc;
      setYear(state.year);
    });
    scenarioSelector.appendChild(btn);
  });

  // ▶ 연도 재생: 2023 → 2028E 를 차례로 (마지막에서 멈춤, 다시 누르면 정지)
  const playBtn = document.getElementById("play-btn");
  const SEQ = [...years.slice().sort(), ...FORECAST.years];
  let playTimer = null;
  function stopPlay() {
    clearInterval(playTimer);
    playTimer = null;
    playBtn.textContent = "▶ 연도 재생";
    playBtn.setAttribute("aria-pressed", "false");
  }
  playBtn.addEventListener("click", () => {
    if (playTimer) return stopPlay();
    let i = -1; // 항상 첫 해(2023)부터
    playBtn.textContent = "❚❚ 정지";
    playBtn.setAttribute("aria-pressed", "true");
    const tick = () => {
      i += 1;
      setYear(SEQ[i], { keepPlaying: true });
      if (i >= SEQ.length - 1) stopPlay();
    };
    tick();
    playTimer = setInterval(tick, 1800);
  });

  function setYear(y, opts = {}) {
    if (!opts.keepPlaying && playTimer) stopPlay();
    state.year = y;
    const fc = isForecast(y);
    document.body.classList.toggle("mode-forecast", fc);
    document.body.classList.toggle("mode-actual", !fc);
    document.querySelectorAll(".year-selector button").forEach((b) => {
      b.classList.toggle("active", Number(b.dataset.year) === y);
    });
    scenarioSelector.hidden = !fc;
    scenarioSelector.querySelectorAll("button").forEach((b) => {
      b.classList.toggle("active", b.dataset.scenario === state.scenario);
    });
    map.closePopup();
    renderMarkers();
    renderTable();
    renderInsight();
    renderPlants();
  }

  // ---------- 환율 기준 / 출처 ----------
  if (meta.fx) {
    // 주요 통화만 상단에 표시, 나머지는 마우스오버(title)로
    const MAIN = ["USD", "CNY", "JPY", "EUR"];
    const rank = (ccy) => (MAIN.includes(ccy) ? MAIN.indexOf(ccy) : MAIN.length);
    const rates = Object.entries(meta.fx.rates).sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]));
    const fmtRate = ([ccy, r]) => `${ccy} ₩${won(r, r < 1 ? 4 : r < 100 ? 2 : 1)}`;
    const main = rates.filter(([ccy]) => MAIN.includes(ccy));
    const rest = rates.filter(([ccy]) => !MAIN.includes(ccy));
    const fxInfo = document.getElementById("fx-info");
    fxInfo.innerHTML =
      `환율 기준 <strong>${meta.fx.date}</strong> · ` +
      main.map(fmtRate).join(" · ") +
      (rest.length ? ` · <span class="fx-more">외 ${rest.length}개</span>` : "");
    fxInfo.title = rates.map(fmtRate).join("\n") + `\n(1 단위 통화당 원화, ${meta.fx.source})`;
  }

  document.getElementById("source-text").textContent =
    `출처: ${meta.sources.join(", ")}` +
    (meta.asOf ? ` | 기준일: ${meta.asOf}` : "") +
    (meta.fxNote ? ` | ${meta.fxNote}` : "") +
    " | 전망: FRED·OECD Economic Outlook | CI·제품 사진: Wikimedia Commons·각사 웹사이트 | 회사 요약·설비: OpenAI GPT + 웹검색 | 사업장 위치: OpenStreetMap Nominatim";

  setYear(state.year);
})();
