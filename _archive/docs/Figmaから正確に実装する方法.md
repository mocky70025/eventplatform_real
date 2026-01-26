# Figmaから正確に実装する方法

## 方法1: Figma MCPツールを使用（最も正確）

### 前提条件
- FigmaファイルのURLが必要
- Figmaデスクトップアプリが開いている必要がある（オプション）

### 手順
1. Figmaで該当の画面/コンポーネントを開く
2. 対象のフレームまたはノードを選択
3. URLをコピー（例: `https://figma.com/design/[fileKey]/[fileName]?node-id=[nodeId]`）
4. このツールにURLを提供すると、以下の情報を取得できます：
   - 正確なレイアウト情報（位置、サイズ）
   - スタイル情報（色、フォント、スペーシング）
   - コンポーネント構造
   - CSSプロパティ

### 使用例
```
Figma URL: https://figma.com/design/xxxxx/主催者イベント編集?node-id=123:456
```

## 方法2: Figma Dev Modeを使用

### 手順
1. Figmaで「Dev Mode」を有効にする（右上の「Dev Mode」ボタン）
2. 実装したい要素を選択
3. 右パネルに表示される情報を確認：
   - **Spacing**: Padding, Gap, Margin
   - **Typography**: Font size, Weight, Line height
   - **Colors**: HEX値
   - **Effects**: Shadow, Blur
   - **Layout**: Width, Height, Border radius
4. 「Code」タブからCSS/Reactコードをコピー

### 注意点
- Dev Modeで表示されるコードは参考程度に
- 実際のプロジェクトに合わせて調整が必要

## 方法3: 手動でスペックを抽出

### 抽出すべき情報

#### レイアウト
- コンテナの幅・高さ
- Padding（上、右、下、左）
- Margin（上、右、下、左）
- Gap（要素間の間隔）

#### タイポグラフィ
- フォントファミリー
- フォントサイズ（px）
- フォントウェイト（100-900）
- 行間（Line height）
- 文字間隔（Letter spacing）

#### 色
- 背景色（HEX値）
- テキスト色（HEX値）
- ボーダー色（HEX値）

#### エフェクト
- Shadow（X, Y, Blur, Spread, Color, Opacity）
- Border radius（px）

#### その他
- Border width
- Opacity
- Blur

### 抽出方法
1. Figmaで要素を選択
2. 右パネルの「Design」タブを確認
3. 各プロパティの値をメモまたはスクリーンショット

## 方法4: デザインシステムを確立

### 推奨アプローチ
1. **Figmaでスタイルを定義**
   - Color Styles（色）
   - Text Styles（テキスト）
   - Effect Styles（シャドウなど）

2. **コードで同じスタイルを定義**
   ```typescript
   // design-system.ts
   export const colors = {
     primary: '#FF8A5C',
     background: '#E8F5F5',
     text: {
       main: '#2C3E50',
       sub: '#6C757D',
     },
   }
   
   export const typography = {
     heading: {
       fontSize: '24px',
       fontWeight: 700,
       lineHeight: '120%',
     },
     body: {
       fontSize: '16px',
       fontWeight: 400,
       lineHeight: '150%',
     },
   }
   
   export const spacing = {
     xs: '8px',
     sm: '12px',
     md: '16px',
     lg: '24px',
     xl: '32px',
   }
   ```

3. **コンポーネントで使用**
   ```tsx
   import { colors, typography, spacing } from '@/design-system'
   
   <div style={{
     padding: spacing.lg,
     color: colors.text.main,
     ...typography.heading
   }}>
   ```

## 実装時のチェックリスト

### レイアウト
- [ ] コンテナの幅・高さが一致しているか
- [ ] Padding/Marginが正確か
- [ ] Gapが正確か
- [ ] 要素の位置（Left, Top）が一致しているか

### タイポグラフィ
- [ ] フォントファミリーが一致しているか
- [ ] フォントサイズが正確か（px単位）
- [ ] フォントウェイトが正確か
- [ ] 行間が正確か
- [ ] テキストの色が正確か

### 色
- [ ] 背景色が正確か（HEX値で確認）
- [ ] テキスト色が正確か
- [ ] ボーダー色が正確か

### エフェクト
- [ ] Shadowが正確か（X, Y, Blur, Spread, Color, Opacity）
- [ ] Border radiusが正確か
- [ ] Opacityが正確か

## トラブルシューティング

### 問題: サイズが微妙に違う
- **原因**: pxとremの違い、ブラウザのデフォルトスタイル
- **解決**: 明確にpx単位で指定し、`box-sizing: border-box`を設定

### 問題: フォントが違う
- **原因**: フォントファミリーの指定が不完全
- **解決**: フォールバックフォントを含める（例: `"Noto Sans JP", sans-serif`）

### 問題: スペーシングが違う
- **原因**: デフォルトのmargin/padding
- **解決**: CSSリセットを使用、または各要素で明示的に指定

### 問題: 色が違う
- **原因**: RGBとHEXの変換、透明度の扱い
- **解決**: FigmaのHEX値を直接使用

## ベストプラクティス

1. **Figma URLを共有する**: 最も正確な情報を取得できます
2. **デザインシステムを先に定義する**: 一貫性が保たれます
3. **小さな単位から実装する**: ボタン→フォーム→ページの順
4. **定期的に比較する**: 実装中にFigmaと並べて確認
5. **デザイナーとコミュニケーション**: 不明な点は確認

## 次のステップ

1. FigmaファイルのURLを共有してください
2. 実装したい画面/コンポーネントを指定してください
3. 必要に応じて、デザインシステムの定義から始めます


