[EN](../../README.md) | [RU](README_RU.md) | [ZH](README_ZH-CN.md) | [ES](README_ES.md) | JA | [PT-BR](README_PT-BR.md) | [FR](README_FR.md)

# 🗺️ CanvasMapper

> 日本語版。正典は[英語版](../../README.md)であり、差異がある場合は英語版が優先されます。

> 大規模インタラクティブマップのための高性能 Canvas マップエンジン。

数千の動的オブジェクトを持つマップのために:ゲーム管理パネル、ライブレーダー、
ダッシュボード。すべてを単一の canvas に描画——マーカーごとの DOM ノードなし、
重い依存関係なし。本番環境(RAGE MP 管理パネル)から生まれました。

## ✨ 特徴

- 🚀 dirty flag 付き rAF レンダーループ——アイドル時の CPU コストは約 0
- 🗺️ タイルレンダリング:ビューポートカリング、LRU キャッシュ、リクエスト重複排除、LOD クランプ
- 🔌 差し替え可能なソース:URL ピラミッド、フラットマトリクス、大きな 1 枚画像
- 🎯 マーカーとレイヤー:カリング、スプライトキャッシュ、ヒットテスト(1000 個以上で 60 FPS)
- 🖱️ 滑らかな小数ズーム、カーソル位置ズーム、慣性、タッチ&ピンチ
- 🎨 CSS テーマ対応ズームコントロール——あなたの CSS が常に勝つ
- 📱 Retina/HiDPI 対応
- 🧰 CLI:任意の画像をタイルピラミッドへスライス
- ⚡ ブラウザでのランタイム依存ゼロ、完全な TypeScript 型

## 📦 インストール

```bash
npm install canvasmapper
```

または script タグ(UMD):

```html
<script src="https://unpkg.com/canvasmapper/dist/canvasmapper.umd.js"></script>
```

## 🚀 クイックスタート

```javascript
import { MapEngine, UrlTileSource } from 'canvasmapper';

const map = new MapEngine(document.getElementById('map'), {
    source: new UrlTileSource({ urlTemplate: '/tiles/{z}/{x}_{y}.png' }),
});
map.setView({ x: 0, y: 0, zoom: 2 });
```

## 🧰 CLI

```bash
npm install -g canvasmapper
canvasmapper slice -i map.jpg -o ./tiles -s 256 -f jpeg -q 80
```

## 📚 ドキュメント

- [入門](../getting-started.md)
- [タイルソース](../tile-sources.md)
- [コントロールと CSS テーマ](../controls-styling.md)
- [API リファレンス](../api-reference.md)

## 🧪 開発

```bash
npm run dev      # デモ http://localhost:3000
npm run test     # vitest watch モード
npm run check    # lint + format + build + build:cli
```

## 🛣️ ロードマップ

- PMTiles ソース(単一ファイル、HTTP range リクエスト)
- 一時エフェクト(ピン、射撃)のためのオブジェクトプーリング
- Web Worker でのタイルデコード

## 📄 ライセンス

MIT © akak1y
