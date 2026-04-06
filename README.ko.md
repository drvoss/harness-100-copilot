<p align="center">
  <img src="https://raw.githubusercontent.com/primer/octicons/main/icons/copilot-48.svg" width="80" alt="Copilot CLI" />
</p>

<h1 align="center">harness-100-copilot</h1>

<p align="center">
  <strong>GitHub Copilot CLI를 위한 100개 프로덕션급 멀티-에이전트 하네스</strong><br/>
  <a href="https://github.com/revfactory/harness-100">revfactory/harness-100</a>을 Copilot CLI 생태계에 맞게 포팅
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="Apache 2.0" /></a>
  <a href="#"><img src="https://img.shields.io/badge/copilot--cli-ready-28a745?logo=github" alt="Copilot CLI Ready" /></a>
  <a href="#"><img src="https://img.shields.io/badge/harnesses-3%20(Phase%201%20of%20100)-orange" alt="3 Harnesses (Phase 1)" /></a>
  <a href="#"><img src="https://img.shields.io/badge/agents-15-blueviolet" alt="15 Agents" /></a>
  <a href="#"><img src="https://img.shields.io/badge/parity-~96%25-green" alt="~96% parity" /></a>
</p>

<p align="center">
  <a href="README.md">🇺🇸 English</a>
</p>

---

## 이 프로젝트란?

