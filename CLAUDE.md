# CLAUDE.md

이 파일은 Claude Code가 이 프로젝트에서 작업할 때 따르는 가이드라인이다. 요구사항 원본은 `PRD.md`.

## 프로젝트
WSA 조강량 **Top 50** 철강사의 조강량·매출액·EBITDA %·PBR·주당배당금을 세계 지도 + 순위표로 보여주는 단일 HTML 대시보드.
- 실적 탭 2023/2024/2025, 전망 탭 2026E/2027E/2028E (Bear/Base/Bull 순서, 기본 Base). 탭·표 색상으로 구분 (실적 남색, 전망 주황).
- 표 위 요약 KPI(조강량 합계, 매출액 합계, EBITDA % 단순평균, PBR 중앙값) — 선택 연도·중국 제외 반영.
- 회사 클릭 시 해당 연도 기준 요약 박스: 설비 포트폴리오(Material balance 도식 + 주요 사업장) → 주요제품(사진 카드) → 전략 → 보도자료 → 이슈. 모든 항목 '출처' 링크 형식.
- 지도: 클릭 전엔 본사(●)만, 회사 클릭 시 주요 사업장(◆, 공정별 색)과 본사 연결선 표시. 겹치는 본사 마커는 충돌 완화로 펼치고 실제 위치까지 선 표시.
- 팝업·요약 박스에 본사 국적(한글) 표시.
- 금액은 기준일(데이터 생성일) 환율로 원화 환산, 상단에 환율 기준 표시.
- 출처: WSA, Yahoo Finance, OpenAI GPT(웹검색), Wikimedia Commons(CI).

## 실행
- 빌드/서버 불필요. `index.html`을 브라우저로 열면 된다 (지도는 로컬 데이터, Leaflet CDN만 필요).
- 데이터 재생성 (순서대로, 전체는 `npm run all`)
  - `npm run data` = `python scripts/build_data.py` (WSA → companies.js, 5회 재시도) + `node scripts/fetch_finance.mjs` (Yahoo 재무·배당·오늘자 환율)
  - `npm run forecast` = `python scripts/forecast_model.py`
  - `npm run insights` / `npm run facilities` = GPT 생성 → `hangulize.mjs`(한자→한글) → `check_links.mjs`(출처 링크 검증)
  - `node scripts/fetch_insights.mjs` — GPT 요약 생성 (gpt-5-mini, 없는 항목만, `--only <id> --year <y> --force` 지원). 150건, API 비용 발생.
  - `python scripts/forecast_model.py` — 전망 모델 (FRED·OECD + 회귀) → data/forecast.js, forecast/02_전망모델_결과.md. `npm run data` 이후 실행.
  - `node scripts/hangulize.mjs` — insights/facilities 의 한자·가나 → 한글 (생성 스크립트 실행 후 항상)
  - `OPENAI_MODEL=gpt-5 CONCURRENCY=6 node scripts/fetch_facilities.mjs` — 설비 포트폴리오·사업장 생성 + Nominatim 지오코딩. gpt-5-mini는 공정 분류 오류가 많아 **gpt-5 사용**. 150건 1~2시간.
