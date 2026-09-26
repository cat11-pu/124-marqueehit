// layers.js：排序（基线：原样返回）
import { classify } from "./marquee.js";

export function orderHits(rect, objects) {
  return objects.map((item) => item.id);
}
