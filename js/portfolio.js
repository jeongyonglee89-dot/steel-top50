// 회사 요약 박스용 렌더러: 설비 포트폴리오(Material balance 도식), 제품 포트폴리오(사진 카드)
// 데이터: data/facilities.js (STEEL_FACILITIES), assets/products/*.jpg

window.Portfolio = (function () {
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  // broken: check_links.mjs가 404·도메인 없음으로 확인한 링크 → 링크 대신 "출처 확인 불가"
  const srcLink = (url, broken = false) =>
    url
      ? ` <a class="src" href="${esc(url)}" target="_blank" rel="noopener">출처</a>`
      : broken
        ? ` <span class="src-broken" title="링크가 존재하지 않음(404) — 내용 확인 필요">출처 확인 불가</span>`
        : "";
  const fmtMt = (v) => (v == null ? "-" : v >= 10 ? v.toFixed(1) : v.toFixed(2));

  // ---------- 제품 카테고리 (키워드 → 대표 사진) ----------
  // 순서가 우선순위: 먼저 맞는 카테고리 사용
  const PRODUCT_CATS = [
    { id: "electrical", label: "전기강판", re: /전기강판|전자강판|방향성|무방향성/ },
    { id: "stainless", label: "스테인리스", re: /스테인리스|STS|stainless/i },
    { id: "battery", label: "이차전지소재", re: /이차전지|배터리|리튬|양극재|음극재|니켈/ },
    { id: "coated", label: "도금강판", re: /도금|아연|컬러|갈바/ },
    { id: "plate", label: "후판", re: /후판|조선|플레이트/ },
    { id: "crc", label: "냉연", re: /냉연|자동차|강판/ },
    { id: "hrc", label: "열연", re: /열연|코일|판재/ },
    { id: "pipe", label: "강관", re: /강관|파이프|튜브|OCTG/ },
    { id: "rail", label: "레일", re: /레일|철도/ },
    { id: "rebar", label: "철근", re: /철근|건설용 봉/ },
    { id: "wirerod", label: "선재", re: /선재|와이어|wire/i, noPhoto: true },
    { id: "section", label: "형강", re: /형강|H빔|H형|빔|구조용/ },
    { id: "bar", label: "봉강·특수강", re: /봉강|특수강|합금강|공구강|베어링/ }
  ];

  function classify(text) {
    return PRODUCT_CATS.find((c) => c.re.test(text)) ?? { id: "generic", label: "철강제품" };
  }

  function productCards(items) {
    if (!items?.length) return `<p class="empty">확인된 내용 없음</p>`;
    return `<ul class="product-cards">${items
      .map((it) => {
        const text = typeof it === "string" ? it : it.text;
        const url = typeof it === "string" ? null : it.url;
        const broken = typeof it === "object" && it.urlBroken;
        const cat = classify(text);
        const thumb = cat.noPhoto
          ? `<span class="thumb thumb-text">${cat.label}</span>`
          : `<img class="thumb" src="assets/products/${cat.id}.jpg" alt="${cat.label}" loading="lazy" />`;
        return `<li class="product-card cat-${cat.id}">${thumb}<div><span class="cat">${cat.label}</span><div>${esc(text)}${srcLink(url, broken)}</div></div></li>`;
      })
      .join("")}</ul>`;
  }

  // ---------- 설비 포트폴리오: Material balance ----------
  // 원료 공정(고로·전기로) → 조강(WSA 실적) → 제품(판재·봉형강). 제품 비중을 조강량에 적용한 개략 물질수지.
  // 공정 색: dataviz 검증 통과 쌍(주황·아쿠아, 전체 쌍 CVD ΔE ≥ 9) — 지도 사업장 ◆와 동일
  // 제품 색: 파랑·보라 (노드 안에 직접 라벨이 있어 색만으로 구분하지 않음), 조강은 중립 회색
  const COLORS = { bf: "#eb6834", eaf: "#2a78d6", crude: "#212427", flat: "#197a56", long: "#5fb488" };
  const DARK_TEXT = new Set([COLORS.bf, COLORS.long]); // 밝은 채움은 어두운 글자 (대비)

  function materialBalanceSvg(f, crude) {
    const r = f?.route ?? {};
    const p = f?.product ?? {};
    const hasRoute = r.bfPct != null && r.eafPct != null;
    const hasProd = p.flatPct != null && p.longPct != null;
    if (crude == null || (!hasRoute && !hasProd)) return `<p class="empty">공정·제품 비중 미확인</p>`;

    const W = 360, H = 170, nodeW = 66, top = 18, bottom = H - 8, scaleH = bottom - top;
    const xL = 4, xM = (W - nodeW) / 2, xR = W - nodeW - 4;
    const gap = 6;

    // 양쪽 노드 높이 = 비중 × 전체 높이 (사이 간격만큼 줄임)
    // 작은 비중도 라벨이 들어가도록 최소 높이 MIN_H 보장 (비율은 라벨의 %로 정확히 표기)
    const MIN_H = 15;
    const split = (aPct, bPct) => {
      const avail = scaleH - gap;
      if (aPct <= 0) return [0, avail];
      if (bPct <= 0) return [avail, 0];
      const a = Math.min(Math.max((aPct / 100) * avail, MIN_H), avail - MIN_H);
      return [a, avail - a];
    };

    // stage: 1 = 공정→조강, 2 = 조강→제품 (차례로 자라나는 애니메이션)
    const band = (x1, y1, h1, x2, y2, h2, color, stage = 1) => {
      const cx = (x1 + x2) / 2;
      return `<path class="mb-band b${stage}" d="M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2} L${x2},${y2 + h2} C${cx},${y2 + h2} ${cx},${y1 + h1} ${x1},${y1 + h1} Z" fill="${color}" opacity="0.3"/>`;
    };
    const node = (x, y, h, color, label, value, pct) => h <= 0 ? "" : `<g class="mb-node">
      <rect x="${x}" y="${y}" width="${nodeW}" height="${Math.max(h, 1)}" rx="3" fill="${color}"/>
      <text x="${x + nodeW / 2}" y="${y + Math.max(h, 1) / 2 - (h > 26 ? 3 : 0)}" class="mb-label${h > 26 ? "" : " mb-small"}${DARK_TEXT.has(color) ? " mb-dark" : ""}" ${h > 26 ? "" : 'dy="0.35em"'}>${label}${h > 26 || pct == null ? "" : ` ${pct.toFixed(0)}%`}</text>
      ${h > 26 ? `<text x="${x + nodeW / 2}" y="${y + h / 2 + 11}" class="mb-value${DARK_TEXT.has(color) ? " mb-dark" : ""}">${value} Mt${pct != null ? ` · ${pct.toFixed(0)}%` : ""}</text>` : ""}</g>`;

    let svg = "";
    // 가운데 조강 노드
    const midTop = top, midH = scaleH;
    svg += node(xM, midTop, midH, COLORS.crude, "조강", fmtMt(crude), null);

    if (hasRoute) {
      const [hBf, hEaf] = split(r.bfPct, r.eafPct);
      const yBf = top, yEaf = top + hBf + gap;
      const mBf = (r.bfPct / 100) * midH;
      svg += band(xL + nodeW, yBf, hBf, xM, midTop, mBf, COLORS.bf);
      svg += band(xL + nodeW, yEaf, hEaf, xM, midTop + mBf, midH - mBf, COLORS.eaf);
      svg += node(xL, yBf, hBf, COLORS.bf, "고로", fmtMt((crude * r.bfPct) / 100), r.bfPct);
      svg += node(xL, yEaf, hEaf, COLORS.eaf, "전기로", fmtMt((crude * r.eafPct) / 100), r.eafPct);
    } else {
      svg += `<text x="${xL + nodeW / 2}" y="${H / 2}" class="mb-na">공정 비중<tspan x="${xL + nodeW / 2}" dy="1.2em">미확인</tspan></text>`;
    }

    if (hasProd) {
      const [hFlat, hLong] = split(p.flatPct, p.longPct);
      const yFlat = top, yLong = top + hFlat + gap;
      const mFlat = (p.flatPct / 100) * midH;
      svg += band(xM + nodeW, midTop, mFlat, xR, yFlat, hFlat, COLORS.flat, 2);
      svg += band(xM + nodeW, midTop + mFlat, midH - mFlat, xR, yLong, hLong, COLORS.long, 2);
      svg += node(xR, yFlat, hFlat, COLORS.flat, "판재", fmtMt((crude * p.flatPct) / 100), p.flatPct);
      svg += node(xR, yLong, hLong, COLORS.long, "봉형강", fmtMt((crude * p.longPct) / 100), p.longPct);
    } else {
      svg += `<text x="${xR + nodeW / 2}" y="${H / 2}" class="mb-na">제품 비중<tspan x="${xR + nodeW / 2}" dy="1.2em">미확인</tspan></text>`;
    }

    // 단계 머리글
    svg += `<text x="${xL + nodeW / 2}" y="11" class="mb-head">공정</text>
            <text x="${xM + nodeW / 2}" y="11" class="mb-head">조강 (WSA)</text>
            <text x="${xR + nodeW / 2}" y="11" class="mb-head">제품</text>`;

    return `<svg class="material-balance" viewBox="0 0 ${W} ${H}" role="img" aria-label="Material balance: 고로·전기로 → 조강 → 판재·봉형강">${svg}</svg>
      <ul class="mb-basis">
        ${hasRoute ? `<li>공정 비중: ${esc(r.basis)}${srcLink(r.url, r.urlBroken)}</li>` : ""}
        ${hasProd ? `<li>제품 비중: ${esc(p.basis)}${srcLink(p.url, p.urlBroken)}</li>` : ""}
      </ul>`;
  }

  const PROCESS_COLOR = { 고로: COLORS.bf, 전기로: COLORS.eaf, "고로+전기로": COLORS.bf, 압연: "#9a9a96" };
  const PROCESS_CLASS = { 고로: "bf", 전기로: "eaf", "고로+전기로": "mix", 압연: "roll" };

  function plantList(plants) {
    if (!plants?.length) return `<p class="empty">확인된 사업장 없음</p>`;
    return `<ul class="plants">${plants
      .map(
        (pl) => `<li>
          <span class="proc proc-${PROCESS_CLASS[pl.process] ?? "roll"}">${esc(pl.process)}</span>
          <strong>${esc(pl.name)}</strong> <small>${esc(pl.city)}, ${esc(pl.country)}</small>
          <small class="meta">${pl.products.map(esc).join("·")}${pl.capacityMt != null ? ` · 조강능력 ${fmtMt(pl.capacityMt)} Mt` : ""}${pl.lat == null ? " · 지도 위치 없음" : ""}${srcLink(pl.url, pl.urlBroken)}</small>
        </li>`
      )
      .join("")}</ul>`;
  }

  function facilitySection(f, crude) {
    if (!f) return `<p class="empty">설비 데이터가 없습니다. <code>node scripts/fetch_facilities.mjs</code>로 생성하세요.</p>`;
    return `${materialBalanceSvg(f, crude)}
      <h5>주요 사업장 <small>(지도에 ◆ 표시)</small></h5>
      ${plantList(f.plants)}`;
  }

  return { productCards, facilitySection, PROCESS_COLOR, PROCESS_CLASS, classify, esc, srcLink };
})();
