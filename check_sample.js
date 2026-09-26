import fs from "node:fs";
import { classify } from "./marquee.js";
import { orderHits } from "./layers.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/select.json", "utf8"));
const view = render(spec);

emit("完全框住的编号 =", JSON.stringify(view.inside));
emit("只相交的编号 =", JSON.stringify(view.crossing));
emit("命中顺序 =", JSON.stringify(view.order));
emit("完全框住的个数 =", view.inside_count);
emit("只相交的个数 =", view.crossing_count);
emit("命中总数 =", view.total);
emit("无效框的错误码 =", spec.rect_error_code);
emit("非法形状的错误码 =", spec.shape_error_code);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  classify({ x: 0, y: 0, w: -1, h: 5 }, [{ id: "a", x: 0, y: 0, w: 1, h: 1, z: 1 }]);
  emit("无效框的错误码", "没有报错");
} catch (error) {
  emit("无效框的错误码", error && error.code ? error.code : String(error.message));
}
try {
  classify({ x: 0, y: 0, w: 5, h: 5 }, [{ id: "a", x: 0, y: 0, w: -1, h: 1, z: 1 }]);
  emit("非法形状的错误码", "没有报错");
} catch (error) {
  emit("非法形状的错误码", error && error.code ? error.code : String(error.message));
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "完全框住的编号": [
    "c",
    "a"
  ],
  "只相交的编号": [
    "b"
  ],
  "命中顺序": [
    "c",
    "a",
    "b"
  ],
  "完全框住的个数": 2,
  "只相交的个数": 1,
  "命中总数": 3,
  "无效框的错误码": "E_BAD_RECT",
  "非法形状的错误码": "E_BAD_SHAPE"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
