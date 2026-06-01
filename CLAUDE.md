# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

**유틸모음** — 생활 밀착형 무료 계산기 모음 사이트. 빌드 시스템·패키지 매니저 없이 순수 HTML/CSS/JS로 구성됩니다. `.html` 파일을 브라우저에서 직접 열어 개발·테스트합니다.

## 파일 구조

| 파일 | 설명 | 상태 |
|---|---|---|
| `index.html` | 도구 목록 랜딩 페이지 | 구현 완료 |
| `salary-calculator.html` | 연봉 실수령액 계산기 | 구현 완료 |
| `bmi-calculator.html` | BMI 계산기 | 구현 완료 |
| `dday-calculator.html` | D-Day 계산기 | 구현 완료 |
| `style.css` | 모든 페이지 공유 스타일 | — |

준비 중 도구: 전월세 전환율, 대출 이자, 택배 부피무게 계산기

## 새 도구 추가 방법

1. 기존 계산기(예: `bmi-calculator.html`)를 복사해 새 HTML 파일 생성 (헤더·푸터·`style.css` 구조 동일)
2. `index.html`의 `<!-- 도구 목록 -->` 섹션에 카드 추가 — 준비 중 카드의 `opacity:.5; cursor:default;` 스타일 제거 후 `<a href="...">` 로 교체
3. 활성 카드에 `<span class="badge-new">NEW</span>` 뱃지 추가

## 의존성 (CDN)

- Bootstrap 5.3.3
- jQuery 3.7.1
- npm, 번들러, 로컬 설치 없음

## 광고 슬롯

페이지별 카카오 애드핏 플레이스홀더 3곳 (현재 `<div class="ad-slot ...">` 더미 표시):

| 위치 | 클래스 | 크기 |
|---|---|---|
| 헤더 하단 | `ad-header` | 728×90 |
| 결과 영역 하단 | `ad-result` | 300×250 |
| 푸터 상단 | `ad-footer` | 320×50 |

실서비스 전환 시 주석 처리된 `<ins class="kakao_ad_area" ...>` 블록으로 교체합니다.

## CSS 설계

`style.css`에 CSS 변수로 디자인 시스템이 정의되어 있습니다.

```css
--primary: #1a56db      /* 주요 파란색 */
--primary-dark: #1e429f
--primary-light: #e8f0fe
--text-dark: #1f2937
--text-muted: #6b7280
--border: #e5e7eb
--bg-light: #f9fafb
```

주요 컴포넌트 클래스: `.tool-card`, `.calc-card`, `.result-box`, `.deduction-table`, `.btn-calc`, `.badge-new`

## 계산기별 로직

### 연봉 실수령액 계산기 (`salary-calculator.html`)

입력: **만원** 단위 → `calculate()` 내부에서 원 단위로 변환.

| 공제 항목 | 요율 / 규칙 |
|---|---|
| 국민연금 | 4.5%, 기준 소득월액 상한 590만원 |
| 건강보험 | 3.545% |
| 장기요양보험 | 건강보험료 × 12.95% |
| 고용보험 | 0.9% |
| 소득세 | `calcIncomeTax()` — 근로소득공제 + 기본공제 150만원 + 표준세액공제 13만원 + 근로소득세액공제 누진세율 |
| 지방소득세 | 소득세 × 10% |

### BMI 계산기 (`bmi-calculator.html`)

입력: 키(cm), 몸무게(kg). **대한비만학회 기준** 적용.

| 판정 | BMI 범위 |
|---|---|
| 저체중 | 18.5 미만 |
| 정상 | 18.5 – 22.9 |
| 과체중 | 23 – 24.9 |
| 비만 1단계 | 25 – 29.9 |
| 고도비만 | 30 이상 |

적정 체중 범위(BMI 18.5~22.9 해당 체중)와 현재 체중과의 차이를 함께 표시합니다.

### D-Day 계산기 (`dday-calculator.html`)

입력: 목표 날짜(date picker), 이벤트 이름(선택). 오늘 날짜를 기본값으로 설정합니다.

- 미래 날짜 → `D-N일` 표시
- 과거 날짜 → `D+N일` 표시
- 당일 → `D-Day` 표시
- 주 단위·개월 단위 환산 함께 표시
