// layers.js：命中顺序 = 完全框住（层序高到低）拼接只相交（层序高到低）
import { plan } from "./marquee.js";

const byLayerDesc = (left, right) => right.z - left.z;

export function orderHits(rect, objects) {
  const { inside, crossing } = plan(rect, objects);
  inside.sort(byLayerDesc);
  crossing.sort(byLayerDesc);
  return inside.concat(crossing).map((item) => item.id);
}
