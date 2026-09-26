// marquee.js：分类（inside 完全框住 / crossing 相交 / none 没碰到）
function badRect() {
  const error = new Error("rect must have positive w and h");
  error.code = "E_BAD_RECT";
  return error;
}

function badShape() {
  const error = new Error("object must have positive w and h");
  error.code = "E_BAD_SHAPE";
  return error;
}

export function classify(rect, objects) {
  if (!(rect.w > 0) || !(rect.h > 0)) throw badRect();
  const left = rect.x;
  const top = rect.y;
  const right = rect.x + rect.w;
  const bottom = rect.y + rect.h;
  return objects.map((item) => {
    if (!(item.w > 0) || !(item.h > 0)) throw badShape();
    const itemRight = item.x + item.w;
    const itemBottom = item.y + item.h;
    if (item.x >= left && item.y >= top && itemRight <= right && itemBottom <= bottom) {
      return "inside";
    }
    if (item.x < right && itemRight > left && item.y < bottom && itemBottom > top) {
      return "crossing";
    }
    return "none";
  });
}
