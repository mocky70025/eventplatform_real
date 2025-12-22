# 開発者ツールの使い方（Cursor Browser）

## 開発者ツールを開く方法

### 方法1: キーボードショートカット
- **Mac**: `Cmd + Option + I` または `F12`
- **Windows/Linux**: `Ctrl + Shift + I` または `F12`

### 方法2: 右クリックメニュー
1. ページ上で右クリック
2. 「検証」または「Inspect」を選択

### 方法3: メニューから
1. ブラウザのメニュー（右上の3点リーダー）を開く
2. 「その他のツール」→「開発者ツール」

## 開発者ツールの画面構成

開発者ツールを開くと、画面の下部または右側にパネルが表示されます。

### 主要なタブ
- **Elements**: HTML要素の確認・編集
- **Console**: JavaScriptコードの実行、ログの確認 ⭐ **今回使用**
- **Network**: ネットワークリクエストの確認
- **Application**: ストレージ（LocalStorage、SessionStorage）の確認・編集

## ConsoleタブでsessionStorageを操作する方法

### 1. Consoleタブを開く
開発者ツールの「Console」タブをクリックします。

### 2. コードを入力
Consoleタブの下部にある入力欄（`>` マークの横）にコードを入力します。

### 3. Enterキーで実行
コードを入力したら、`Enter`キーを押して実行します。

## sessionStorageの操作コマンド

### sessionStorageの値を設定する
```javascript
sessionStorage.setItem('キー名', '値')
```

### sessionStorageの値を確認する
```javascript
sessionStorage.getItem('キー名')
```

### すべてのsessionStorageを確認する
```javascript
console.log(sessionStorage)
```

### sessionStorageをクリアする（リセット）
```javascript
sessionStorage.clear()
location.reload() // ページをリロード
```

## 実用的な例

### 出店者アプリ - 登録フォームを表示
```javascript
sessionStorage.setItem('user_id', 'test-user-id')
sessionStorage.setItem('auth_type', 'email')
sessionStorage.setItem('is_registered', 'false')
location.reload()
```

### 出店者アプリ - イベント一覧を表示
```javascript
sessionStorage.setItem('user_id', 'test-user-id')
sessionStorage.setItem('auth_type', 'email')
sessionStorage.setItem('is_registered', 'true')
location.reload()
```

### 主催者アプリ - 登録フォームを表示
```javascript
sessionStorage.setItem('user_id', 'test-user-id')
sessionStorage.setItem('auth_type', 'email')
sessionStorage.setItem('is_registered', 'false')
location.reload()
```

### 主催者アプリ - イベント管理画面を表示
```javascript
sessionStorage.setItem('user_id', 'test-user-id')
sessionStorage.setItem('auth_type', 'email')
sessionStorage.setItem('is_registered', 'true')
location.reload()
```

### ログイン画面に戻す（リセット）
```javascript
sessionStorage.clear()
location.reload()
```

## 便利な機能

### 1. コピー&ペーストでコードを実行
長いコードを書く場合は、メモ帳などで書いてからコピー&ペーストできます。

### 2. 履歴機能
`↑`キーで以前入力したコマンドを呼び出せます。

### 3. エラーメッセージの確認
コードにエラーがある場合、Consoleにエラーメッセージが表示されます。

## Applicationタブでの確認方法（オプション）

### sessionStorageの値を視覚的に確認
1. 「Application」タブを開く
2. 左側のメニューから「Storage」→「Session Storage」→ サイトのURLを選択
3. 右側にsessionStorageの値が一覧表示されます

### 手動で値を編集
Applicationタブから直接値を編集・削除することもできます。

