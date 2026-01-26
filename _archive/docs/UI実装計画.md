# UI実装計画

## 現在のページ構成

### store (出店者アプリ)
1. **WelcomeScreen** - ログイン・新規登録画面
2. **RegistrationForm** - 登録フォーム（3ステップ）
3. **EventList** - イベント一覧・検索
4. **ExhibitorProfile** - プロフィール表示・編集
5. **ApplicationManagement** - 申し込み管理
6. **NotificationBox** - 通知一覧

### organizer (主催者アプリ)
1. **WelcomeScreen** - ログイン・新規登録画面
2. **RegistrationForm** - 登録フォーム
3. **EventManagement** - イベント管理（一覧・作成・編集）
4. **EventForm** - イベント作成・編集フォーム
5. **EventApplications** - 申し込み管理
6. **OrganizerProfile** - プロフィール表示・編集
7. **NotificationBox** - 通知一覧

### admin (運営管理)
1. **AdminDashboard** - 主催者承認・イベント管理

## 実装の進め方（提案）

### オプション1: ページごとに順番に実装
**メリット**: 1ページずつ完成させられる、進捗が明確
**デメリット**: 時間がかかる

1. WelcomeScreen（ログイン・新規登録）
2. RegistrationForm（登録フォーム）
3. EventList / EventManagement（メイン機能）
4. Profile（プロフィール）
5. ApplicationManagement / EventApplications（申し込み管理）
6. NotificationBox（通知）

### オプション2: コンポーネントごとに実装
**メリット**: 共通コンポーネントを先に作れる、再利用性が高い
**デメリット**: 全体像が見えにくい

1. 共通コンポーネント（Button, Card, Input, Badge）
2. 各ページに適用

### オプション3: 優先順位をつけて実装
**メリット**: 重要なページから改善できる
**デメリット**: 優先順位の決定が必要

**優先度 高**:
- WelcomeScreen（最初に見る画面）
- EventList / EventManagement（メイン機能）

**優先度 中**:
- RegistrationForm（登録フォーム）
- Profile（プロフィール）

**優先度 低**:
- ApplicationManagement / EventApplications
- NotificationBox

## 推奨アプローチ

**オプション1（ページごとに順番）**を推奨します。

### 理由
- 1ページずつ完成させられる
- 進捗が明確
- デザインシステムを段階的に適用できる

### 実装順序

#### Phase 1: 認証・登録
1. WelcomeScreen（store + organizer）
2. RegistrationForm（store + organizer）

#### Phase 2: メイン機能
3. EventList（store）
4. EventManagement（organizer）
5. EventForm（organizer）

#### Phase 3: プロフィール・管理
6. ExhibitorProfile / OrganizerProfile
7. ApplicationManagement / EventApplications
8. NotificationBox

#### Phase 4: 運営管理
9. AdminDashboard

## 各ページの実装内容

### 1ページごとに
1. **デザインシステムを適用**
   - カラー、タイポグラフィ、スペーシングを統一
2. **レイアウトを改善**
   - モダンなレイアウトに変更
3. **コンポーネントを統一**
   - ボタン、カード、入力欄を統一スタイルに
4. **アニメーションを追加**
   - トランジション、ホバー効果

## 質問

1. どの進め方が良いですか？（オプション1/2/3、または別の方法）
2. どのページから始めますか？
3. デザインの方向性はありますか？（例: ミニマル、カラフル、モダンなど）

