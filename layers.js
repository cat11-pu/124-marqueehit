// layers.js：命中顺序（完全框住的在前，同组按层序从高到低）
import { classify } from "./marquee.js";

export function orderHits(rect, objects) {
  const marks = classify(rect, objects);
  const inside = [];
  const crossing = [];
  objects.forEach((item, spot) => {
    if (marks[spot] === "inside") inside.push(item);
    else if (marks[spot] === "crossing") crossing.push(item);
  });
  const byLayerDesc = (left, right) => right.z - left.z;
  inside.sort(byLayerDesc);
  crossing.sort(byLayerDesc);
  return inside.concat(crossing).map((item) => item.id);
}
