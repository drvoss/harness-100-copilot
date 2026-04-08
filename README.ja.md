<p align="center">
  <img src="https://raw.githubusercontent.com/primer/octicons/main/icons/copilot-48.svg" width="80" alt="Copilot CLI" />
</p>

<h1 align="center">harness-100-copilot</h1>

<p align="center">
  <strong>GitHub Copilot CLI 向け プロダクショングレードのマルチエージェントハーネス 100 本</strong><br/>
  <a href="https://github.com/revfactory/harness-100">revfactory/harness-100</a> を Copilot CLI エコシステム向けに移植
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="Apache 2.0" /></a>
  <a href="#"><img src="https://img.shields.io/badge/copilot--cli-ready-28a745?logo=github" alt="Copilot CLI Ready" /></a>
  <a href="#"><img src="https://img.shields.io/badge/harnesses-15%20of%20100-yellow" alt="15 of 100 Harnesses" /></a>
  <a href="#"><img src="https://img.shields.io/badge/agents-73-blueviolet" alt="73 Agents" /></a>
  <a href="#"><img src="https://img.shields.io/badge/parity-~96%25-green" alt="~96% parity" /></a>
</p>

<p align="center">
  <a href="README.md">🇺🇸 English</a> ·
  <a href="README.ko.md">🇰🇷 한국어</a> ·
  <a href="README.zh.md">🇨🇳 中文</a>
</p>

---

## このプロジェクトとは？

