// app.js：渲染结果
import { classify } from "./marquee.js";
import { orderHits } from "./layers.js";

export function render(spec) {
  const rect = spec.rect || { x: 0, y: 0, w: 0, h: 0 };
  const objects = spec.objects || [];
  const marks = classify(rect, objects);
  const pick = (want) => objects.filter((item, spot) => marks[spot] === want)
    .slice().sort((left, right) => right.z - left.z).map((item) => item.id);
  const inside = pick("inside");
  const crossing = pick("crossing");
  return { inside: inside, crossing: crossing, order: orderHits(rect, objects),
           inside_count: inside.length, crossing_count: crossing.length,
           total: inside.length + crossing.length };
}
