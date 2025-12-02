# OpenAI API環境変数設定手順

## 概要

営業許可証のAI読み取り機能を使用するために、OpenAI APIキーを設定する必要があります。

## 1. OpenAI APIキーの取得

1. [OpenAI Platform](https://platform.openai.com/) にアクセス
2. アカウントにログイン（または新規登録）
3. 左メニューから「API keys」を選択
4. 「Create new secret key」をクリック
5. キー名を入力（例: "Tomorrow Event Platform"）
6. 生成されたAPIキーをコピー（**このキーは一度しか表示されないため、必ず保存してください**）

## 2. Vercelでの環境変数設定

### 手順

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクトを選択
3. 「Settings」タブをクリック
4. 左メニューから「Environment Variables」を選択
5. 「Add New」をクリック
6. 以下の情報を入力：
   - **Key**: `OPENAI_API_KEY`
   - **Value**: コピーしたOpenAI APIキー
   - **Environment**: 
     - ✅ Production（本番環境）
     - ✅ Preview（プレビュー環境）
     - ✅ Development（開発環境）
7. 「Save」をクリック

### 重要事項

- 環境変数を追加・変更した後は、**再デプロイが必要**です
- Vercelのダッシュボードから「Deployments」タブに移動し、最新のデプロイメントを選択して「Redeploy」をクリックしてください

## 3. ローカル開発環境での設定

### organizer/.env.local に追加

```bash
cd organizer
```

`.env.local` ファイルを開き（存在しない場合は作成）、以下を追加：

```env
# OpenAI API設定
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**注意**: `sk-` で始まる実際のAPIキーに置き換えてください。

### ローカルで動作確認

```bash
cd organizer
npm run dev
```

## 4. 動作確認

1. 主催者アプリにログイン
2. イベントの申し込み管理画面を開く
3. 出店者の詳細を表示
4. 営業許可証の画像が表示されていることを確認
5. 「期限確認」ボタンをクリック
6. 確認結果が表示されることを確認

## 5. トラブルシューティング

### エラー: "OpenAI API is not configured"

- 環境変数 `OPENAI_API_KEY` が正しく設定されているか確認
- Vercelの場合、再デプロイが必要な場合があります
- ローカルの場合、開発サーバーを再起動してください

### エラー: "Invalid API key"

- APIキーが正しくコピーされているか確認
- APIキーに余分なスペースや改行が含まれていないか確認
- OpenAI PlatformでAPIキーが有効か確認

### エラー: "Rate limit exceeded"

- OpenAI APIの使用制限に達している可能性があります
- [OpenAI Platform](https://platform.openai.com/account/billing) で使用状況を確認
- 必要に応じて、使用制限を引き上げるか、プランをアップグレード

## 6. セキュリティに関する注意事項

- **APIキーは絶対にGitにコミットしないでください**
- `.env.local` ファイルは `.gitignore` に含まれています
- Vercelの環境変数は暗号化されて保存されます
- APIキーを共有する際は、安全な方法（例: 1Password、LastPass）を使用してください

## 7. コスト管理

- OpenAI APIは使用量に応じて課金されます
- [OpenAI Platform](https://platform.openai.com/account/billing) で使用量とコストを監視できます
- 必要に応じて、使用制限を設定してください

## 参考リンク

- [OpenAI Platform](https://platform.openai.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

