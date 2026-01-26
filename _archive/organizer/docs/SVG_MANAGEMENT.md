# SVG管理ガイドライン

## 概要
SVGファイルのパス管理を一元化し、パスの誤りを防ぐためのガイドラインです。

## ファイル構成

### 1. SVGパス管理ファイル
`lib/svg-paths.ts`で全てのSVGパスを一元管理します。

### 2. プログレスバーコンポーネント
`components/ProgressBar.tsx`を使用してプログレスバーを表示します。

## 使用方法

### プログレスバーの表示

```tsx
import ProgressBar from './ProgressBar'

// 主催者用
<ProgressBar type="organizer" step="form" />
<ProgressBar type="organizer" step="confirmation" />
<ProgressBar type="organizer" step="complete" />

// 出店者用
<ProgressBar type="seller" step="form" />
<ProgressBar type="seller" step="confirmation" />
<ProgressBar type="seller" step="complete" />
```

## 新しいSVGを追加する場合

1. `public/`ディレクトリにSVGファイルを配置
2. `lib/svg-paths.ts`の`SVG_PATHS`にパスを追加
3. 必要に応じて`getSvgPath`関数を更新

## ベストプラクティス

1. **直接パスを書かない**: 常に`ProgressBar`コンポーネントまたは`getSvgPath`関数を使用
2. **型安全性**: TypeScriptの型チェックを活用
3. **エラーハンドリング**: `ProgressBar`コンポーネントは自動的にエラーを処理
4. **一貫性**: 同じパターンで全てのSVGを管理

## トラブルシューティング

### SVGが表示されない場合

1. `public/`ディレクトリにファイルが存在するか確認
2. ファイル名が`svg-paths.ts`の定義と一致しているか確認
3. ブラウザのコンソールでエラーを確認
4. `ProgressBar`コンポーネントのエラーメッセージを確認

