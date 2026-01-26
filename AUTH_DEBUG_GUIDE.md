# 認証セッション問題のデバッグガイド

## 問題: 「ログインしていません」エラー

サインアップ後、オンボーディングページで「ログインしていません」というエラーが表示される。

## 原因の可能性

### 1. Supabaseのメール確認設定
Supabaseでメール確認が有効になっている場合、ユーザーはメールを確認するまでセッションが作成されません。

**確認方法**:
1. Supabase Dashboard → Authentication → Providers → Email
2. 「Confirm email」の設定を確認

**解決策**:
開発環境では「Confirm email」を**OFF**にする

### 2. セッションの確認方法

ブラウザのコンソールで以下を実行:
```javascript
// Supabaseクライアントの取得
const supabase = window.supabase || createClient(...)

// セッション確認
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

// ユーザー確認
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

### 3. サインアップ後の自動ログイン

サインアップ時に自動的にログインされるはずですが、メール確認が必要な場合は手動でログインが必要です。

## 修正手順

### ステップ1: Supabaseの設定確認

1. Supabase Dashboard にアクセス
2. Authentication → Providers → Email
3. 「Confirm email」を**OFF**に設定
4. 「Save」をクリック

### ステップ2: 既存ユーザーの削除

メール確認待ちのユーザーが残っている可能性があるため:

1. Supabase Dashboard → Authentication → Users
2. 作成したテストユーザーを削除
3. 新しくサインアップをやり直す

### ステップ3: 動作確認

1. http://localhost:3002/signup で新規登録
2. オンボーディングページに自動遷移することを確認
3. 情報を入力して「ダッシュボードへ移動」をクリック
4. エラーが出ないことを確認

## デバッグ用コード追加

オンボーディングページに以下のデバッグコードを追加済み:

```typescript
const handleSubmit = async () => {
    // ユーザー情報を取得
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user); // デバッグ用
    
    if (!user) {
        throw new Error("ログインしていません");
    }
    // ...
}
```

ブラウザのコンソール(F12)で「Current user:」のログを確認してください。
- `null`の場合: セッションがない
- オブジェクトの場合: セッションはあるが別の問題

## 次のステップ

1. まずSupabaseの「Confirm email」設定を確認
2. OFFになっていない場合はOFFにする
3. 既存のテストユーザーを削除
4. 新規サインアップをやり直す
