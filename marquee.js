// marquee.js：一次扫描给每个对象分类（inside/crossing/none），同时按类收桶
function isPositiveSize(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

// 单趟结果：marks 与 objects 等长同序；inside/crossing 已按命中类收齐，排序直接复用
export function plan(rect, objects) {
  if (!rect || !isPositiveSize(rect.w) || !isPositiveSize(rect.h)) {
    throw fail("E_BAD_RECT", "rect width and height must be positive");
  }
  const list = objects || [];
  const left = rect.x;
  const top = rect.y;
  const right = left + rect.w;
  const bottom = top + rect.h;
  const marks = new Array(list.length);
  const inside = [];
  const crossing = [];
  for (let i = 0; i < list.length; i += 1) {
    const item = list[i];
    if (!item || !isPositiveSize(item.w) || !isPositiveSize(item.h)) {
      throw fail("E_BAD_SHAPE", "object width and height must be positive");
    }
    const itemRight = item.x + item.w;
    const itemBottom = item.y + item.h;
    // 含贴边：边压在框边上也算完全框住
    if (item.x >= left && item.y >= top && itemRight <= right && itemBottom <= bottom) {
      marks[i] = "inside";
      inside.push(item);
    } else {
      // 只有正面积重叠才算相交，仅贴边（重叠宽或高为 0）落到 none
      const overlapW = Math.min(itemRight, right) - Math.max(item.x, left);
      const overlapH = Math.min(itemBottom, bottom) - Math.max(item.y, top);
      if (overlapW > 0 && overlapH > 0) {
        marks[i] = "crossing";
        crossing.push(item);
      } else {
        marks[i] = "none";
      }
    }
  }
  return { marks, inside, crossing };
}

export function classify(rect, objects) {
  return plan(rect, objects).marks;
}