**harness-100-copilot**은 [revfactory/harness-100](https://github.com/revfactory/harness-100)을 **GitHub Copilot CLI**용으로 포팅한 프로젝트입니다.

원본 harness-100은 Claude Code의 `SendMessage`를 이용해 에이전트들이 실시간으로 소통하는 구조입니다. 이 프로젝트는 현재 Phase 1에서 3개 하네스를 Copilot CLI의 **파일 기반 메시지 버스** 패턴으로 변환했으며, 100개 전체 포팅을 목표로 합니다 (**~96% 기능 동등성**).

> **하네스란?** 복잡한 작업(전체 풀스택 앱 개발, PR 리뷰, CI/CD 파이프라인 구축 등)을 완수하기 위해 구조화된 파이프라인으로 협업하는 4~7명의 전문가 에이전트 팀입니다.

---

## 핵심 차이점: 메시지 버스

원본은 Claude Code의 `SendMessage`를 사용합니다:
```
style-inspector → SendMessage(synthesizer, findings)
security-analyst → SendMessage(synthesizer, findings)
```

GitHub Copilot CLI에는 이 기능이 없습니다. **파일 기반 메시지 버스**로 대체합니다:

```
_workspace/
  messages/
    style-inspector-to-review-synthesizer.md
    security-analyst-to-review-synthesizer.md
  01_style_review.md
  02_security_review.md
```

> 📖 상세 설명: [guides/message-bus-pattern.md](guides/message-bus-pattern.md)와 [PORTING-NOTES.md](PORTING-NOTES.md)

---

## 사용 방법

```bash
# 1. 클론
git clone https://github.com/drvoss/harness-100-copilot.git

# 2. 하네스를 프로젝트에 복사 (예: code-reviewer)
cp -r harness-100-copilot/harnesses/21-code-reviewer/agents/ .github/agents/
cp -r harness-100-copilot/harnesses/21-code-reviewer/skills/ .github/skills/

# 3. Copilot CLI 시작
copilot

# 4. 하네스 실행
> 보안 및 아키텍처 관점에서 최근 변경사항을 리뷰해줘
```

---

## 한눈에 보기

| 속성 | 값 |
|------|---|
| 전체 하네스 | 현재 3개 (Phase 1); 10개 도메인에 걸쳐 100개 계획 |
| 에이전트 정의 | 현재 15개 (100개 하네스 완성 시 489개) |
| 스킬 (오케스트레이터 + 도메인) | 현재 9개 (100개 하네스 완성 시 315개) |
| 원본 대비 기능 동등성 | ~96% |
| 핵심 변환 | `SendMessage` → 파일 기반 메시지 버스 |
| 주요 사용처 | Copilot CLI의 복잡한 멀티-에이전트 워크플로우 |

---

## 하네스 목록

### ✅ 카테고리 2: 소프트웨어 개발 & DevOps (16-30) — Phase 1 (현재 사용 가능)

| # | 하네스 | 설명 | 상태 |
|---|--------|------|------|
| 16 | [fullstack-webapp](harnesses/16-fullstack-webapp/) | 풀스택 웹앱: 설계 → 프론트엔드 → 백엔드 → 테스트 → 배포 | ✅ 사용 가능 |
| 20 | [cicd-pipeline](harnesses/20-cicd-pipeline/) | CI/CD: 설계, 보안 게이트, 모니터링 | ✅ 사용 가능 |
| 21 | [code-reviewer](harnesses/21-code-reviewer/) | 코드 리뷰: 스타일, 보안, 성능, 아키텍처 | ✅ 사용 가능 |
| 17-19, 22-30 | (기타) | 모바일 앱, API 설계, DB 아키텍처 등 | 🔜 예정 |

### 🔜 기타 카테고리 (출시 예정)

| 카테고리 | 범위 | 도메인 |
|----------|------|--------|
| 콘텐츠 제작 & 크리에이티브 | 01-15 | YouTube, 팟캐스트, 뉴스레터, 브랜드 |
| 데이터 & AI/ML | 31-42 | ML 실험, 데이터 분석, LLM 앱 |
| 비즈니스 & 전략 | 43-55 | 시장 분석, 전략 기획 |
| 교육 & 학습 | 56-65 | 강좌 설계, 튜터링 시스템 |
| 법률 & 컴플라이언스 | 66-72 | 계약 검토, 컴플라이언스 감사 |
| 기타 | 73-100 | 헬스케어, 커뮤니케이션, 운영, 특화 도메인 |

---

## 하네스 사용 방법

각 하네스는 `harnesses/{nn}-{name}/`에 독립적으로 포함됩니다:

```
{nn}-{harness-name}/
├── HARNESS.md          # 개요, 에이전트 목록, 사용법, 설치
├── agents/
│   ├── specialist-1.md
│   └── ...
└── skills/
    ├── orchestrator/SKILL.md    # 팀 조율
    └── domain-skill/SKILL.md   # 도메인 전문 지식
```

**프로젝트에 하네스 설치:**

```bash
cp -r harnesses/21-code-reviewer/agents/ your-project/.github/agents/
cp -r harnesses/21-code-reviewer/skills/ your-project/.github/skills/
```

그 다음 Copilot CLI에서 자연어로 오케스트레이터 스킬을 실행하세요.

---

## 템플릿

새 하네스를 만들 때 제공된 템플릿을 사용하세요:

- [templates/agent-template.md](templates/agent-template.md) — 에이전트 정의 템플릿
- [templates/orchestrator-skill-template.md](templates/orchestrator-skill-template.md) — 오케스트레이터 SKILL.md 템플릿
- [templates/workspace-layout.md](templates/workspace-layout.md) — `_workspace/` 레이아웃 규칙

---

## 관련 프로젝트: everything-copilot-cli

개별 스킬, 오케스트레이션 패턴, 가이드 — 전체 하네스가 아닌 경우:
→ [drvoss/everything-copilot-cli](https://github.com/drvoss/everything-copilot-cli)

```
everything-copilot-cli    ←→    harness-100-copilot
  패턴 가이드                      전체 하네스 팀
  개별 스킬 (~40개)                팀 하네스 (100개)
  오케스트레이션 예제               프로덕션 파이프라인
```

---

## 기여 방법

1. **하네스 포팅** — 미구현 하네스를 골라 [PORTING-NOTES.md](PORTING-NOTES.md) 참고
2. **기존 하네스 개선** — 버그 수정, 에이전트 프롬프트 개선, 테스트 시나리오 추가
3. **도메인 스킬 추가** — 새 도메인 전용 스킬로 하네스 확장
4. **테스트 및 검증** — `npm test`로 하네스 구조 검증

```bash
npm install
npm test        # 모든 하네스 구조 검증
npm run lint:md # 마크다운 린트
```

---



Apache 2.0 — [LICENSE](LICENSE)와 [ATTRIBUTION.md](ATTRIBUTION.md) 참조

[revfactory/harness-100](https://github.com/revfactory/harness-100) (Apache 2.0)에서 각색.
