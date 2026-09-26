// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  let grow = 0;
  parts.log.textContent = "对象 " + (spec.objects || []).length + " 个，点按钮看框选命中。";

  function draw() {
    const base = spec.rect || { x: 0, y: 0, w: 50, h: 50 };
    const scene = Object.assign({}, spec, { rect: { x: base.x, y: base.y, w: base.w + grow, h: base.h + grow } });
    let view = null;
    try {
      view = render(scene);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    (spec.objects || []).forEach(function (item) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = item.id;
      row.appendChild(head);
      const mark = document.createElement("span");
      mark.className = "chip" + (view.order.indexOf(item.id) !== -1 ? " ok" : " bad");
      mark.textContent = view.inside.indexOf(item.id) !== -1 ? "完全框住"
        : (view.crossing.indexOf(item.id) !== -1 ? "只相交" : "没碰到");
      row.appendChild(mark);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "框住 " + view.inside.length + " 个，相交 " + view.crossing.length
      + " 个，命中 " + view.total + " 个";
    parts.log.textContent = "命中顺序：" + JSON.stringify(view.order);
  }

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "框选一次";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const growButton = document.createElement("button");
  growButton.textContent = "框加五像素";
  growButton.addEventListener("click", function () {
    grow = grow + 5;
    draw();
  });
  parts.controls.appendChild(growButton);

  const shrinkButton = document.createElement("button");
  shrinkButton.textContent = "框减五像素";
  shrinkButton.addEventListener("click", function () {
    grow = Math.max(-40, grow - 5);
    draw();
  });
  parts.controls.appendChild(shrinkButton);

  const label = document.createElement("label");
  label.textContent = "只看命中总数";
  parts.controls.appendChild(label);

  const box = document.createElement("input");
  box.type = "text";
  box.value = "all";
  box.addEventListener("input", function () {
    const base = spec.rect || { x: 0, y: 0, w: 50, h: 50 };
    try {
      const view = render(Object.assign({}, spec, { rect: { x: base.x, y: base.y, w: base.w + grow, h: base.h + grow } }));
      parts.out.textContent = "命中 " + view.total + " 个，顺序 " + JSON.stringify(view.order);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
    }
  });
  parts.controls.appendChild(box);

  const readButton = document.createElement("button");
  readButton.textContent = "只看完全框住的";
  readButton.addEventListener("click", function () {
    const base = spec.rect || { x: 0, y: 0, w: 50, h: 50 };
    const view = render(Object.assign({}, spec, { rect: { x: base.x, y: base.y, w: base.w + grow, h: base.h + grow } }));
    parts.out.textContent = "完全框住 " + JSON.stringify(view.inside);
  });
  parts.controls.appendChild(readButton);

  draw();
}
