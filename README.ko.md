<p align="center">
  <img src="https://raw.githubusercontent.com/primer/octicons/main/icons/copilot-48.svg" width="80" alt="Copilot CLI" />
</p>

<h1 align="center">harness-100-copilot</h1>

<p align="center">
  <strong>GitHub Copilot CLI를 위한 100개 프로덕션급 멀티-에이전트 하네스</strong><br/>
  <a href="https://github.com/revfactory/harness-100">revfactory/harness-100</a>을 Copilot CLI 생태계에 맞게 포팅
</p>

<p align="center">
  <a href="https://github.com/drvoss/harness-100-copilot/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="Apache 2.0" /></a>
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

## 라이선스

Apache 2.0 — [LICENSE](LICENSE)와 [ATTRIBUTION.md](ATTRIBUTION.md) 참조

[revfactory/harness-100](https://github.com/revfactory/harness-100) (Apache 2.0)에서 각색.