**harness-100-copilot** は [revfactory/harness-100](https://github.com/revfactory/harness-100) を **GitHub Copilot CLI** 向けに移植したプロジェクトです。

オリジナルの harness-100 は Claude Code の `SendMessage` を使ってエージェント同士がリアルタイムで通信する構成です。本プロジェクトでは Phase 2 の **15 本のハーネス** を Copilot CLI の**ファイルベースメッセージバス**パターンへ変換し、最終的に 100 本すべての移植を目指しています（**~96% の機能同等性**）。

> **ハーネスとは？** フルスタックアプリの開発・PR レビュー・CI/CD パイプライン構築といった複雑なタスクを、構造化されたパイプラインで協調処理する 4〜7 名の専門エージェントチームのことです。

---

## 一目でわかる概要

| 項目 | 値 |
|------|---|
| 全ハーネス数 | 現在 15 本（Phase 2 完了）、10 ドメインで 100 本を計画 |
| エージェント定義 | 現在 73 個（100 本完成時は 489 個） |
| スキル（オーケストレーター + ドメイン） | 現在 43 個（100 本完成時は 315 個） |
| オリジナルとの機能同等性 | ~96% |
| 主な変換点 | `SendMessage` → ファイルベースメッセージバス |
| 主な用途 | Copilot CLI での複雑なマルチエージェントワークフロー |

---

## クイックスタート

```bash
# 1. リポジトリをクローン
git clone https://github.com/drvoss/harness-100-copilot.git

# 2. ハーネスをプロジェクトにコピー（例: code-reviewer）
cp -r harness-100-copilot/harnesses/21-code-reviewer/agents/ .github/agents/
cp -r harness-100-copilot/harnesses/21-code-reviewer/skills/ .github/skills/
cp -r harness-100-copilot/references/ references/   # セキュリティ・テスト・パフォーマンス系ハーネスで必要

# 3. Copilot CLI を起動
cd your-project
copilot

# 4. ハーネスを実行
> セキュリティとアーキテクチャの観点で最近の変更をレビューしてください
```

> 📖 詳細なセットアップ手順は [guides/installation.md](guides/installation.md) を参照してください。

---

## 主な違い: メッセージバス

オリジナル harness-100 は Claude Code の `SendMessage` でエージェント間をリアルタイム通信します:

```
style-inspector → SendMessage(synthesizer, findings)
security-analyst → SendMessage(synthesizer, findings)
```

GitHub Copilot CLI にはこのプリミティブがありません。代わりに**ファイルベースメッセージバス**を使います:

```
_workspace/
  messages/
    style-inspector-to-review-synthesizer.md
    security-analyst-to-review-synthesizer.md
    performance-analyst-to-review-synthesizer.md
  01_style_review.md
  02_security_review.md
  ...
```

各エージェントは出力と構造化メッセージ要約を `_workspace/messages/` に書き込み、次のエージェントが読み込んでから処理を開始します。追加インフラなしで**通信の豊富さの ~90%** を実現しています。

> 📖 詳細は [guides/message-bus-pattern.md](guides/message-bus-pattern.md) と [PORTING-NOTES.md](PORTING-NOTES.md) を参照してください。

---

## ハーネス一覧

### ✅ カテゴリ 2: ソフトウェア開発 & DevOps（16-30）— Phase 2（現在利用可能）

| # | ハーネス | 説明 | ステータス |
|---|---------|------|-----------|
| 16 | [fullstack-webapp](harnesses/16-fullstack-webapp/) | フルスタック Web アプリ: 設計 → フロントエンド → バックエンド → テスト → デプロイ | ✅ 利用可能 |
| 17 | [mobile-app-builder](harnesses/17-mobile-app-builder/) | モバイルアプリ: UI/UX、コード、API、ストア公開 | ✅ 利用可能 |
| 18 | [api-designer](harnesses/18-api-designer/) | REST/GraphQL API: 設計、ドキュメント、モック、テスト | ✅ 利用可能 |
| 19 | [database-architect](harnesses/19-database-architect/) | DB 設計: モデリング、最適化、マイグレーション | ✅ 利用可能 |
| 20 | [cicd-pipeline](harnesses/20-cicd-pipeline/) | CI/CD: 設計、セキュリティゲート、モニタリング | ✅ 利用可能 |
| 21 | [code-reviewer](harnesses/21-code-reviewer/) | コードレビュー: スタイル、セキュリティ、パフォーマンス、アーキテクチャ | ✅ 利用可能 |
| 22 | [legacy-modernizer](harnesses/22-legacy-modernizer/) | レガシーコードのモダナイズとリファクタリング | ✅ 利用可能 |
| 23 | [microservice-designer](harnesses/23-microservice-designer/) | マイクロサービスのアーキテクチャと分解 | ✅ 利用可能 |
| 24 | [test-automation](harnesses/24-test-automation/) | テスト自動化の戦略と実装 | ✅ 利用可能 |
| 25 | [incident-postmortem](harnesses/25-incident-postmortem/) | インシデント分析とポストモーテム生成 | ✅ 利用可能 |
| 26 | [infra-as-code](harnesses/26-infra-as-code/) | Terraform/Kubernetes を使ったインフラのコード化 | ✅ 利用可能 |
| 27 | [data-pipeline](harnesses/27-data-pipeline/) | データパイプラインの設計と実装 | ✅ 利用可能 |
| 28 | [security-audit](harnesses/28-security-audit/) | 包括的なセキュリティ監査 | ✅ 利用可能 |
| 29 | [performance-optimizer](harnesses/29-performance-optimizer/) | アプリケーションパフォーマンスの最適化 | ✅ 利用可能 |
| 30 | [open-source-launcher](harnesses/30-open-source-launcher/) | オープンソースプロジェクトの公開 | ✅ 利用可能 |

### 🔜 その他のカテゴリ（近日公開予定）

| カテゴリ | 範囲 | ドメイン |
|----------|------|---------|
| コンテンツ制作 & クリエイティブ | 01-15 | YouTube、ポッドキャスト、ニュースレター、ブランド |
| データ & AI/ML | 31-42 | ML 実験、データ分析、LLM アプリ |
| ビジネス & 戦略 | 43-55 | 市場分析、戦略立案 |
| 教育 & 学習 | 56-65 | コース設計、チュータリングシステム |
| 法律 & コンプライアンス | 66-72 | 契約レビュー、コンプライアンス監査 |
| ヘルス & ライフスタイル | 73-80 | 健康管理、ウェルネスプラン |
| コミュニケーション & ドキュメント | 81-88 | テクニカルライティング、ドキュメント作成 |
| オペレーション & プロセス | 89-95 | プロジェクト管理、プロセス最適化 |
| 専門ドメイン | 96-100 | ファイナンス、リサーチ、ニッチドメイン |

---

## ハーネスの使い方

各ハーネスは `harnesses/{nn}-{name}/` に自己完結した形で格納されています:

```
{nn}-{harness-name}/
├── HARNESS.md          # 概要、エージェント一覧、使用方法、インストール手順
├── agents/
│   ├── specialist-1.md
│   ├── specialist-2.md
│   └── ...
└── skills/
    ├── orchestrator/SKILL.md    # レイヤー 1: チーム調整
    ├── domain-skill-1/SKILL.md  # レイヤー 2: ドメイン専門知識
    └── domain-skill-2/SKILL.md  # レイヤー 2: ドメイン専門知識
```

**プロジェクトへのハーネスのインストール:**

```bash
# エージェントとスキルをプロジェクトの .github ディレクトリにコピー
cp -r harnesses/21-code-reviewer/agents/ your-project/.github/agents/
cp -r harnesses/21-code-reviewer/skills/ your-project/.github/skills/
```

その後、Copilot CLI で自然言語のリクエストによりオーケストレータースキルを起動します。

> 📖 詳細手順は [guides/installation.md](guides/installation.md) を参照してください。

---

## テンプレート

新しいハーネスを作成する際は、提供されているテンプレートをご利用ください:

- [templates/agent-template.md](templates/agent-template.md) — エージェント定義テンプレート
- [templates/orchestrator-skill-template.md](templates/orchestrator-skill-template.md) — オーケストレーター SKILL.md テンプレート
- [templates/workspace-layout.md](templates/workspace-layout.md) — `_workspace/` レイアウト規約

---

## 関連プロジェクト: everything-copilot-cli

個別スキル、オーケストレーションパターン、ガイドについては（フルハーネスではなく）:
→ [drvoss/everything-copilot-cli](https://github.com/drvoss/everything-copilot-cli)

```
everything-copilot-cli    ←→    harness-100-copilot
  パターンガイド                    フルハーネスチーム
  個別スキル（~40 本）              チームハーネス（100 本）
  オーケストレーション例             プロダクションパイプライン
```

---

## コントリビューション

1. **ハーネスの移植** — 未実装のハーネスを選んで [PORTING-NOTES.md](PORTING-NOTES.md) に従う
2. **既存ハーネスの改善** — バグ修正、エージェントプロンプトの改良、テストシナリオの追加
3. **ドメインスキルの追加** — 新しいドメイン専用スキルでハーネスを拡張
4. **テストと検証** — `npm test` でハーネス構造を検証

```bash
npm install
npm test        # 全ハーネス構造の検証
npm run lint:md # Markdown のリント
```

---

## ライセンス

Apache 2.0 — [LICENSE](LICENSE) と [ATTRIBUTION.md](ATTRIBUTION.md) を参照してください。

[revfactory/harness-100](https://github.com/revfactory/harness-100)（Apache 2.0）から移植。

---

<p align="center">
  <sub>GitHub Copilot CLI コミュニティのために構築 · <a href="https://github.com/revfactory/harness-100">revfactory/harness-100</a> から移植</sub>
</p>
