[EN](../../README.md) | [RU](README_RU.md) | ZH | [ES](README_ES.md) | [JA](README_JA.md) | [PT-BR](README_PT-BR.md) | [FR](README_FR.md)

# 🗺️ CanvasMapper

> 简体中文版本。权威文本为[英文版](../../README.md)，如有出入以英文版为准。

> 面向大规模交互地图的高性能 Canvas 地图引擎。

为拥有数千个动态对象的地图而生：游戏管理面板、实时雷达、数据看板。
所有内容绘制在同一张 canvas 上——每个标记不占用 DOM 节点，无重型依赖。
诞生于生产环境（RAGE MP 管理面板）。

## ✨ 特性

- 🚀 带 dirty flag 的 rAF 渲染循环——空闲时 CPU 占用约 0
- 🗺️ 瓦片渲染：视口裁剪、LRU 缓存、请求去重、LOD 钳制
- 🔌 可插拔数据源：URL 金字塔、平面矩阵、单张大图
- 🎯 标记与图层：裁剪、精灵缓存、命中检测（1000+ 标记 60 FPS）
- 🖱️ 平滑小数级缩放、指向光标缩放、惯性、触摸与双指捏合
- 🎨 缩放控件支持 CSS 主题化——你的 CSS 永远优先
- 📱 支持 Retina/HiDPI
- 🧰 CLI：将任意图片切分为瓦片金字塔
- ⚡ 浏览器端零运行时依赖；完整的 TypeScript 类型

## 📦 安装

```bash
npm install canvasmapper
```

或通过 script 标签（UMD）：

```html
<script src="https://unpkg.com/canvasmapper/dist/canvasmapper.umd.js"></script>
```

## 🚀 快速开始

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

## 📚 文档

- [入门指南](../getting-started.md)
- [瓦片数据源](../tile-sources.md)
- [控件与 CSS 主题化](../controls-styling.md)
- [API 参考](../api-reference.md)

## 🧪 开发

```bash
npm run dev      # 演示 http://localhost:3000
npm run test     # vitest watch 模式
npm run check    # lint + format + build + build:cli
```

## 🛣️ 路线图

- PMTiles 数据源（单文件，HTTP range 请求）
- 瞬时特效（ping、弹道）的对象池
- Web Worker 瓦片解码

## 📄 许可证

MIT © akak1y
