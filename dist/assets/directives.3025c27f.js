import { d as definePlugin } from "./index.2c4f64fa.js";
const handlers = /* @__PURE__ */ new WeakMap();
const preloaded = /* @__PURE__ */ new Set();
const vPreloadLink = {
  getSSRProps() {
    return {};
  },
  created: (el) => {
    const handler = function() {
      var _a;
      const href = ((_a = el.href) != null ? _a : "").split("#")[0];
      if (!href || preloaded.has(href)) {
        el.removeEventListener("mouseenter", handler);
        return;
      }
      const newPreLoadLink = document.createElement("link");
      newPreLoadLink.rel = "prefetch";
      newPreLoadLink.href = href;
      document.head.appendChild(newPreLoadLink);
      preloaded.add(href);
      el.removeEventListener("mouseenter", handler);
    };
    handlers.set(el, handler);
  },
  beforeMount() {
    const currentHref = window.location.toString().split("#")[0];
    if (!currentHref || preloaded.has(currentHref)) {
      return;
    }
    preloaded.add(currentHref);
  },
  mounted: (el) => {
    el.addEventListener("mouseenter", handlers.get(el), { passive: true });
  },
  unmounted: (el) => {
    el.removeEventListener("mouseenter", handlers.get(el));
  }
};
const onUpdate$1 = (el, bindings) => {
  const value = bindings.value;
  if (typeof value === "string") {
    el.dataset.hint = value;
  } else {
    el.dataset.hint = "";
  }
};
const onMounted = (el, bindings) => {
  const value = bindings.value;
  let placement = "top";
  let color = "";
  let shape = "";
  if (bindings.modifiers.bottom) {
    placement = "bottom";
  }
  if (bindings.modifiers.left) {
    placement += "-left";
  } else if (bindings.modifiers.right) {
    placement += "-right";
  }
  if (bindings.modifiers.light) {
    color = "hint--light";
  } else if (bindings.modifiers.primary) {
    color = "hint--primary";
  } else if (bindings.modifiers.info) {
    color = "hint--info";
  } else if (bindings.modifiers.success) {
    color = "hint--success";
  } else if (bindings.modifiers.warning) {
    color = "hint--warning";
  } else if (bindings.modifiers.error) {
    color = "hint--error";
  }
  if (bindings.modifiers.rounded) {
    shape = "hint--rounded";
  } else if (bindings.modifiers.bubble) {
    shape = "hint--bubble";
  }
  if (typeof value === "string") {
    el.dataset.hint = value;
    el.tabIndex = 0;
    el.classList.add(`hint--${placement}`);
    if (color) {
      el.classList.add(color);
    }
    if (shape) {
      el.classList.add(shape);
    }
  }
};
const vTooltip = {
  getSSRProps() {
    return {};
  },
  updated: onUpdate$1,
  mounted: onMounted
};
const onUpdate = (el, bindings) => {
  const src = bindings.value.src;
  const placeholder = bindings.value.placeholder;
  if (src) {
    const image = new Image();
    if (placeholder) {
      image.onerror = () => {
        image.onerror = null;
        el.style.backgroundImage = `url(${placeholder})`;
      };
    }
    image.onload = () => {
      image.onload = null;
      el.style.backgroundImage = `url(${src})`;
    };
    image.src = src;
  }
};
const vBackground = {
  getSSRProps() {
    return {};
  },
  updated: onUpdate,
  mounted: onUpdate
};
var directives = definePlugin(({ app }) => {
  app.directive("preload-link", vPreloadLink);
  app.directive("tooltip", vTooltip);
  app.directive("background", vBackground);
});
export { directives as default };
