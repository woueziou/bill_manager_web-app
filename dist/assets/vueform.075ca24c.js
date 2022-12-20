import { d as definePlugin, N as defineAsyncComponent, _ as __vitePreload } from "./index.2c4f64fa.js";
var vueform = definePlugin(({ app }) => {
  app.component("Multiselect", defineAsyncComponent({
    loader: () => __vitePreload(() => import("./multiselect.40750474.js"), true ? ["assets/multiselect.40750474.js","assets/index.2c4f64fa.js","assets/index.9fbf0f99.css"] : void 0).then((mod) => mod.default),
    delay: 0,
    suspensible: false
  }));
  app.component("Slider", defineAsyncComponent({
    loader: () => __vitePreload(() => import("./slider.783da4d6.js"), true ? ["assets/slider.783da4d6.js","assets/index.2c4f64fa.js","assets/index.9fbf0f99.css"] : void 0).then((mod) => mod.default),
    delay: 0,
    suspensible: false
  }));
});
export { vueform as default };
