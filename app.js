// app.js：渲染结果（分类与排序共用 plan 的单趟扫描结果）
import { plan } from "./marquee.js";

const byLayerDesc = (left, right) => right.z - left.z;

export function render(spec) {
  const rect = spec.rect || { x: 0, y: 0, w: 0, h: 0 };
  const objects = spec.objects || [];
  const { inside: insideHits, crossing: crossingHits } = plan(rect, objects);
  insideHits.sort(byLayerDesc);
  crossingHits.sort(byLayerDesc);
  const inside = insideHits.map((item) => item.id);
  const crossing = crossingHits.map((item) => item.id);
  return {
    inside,
    crossing,
    order: inside.concat(crossing),
    inside_count: inside.length,
    crossing_count: crossing.length,
    total: inside.length + crossing.length
  };
}