- 테스트: `npm test` (Playwright, 설치된 Chrome·Edge 두 브라우저로 file:// index.html 검사, 47개 × 2)
  - 브라우저로 보면서 실행: `$env:SLOWMO='700'; npx playwright test --headed`
  - HTML 리포트: `npx playwright show-report`
- 코드 수정 후 반드시 `npm test` 통과 확인. 스크린샷(`test-results/`)도 확인한다 — HTTP 200이어도 화면이 깨질 수 있음.

## 폴더 구조
```
과제/
├── PRD.md / CLAUDE.md
├── index.html, css/style.css
├── js/app.js               # 지도·표·탭·요약 박스
├── js/portfolio.js         # 설비 포트폴리오(Material balance SVG)·제품 사진 카드 렌더러
├── data/
│   ├── companies.js        # 실적 (STEEL_DATA) — 자동 생성, 직접 수정 금지
│   ├── insights.js         # GPT 요약 (STEEL_INSIGHTS) — 자동 생성
│   ├── facilities.js       # 설비 포트폴리오·사업장 (STEEL_FACILITIES) — 자동 생성
│   ├── forecast.js         # 전망 (STEEL_FORECAST) — scripts/forecast_model.py 자동 생성
│   └── world.js            # 국가 경계 GeoJSON (WORLD_GEO)
├── assets/logos/           # 회사 CI + logos.json(출처)
├── assets/products/        # 제품 카테고리 대표 사진 (Wikimedia Commons) + credits.json(라이선스)
├── scripts/
│   ├── build_data.py       # WSA API → companies.js (회사 메타는 META 딕셔너리)
│   ├── fetch_finance.mjs   # Yahoo Finance → companies.js 재무지표 채움
│   ├── forecast_model.py   # FRED·OECD 거시지표 + 회귀 → forecast.js (표준 라이브러리만)
│   ├── fetch_insights.mjs  # OpenAI Responses API(web_search) → insights.js
│   ├── fetch_facilities.mjs # OpenAI(web_search) + Nominatim → facilities.js
│   ├── hangulize.mjs       # GPT 생성물의 한자·가나 → 한글
│   └── check_links.mjs     # 출처 링크 실제 접속 확인, 404·도메인 없음 정리
├── forecast/               # 01_매핑표_데이터요구.md, 02_전망모델_결과.md(계수·R²·가정·한계)
├── 검수보고서.md           # 4단계 검수 결과
└── tests/dashboard.spec.js # Playwright E2E 테스트 (47건 × Chrome·Edge)
```

## 코딩 규칙
- HTML + CSS + Vanilla JS만 사용. 프레임워크·번들러 도입 금지.
- 외부 라이브러리는 CDN으로만: Leaflet 1.9.x. (Playwright, yahoo-finance2는 개발용 devDependency)
- 지도 배경은 로컬 GeoJSON(`data/world.js`). 외부 타일 서버(OSM, CARTO 등) 사용 금지.
- 데이터는 `data/*.js`의 window 전역 변수로만 둔다. `fetch()`로 JSON을 읽지 않는다 (file:// 실행 시 CORS 오류).
- 로직(`js/`)에 숫자 데이터를 하드코딩하지 않는다.
- 실적/전망 값은 `vals(c, y)`로 정규화해서 쓴다 (`money` = 실적 매출액 / 전망 영업이익, 조원).
- 값이 없으면 `null`. 비상장사는 `N/A (비상장)`, 상장사인데 값이 없으면(러시아 제재, Yahoo 미제공) **`데이터 없음`** — 행 전체가 없으면 병합 셀, 일부만 없으면 해당 칸만.
- 단위: 조강량 Mt, 매출액·영업이익 조원, EBITDA %, PBR 배, 주당배당금 원 (현지통화는 툴팁/괄호).
- Material balance: 고로+전기로 = 조강(WSA) = 판재+봉형강. 제품 비중을 조강량에 적용한 개략치. 비중 합 100으로 스크립트에서 정규화.
- 제품 사진은 `Portfolio.classify()` 키워드 → 카테고리 → `assets/products/{id}.jpg`. 선재는 적합한 무료 사진이 없어 텍스트 타일.
- 차트 색은 감으로 고르지 않고 `validate_palette.js`로 검증 후 사용 (지도 배경 #dce9f2·#f4f4f1을 --surface로).
- **디자인 톤앤매너: BCG 스타일** — 흰 바탕, 얇은 구분선(1px), 그림자·둥근 모서리 최소, 녹색 1색 강조, 숫자는 크게·라벨은 작게, Pretendard 15px 기준.
  - 실적 강조 `--green`(#197a56), 전망 강조 `--amber`(#a5641a). `body.mode-actual / mode-forecast`가 `--accent`·`--accent-tint`를 바꿈 (표 머리글 배경·KPI 숫자·탭 밑줄).
  - 문구: 표 위 **액션 타이틀**(핵심 메시지 한 문장, 예: "상위 10개사가 Top 50 조강량의 47% 차지 — 1위 …"), 라벨은 개조식·명사형으로 짧게.
  - 지도: 바다 흰색, 육지 #efefec, 국경 흰 선. 본사 마커 램프 그린 #5fb488→#073b28 (흰색·육지 대비 검증 통과). 공정 색: 고로 주황 #eb6834, 전기로 파랑 #2a78d6 (녹색 마커와 혼동 피하려 아쿠아→파랑).
- **모션**: 마커 크기 트윈, 표 재정렬(FLIP), KPI 카운트업, 요약 박스 슬라이드인, Material balance 띠가 차례로 자라남, 사업장 연결선 흐름, ▶ 연도 재생(2023→2028E, 1.8초 간격), 표 행↔마커 호버 강조. `prefers-reduced-motion`이면 모두 끔 (Playwright도 reducedMotion: reduce로 검사).
- **한자 금지**: 화면 텍스트에 한자·가나 없음. GPT 생성물은 `node scripts/hangulize.mjs`로 한글 변환(캐시 scripts/.hangul-cache.json), 생성 프롬프트에도 금지 규칙 포함. 테스트로 검증.
- UI 텍스트는 한국어, 회사명은 영문 + 한글 병기.
- 마커에는 `company-marker marker-{id}` 클래스를 붙인다 (테스트 셀렉터로 사용).
- 외부 텍스트(GPT 결과)는 `escapeHtml`로 이스케이프해서 넣는다.

## 데이터 규칙
- 조강량: WSA 공개 API(`extranet.worldsteel.org/wp-admin/admin-ajax.php?action=tonnage_report_top_producers_all`, POST). `is_estimate` → `crudeEstimate`.
- Top 50 선정 기준은 **2025년 WSA 순위**. 2023·2024년은 같은 회사의 해당 연도 값과 순위.
- 재무: Yahoo Finance `fundamentalsTimeSeries`(연간). 회계연도 매핑 fyEnd 12 → 해당 연도, 03 → Y.4~Y+1.3.
  - PBR: 분할 소급 여부를 현재 주식수와 비교해 판단 (Nippon Steel 2025 5:1 분할). ADR은 `adrRatio`로 보정 (Ternium 10).
  - DPS: 회계기간 중 배당락일 기준 합계. Yahoo가 분할일 당일 배당을 소급 안 한 버그 보정. 한국은 2024년부터 결산배당 배당락이 3월로 이동해 연도 귀속이 밀릴 수 있음.
- 환율: 스크립트 실행일 Yahoo 시세(`{CCY}KRW=X`, 없으면 USD 경유), `meta.fx`에 저장 → 상단에 주요 4개 통화, 나머지는 마우스오버.
- 결산월: fyEnd 6~12월 → FY Y = Y년 종료(thyssenkrupp 9월), 1~5월 → Y+1년 종료(일본·인도 3월).
- 숫자를 추측해서 넣지 않는다. 출처에서 확인한 값만, 확인 못한 값은 `null`. LLM으로 재무 수치를 생성하지 않는다 (GPT는 정성 요약에만 사용, 출처 URL 포함).
- GPT 요약은 연도 범위 밖 보도자료를 스크립트에서 걸러낸다.
- GPT 출처 링크는 `check_links.mjs`로 실제 접속 확인: 404·도메인 없음이면 보도자료는 삭제, 나머지는 `urlBroken: true` → 화면 "출처 확인 불가". 403·인증서 오류는 정상 취급.
- 전망 DPS: 3년 평균 DPS × (전망 순이익 ÷ 3년 평균 순이익), 상한 3년 최대×2, 영업손실·3년 무배당이면 0.
- API 키(`C:\Users\USER\Desktop\Python\.env`의 OPENAI_API_KEY)는 Node 스크립트에서만 읽고 HTML/JS·로그에 절대 넣지 않는다.

## 개발 단계 (진행 상황)
- [x] 1단계: 기본 뼈대 — 지도, 30개 마커, 연도 선택, 팝업 틀, 데이터 스키마
- [x] 2단계: 기능 추가 — WSA·Yahoo 실데이터, 순위표(지표별 정렬), 중국 제외, DPS, 원화 환산, CI, GPT 요약, 실적/전망 탭
  - [x] 마커 겹침 처리(F8), 요약 KPI(F9), Top 50 확장, 설비 포트폴리오, 제품 사진, 사업장 지도
- [x] 디버깅 1차 — 데이터 무결성 검사, 전체 상태 조합 스윕(연도×시나리오×정렬×중국제외, 전 회사 클릭), 1280px 레이아웃
- [x] 전망 모델 — 사용자 결정: FRED·OECD 거시지표, 추정기간 최근 3년(2023~2025), 회귀모델 + R² 병기
  - 조강 증가율: 풀링 OLS(GDP + 중국 더미) / EBITDA·영업이익률: 회사 고정효과(철광석 변화율 + GDP) / PBR: 고정효과(EBITDA + GDP) / DPS: 3년 평균 배당성향 규칙
  - 시나리오 Bear/Base/Bull = OECD EO 119 GDP·FRED 철광석 ∓/± 1σ (2026은 0.5배, 나우캐스트)
  - 화면: 전망 탭 배너에 모델별 R²·within R², 열 머리글에 R², 팝업에 80% 예측구간
- [x] 3단계: UI 디자인
  - F6 본사 마커 크기(면적∝|값|, 반지름 4~12px)·색(파랑 5단계 분위)을 선택(정렬) 지표에 연동, 음수 빨강, 값 없음 점선 회색
  - F11 범례(지도 우하단): 크기·색 구간·음수·값 없음·리더선·사업장 공정 ◆
  - F12 반응형: ≤1100px 표·요약 박스를 지도 아래로, ≤640px 범례 숨김·헤더 줄바꿈. 1600/1000/420px 가로 스크롤 0
  - 색 검증(dataviz validate_palette.js): 마커 램프 #6da7ec→#0d366b는 지도 육지·바다 대비 통과. 공정 색은 주황(고로)·아쿠아(전기로) 쌍 통과, 혼합은 반반 ◆, 압연은 회색 테두리. 이전 공정 색(회청·청록·보라·회색)은 CVD ΔE 1.9로 실패해 교체
- [x] 4단계: 검수 — PRD §8 전 항목 충족, 성능(로딩 0.7초·연도 전환 <50ms), Chrome·Edge 94건 통과, 버그 7건 수정 (`검수보고서.md`)

## 작업 원칙
- 각 단계 시작 전 `PRD.md`의 해당 단계 범위를 확인하고, 범위 밖 작업은 하지 않는다.
- 단계 완료 시 위 체크박스와 "알려진 이슈"를 업데이트한다.
- 기능을 추가하면 `tests/dashboard.spec.js`에 테스트도 추가한다.
- 버그 수정 시 원인과 수정 내용을 "알려진 이슈"에 기록한다.

## 알려진 이슈
- [해결] OSM 타일 403 Access blocked (file:// 실행 시 Referer 없음).
- [해결] CARTO 타일이 HTTP 200으로 "API KEY REQUIRED" 이미지 반환 — 스크린샷에서 발견 → 로컬 GeoJSON으로 교체.
- [해결] 1단계 임시 회사 목록 → WSA 2025 공식 Top 30 → Top 50으로 확장.
- [해결] Nippon Steel PBR 과대(3.5배) — 분할 배율 이중 적용. Ternium PBR 과대(6배) — ADR 비율 미반영.
- [해결] Nippon Steel 2025 DPS 과대 — Yahoo가 분할일(2025-09-29) 배당을 소급 안 함.
- [해결] 전망 탭에서 표 갱신 안 됨 — 정렬 tie-break가 `c.years[2027]`(없음) 참조 → `vals()` 사용으로 수정. Playwright로 발견.
- [해결] 1280px에서 요약 박스가 팝업을 가림 → 패널 폭 반응형 + 팝업 autoPan 여백 + 이동 시 박스 오른쪽 영역 기준.
- [해결] 겹침 처리 1차(원형 배치 병합)는 동아시아 전체가 거대한 원 하나가 됨 → 충돌 완화 방식으로 교체.
- [해결] VND·RUB 원화 환율 없음 → USD 경유 교차환율.
- [해결] 지오코딩 27곳 실패(GPT가 "OuroBranco"처럼 띄어쓰기 생략) → 띄어쓰기 복원·자유검색 폴백 → 749곳 중 748곳 (덴마크 1곳은 GPT가 도시명을 깨뜨려 위치 없음).
- [해결] 사업장이 여러 대륙(일본제철: 일본·미국·인도·브라질)이면 팝업 autoPan이 화면 맞춤을 되돌림 → 표 클릭 시 autoPan 끔, minZoom 1, 팝업 폭 260px.
- [해결] 좁은 화면에서 요약 박스가 지도 전체를 덮음 → ≤1100px에서는 지도 아래 배치.
- CI: 50개 중 23개 로고 (Wikidata P154 + 사이트 아이콘). Mobarakeh의 Wikidata 이미지는 공장 사진이라 제외. 나머지는 이니셜 배지.
- 설비 데이터는 GPT 생성물이라 오류 가능 — gpt-5-mini 시험에서 STS·전기로 공장을 고로로 분류하는 오류 확인 → gpt-5로 생성. 지오코딩은 동명 도시 오류 가능(성/주 함께 질의로 완화).
- Severstal·MMK·NLMK: 러시아 제재로 Yahoo 재무 대부분 없음 → "데이터 없음", 전망은 조강량만.
- 전망 모델 설계 판단 (forecast/02 참고):
  - 조강 증가율에 회사 고정효과를 쓰면 M&A 성장(일본제철 2025 +32%)이 매년 반복 → 풀링 OLS로 변경. R²≈0.003으로 GDP 설명력 거의 없음(정직하게 표기).
  - FRED 철강 PPI(WPU101)는 2025~26 미국 관세로 +13% 급등 → 전 세계 마진을 과대 추정해 제외, 철광석을 경기 대용으로 사용.
  - GS10은 PBR 계수 부호가 +(비직관적)로 나와 제외.
  - 고정효과 모델의 R²(0.83~0.90)는 회사 간 수준 차이 때문에 높음. 거시변수 설명력은 within R²(0.04~0.13)로 판단.
- WSA API가 간헐적으로 타임아웃(2026-10-13 확인) → 기존 companies.js 유지된 채 fetch_finance만 실행됨. 재시도 필요 시 `python scripts/build_data.py`. 로고 파일을 `assets/logos/{id}.png`로 넣고 `logos.json`에 등록 후 `npm run data` 하면 반영.
- Shagang(002075.SZ)·Fangda(600507.SS)는 그룹 대비 작은 상장 자회사라 재무지표 대표성 낮음.
- 같은 도시/인접 본사(중국 동부, 베이징, 도쿄, 뭄바이) 마커가 겹침 → F8에서 처리.
- NLMK(러시아)는 Yahoo Finance 재무 데이터 없음.
