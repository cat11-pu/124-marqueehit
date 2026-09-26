import assert from "node:assert";
import { classify } from "../marquee.js";
import { orderHits } from "../layers.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("classify returns marks", () => {
  assert.ok(Array.isArray(classify({ x: 0, y: 0, w: 5, h: 5 }, [{ id: "a", x: 1, y: 1, w: 1, h: 1, z: 1 }])));
});

check("classify returns one mark per object", () => {
  const marks = classify({ x: 0, y: 0, w: 5, h: 5 }, [{ id: "a", x: 1, y: 1, w: 1, h: 1, z: 1 }, { id: "b", x: 9, y: 9, w: 1, h: 1, z: 2 }]);
  assert.strictEqual(marks.length, 2);
});

check("orderHits returns ids", () => {
  assert.ok(Array.isArray(orderHits({ x: 0, y: 0, w: 5, h: 5 }, [{ id: "a", x: 1, y: 1, w: 1, h: 1, z: 1 }])));
});

check("render counts hits", () => {
  const view = render({ rect: { x: 0, y: 0, w: 5, h: 5 }, objects: [] });
  assert.strictEqual(typeof view.total, "number");
});

check("render exposes inside list", () => {
  const view = render({ rect: { x: 0, y: 0, w: 5, h: 5 }, objects: [] });
  assert.ok(Array.isArray(view.inside));
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
