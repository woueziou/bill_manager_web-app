var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a2, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a2, prop, b[prop]);
    }
  return a2;
};
var __spreadProps = (a2, b) => __defProps(a2, __getOwnPropDescs(b));
var __objRest = (source3, exclude) => {
  var target = {};
  for (var prop in source3)
    if (__hasOwnProp.call(source3, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source3[prop];
  if (source3 != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source3)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source3, prop))
        target[prop] = source3[prop];
    }
  return target;
};
const p$1 = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p$1();
const scriptRel = "modulepreload";
const seen = {};
const base = "/";
const __vitePreload = function preload(baseModule, deps) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  return Promise.all(deps.map((dep) => {
    dep = `${base}${dep}`;
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i2 = 0; i2 < list.length; i2++) {
    map[list[i2]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function normalizeStyle(value) {
  if (isArray$3(value)) {
    const res = {};
    for (let i2 = 0; i2 < value.length; i2++) {
      const item = value[i2];
      const normalized = isString$4(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString$4(value)) {
    return value;
  } else if (isObject$4(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString$4(value)) {
    res = value;
  } else if (isArray$3(value)) {
    for (let i2 = 0; i2 < value.length; i2++) {
      const normalized = normalizeClass(value[i2]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$4(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString$4(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
function looseCompareArrays(a2, b) {
  if (a2.length !== b.length)
    return false;
  let equal = true;
  for (let i2 = 0; equal && i2 < a2.length; i2++) {
    equal = looseEqual(a2[i2], b[i2]);
  }
  return equal;
}
function looseEqual(a2, b) {
  if (a2 === b)
    return true;
  let aValidType = isDate$2(a2);
  let bValidType = isDate$2(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a2.getTime() === b.getTime() : false;
  }
  aValidType = isArray$3(a2);
  bValidType = isArray$3(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a2, b) : false;
  }
  aValidType = isObject$4(a2);
  bValidType = isObject$4(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a2).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a2) {
      const aHasKey = a2.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a2[key], b[key])) {
        return false;
      }
    }
  }
  return String(a2) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString$1 = (val) => {
  return isString$4(val) ? val : val == null ? "" : isArray$3(val) || isObject$4(val) && (val.toString === objectToString$2 || !isFunction$3(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$4(val) && !isArray$3(val) && !isPlainObject$3(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend$2 = Object.assign;
const remove = (arr, el) => {
  const i2 = arr.indexOf(el);
  if (i2 > -1) {
    arr.splice(i2, 1);
  }
};
const hasOwnProperty$2 = Object.prototype.hasOwnProperty;
const hasOwn$1 = (val, key) => hasOwnProperty$2.call(val, key);
const isArray$3 = Array.isArray;
const isMap = (val) => toTypeString$1(val) === "[object Map]";
const isSet = (val) => toTypeString$1(val) === "[object Set]";
const isDate$2 = (val) => val instanceof Date;
const isFunction$3 = (val) => typeof val === "function";
const isString$4 = (val) => typeof val === "string";
const isSymbol$1 = (val) => typeof val === "symbol";
const isObject$4 = (val) => val !== null && typeof val === "object";
const isPromise$1 = (val) => {
  return isObject$4(val) && isFunction$3(val.then) && isFunction$3(val.catch);
};
const objectToString$2 = Object.prototype.toString;
const toTypeString$1 = (value) => objectToString$2.call(value);
const toRawType = (value) => {
  return toTypeString$1(value).slice(8, -1);
};
const isPlainObject$3 = (val) => toTypeString$1(val) === "[object Object]";
const isIntegerKey = (key) => isString$4(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const cacheStringFunction = (fn) => {
  const cache2 = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache2[str];
    return hit || (cache2[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_2, c2) => c2 ? c2.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i2 = 0; i2 < fns.length; i2++) {
    fns[i2](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber$1 = (val) => {
  const n2 = parseFloat(val);
  return isNaN(n2) ? val : n2;
};
let _globalThis$1;
const getGlobalThis$1 = () => {
  return _globalThis$1 || (_globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.active = true;
    this.effects = [];
    this.cleanups = [];
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope;
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  run(fn) {
    if (this.active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  on() {
    activeEffectScope = this;
  }
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this.active) {
      let i2, l;
      for (i2 = 0, l = this.effects.length; i2 < l; i2++) {
        this.effects[i2].stop();
      }
      for (i2 = 0, l = this.cleanups.length; i2 < l; i2++) {
        this.cleanups[i2]();
      }
      if (this.scopes) {
        for (i2 = 0, l = this.scopes.length; i2 < l; i2++) {
          this.scopes[i2].stop(true);
        }
      }
      if (this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i2 = 0; i2 < deps.length; i2++) {
      deps[i2].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i2 = 0; i2 < deps.length; i2++) {
      const dep = deps[i2];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i2 = 0; i2 < deps.length; i2++) {
      deps[i2].delete(effect);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger$2(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$3(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray$3(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$3(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  for (const effect of isArray$3(dep) ? dep : [...dep]) {
    if (effect !== activeEffect || effect.allowRecurse) {
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect.run();
      }
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol$1));
const get = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i2 = 0, l = this.length; i2 < l; i2++) {
        track(arr, "get", i2 + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray$3(target);
    if (!isReadonly2 && targetIsArray && hasOwn$1(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol$1(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject$4(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow && !isReadonly(value)) {
      if (!isShallow(value)) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);
      }
      if (!isArray$3(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray$3(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn$1(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger$2(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger$2(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn$1(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger$2(target, "delete", key, void 0);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol$1(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys$2(target) {
  track(target, "iterate", isArray$3(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys: ownKeys$2
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend$2({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const toShallow = (value) => value;
const getProto = (v2) => Reflect.getPrototypeOf(v2);
function get$1(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly2 && track(rawTarget, "get", key);
  }
  !isReadonly2 && track(rawTarget, "get", rawKey);
  const { has: has2 } = getProto(rawTarget);
  const wrap2 = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap2(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap2(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly2 && track(rawTarget, "has", key);
  }
  !isReadonly2 && track(rawTarget, "has", rawKey);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger$2(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger$2(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger$2(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger$2(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger$2(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach3(callback2, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap2 = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback2.call(thisArg, wrap2(value), wrap2(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap2 = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap2(value[0]), wrap2(value[1])] : wrap2(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn$1(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$4(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject$4(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$4(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  if (ref2.dep) {
    {
      triggerEffects(ref2.dep);
    }
  }
}
function isRef(r2) {
  return !!(r2 && r2.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = this.__v_isShallow ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function toRefs(object) {
  const ret = isArray$3(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = toRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
}
function toRef(object, key, defaultValue) {
  const val = object[key];
  return isRef(val) ? val : new ObjectRefImpl(object, key, defaultValue);
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction$3(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
const stack = [];
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(appWarnHandler, instance, 11, [
      msg + args.join(""),
      instance && instance.proxy,
      trace.map(({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`).join("\n"),
      trace
    ]);
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i2) => {
    logs.push(...i2 === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString$4(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction$3(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction$3(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise$1(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i2 = 0; i2 < fn.length; i2++) {
    values.push(callWithAsyncErrorHandling(fn[i2], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i2 = 0; i2 < errorCapturedHooks.length; i2++) {
          if (errorCapturedHooks[i2](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPreFlushCbs = [];
let activePreFlushCbs = null;
let preFlushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
let currentPreFlushParentJob = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if ((!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i2 = queue.indexOf(job);
  if (i2 > flushIndex) {
    queue.splice(i2, 1);
  }
}
function queueCb(cb, activeQueue, pendingQueue, index) {
  if (!isArray$3(cb)) {
    if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index + 1 : index)) {
      pendingQueue.push(cb);
    }
  } else {
    pendingQueue.push(...cb);
  }
  queueFlush();
}
function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
}
function queuePostFlushCb(cb) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}
function flushPreFlushCbs(seen2, parentJob = null) {
  if (pendingPreFlushCbs.length) {
    currentPreFlushParentJob = parentJob;
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    pendingPreFlushCbs.length = 0;
    for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
      activePreFlushCbs[preFlushIndex]();
    }
    activePreFlushCbs = null;
    preFlushIndex = 0;
    currentPreFlushParentJob = null;
    flushPreFlushCbs(seen2, parentJob);
  }
}
function flushPostFlushCbs(seen2) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a2, b) => getId(a2) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
function flushJobs(seen2) {
  isFlushPending = false;
  isFlushing = true;
  flushPreFlushCbs(seen2);
  queue.sort((a2, b) => getId(a2) - getId(b));
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
      flushJobs(seen2);
    }
  }
}
function emit$1(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number: number2, trim: trim2 } = props[modifiersKey] || EMPTY_OBJ;
    if (trim2) {
      args = rawArgs.map((a2) => a2.trim());
    } else if (number2) {
      args = rawArgs.map(toNumber$1);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance, 6, args);
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache2 = appContext.emitsCache;
  const cached = cache2.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction$3(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend$2(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    cache2.set(comp, null);
    return null;
  }
  if (isArray$3(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend$2(normalized, raw);
  }
  cache2.set(comp, normalized);
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn$1(options, key[0].toLowerCase() + key.slice(1)) || hasOwn$1(options, hyphenate(key)) || hasOwn$1(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function pushScopeId(id) {
  currentScopeId = id;
}
function popScopeId() {
  currentScopeId = null;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    const res = fn(...args);
    setCurrentRenderingInstance(prevInstance);
    if (renderFnWithContext._d) {
      setBlockTracking(1);
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit, render: render2, renderCache, data: data2, setupState, ctx, inheritAttrs } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render2.call(proxyToUse, proxyToUse, renderCache, props, setupState, data2, ctx));
      fallthroughAttrs = attrs;
    } else {
      const render3 = Component;
      if (false)
        ;
      result = normalizeVNode(render3.length > 1 ? render3(props, false ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },
        slots,
        emit
      } : { attrs, slots, emit }) : render3(props, null));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root2 = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root2;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
        }
        root2 = cloneVNode(root2, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root2.dirs = root2.dirs ? root2.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root2.transition = vnode.transition;
  }
  {
    result = root2;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
function filterSingleRoot(children) {
  let singleRoot;
  for (let i2 = 0; i2 < children.length; i2++) {
    const child = children[i2];
    if (isVNode$1(child)) {
      if (child.type !== Comment || child.children === "v-if") {
        if (singleRoot) {
          return;
        } else {
          singleRoot = child;
        }
      }
    } else {
      return;
    }
  }
  return singleRoot;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i2 = 0; i2 < dynamicProps.length; i2++) {
        const key = dynamicProps[i2];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i2 = 0; i2 < nextKeys.length; i2++) {
    const key = nextKeys[i2];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
const SuspenseImpl = {
  name: "Suspense",
  __isSuspense: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
    if (n1 == null) {
      mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals);
    } else {
      patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, rendererInternals);
    }
  },
  hydrate: hydrateSuspense,
  create: createSuspenseBoundary,
  normalize: normalizeSuspenseChildren
};
const Suspense = SuspenseImpl;
function triggerEvent$1(vnode, name) {
  const eventListener = vnode.props && vnode.props[name];
  if (isFunction$3(eventListener)) {
    eventListener();
  }
}
function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
  const { p: patch, o: { createElement: createElement2 } } = rendererInternals;
  const hiddenContainer = createElement2("div");
  const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals);
  patch(null, suspense.pendingBranch = vnode.ssContent, hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds);
  if (suspense.deps > 0) {
    triggerEvent$1(vnode, "onPending");
    triggerEvent$1(vnode, "onFallback");
    patch(null, vnode.ssFallback, container, anchor, parentComponent, null, isSVG, slotScopeIds);
    setActiveBranch(suspense, vnode.ssFallback);
  } else {
    suspense.resolve();
  }
}
function patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, { p: patch, um: unmount, o: { createElement: createElement2 } }) {
  const suspense = n2.suspense = n1.suspense;
  suspense.vnode = n2;
  n2.el = n1.el;
  const newBranch = n2.ssContent;
  const newFallback = n2.ssFallback;
  const { activeBranch, pendingBranch, isInFallback, isHydrating } = suspense;
  if (pendingBranch) {
    suspense.pendingBranch = newBranch;
    if (isSameVNodeType(newBranch, pendingBranch)) {
      patch(pendingBranch, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
      if (suspense.deps <= 0) {
        suspense.resolve();
      } else if (isInFallback) {
        patch(activeBranch, newFallback, container, anchor, parentComponent, null, isSVG, slotScopeIds, optimized);
        setActiveBranch(suspense, newFallback);
      }
    } else {
      suspense.pendingId++;
      if (isHydrating) {
        suspense.isHydrating = false;
        suspense.activeBranch = pendingBranch;
      } else {
        unmount(pendingBranch, parentComponent, suspense);
      }
      suspense.deps = 0;
      suspense.effects.length = 0;
      suspense.hiddenContainer = createElement2("div");
      if (isInFallback) {
        patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
        if (suspense.deps <= 0) {
          suspense.resolve();
        } else {
          patch(activeBranch, newFallback, container, anchor, parentComponent, null, isSVG, slotScopeIds, optimized);
          setActiveBranch(suspense, newFallback);
        }
      } else if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
        patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, isSVG, slotScopeIds, optimized);
        suspense.resolve(true);
      } else {
        patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
        if (suspense.deps <= 0) {
          suspense.resolve();
        }
      }
    }
  } else {
    if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
      patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, isSVG, slotScopeIds, optimized);
      setActiveBranch(suspense, newBranch);
    } else {
      triggerEvent$1(n2, "onPending");
      suspense.pendingBranch = newBranch;
      suspense.pendingId++;
      patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
      if (suspense.deps <= 0) {
        suspense.resolve();
      } else {
        const { timeout, pendingId } = suspense;
        if (timeout > 0) {
          setTimeout(() => {
            if (suspense.pendingId === pendingId) {
              suspense.fallback(newFallback);
            }
          }, timeout);
        } else if (timeout === 0) {
          suspense.fallback(newFallback);
        }
      }
    }
  }
}
function createSuspenseBoundary(vnode, parent, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
  const { p: patch, m: move, um: unmount, n: next, o: { parentNode, remove: remove2 } } = rendererInternals;
  const timeout = toNumber$1(vnode.props && vnode.props.timeout);
  const suspense = {
    vnode,
    parent,
    parentComponent,
    isSVG,
    container,
    hiddenContainer,
    anchor,
    deps: 0,
    pendingId: 0,
    timeout: typeof timeout === "number" ? timeout : -1,
    activeBranch: null,
    pendingBranch: null,
    isInFallback: true,
    isHydrating,
    isUnmounted: false,
    effects: [],
    resolve(resume = false) {
      const { vnode: vnode2, activeBranch, pendingBranch, pendingId, effects, parentComponent: parentComponent2, container: container2 } = suspense;
      if (suspense.isHydrating) {
        suspense.isHydrating = false;
      } else if (!resume) {
        const delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === "out-in";
        if (delayEnter) {
          activeBranch.transition.afterLeave = () => {
            if (pendingId === suspense.pendingId) {
              move(pendingBranch, container2, anchor2, 0);
            }
          };
        }
        let { anchor: anchor2 } = suspense;
        if (activeBranch) {
          anchor2 = next(activeBranch);
          unmount(activeBranch, parentComponent2, suspense, true);
        }
        if (!delayEnter) {
          move(pendingBranch, container2, anchor2, 0);
        }
      }
      setActiveBranch(suspense, pendingBranch);
      suspense.pendingBranch = null;
      suspense.isInFallback = false;
      let parent2 = suspense.parent;
      let hasUnresolvedAncestor = false;
      while (parent2) {
        if (parent2.pendingBranch) {
          parent2.effects.push(...effects);
          hasUnresolvedAncestor = true;
          break;
        }
        parent2 = parent2.parent;
      }
      if (!hasUnresolvedAncestor) {
        queuePostFlushCb(effects);
      }
      suspense.effects = [];
      triggerEvent$1(vnode2, "onResolve");
    },
    fallback(fallbackVNode) {
      if (!suspense.pendingBranch) {
        return;
      }
      const { vnode: vnode2, activeBranch, parentComponent: parentComponent2, container: container2, isSVG: isSVG2 } = suspense;
      triggerEvent$1(vnode2, "onFallback");
      const anchor2 = next(activeBranch);
      const mountFallback = () => {
        if (!suspense.isInFallback) {
          return;
        }
        patch(null, fallbackVNode, container2, anchor2, parentComponent2, null, isSVG2, slotScopeIds, optimized);
        setActiveBranch(suspense, fallbackVNode);
      };
      const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === "out-in";
      if (delayEnter) {
        activeBranch.transition.afterLeave = mountFallback;
      }
      suspense.isInFallback = true;
      unmount(activeBranch, parentComponent2, null, true);
      if (!delayEnter) {
        mountFallback();
      }
    },
    move(container2, anchor2, type) {
      suspense.activeBranch && move(suspense.activeBranch, container2, anchor2, type);
      suspense.container = container2;
    },
    next() {
      return suspense.activeBranch && next(suspense.activeBranch);
    },
    registerDep(instance, setupRenderEffect) {
      const isInPendingSuspense = !!suspense.pendingBranch;
      if (isInPendingSuspense) {
        suspense.deps++;
      }
      const hydratedEl = instance.vnode.el;
      instance.asyncDep.catch((err) => {
        handleError(err, instance, 0);
      }).then((asyncSetupResult) => {
        if (instance.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance.suspenseId) {
          return;
        }
        instance.asyncResolved = true;
        const { vnode: vnode2 } = instance;
        handleSetupResult(instance, asyncSetupResult, false);
        if (hydratedEl) {
          vnode2.el = hydratedEl;
        }
        const placeholder = !hydratedEl && instance.subTree.el;
        setupRenderEffect(instance, vnode2, parentNode(hydratedEl || instance.subTree.el), hydratedEl ? null : next(instance.subTree), suspense, isSVG, optimized);
        if (placeholder) {
          remove2(placeholder);
        }
        updateHOCHostEl(instance, vnode2.el);
        if (isInPendingSuspense && --suspense.deps === 0) {
          suspense.resolve();
        }
      });
    },
    unmount(parentSuspense, doRemove) {
      suspense.isUnmounted = true;
      if (suspense.activeBranch) {
        unmount(suspense.activeBranch, parentComponent, parentSuspense, doRemove);
      }
      if (suspense.pendingBranch) {
        unmount(suspense.pendingBranch, parentComponent, parentSuspense, doRemove);
      }
    }
  };
  return suspense;
}
function hydrateSuspense(node, vnode, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals, hydrateNode) {
  const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, node.parentNode, document.createElement("div"), null, isSVG, slotScopeIds, optimized, rendererInternals, true);
  const result = hydrateNode(node, suspense.pendingBranch = vnode.ssContent, parentComponent, suspense, slotScopeIds, optimized);
  if (suspense.deps === 0) {
    suspense.resolve();
  }
  return result;
}
function normalizeSuspenseChildren(vnode) {
  const { shapeFlag, children } = vnode;
  const isSlotChildren = shapeFlag & 32;
  vnode.ssContent = normalizeSuspenseSlot(isSlotChildren ? children.default : children);
  vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment);
}
function normalizeSuspenseSlot(s2) {
  let block;
  if (isFunction$3(s2)) {
    const trackBlock = isBlockTreeEnabled && s2._c;
    if (trackBlock) {
      s2._d = false;
      openBlock();
    }
    s2 = s2();
    if (trackBlock) {
      s2._d = true;
      block = currentBlock;
      closeBlock();
    }
  }
  if (isArray$3(s2)) {
    const singleChild = filterSingleRoot(s2);
    s2 = singleChild;
  }
  s2 = normalizeVNode(s2);
  if (block && !s2.dynamicChildren) {
    s2.dynamicChildren = block.filter((c2) => c2 !== s2);
  }
  return s2;
}
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray$3(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function setActiveBranch(suspense, branch) {
  suspense.activeBranch = branch;
  const { vnode, parentComponent } = suspense;
  const el = vnode.el = branch.el;
  if (parentComponent && parentComponent.subTree === vnode) {
    parentComponent.vnode.el = el;
    updateHOCHostEl(parentComponent, el);
  }
}
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance) {
    const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction$3(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
    } else
      ;
  }
}
function watchEffect(effect, options) {
  return doWatch(effect, null, options);
}
function watchPostEffect(effect, options) {
  return doWatch(effect, null, { flush: "post" });
}
const INITIAL_WATCHER_VALUE = {};
function watch(source3, cb, options) {
  return doWatch(source3, cb, options);
}
function doWatch(source3, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  const instance = currentInstance;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source3)) {
    getter = () => source3.value;
    forceTrigger = isShallow(source3);
  } else if (isReactive(source3)) {
    getter = () => source3;
    deep = true;
  } else if (isArray$3(source3)) {
    isMultiSource = true;
    forceTrigger = source3.some(isReactive);
    getter = () => source3.map((s2) => {
      if (isRef(s2)) {
        return s2.value;
      } else if (isReactive(s2)) {
        return traverse(s2);
      } else if (isFunction$3(s2)) {
        return callWithErrorHandling(s2, instance, 2);
      } else
        ;
    });
  } else if (isFunction$3(source3)) {
    if (cb) {
      getter = () => callWithErrorHandling(source3, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source3, instance, 3, [onCleanup]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
    };
  };
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    return NOOP;
  }
  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v2, i2) => hasChanged(v2, oldValue[i2])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    scheduler = () => {
      if (!instance || instance.isMounted) {
        queuePreFlushCb(job);
      } else {
        job();
      }
    };
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
  } else {
    effect.run();
  }
  return () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
}
function instanceWatch(source3, value, options) {
  const publicThis = this.proxy;
  const getter = isString$4(source3) ? source3.includes(".") ? createPathGetter(publicThis, source3) : () => publicThis[source3] : source3.bind(publicThis, publicThis);
  let cb;
  if (isFunction$3(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i2 = 0; i2 < segments.length && cur; i2++) {
      cur = cur[segments[i2]];
    }
    return cur;
  };
}
function traverse(value, seen2) {
  if (!isObject$4(value) || value["__v_skip"]) {
    return value;
  }
  seen2 = seen2 || /* @__PURE__ */ new Set();
  if (seen2.has(value)) {
    return value;
  }
  seen2.add(value);
  if (isRef(value)) {
    traverse(value.value, seen2);
  } else if (isArray$3(value)) {
    for (let i2 = 0; i2 < value.length; i2++) {
      traverse(value[i2], seen2);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v2) => {
      traverse(v2, seen2);
    });
  } else if (isPlainObject$3(value)) {
    for (const key in value) {
      traverse(value[key], seen2);
    }
  }
  return value;
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c2 of children) {
          if (c2.type !== Comment) {
            child = c2;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            instance.update();
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance, 9, args);
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(true);
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        hook(el, done);
        if (hook.length <= 1) {
          done();
        }
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(true);
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        onLeave(el, done);
        if (onLeave.length <= 1) {
          done();
        }
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i2 = 0; i2 < children.length; i2++) {
    let child = children[i2];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i2);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i2 = 0; i2 < ret.length; i2++) {
      ret[i2].patchFlag = -2;
    }
  }
  return ret;
}
function defineComponent(options) {
  return isFunction$3(options) ? { setup: options, name: options.name } : options;
}
const isAsyncWrapper = (i2) => !!i2.type.__asyncLoader;
function defineAsyncComponent(source3) {
  if (isFunction$3(source3)) {
    source3 = { loader: source3 };
  }
  const {
    loader,
    loadingComponent,
    errorComponent,
    delay = 200,
    timeout,
    suspensible = true,
    onError: userOnError
  } = source3;
  let pendingRequest = null;
  let resolvedComp;
  let retries = 0;
  const retry = () => {
    retries++;
    pendingRequest = null;
    return load();
  };
  const load = () => {
    let thisRequest;
    return pendingRequest || (thisRequest = pendingRequest = loader().catch((err) => {
      err = err instanceof Error ? err : new Error(String(err));
      if (userOnError) {
        return new Promise((resolve2, reject) => {
          const userRetry = () => resolve2(retry());
          const userFail = () => reject(err);
          userOnError(err, userRetry, userFail, retries + 1);
        });
      } else {
        throw err;
      }
    }).then((comp) => {
      if (thisRequest !== pendingRequest && pendingRequest) {
        return pendingRequest;
      }
      if (comp && (comp.__esModule || comp[Symbol.toStringTag] === "Module")) {
        comp = comp.default;
      }
      resolvedComp = comp;
      return comp;
    }));
  };
  return defineComponent({
    name: "AsyncComponentWrapper",
    __asyncLoader: load,
    get __asyncResolved() {
      return resolvedComp;
    },
    setup() {
      const instance = currentInstance;
      if (resolvedComp) {
        return () => createInnerComp(resolvedComp, instance);
      }
      const onError = (err) => {
        pendingRequest = null;
        handleError(err, instance, 13, !errorComponent);
      };
      if (suspensible && instance.suspense || isInSSRComponentSetup) {
        return load().then((comp) => {
          return () => createInnerComp(comp, instance);
        }).catch((err) => {
          onError(err);
          return () => errorComponent ? createVNode(errorComponent, {
            error: err
          }) : null;
        });
      }
      const loaded2 = ref(false);
      const error = ref();
      const delayed = ref(!!delay);
      if (delay) {
        setTimeout(() => {
          delayed.value = false;
        }, delay);
      }
      if (timeout != null) {
        setTimeout(() => {
          if (!loaded2.value && !error.value) {
            const err = new Error(`Async component timed out after ${timeout}ms.`);
            onError(err);
            error.value = err;
          }
        }, timeout);
      }
      load().then(() => {
        loaded2.value = true;
        if (instance.parent && isKeepAlive(instance.parent.vnode)) {
          queueJob(instance.parent.update);
        }
      }).catch((err) => {
        onError(err);
        error.value = err;
      });
      return () => {
        if (loaded2.value && resolvedComp) {
          return createInnerComp(resolvedComp, instance);
        } else if (error.value && errorComponent) {
          return createVNode(errorComponent, {
            error: error.value
          });
        } else if (loadingComponent && !delayed.value) {
          return createVNode(loadingComponent);
        }
      };
    }
  });
}
function createInnerComp(comp, { vnode: { ref: ref2, props, children } }) {
  const vnode = createVNode(comp, props, children);
  vnode.ref = ref2;
  return vnode;
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(type, hook, keepAliveRoot, true);
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, hook, target);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render: render2,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    expose,
    inheritAttrs,
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction$3(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data2 = dataOptions.call(publicThis, publicThis);
    if (!isObject$4(data2))
      ;
    else {
      instance.data = reactive(data2);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction$3(opt) ? opt.bind(publicThis, publicThis) : isFunction$3(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction$3(opt) && isFunction$3(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c2 = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v2) => c2.value = v2
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction$3(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$3(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$3(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render2 && instance.render === NOOP) {
    instance.render = render2;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
  if (isArray$3(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$4(opt)) {
      if ("default" in opt) {
        injected = inject(opt.from || key, opt.default, true);
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v2) => injected.value = v2
        });
      } else {
        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(isArray$3(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString$4(raw)) {
    const handler = ctx[raw];
    if (isFunction$3(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction$3(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$4(raw)) {
    if (isArray$3(raw)) {
      raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
    } else {
      const handler = isFunction$3(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction$3(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base2 = instance.type;
  const { mixins, extends: extendsOptions } = base2;
  const { mixins: globalMixins, optionsCache: cache2, config: { optionMergeStrategies } } = instance.appContext;
  const cached = cache2.get(base2);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base2;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m) => mergeOptions$1(resolved, m, optionMergeStrategies, true));
    }
    mergeOptions$1(resolved, base2, optionMergeStrategies);
  }
  cache2.set(base2, resolved);
  return resolved;
}
function mergeOptions$1(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions$1(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m) => mergeOptions$1(to, m, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend$2(isFunction$3(to) ? to.call(this, this) : to, isFunction$3(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$3(raw)) {
    const res = {};
    for (let i2 = 0; i2 < raw.length; i2++) {
      res[raw[i2]] = raw[i2];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend$2(extend$2(/* @__PURE__ */ Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend$2(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const { props, attrs, vnode: { patchFlag } } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i2 = 0; i2 < propsToUpdate.length; i2++) {
        let key = propsToUpdate[i2];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn$1(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || !hasOwn$1(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn$1(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn$1(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger$2(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn$1(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i2 = 0; i2 < needCastKeys.length; i2++) {
      const key = needCastKeys[i2];
      props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn$1(castValues, key));
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn$1(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction$3(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[0]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[1] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache2 = appContext.propsCache;
  const cached = cache2.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction$3(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend$2(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    cache2.set(comp, EMPTY_ARR);
    return EMPTY_ARR;
  }
  if (isArray$3(raw)) {
    for (let i2 = 0; i2 < raw.length; i2++) {
      const normalizedKey = camelize(raw[i2]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$3(opt) || isFunction$3(opt) ? { type: opt } : opt;
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0] = booleanIndex > -1;
          prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn$1(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  cache2.set(comp, res);
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ctor === null ? "null" : "";
}
function isSameType(a2, b) {
  return getType(a2) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray$3(expectedTypes)) {
    return expectedTypes.findIndex((t2) => isSameType(t2, type));
  } else if (isFunction$3(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$3(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot$1 = (key, rawSlot, ctx) => {
  const normalized = withCtx((...args) => {
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction$3(value)) {
      slots[key] = normalizeSlot$1(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(children, instance.slots = {});
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend$2(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i2 = 0; i2 < directives.length; i2++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i2];
    if (isFunction$3(dir)) {
      dir = {
        mounted: dir,
        updated: dir
      };
    }
    if (dir.deep) {
      traverse(value);
    }
    bindings.push({
      dir,
      instance,
      value,
      oldValue: void 0,
      arg,
      modifiers
    });
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i2 = 0; i2 < bindings.length; i2++) {
    const binding = bindings[i2];
    if (oldBindings) {
      binding.oldValue = oldBindings[i2].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid = 0;
function createAppAPI(render2, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction$3(rootComponent)) {
      rootComponent = Object.assign({}, rootComponent);
    }
    if (rootProps != null && !isObject$4(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app = context.app = {
      _uid: uid++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v2) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction$3(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction$3(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else
          ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render2(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render2(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      }
    };
    return app;
  };
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray$3(rawRef)) {
    rawRef.forEach((r2, i2) => setRef(r2, oldRawRef && (isArray$3(oldRawRef) ? oldRawRef[i2] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString$4(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn$1(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction$3(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString$4(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray$3(existing) && remove(existing, refValue);
          } else {
            if (!isArray$3(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn$1(setupState, ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn$1(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (isRef(ref2)) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis$1();
  target.__VUE__ = true;
  const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text$1:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;
      default:
        if (shapeFlag & 1) {
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6) {
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, patchFlag, dirs } = vnode;
    if (vnode.el && hostCloneNode !== void 0 && patchFlag === -1) {
      el = vnode.el = hostCloneNode(vnode.el);
    } else {
      el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i2 = 0; i2 < slotScopeIds.length; i2++) {
        hostSetScopeId(el, slotScopeIds[i2]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i2 = start; i2 < children.length; i2++) {
      const child = children[i2] = optimized ? cloneIfMounted(children[i2]) : normalizeVNode(children[i2]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i2 = 0; i2 < propsToUpdate.length; i2++) {
            const key = propsToUpdate[i2];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i2 = 0; i2 < newChildren.length; i2++) {
      const oldVNode = oldChildren[i2];
      const newVNode = newChildren[i2];
      const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : fallbackContainer;
      patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
        if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
          traverseStaticChildren(n1, n2, true);
        }
      } else {
        patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
      } else {
        mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.component = n1.component;
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(el, instance.subTree, instance, parentSuspense, null);
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(() => !instance.isUnmounted && hydrateSubTree());
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        }
        if (initialVNode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u: u2, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, isSVG);
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u2) {
          queuePostRenderEffect(u2, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(componentUpdateFn, () => queueJob(instance.update), instance.scope);
    const update = instance.update = effect.run.bind(effect);
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(void 0, instance.update);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i2;
    for (i2 = 0; i2 < commonLength; i2++) {
      const nextChild = c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]);
      patch(c1[i2], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i2 = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i2 <= e1 && i2 <= e2) {
      const n1 = c1[i2];
      const n2 = c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i2++;
    }
    while (i2 <= e1 && i2 <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i2 > e1) {
      if (i2 <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i2 <= e2) {
          patch(null, c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i2++;
        }
      }
    } else if (i2 > e2) {
      while (i2 <= e1) {
        unmount(c1[i2], parentComponent, parentSuspense, true);
        i2++;
      }
    } else {
      const s1 = i2;
      const s2 = i2;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i2 = s2; i2 <= e2; i2++) {
        const nextChild = c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i2);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i2 = 0; i2 < toBePatched; i2++)
        newIndexToOldIndexMap[i2] = 0;
      for (i2 = s1; i2 <= e1; i2++) {
        const prevChild = c1[i2];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i2 + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i2 = toBePatched - 1; i2 >= 0; i2--) {
        const nextIndex = s2 + i2;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i2] === 0) {
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j < 0 || i2 !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i2 = 0; i2 < children.length; i2++) {
        move(children[i2], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove3 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove3();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove3, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const { type, props, ref: ref2, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i2 = start; i2 < children.length; i2++) {
      unmount(children[i2], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render2 = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }
  return {
    render: render2,
    hydrate,
    createApp: createAppAPI(render2, hydrate)
  };
}
function toggleRecurse({ effect, update }, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$3(ch1) && isArray$3(ch2)) {
    for (let i2 = 0; i2 < ch1.length; i2++) {
      const c1 = ch1[i2];
      let c2 = ch2[i2];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i2] = cloneIfMounted(ch2[i2]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i2, j, u2, v2, c2;
  const len = arr.length;
  for (i2 = 0; i2 < len; i2++) {
    const arrI = arr[i2];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i2] = j;
        result.push(i2);
        continue;
      }
      u2 = 0;
      v2 = result.length - 1;
      while (u2 < v2) {
        c2 = u2 + v2 >> 1;
        if (arr[result[c2]] < arrI) {
          u2 = c2 + 1;
        } else {
          v2 = c2;
        }
      }
      if (arrI < arr[result[u2]]) {
        if (u2 > 0) {
          p2[i2] = result[u2 - 1];
        }
        result[u2] = i2;
      }
    }
  }
  u2 = result.length;
  v2 = result[u2 - 1];
  while (u2-- > 0) {
    result[u2] = v2;
    v2 = p2[v2];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
function resolveDynamicComponent(component) {
  if (isString$4(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(Component);
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = resolve(instance[type] || Component[type], name) || resolve(instance.appContext[type], name);
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const Fragment = Symbol(void 0);
const Text$1 = Symbol(void 0);
const Comment = Symbol(void 0);
const Static = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
}
function isVNode$1(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref: ref2, ref_key, ref_for }) => {
  return ref2 != null ? isString$4(ref2) || isRef(ref2) || isFunction$3(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString$4(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode$1(type)) {
    const cloned = cloneVNode(type, props, true);
    if (children) {
      normalizeChildren(cloned, children);
    }
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString$4(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$4(style)) {
      if (isProxy(style) && !isArray$3(style)) {
        style = extend$2({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString$4(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$4(type) ? 4 : isFunction$3(type) ? 2 : 0;
  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend$2({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref2 ? isArray$3(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text$1, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray$3(child)) {
    return createVNode(Fragment, null, child.slice());
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text$1, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray$3(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction$3(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i2 = 0; i2 < args.length; i2++) {
    const toMerge = args[i2];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray$3(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
function renderList(source3, renderItem, cache2, index) {
  let ret;
  const cached = cache2 && cache2[index];
  if (isArray$3(source3) || isString$4(source3)) {
    ret = new Array(source3.length);
    for (let i2 = 0, l = source3.length; i2 < l; i2++) {
      ret[i2] = renderItem(source3[i2], i2, void 0, cached && cached[i2]);
    }
  } else if (typeof source3 === "number") {
    ret = new Array(source3);
    for (let i2 = 0; i2 < source3; i2++) {
      ret[i2] = renderItem(i2 + 1, i2, void 0, cached && cached[i2]);
    }
  } else if (isObject$4(source3)) {
    if (source3[Symbol.iterator]) {
      ret = Array.from(source3, (item, i2) => renderItem(item, i2, void 0, cached && cached[i2]));
    } else {
      const keys = Object.keys(source3);
      ret = new Array(keys.length);
      for (let i2 = 0, l = keys.length; i2 < l; i2++) {
        const key = keys[i2];
        ret[i2] = renderItem(source3[key], key, i2, cached && cached[i2]);
      }
    }
  } else {
    ret = [];
  }
  if (cache2) {
    cache2[index] = ret;
  }
  return ret;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    return createVNode("slot", name === "default" ? null : { name }, fallback && fallback());
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(Fragment, { key: props.key || `_${name}` }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1 ? 64 : -2);
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode$1(child))
      return true;
    if (child.type === Comment)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
function toHandlers(obj) {
  const ret = {};
  for (const key in obj) {
    ret[toHandlerKey(key)] = obj[key];
  }
  return ret;
}
const getPublicInstance = (i2) => {
  if (!i2)
    return null;
  if (isStatefulComponent(i2))
    return getExposeProxy(i2) || i2.proxy;
  return getPublicInstance(i2.parent);
};
const publicPropertiesMap = /* @__PURE__ */ extend$2(/* @__PURE__ */ Object.create(null), {
  $: (i2) => i2,
  $el: (i2) => i2.vnode.el,
  $data: (i2) => i2.data,
  $props: (i2) => i2.props,
  $attrs: (i2) => i2.attrs,
  $slots: (i2) => i2.slots,
  $refs: (i2) => i2.refs,
  $parent: (i2) => getPublicInstance(i2.parent),
  $root: (i2) => getPublicInstance(i2.root),
  $emit: (i2) => i2.emit,
  $options: (i2) => resolveMergedOptions(i2),
  $forceUpdate: (i2) => () => queueJob(i2.update),
  $nextTick: (i2) => nextTick.bind(i2.proxy),
  $watch: (i2) => instanceWatch.bind(i2)
});
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data: data2, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n2 = accessCache[key];
      if (n2 !== void 0) {
        switch (n2) {
          case 1:
            return setupState[key];
          case 2:
            return data2[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn$1(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data2 !== EMPTY_OBJ && hasOwn$1(data2, key)) {
        accessCache[key] = 2;
        return data2[key];
      } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn$1(normalizedProps, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn$1(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn$1(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (globalProperties = appContext.config.globalProperties, hasOwn$1(globalProperties, key)) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data: data2, setupState, ctx } = instance;
    if (setupState !== EMPTY_OBJ && hasOwn$1(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data2 !== EMPTY_OBJ && hasOwn$1(data2, key)) {
      data2[key] = value;
      return true;
    } else if (hasOwn$1(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({ _: { data: data2, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data2 !== EMPTY_OBJ && hasOwn$1(data2, key) || setupState !== EMPTY_OBJ && hasOwn$1(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn$1(normalizedProps, key) || hasOwn$1(ctx, key) || hasOwn$1(publicPropertiesMap, key) || hasOwn$1(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn$1(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
const emptyAppContext = createAppContext();
let uid$1 = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid$1++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new EffectScope(true),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    components: null,
    directives: null,
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    emit: null,
    emitted: null,
    propsDefaults: EMPTY_OBJ,
    inheritAttrs: type.inheritAttrs,
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit$1.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
  currentInstance = instance;
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
    resetTracking();
    unsetCurrentInstance();
    if (isPromise$1(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e2) => {
          handleError(e2, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction$3(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject$4(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend$2(extend$2({
          isCustomElement,
          delimiters
        }, compilerOptions), componentCompilerOptions);
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function createAttrsProxy(instance) {
  return new Proxy(instance.attrs, {
    get(target, key) {
      track(instance, "get", "$attrs");
      return target[key];
    }
  });
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  let attrs;
  {
    return {
      get attrs() {
        return attrs || (attrs = createAttrsProxy(instance));
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component) {
  return isFunction$3(Component) ? Component.displayName || Component.name : Component.name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(instance.components || instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction$3(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function useSlots() {
  return getContext().slots;
}
function getContext() {
  const i2 = getCurrentInstance();
  return i2.setupContext || (i2.setupContext = createSetupContext(i2));
}
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject$4(propsOrChildren) && !isArray$3(propsOrChildren)) {
      if (isVNode$1(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode$1(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const version = "3.2.33";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is2, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is2 ? { is: is2 } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector2) => doc.querySelector(selector2),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  cloneNode(el) {
    const cloned = el.cloneNode(true);
    if (`_value` in el) {
      cloned._value = el._value;
    }
    return cloned;
  },
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      before ? before.nextSibling : parent.firstChild,
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString$4(next);
  if (next && !isCssString) {
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
    if (prev && !isString$4(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray$3(val)) {
    val.forEach((v2) => setStyle(style, name, v2));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i2 = 0; i2 < prefixes.length; i2++) {
    const prefixed = prefixes[i2] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean2 = isSpecialBooleanAttr(key);
    if (value == null || isBoolean2 && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean2 ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  if (key === "value" && el.tagName !== "PROGRESS" && !el.tagName.includes("-")) {
    el._value = value;
    const newValue = value == null ? "" : value;
    if (el.value !== newValue || el.tagName === "OPTION") {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e2) {
  }
  needRemove && el.removeAttribute(key);
}
const [_getNow, skipTimestampCheck] = /* @__PURE__ */ (() => {
  let _getNow2 = Date.now;
  let skipTimestampCheck2 = false;
  if (typeof window !== "undefined") {
    if (Date.now() > document.createEvent("Event").timeStamp) {
      _getNow2 = () => performance.now();
    }
    const ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
    skipTimestampCheck2 = !!(ffMatch && Number(ffMatch[1]) <= 53);
  }
  return [_getNow2, skipTimestampCheck2];
})();
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const reset = () => {
  cachedNow = 0;
};
const getNow = () => cachedNow || (p.then(reset), cachedNow = _getNow());
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  return [hyphenate(name.slice(2)), options];
}
function createInvoker(initialValue, instance) {
  const invoker = (e2) => {
    const timeStamp = e2.timeStamp || _getNow();
    if (skipTimestampCheck || timeStamp >= invoker.attached - 1) {
      callWithAsyncErrorHandling(patchStopImmediatePropagation(e2, invoker.value), instance, 5, [e2]);
    }
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e2, value) {
  if (isArray$3(value)) {
    const originalStop = e2.stopImmediatePropagation;
    e2.stopImmediatePropagation = () => {
      originalStop.call(e2);
      e2._stopped = true;
    };
    return value.map((fn) => (e3) => !e3._stopped && fn && fn(e3));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction$3(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString$4(value)) {
    return false;
  }
  return key in el;
}
function useCssVars(getter) {
  const instance = getCurrentInstance();
  if (!instance) {
    return;
  }
  const setVars = () => setVarsOnVNode(instance.subTree, getter(instance.proxy));
  watchPostEffect(setVars);
  onMounted(() => {
    const ob = new MutationObserver(setVars);
    ob.observe(instance.subTree.el.parentNode, { childList: true });
    onUnmounted(() => ob.disconnect());
  });
}
function setVarsOnVNode(vnode, vars) {
  if (vnode.shapeFlag & 128) {
    const suspense = vnode.suspense;
    vnode = suspense.activeBranch;
    if (suspense.pendingBranch && !suspense.isHydrating) {
      suspense.effects.push(() => {
        setVarsOnVNode(suspense.activeBranch, vars);
      });
    }
  }
  while (vnode.component) {
    vnode = vnode.component.subTree;
  }
  if (vnode.shapeFlag & 1 && vnode.el) {
    setVarsOnNode(vnode.el, vars);
  } else if (vnode.type === Fragment) {
    vnode.children.forEach((c2) => setVarsOnVNode(c2, vars));
  } else if (vnode.type === Static) {
    let { el, anchor } = vnode;
    while (el) {
      setVarsOnNode(el, vars);
      if (el === anchor)
        break;
      el = el.nextSibling;
    }
  }
}
function setVarsOnNode(el, vars) {
  if (el.nodeType === 1) {
    const style = el.style;
    for (const key in vars) {
      style.setProperty(`--${key}`, vars[key]);
    }
  }
}
const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
Transition.props = /* @__PURE__ */ extend$2({}, BaseTransition.props, DOMTransitionPropsValidators);
const callHook = (hook, args = []) => {
  if (isArray$3(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray$3(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const { name = "v", type, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend$2(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      const resolve2 = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el, resolve2]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject$4(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n2 = NumberOf(duration);
    return [n2, n2];
  }
}
function NumberOf(val) {
  const res = toNumber$1(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c2) => c2 && el.classList.add(c2));
  (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c2) => c2 && el.classList.remove(c2));
  const { _vtc } = el;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el._vtc = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e2) => {
    if (e2.target === el && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(TRANSITION + "Delay");
  const transitionDurations = getStyleProperties(TRANSITION + "Duration");
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(ANIMATION + "Delay");
  const animationDurations = getStyleProperties(ANIMATION + "Duration");
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(styles[TRANSITION + "Property"]);
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i2) => toMs(d) + toMs(delays[i2])));
}
function toMs(s2) {
  return Number(s2.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"];
  return isArray$3(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e2) {
  e2.target.composing = true;
}
function onCompositionEnd(e2) {
  const target = e2.target;
  if (target.composing) {
    target.composing = false;
    trigger$1(target, "input");
  }
}
function trigger$1(el, type) {
  const e2 = document.createEvent("HTMLEvents");
  e2.initEvent(type, true, true);
  el.dispatchEvent(e2);
}
const vModelText = {
  created(el, { modifiers: { lazy, trim: trim2, number: number2 } }, vnode) {
    el._assign = getModelAssigner(vnode);
    const castToNumber = number2 || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e2) => {
      if (e2.target.composing)
        return;
      let domValue = el.value;
      if (trim2) {
        domValue = domValue.trim();
      } else if (castToNumber) {
        domValue = toNumber$1(domValue);
      }
      el._assign(domValue);
    });
    if (trim2) {
      addEventListener(el, "change", () => {
        el.value = el.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, modifiers: { lazy, trim: trim2, number: number2 } }, vnode) {
    el._assign = getModelAssigner(vnode);
    if (el.composing)
      return;
    if (document.activeElement === el) {
      if (lazy) {
        return;
      }
      if (trim2 && el.value.trim() === value) {
        return;
      }
      if ((number2 || el.type === "number") && toNumber$1(el.value) === value) {
        return;
      }
    }
    const newValue = value == null ? "" : value;
    if (el.value !== newValue) {
      el.value = newValue;
    }
  }
};
const vModelCheckbox = {
  deep: true,
  created(el, _2, vnode) {
    el._assign = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      const modelValue = el._modelValue;
      const elementValue = getValue(el);
      const checked = el.checked;
      const assign2 = el._assign;
      if (isArray$3(modelValue)) {
        const index = looseIndexOf(modelValue, elementValue);
        const found = index !== -1;
        if (checked && !found) {
          assign2(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign2(filtered);
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign2(cloned);
      } else {
        assign2(getCheckboxValue(el, checked));
      }
    });
  },
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el._assign = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }
};
function setChecked(el, { value, oldValue }, vnode) {
  el._modelValue = value;
  if (isArray$3(value)) {
    el.checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet(value)) {
    el.checked = value.has(vnode.props.value);
  } else if (value !== oldValue) {
    el.checked = looseEqual(value, getCheckboxValue(el, true));
  }
}
const vModelRadio = {
  created(el, { value }, vnode) {
    el.checked = looseEqual(value, vnode.props.value);
    el._assign = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      el._assign(getValue(el));
    });
  },
  beforeUpdate(el, { value, oldValue }, vnode) {
    el._assign = getModelAssigner(vnode);
    if (value !== oldValue) {
      el.checked = looseEqual(value, vnode.props.value);
    }
  }
};
function getValue(el) {
  return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el ? el[key] : checked;
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e2) => e2.stopPropagation(),
  prevent: (e2) => e2.preventDefault(),
  self: (e2) => e2.target !== e2.currentTarget,
  ctrl: (e2) => !e2.ctrlKey,
  shift: (e2) => !e2.shiftKey,
  alt: (e2) => !e2.altKey,
  meta: (e2) => !e2.metaKey,
  left: (e2) => "button" in e2 && e2.button !== 0,
  middle: (e2) => "button" in e2 && e2.button !== 1,
  right: (e2) => "button" in e2 && e2.button !== 2,
  exact: (e2, modifiers) => systemModifiers.some((m) => e2[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  return (event, ...args) => {
    for (let i2 = 0; i2 < modifiers.length; i2++) {
      const guard = modifierGuards[modifiers[i2]];
      if (guard && guard(event, modifiers))
        return;
    }
    return fn(event, ...args);
  };
};
const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};
const withKeys = (fn, modifiers) => {
  return (event) => {
    if (!("key" in event)) {
      return;
    }
    const eventKey = hyphenate(event.key);
    if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) {
      return fn(event);
    }
  };
};
const rendererOptions = /* @__PURE__ */ extend$2({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const render = (...args) => {
  ensureRenderer().render(...args);
};
const createApp$1 = (...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app._component;
    if (!isFunction$3(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
function normalizeContainer(container) {
  if (isString$4(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
var __defProp2 = Object.defineProperty;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a2, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a2, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a2, prop, b[prop]);
    }
  return a2;
};
var PROVIDE_KEY = `usehead`;
var HEAD_COUNT_KEY = `head:count`;
var HEAD_ATTRS_KEY = `data-head-attrs`;
var createElement$1 = (tag, attrs, document2) => {
  const el = document2.createElement(tag);
  for (const key of Object.keys(attrs)) {
    let value = attrs[key];
    if (key === "key" || value === false) {
      continue;
    }
    if (key === "children") {
      el.textContent = value;
    } else {
      el.setAttribute(key, value);
    }
  }
  return el;
};
function isEqualNode(oldTag, newTag) {
  if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
    const nonce = newTag.getAttribute("nonce");
    if (nonce && !oldTag.getAttribute("nonce")) {
      const cloneTag = newTag.cloneNode(true);
      cloneTag.setAttribute("nonce", "");
      cloneTag.nonce = nonce;
      return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
    }
  }
  return oldTag.isEqualNode(newTag);
}
var getTagKey = (props) => {
  const names = ["key", "id", "name", "property"];
  for (const n2 of names) {
    const value = typeof props.getAttribute === "function" ? props.hasAttribute(n2) ? props.getAttribute(n2) : void 0 : props[n2];
    if (value !== void 0) {
      return { name: n2, value };
    }
  }
};
var injectHead = () => {
  const head = inject(PROVIDE_KEY);
  if (!head) {
    throw new Error(`You may forget to apply app.use(head)`);
  }
  return head;
};
var acceptFields = [
  "title",
  "meta",
  "link",
  "base",
  "style",
  "script",
  "htmlAttrs",
  "bodyAttrs"
];
var headObjToTags = (obj) => {
  const tags = [];
  for (const key of Object.keys(obj)) {
    if (obj[key] == null)
      continue;
    if (key === "title") {
      tags.push({ tag: key, props: { children: obj[key] } });
    } else if (key === "base") {
      tags.push({ tag: key, props: __spreadValues2({ key: "default" }, obj[key]) });
    } else if (acceptFields.includes(key)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          tags.push({ tag: key, props: item });
        });
      } else if (value) {
        tags.push({ tag: key, props: value });
      }
    }
  }
  return tags;
};
var setAttrs = (el, attrs) => {
  const existingAttrs = el.getAttribute(HEAD_ATTRS_KEY);
  if (existingAttrs) {
    for (const key of existingAttrs.split(",")) {
      if (!(key in attrs)) {
        el.removeAttribute(key);
      }
    }
  }
  const keys = [];
  for (const key in attrs) {
    const value = attrs[key];
    if (value == null)
      continue;
    if (value === false) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
    keys.push(key);
  }
  if (keys.length) {
    el.setAttribute(HEAD_ATTRS_KEY, keys.join(","));
  } else {
    el.removeAttribute(HEAD_ATTRS_KEY);
  }
};
var updateElements = (document2 = window.document, type, tags) => {
  var _a2;
  const head = document2.head;
  let headCountEl = head.querySelector(`meta[name="${HEAD_COUNT_KEY}"]`);
  const headCount = headCountEl ? Number(headCountEl.getAttribute("content")) : 0;
  const oldElements = [];
  if (headCountEl) {
    for (let i2 = 0, j = headCountEl.previousElementSibling; i2 < headCount; i2++, j = (j == null ? void 0 : j.previousElementSibling) || null) {
      if (((_a2 = j == null ? void 0 : j.tagName) == null ? void 0 : _a2.toLowerCase()) === type) {
        oldElements.push(j);
      }
    }
  } else {
    headCountEl = document2.createElement("meta");
    headCountEl.setAttribute("name", HEAD_COUNT_KEY);
    headCountEl.setAttribute("content", "0");
    head.append(headCountEl);
  }
  let newElements = tags.map((tag) => createElement$1(tag.tag, tag.props, document2));
  newElements = newElements.filter((newEl) => {
    for (let i2 = 0; i2 < oldElements.length; i2++) {
      const oldEl = oldElements[i2];
      if (isEqualNode(oldEl, newEl)) {
        oldElements.splice(i2, 1);
        return false;
      }
    }
    return true;
  });
  oldElements.forEach((t2) => {
    var _a22;
    return (_a22 = t2.parentNode) == null ? void 0 : _a22.removeChild(t2);
  });
  newElements.forEach((t2) => {
    head.insertBefore(t2, headCountEl);
  });
  headCountEl.setAttribute("content", "" + (headCount - oldElements.length + newElements.length));
};
var createHead = () => {
  let allHeadObjs = [];
  let previousTags = /* @__PURE__ */ new Set();
  const head = {
    install(app) {
      app.config.globalProperties.$head = head;
      app.provide(PROVIDE_KEY, head);
    },
    get headTags() {
      const deduped = [];
      allHeadObjs.forEach((objs) => {
        const tags = headObjToTags(objs.value);
        tags.forEach((tag) => {
          if (tag.tag === "meta" || tag.tag === "base" || tag.tag === "script") {
            const key = getTagKey(tag.props);
            if (key) {
              let index = -1;
              for (let i2 = 0; i2 < deduped.length; i2++) {
                const prev = deduped[i2];
                const prevValue = prev.props[key.name];
                const nextValue = tag.props[key.name];
                if (prev.tag === tag.tag && prevValue === nextValue) {
                  index = i2;
                  break;
                }
              }
              if (index !== -1) {
                deduped.splice(index, 1);
              }
            }
          }
          deduped.push(tag);
        });
      });
      return deduped;
    },
    addHeadObjs(objs) {
      allHeadObjs.push(objs);
    },
    removeHeadObjs(objs) {
      allHeadObjs = allHeadObjs.filter((_objs) => _objs !== objs);
    },
    updateDOM(document2 = window.document) {
      let title;
      let htmlAttrs = {};
      let bodyAttrs = {};
      const actualTags = {};
      for (const tag of head.headTags) {
        if (tag.tag === "title") {
          title = tag.props.children;
          continue;
        }
        if (tag.tag === "htmlAttrs") {
          Object.assign(htmlAttrs, tag.props);
          continue;
        }
        if (tag.tag === "bodyAttrs") {
          Object.assign(bodyAttrs, tag.props);
          continue;
        }
        actualTags[tag.tag] = actualTags[tag.tag] || [];
        actualTags[tag.tag].push(tag);
      }
      if (title !== void 0) {
        document2.title = title;
      }
      setAttrs(document2.documentElement, htmlAttrs);
      setAttrs(document2.body, bodyAttrs);
      const tags = /* @__PURE__ */ new Set([...Object.keys(actualTags), ...previousTags]);
      for (const tag of tags) {
        updateElements(document2, tag, actualTags[tag] || []);
      }
      previousTags.clear();
      Object.keys(actualTags).forEach((i2) => previousTags.add(i2));
    }
  };
  return head;
};
var IS_BROWSER = typeof window !== "undefined";
var useHead = (obj) => {
  const headObj = ref(obj);
  const head = injectHead();
  head.addHeadObjs(headObj);
  if (IS_BROWSER) {
    watchEffect(() => {
      head.updateDOM();
    });
    onBeforeUnmount(() => {
      head.removeHeadObjs(headObj);
      head.updateDOM();
    });
  }
};
var isVue2 = false;
/*!
  * pinia v2.0.13
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = Symbol();
function isPlainObject$2(o2) {
  return o2 && typeof o2 === "object" && Object.prototype.toString.call(o2) === "[object Object]" && typeof o2.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      setActivePinia(pinia);
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      }
    },
    use(plugin) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    _p,
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
const noop$3 = () => {
};
function addSubscription(subscriptions, callback2, detached, onCleanup = noop$3) {
  subscriptions.push(callback2);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback2);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentInstance()) {
    onUnmounted(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback2) => {
    callback2(...args);
  });
}
function mergeReactiveObjects(target, patchToApply) {
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject$2(targetValue) && isPlainObject$2(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = Symbol();
function shouldHydrate(obj) {
  return !isPlainObject$2(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign: assign$2 } = Object;
function isComputed(o2) {
  return !!(isRef(o2) && o2.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && true) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = toRefs(pinia.state.value[id]);
    return assign$2(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia);
  store.$reset = function $reset() {
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign$2($state, newState);
    });
  };
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot) {
  let scope;
  const buildState2 = options.state;
  const optionsForPlugin = assign$2({ actions: {} }, options);
  const $subscribeOptions = {
    deep: true
  };
  let isListening;
  let isSyncListening;
  let subscriptions = markRaw([]);
  let actionSubscriptions = markRaw([]);
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!buildState2 && !initialState && true) {
    {
      pinia.state.value[$id] = {};
    }
  }
  ref({});
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    nextTick().then(() => {
      isListening = true;
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = noop$3;
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  function wrapAction(name, action) {
    return function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback2) {
        afterCallbackList.push(callback2);
      }
      function onError(callback2) {
        onErrorCallbackList.push(callback2);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name,
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = action.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
  }
  const partialStore = {
    _p: pinia,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback2, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback2, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback2({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign$2({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(assign$2({}, partialStore));
  pinia._s.set($id, store);
  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!buildState2) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
    } else if (typeof prop === "function") {
      const actionValue = wrapAction(key, prop);
      {
        setupStore[key] = actionValue;
      }
      optionsForPlugin.actions[key] = prop;
    } else
      ;
  }
  {
    assign$2(store, setupStore);
    assign$2(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign$2($state, state);
      });
    }
  });
  pinia._p.forEach((extender) => {
    {
      assign$2(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && buildState2 && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  function useStore(pinia, hot) {
    const currentInstance2 = getCurrentInstance();
    pinia = pinia || currentInstance2 && inject(piniaSymbol);
    if (pinia)
      setActivePinia(pinia);
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store = pinia._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}
/*!
  * vue-router v4.0.14
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
const hasSymbol$1 = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
const PolySymbol = (name) => hasSymbol$1 ? Symbol(name) : "_vr_" + name;
const matchedRouteKey = /* @__PURE__ */ PolySymbol("rvlm");
const viewDepthKey = /* @__PURE__ */ PolySymbol("rvd");
const routerKey = /* @__PURE__ */ PolySymbol("r");
const routeLocationKey = /* @__PURE__ */ PolySymbol("rl");
const routerViewLocationKey = /* @__PURE__ */ PolySymbol("rvl");
const isBrowser = typeof window !== "undefined";
function isESModule(obj) {
  return obj.__esModule || hasSymbol$1 && obj[Symbol.toStringTag] === "Module";
}
const assign$1 = Object.assign;
function applyToParams(fn, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value);
  }
  return newParams;
}
const noop$2 = () => {
};
const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
function parseURL(parseQuery2, location2, currentLocation = "/") {
  let path, query = {}, searchString = "", hash = "";
  const searchPos = location2.indexOf("?");
  const hashPos = location2.indexOf("#", searchPos > -1 ? searchPos : 0);
  if (searchPos > -1) {
    path = location2.slice(0, searchPos);
    searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location2.slice(0, hashPos);
    hash = location2.slice(hashPos, location2.length);
  }
  path = resolveRelativePath(path != null ? path : location2, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash,
    path,
    query,
    hash
  };
}
function stringifyURL(stringifyQuery2, location2) {
  const query = location2.query ? stringifyQuery2(location2.query) : "";
  return location2.path + (query && "?") + query + (location2.hash || "");
}
function stripBase(pathname, base2) {
  if (!base2 || !pathname.toLowerCase().startsWith(base2.toLowerCase()))
    return pathname;
  return pathname.slice(base2.length) || "/";
}
function isSameRouteLocation(stringifyQuery2, a2, b) {
  const aLastIndex = a2.matched.length - 1;
  const bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a2.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a2.params, b.params) && stringifyQuery2(a2.query) === stringifyQuery2(b.query) && a2.hash === b.hash;
}
function isSameRouteRecord(a2, b) {
  return (a2.aliasOf || a2) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a2, b) {
  if (Object.keys(a2).length !== Object.keys(b).length)
    return false;
  for (const key in a2) {
    if (!isSameRouteLocationParamsValue(a2[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue(a2, b) {
  return Array.isArray(a2) ? isEquivalentArray(a2, b) : Array.isArray(b) ? isEquivalentArray(b, a2) : a2 === b;
}
function isEquivalentArray(a2, b) {
  return Array.isArray(b) ? a2.length === b.length && a2.every((value, i2) => value === b[i2]) : a2.length === 1 && a2[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (position === 1 || segment === ".")
      continue;
    if (segment === "..")
      position--;
    else
      break;
  }
  return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
}
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
function normalizeBase(base2) {
  if (!base2) {
    if (isBrowser) {
      const baseEl = document.querySelector("base");
      base2 = baseEl && baseEl.getAttribute("href") || "/";
      base2 = base2.replace(/^\w+:\/\/[^\/]+/, "");
    } else {
      base2 = "/";
    }
  }
  if (base2[0] !== "/" && base2[0] !== "#")
    base2 = "/" + base2;
  return removeTrailingSlash(base2);
}
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base2, location2) {
  return base2.replace(BEFORE_HASH_RE, "#") + location2;
}
function getElementPosition(el, offset) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    behavior: offset.behavior,
    left: elRect.left - docRect.left - (offset.left || 0),
    top: elRect.top - docRect.top - (offset.top || 0)
  };
}
const computeScrollPosition = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function scrollToPosition(position) {
  let scrollToOptions;
  if ("el" in position) {
    const positionEl = position.el;
    const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
    const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el) {
      return;
    }
    scrollToOptions = getElementPosition(el, position);
  } else {
    scrollToOptions = position;
  }
  if ("scrollBehavior" in document.documentElement.style)
    window.scrollTo(scrollToOptions);
  else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.pageXOffset, scrollToOptions.top != null ? scrollToOptions.top : window.pageYOffset);
  }
}
function getScrollKey(path, delta) {
  const position = history.state ? history.state.position - delta : -1;
  return position + path;
}
const scrollPositions = /* @__PURE__ */ new Map();
function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);
  scrollPositions.delete(key);
  return scroll;
}
let createBaseLocation = () => location.protocol + "//" + location.host;
function createCurrentLocation(base2, location2) {
  const { pathname, search, hash } = location2;
  const hashPos = base2.indexOf("#");
  if (hashPos > -1) {
    let slicePos = hash.includes(base2.slice(hashPos)) ? base2.slice(hashPos).length : 1;
    let pathFromHash = hash.slice(slicePos);
    if (pathFromHash[0] !== "/")
      pathFromHash = "/" + pathFromHash;
    return stripBase(pathFromHash, "");
  }
  const path = stripBase(pathname, base2);
  return path + search + hash;
}
function useHistoryListeners(base2, historyState, currentLocation, replace) {
  let listeners = [];
  let teardowns = [];
  let pauseState = null;
  const popStateHandler = ({ state }) => {
    const to = createCurrentLocation(base2, location);
    const from = currentLocation.value;
    const fromState = historyState.value;
    let delta = 0;
    if (state) {
      currentLocation.value = to;
      historyState.value = state;
      if (pauseState && pauseState === from) {
        pauseState = null;
        return;
      }
      delta = fromState ? state.position - fromState.position : 0;
    } else {
      replace(to);
    }
    listeners.forEach((listener) => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
      });
    });
  };
  function pauseListeners() {
    pauseState = currentLocation.value;
  }
  function listen(callback2) {
    listeners.push(callback2);
    const teardown = () => {
      const index = listeners.indexOf(callback2);
      if (index > -1)
        listeners.splice(index, 1);
    };
    teardowns.push(teardown);
    return teardown;
  }
  function beforeUnloadListener() {
    const { history: history2 } = window;
    if (!history2.state)
      return;
    history2.replaceState(assign$1({}, history2.state, { scroll: computeScrollPosition() }), "");
  }
  function destroy() {
    for (const teardown of teardowns)
      teardown();
    teardowns = [];
    window.removeEventListener("popstate", popStateHandler);
    window.removeEventListener("beforeunload", beforeUnloadListener);
  }
  window.addEventListener("popstate", popStateHandler);
  window.addEventListener("beforeunload", beforeUnloadListener);
  return {
    pauseListeners,
    listen,
    destroy
  };
}
function buildState(back, current, forward, replaced = false, computeScroll = false) {
  return {
    back,
    current,
    forward,
    replaced,
    position: window.history.length,
    scroll: computeScroll ? computeScrollPosition() : null
  };
}
function useHistoryStateNavigation(base2) {
  const { history: history2, location: location2 } = window;
  const currentLocation = {
    value: createCurrentLocation(base2, location2)
  };
  const historyState = { value: history2.state };
  if (!historyState.value) {
    changeLocation(currentLocation.value, {
      back: null,
      current: currentLocation.value,
      forward: null,
      position: history2.length - 1,
      replaced: true,
      scroll: null
    }, true);
  }
  function changeLocation(to, state, replace2) {
    const hashIndex = base2.indexOf("#");
    const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base2 : base2.slice(hashIndex)) + to : createBaseLocation() + base2 + to;
    try {
      history2[replace2 ? "replaceState" : "pushState"](state, "", url);
      historyState.value = state;
    } catch (err) {
      {
        console.error(err);
      }
      location2[replace2 ? "replace" : "assign"](url);
    }
  }
  function replace(to, data2) {
    const state = assign$1({}, history2.state, buildState(historyState.value.back, to, historyState.value.forward, true), data2, { position: historyState.value.position });
    changeLocation(to, state, true);
    currentLocation.value = to;
  }
  function push(to, data2) {
    const currentState = assign$1({}, historyState.value, history2.state, {
      forward: to,
      scroll: computeScrollPosition()
    });
    changeLocation(currentState.current, currentState, true);
    const state = assign$1({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data2);
    changeLocation(to, state, false);
    currentLocation.value = to;
  }
  return {
    location: currentLocation,
    state: historyState,
    push,
    replace
  };
}
function createWebHistory(base2) {
  base2 = normalizeBase(base2);
  const historyNavigation = useHistoryStateNavigation(base2);
  const historyListeners = useHistoryListeners(base2, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
  function go(delta, triggerListeners = true) {
    if (!triggerListeners)
      historyListeners.pauseListeners();
    history.go(delta);
  }
  const routerHistory = assign$1({
    location: "",
    base: base2,
    go,
    createHref: createHref.bind(null, base2)
  }, historyNavigation, historyListeners);
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => historyNavigation.location.value
  });
  Object.defineProperty(routerHistory, "state", {
    enumerable: true,
    get: () => historyNavigation.state.value
  });
  return routerHistory;
}
function isRouteLocation(route) {
  return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
  return typeof name === "string" || typeof name === "symbol";
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
const NavigationFailureSymbol = /* @__PURE__ */ PolySymbol("nf");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type, params) {
  {
    return assign$1(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options = assign$1({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  const score = [];
  let pattern = options.start ? "^" : "";
  const keys = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [90];
    if (options.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options.strict && options.end) {
    const i2 = score.length - 1;
    score[i2][score[i2].length - 1] += 0.7000000000000001;
  }
  if (!options.strict)
    pattern += "/?";
  if (options.end)
    pattern += "$";
  else if (options.strict)
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options.sensitive ? "" : "i");
  function parse2(path) {
    const match = path.match(re);
    const params = {};
    if (!match)
      return null;
    for (let i2 = 1; i2 < match.length; i2++) {
      const value = match[i2] || "";
      const key = keys[i2 - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (Array.isArray(param) && !repeatable)
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          const text = Array.isArray(param) ? param.join("/") : param;
          if (!text) {
            if (optional) {
              if (segment.length < 2) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text;
        }
      }
    }
    return path;
  }
  return {
    re,
    score,
    keys,
    parse: parse2,
    stringify
  };
}
function compareScoreArray(a2, b) {
  let i2 = 0;
  while (i2 < a2.length && i2 < b.length) {
    const diff = b[i2] - a2[i2];
    if (diff)
      return diff;
    i2++;
  }
  if (a2.length < b.length) {
    return a2.length === 1 && a2[0] === 40 + 40 ? -1 : 1;
  } else if (a2.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a2, b) {
  let i2 = 0;
  const aScore = a2.score;
  const bScore = b.score;
  while (i2 < aScore.length && i2 < bScore.length) {
    const comp = compareScoreArray(aScore[i2], bScore[i2]);
    if (comp)
      return comp;
    i2++;
  }
  return bScore.length - aScore.length;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i2 = 0;
  let char;
  let buffer = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer = "";
  }
  function addCharToBuffer() {
    buffer += char;
  }
  while (i2 < path.length) {
    char = path[i2++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i2--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i2--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher = assign$1(parser, {
    record,
    parent,
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher);
  }
  return matcher;
}
function createRouterMatcher(routes2, globalOptions) {
  const matchers = [];
  const matcherMap = /* @__PURE__ */ new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }
  function addRoute(record, parent, originalRecord) {
    const isRootAdd = !originalRecord;
    const mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record);
    const normalizedRecords = [
      mainNormalizedRecord
    ];
    if ("alias" in record) {
      const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases) {
        normalizedRecords.push(assign$1({}, mainNormalizedRecord, {
          components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
          path: alias,
          aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
        }));
      }
    }
    let matcher;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      const { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        const parentPath = parent.record.path;
        const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
      } else {
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher)
          originalMatcher.alias.push(matcher);
        if (isRootAdd && record.name && !isAliasRecord(matcher))
          removeRoute(record.name);
      }
      if ("children" in mainNormalizedRecord) {
        const children = mainNormalizedRecord.children;
        for (let i2 = 0; i2 < children.length; i2++) {
          addRoute(children[i2], matcher, originalRecord && originalRecord.children[i2]);
        }
      }
      originalRecord = originalRecord || matcher;
      insertMatcher(matcher);
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop$2;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      const index = matchers.indexOf(matcherRef);
      if (index > -1) {
        matchers.splice(index, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes() {
    return matchers;
  }
  function insertMatcher(matcher) {
    let i2 = 0;
    while (i2 < matchers.length && comparePathParserScore(matcher, matchers[i2]) >= 0 && (matcher.record.path !== matchers[i2].record.path || !isRecordChildOf(matcher, matchers[i2])))
      i2++;
    matchers.splice(i2, 0, matcher);
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher);
  }
  function resolve2(location2, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name;
    if ("name" in location2 && location2.name) {
      matcher = matcherMap.get(location2.name);
      if (!matcher)
        throw createRouterError(1, {
          location: location2
        });
      name = matcher.record.name;
      params = assign$1(paramsFromLocation(currentLocation.params, matcher.keys.filter((k) => !k.optional).map((k) => k.name)), location2.params);
      path = matcher.stringify(params);
    } else if ("path" in location2) {
      path = location2.path;
      matcher = matchers.find((m) => m.re.test(path));
      if (matcher) {
        params = matcher.parse(path);
        name = matcher.record.name;
      }
    } else {
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher)
        throw createRouterError(1, {
          location: location2,
          currentLocation
        });
      name = matcher.record.name;
      params = assign$1({}, currentLocation.params, location2.params);
      path = matcher.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes2.forEach((route) => addRoute(route));
  return { addRoute, resolve: resolve2, removeRoute, getRoutes, getRecordMatcher };
}
function paramsFromLocation(params, keys) {
  const newParams = {};
  for (const key of keys) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  return {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: void 0,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in record ? record.components || {} : { default: record.component }
  };
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (const name in record.components)
      propsObject[name] = typeof props === "boolean" ? props : props[name];
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign$1(meta, record.meta), {});
}
function mergeOptions(defaults2, partialOptions) {
  const options = {};
  for (const key in defaults2) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults2[key];
  }
  return options;
}
function isRecordChildOf(record, parent) {
  return parent.children.some((child) => child === record || isRecordChildOf(record, child));
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text) {
  return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text) {
  return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text) {
  return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
  try {
    return decodeURIComponent("" + text);
  } catch (err) {
  }
  return "" + text;
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i2 = 0; i2 < searchParams.length; ++i2) {
    const searchParam = searchParams[i2].replace(PLUS_RE, " ");
    const eqPos = searchParam.indexOf("=");
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!Array.isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    const values = Array.isArray(value) ? value.map((v2) => v2 && encodeQueryValue(v2)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (const key in query) {
    const value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = Array.isArray(value) ? value.map((v2) => v2 == null ? null : "" + v2) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
function useCallbacks() {
  let handlers2 = [];
  function add2(handler) {
    handlers2.push(handler);
    return () => {
      const i2 = handlers2.indexOf(handler);
      if (i2 > -1)
        handlers2.splice(i2, 1);
    };
  }
  function reset2() {
    handlers2 = [];
  }
  return {
    add: add2,
    list: () => handlers2,
    reset: reset2
  };
}
function guardToPromiseFn(guard, to, from, record, name) {
  const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve2, reject) => {
    const next = (valid) => {
      if (valid === false)
        reject(createRouterError(4, {
          from,
          to
        }));
      else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2, {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function")
          enterCallbackArray.push(valid);
        resolve2();
      }
    };
    const guardReturn = guard.call(record && record.instances[name], to, from, next);
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        const options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.components[name] = resolvedComponent;
          const options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name)();
        }));
      }
    }
  }
  return guards;
}
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function useLink(props) {
  const router = inject(routerKey);
  const currentRoute = inject(routeLocationKey);
  const route = computed(() => router.resolve(unref(props.to)));
  const activeRecordIndex = computed(() => {
    const { matched } = route.value;
    const { length } = matched;
    const routeMatched = matched[length - 1];
    const currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index > -1)
      return index;
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index;
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e2 = {}) {
    if (guardEvent(e2)) {
      return router[unref(props.replace) ? "replace" : "push"](unref(props.to)).catch(noop$2);
    }
    return Promise.resolve();
  }
  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
const RouterLinkImpl = /* @__PURE__ */ defineComponent({
  name: "RouterLink",
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink,
  setup(props, { slots }) {
    const link = reactive(useLink(props));
    const { options } = inject(routerKey);
    const elClass = computed(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && slots.default(link);
      return props.custom ? children : h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e2) {
  if (e2.metaKey || e2.altKey || e2.ctrlKey || e2.shiftKey)
    return;
  if (e2.defaultPrevented)
    return;
  if (e2.button !== void 0 && e2.button !== 0)
    return;
  if (e2.currentTarget && e2.currentTarget.getAttribute) {
    const target = e2.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target))
      return;
  }
  if (e2.preventDefault)
    e2.preventDefault();
  return true;
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key];
    const outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!Array.isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i2) => value !== outerValue[i2]))
        return false;
    }
  }
  return true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ defineComponent({
  name: "RouterView",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  setup(props, { attrs, slots }) {
    const injectedRoute = inject(routerViewLocationKey);
    const routeToDisplay = computed(() => props.route || injectedRoute.value);
    const depth = inject(viewDepthKey, 0);
    const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth]);
    provide(viewDepthKey, depth + 1);
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);
    const viewRef = ref();
    watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name] = instance;
        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach((callback2) => callback2(instance));
      }
    }, { flush: "post" });
    return () => {
      const route = routeToDisplay.value;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[props.name];
      const currentName = props.name;
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route });
      }
      const routePropsOption = matchedRoute.props[props.name];
      const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = h(ViewComponent, assign$1({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      return normalizeSlot(slots.default, { Component: component, route }) || component;
    };
  }
});
function normalizeSlot(slot, data2) {
  if (!slot)
    return null;
  const slotContent = slot(data2);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function createRouter$1(options) {
  const matcher = createRouterMatcher(options.routes, options);
  const parseQuery$1 = options.parseQuery || parseQuery;
  const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  const routerHistory = options.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = applyToParams.bind(null, decode);
  function addRoute(parentOrRoute, route) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route;
    } else {
      record = parentOrRoute;
    }
    return matcher.addRoute(record, parent);
  }
  function removeRoute(name) {
    const recordMatcher = matcher.getRecordMatcher(name);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }
  function resolve2(rawLocation, currentLocation) {
    currentLocation = assign$1({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      const href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign$1(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if ("path" in rawLocation) {
      matcherLocation = assign$1({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      const targetParams = assign$1({}, rawLocation.params);
      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      }
      matcherLocation = assign$1({}, rawLocation, {
        params: encodeParams(rawLocation.params)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign$1({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    const href = routerHistory.createHref(fullPath);
    return assign$1({
      fullPath,
      hash,
      query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign$1({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace(to) {
    return push(assign$1(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
        newTargetLocation.params = {};
      }
      return assign$1({
        query: to.query,
        hash: to.hash,
        params: to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve2(to);
    const from = currentRoute.value;
    const data2 = to.state;
    const force = to.force;
    const replace2 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(assign$1(locationAsObject(shouldRedirect), {
        state: data2,
        force,
        replace: replace2
      }), redirectedFrom || targetLocation);
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll(from, from, true, false);
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? isNavigationFailure(error, 2) ? error : markAsReady(error) : triggerError(error, toLocation, from)).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(failure2, 2)) {
          return pushWithRedirect(assign$1(locationAsObject(failure2.to), {
            state: data2,
            force,
            replace: replace2
          }), redirectedFrom || toLocation);
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace2, data2);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of to.matched) {
        if (record.beforeEnter && !from.matched.includes(record)) {
          if (Array.isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    for (const guard of afterGuards.list())
      guard(to, from, failure);
  }
  function finalizeNavigation(toLocation, from, isPush, replace2, data2) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state;
    if (isPush) {
      if (replace2 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign$1({
          scroll: isFirstNavigation && state && state.scroll
        }, data2));
      else
        routerHistory.push(toLocation.fullPath, data2);
    }
    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      const toLocation = resolve2(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign$1(shouldRedirect, { replace: true }), toLocation).catch(noop$2);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(error, 4 | 8)) {
          return error;
        }
        if (isNavigationFailure(error, 2)) {
          pushWithRedirect(error.to, toLocation).then((failure) => {
            if (isNavigationFailure(failure, 4 | 16) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop$2);
          return Promise.reject();
        }
        if (info.delta)
          routerHistory.go(-info.delta, false);
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(toLocation, from, false);
        if (failure) {
          if (info.delta) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop$2);
    });
  }
  let readyHandlers = useCallbacks();
  let errorHandlers = useCallbacks();
  let ready2;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorHandlers.list();
    if (list.length) {
      list.forEach((handler) => handler(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready2 && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve3, reject) => {
      readyHandlers.add([resolve3, reject]);
    });
  }
  function markAsReady(err) {
    if (!ready2) {
      ready2 = !err;
      setupListeners();
      readyHandlers.list().forEach(([resolve3, reject]) => err ? reject(err) : resolve3());
      readyHandlers.reset();
    }
    return err;
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options;
    if (!isBrowser || !scrollBehavior)
      return Promise.resolve();
    const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
  }
  const go = (delta) => routerHistory.go(delta);
  let started;
  const installedApps = /* @__PURE__ */ new Set();
  const router = {
    currentRoute,
    addRoute,
    removeRoute,
    hasRoute,
    getRoutes,
    resolve: resolve2,
    options,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorHandlers.add,
    isReady,
    install(app) {
      const router2 = this;
      app.component("RouterLink", RouterLink);
      app.component("RouterView", RouterView);
      app.config.globalProperties.$router = router2;
      Object.defineProperty(app.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute)
      });
      if (isBrowser && !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        started = true;
        push(routerHistory.location).catch((err) => {
        });
      }
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        reactiveRoute[key] = computed(() => currentRoute.value[key]);
      }
      app.provide(routerKey, router2);
      app.provide(routeLocationKey, reactive(reactiveRoute));
      app.provide(routerViewLocationKey, currentRoute);
      const unmountApp = app.unmount;
      installedApps.add(app);
      app.unmount = function() {
        installedApps.delete(app);
        if (installedApps.size < 1) {
          pendingLocation = START_LOCATION_NORMALIZED;
          removeHistoryListener && removeHistoryListener();
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready2 = false;
        }
        unmountApp();
      };
    }
  };
  return router;
}
function runGuardQueue(guards) {
  return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i2 = 0; i2 < len; i2++) {
    const recordFrom = from.matched[i2];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i2];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
function useRouter() {
  return inject(routerKey);
}
function useRoute() {
  return inject(routeLocationKey);
}
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  props: {
    theme: { default: "darker" }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["minimal-wrapper", [props.theme]])
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
var AnimatedLogo_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _withScopeId = (n2) => (pushScopeId("data-v-27141d1d"), n2 = n2(), popScopeId(), n2);
const _hoisted_1$b = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("g", null, [
  /* @__PURE__ */ createBaseVNode("path", {
    class: "right",
    d: "M67.3,55.7L75.6,70l3.7,6.4l22.1,38.3l35.9-0.1L78.2,14.1L61.2,45L67.3,55.7z M130.1,114.5l-21.3,0.1"
  }),
  /* @__PURE__ */ createBaseVNode("path", {
    class: "left",
    d: "M39.1,145.9l11.7-20.3l2.7-4.7l3.7-6.4l22.1-38.3L61.2,45L3.6,145.9H39.1z M64.8,51.5l2.5,4.2l8.3,14.2V70\n			L64.8,51.5z"
  }),
  /* @__PURE__ */ createBaseVNode("path", {
    class: "bottom",
    d: "M39,145.9h117.4l-19.1-31.4l-80.1,0.1L39,145.9z M53.4,121l-10.6,18.5l7.9-13.9L53.4,121z"
  })
], -1));
const _hoisted_2$b = [
  _hoisted_1$b
];
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  props: {
    light: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const router = useRouter();
    const isLoading = ref(false);
    router.beforeEach(() => {
      isLoading.value = true;
    });
    router.afterEach(() => {
      setTimeout(() => {
        isLoading.value = false;
      }, 200);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", {
        id: "OBJECTS",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        x: "0px",
        y: "0px",
        viewBox: "0 0 160 160",
        style: { "enable-background": "new 0 0 160 160" },
        "xml:space": "preserve",
        class: normalizeClass([props.light && "is-light"])
      }, [
        createBaseVNode("g", {
          class: normalizeClass([isLoading.value && "is-roll"])
        }, _hoisted_2$b, 2)
      ], 2);
    };
  }
});
var __unplugin_components_0 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-27141d1d"]]);
var LandingFooter_vue_vue_type_style_index_0_lang = "";
const _sfc_main$g = {};
const _hoisted_1$a = { class: "vuero-footer" };
const _hoisted_2$a = { class: "container" };
const _hoisted_3$a = /* @__PURE__ */ createStaticVNode('<div class="footer-head"><div class="head-text"><h3>Ready to get started?</h3><p>Get your Vuero copy now</p></div><div class="head-action"><div class="buttons"><a href="https://themeforest.net/item/vuero-vuejs-3-admin-and-webapp-ui-kit/31053035" class="button v-button is-primary is-rounded raised action-button"> Buy Vuero </a><a href="https://cssninja.io" class="button chat-button"> Chat with us </a></div></div></div>', 1);
const _hoisted_4$6 = { class: "columns footer-body" };
const _hoisted_5$7 = { class: "column is-4" };
const _hoisted_6$7 = { class: "p-t-10 p-b-10" };
const _hoisted_7$8 = /* @__PURE__ */ createBaseVNode("div", { class: "footer-description p-t-10 p-b-10" }, " Vuero is built for developers and designers. It's modular approach lets you create awesome navbars with incredible layouts and elements. ", -1);
const _hoisted_8$7 = /* @__PURE__ */ createStaticVNode('<div><span class="moto"> Designed and coded with <i aria-hidden="true" class="fas fa-heart text-danger"></i> by CSS Ninja.</span><div class="social-links p-t-10 p-b-10"><a href="#"><span class="icon"><i aria-hidden="true" class="fab fa-facebook"></i></span></a><a href="#"><span class="icon"><i aria-hidden="true" class="fab fa-twitter"></i></span></a><a href="#"><span class="icon"><i aria-hidden="true" class="fab fa-linkedin"></i></span></a><a href="#"><span class="icon"><i aria-hidden="true" class="fab fa-dribbble"></i></span></a><a href="#"><span class="icon"><i aria-hidden="true" class="fab fa-github"></i></span></a></div></div>', 1);
const _hoisted_9$7 = /* @__PURE__ */ createStaticVNode('<div class="column is-6 is-offset-2"><div class="columns is-flex-tablet-p"><div class="column"><ul class="footer-column"><li class="column-header">Vuero</li><li class="column-item"><a href="#">Home</a></li><li class="column-item"><a href="#">Pricing</a></li><li class="column-item"><a href="#">Get started</a></li><li class="column-item"><a href="#">Help</a></li></ul></div><div class="column"><ul class="footer-column"><li class="column-header">Resources</li><li class="column-item"><a href="#">Learning</a></li><li class="column-item"><a href="#">Support center</a></li><li class="column-item"><a href="#">Frequent questions</a></li><li class="column-item"><a href="#">Schedule a demo</a></li></ul></div><div class="column"><ul class="footer-column"><li class="column-header">Terms</li><li class="column-item"><a href="#">Terms of Service</a></li><li class="column-item"><a href="#">Privacy policy</a></li><li class="column-item"><a href="#">SaaS services</a></li></ul></div></div></div>', 1);
const _hoisted_10$7 = /* @__PURE__ */ createBaseVNode("div", { class: "footer-copyright has-text-centered" }, [
  /* @__PURE__ */ createBaseVNode("p", null, [
    /* @__PURE__ */ createBaseVNode("span", {
      role: "img",
      "aria-label": "copyright"
    }, "\xA9"),
    /* @__PURE__ */ createTextVNode(" 2020-2021 | "),
    /* @__PURE__ */ createBaseVNode("a", { href: "https://cssninja.io" }, "cssninjaStudio"),
    /* @__PURE__ */ createTextVNode(" | All Rights Reserved. ")
  ])
], -1);
function _sfc_render$5(_ctx, _cache) {
  const _component_AnimatedLogo = __unplugin_components_0;
  return openBlock(), createElementBlock("footer", _hoisted_1$a, [
    createBaseVNode("div", _hoisted_2$a, [
      _hoisted_3$a,
      createBaseVNode("div", _hoisted_4$6, [
        createBaseVNode("div", _hoisted_5$7, [
          createBaseVNode("div", _hoisted_6$7, [
            createVNode(_component_AnimatedLogo, {
              width: "36px",
              height: "36px"
            }),
            _hoisted_7$8
          ]),
          _hoisted_8$7
        ]),
        _hoisted_9$7
      ]),
      _hoisted_10$7
    ])
  ]);
}
var __unplugin_components_7 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$5]]);
function _defineProperty$1(e2, t2, i2) {
  return t2 in e2 ? Object.defineProperty(e2, t2, { value: i2, enumerable: true, configurable: true, writable: true }) : e2[t2] = i2, e2;
}
function _classCallCheck$1(e2, t2) {
  if (!(e2 instanceof t2))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$1(e2, t2) {
  for (var i2 = 0; i2 < t2.length; i2++) {
    var s2 = t2[i2];
    s2.enumerable = s2.enumerable || false, s2.configurable = true, "value" in s2 && (s2.writable = true), Object.defineProperty(e2, s2.key, s2);
  }
}
function _createClass$1(e2, t2, i2) {
  return t2 && _defineProperties$1(e2.prototype, t2), i2 && _defineProperties$1(e2, i2), e2;
}
function _defineProperty$2(e2, t2, i2) {
  return t2 in e2 ? Object.defineProperty(e2, t2, { value: i2, enumerable: true, configurable: true, writable: true }) : e2[t2] = i2, e2;
}
function ownKeys$1(e2, t2) {
  var i2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var s2 = Object.getOwnPropertySymbols(e2);
    t2 && (s2 = s2.filter(function(t3) {
      return Object.getOwnPropertyDescriptor(e2, t3).enumerable;
    })), i2.push.apply(i2, s2);
  }
  return i2;
}
function _objectSpread2(e2) {
  for (var t2 = 1; t2 < arguments.length; t2++) {
    var i2 = arguments[t2] != null ? arguments[t2] : {};
    t2 % 2 ? ownKeys$1(Object(i2), true).forEach(function(t3) {
      _defineProperty$2(e2, t3, i2[t3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(i2)) : ownKeys$1(Object(i2)).forEach(function(t3) {
      Object.defineProperty(e2, t3, Object.getOwnPropertyDescriptor(i2, t3));
    });
  }
  return e2;
}
var defaults$1$1 = { addCSS: true, thumbWidth: 15, watch: true };
function matches$1(e2, t2) {
  return function() {
    return Array.from(document.querySelectorAll(t2)).includes(this);
  }.call(e2, t2);
}
function trigger(e2, t2) {
  if (e2 && t2) {
    var i2 = new Event(t2, { bubbles: true });
    e2.dispatchEvent(i2);
  }
}
var getConstructor$1 = function(e2) {
  return e2 != null ? e2.constructor : null;
}, instanceOf$1 = function(e2, t2) {
  return !!(e2 && t2 && e2 instanceof t2);
}, isNullOrUndefined$1 = function(e2) {
  return e2 == null;
}, isObject$1$1 = function(e2) {
  return getConstructor$1(e2) === Object;
}, isNumber$1$1 = function(e2) {
  return getConstructor$1(e2) === Number && !Number.isNaN(e2);
}, isString$1$1 = function(e2) {
  return getConstructor$1(e2) === String;
}, isBoolean$1 = function(e2) {
  return getConstructor$1(e2) === Boolean;
}, isFunction$1$1 = function(e2) {
  return getConstructor$1(e2) === Function;
}, isArray$1$1 = function(e2) {
  return Array.isArray(e2);
}, isNodeList$1 = function(e2) {
  return instanceOf$1(e2, NodeList);
}, isElement$1 = function(e2) {
  return instanceOf$1(e2, Element);
}, isEvent$1 = function(e2) {
  return instanceOf$1(e2, Event);
}, isEmpty$1 = function(e2) {
  return isNullOrUndefined$1(e2) || (isString$1$1(e2) || isArray$1$1(e2) || isNodeList$1(e2)) && !e2.length || isObject$1$1(e2) && !Object.keys(e2).length;
}, is$1 = { nullOrUndefined: isNullOrUndefined$1, object: isObject$1$1, number: isNumber$1$1, string: isString$1$1, boolean: isBoolean$1, function: isFunction$1$1, array: isArray$1$1, nodeList: isNodeList$1, element: isElement$1, event: isEvent$1, empty: isEmpty$1 };
function getDecimalPlaces(e2) {
  var t2 = "".concat(e2).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  return t2 ? Math.max(0, (t2[1] ? t2[1].length : 0) - (t2[2] ? +t2[2] : 0)) : 0;
}
function round(e2, t2) {
  if (1 > t2) {
    var i2 = getDecimalPlaces(t2);
    return parseFloat(e2.toFixed(i2));
  }
  return Math.round(e2 / t2) * t2;
}
var RangeTouch = function() {
  function e2(t2, i2) {
    _classCallCheck$1(this, e2), is$1.element(t2) ? this.element = t2 : is$1.string(t2) && (this.element = document.querySelector(t2)), is$1.element(this.element) && is$1.empty(this.element.rangeTouch) && (this.config = _objectSpread2({}, defaults$1$1, {}, i2), this.init());
  }
  return _createClass$1(e2, [{ key: "init", value: function() {
    e2.enabled && (this.config.addCSS && (this.element.style.userSelect = "none", this.element.style.webKitUserSelect = "none", this.element.style.touchAction = "manipulation"), this.listeners(true), this.element.rangeTouch = this);
  } }, { key: "destroy", value: function() {
    e2.enabled && (this.config.addCSS && (this.element.style.userSelect = "", this.element.style.webKitUserSelect = "", this.element.style.touchAction = ""), this.listeners(false), this.element.rangeTouch = null);
  } }, { key: "listeners", value: function(e3) {
    var t2 = this, i2 = e3 ? "addEventListener" : "removeEventListener";
    ["touchstart", "touchmove", "touchend"].forEach(function(e4) {
      t2.element[i2](e4, function(e5) {
        return t2.set(e5);
      }, false);
    });
  } }, { key: "get", value: function(t2) {
    if (!e2.enabled || !is$1.event(t2))
      return null;
    var i2, s2 = t2.target, n2 = t2.changedTouches[0], r2 = parseFloat(s2.getAttribute("min")) || 0, a2 = parseFloat(s2.getAttribute("max")) || 100, o2 = parseFloat(s2.getAttribute("step")) || 1, l = s2.getBoundingClientRect(), c2 = 100 / l.width * (this.config.thumbWidth / 2) / 100;
    return 0 > (i2 = 100 / l.width * (n2.clientX - l.left)) ? i2 = 0 : 100 < i2 && (i2 = 100), 50 > i2 ? i2 -= (100 - 2 * i2) * c2 : 50 < i2 && (i2 += 2 * (i2 - 50) * c2), r2 + round(i2 / 100 * (a2 - r2), o2);
  } }, { key: "set", value: function(t2) {
    e2.enabled && is$1.event(t2) && !t2.target.disabled && (t2.preventDefault(), t2.target.value = this.get(t2), trigger(t2.target, t2.type === "touchend" ? "change" : "input"));
  } }], [{ key: "setup", value: function(t2) {
    var i2 = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : {}, s2 = null;
    if (is$1.empty(t2) || is$1.string(t2) ? s2 = Array.from(document.querySelectorAll(is$1.string(t2) ? t2 : 'input[type="range"]')) : is$1.element(t2) ? s2 = [t2] : is$1.nodeList(t2) ? s2 = Array.from(t2) : is$1.array(t2) && (s2 = t2.filter(is$1.element)), is$1.empty(s2))
      return null;
    var n2 = _objectSpread2({}, defaults$1$1, {}, i2);
    if (is$1.string(t2) && n2.watch) {
      var r2 = new MutationObserver(function(i3) {
        Array.from(i3).forEach(function(i4) {
          Array.from(i4.addedNodes).forEach(function(i5) {
            is$1.element(i5) && matches$1(i5, t2) && new e2(i5, n2);
          });
        });
      });
      r2.observe(document.body, { childList: true, subtree: true });
    }
    return s2.map(function(t3) {
      return new e2(t3, i2);
    });
  } }, { key: "enabled", get: function() {
    return "ontouchstart" in document.documentElement;
  } }]), e2;
}();
const getConstructor = (e2) => e2 != null ? e2.constructor : null, instanceOf = (e2, t2) => Boolean(e2 && t2 && e2 instanceof t2), isNullOrUndefined = (e2) => e2 == null, isObject$3 = (e2) => getConstructor(e2) === Object, isNumber$2 = (e2) => getConstructor(e2) === Number && !Number.isNaN(e2), isString$3 = (e2) => getConstructor(e2) === String, isBoolean$2 = (e2) => getConstructor(e2) === Boolean, isFunction$2 = (e2) => getConstructor(e2) === Function, isArray$2 = (e2) => Array.isArray(e2), isWeakMap = (e2) => instanceOf(e2, WeakMap), isNodeList = (e2) => instanceOf(e2, NodeList), isTextNode = (e2) => getConstructor(e2) === Text, isEvent = (e2) => instanceOf(e2, Event), isKeyboardEvent = (e2) => instanceOf(e2, KeyboardEvent), isCue = (e2) => instanceOf(e2, window.TextTrackCue) || instanceOf(e2, window.VTTCue), isTrack = (e2) => instanceOf(e2, TextTrack) || !isNullOrUndefined(e2) && isString$3(e2.kind), isPromise = (e2) => instanceOf(e2, Promise) && isFunction$2(e2.then), isElement = (e2) => e2 !== null && typeof e2 == "object" && e2.nodeType === 1 && typeof e2.style == "object" && typeof e2.ownerDocument == "object", isEmpty = (e2) => isNullOrUndefined(e2) || (isString$3(e2) || isArray$2(e2) || isNodeList(e2)) && !e2.length || isObject$3(e2) && !Object.keys(e2).length, isUrl = (e2) => {
  if (instanceOf(e2, window.URL))
    return true;
  if (!isString$3(e2))
    return false;
  let t2 = e2;
  e2.startsWith("http://") && e2.startsWith("https://") || (t2 = `http://${e2}`);
  try {
    return !isEmpty(new URL(t2).hostname);
  } catch (e3) {
    return false;
  }
};
var is = { nullOrUndefined: isNullOrUndefined, object: isObject$3, number: isNumber$2, string: isString$3, boolean: isBoolean$2, function: isFunction$2, array: isArray$2, weakMap: isWeakMap, nodeList: isNodeList, element: isElement, textNode: isTextNode, event: isEvent, keyboardEvent: isKeyboardEvent, cue: isCue, track: isTrack, promise: isPromise, url: isUrl, empty: isEmpty };
const transitionEndEvent = (() => {
  const e2 = document.createElement("span"), t2 = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend" }, i2 = Object.keys(t2).find((t3) => e2.style[t3] !== void 0);
  return !!is.string(i2) && t2[i2];
})();
function repaint(e2, t2) {
  setTimeout(() => {
    try {
      e2.hidden = true, e2.offsetHeight, e2.hidden = false;
    } catch (e3) {
    }
  }, t2);
}
const browser = { isIE: Boolean(window.document.documentMode), isEdge: window.navigator.userAgent.includes("Edge"), isWebkit: "WebkitAppearance" in document.documentElement.style && !/Edge/.test(navigator.userAgent), isIPhone: /(iPhone|iPod)/gi.test(navigator.platform), isIos: navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 || /(iPad|iPhone|iPod)/gi.test(navigator.platform) };
function cloneDeep(e2) {
  return JSON.parse(JSON.stringify(e2));
}
function getDeep(e2, t2) {
  return t2.split(".").reduce((e3, t3) => e3 && e3[t3], e2);
}
function extend$1(e2 = {}, ...t2) {
  if (!t2.length)
    return e2;
  const i2 = t2.shift();
  return is.object(i2) ? (Object.keys(i2).forEach((t3) => {
    is.object(i2[t3]) ? (Object.keys(e2).includes(t3) || Object.assign(e2, { [t3]: {} }), extend$1(e2[t3], i2[t3])) : Object.assign(e2, { [t3]: i2[t3] });
  }), extend$1(e2, ...t2)) : e2;
}
function wrap(e2, t2) {
  const i2 = e2.length ? e2 : [e2];
  Array.from(i2).reverse().forEach((e3, i3) => {
    const s2 = i3 > 0 ? t2.cloneNode(true) : t2, n2 = e3.parentNode, r2 = e3.nextSibling;
    s2.appendChild(e3), r2 ? n2.insertBefore(s2, r2) : n2.appendChild(s2);
  });
}
function setAttributes(e2, t2) {
  is.element(e2) && !is.empty(t2) && Object.entries(t2).filter(([, e3]) => !is.nullOrUndefined(e3)).forEach(([t3, i2]) => e2.setAttribute(t3, i2));
}
function createElement(e2, t2, i2) {
  const s2 = document.createElement(e2);
  return is.object(t2) && setAttributes(s2, t2), is.string(i2) && (s2.innerText = i2), s2;
}
function insertAfter(e2, t2) {
  is.element(e2) && is.element(t2) && t2.parentNode.insertBefore(e2, t2.nextSibling);
}
function insertElement(e2, t2, i2, s2) {
  is.element(t2) && t2.appendChild(createElement(e2, i2, s2));
}
function removeElement(e2) {
  is.nodeList(e2) || is.array(e2) ? Array.from(e2).forEach(removeElement) : is.element(e2) && is.element(e2.parentNode) && e2.parentNode.removeChild(e2);
}
function emptyElement(e2) {
  if (!is.element(e2))
    return;
  let { length: t2 } = e2.childNodes;
  for (; t2 > 0; )
    e2.removeChild(e2.lastChild), t2 -= 1;
}
function replaceElement(e2, t2) {
  return is.element(t2) && is.element(t2.parentNode) && is.element(e2) ? (t2.parentNode.replaceChild(e2, t2), e2) : null;
}
function getAttributesFromSelector(e2, t2) {
  if (!is.string(e2) || is.empty(e2))
    return {};
  const i2 = {}, s2 = extend$1({}, t2);
  return e2.split(",").forEach((e3) => {
    const t3 = e3.trim(), n2 = t3.replace(".", ""), r2 = t3.replace(/[[\]]/g, "").split("="), [a2] = r2, o2 = r2.length > 1 ? r2[1].replace(/["']/g, "") : "";
    switch (t3.charAt(0)) {
      case ".":
        is.string(s2.class) ? i2.class = `${s2.class} ${n2}` : i2.class = n2;
        break;
      case "#":
        i2.id = t3.replace("#", "");
        break;
      case "[":
        i2[a2] = o2;
    }
  }), extend$1(s2, i2);
}
function toggleHidden(e2, t2) {
  if (!is.element(e2))
    return;
  let i2 = t2;
  is.boolean(i2) || (i2 = !e2.hidden), e2.hidden = i2;
}
function toggleClass(e2, t2, i2) {
  if (is.nodeList(e2))
    return Array.from(e2).map((e3) => toggleClass(e3, t2, i2));
  if (is.element(e2)) {
    let s2 = "toggle";
    return i2 !== void 0 && (s2 = i2 ? "add" : "remove"), e2.classList[s2](t2), e2.classList.contains(t2);
  }
  return false;
}
function hasClass(e2, t2) {
  return is.element(e2) && e2.classList.contains(t2);
}
function matches(e2, t2) {
  const { prototype: i2 } = Element;
  return (i2.matches || i2.webkitMatchesSelector || i2.mozMatchesSelector || i2.msMatchesSelector || function() {
    return Array.from(document.querySelectorAll(t2)).includes(this);
  }).call(e2, t2);
}
function closest$1(e2, t2) {
  const { prototype: i2 } = Element;
  return (i2.closest || function() {
    let e3 = this;
    do {
      if (matches.matches(e3, t2))
        return e3;
      e3 = e3.parentElement || e3.parentNode;
    } while (e3 !== null && e3.nodeType === 1);
    return null;
  }).call(e2, t2);
}
function getElements(e2) {
  return this.elements.container.querySelectorAll(e2);
}
function getElement(e2) {
  return this.elements.container.querySelector(e2);
}
function setFocus(e2 = null, t2 = false) {
  is.element(e2) && (e2.focus({ preventScroll: true }), t2 && toggleClass(e2, this.config.classNames.tabFocus));
}
const defaultCodecs = { "audio/ogg": "vorbis", "audio/wav": "1", "video/webm": "vp8, vorbis", "video/mp4": "avc1.42E01E, mp4a.40.2", "video/ogg": "theora" }, support = { audio: "canPlayType" in document.createElement("audio"), video: "canPlayType" in document.createElement("video"), check(e2, t2, i2) {
  const s2 = browser.isIPhone && i2 && support.playsinline, n2 = support[e2] || t2 !== "html5";
  return { api: n2, ui: n2 && support.rangeInput && (e2 !== "video" || !browser.isIPhone || s2) };
}, pip: !(browser.isIPhone || !is.function(createElement("video").webkitSetPresentationMode) && (!document.pictureInPictureEnabled || createElement("video").disablePictureInPicture)), airplay: is.function(window.WebKitPlaybackTargetAvailabilityEvent), playsinline: "playsInline" in document.createElement("video"), mime(e2) {
  if (is.empty(e2))
    return false;
  const [t2] = e2.split("/");
  let i2 = e2;
  if (!this.isHTML5 || t2 !== this.type)
    return false;
  Object.keys(defaultCodecs).includes(i2) && (i2 += `; codecs="${defaultCodecs[e2]}"`);
  try {
    return Boolean(i2 && this.media.canPlayType(i2).replace(/no/, ""));
  } catch (e3) {
    return false;
  }
}, textTracks: "textTracks" in document.createElement("video"), rangeInput: (() => {
  const e2 = document.createElement("input");
  return e2.type = "range", e2.type === "range";
})(), touch: "ontouchstart" in document.documentElement, transitions: transitionEndEvent !== false, reducedMotion: "matchMedia" in window && window.matchMedia("(prefers-reduced-motion)").matches }, supportsPassiveListeners = (() => {
  let e2 = false;
  try {
    const t2 = Object.defineProperty({}, "passive", { get: () => (e2 = true, null) });
    window.addEventListener("test", null, t2), window.removeEventListener("test", null, t2);
  } catch (e3) {
  }
  return e2;
})();
function toggleListener(e2, t2, i2, s2 = false, n2 = true, r2 = false) {
  if (!e2 || !("addEventListener" in e2) || is.empty(t2) || !is.function(i2))
    return;
  const a2 = t2.split(" ");
  let o2 = r2;
  supportsPassiveListeners && (o2 = { passive: n2, capture: r2 }), a2.forEach((t3) => {
    this && this.eventListeners && s2 && this.eventListeners.push({ element: e2, type: t3, callback: i2, options: o2 }), e2[s2 ? "addEventListener" : "removeEventListener"](t3, i2, o2);
  });
}
function on(e2, t2 = "", i2, s2 = true, n2 = false) {
  toggleListener.call(this, e2, t2, i2, true, s2, n2);
}
function off(e2, t2 = "", i2, s2 = true, n2 = false) {
  toggleListener.call(this, e2, t2, i2, false, s2, n2);
}
function once(e2, t2 = "", i2, s2 = true, n2 = false) {
  const r2 = (...a2) => {
    off(e2, t2, r2, s2, n2), i2.apply(this, a2);
  };
  toggleListener.call(this, e2, t2, r2, true, s2, n2);
}
function triggerEvent(e2, t2 = "", i2 = false, s2 = {}) {
  if (!is.element(e2) || is.empty(t2))
    return;
  const n2 = new CustomEvent(t2, { bubbles: i2, detail: __spreadProps(__spreadValues({}, s2), { plyr: this }) });
  e2.dispatchEvent(n2);
}
function unbindListeners() {
  this && this.eventListeners && (this.eventListeners.forEach((e2) => {
    const { element: t2, type: i2, callback: s2, options: n2 } = e2;
    t2.removeEventListener(i2, s2, n2);
  }), this.eventListeners = []);
}
function ready() {
  return new Promise((e2) => this.ready ? setTimeout(e2, 0) : on.call(this, this.elements.container, "ready", e2)).then(() => {
  });
}
function silencePromise(e2) {
  is.promise(e2) && e2.then(null, () => {
  });
}
function dedupe(e2) {
  return is.array(e2) ? e2.filter((t2, i2) => e2.indexOf(t2) === i2) : e2;
}
function closest(e2, t2) {
  return is.array(e2) && e2.length ? e2.reduce((e3, i2) => Math.abs(i2 - t2) < Math.abs(e3 - t2) ? i2 : e3) : null;
}
function supportsCSS(e2) {
  return !(!window || !window.CSS) && window.CSS.supports(e2);
}
const standardRatios = [[1, 1], [4, 3], [3, 4], [5, 4], [4, 5], [3, 2], [2, 3], [16, 10], [10, 16], [16, 9], [9, 16], [21, 9], [9, 21], [32, 9], [9, 32]].reduce((e2, [t2, i2]) => __spreadProps(__spreadValues({}, e2), { [t2 / i2]: [t2, i2] }), {});
function validateAspectRatio(e2) {
  if (!(is.array(e2) || is.string(e2) && e2.includes(":")))
    return false;
  return (is.array(e2) ? e2 : e2.split(":")).map(Number).every(is.number);
}
function reduceAspectRatio(e2) {
  if (!is.array(e2) || !e2.every(is.number))
    return null;
  const [t2, i2] = e2, s2 = (e3, t3) => t3 === 0 ? e3 : s2(t3, e3 % t3), n2 = s2(t2, i2);
  return [t2 / n2, i2 / n2];
}
function getAspectRatio(e2) {
  const t2 = (e3) => validateAspectRatio(e3) ? e3.split(":").map(Number) : null;
  let i2 = t2(e2);
  if (i2 === null && (i2 = t2(this.config.ratio)), i2 === null && !is.empty(this.embed) && is.array(this.embed.ratio) && ({ ratio: i2 } = this.embed), i2 === null && this.isHTML5) {
    const { videoWidth: e3, videoHeight: t3 } = this.media;
    i2 = [e3, t3];
  }
  return reduceAspectRatio(i2);
}
function setAspectRatio(e2) {
  if (!this.isVideo)
    return {};
  const { wrapper: t2 } = this.elements, i2 = getAspectRatio.call(this, e2);
  if (!is.array(i2))
    return {};
  const [s2, n2] = reduceAspectRatio(i2), r2 = 100 / s2 * n2;
  if (supportsCSS(`aspect-ratio: ${s2}/${n2}`) ? t2.style.aspectRatio = `${s2}/${n2}` : t2.style.paddingBottom = `${r2}%`, this.isVimeo && !this.config.vimeo.premium && this.supported.ui) {
    const e3 = 100 / this.media.offsetWidth * parseInt(window.getComputedStyle(this.media).paddingBottom, 10), i3 = (e3 - r2) / (e3 / 50);
    this.fullscreen.active ? t2.style.paddingBottom = null : this.media.style.transform = `translateY(-${i3}%)`;
  } else
    this.isHTML5 && t2.classList.add(this.config.classNames.videoFixedRatio);
  return { padding: r2, ratio: i2 };
}
function roundAspectRatio(e2, t2, i2 = 0.05) {
  const s2 = e2 / t2, n2 = closest(Object.keys(standardRatios), s2);
  return Math.abs(n2 - s2) <= i2 ? standardRatios[n2] : [e2, t2];
}
function getViewportSize() {
  return [Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0), Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)];
}
const html5 = { getSources() {
  if (!this.isHTML5)
    return [];
  return Array.from(this.media.querySelectorAll("source")).filter((e2) => {
    const t2 = e2.getAttribute("type");
    return !!is.empty(t2) || support.mime.call(this, t2);
  });
}, getQualityOptions() {
  return this.config.quality.forced ? this.config.quality.options : html5.getSources.call(this).map((e2) => Number(e2.getAttribute("size"))).filter(Boolean);
}, setup() {
  if (!this.isHTML5)
    return;
  const e2 = this;
  e2.options.speed = e2.config.speed.options, is.empty(this.config.ratio) || setAspectRatio.call(e2), Object.defineProperty(e2.media, "quality", { get() {
    const t2 = html5.getSources.call(e2).find((t3) => t3.getAttribute("src") === e2.source);
    return t2 && Number(t2.getAttribute("size"));
  }, set(t2) {
    if (e2.quality !== t2) {
      if (e2.config.quality.forced && is.function(e2.config.quality.onChange))
        e2.config.quality.onChange(t2);
      else {
        const i2 = html5.getSources.call(e2).find((e3) => Number(e3.getAttribute("size")) === t2);
        if (!i2)
          return;
        const { currentTime: s2, paused: n2, preload: r2, readyState: a2, playbackRate: o2 } = e2.media;
        e2.media.src = i2.getAttribute("src"), (r2 !== "none" || a2) && (e2.once("loadedmetadata", () => {
          e2.speed = o2, e2.currentTime = s2, n2 || silencePromise(e2.play());
        }), e2.media.load());
      }
      triggerEvent.call(e2, e2.media, "qualitychange", false, { quality: t2 });
    }
  } });
}, cancelRequests() {
  this.isHTML5 && (removeElement(html5.getSources.call(this)), this.media.setAttribute("src", this.config.blankVideo), this.media.load(), this.debug.log("Cancelled network requests"));
} };
function generateId(e2) {
  return `${e2}-${Math.floor(1e4 * Math.random())}`;
}
function format(e2, ...t2) {
  return is.empty(e2) ? e2 : e2.toString().replace(/{(\d+)}/g, (e3, i2) => t2[i2].toString());
}
function getPercentage(e2, t2) {
  return e2 === 0 || t2 === 0 || Number.isNaN(e2) || Number.isNaN(t2) ? 0 : (e2 / t2 * 100).toFixed(2);
}
const replaceAll = (e2 = "", t2 = "", i2 = "") => e2.replace(new RegExp(t2.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1"), "g"), i2.toString()), toTitleCase = (e2 = "") => e2.toString().replace(/\w\S*/g, (e3) => e3.charAt(0).toUpperCase() + e3.slice(1).toLowerCase());
function toPascalCase(e2 = "") {
  let t2 = e2.toString();
  return t2 = replaceAll(t2, "-", " "), t2 = replaceAll(t2, "_", " "), t2 = toTitleCase(t2), replaceAll(t2, " ", "");
}
function toCamelCase(e2 = "") {
  let t2 = e2.toString();
  return t2 = toPascalCase(t2), t2.charAt(0).toLowerCase() + t2.slice(1);
}
function stripHTML(e2) {
  const t2 = document.createDocumentFragment(), i2 = document.createElement("div");
  return t2.appendChild(i2), i2.innerHTML = e2, t2.firstChild.innerText;
}
function getHTML(e2) {
  const t2 = document.createElement("div");
  return t2.appendChild(e2), t2.innerHTML;
}
const resources = { pip: "PIP", airplay: "AirPlay", html5: "HTML5", vimeo: "Vimeo", youtube: "YouTube" }, i18n = { get(e2 = "", t2 = {}) {
  if (is.empty(e2) || is.empty(t2))
    return "";
  let i2 = getDeep(t2.i18n, e2);
  if (is.empty(i2))
    return Object.keys(resources).includes(e2) ? resources[e2] : "";
  const s2 = { "{seektime}": t2.seekTime, "{title}": t2.title };
  return Object.entries(s2).forEach(([e3, t3]) => {
    i2 = replaceAll(i2, e3, t3);
  }), i2;
} };
class Storage {
  constructor(e2) {
    _defineProperty$1(this, "get", (e3) => {
      if (!Storage.supported || !this.enabled)
        return null;
      const t2 = window.localStorage.getItem(this.key);
      if (is.empty(t2))
        return null;
      const i2 = JSON.parse(t2);
      return is.string(e3) && e3.length ? i2[e3] : i2;
    }), _defineProperty$1(this, "set", (e3) => {
      if (!Storage.supported || !this.enabled)
        return;
      if (!is.object(e3))
        return;
      let t2 = this.get();
      is.empty(t2) && (t2 = {}), extend$1(t2, e3);
      try {
        window.localStorage.setItem(this.key, JSON.stringify(t2));
      } catch (e4) {
      }
    }), this.enabled = e2.config.storage.enabled, this.key = e2.config.storage.key;
  }
  static get supported() {
    try {
      if (!("localStorage" in window))
        return false;
      const e2 = "___test";
      return window.localStorage.setItem(e2, e2), window.localStorage.removeItem(e2), true;
    } catch (e2) {
      return false;
    }
  }
}
function fetch$1(e2, t2 = "text") {
  return new Promise((i2, s2) => {
    try {
      const s3 = new XMLHttpRequest();
      if (!("withCredentials" in s3))
        return;
      s3.addEventListener("load", () => {
        if (t2 === "text")
          try {
            i2(JSON.parse(s3.responseText));
          } catch (e3) {
            i2(s3.responseText);
          }
        else
          i2(s3.response);
      }), s3.addEventListener("error", () => {
        throw new Error(s3.status);
      }), s3.open("GET", e2, true), s3.responseType = t2, s3.send();
    } catch (e3) {
      s2(e3);
    }
  });
}
function loadSprite(e2, t2) {
  if (!is.string(e2))
    return;
  const i2 = is.string(t2);
  let s2 = false;
  const n2 = () => document.getElementById(t2) !== null, r2 = (e3, t3) => {
    e3.innerHTML = t3, i2 && n2() || document.body.insertAdjacentElement("afterbegin", e3);
  };
  if (!i2 || !n2()) {
    const n3 = Storage.supported, a2 = document.createElement("div");
    if (a2.setAttribute("hidden", ""), i2 && a2.setAttribute("id", t2), n3) {
      const e3 = window.localStorage.getItem(`cache-${t2}`);
      if (s2 = e3 !== null, s2) {
        const t3 = JSON.parse(e3);
        r2(a2, t3.content);
      }
    }
    fetch$1(e2).then((e3) => {
      if (!is.empty(e3)) {
        if (n3)
          try {
            window.localStorage.setItem(`cache-${t2}`, JSON.stringify({ content: e3 }));
          } catch (e4) {
          }
        r2(a2, e3);
      }
    }).catch(() => {
    });
  }
}
const getHours = (e2) => Math.trunc(e2 / 60 / 60 % 60, 10), getSeconds = (e2) => Math.trunc(e2 % 60, 10);
function formatTime(e2 = 0, t2 = false, i2 = false) {
  if (!is.number(e2))
    return formatTime(void 0, t2, i2);
  const s2 = (e3) => `0${e3}`.slice(-2);
  let n2 = getHours(e2);
  const r2 = (a2 = e2, Math.trunc(a2 / 60 % 60, 10));
  var a2;
  const o2 = getSeconds(e2);
  return n2 = t2 || n2 > 0 ? `${n2}:` : "", `${i2 && e2 > 0 ? "-" : ""}${n2}${s2(r2)}:${s2(o2)}`;
}
const controls = { getIconUrl() {
  const e2 = new URL(this.config.iconUrl, window.location), t2 = window.location.host ? window.location.host : window.top.location.host, i2 = e2.host !== t2 || browser.isIE && !window.svg4everybody;
  return { url: this.config.iconUrl, cors: i2 };
}, findElements() {
  try {
    return this.elements.controls = getElement.call(this, this.config.selectors.controls.wrapper), this.elements.buttons = { play: getElements.call(this, this.config.selectors.buttons.play), pause: getElement.call(this, this.config.selectors.buttons.pause), restart: getElement.call(this, this.config.selectors.buttons.restart), rewind: getElement.call(this, this.config.selectors.buttons.rewind), fastForward: getElement.call(this, this.config.selectors.buttons.fastForward), mute: getElement.call(this, this.config.selectors.buttons.mute), pip: getElement.call(this, this.config.selectors.buttons.pip), airplay: getElement.call(this, this.config.selectors.buttons.airplay), settings: getElement.call(this, this.config.selectors.buttons.settings), captions: getElement.call(this, this.config.selectors.buttons.captions), fullscreen: getElement.call(this, this.config.selectors.buttons.fullscreen) }, this.elements.progress = getElement.call(this, this.config.selectors.progress), this.elements.inputs = { seek: getElement.call(this, this.config.selectors.inputs.seek), volume: getElement.call(this, this.config.selectors.inputs.volume) }, this.elements.display = { buffer: getElement.call(this, this.config.selectors.display.buffer), currentTime: getElement.call(this, this.config.selectors.display.currentTime), duration: getElement.call(this, this.config.selectors.display.duration) }, is.element(this.elements.progress) && (this.elements.display.seekTooltip = this.elements.progress.querySelector(`.${this.config.classNames.tooltip}`)), true;
  } catch (e2) {
    return this.debug.warn("It looks like there is a problem with your custom controls HTML", e2), this.toggleNativeControls(true), false;
  }
}, createIcon(e2, t2) {
  const i2 = "http://www.w3.org/2000/svg", s2 = controls.getIconUrl.call(this), n2 = `${s2.cors ? "" : s2.url}#${this.config.iconPrefix}`, r2 = document.createElementNS(i2, "svg");
  setAttributes(r2, extend$1(t2, { "aria-hidden": "true", focusable: "false" }));
  const a2 = document.createElementNS(i2, "use"), o2 = `${n2}-${e2}`;
  return "href" in a2 && a2.setAttributeNS("http://www.w3.org/1999/xlink", "href", o2), a2.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", o2), r2.appendChild(a2), r2;
}, createLabel(e2, t2 = {}) {
  const i2 = i18n.get(e2, this.config);
  return createElement("span", __spreadProps(__spreadValues({}, t2), { class: [t2.class, this.config.classNames.hidden].filter(Boolean).join(" ") }), i2);
}, createBadge(e2) {
  if (is.empty(e2))
    return null;
  const t2 = createElement("span", { class: this.config.classNames.menu.value });
  return t2.appendChild(createElement("span", { class: this.config.classNames.menu.badge }, e2)), t2;
}, createButton(e2, t2) {
  const i2 = extend$1({}, t2);
  let s2 = toCamelCase(e2);
  const n2 = { element: "button", toggle: false, label: null, icon: null, labelPressed: null, iconPressed: null };
  switch (["element", "icon", "label"].forEach((e3) => {
    Object.keys(i2).includes(e3) && (n2[e3] = i2[e3], delete i2[e3]);
  }), n2.element !== "button" || Object.keys(i2).includes("type") || (i2.type = "button"), Object.keys(i2).includes("class") ? i2.class.split(" ").some((e3) => e3 === this.config.classNames.control) || extend$1(i2, { class: `${i2.class} ${this.config.classNames.control}` }) : i2.class = this.config.classNames.control, e2) {
    case "play":
      n2.toggle = true, n2.label = "play", n2.labelPressed = "pause", n2.icon = "play", n2.iconPressed = "pause";
      break;
    case "mute":
      n2.toggle = true, n2.label = "mute", n2.labelPressed = "unmute", n2.icon = "volume", n2.iconPressed = "muted";
      break;
    case "captions":
      n2.toggle = true, n2.label = "enableCaptions", n2.labelPressed = "disableCaptions", n2.icon = "captions-off", n2.iconPressed = "captions-on";
      break;
    case "fullscreen":
      n2.toggle = true, n2.label = "enterFullscreen", n2.labelPressed = "exitFullscreen", n2.icon = "enter-fullscreen", n2.iconPressed = "exit-fullscreen";
      break;
    case "play-large":
      i2.class += ` ${this.config.classNames.control}--overlaid`, s2 = "play", n2.label = "play", n2.icon = "play";
      break;
    default:
      is.empty(n2.label) && (n2.label = s2), is.empty(n2.icon) && (n2.icon = e2);
  }
  const r2 = createElement(n2.element);
  return n2.toggle ? (r2.appendChild(controls.createIcon.call(this, n2.iconPressed, { class: "icon--pressed" })), r2.appendChild(controls.createIcon.call(this, n2.icon, { class: "icon--not-pressed" })), r2.appendChild(controls.createLabel.call(this, n2.labelPressed, { class: "label--pressed" })), r2.appendChild(controls.createLabel.call(this, n2.label, { class: "label--not-pressed" }))) : (r2.appendChild(controls.createIcon.call(this, n2.icon)), r2.appendChild(controls.createLabel.call(this, n2.label))), extend$1(i2, getAttributesFromSelector(this.config.selectors.buttons[s2], i2)), setAttributes(r2, i2), s2 === "play" ? (is.array(this.elements.buttons[s2]) || (this.elements.buttons[s2] = []), this.elements.buttons[s2].push(r2)) : this.elements.buttons[s2] = r2, r2;
}, createRange(e2, t2) {
  const i2 = createElement("input", extend$1(getAttributesFromSelector(this.config.selectors.inputs[e2]), { type: "range", min: 0, max: 100, step: 0.01, value: 0, autocomplete: "off", role: "slider", "aria-label": i18n.get(e2, this.config), "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 0 }, t2));
  return this.elements.inputs[e2] = i2, controls.updateRangeFill.call(this, i2), RangeTouch.setup(i2), i2;
}, createProgress(e2, t2) {
  const i2 = createElement("progress", extend$1(getAttributesFromSelector(this.config.selectors.display[e2]), { min: 0, max: 100, value: 0, role: "progressbar", "aria-hidden": true }, t2));
  if (e2 !== "volume") {
    i2.appendChild(createElement("span", null, "0"));
    const t3 = { played: "played", buffer: "buffered" }[e2], s2 = t3 ? i18n.get(t3, this.config) : "";
    i2.innerText = `% ${s2.toLowerCase()}`;
  }
  return this.elements.display[e2] = i2, i2;
}, createTime(e2, t2) {
  const i2 = getAttributesFromSelector(this.config.selectors.display[e2], t2), s2 = createElement("div", extend$1(i2, { class: `${i2.class ? i2.class : ""} ${this.config.classNames.display.time} `.trim(), "aria-label": i18n.get(e2, this.config) }), "00:00");
  return this.elements.display[e2] = s2, s2;
}, bindMenuItemShortcuts(e2, t2) {
  on.call(this, e2, "keydown keyup", (i2) => {
    if (!["Space", "ArrowUp", "ArrowDown", "ArrowRight"].includes(i2.key))
      return;
    if (i2.preventDefault(), i2.stopPropagation(), i2.type === "keydown")
      return;
    const s2 = matches(e2, '[role="menuitemradio"]');
    if (!s2 && ["Space", "ArrowRight"].includes(i2.key))
      controls.showMenuPanel.call(this, t2, true);
    else {
      let t3;
      i2.key !== "Space" && (i2.key === "ArrowDown" || s2 && i2.key === "ArrowRight" ? (t3 = e2.nextElementSibling, is.element(t3) || (t3 = e2.parentNode.firstElementChild)) : (t3 = e2.previousElementSibling, is.element(t3) || (t3 = e2.parentNode.lastElementChild)), setFocus.call(this, t3, true));
    }
  }, false), on.call(this, e2, "keyup", (e3) => {
    e3.key === "Return" && controls.focusFirstMenuItem.call(this, null, true);
  });
}, createMenuItem({ value: e2, list: t2, type: i2, title: s2, badge: n2 = null, checked: r2 = false }) {
  const a2 = getAttributesFromSelector(this.config.selectors.inputs[i2]), o2 = createElement("button", extend$1(a2, { type: "button", role: "menuitemradio", class: `${this.config.classNames.control} ${a2.class ? a2.class : ""}`.trim(), "aria-checked": r2, value: e2 })), l = createElement("span");
  l.innerHTML = s2, is.element(n2) && l.appendChild(n2), o2.appendChild(l), Object.defineProperty(o2, "checked", { enumerable: true, get: () => o2.getAttribute("aria-checked") === "true", set(e3) {
    e3 && Array.from(o2.parentNode.children).filter((e4) => matches(e4, '[role="menuitemradio"]')).forEach((e4) => e4.setAttribute("aria-checked", "false")), o2.setAttribute("aria-checked", e3 ? "true" : "false");
  } }), this.listeners.bind(o2, "click keyup", (t3) => {
    if (!is.keyboardEvent(t3) || t3.key === "Space") {
      switch (t3.preventDefault(), t3.stopPropagation(), o2.checked = true, i2) {
        case "language":
          this.currentTrack = Number(e2);
          break;
        case "quality":
          this.quality = e2;
          break;
        case "speed":
          this.speed = parseFloat(e2);
      }
      controls.showMenuPanel.call(this, "home", is.keyboardEvent(t3));
    }
  }, i2, false), controls.bindMenuItemShortcuts.call(this, o2, i2), t2.appendChild(o2);
}, formatTime(e2 = 0, t2 = false) {
  if (!is.number(e2))
    return e2;
  return formatTime(e2, getHours(this.duration) > 0, t2);
}, updateTimeDisplay(e2 = null, t2 = 0, i2 = false) {
  is.element(e2) && is.number(t2) && (e2.innerText = controls.formatTime(t2, i2));
}, updateVolume() {
  this.supported.ui && (is.element(this.elements.inputs.volume) && controls.setRange.call(this, this.elements.inputs.volume, this.muted ? 0 : this.volume), is.element(this.elements.buttons.mute) && (this.elements.buttons.mute.pressed = this.muted || this.volume === 0));
}, setRange(e2, t2 = 0) {
  is.element(e2) && (e2.value = t2, controls.updateRangeFill.call(this, e2));
}, updateProgress(e2) {
  if (!this.supported.ui || !is.event(e2))
    return;
  let t2 = 0;
  const i2 = (e3, t3) => {
    const i3 = is.number(t3) ? t3 : 0, s2 = is.element(e3) ? e3 : this.elements.display.buffer;
    if (is.element(s2)) {
      s2.value = i3;
      const e4 = s2.getElementsByTagName("span")[0];
      is.element(e4) && (e4.childNodes[0].nodeValue = i3);
    }
  };
  if (e2)
    switch (e2.type) {
      case "timeupdate":
      case "seeking":
      case "seeked":
        t2 = getPercentage(this.currentTime, this.duration), e2.type === "timeupdate" && controls.setRange.call(this, this.elements.inputs.seek, t2);
        break;
      case "playing":
      case "progress":
        i2(this.elements.display.buffer, 100 * this.buffered);
    }
}, updateRangeFill(e2) {
  const t2 = is.event(e2) ? e2.target : e2;
  if (is.element(t2) && t2.getAttribute("type") === "range") {
    if (matches(t2, this.config.selectors.inputs.seek)) {
      t2.setAttribute("aria-valuenow", this.currentTime);
      const e3 = controls.formatTime(this.currentTime), i2 = controls.formatTime(this.duration), s2 = i18n.get("seekLabel", this.config);
      t2.setAttribute("aria-valuetext", s2.replace("{currentTime}", e3).replace("{duration}", i2));
    } else if (matches(t2, this.config.selectors.inputs.volume)) {
      const e3 = 100 * t2.value;
      t2.setAttribute("aria-valuenow", e3), t2.setAttribute("aria-valuetext", `${e3.toFixed(1)}%`);
    } else
      t2.setAttribute("aria-valuenow", t2.value);
    browser.isWebkit && t2.style.setProperty("--value", t2.value / t2.max * 100 + "%");
  }
}, updateSeekTooltip(e2) {
  var t2, i2;
  if (!this.config.tooltips.seek || !is.element(this.elements.inputs.seek) || !is.element(this.elements.display.seekTooltip) || this.duration === 0)
    return;
  const s2 = this.elements.display.seekTooltip, n2 = `${this.config.classNames.tooltip}--visible`, r2 = (e3) => toggleClass(s2, n2, e3);
  if (this.touch)
    return void r2(false);
  let a2 = 0;
  const o2 = this.elements.progress.getBoundingClientRect();
  if (is.event(e2))
    a2 = 100 / o2.width * (e2.pageX - o2.left);
  else {
    if (!hasClass(s2, n2))
      return;
    a2 = parseFloat(s2.style.left, 10);
  }
  a2 < 0 ? a2 = 0 : a2 > 100 && (a2 = 100);
  const l = this.duration / 100 * a2;
  s2.innerText = controls.formatTime(l);
  const c2 = (t2 = this.config.markers) === null || t2 === void 0 || (i2 = t2.points) === null || i2 === void 0 ? void 0 : i2.find(({ time: e3 }) => e3 === Math.round(l));
  c2 && s2.insertAdjacentHTML("afterbegin", `${c2.label}<br>`), s2.style.left = `${a2}%`, is.event(e2) && ["mouseenter", "mouseleave"].includes(e2.type) && r2(e2.type === "mouseenter");
}, timeUpdate(e2) {
  const t2 = !is.element(this.elements.display.duration) && this.config.invertTime;
  controls.updateTimeDisplay.call(this, this.elements.display.currentTime, t2 ? this.duration - this.currentTime : this.currentTime, t2), e2 && e2.type === "timeupdate" && this.media.seeking || controls.updateProgress.call(this, e2);
}, durationUpdate() {
  if (!this.supported.ui || !this.config.invertTime && this.currentTime)
    return;
  if (this.duration >= 2 ** 32)
    return toggleHidden(this.elements.display.currentTime, true), void toggleHidden(this.elements.progress, true);
  is.element(this.elements.inputs.seek) && this.elements.inputs.seek.setAttribute("aria-valuemax", this.duration);
  const e2 = is.element(this.elements.display.duration);
  !e2 && this.config.displayDuration && this.paused && controls.updateTimeDisplay.call(this, this.elements.display.currentTime, this.duration), e2 && controls.updateTimeDisplay.call(this, this.elements.display.duration, this.duration), this.config.markers.enabled && controls.setMarkers.call(this), controls.updateSeekTooltip.call(this);
}, toggleMenuButton(e2, t2) {
  toggleHidden(this.elements.settings.buttons[e2], !t2);
}, updateSetting(e2, t2, i2) {
  const s2 = this.elements.settings.panels[e2];
  let n2 = null, r2 = t2;
  if (e2 === "captions")
    n2 = this.currentTrack;
  else {
    if (n2 = is.empty(i2) ? this[e2] : i2, is.empty(n2) && (n2 = this.config[e2].default), !is.empty(this.options[e2]) && !this.options[e2].includes(n2))
      return void this.debug.warn(`Unsupported value of '${n2}' for ${e2}`);
    if (!this.config[e2].options.includes(n2))
      return void this.debug.warn(`Disabled value of '${n2}' for ${e2}`);
  }
  if (is.element(r2) || (r2 = s2 && s2.querySelector('[role="menu"]')), !is.element(r2))
    return;
  this.elements.settings.buttons[e2].querySelector(`.${this.config.classNames.menu.value}`).innerHTML = controls.getLabel.call(this, e2, n2);
  const a2 = r2 && r2.querySelector(`[value="${n2}"]`);
  is.element(a2) && (a2.checked = true);
}, getLabel(e2, t2) {
  switch (e2) {
    case "speed":
      return t2 === 1 ? i18n.get("normal", this.config) : `${t2}&times;`;
    case "quality":
      if (is.number(t2)) {
        const e3 = i18n.get(`qualityLabel.${t2}`, this.config);
        return e3.length ? e3 : `${t2}p`;
      }
      return toTitleCase(t2);
    case "captions":
      return captions.getLabel.call(this);
    default:
      return null;
  }
}, setQualityMenu(e2) {
  if (!is.element(this.elements.settings.panels.quality))
    return;
  const t2 = "quality", i2 = this.elements.settings.panels.quality.querySelector('[role="menu"]');
  is.array(e2) && (this.options.quality = dedupe(e2).filter((e3) => this.config.quality.options.includes(e3)));
  const s2 = !is.empty(this.options.quality) && this.options.quality.length > 1;
  if (controls.toggleMenuButton.call(this, t2, s2), emptyElement(i2), controls.checkMenu.call(this), !s2)
    return;
  const n2 = (e3) => {
    const t3 = i18n.get(`qualityBadge.${e3}`, this.config);
    return t3.length ? controls.createBadge.call(this, t3) : null;
  };
  this.options.quality.sort((e3, t3) => {
    const i3 = this.config.quality.options;
    return i3.indexOf(e3) > i3.indexOf(t3) ? 1 : -1;
  }).forEach((e3) => {
    controls.createMenuItem.call(this, { value: e3, list: i2, type: t2, title: controls.getLabel.call(this, "quality", e3), badge: n2(e3) });
  }), controls.updateSetting.call(this, t2, i2);
}, setCaptionsMenu() {
  if (!is.element(this.elements.settings.panels.captions))
    return;
  const e2 = "captions", t2 = this.elements.settings.panels.captions.querySelector('[role="menu"]'), i2 = captions.getTracks.call(this), s2 = Boolean(i2.length);
  if (controls.toggleMenuButton.call(this, e2, s2), emptyElement(t2), controls.checkMenu.call(this), !s2)
    return;
  const n2 = i2.map((e3, i3) => ({ value: i3, checked: this.captions.toggled && this.currentTrack === i3, title: captions.getLabel.call(this, e3), badge: e3.language && controls.createBadge.call(this, e3.language.toUpperCase()), list: t2, type: "language" }));
  n2.unshift({ value: -1, checked: !this.captions.toggled, title: i18n.get("disabled", this.config), list: t2, type: "language" }), n2.forEach(controls.createMenuItem.bind(this)), controls.updateSetting.call(this, e2, t2);
}, setSpeedMenu() {
  if (!is.element(this.elements.settings.panels.speed))
    return;
  const e2 = "speed", t2 = this.elements.settings.panels.speed.querySelector('[role="menu"]');
  this.options.speed = this.options.speed.filter((e3) => e3 >= this.minimumSpeed && e3 <= this.maximumSpeed);
  const i2 = !is.empty(this.options.speed) && this.options.speed.length > 1;
  controls.toggleMenuButton.call(this, e2, i2), emptyElement(t2), controls.checkMenu.call(this), i2 && (this.options.speed.forEach((i3) => {
    controls.createMenuItem.call(this, { value: i3, list: t2, type: e2, title: controls.getLabel.call(this, "speed", i3) });
  }), controls.updateSetting.call(this, e2, t2));
}, checkMenu() {
  const { buttons: e2 } = this.elements.settings, t2 = !is.empty(e2) && Object.values(e2).some((e3) => !e3.hidden);
  toggleHidden(this.elements.settings.menu, !t2);
}, focusFirstMenuItem(e2, t2 = false) {
  if (this.elements.settings.popup.hidden)
    return;
  let i2 = e2;
  is.element(i2) || (i2 = Object.values(this.elements.settings.panels).find((e3) => !e3.hidden));
  const s2 = i2.querySelector('[role^="menuitem"]');
  setFocus.call(this, s2, t2);
}, toggleMenu(e2) {
  const { popup: t2 } = this.elements.settings, i2 = this.elements.buttons.settings;
  if (!is.element(t2) || !is.element(i2))
    return;
  const { hidden: s2 } = t2;
  let n2 = s2;
  if (is.boolean(e2))
    n2 = e2;
  else if (is.keyboardEvent(e2) && e2.key === "Escape")
    n2 = false;
  else if (is.event(e2)) {
    const s3 = is.function(e2.composedPath) ? e2.composedPath()[0] : e2.target, r2 = t2.contains(s3);
    if (r2 || !r2 && e2.target !== i2 && n2)
      return;
  }
  i2.setAttribute("aria-expanded", n2), toggleHidden(t2, !n2), toggleClass(this.elements.container, this.config.classNames.menu.open, n2), n2 && is.keyboardEvent(e2) ? controls.focusFirstMenuItem.call(this, null, true) : n2 || s2 || setFocus.call(this, i2, is.keyboardEvent(e2));
}, getMenuSize(e2) {
  const t2 = e2.cloneNode(true);
  t2.style.position = "absolute", t2.style.opacity = 0, t2.removeAttribute("hidden"), e2.parentNode.appendChild(t2);
  const i2 = t2.scrollWidth, s2 = t2.scrollHeight;
  return removeElement(t2), { width: i2, height: s2 };
}, showMenuPanel(e2 = "", t2 = false) {
  const i2 = this.elements.container.querySelector(`#plyr-settings-${this.id}-${e2}`);
  if (!is.element(i2))
    return;
  const s2 = i2.parentNode, n2 = Array.from(s2.children).find((e3) => !e3.hidden);
  if (support.transitions && !support.reducedMotion) {
    s2.style.width = `${n2.scrollWidth}px`, s2.style.height = `${n2.scrollHeight}px`;
    const e3 = controls.getMenuSize.call(this, i2), t3 = (e4) => {
      e4.target === s2 && ["width", "height"].includes(e4.propertyName) && (s2.style.width = "", s2.style.height = "", off.call(this, s2, transitionEndEvent, t3));
    };
    on.call(this, s2, transitionEndEvent, t3), s2.style.width = `${e3.width}px`, s2.style.height = `${e3.height}px`;
  }
  toggleHidden(n2, true), toggleHidden(i2, false), controls.focusFirstMenuItem.call(this, i2, t2);
}, setDownloadUrl() {
  const e2 = this.elements.buttons.download;
  is.element(e2) && e2.setAttribute("href", this.download);
}, create(e2) {
  const { bindMenuItemShortcuts: t2, createButton: i2, createProgress: s2, createRange: n2, createTime: r2, setQualityMenu: a2, setSpeedMenu: o2, showMenuPanel: l } = controls;
  this.elements.controls = null, is.array(this.config.controls) && this.config.controls.includes("play-large") && this.elements.container.appendChild(i2.call(this, "play-large"));
  const c2 = createElement("div", getAttributesFromSelector(this.config.selectors.controls.wrapper));
  this.elements.controls = c2;
  const u2 = { class: "plyr__controls__item" };
  return dedupe(is.array(this.config.controls) ? this.config.controls : []).forEach((a3) => {
    if (a3 === "restart" && c2.appendChild(i2.call(this, "restart", u2)), a3 === "rewind" && c2.appendChild(i2.call(this, "rewind", u2)), a3 === "play" && c2.appendChild(i2.call(this, "play", u2)), a3 === "fast-forward" && c2.appendChild(i2.call(this, "fast-forward", u2)), a3 === "progress") {
      const t3 = createElement("div", { class: `${u2.class} plyr__progress__container` }), i3 = createElement("div", getAttributesFromSelector(this.config.selectors.progress));
      if (i3.appendChild(n2.call(this, "seek", { id: `plyr-seek-${e2.id}` })), i3.appendChild(s2.call(this, "buffer")), this.config.tooltips.seek) {
        const e3 = createElement("span", { class: this.config.classNames.tooltip }, "00:00");
        i3.appendChild(e3), this.elements.display.seekTooltip = e3;
      }
      this.elements.progress = i3, t3.appendChild(this.elements.progress), c2.appendChild(t3);
    }
    if (a3 === "current-time" && c2.appendChild(r2.call(this, "currentTime", u2)), a3 === "duration" && c2.appendChild(r2.call(this, "duration", u2)), a3 === "mute" || a3 === "volume") {
      let { volume: t3 } = this.elements;
      if (is.element(t3) && c2.contains(t3) || (t3 = createElement("div", extend$1({}, u2, { class: `${u2.class} plyr__volume`.trim() })), this.elements.volume = t3, c2.appendChild(t3)), a3 === "mute" && t3.appendChild(i2.call(this, "mute")), a3 === "volume" && !browser.isIos) {
        const i3 = { max: 1, step: 0.05, value: this.config.volume };
        t3.appendChild(n2.call(this, "volume", extend$1(i3, { id: `plyr-volume-${e2.id}` })));
      }
    }
    if (a3 === "captions" && c2.appendChild(i2.call(this, "captions", u2)), a3 === "settings" && !is.empty(this.config.settings)) {
      const s3 = createElement("div", extend$1({}, u2, { class: `${u2.class} plyr__menu`.trim(), hidden: "" }));
      s3.appendChild(i2.call(this, "settings", { "aria-haspopup": true, "aria-controls": `plyr-settings-${e2.id}`, "aria-expanded": false }));
      const n3 = createElement("div", { class: "plyr__menu__container", id: `plyr-settings-${e2.id}`, hidden: "" }), r3 = createElement("div"), a4 = createElement("div", { id: `plyr-settings-${e2.id}-home` }), o3 = createElement("div", { role: "menu" });
      a4.appendChild(o3), r3.appendChild(a4), this.elements.settings.panels.home = a4, this.config.settings.forEach((i3) => {
        const s4 = createElement("button", extend$1(getAttributesFromSelector(this.config.selectors.buttons.settings), { type: "button", class: `${this.config.classNames.control} ${this.config.classNames.control}--forward`, role: "menuitem", "aria-haspopup": true, hidden: "" }));
        t2.call(this, s4, i3), on.call(this, s4, "click", () => {
          l.call(this, i3, false);
        });
        const n4 = createElement("span", null, i18n.get(i3, this.config)), a5 = createElement("span", { class: this.config.classNames.menu.value });
        a5.innerHTML = e2[i3], n4.appendChild(a5), s4.appendChild(n4), o3.appendChild(s4);
        const c3 = createElement("div", { id: `plyr-settings-${e2.id}-${i3}`, hidden: "" }), u3 = createElement("button", { type: "button", class: `${this.config.classNames.control} ${this.config.classNames.control}--back` });
        u3.appendChild(createElement("span", { "aria-hidden": true }, i18n.get(i3, this.config))), u3.appendChild(createElement("span", { class: this.config.classNames.hidden }, i18n.get("menuBack", this.config))), on.call(this, c3, "keydown", (e3) => {
          e3.key === "ArrowLeft" && (e3.preventDefault(), e3.stopPropagation(), l.call(this, "home", true));
        }, false), on.call(this, u3, "click", () => {
          l.call(this, "home", false);
        }), c3.appendChild(u3), c3.appendChild(createElement("div", { role: "menu" })), r3.appendChild(c3), this.elements.settings.buttons[i3] = s4, this.elements.settings.panels[i3] = c3;
      }), n3.appendChild(r3), s3.appendChild(n3), c2.appendChild(s3), this.elements.settings.popup = n3, this.elements.settings.menu = s3;
    }
    if (a3 === "pip" && support.pip && c2.appendChild(i2.call(this, "pip", u2)), a3 === "airplay" && support.airplay && c2.appendChild(i2.call(this, "airplay", u2)), a3 === "download") {
      const e3 = extend$1({}, u2, { element: "a", href: this.download, target: "_blank" });
      this.isHTML5 && (e3.download = "");
      const { download: t3 } = this.config.urls;
      !is.url(t3) && this.isEmbed && extend$1(e3, { icon: `logo-${this.provider}`, label: this.provider }), c2.appendChild(i2.call(this, "download", e3));
    }
    a3 === "fullscreen" && c2.appendChild(i2.call(this, "fullscreen", u2));
  }), this.isHTML5 && a2.call(this, html5.getQualityOptions.call(this)), o2.call(this), c2;
}, inject() {
  if (this.config.loadSprite) {
    const e3 = controls.getIconUrl.call(this);
    e3.cors && loadSprite(e3.url, "sprite-plyr");
  }
  this.id = Math.floor(1e4 * Math.random());
  let e2 = null;
  this.elements.controls = null;
  const t2 = { id: this.id, seektime: this.config.seekTime, title: this.config.title };
  let i2 = true;
  is.function(this.config.controls) && (this.config.controls = this.config.controls.call(this, t2)), this.config.controls || (this.config.controls = []), is.element(this.config.controls) || is.string(this.config.controls) ? e2 = this.config.controls : (e2 = controls.create.call(this, { id: this.id, seektime: this.config.seekTime, speed: this.speed, quality: this.quality, captions: captions.getLabel.call(this) }), i2 = false);
  let s2;
  i2 && is.string(this.config.controls) && (e2 = ((e3) => {
    let i3 = e3;
    return Object.entries(t2).forEach(([e4, t3]) => {
      i3 = replaceAll(i3, `{${e4}}`, t3);
    }), i3;
  })(e2)), is.string(this.config.selectors.controls.container) && (s2 = document.querySelector(this.config.selectors.controls.container)), is.element(s2) || (s2 = this.elements.container);
  if (s2[is.element(e2) ? "insertAdjacentElement" : "insertAdjacentHTML"]("afterbegin", e2), is.element(this.elements.controls) || controls.findElements.call(this), !is.empty(this.elements.buttons)) {
    const e3 = (e4) => {
      const t3 = this.config.classNames.controlPressed;
      Object.defineProperty(e4, "pressed", { enumerable: true, get: () => hasClass(e4, t3), set(i3 = false) {
        toggleClass(e4, t3, i3);
      } });
    };
    Object.values(this.elements.buttons).filter(Boolean).forEach((t3) => {
      is.array(t3) || is.nodeList(t3) ? Array.from(t3).filter(Boolean).forEach(e3) : e3(t3);
    });
  }
  if (browser.isEdge && repaint(s2), this.config.tooltips.controls) {
    const { classNames: e3, selectors: t3 } = this.config, i3 = `${t3.controls.wrapper} ${t3.labels} .${e3.hidden}`, s3 = getElements.call(this, i3);
    Array.from(s3).forEach((e4) => {
      toggleClass(e4, this.config.classNames.hidden, false), toggleClass(e4, this.config.classNames.tooltip, true);
    });
  }
}, setMediaMetadata() {
  try {
    "mediaSession" in navigator && (navigator.mediaSession.metadata = new window.MediaMetadata({ title: this.config.mediaMetadata.title, artist: this.config.mediaMetadata.artist, album: this.config.mediaMetadata.album, artwork: this.config.mediaMetadata.artwork }));
  } catch (e2) {
  }
}, setMarkers() {
  var e2, t2;
  if (!this.duration || this.elements.markers)
    return;
  const i2 = (e2 = this.config.markers) === null || e2 === void 0 || (t2 = e2.points) === null || t2 === void 0 ? void 0 : t2.filter(({ time: e3 }) => e3 > 0 && e3 < this.duration);
  if (i2 == null || !i2.length)
    return;
  const s2 = document.createDocumentFragment(), n2 = document.createDocumentFragment();
  let r2 = null;
  const a2 = `${this.config.classNames.tooltip}--visible`, o2 = (e3) => toggleClass(r2, a2, e3);
  i2.forEach((e3) => {
    const t3 = createElement("span", { class: this.config.classNames.marker }, ""), i3 = e3.time / this.duration * 100 + "%";
    r2 && (t3.addEventListener("mouseenter", () => {
      e3.label || (r2.style.left = i3, r2.innerHTML = e3.label, o2(true));
    }), t3.addEventListener("mouseleave", () => {
      o2(false);
    })), t3.addEventListener("click", () => {
      this.currentTime = e3.time;
    }), t3.style.left = i3, n2.appendChild(t3);
  }), s2.appendChild(n2), this.config.tooltips.seek || (r2 = createElement("span", { class: this.config.classNames.tooltip }, ""), s2.appendChild(r2)), this.elements.markers = { points: n2, tip: r2 }, this.elements.progress.appendChild(s2);
} };
function parseUrl(e2, t2 = true) {
  let i2 = e2;
  if (t2) {
    const e3 = document.createElement("a");
    e3.href = i2, i2 = e3.href;
  }
  try {
    return new URL(i2);
  } catch (e3) {
    return null;
  }
}
function buildUrlParams(e2) {
  const t2 = new URLSearchParams();
  return is.object(e2) && Object.entries(e2).forEach(([e3, i2]) => {
    t2.set(e3, i2);
  }), t2;
}
const captions = { setup() {
  if (!this.supported.ui)
    return;
  if (!this.isVideo || this.isYouTube || this.isHTML5 && !support.textTracks)
    return void (is.array(this.config.controls) && this.config.controls.includes("settings") && this.config.settings.includes("captions") && controls.setCaptionsMenu.call(this));
  if (is.element(this.elements.captions) || (this.elements.captions = createElement("div", getAttributesFromSelector(this.config.selectors.captions)), insertAfter(this.elements.captions, this.elements.wrapper)), browser.isIE && window.URL) {
    const e3 = this.media.querySelectorAll("track");
    Array.from(e3).forEach((e4) => {
      const t3 = e4.getAttribute("src"), i3 = parseUrl(t3);
      i3 !== null && i3.hostname !== window.location.href.hostname && ["http:", "https:"].includes(i3.protocol) && fetch$1(t3, "blob").then((t4) => {
        e4.setAttribute("src", window.URL.createObjectURL(t4));
      }).catch(() => {
        removeElement(e4);
      });
    });
  }
  const e2 = dedupe((navigator.languages || [navigator.language || navigator.userLanguage || "en"]).map((e3) => e3.split("-")[0]));
  let t2 = (this.storage.get("language") || this.config.captions.language || "auto").toLowerCase();
  t2 === "auto" && ([t2] = e2);
  let i2 = this.storage.get("captions");
  if (is.boolean(i2) || ({ active: i2 } = this.config.captions), Object.assign(this.captions, { toggled: false, active: i2, language: t2, languages: e2 }), this.isHTML5) {
    const e3 = this.config.captions.update ? "addtrack removetrack" : "removetrack";
    on.call(this, this.media.textTracks, e3, captions.update.bind(this));
  }
  setTimeout(captions.update.bind(this), 0);
}, update() {
  const e2 = captions.getTracks.call(this, true), { active: t2, language: i2, meta: s2, currentTrackNode: n2 } = this.captions, r2 = Boolean(e2.find((e3) => e3.language === i2));
  this.isHTML5 && this.isVideo && e2.filter((e3) => !s2.get(e3)).forEach((e3) => {
    this.debug.log("Track added", e3), s2.set(e3, { default: e3.mode === "showing" }), e3.mode === "showing" && (e3.mode = "hidden"), on.call(this, e3, "cuechange", () => captions.updateCues.call(this));
  }), (r2 && this.language !== i2 || !e2.includes(n2)) && (captions.setLanguage.call(this, i2), captions.toggle.call(this, t2 && r2)), this.elements && toggleClass(this.elements.container, this.config.classNames.captions.enabled, !is.empty(e2)), is.array(this.config.controls) && this.config.controls.includes("settings") && this.config.settings.includes("captions") && controls.setCaptionsMenu.call(this);
}, toggle(e2, t2 = true) {
  if (!this.supported.ui)
    return;
  const { toggled: i2 } = this.captions, s2 = this.config.classNames.captions.active, n2 = is.nullOrUndefined(e2) ? !i2 : e2;
  if (n2 !== i2) {
    if (t2 || (this.captions.active = n2, this.storage.set({ captions: n2 })), !this.language && n2 && !t2) {
      const e3 = captions.getTracks.call(this), t3 = captions.findTrack.call(this, [this.captions.language, ...this.captions.languages], true);
      return this.captions.language = t3.language, void captions.set.call(this, e3.indexOf(t3));
    }
    this.elements.buttons.captions && (this.elements.buttons.captions.pressed = n2), toggleClass(this.elements.container, s2, n2), this.captions.toggled = n2, controls.updateSetting.call(this, "captions"), triggerEvent.call(this, this.media, n2 ? "captionsenabled" : "captionsdisabled");
  }
  setTimeout(() => {
    n2 && this.captions.toggled && (this.captions.currentTrackNode.mode = "hidden");
  });
}, set(e2, t2 = true) {
  const i2 = captions.getTracks.call(this);
  if (e2 !== -1)
    if (is.number(e2))
      if (e2 in i2) {
        if (this.captions.currentTrack !== e2) {
          this.captions.currentTrack = e2;
          const s2 = i2[e2], { language: n2 } = s2 || {};
          this.captions.currentTrackNode = s2, controls.updateSetting.call(this, "captions"), t2 || (this.captions.language = n2, this.storage.set({ language: n2 })), this.isVimeo && this.embed.enableTextTrack(n2), triggerEvent.call(this, this.media, "languagechange");
        }
        captions.toggle.call(this, true, t2), this.isHTML5 && this.isVideo && captions.updateCues.call(this);
      } else
        this.debug.warn("Track not found", e2);
    else
      this.debug.warn("Invalid caption argument", e2);
  else
    captions.toggle.call(this, false, t2);
}, setLanguage(e2, t2 = true) {
  if (!is.string(e2))
    return void this.debug.warn("Invalid language argument", e2);
  const i2 = e2.toLowerCase();
  this.captions.language = i2;
  const s2 = captions.getTracks.call(this), n2 = captions.findTrack.call(this, [i2]);
  captions.set.call(this, s2.indexOf(n2), t2);
}, getTracks(e2 = false) {
  return Array.from((this.media || {}).textTracks || []).filter((t2) => !this.isHTML5 || e2 || this.captions.meta.has(t2)).filter((e3) => ["captions", "subtitles"].includes(e3.kind));
}, findTrack(e2, t2 = false) {
  const i2 = captions.getTracks.call(this), s2 = (e3) => Number((this.captions.meta.get(e3) || {}).default), n2 = Array.from(i2).sort((e3, t3) => s2(t3) - s2(e3));
  let r2;
  return e2.every((e3) => (r2 = n2.find((t3) => t3.language === e3), !r2)), r2 || (t2 ? n2[0] : void 0);
}, getCurrentTrack() {
  return captions.getTracks.call(this)[this.currentTrack];
}, getLabel(e2) {
  let t2 = e2;
  return !is.track(t2) && support.textTracks && this.captions.toggled && (t2 = captions.getCurrentTrack.call(this)), is.track(t2) ? is.empty(t2.label) ? is.empty(t2.language) ? i18n.get("enabled", this.config) : e2.language.toUpperCase() : t2.label : i18n.get("disabled", this.config);
}, updateCues(e2) {
  if (!this.supported.ui)
    return;
  if (!is.element(this.elements.captions))
    return void this.debug.warn("No captions element to render to");
  if (!is.nullOrUndefined(e2) && !Array.isArray(e2))
    return void this.debug.warn("updateCues: Invalid input", e2);
  let t2 = e2;
  if (!t2) {
    const e3 = captions.getCurrentTrack.call(this);
    t2 = Array.from((e3 || {}).activeCues || []).map((e4) => e4.getCueAsHTML()).map(getHTML);
  }
  const i2 = t2.map((e3) => e3.trim()).join("\n");
  if (i2 !== this.elements.captions.innerHTML) {
    emptyElement(this.elements.captions);
    const e3 = createElement("span", getAttributesFromSelector(this.config.selectors.caption));
    e3.innerHTML = i2, this.elements.captions.appendChild(e3), triggerEvent.call(this, this.media, "cuechange");
  }
} }, defaults$5 = { enabled: true, title: "", debug: false, autoplay: false, autopause: true, playsinline: true, seekTime: 10, volume: 1, muted: false, duration: null, displayDuration: true, invertTime: true, toggleInvert: true, ratio: null, clickToPlay: true, hideControls: true, resetOnEnd: false, disableContextMenu: true, loadSprite: true, iconPrefix: "plyr", iconUrl: "https://cdn.plyr.io/3.7.2/plyr.svg", blankVideo: "https://cdn.plyr.io/static/blank.mp4", quality: { default: 576, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240], forced: false, onChange: null }, loop: { active: false }, speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4] }, keyboard: { focused: true, global: false }, tooltips: { controls: false, seek: true }, captions: { active: false, language: "auto", update: false }, fullscreen: { enabled: true, fallback: true, iosNative: false }, storage: { enabled: true, key: "plyr" }, controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen"], settings: ["captions", "quality", "speed"], i18n: { restart: "Restart", rewind: "Rewind {seektime}s", play: "Play", pause: "Pause", fastForward: "Forward {seektime}s", seek: "Seek", seekLabel: "{currentTime} of {duration}", played: "Played", buffered: "Buffered", currentTime: "Current time", duration: "Duration", volume: "Volume", mute: "Mute", unmute: "Unmute", enableCaptions: "Enable captions", disableCaptions: "Disable captions", download: "Download", enterFullscreen: "Enter fullscreen", exitFullscreen: "Exit fullscreen", frameTitle: "Player for {title}", captions: "Captions", settings: "Settings", pip: "PIP", menuBack: "Go back to previous menu", speed: "Speed", normal: "Normal", quality: "Quality", loop: "Loop", start: "Start", end: "End", all: "All", reset: "Reset", disabled: "Disabled", enabled: "Enabled", advertisement: "Ad", qualityBadge: { 2160: "4K", 1440: "HD", 1080: "HD", 720: "HD", 576: "SD", 480: "SD" } }, urls: { download: null, vimeo: { sdk: "https://player.vimeo.com/api/player.js", iframe: "https://player.vimeo.com/video/{0}?{1}", api: "https://vimeo.com/api/oembed.json?url={0}" }, youtube: { sdk: "https://www.youtube.com/iframe_api", api: "https://noembed.com/embed?url=https://www.youtube.com/watch?v={0}" }, googleIMA: { sdk: "https://imasdk.googleapis.com/js/sdkloader/ima3.js" } }, listeners: { seek: null, play: null, pause: null, restart: null, rewind: null, fastForward: null, mute: null, volume: null, captions: null, download: null, fullscreen: null, pip: null, airplay: null, speed: null, quality: null, loop: null, language: null }, events: ["ended", "progress", "stalled", "playing", "waiting", "canplay", "canplaythrough", "loadstart", "loadeddata", "loadedmetadata", "timeupdate", "volumechange", "play", "pause", "error", "seeking", "seeked", "emptied", "ratechange", "cuechange", "download", "enterfullscreen", "exitfullscreen", "captionsenabled", "captionsdisabled", "languagechange", "controlshidden", "controlsshown", "ready", "statechange", "qualitychange", "adsloaded", "adscontentpause", "adscontentresume", "adstarted", "adsmidpoint", "adscomplete", "adsallcomplete", "adsimpression", "adsclick"], selectors: { editable: "input, textarea, select, [contenteditable]", container: ".plyr", controls: { container: null, wrapper: ".plyr__controls" }, labels: "[data-plyr]", buttons: { play: '[data-plyr="play"]', pause: '[data-plyr="pause"]', restart: '[data-plyr="restart"]', rewind: '[data-plyr="rewind"]', fastForward: '[data-plyr="fast-forward"]', mute: '[data-plyr="mute"]', captions: '[data-plyr="captions"]', download: '[data-plyr="download"]', fullscreen: '[data-plyr="fullscreen"]', pip: '[data-plyr="pip"]', airplay: '[data-plyr="airplay"]', settings: '[data-plyr="settings"]', loop: '[data-plyr="loop"]' }, inputs: { seek: '[data-plyr="seek"]', volume: '[data-plyr="volume"]', speed: '[data-plyr="speed"]', language: '[data-plyr="language"]', quality: '[data-plyr="quality"]' }, display: { currentTime: ".plyr__time--current", duration: ".plyr__time--duration", buffer: ".plyr__progress__buffer", loop: ".plyr__progress__loop", volume: ".plyr__volume--display" }, progress: ".plyr__progress", captions: ".plyr__captions", caption: ".plyr__caption" }, classNames: { type: "plyr--{0}", provider: "plyr--{0}", video: "plyr__video-wrapper", embed: "plyr__video-embed", videoFixedRatio: "plyr__video-wrapper--fixed-ratio", embedContainer: "plyr__video-embed__container", poster: "plyr__poster", posterEnabled: "plyr__poster-enabled", ads: "plyr__ads", control: "plyr__control", controlPressed: "plyr__control--pressed", playing: "plyr--playing", paused: "plyr--paused", stopped: "plyr--stopped", loading: "plyr--loading", hover: "plyr--hover", tooltip: "plyr__tooltip", cues: "plyr__cues", marker: "plyr__progress__marker", hidden: "plyr__sr-only", hideControls: "plyr--hide-controls", isIos: "plyr--is-ios", isTouch: "plyr--is-touch", uiSupported: "plyr--full-ui", noTransition: "plyr--no-transition", display: { time: "plyr__time" }, menu: { value: "plyr__menu__value", badge: "plyr__badge", open: "plyr--menu-open" }, captions: { enabled: "plyr--captions-enabled", active: "plyr--captions-active" }, fullscreen: { enabled: "plyr--fullscreen-enabled", fallback: "plyr--fullscreen-fallback" }, pip: { supported: "plyr--pip-supported", active: "plyr--pip-active" }, airplay: { supported: "plyr--airplay-supported", active: "plyr--airplay-active" }, tabFocus: "plyr__tab-focus", previewThumbnails: { thumbContainer: "plyr__preview-thumb", thumbContainerShown: "plyr__preview-thumb--is-shown", imageContainer: "plyr__preview-thumb__image-container", timeContainer: "plyr__preview-thumb__time-container", scrubbingContainer: "plyr__preview-scrubbing", scrubbingContainerShown: "plyr__preview-scrubbing--is-shown" } }, attributes: { embed: { provider: "data-plyr-provider", id: "data-plyr-embed-id", hash: "data-plyr-embed-hash" } }, ads: { enabled: false, publisherId: "", tagUrl: "" }, previewThumbnails: { enabled: false, src: "" }, vimeo: { byline: false, portrait: false, title: false, speed: true, transparent: false, customControls: true, referrerPolicy: null, premium: false }, youtube: { rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1, customControls: true, noCookie: false }, mediaMetadata: { title: "", artist: "", album: "", artwork: [] }, markers: { enabled: false, points: [] } }, pip = { active: "picture-in-picture", inactive: "inline" }, providers = { html5: "html5", youtube: "youtube", vimeo: "vimeo" }, types = { audio: "audio", video: "video" };
function getProviderByUrl(e2) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(e2) ? providers.youtube : /^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(e2) ? providers.vimeo : null;
}
const noop$1 = () => {
};
class Console {
  constructor(e2 = false) {
    this.enabled = window.console && e2, this.enabled && this.log("Debugging enabled");
  }
  get log() {
    return this.enabled ? Function.prototype.bind.call(console.log, console) : noop$1;
  }
  get warn() {
    return this.enabled ? Function.prototype.bind.call(console.warn, console) : noop$1;
  }
  get error() {
    return this.enabled ? Function.prototype.bind.call(console.error, console) : noop$1;
  }
}
class Fullscreen {
  constructor(e2) {
    _defineProperty$1(this, "onChange", () => {
      if (!this.enabled)
        return;
      const e3 = this.player.elements.buttons.fullscreen;
      is.element(e3) && (e3.pressed = this.active);
      const t2 = this.target === this.player.media ? this.target : this.player.elements.container;
      triggerEvent.call(this.player, t2, this.active ? "enterfullscreen" : "exitfullscreen", true);
    }), _defineProperty$1(this, "toggleFallback", (e3 = false) => {
      if (e3 ? this.scrollPosition = { x: window.scrollX || 0, y: window.scrollY || 0 } : window.scrollTo(this.scrollPosition.x, this.scrollPosition.y), document.body.style.overflow = e3 ? "hidden" : "", toggleClass(this.target, this.player.config.classNames.fullscreen.fallback, e3), browser.isIos) {
        let t2 = document.head.querySelector('meta[name="viewport"]');
        const i2 = "viewport-fit=cover";
        t2 || (t2 = document.createElement("meta"), t2.setAttribute("name", "viewport"));
        const s2 = is.string(t2.content) && t2.content.includes(i2);
        e3 ? (this.cleanupViewport = !s2, s2 || (t2.content += `,${i2}`)) : this.cleanupViewport && (t2.content = t2.content.split(",").filter((e4) => e4.trim() !== i2).join(","));
      }
      this.onChange();
    }), _defineProperty$1(this, "trapFocus", (e3) => {
      if (browser.isIos || !this.active || e3.key !== "Tab")
        return;
      const t2 = document.activeElement, i2 = getElements.call(this.player, "a[href], button:not(:disabled), input:not(:disabled), [tabindex]"), [s2] = i2, n2 = i2[i2.length - 1];
      t2 !== n2 || e3.shiftKey ? t2 === s2 && e3.shiftKey && (n2.focus(), e3.preventDefault()) : (s2.focus(), e3.preventDefault());
    }), _defineProperty$1(this, "update", () => {
      if (this.enabled) {
        let e3;
        e3 = this.forceFallback ? "Fallback (forced)" : Fullscreen.native ? "Native" : "Fallback", this.player.debug.log(`${e3} fullscreen enabled`);
      } else
        this.player.debug.log("Fullscreen not supported and fallback disabled");
      toggleClass(this.player.elements.container, this.player.config.classNames.fullscreen.enabled, this.enabled);
    }), _defineProperty$1(this, "enter", () => {
      this.enabled && (browser.isIos && this.player.config.fullscreen.iosNative ? this.player.isVimeo ? this.player.embed.requestFullscreen() : this.target.webkitEnterFullscreen() : !Fullscreen.native || this.forceFallback ? this.toggleFallback(true) : this.prefix ? is.empty(this.prefix) || this.target[`${this.prefix}Request${this.property}`]() : this.target.requestFullscreen({ navigationUI: "hide" }));
    }), _defineProperty$1(this, "exit", () => {
      if (this.enabled)
        if (browser.isIos && this.player.config.fullscreen.iosNative)
          this.target.webkitExitFullscreen(), silencePromise(this.player.play());
        else if (!Fullscreen.native || this.forceFallback)
          this.toggleFallback(false);
        else if (this.prefix) {
          if (!is.empty(this.prefix)) {
            const e3 = this.prefix === "moz" ? "Cancel" : "Exit";
            document[`${this.prefix}${e3}${this.property}`]();
          }
        } else
          (document.cancelFullScreen || document.exitFullscreen).call(document);
    }), _defineProperty$1(this, "toggle", () => {
      this.active ? this.exit() : this.enter();
    }), this.player = e2, this.prefix = Fullscreen.prefix, this.property = Fullscreen.property, this.scrollPosition = { x: 0, y: 0 }, this.forceFallback = e2.config.fullscreen.fallback === "force", this.player.elements.fullscreen = e2.config.fullscreen.container && closest$1(this.player.elements.container, e2.config.fullscreen.container), on.call(this.player, document, this.prefix === "ms" ? "MSFullscreenChange" : `${this.prefix}fullscreenchange`, () => {
      this.onChange();
    }), on.call(this.player, this.player.elements.container, "dblclick", (e3) => {
      is.element(this.player.elements.controls) && this.player.elements.controls.contains(e3.target) || this.player.listeners.proxy(e3, this.toggle, "fullscreen");
    }), on.call(this, this.player.elements.container, "keydown", (e3) => this.trapFocus(e3)), this.update();
  }
  static get native() {
    return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
  }
  get usingNative() {
    return Fullscreen.native && !this.forceFallback;
  }
  static get prefix() {
    if (is.function(document.exitFullscreen))
      return "";
    let e2 = "";
    return ["webkit", "moz", "ms"].some((t2) => !(!is.function(document[`${t2}ExitFullscreen`]) && !is.function(document[`${t2}CancelFullScreen`])) && (e2 = t2, true)), e2;
  }
  static get property() {
    return this.prefix === "moz" ? "FullScreen" : "Fullscreen";
  }
  get enabled() {
    return (Fullscreen.native || this.player.config.fullscreen.fallback) && this.player.config.fullscreen.enabled && this.player.supported.ui && this.player.isVideo;
  }
  get active() {
    if (!this.enabled)
      return false;
    if (!Fullscreen.native || this.forceFallback)
      return hasClass(this.target, this.player.config.classNames.fullscreen.fallback);
    const e2 = this.prefix ? this.target.getRootNode()[`${this.prefix}${this.property}Element`] : this.target.getRootNode().fullscreenElement;
    return e2 && e2.shadowRoot ? e2 === this.target.getRootNode().host : e2 === this.target;
  }
  get target() {
    return browser.isIos && this.player.config.fullscreen.iosNative ? this.player.media : this.player.elements.fullscreen || this.player.elements.container;
  }
}
function loadImage(e2, t2 = 1) {
  return new Promise((i2, s2) => {
    const n2 = new Image(), r2 = () => {
      delete n2.onload, delete n2.onerror, (n2.naturalWidth >= t2 ? i2 : s2)(n2);
    };
    Object.assign(n2, { onload: r2, onerror: r2, src: e2 });
  });
}
const ui = { addStyleHook() {
  toggleClass(this.elements.container, this.config.selectors.container.replace(".", ""), true), toggleClass(this.elements.container, this.config.classNames.uiSupported, this.supported.ui);
}, toggleNativeControls(e2 = false) {
  e2 && this.isHTML5 ? this.media.setAttribute("controls", "") : this.media.removeAttribute("controls");
}, build() {
  if (this.listeners.media(), !this.supported.ui)
    return this.debug.warn(`Basic support only for ${this.provider} ${this.type}`), void ui.toggleNativeControls.call(this, true);
  is.element(this.elements.controls) || (controls.inject.call(this), this.listeners.controls()), ui.toggleNativeControls.call(this), this.isHTML5 && captions.setup.call(this), this.volume = null, this.muted = null, this.loop = null, this.quality = null, this.speed = null, controls.updateVolume.call(this), controls.timeUpdate.call(this), controls.durationUpdate.call(this), ui.checkPlaying.call(this), toggleClass(this.elements.container, this.config.classNames.pip.supported, support.pip && this.isHTML5 && this.isVideo), toggleClass(this.elements.container, this.config.classNames.airplay.supported, support.airplay && this.isHTML5), toggleClass(this.elements.container, this.config.classNames.isIos, browser.isIos), toggleClass(this.elements.container, this.config.classNames.isTouch, this.touch), this.ready = true, setTimeout(() => {
    triggerEvent.call(this, this.media, "ready");
  }, 0), ui.setTitle.call(this), this.poster && ui.setPoster.call(this, this.poster, false).catch(() => {
  }), this.config.duration && controls.durationUpdate.call(this), this.config.mediaMetadata && controls.setMediaMetadata.call(this);
}, setTitle() {
  let e2 = i18n.get("play", this.config);
  if (is.string(this.config.title) && !is.empty(this.config.title) && (e2 += `, ${this.config.title}`), Array.from(this.elements.buttons.play || []).forEach((t2) => {
    t2.setAttribute("aria-label", e2);
  }), this.isEmbed) {
    const e3 = getElement.call(this, "iframe");
    if (!is.element(e3))
      return;
    const t2 = is.empty(this.config.title) ? "video" : this.config.title, i2 = i18n.get("frameTitle", this.config);
    e3.setAttribute("title", i2.replace("{title}", t2));
  }
}, togglePoster(e2) {
  toggleClass(this.elements.container, this.config.classNames.posterEnabled, e2);
}, setPoster(e2, t2 = true) {
  return t2 && this.poster ? Promise.reject(new Error("Poster already set")) : (this.media.setAttribute("data-poster", e2), this.elements.poster.removeAttribute("hidden"), ready.call(this).then(() => loadImage(e2)).catch((t3) => {
    throw e2 === this.poster && ui.togglePoster.call(this, false), t3;
  }).then(() => {
    if (e2 !== this.poster)
      throw new Error("setPoster cancelled by later call to setPoster");
  }).then(() => (Object.assign(this.elements.poster.style, { backgroundImage: `url('${e2}')`, backgroundSize: "" }), ui.togglePoster.call(this, true), e2)));
}, checkPlaying(e2) {
  toggleClass(this.elements.container, this.config.classNames.playing, this.playing), toggleClass(this.elements.container, this.config.classNames.paused, this.paused), toggleClass(this.elements.container, this.config.classNames.stopped, this.stopped), Array.from(this.elements.buttons.play || []).forEach((e3) => {
    Object.assign(e3, { pressed: this.playing }), e3.setAttribute("aria-label", i18n.get(this.playing ? "pause" : "play", this.config));
  }), is.event(e2) && e2.type === "timeupdate" || ui.toggleControls.call(this);
}, checkLoading(e2) {
  this.loading = ["stalled", "waiting"].includes(e2.type), clearTimeout(this.timers.loading), this.timers.loading = setTimeout(() => {
    toggleClass(this.elements.container, this.config.classNames.loading, this.loading), ui.toggleControls.call(this);
  }, this.loading ? 250 : 0);
}, toggleControls(e2) {
  const { controls: t2 } = this.elements;
  if (t2 && this.config.hideControls) {
    const i2 = this.touch && this.lastSeekTime + 2e3 > Date.now();
    this.toggleControls(Boolean(e2 || this.loading || this.paused || t2.pressed || t2.hover || i2));
  }
}, migrateStyles() {
  Object.values(__spreadValues({}, this.media.style)).filter((e2) => !is.empty(e2) && is.string(e2) && e2.startsWith("--plyr")).forEach((e2) => {
    this.elements.container.style.setProperty(e2, this.media.style.getPropertyValue(e2)), this.media.style.removeProperty(e2);
  }), is.empty(this.media.style) && this.media.removeAttribute("style");
} };
class Listeners {
  constructor(e2) {
    _defineProperty$1(this, "firstTouch", () => {
      const { player: e3 } = this, { elements: t2 } = e3;
      e3.touch = true, toggleClass(t2.container, e3.config.classNames.isTouch, true);
    }), _defineProperty$1(this, "setTabFocus", (e3) => {
      const { player: t2 } = this, { elements: i2 } = t2, { key: s2, type: n2, timeStamp: r2 } = e3;
      if (clearTimeout(this.focusTimer), n2 === "keydown" && s2 !== "Tab")
        return;
      n2 === "keydown" && (this.lastKeyDown = r2);
      const a2 = r2 - this.lastKeyDown <= 20;
      (n2 !== "focus" || a2) && ((() => {
        const e4 = t2.config.classNames.tabFocus;
        toggleClass(getElements.call(t2, `.${e4}`), e4, false);
      })(), n2 !== "focusout" && (this.focusTimer = setTimeout(() => {
        const e4 = document.activeElement;
        i2.container.contains(e4) && toggleClass(document.activeElement, t2.config.classNames.tabFocus, true);
      }, 10)));
    }), _defineProperty$1(this, "global", (e3 = true) => {
      const { player: t2 } = this;
      t2.config.keyboard.global && toggleListener.call(t2, window, "keydown keyup", this.handleKey, e3, false), toggleListener.call(t2, document.body, "click", this.toggleMenu, e3), once.call(t2, document.body, "touchstart", this.firstTouch), toggleListener.call(t2, document.body, "keydown focus blur focusout", this.setTabFocus, e3, false, true);
    }), _defineProperty$1(this, "container", () => {
      const { player: e3 } = this, { config: t2, elements: i2, timers: s2 } = e3;
      !t2.keyboard.global && t2.keyboard.focused && on.call(e3, i2.container, "keydown keyup", this.handleKey, false), on.call(e3, i2.container, "mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen", (t3) => {
        const { controls: n3 } = i2;
        n3 && t3.type === "enterfullscreen" && (n3.pressed = false, n3.hover = false);
        let r3 = 0;
        ["touchstart", "touchmove", "mousemove"].includes(t3.type) && (ui.toggleControls.call(e3, true), r3 = e3.touch ? 3e3 : 2e3), clearTimeout(s2.controls), s2.controls = setTimeout(() => ui.toggleControls.call(e3, false), r3);
      });
      const n2 = () => {
        if (!e3.isVimeo || e3.config.vimeo.premium)
          return;
        const t3 = i2.wrapper, { active: s3 } = e3.fullscreen, [n3, r3] = getAspectRatio.call(e3), a2 = supportsCSS(`aspect-ratio: ${n3} / ${r3}`);
        if (!s3)
          return void (a2 ? (t3.style.width = null, t3.style.height = null) : (t3.style.maxWidth = null, t3.style.margin = null));
        const [o2, l] = getViewportSize(), c2 = o2 / l > n3 / r3;
        a2 ? (t3.style.width = c2 ? "auto" : "100%", t3.style.height = c2 ? "100%" : "auto") : (t3.style.maxWidth = c2 ? l / r3 * n3 + "px" : null, t3.style.margin = c2 ? "0 auto" : null);
      }, r2 = () => {
        clearTimeout(s2.resized), s2.resized = setTimeout(n2, 50);
      };
      on.call(e3, i2.container, "enterfullscreen exitfullscreen", (t3) => {
        const { target: s3 } = e3.fullscreen;
        if (s3 !== i2.container)
          return;
        if (!e3.isEmbed && is.empty(e3.config.ratio))
          return;
        n2();
        (t3.type === "enterfullscreen" ? on : off).call(e3, window, "resize", r2);
      });
    }), _defineProperty$1(this, "media", () => {
      const { player: e3 } = this, { elements: t2 } = e3;
      if (on.call(e3, e3.media, "timeupdate seeking seeked", (t3) => controls.timeUpdate.call(e3, t3)), on.call(e3, e3.media, "durationchange loadeddata loadedmetadata", (t3) => controls.durationUpdate.call(e3, t3)), on.call(e3, e3.media, "ended", () => {
        e3.isHTML5 && e3.isVideo && e3.config.resetOnEnd && (e3.restart(), e3.pause());
      }), on.call(e3, e3.media, "progress playing seeking seeked", (t3) => controls.updateProgress.call(e3, t3)), on.call(e3, e3.media, "volumechange", (t3) => controls.updateVolume.call(e3, t3)), on.call(e3, e3.media, "playing play pause ended emptied timeupdate", (t3) => ui.checkPlaying.call(e3, t3)), on.call(e3, e3.media, "waiting canplay seeked playing", (t3) => ui.checkLoading.call(e3, t3)), e3.supported.ui && e3.config.clickToPlay && !e3.isAudio) {
        const i3 = getElement.call(e3, `.${e3.config.classNames.video}`);
        if (!is.element(i3))
          return;
        on.call(e3, t2.container, "click", (s2) => {
          ([t2.container, i3].includes(s2.target) || i3.contains(s2.target)) && (e3.touch && e3.config.hideControls || (e3.ended ? (this.proxy(s2, e3.restart, "restart"), this.proxy(s2, () => {
            silencePromise(e3.play());
          }, "play")) : this.proxy(s2, () => {
            silencePromise(e3.togglePlay());
          }, "play")));
        });
      }
      e3.supported.ui && e3.config.disableContextMenu && on.call(e3, t2.wrapper, "contextmenu", (e4) => {
        e4.preventDefault();
      }, false), on.call(e3, e3.media, "volumechange", () => {
        e3.storage.set({ volume: e3.volume, muted: e3.muted });
      }), on.call(e3, e3.media, "ratechange", () => {
        controls.updateSetting.call(e3, "speed"), e3.storage.set({ speed: e3.speed });
      }), on.call(e3, e3.media, "qualitychange", (t3) => {
        controls.updateSetting.call(e3, "quality", null, t3.detail.quality);
      }), on.call(e3, e3.media, "ready qualitychange", () => {
        controls.setDownloadUrl.call(e3);
      });
      const i2 = e3.config.events.concat(["keyup", "keydown"]).join(" ");
      on.call(e3, e3.media, i2, (i3) => {
        let { detail: s2 = {} } = i3;
        i3.type === "error" && (s2 = e3.media.error), triggerEvent.call(e3, t2.container, i3.type, true, s2);
      });
    }), _defineProperty$1(this, "proxy", (e3, t2, i2) => {
      const { player: s2 } = this, n2 = s2.config.listeners[i2];
      let r2 = true;
      is.function(n2) && (r2 = n2.call(s2, e3)), r2 !== false && is.function(t2) && t2.call(s2, e3);
    }), _defineProperty$1(this, "bind", (e3, t2, i2, s2, n2 = true) => {
      const { player: r2 } = this, a2 = r2.config.listeners[s2], o2 = is.function(a2);
      on.call(r2, e3, t2, (e4) => this.proxy(e4, i2, s2), n2 && !o2);
    }), _defineProperty$1(this, "controls", () => {
      const { player: e3 } = this, { elements: t2 } = e3, i2 = browser.isIE ? "change" : "input";
      if (t2.buttons.play && Array.from(t2.buttons.play).forEach((t3) => {
        this.bind(t3, "click", () => {
          silencePromise(e3.togglePlay());
        }, "play");
      }), this.bind(t2.buttons.restart, "click", e3.restart, "restart"), this.bind(t2.buttons.rewind, "click", () => {
        e3.lastSeekTime = Date.now(), e3.rewind();
      }, "rewind"), this.bind(t2.buttons.fastForward, "click", () => {
        e3.lastSeekTime = Date.now(), e3.forward();
      }, "fastForward"), this.bind(t2.buttons.mute, "click", () => {
        e3.muted = !e3.muted;
      }, "mute"), this.bind(t2.buttons.captions, "click", () => e3.toggleCaptions()), this.bind(t2.buttons.download, "click", () => {
        triggerEvent.call(e3, e3.media, "download");
      }, "download"), this.bind(t2.buttons.fullscreen, "click", () => {
        e3.fullscreen.toggle();
      }, "fullscreen"), this.bind(t2.buttons.pip, "click", () => {
        e3.pip = "toggle";
      }, "pip"), this.bind(t2.buttons.airplay, "click", e3.airplay, "airplay"), this.bind(t2.buttons.settings, "click", (t3) => {
        t3.stopPropagation(), t3.preventDefault(), controls.toggleMenu.call(e3, t3);
      }, null, false), this.bind(t2.buttons.settings, "keyup", (t3) => {
        ["Space", "Enter"].includes(t3.key) && (t3.key !== "Enter" ? (t3.preventDefault(), t3.stopPropagation(), controls.toggleMenu.call(e3, t3)) : controls.focusFirstMenuItem.call(e3, null, true));
      }, null, false), this.bind(t2.settings.menu, "keydown", (t3) => {
        t3.key === "Escape" && controls.toggleMenu.call(e3, t3);
      }), this.bind(t2.inputs.seek, "mousedown mousemove", (e4) => {
        const i3 = t2.progress.getBoundingClientRect(), s2 = 100 / i3.width * (e4.pageX - i3.left);
        e4.currentTarget.setAttribute("seek-value", s2);
      }), this.bind(t2.inputs.seek, "mousedown mouseup keydown keyup touchstart touchend", (t3) => {
        const i3 = t3.currentTarget, s2 = "play-on-seeked";
        if (is.keyboardEvent(t3) && !["ArrowLeft", "ArrowRight"].includes(t3.key))
          return;
        e3.lastSeekTime = Date.now();
        const n2 = i3.hasAttribute(s2), r2 = ["mouseup", "touchend", "keyup"].includes(t3.type);
        n2 && r2 ? (i3.removeAttribute(s2), silencePromise(e3.play())) : !r2 && e3.playing && (i3.setAttribute(s2, ""), e3.pause());
      }), browser.isIos) {
        const t3 = getElements.call(e3, 'input[type="range"]');
        Array.from(t3).forEach((e4) => this.bind(e4, i2, (e5) => repaint(e5.target)));
      }
      this.bind(t2.inputs.seek, i2, (t3) => {
        const i3 = t3.currentTarget;
        let s2 = i3.getAttribute("seek-value");
        is.empty(s2) && (s2 = i3.value), i3.removeAttribute("seek-value"), e3.currentTime = s2 / i3.max * e3.duration;
      }, "seek"), this.bind(t2.progress, "mouseenter mouseleave mousemove", (t3) => controls.updateSeekTooltip.call(e3, t3)), this.bind(t2.progress, "mousemove touchmove", (t3) => {
        const { previewThumbnails: i3 } = e3;
        i3 && i3.loaded && i3.startMove(t3);
      }), this.bind(t2.progress, "mouseleave touchend click", () => {
        const { previewThumbnails: t3 } = e3;
        t3 && t3.loaded && t3.endMove(false, true);
      }), this.bind(t2.progress, "mousedown touchstart", (t3) => {
        const { previewThumbnails: i3 } = e3;
        i3 && i3.loaded && i3.startScrubbing(t3);
      }), this.bind(t2.progress, "mouseup touchend", (t3) => {
        const { previewThumbnails: i3 } = e3;
        i3 && i3.loaded && i3.endScrubbing(t3);
      }), browser.isWebkit && Array.from(getElements.call(e3, 'input[type="range"]')).forEach((t3) => {
        this.bind(t3, "input", (t4) => controls.updateRangeFill.call(e3, t4.target));
      }), e3.config.toggleInvert && !is.element(t2.display.duration) && this.bind(t2.display.currentTime, "click", () => {
        e3.currentTime !== 0 && (e3.config.invertTime = !e3.config.invertTime, controls.timeUpdate.call(e3));
      }), this.bind(t2.inputs.volume, i2, (t3) => {
        e3.volume = t3.target.value;
      }, "volume"), this.bind(t2.controls, "mouseenter mouseleave", (i3) => {
        t2.controls.hover = !e3.touch && i3.type === "mouseenter";
      }), t2.fullscreen && Array.from(t2.fullscreen.children).filter((e4) => !e4.contains(t2.container)).forEach((i3) => {
        this.bind(i3, "mouseenter mouseleave", (i4) => {
          t2.controls && (t2.controls.hover = !e3.touch && i4.type === "mouseenter");
        });
      }), this.bind(t2.controls, "mousedown mouseup touchstart touchend touchcancel", (e4) => {
        t2.controls.pressed = ["mousedown", "touchstart"].includes(e4.type);
      }), this.bind(t2.controls, "focusin", () => {
        const { config: i3, timers: s2 } = e3;
        toggleClass(t2.controls, i3.classNames.noTransition, true), ui.toggleControls.call(e3, true), setTimeout(() => {
          toggleClass(t2.controls, i3.classNames.noTransition, false);
        }, 0);
        const n2 = this.touch ? 3e3 : 4e3;
        clearTimeout(s2.controls), s2.controls = setTimeout(() => ui.toggleControls.call(e3, false), n2);
      }), this.bind(t2.inputs.volume, "wheel", (t3) => {
        const i3 = t3.webkitDirectionInvertedFromDevice, [s2, n2] = [t3.deltaX, -t3.deltaY].map((e4) => i3 ? -e4 : e4), r2 = Math.sign(Math.abs(s2) > Math.abs(n2) ? s2 : n2);
        e3.increaseVolume(r2 / 50);
        const { volume: a2 } = e3.media;
        (r2 === 1 && a2 < 1 || r2 === -1 && a2 > 0) && t3.preventDefault();
      }, "volume", false);
    }), this.player = e2, this.lastKey = null, this.focusTimer = null, this.lastKeyDown = null, this.handleKey = this.handleKey.bind(this), this.toggleMenu = this.toggleMenu.bind(this), this.setTabFocus = this.setTabFocus.bind(this), this.firstTouch = this.firstTouch.bind(this);
  }
  handleKey(e2) {
    const { player: t2 } = this, { elements: i2 } = t2, { key: s2, type: n2, altKey: r2, ctrlKey: a2, metaKey: o2, shiftKey: l } = e2, c2 = n2 === "keydown", u2 = c2 && s2 === this.lastKey;
    if (r2 || a2 || o2 || l)
      return;
    if (!s2)
      return;
    if (c2) {
      const n3 = document.activeElement;
      if (is.element(n3)) {
        const { editable: s3 } = t2.config.selectors, { seek: r3 } = i2.inputs;
        if (n3 !== r3 && matches(n3, s3))
          return;
        if (e2.key === "Space" && matches(n3, 'button, [role^="menuitem"]'))
          return;
      }
      switch (["Space", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "c", "f", "k", "l", "m"].includes(s2) && (e2.preventDefault(), e2.stopPropagation()), s2) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          u2 || (d = parseInt(s2, 10), t2.currentTime = t2.duration / 10 * d);
          break;
        case "Space":
        case "k":
          u2 || silencePromise(t2.togglePlay());
          break;
        case "ArrowUp":
          t2.increaseVolume(0.1);
          break;
        case "ArrowDown":
          t2.decreaseVolume(0.1);
          break;
        case "m":
          u2 || (t2.muted = !t2.muted);
          break;
        case "ArrowRight":
          t2.forward();
          break;
        case "ArrowLeft":
          t2.rewind();
          break;
        case "f":
          t2.fullscreen.toggle();
          break;
        case "c":
          u2 || t2.toggleCaptions();
          break;
        case "l":
          t2.loop = !t2.loop;
      }
      s2 === "Escape" && !t2.fullscreen.usingNative && t2.fullscreen.active && t2.fullscreen.toggle(), this.lastKey = s2;
    } else
      this.lastKey = null;
    var d;
  }
  toggleMenu(e2) {
    controls.toggleMenu.call(this.player, e2);
  }
}
function createCommonjsModule(e2, t2) {
  return e2(t2 = { exports: {} }, t2.exports), t2.exports;
}
var loadjs_umd = createCommonjsModule(function(e2, t2) {
  e2.exports = function() {
    var e3 = function() {
    }, t3 = {}, i2 = {}, s2 = {};
    function n2(e4, t4) {
      e4 = e4.push ? e4 : [e4];
      var n3, r3, a3, o3 = [], l2 = e4.length, c3 = l2;
      for (n3 = function(e5, i3) {
        i3.length && o3.push(e5), --c3 || t4(o3);
      }; l2--; )
        r3 = e4[l2], (a3 = i2[r3]) ? n3(r3, a3) : (s2[r3] = s2[r3] || []).push(n3);
    }
    function r2(e4, t4) {
      if (e4) {
        var n3 = s2[e4];
        if (i2[e4] = t4, n3)
          for (; n3.length; )
            n3[0](e4, t4), n3.splice(0, 1);
      }
    }
    function a2(t4, i3) {
      t4.call && (t4 = { success: t4 }), i3.length ? (t4.error || e3)(i3) : (t4.success || e3)(t4);
    }
    function o2(t4, i3, s3, n3) {
      var r3, a3, l2 = document, c3 = s3.async, u2 = (s3.numRetries || 0) + 1, d = s3.before || e3, h2 = t4.replace(/[\?|#].*$/, ""), m = t4.replace(/^(css|img)!/, "");
      n3 = n3 || 0, /(^css!|\.css$)/.test(h2) ? ((a3 = l2.createElement("link")).rel = "stylesheet", a3.href = m, (r3 = "hideFocus" in a3) && a3.relList && (r3 = 0, a3.rel = "preload", a3.as = "style")) : /(^img!|\.(png|gif|jpg|svg|webp)$)/.test(h2) ? (a3 = l2.createElement("img")).src = m : ((a3 = l2.createElement("script")).src = t4, a3.async = c3 === void 0 || c3), a3.onload = a3.onerror = a3.onbeforeload = function(e4) {
        var l3 = e4.type[0];
        if (r3)
          try {
            a3.sheet.cssText.length || (l3 = "e");
          } catch (e5) {
            e5.code != 18 && (l3 = "e");
          }
        if (l3 == "e") {
          if ((n3 += 1) < u2)
            return o2(t4, i3, s3, n3);
        } else if (a3.rel == "preload" && a3.as == "style")
          return a3.rel = "stylesheet";
        i3(t4, l3, e4.defaultPrevented);
      }, d(t4, a3) !== false && l2.head.appendChild(a3);
    }
    function l(e4, t4, i3) {
      var s3, n3, r3 = (e4 = e4.push ? e4 : [e4]).length, a3 = r3, l2 = [];
      for (s3 = function(e5, i4, s4) {
        if (i4 == "e" && l2.push(e5), i4 == "b") {
          if (!s4)
            return;
          l2.push(e5);
        }
        --r3 || t4(l2);
      }, n3 = 0; n3 < a3; n3++)
        o2(e4[n3], s3, i3);
    }
    function c2(e4, i3, s3) {
      var n3, o3;
      if (i3 && i3.trim && (n3 = i3), o3 = (n3 ? s3 : i3) || {}, n3) {
        if (n3 in t3)
          throw "LoadJS";
        t3[n3] = true;
      }
      function c3(t4, i4) {
        l(e4, function(e5) {
          a2(o3, e5), t4 && a2({ success: t4, error: i4 }, e5), r2(n3, e5);
        }, o3);
      }
      if (o3.returnPromise)
        return new Promise(c3);
      c3();
    }
    return c2.ready = function(e4, t4) {
      return n2(e4, function(e5) {
        a2(t4, e5);
      }), c2;
    }, c2.done = function(e4) {
      r2(e4, []);
    }, c2.reset = function() {
      t3 = {}, i2 = {}, s2 = {};
    }, c2.isDefined = function(e4) {
      return e4 in t3;
    }, c2;
  }();
});
function loadScript(e2) {
  return new Promise((t2, i2) => {
    loadjs_umd(e2, { success: t2, error: i2 });
  });
}
function parseId$1(e2) {
  if (is.empty(e2))
    return null;
  if (is.number(Number(e2)))
    return e2;
  return e2.match(/^.*(vimeo.com\/|video\/)(\d+).*/) ? RegExp.$2 : e2;
}
function parseHash(e2) {
  const t2 = e2.match(/^.*(vimeo.com\/|video\/)(\d+)(\?.*&*h=|\/)+([\d,a-f]+)/);
  return t2 && t2.length === 5 ? t2[4] : null;
}
function assurePlaybackState$1(e2) {
  e2 && !this.embed.hasPlayed && (this.embed.hasPlayed = true), this.media.paused === e2 && (this.media.paused = !e2, triggerEvent.call(this, this.media, e2 ? "play" : "pause"));
}
const vimeo = { setup() {
  const e2 = this;
  toggleClass(e2.elements.wrapper, e2.config.classNames.embed, true), e2.options.speed = e2.config.speed.options, setAspectRatio.call(e2), is.object(window.Vimeo) ? vimeo.ready.call(e2) : loadScript(e2.config.urls.vimeo.sdk).then(() => {
    vimeo.ready.call(e2);
  }).catch((t2) => {
    e2.debug.warn("Vimeo SDK (player.js) failed to load", t2);
  });
}, ready() {
  const e2 = this, t2 = e2.config.vimeo, _a2 = t2, { premium: i2, referrerPolicy: s2 } = _a2, n2 = __objRest(_a2, ["premium", "referrerPolicy"]);
  let r2 = e2.media.getAttribute("src"), a2 = "";
  is.empty(r2) ? (r2 = e2.media.getAttribute(e2.config.attributes.embed.id), a2 = e2.media.getAttribute(e2.config.attributes.embed.hash)) : a2 = parseHash(r2);
  const o2 = a2 ? { h: a2 } : {};
  i2 && Object.assign(n2, { controls: false, sidedock: false });
  const l = buildUrlParams(__spreadValues(__spreadValues({ loop: e2.config.loop.active, autoplay: e2.autoplay, muted: e2.muted, gesture: "media", playsinline: !this.config.fullscreen.iosNative }, o2), n2)), c2 = parseId$1(r2), u2 = createElement("iframe"), d = format(e2.config.urls.vimeo.iframe, c2, l);
  if (u2.setAttribute("src", d), u2.setAttribute("allowfullscreen", ""), u2.setAttribute("allow", ["autoplay", "fullscreen", "picture-in-picture", "encrypted-media", "accelerometer", "gyroscope"].join("; ")), is.empty(s2) || u2.setAttribute("referrerPolicy", s2), i2 || !t2.customControls)
    u2.setAttribute("data-poster", e2.poster), e2.media = replaceElement(u2, e2.media);
  else {
    const t3 = createElement("div", { class: e2.config.classNames.embedContainer, "data-poster": e2.poster });
    t3.appendChild(u2), e2.media = replaceElement(t3, e2.media);
  }
  t2.customControls || fetch$1(format(e2.config.urls.vimeo.api, d)).then((t3) => {
    !is.empty(t3) && t3.thumbnail_url && ui.setPoster.call(e2, t3.thumbnail_url).catch(() => {
    });
  }), e2.embed = new window.Vimeo.Player(u2, { autopause: e2.config.autopause, muted: e2.muted }), e2.media.paused = true, e2.media.currentTime = 0, e2.supported.ui && e2.embed.disableTextTrack(), e2.media.play = () => (assurePlaybackState$1.call(e2, true), e2.embed.play()), e2.media.pause = () => (assurePlaybackState$1.call(e2, false), e2.embed.pause()), e2.media.stop = () => {
    e2.pause(), e2.currentTime = 0;
  };
  let { currentTime: h2 } = e2.media;
  Object.defineProperty(e2.media, "currentTime", { get: () => h2, set(t3) {
    const { embed: i3, media: s3, paused: n3, volume: r3 } = e2, a3 = n3 && !i3.hasPlayed;
    s3.seeking = true, triggerEvent.call(e2, s3, "seeking"), Promise.resolve(a3 && i3.setVolume(0)).then(() => i3.setCurrentTime(t3)).then(() => a3 && i3.pause()).then(() => a3 && i3.setVolume(r3)).catch(() => {
    });
  } });
  let m = e2.config.speed.selected;
  Object.defineProperty(e2.media, "playbackRate", { get: () => m, set(t3) {
    e2.embed.setPlaybackRate(t3).then(() => {
      m = t3, triggerEvent.call(e2, e2.media, "ratechange");
    }).catch(() => {
      e2.options.speed = [1];
    });
  } });
  let { volume: p2 } = e2.config;
  Object.defineProperty(e2.media, "volume", { get: () => p2, set(t3) {
    e2.embed.setVolume(t3).then(() => {
      p2 = t3, triggerEvent.call(e2, e2.media, "volumechange");
    });
  } });
  let { muted: g } = e2.config;
  Object.defineProperty(e2.media, "muted", { get: () => g, set(t3) {
    const i3 = !!is.boolean(t3) && t3;
    e2.embed.setVolume(i3 ? 0 : e2.config.volume).then(() => {
      g = i3, triggerEvent.call(e2, e2.media, "volumechange");
    });
  } });
  let f2, { loop: y } = e2.config;
  Object.defineProperty(e2.media, "loop", { get: () => y, set(t3) {
    const i3 = is.boolean(t3) ? t3 : e2.config.loop.active;
    e2.embed.setLoop(i3).then(() => {
      y = i3;
    });
  } }), e2.embed.getVideoUrl().then((t3) => {
    f2 = t3, controls.setDownloadUrl.call(e2);
  }).catch((e3) => {
    this.debug.warn(e3);
  }), Object.defineProperty(e2.media, "currentSrc", { get: () => f2 }), Object.defineProperty(e2.media, "ended", { get: () => e2.currentTime === e2.duration }), Promise.all([e2.embed.getVideoWidth(), e2.embed.getVideoHeight()]).then((t3) => {
    const [i3, s3] = t3;
    e2.embed.ratio = roundAspectRatio(i3, s3), setAspectRatio.call(this);
  }), e2.embed.setAutopause(e2.config.autopause).then((t3) => {
    e2.config.autopause = t3;
  }), e2.embed.getVideoTitle().then((t3) => {
    e2.config.title = t3, ui.setTitle.call(this);
  }), e2.embed.getCurrentTime().then((t3) => {
    h2 = t3, triggerEvent.call(e2, e2.media, "timeupdate");
  }), e2.embed.getDuration().then((t3) => {
    e2.media.duration = t3, triggerEvent.call(e2, e2.media, "durationchange");
  }), e2.embed.getTextTracks().then((t3) => {
    e2.media.textTracks = t3, captions.setup.call(e2);
  }), e2.embed.on("cuechange", ({ cues: t3 = [] }) => {
    const i3 = t3.map((e3) => stripHTML(e3.text));
    captions.updateCues.call(e2, i3);
  }), e2.embed.on("loaded", () => {
    if (e2.embed.getPaused().then((t3) => {
      assurePlaybackState$1.call(e2, !t3), t3 || triggerEvent.call(e2, e2.media, "playing");
    }), is.element(e2.embed.element) && e2.supported.ui) {
      e2.embed.element.setAttribute("tabindex", -1);
    }
  }), e2.embed.on("bufferstart", () => {
    triggerEvent.call(e2, e2.media, "waiting");
  }), e2.embed.on("bufferend", () => {
    triggerEvent.call(e2, e2.media, "playing");
  }), e2.embed.on("play", () => {
    assurePlaybackState$1.call(e2, true), triggerEvent.call(e2, e2.media, "playing");
  }), e2.embed.on("pause", () => {
    assurePlaybackState$1.call(e2, false);
  }), e2.embed.on("timeupdate", (t3) => {
    e2.media.seeking = false, h2 = t3.seconds, triggerEvent.call(e2, e2.media, "timeupdate");
  }), e2.embed.on("progress", (t3) => {
    e2.media.buffered = t3.percent, triggerEvent.call(e2, e2.media, "progress"), parseInt(t3.percent, 10) === 1 && triggerEvent.call(e2, e2.media, "canplaythrough"), e2.embed.getDuration().then((t4) => {
      t4 !== e2.media.duration && (e2.media.duration = t4, triggerEvent.call(e2, e2.media, "durationchange"));
    });
  }), e2.embed.on("seeked", () => {
    e2.media.seeking = false, triggerEvent.call(e2, e2.media, "seeked");
  }), e2.embed.on("ended", () => {
    e2.media.paused = true, triggerEvent.call(e2, e2.media, "ended");
  }), e2.embed.on("error", (t3) => {
    e2.media.error = t3, triggerEvent.call(e2, e2.media, "error");
  }), t2.customControls && setTimeout(() => ui.build.call(e2), 0);
} };
function parseId(e2) {
  if (is.empty(e2))
    return null;
  return e2.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/) ? RegExp.$2 : e2;
}
function assurePlaybackState(e2) {
  e2 && !this.embed.hasPlayed && (this.embed.hasPlayed = true), this.media.paused === e2 && (this.media.paused = !e2, triggerEvent.call(this, this.media, e2 ? "play" : "pause"));
}
function getHost(e2) {
  return e2.noCookie ? "https://www.youtube-nocookie.com" : window.location.protocol === "http:" ? "http://www.youtube.com" : void 0;
}
const youtube = { setup() {
  if (toggleClass(this.elements.wrapper, this.config.classNames.embed, true), is.object(window.YT) && is.function(window.YT.Player))
    youtube.ready.call(this);
  else {
    const e2 = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      is.function(e2) && e2(), youtube.ready.call(this);
    }, loadScript(this.config.urls.youtube.sdk).catch((e3) => {
      this.debug.warn("YouTube API failed to load", e3);
    });
  }
}, getTitle(e2) {
  fetch$1(format(this.config.urls.youtube.api, e2)).then((e3) => {
    if (is.object(e3)) {
      const { title: t2, height: i2, width: s2 } = e3;
      this.config.title = t2, ui.setTitle.call(this), this.embed.ratio = roundAspectRatio(s2, i2);
    }
    setAspectRatio.call(this);
  }).catch(() => {
    setAspectRatio.call(this);
  });
}, ready() {
  const e2 = this, t2 = e2.config.youtube, i2 = e2.media && e2.media.getAttribute("id");
  if (!is.empty(i2) && i2.startsWith("youtube-"))
    return;
  let s2 = e2.media.getAttribute("src");
  is.empty(s2) && (s2 = e2.media.getAttribute(this.config.attributes.embed.id));
  const n2 = parseId(s2), r2 = createElement("div", { id: generateId(e2.provider), "data-poster": t2.customControls ? e2.poster : void 0 });
  if (e2.media = replaceElement(r2, e2.media), t2.customControls) {
    const t3 = (e3) => `https://i.ytimg.com/vi/${n2}/${e3}default.jpg`;
    loadImage(t3("maxres"), 121).catch(() => loadImage(t3("sd"), 121)).catch(() => loadImage(t3("hq"))).then((t4) => ui.setPoster.call(e2, t4.src)).then((t4) => {
      t4.includes("maxres") || (e2.elements.poster.style.backgroundSize = "cover");
    }).catch(() => {
    });
  }
  e2.embed = new window.YT.Player(e2.media, { videoId: n2, host: getHost(t2), playerVars: extend$1({}, { autoplay: e2.config.autoplay ? 1 : 0, hl: e2.config.hl, controls: e2.supported.ui && t2.customControls ? 0 : 1, disablekb: 1, playsinline: e2.config.fullscreen.iosNative ? 0 : 1, cc_load_policy: e2.captions.active ? 1 : 0, cc_lang_pref: e2.config.captions.language, widget_referrer: window ? window.location.href : null }, t2), events: { onError(t3) {
    if (!e2.media.error) {
      const i3 = t3.data, s3 = { 2: "The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.", 5: "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.", 100: "The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.", 101: "The owner of the requested video does not allow it to be played in embedded players.", 150: "The owner of the requested video does not allow it to be played in embedded players." }[i3] || "An unknown error occured";
      e2.media.error = { code: i3, message: s3 }, triggerEvent.call(e2, e2.media, "error");
    }
  }, onPlaybackRateChange(t3) {
    const i3 = t3.target;
    e2.media.playbackRate = i3.getPlaybackRate(), triggerEvent.call(e2, e2.media, "ratechange");
  }, onReady(i3) {
    if (is.function(e2.media.play))
      return;
    const s3 = i3.target;
    youtube.getTitle.call(e2, n2), e2.media.play = () => {
      assurePlaybackState.call(e2, true), s3.playVideo();
    }, e2.media.pause = () => {
      assurePlaybackState.call(e2, false), s3.pauseVideo();
    }, e2.media.stop = () => {
      s3.stopVideo();
    }, e2.media.duration = s3.getDuration(), e2.media.paused = true, e2.media.currentTime = 0, Object.defineProperty(e2.media, "currentTime", { get: () => Number(s3.getCurrentTime()), set(t3) {
      e2.paused && !e2.embed.hasPlayed && e2.embed.mute(), e2.media.seeking = true, triggerEvent.call(e2, e2.media, "seeking"), s3.seekTo(t3);
    } }), Object.defineProperty(e2.media, "playbackRate", { get: () => s3.getPlaybackRate(), set(e3) {
      s3.setPlaybackRate(e3);
    } });
    let { volume: r3 } = e2.config;
    Object.defineProperty(e2.media, "volume", { get: () => r3, set(t3) {
      r3 = t3, s3.setVolume(100 * r3), triggerEvent.call(e2, e2.media, "volumechange");
    } });
    let { muted: a2 } = e2.config;
    Object.defineProperty(e2.media, "muted", { get: () => a2, set(t3) {
      const i4 = is.boolean(t3) ? t3 : a2;
      a2 = i4, s3[i4 ? "mute" : "unMute"](), s3.setVolume(100 * r3), triggerEvent.call(e2, e2.media, "volumechange");
    } }), Object.defineProperty(e2.media, "currentSrc", { get: () => s3.getVideoUrl() }), Object.defineProperty(e2.media, "ended", { get: () => e2.currentTime === e2.duration });
    const o2 = s3.getAvailablePlaybackRates();
    e2.options.speed = o2.filter((t3) => e2.config.speed.options.includes(t3)), e2.supported.ui && t2.customControls && e2.media.setAttribute("tabindex", -1), triggerEvent.call(e2, e2.media, "timeupdate"), triggerEvent.call(e2, e2.media, "durationchange"), clearInterval(e2.timers.buffering), e2.timers.buffering = setInterval(() => {
      e2.media.buffered = s3.getVideoLoadedFraction(), (e2.media.lastBuffered === null || e2.media.lastBuffered < e2.media.buffered) && triggerEvent.call(e2, e2.media, "progress"), e2.media.lastBuffered = e2.media.buffered, e2.media.buffered === 1 && (clearInterval(e2.timers.buffering), triggerEvent.call(e2, e2.media, "canplaythrough"));
    }, 200), t2.customControls && setTimeout(() => ui.build.call(e2), 50);
  }, onStateChange(i3) {
    const s3 = i3.target;
    clearInterval(e2.timers.playing);
    switch (e2.media.seeking && [1, 2].includes(i3.data) && (e2.media.seeking = false, triggerEvent.call(e2, e2.media, "seeked")), i3.data) {
      case -1:
        triggerEvent.call(e2, e2.media, "timeupdate"), e2.media.buffered = s3.getVideoLoadedFraction(), triggerEvent.call(e2, e2.media, "progress");
        break;
      case 0:
        assurePlaybackState.call(e2, false), e2.media.loop ? (s3.stopVideo(), s3.playVideo()) : triggerEvent.call(e2, e2.media, "ended");
        break;
      case 1:
        t2.customControls && !e2.config.autoplay && e2.media.paused && !e2.embed.hasPlayed ? e2.media.pause() : (assurePlaybackState.call(e2, true), triggerEvent.call(e2, e2.media, "playing"), e2.timers.playing = setInterval(() => {
          triggerEvent.call(e2, e2.media, "timeupdate");
        }, 50), e2.media.duration !== s3.getDuration() && (e2.media.duration = s3.getDuration(), triggerEvent.call(e2, e2.media, "durationchange")));
        break;
      case 2:
        e2.muted || e2.embed.unMute(), assurePlaybackState.call(e2, false);
        break;
      case 3:
        triggerEvent.call(e2, e2.media, "waiting");
    }
    triggerEvent.call(e2, e2.elements.container, "statechange", false, { code: i3.data });
  } } });
} }, media = { setup() {
  this.media ? (toggleClass(this.elements.container, this.config.classNames.type.replace("{0}", this.type), true), toggleClass(this.elements.container, this.config.classNames.provider.replace("{0}", this.provider), true), this.isEmbed && toggleClass(this.elements.container, this.config.classNames.type.replace("{0}", "video"), true), this.isVideo && (this.elements.wrapper = createElement("div", { class: this.config.classNames.video }), wrap(this.media, this.elements.wrapper), this.elements.poster = createElement("div", { class: this.config.classNames.poster }), this.elements.wrapper.appendChild(this.elements.poster)), this.isHTML5 ? html5.setup.call(this) : this.isYouTube ? youtube.setup.call(this) : this.isVimeo && vimeo.setup.call(this)) : this.debug.warn("No media element found!");
} };
class Ads {
  constructor(e2) {
    _defineProperty$1(this, "load", () => {
      this.enabled && (is.object(window.google) && is.object(window.google.ima) ? this.ready() : loadScript(this.player.config.urls.googleIMA.sdk).then(() => {
        this.ready();
      }).catch(() => {
        this.trigger("error", new Error("Google IMA SDK failed to load"));
      }));
    }), _defineProperty$1(this, "ready", () => {
      var e3;
      this.enabled || ((e3 = this).manager && e3.manager.destroy(), e3.elements.displayContainer && e3.elements.displayContainer.destroy(), e3.elements.container.remove()), this.startSafetyTimer(12e3, "ready()"), this.managerPromise.then(() => {
        this.clearSafetyTimer("onAdsManagerLoaded()");
      }), this.listeners(), this.setupIMA();
    }), _defineProperty$1(this, "setupIMA", () => {
      this.elements.container = createElement("div", { class: this.player.config.classNames.ads }), this.player.elements.container.appendChild(this.elements.container), google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED), google.ima.settings.setLocale(this.player.config.ads.language), google.ima.settings.setDisableCustomPlaybackForIOS10Plus(this.player.config.playsinline), this.elements.displayContainer = new google.ima.AdDisplayContainer(this.elements.container, this.player.media), this.loader = new google.ima.AdsLoader(this.elements.displayContainer), this.loader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, (e3) => this.onAdsManagerLoaded(e3), false), this.loader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e3) => this.onAdError(e3), false), this.requestAds();
    }), _defineProperty$1(this, "requestAds", () => {
      const { container: e3 } = this.player.elements;
      try {
        const t2 = new google.ima.AdsRequest();
        t2.adTagUrl = this.tagUrl, t2.linearAdSlotWidth = e3.offsetWidth, t2.linearAdSlotHeight = e3.offsetHeight, t2.nonLinearAdSlotWidth = e3.offsetWidth, t2.nonLinearAdSlotHeight = e3.offsetHeight, t2.forceNonLinearFullSlot = false, t2.setAdWillPlayMuted(!this.player.muted), this.loader.requestAds(t2);
      } catch (e4) {
        this.onAdError(e4);
      }
    }), _defineProperty$1(this, "pollCountdown", (e3 = false) => {
      if (!e3)
        return clearInterval(this.countdownTimer), void this.elements.container.removeAttribute("data-badge-text");
      this.countdownTimer = setInterval(() => {
        const e4 = formatTime(Math.max(this.manager.getRemainingTime(), 0)), t2 = `${i18n.get("advertisement", this.player.config)} - ${e4}`;
        this.elements.container.setAttribute("data-badge-text", t2);
      }, 100);
    }), _defineProperty$1(this, "onAdsManagerLoaded", (e3) => {
      if (!this.enabled)
        return;
      const t2 = new google.ima.AdsRenderingSettings();
      t2.restoreCustomPlaybackStateOnAdBreakComplete = true, t2.enablePreloading = true, this.manager = e3.getAdsManager(this.player, t2), this.cuePoints = this.manager.getCuePoints(), this.manager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e4) => this.onAdError(e4)), Object.keys(google.ima.AdEvent.Type).forEach((e4) => {
        this.manager.addEventListener(google.ima.AdEvent.Type[e4], (e5) => this.onAdEvent(e5));
      }), this.trigger("loaded");
    }), _defineProperty$1(this, "addCuePoints", () => {
      is.empty(this.cuePoints) || this.cuePoints.forEach((e3) => {
        if (e3 !== 0 && e3 !== -1 && e3 < this.player.duration) {
          const t2 = this.player.elements.progress;
          if (is.element(t2)) {
            const i2 = 100 / this.player.duration * e3, s2 = createElement("span", { class: this.player.config.classNames.cues });
            s2.style.left = `${i2.toString()}%`, t2.appendChild(s2);
          }
        }
      });
    }), _defineProperty$1(this, "onAdEvent", (e3) => {
      const { container: t2 } = this.player.elements, i2 = e3.getAd(), s2 = e3.getAdData();
      switch (((e4) => {
        triggerEvent.call(this.player, this.player.media, `ads${e4.replace(/_/g, "").toLowerCase()}`);
      })(e3.type), e3.type) {
        case google.ima.AdEvent.Type.LOADED:
          this.trigger("loaded"), this.pollCountdown(true), i2.isLinear() || (i2.width = t2.offsetWidth, i2.height = t2.offsetHeight);
          break;
        case google.ima.AdEvent.Type.STARTED:
          this.manager.setVolume(this.player.volume);
          break;
        case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
          this.player.ended ? this.loadAds() : this.loader.contentComplete();
          break;
        case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
          this.pauseContent();
          break;
        case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
          this.pollCountdown(), this.resumeContent();
          break;
        case google.ima.AdEvent.Type.LOG:
          s2.adError && this.player.debug.warn(`Non-fatal ad error: ${s2.adError.getMessage()}`);
      }
    }), _defineProperty$1(this, "onAdError", (e3) => {
      this.cancel(), this.player.debug.warn("Ads error", e3);
    }), _defineProperty$1(this, "listeners", () => {
      const { container: e3 } = this.player.elements;
      let t2;
      this.player.on("canplay", () => {
        this.addCuePoints();
      }), this.player.on("ended", () => {
        this.loader.contentComplete();
      }), this.player.on("timeupdate", () => {
        t2 = this.player.currentTime;
      }), this.player.on("seeked", () => {
        const e4 = this.player.currentTime;
        is.empty(this.cuePoints) || this.cuePoints.forEach((i2, s2) => {
          t2 < i2 && i2 < e4 && (this.manager.discardAdBreak(), this.cuePoints.splice(s2, 1));
        });
      }), window.addEventListener("resize", () => {
        this.manager && this.manager.resize(e3.offsetWidth, e3.offsetHeight, google.ima.ViewMode.NORMAL);
      });
    }), _defineProperty$1(this, "play", () => {
      const { container: e3 } = this.player.elements;
      this.managerPromise || this.resumeContent(), this.managerPromise.then(() => {
        this.manager.setVolume(this.player.volume), this.elements.displayContainer.initialize();
        try {
          this.initialized || (this.manager.init(e3.offsetWidth, e3.offsetHeight, google.ima.ViewMode.NORMAL), this.manager.start()), this.initialized = true;
        } catch (e4) {
          this.onAdError(e4);
        }
      }).catch(() => {
      });
    }), _defineProperty$1(this, "resumeContent", () => {
      this.elements.container.style.zIndex = "", this.playing = false, silencePromise(this.player.media.play());
    }), _defineProperty$1(this, "pauseContent", () => {
      this.elements.container.style.zIndex = 3, this.playing = true, this.player.media.pause();
    }), _defineProperty$1(this, "cancel", () => {
      this.initialized && this.resumeContent(), this.trigger("error"), this.loadAds();
    }), _defineProperty$1(this, "loadAds", () => {
      this.managerPromise.then(() => {
        this.manager && this.manager.destroy(), this.managerPromise = new Promise((e3) => {
          this.on("loaded", e3), this.player.debug.log(this.manager);
        }), this.initialized = false, this.requestAds();
      }).catch(() => {
      });
    }), _defineProperty$1(this, "trigger", (e3, ...t2) => {
      const i2 = this.events[e3];
      is.array(i2) && i2.forEach((e4) => {
        is.function(e4) && e4.apply(this, t2);
      });
    }), _defineProperty$1(this, "on", (e3, t2) => (is.array(this.events[e3]) || (this.events[e3] = []), this.events[e3].push(t2), this)), _defineProperty$1(this, "startSafetyTimer", (e3, t2) => {
      this.player.debug.log(`Safety timer invoked from: ${t2}`), this.safetyTimer = setTimeout(() => {
        this.cancel(), this.clearSafetyTimer("startSafetyTimer()");
      }, e3);
    }), _defineProperty$1(this, "clearSafetyTimer", (e3) => {
      is.nullOrUndefined(this.safetyTimer) || (this.player.debug.log(`Safety timer cleared from: ${e3}`), clearTimeout(this.safetyTimer), this.safetyTimer = null);
    }), this.player = e2, this.config = e2.config.ads, this.playing = false, this.initialized = false, this.elements = { container: null, displayContainer: null }, this.manager = null, this.loader = null, this.cuePoints = null, this.events = {}, this.safetyTimer = null, this.countdownTimer = null, this.managerPromise = new Promise((e3, t2) => {
      this.on("loaded", e3), this.on("error", t2);
    }), this.load();
  }
  get enabled() {
    const { config: e2 } = this;
    return this.player.isHTML5 && this.player.isVideo && e2.enabled && (!is.empty(e2.publisherId) || is.url(e2.tagUrl));
  }
  get tagUrl() {
    const { config: e2 } = this;
    if (is.url(e2.tagUrl))
      return e2.tagUrl;
    return `https://go.aniview.com/api/adserver6/vast/?${buildUrlParams({ AV_PUBLISHERID: "58c25bb0073ef448b1087ad6", AV_CHANNELID: "5a0458dc28a06145e4519d21", AV_URL: window.location.hostname, cb: Date.now(), AV_WIDTH: 640, AV_HEIGHT: 480, AV_CDIM2: e2.publisherId })}`;
  }
}
function clamp(e2 = 0, t2 = 0, i2 = 255) {
  return Math.min(Math.max(e2, t2), i2);
}
const parseVtt = (e2) => {
  const t2 = [];
  return e2.split(/\r\n\r\n|\n\n|\r\r/).forEach((e3) => {
    const i2 = {};
    e3.split(/\r\n|\n|\r/).forEach((e4) => {
      if (is.number(i2.startTime)) {
        if (!is.empty(e4.trim()) && is.empty(i2.text)) {
          const t3 = e4.trim().split("#xywh=");
          [i2.text] = t3, t3[1] && ([i2.x, i2.y, i2.w, i2.h] = t3[1].split(","));
        }
      } else {
        const t3 = e4.match(/([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})/);
        t3 && (i2.startTime = 60 * Number(t3[1] || 0) * 60 + 60 * Number(t3[2]) + Number(t3[3]) + Number(`0.${t3[4]}`), i2.endTime = 60 * Number(t3[6] || 0) * 60 + 60 * Number(t3[7]) + Number(t3[8]) + Number(`0.${t3[9]}`));
      }
    }), i2.text && t2.push(i2);
  }), t2;
}, fitRatio = (e2, t2) => {
  const i2 = {};
  return e2 > t2.width / t2.height ? (i2.width = t2.width, i2.height = 1 / e2 * t2.width) : (i2.height = t2.height, i2.width = e2 * t2.height), i2;
};
class PreviewThumbnails {
  constructor(e2) {
    _defineProperty$1(this, "load", () => {
      this.player.elements.display.seekTooltip && (this.player.elements.display.seekTooltip.hidden = this.enabled), this.enabled && this.getThumbnails().then(() => {
        this.enabled && (this.render(), this.determineContainerAutoSizing(), this.loaded = true);
      });
    }), _defineProperty$1(this, "getThumbnails", () => new Promise((e3) => {
      const { src: t2 } = this.player.config.previewThumbnails;
      if (is.empty(t2))
        throw new Error("Missing previewThumbnails.src config attribute");
      const i2 = () => {
        this.thumbnails.sort((e4, t3) => e4.height - t3.height), this.player.debug.log("Preview thumbnails", this.thumbnails), e3();
      };
      if (is.function(t2))
        t2((e4) => {
          this.thumbnails = e4, i2();
        });
      else {
        const e4 = (is.string(t2) ? [t2] : t2).map((e5) => this.getThumbnail(e5));
        Promise.all(e4).then(i2);
      }
    })), _defineProperty$1(this, "getThumbnail", (e3) => new Promise((t2) => {
      fetch$1(e3).then((i2) => {
        const s2 = { frames: parseVtt(i2), height: null, urlPrefix: "" };
        s2.frames[0].text.startsWith("/") || s2.frames[0].text.startsWith("http://") || s2.frames[0].text.startsWith("https://") || (s2.urlPrefix = e3.substring(0, e3.lastIndexOf("/") + 1));
        const n2 = new Image();
        n2.onload = () => {
          s2.height = n2.naturalHeight, s2.width = n2.naturalWidth, this.thumbnails.push(s2), t2();
        }, n2.src = s2.urlPrefix + s2.frames[0].text;
      });
    })), _defineProperty$1(this, "startMove", (e3) => {
      if (this.loaded && is.event(e3) && ["touchmove", "mousemove"].includes(e3.type) && this.player.media.duration) {
        if (e3.type === "touchmove")
          this.seekTime = this.player.media.duration * (this.player.elements.inputs.seek.value / 100);
        else {
          var t2, i2;
          const s2 = this.player.elements.progress.getBoundingClientRect(), n2 = 100 / s2.width * (e3.pageX - s2.left);
          this.seekTime = this.player.media.duration * (n2 / 100), this.seekTime < 0 && (this.seekTime = 0), this.seekTime > this.player.media.duration - 1 && (this.seekTime = this.player.media.duration - 1), this.mousePosX = e3.pageX, this.elements.thumb.time.innerText = formatTime(this.seekTime);
          const r2 = (t2 = this.player.config.markers) === null || t2 === void 0 || (i2 = t2.points) === null || i2 === void 0 ? void 0 : i2.find(({ time: e4 }) => e4 === Math.round(this.seekTime));
          r2 && this.elements.thumb.time.insertAdjacentHTML("afterbegin", `${r2.label}<br>`);
        }
        this.showImageAtCurrentTime();
      }
    }), _defineProperty$1(this, "endMove", () => {
      this.toggleThumbContainer(false, true);
    }), _defineProperty$1(this, "startScrubbing", (e3) => {
      (is.nullOrUndefined(e3.button) || e3.button === false || e3.button === 0) && (this.mouseDown = true, this.player.media.duration && (this.toggleScrubbingContainer(true), this.toggleThumbContainer(false, true), this.showImageAtCurrentTime()));
    }), _defineProperty$1(this, "endScrubbing", () => {
      this.mouseDown = false, Math.ceil(this.lastTime) === Math.ceil(this.player.media.currentTime) ? this.toggleScrubbingContainer(false) : once.call(this.player, this.player.media, "timeupdate", () => {
        this.mouseDown || this.toggleScrubbingContainer(false);
      });
    }), _defineProperty$1(this, "listeners", () => {
      this.player.on("play", () => {
        this.toggleThumbContainer(false, true);
      }), this.player.on("seeked", () => {
        this.toggleThumbContainer(false);
      }), this.player.on("timeupdate", () => {
        this.lastTime = this.player.media.currentTime;
      });
    }), _defineProperty$1(this, "render", () => {
      this.elements.thumb.container = createElement("div", { class: this.player.config.classNames.previewThumbnails.thumbContainer }), this.elements.thumb.imageContainer = createElement("div", { class: this.player.config.classNames.previewThumbnails.imageContainer }), this.elements.thumb.container.appendChild(this.elements.thumb.imageContainer);
      const e3 = createElement("div", { class: this.player.config.classNames.previewThumbnails.timeContainer });
      this.elements.thumb.time = createElement("span", {}, "00:00"), e3.appendChild(this.elements.thumb.time), this.elements.thumb.imageContainer.appendChild(e3), is.element(this.player.elements.progress) && this.player.elements.progress.appendChild(this.elements.thumb.container), this.elements.scrubbing.container = createElement("div", { class: this.player.config.classNames.previewThumbnails.scrubbingContainer }), this.player.elements.wrapper.appendChild(this.elements.scrubbing.container);
    }), _defineProperty$1(this, "destroy", () => {
      this.elements.thumb.container && this.elements.thumb.container.remove(), this.elements.scrubbing.container && this.elements.scrubbing.container.remove();
    }), _defineProperty$1(this, "showImageAtCurrentTime", () => {
      this.mouseDown ? this.setScrubbingContainerSize() : this.setThumbContainerSizeAndPos();
      const e3 = this.thumbnails[0].frames.findIndex((e4) => this.seekTime >= e4.startTime && this.seekTime <= e4.endTime), t2 = e3 >= 0;
      let i2 = 0;
      this.mouseDown || this.toggleThumbContainer(t2), t2 && (this.thumbnails.forEach((t3, s2) => {
        this.loadedImages.includes(t3.frames[e3].text) && (i2 = s2);
      }), e3 !== this.showingThumb && (this.showingThumb = e3, this.loadImage(i2)));
    }), _defineProperty$1(this, "loadImage", (e3 = 0) => {
      const t2 = this.showingThumb, i2 = this.thumbnails[e3], { urlPrefix: s2 } = i2, n2 = i2.frames[t2], r2 = i2.frames[t2].text, a2 = s2 + r2;
      if (this.currentImageElement && this.currentImageElement.dataset.filename === r2)
        this.showImage(this.currentImageElement, n2, e3, t2, r2, false), this.currentImageElement.dataset.index = t2, this.removeOldImages(this.currentImageElement);
      else {
        this.loadingImage && this.usingSprites && (this.loadingImage.onload = null);
        const i3 = new Image();
        i3.src = a2, i3.dataset.index = t2, i3.dataset.filename = r2, this.showingThumbFilename = r2, this.player.debug.log(`Loading image: ${a2}`), i3.onload = () => this.showImage(i3, n2, e3, t2, r2, true), this.loadingImage = i3, this.removeOldImages(i3);
      }
    }), _defineProperty$1(this, "showImage", (e3, t2, i2, s2, n2, r2 = true) => {
      this.player.debug.log(`Showing thumb: ${n2}. num: ${s2}. qual: ${i2}. newimg: ${r2}`), this.setImageSizeAndOffset(e3, t2), r2 && (this.currentImageContainer.appendChild(e3), this.currentImageElement = e3, this.loadedImages.includes(n2) || this.loadedImages.push(n2)), this.preloadNearby(s2, true).then(this.preloadNearby(s2, false)).then(this.getHigherQuality(i2, e3, t2, n2));
    }), _defineProperty$1(this, "removeOldImages", (e3) => {
      Array.from(this.currentImageContainer.children).forEach((t2) => {
        if (t2.tagName.toLowerCase() !== "img")
          return;
        const i2 = this.usingSprites ? 500 : 1e3;
        if (t2.dataset.index !== e3.dataset.index && !t2.dataset.deleting) {
          t2.dataset.deleting = true;
          const { currentImageContainer: e4 } = this;
          setTimeout(() => {
            e4.removeChild(t2), this.player.debug.log(`Removing thumb: ${t2.dataset.filename}`);
          }, i2);
        }
      });
    }), _defineProperty$1(this, "preloadNearby", (e3, t2 = true) => new Promise((i2) => {
      setTimeout(() => {
        const s2 = this.thumbnails[0].frames[e3].text;
        if (this.showingThumbFilename === s2) {
          let n2;
          n2 = t2 ? this.thumbnails[0].frames.slice(e3) : this.thumbnails[0].frames.slice(0, e3).reverse();
          let r2 = false;
          n2.forEach((e4) => {
            const t3 = e4.text;
            if (t3 !== s2 && !this.loadedImages.includes(t3)) {
              r2 = true, this.player.debug.log(`Preloading thumb filename: ${t3}`);
              const { urlPrefix: e5 } = this.thumbnails[0], s3 = e5 + t3, n3 = new Image();
              n3.src = s3, n3.onload = () => {
                this.player.debug.log(`Preloaded thumb filename: ${t3}`), this.loadedImages.includes(t3) || this.loadedImages.push(t3), i2();
              };
            }
          }), r2 || i2();
        }
      }, 300);
    })), _defineProperty$1(this, "getHigherQuality", (e3, t2, i2, s2) => {
      if (e3 < this.thumbnails.length - 1) {
        let n2 = t2.naturalHeight;
        this.usingSprites && (n2 = i2.h), n2 < this.thumbContainerHeight && setTimeout(() => {
          this.showingThumbFilename === s2 && (this.player.debug.log(`Showing higher quality thumb for: ${s2}`), this.loadImage(e3 + 1));
        }, 300);
      }
    }), _defineProperty$1(this, "toggleThumbContainer", (e3 = false, t2 = false) => {
      const i2 = this.player.config.classNames.previewThumbnails.thumbContainerShown;
      this.elements.thumb.container.classList.toggle(i2, e3), !e3 && t2 && (this.showingThumb = null, this.showingThumbFilename = null);
    }), _defineProperty$1(this, "toggleScrubbingContainer", (e3 = false) => {
      const t2 = this.player.config.classNames.previewThumbnails.scrubbingContainerShown;
      this.elements.scrubbing.container.classList.toggle(t2, e3), e3 || (this.showingThumb = null, this.showingThumbFilename = null);
    }), _defineProperty$1(this, "determineContainerAutoSizing", () => {
      (this.elements.thumb.imageContainer.clientHeight > 20 || this.elements.thumb.imageContainer.clientWidth > 20) && (this.sizeSpecifiedInCSS = true);
    }), _defineProperty$1(this, "setThumbContainerSizeAndPos", () => {
      const { imageContainer: e3 } = this.elements.thumb;
      if (this.sizeSpecifiedInCSS) {
        if (e3.clientHeight > 20 && e3.clientWidth < 20) {
          const t2 = Math.floor(e3.clientHeight * this.thumbAspectRatio);
          e3.style.width = `${t2}px`;
        } else if (e3.clientHeight < 20 && e3.clientWidth > 20) {
          const t2 = Math.floor(e3.clientWidth / this.thumbAspectRatio);
          e3.style.height = `${t2}px`;
        }
      } else {
        const t2 = Math.floor(this.thumbContainerHeight * this.thumbAspectRatio);
        e3.style.height = `${this.thumbContainerHeight}px`, e3.style.width = `${t2}px`;
      }
      this.setThumbContainerPos();
    }), _defineProperty$1(this, "setThumbContainerPos", () => {
      const e3 = this.player.elements.progress.getBoundingClientRect(), t2 = this.player.elements.container.getBoundingClientRect(), { container: i2 } = this.elements.thumb, s2 = t2.left - e3.left + 10, n2 = t2.right - e3.left - i2.clientWidth - 10, r2 = this.mousePosX - e3.left - i2.clientWidth / 2, a2 = clamp(r2, s2, n2);
      i2.style.left = `${a2}px`, i2.style.setProperty("--preview-arrow-offset", r2 - a2 + "px");
    }), _defineProperty$1(this, "setScrubbingContainerSize", () => {
      const { width: e3, height: t2 } = fitRatio(this.thumbAspectRatio, { width: this.player.media.clientWidth, height: this.player.media.clientHeight });
      this.elements.scrubbing.container.style.width = `${e3}px`, this.elements.scrubbing.container.style.height = `${t2}px`;
    }), _defineProperty$1(this, "setImageSizeAndOffset", (e3, t2) => {
      if (!this.usingSprites)
        return;
      const i2 = this.thumbContainerHeight / t2.h;
      e3.style.height = e3.naturalHeight * i2 + "px", e3.style.width = e3.naturalWidth * i2 + "px", e3.style.left = `-${t2.x * i2}px`, e3.style.top = `-${t2.y * i2}px`;
    }), this.player = e2, this.thumbnails = [], this.loaded = false, this.lastMouseMoveTime = Date.now(), this.mouseDown = false, this.loadedImages = [], this.elements = { thumb: {}, scrubbing: {} }, this.load();
  }
  get enabled() {
    return this.player.isHTML5 && this.player.isVideo && this.player.config.previewThumbnails.enabled;
  }
  get currentImageContainer() {
    return this.mouseDown ? this.elements.scrubbing.container : this.elements.thumb.imageContainer;
  }
  get usingSprites() {
    return Object.keys(this.thumbnails[0].frames[0]).includes("w");
  }
  get thumbAspectRatio() {
    return this.usingSprites ? this.thumbnails[0].frames[0].w / this.thumbnails[0].frames[0].h : this.thumbnails[0].width / this.thumbnails[0].height;
  }
  get thumbContainerHeight() {
    if (this.mouseDown) {
      const { height: e2 } = fitRatio(this.thumbAspectRatio, { width: this.player.media.clientWidth, height: this.player.media.clientHeight });
      return e2;
    }
    return this.sizeSpecifiedInCSS ? this.elements.thumb.imageContainer.clientHeight : Math.floor(this.player.media.clientWidth / this.thumbAspectRatio / 4);
  }
  get currentImageElement() {
    return this.mouseDown ? this.currentScrubbingImageElement : this.currentThumbnailImageElement;
  }
  set currentImageElement(e2) {
    this.mouseDown ? this.currentScrubbingImageElement = e2 : this.currentThumbnailImageElement = e2;
  }
}
const source = { insertElements(e2, t2) {
  is.string(t2) ? insertElement(e2, this.media, { src: t2 }) : is.array(t2) && t2.forEach((t3) => {
    insertElement(e2, this.media, t3);
  });
}, change(e2) {
  getDeep(e2, "sources.length") ? (html5.cancelRequests.call(this), this.destroy.call(this, () => {
    this.options.quality = [], removeElement(this.media), this.media = null, is.element(this.elements.container) && this.elements.container.removeAttribute("class");
    const { sources: t2, type: i2 } = e2, [{ provider: s2 = providers.html5, src: n2 }] = t2, r2 = s2 === "html5" ? i2 : "div", a2 = s2 === "html5" ? {} : { src: n2 };
    Object.assign(this, { provider: s2, type: i2, supported: support.check(i2, s2, this.config.playsinline), media: createElement(r2, a2) }), this.elements.container.appendChild(this.media), is.boolean(e2.autoplay) && (this.config.autoplay = e2.autoplay), this.isHTML5 && (this.config.crossorigin && this.media.setAttribute("crossorigin", ""), this.config.autoplay && this.media.setAttribute("autoplay", ""), is.empty(e2.poster) || (this.poster = e2.poster), this.config.loop.active && this.media.setAttribute("loop", ""), this.config.muted && this.media.setAttribute("muted", ""), this.config.playsinline && this.media.setAttribute("playsinline", "")), ui.addStyleHook.call(this), this.isHTML5 && source.insertElements.call(this, "source", t2), this.config.title = e2.title, media.setup.call(this), this.isHTML5 && Object.keys(e2).includes("tracks") && source.insertElements.call(this, "track", e2.tracks), (this.isHTML5 || this.isEmbed && !this.supported.ui) && ui.build.call(this), this.isHTML5 && this.media.load(), is.empty(e2.previewThumbnails) || (Object.assign(this.config.previewThumbnails, e2.previewThumbnails), this.previewThumbnails && this.previewThumbnails.loaded && (this.previewThumbnails.destroy(), this.previewThumbnails = null), this.config.previewThumbnails.enabled && (this.previewThumbnails = new PreviewThumbnails(this))), this.fullscreen.update();
  }, true)) : this.debug.warn("Invalid source format");
} };
class Plyr {
  constructor(e2, t2) {
    if (_defineProperty$1(this, "play", () => is.function(this.media.play) ? (this.ads && this.ads.enabled && this.ads.managerPromise.then(() => this.ads.play()).catch(() => silencePromise(this.media.play())), this.media.play()) : null), _defineProperty$1(this, "pause", () => this.playing && is.function(this.media.pause) ? this.media.pause() : null), _defineProperty$1(this, "togglePlay", (e3) => (is.boolean(e3) ? e3 : !this.playing) ? this.play() : this.pause()), _defineProperty$1(this, "stop", () => {
      this.isHTML5 ? (this.pause(), this.restart()) : is.function(this.media.stop) && this.media.stop();
    }), _defineProperty$1(this, "restart", () => {
      this.currentTime = 0;
    }), _defineProperty$1(this, "rewind", (e3) => {
      this.currentTime -= is.number(e3) ? e3 : this.config.seekTime;
    }), _defineProperty$1(this, "forward", (e3) => {
      this.currentTime += is.number(e3) ? e3 : this.config.seekTime;
    }), _defineProperty$1(this, "increaseVolume", (e3) => {
      const t3 = this.media.muted ? 0 : this.volume;
      this.volume = t3 + (is.number(e3) ? e3 : 0);
    }), _defineProperty$1(this, "decreaseVolume", (e3) => {
      this.increaseVolume(-e3);
    }), _defineProperty$1(this, "airplay", () => {
      support.airplay && this.media.webkitShowPlaybackTargetPicker();
    }), _defineProperty$1(this, "toggleControls", (e3) => {
      if (this.supported.ui && !this.isAudio) {
        const t3 = hasClass(this.elements.container, this.config.classNames.hideControls), i3 = e3 === void 0 ? void 0 : !e3, s3 = toggleClass(this.elements.container, this.config.classNames.hideControls, i3);
        if (s3 && is.array(this.config.controls) && this.config.controls.includes("settings") && !is.empty(this.config.settings) && controls.toggleMenu.call(this, false), s3 !== t3) {
          const e4 = s3 ? "controlshidden" : "controlsshown";
          triggerEvent.call(this, this.media, e4);
        }
        return !s3;
      }
      return false;
    }), _defineProperty$1(this, "on", (e3, t3) => {
      on.call(this, this.elements.container, e3, t3);
    }), _defineProperty$1(this, "once", (e3, t3) => {
      once.call(this, this.elements.container, e3, t3);
    }), _defineProperty$1(this, "off", (e3, t3) => {
      off(this.elements.container, e3, t3);
    }), _defineProperty$1(this, "destroy", (e3, t3 = false) => {
      if (!this.ready)
        return;
      const i3 = () => {
        document.body.style.overflow = "", this.embed = null, t3 ? (Object.keys(this.elements).length && (removeElement(this.elements.buttons.play), removeElement(this.elements.captions), removeElement(this.elements.controls), removeElement(this.elements.wrapper), this.elements.buttons.play = null, this.elements.captions = null, this.elements.controls = null, this.elements.wrapper = null), is.function(e3) && e3()) : (unbindListeners.call(this), html5.cancelRequests.call(this), replaceElement(this.elements.original, this.elements.container), triggerEvent.call(this, this.elements.original, "destroyed", true), is.function(e3) && e3.call(this.elements.original), this.ready = false, setTimeout(() => {
          this.elements = null, this.media = null;
        }, 200));
      };
      this.stop(), clearTimeout(this.timers.loading), clearTimeout(this.timers.controls), clearTimeout(this.timers.resized), this.isHTML5 ? (ui.toggleNativeControls.call(this, true), i3()) : this.isYouTube ? (clearInterval(this.timers.buffering), clearInterval(this.timers.playing), this.embed !== null && is.function(this.embed.destroy) && this.embed.destroy(), i3()) : this.isVimeo && (this.embed !== null && this.embed.unload().then(i3), setTimeout(i3, 200));
    }), _defineProperty$1(this, "supports", (e3) => support.mime.call(this, e3)), this.timers = {}, this.ready = false, this.loading = false, this.failed = false, this.touch = support.touch, this.media = e2, is.string(this.media) && (this.media = document.querySelectorAll(this.media)), (window.jQuery && this.media instanceof jQuery || is.nodeList(this.media) || is.array(this.media)) && (this.media = this.media[0]), this.config = extend$1({}, defaults$5, Plyr.defaults, t2 || {}, (() => {
      try {
        return JSON.parse(this.media.getAttribute("data-plyr-config"));
      } catch (e3) {
        return {};
      }
    })()), this.elements = { container: null, fullscreen: null, captions: null, buttons: {}, display: {}, progress: {}, inputs: {}, settings: { popup: null, menu: null, panels: {}, buttons: {} } }, this.captions = { active: null, currentTrack: -1, meta: /* @__PURE__ */ new WeakMap() }, this.fullscreen = { active: false }, this.options = { speed: [], quality: [] }, this.debug = new Console(this.config.debug), this.debug.log("Config", this.config), this.debug.log("Support", support), is.nullOrUndefined(this.media) || !is.element(this.media))
      return void this.debug.error("Setup failed: no suitable element passed");
    if (this.media.plyr)
      return void this.debug.warn("Target already setup");
    if (!this.config.enabled)
      return void this.debug.error("Setup failed: disabled by config");
    if (!support.check().api)
      return void this.debug.error("Setup failed: no support");
    const i2 = this.media.cloneNode(true);
    i2.autoplay = false, this.elements.original = i2;
    const s2 = this.media.tagName.toLowerCase();
    let n2 = null, r2 = null;
    switch (s2) {
      case "div":
        if (n2 = this.media.querySelector("iframe"), is.element(n2)) {
          if (r2 = parseUrl(n2.getAttribute("src")), this.provider = getProviderByUrl(r2.toString()), this.elements.container = this.media, this.media = n2, this.elements.container.className = "", r2.search.length) {
            const e3 = ["1", "true"];
            e3.includes(r2.searchParams.get("autoplay")) && (this.config.autoplay = true), e3.includes(r2.searchParams.get("loop")) && (this.config.loop.active = true), this.isYouTube ? (this.config.playsinline = e3.includes(r2.searchParams.get("playsinline")), this.config.youtube.hl = r2.searchParams.get("hl")) : this.config.playsinline = true;
          }
        } else
          this.provider = this.media.getAttribute(this.config.attributes.embed.provider), this.media.removeAttribute(this.config.attributes.embed.provider);
        if (is.empty(this.provider) || !Object.values(providers).includes(this.provider))
          return void this.debug.error("Setup failed: Invalid provider");
        this.type = types.video;
        break;
      case "video":
      case "audio":
        this.type = s2, this.provider = providers.html5, this.media.hasAttribute("crossorigin") && (this.config.crossorigin = true), this.media.hasAttribute("autoplay") && (this.config.autoplay = true), (this.media.hasAttribute("playsinline") || this.media.hasAttribute("webkit-playsinline")) && (this.config.playsinline = true), this.media.hasAttribute("muted") && (this.config.muted = true), this.media.hasAttribute("loop") && (this.config.loop.active = true);
        break;
      default:
        return void this.debug.error("Setup failed: unsupported type");
    }
    this.supported = support.check(this.type, this.provider, this.config.playsinline), this.supported.api ? (this.eventListeners = [], this.listeners = new Listeners(this), this.storage = new Storage(this), this.media.plyr = this, is.element(this.elements.container) || (this.elements.container = createElement("div", { tabindex: 0 }), wrap(this.media, this.elements.container)), ui.migrateStyles.call(this), ui.addStyleHook.call(this), media.setup.call(this), this.config.debug && on.call(this, this.elements.container, this.config.events.join(" "), (e3) => {
      this.debug.log(`event: ${e3.type}`);
    }), this.fullscreen = new Fullscreen(this), (this.isHTML5 || this.isEmbed && !this.supported.ui) && ui.build.call(this), this.listeners.container(), this.listeners.global(), this.config.ads.enabled && (this.ads = new Ads(this)), this.isHTML5 && this.config.autoplay && this.once("canplay", () => silencePromise(this.play())), this.lastSeekTime = 0, this.config.previewThumbnails.enabled && (this.previewThumbnails = new PreviewThumbnails(this))) : this.debug.error("Setup failed: no support");
  }
  get isHTML5() {
    return this.provider === providers.html5;
  }
  get isEmbed() {
    return this.isYouTube || this.isVimeo;
  }
  get isYouTube() {
    return this.provider === providers.youtube;
  }
  get isVimeo() {
    return this.provider === providers.vimeo;
  }
  get isVideo() {
    return this.type === types.video;
  }
  get isAudio() {
    return this.type === types.audio;
  }
  get playing() {
    return Boolean(this.ready && !this.paused && !this.ended);
  }
  get paused() {
    return Boolean(this.media.paused);
  }
  get stopped() {
    return Boolean(this.paused && this.currentTime === 0);
  }
  get ended() {
    return Boolean(this.media.ended);
  }
  set currentTime(e2) {
    if (!this.duration)
      return;
    const t2 = is.number(e2) && e2 > 0;
    this.media.currentTime = t2 ? Math.min(e2, this.duration) : 0, this.debug.log(`Seeking to ${this.currentTime} seconds`);
  }
  get currentTime() {
    return Number(this.media.currentTime);
  }
  get buffered() {
    const { buffered: e2 } = this.media;
    return is.number(e2) ? e2 : e2 && e2.length && this.duration > 0 ? e2.end(0) / this.duration : 0;
  }
  get seeking() {
    return Boolean(this.media.seeking);
  }
  get duration() {
    const e2 = parseFloat(this.config.duration), t2 = (this.media || {}).duration, i2 = is.number(t2) && t2 !== 1 / 0 ? t2 : 0;
    return e2 || i2;
  }
  set volume(e2) {
    let t2 = e2;
    is.string(t2) && (t2 = Number(t2)), is.number(t2) || (t2 = this.storage.get("volume")), is.number(t2) || ({ volume: t2 } = this.config), t2 > 1 && (t2 = 1), t2 < 0 && (t2 = 0), this.config.volume = t2, this.media.volume = t2, !is.empty(e2) && this.muted && t2 > 0 && (this.muted = false);
  }
  get volume() {
    return Number(this.media.volume);
  }
  set muted(e2) {
    let t2 = e2;
    is.boolean(t2) || (t2 = this.storage.get("muted")), is.boolean(t2) || (t2 = this.config.muted), this.config.muted = t2, this.media.muted = t2;
  }
  get muted() {
    return Boolean(this.media.muted);
  }
  get hasAudio() {
    return !this.isHTML5 || (!!this.isAudio || (Boolean(this.media.mozHasAudio) || Boolean(this.media.webkitAudioDecodedByteCount) || Boolean(this.media.audioTracks && this.media.audioTracks.length)));
  }
  set speed(e2) {
    let t2 = null;
    is.number(e2) && (t2 = e2), is.number(t2) || (t2 = this.storage.get("speed")), is.number(t2) || (t2 = this.config.speed.selected);
    const { minimumSpeed: i2, maximumSpeed: s2 } = this;
    t2 = clamp(t2, i2, s2), this.config.speed.selected = t2, setTimeout(() => {
      this.media && (this.media.playbackRate = t2);
    }, 0);
  }
  get speed() {
    return Number(this.media.playbackRate);
  }
  get minimumSpeed() {
    return this.isYouTube ? Math.min(...this.options.speed) : this.isVimeo ? 0.5 : 0.0625;
  }
  get maximumSpeed() {
    return this.isYouTube ? Math.max(...this.options.speed) : this.isVimeo ? 2 : 16;
  }
  set quality(e2) {
    const t2 = this.config.quality, i2 = this.options.quality;
    if (!i2.length)
      return;
    let s2 = [!is.empty(e2) && Number(e2), this.storage.get("quality"), t2.selected, t2.default].find(is.number), n2 = true;
    if (!i2.includes(s2)) {
      const e3 = closest(i2, s2);
      this.debug.warn(`Unsupported quality option: ${s2}, using ${e3} instead`), s2 = e3, n2 = false;
    }
    t2.selected = s2, this.media.quality = s2, n2 && this.storage.set({ quality: s2 });
  }
  get quality() {
    return this.media.quality;
  }
  set loop(e2) {
    const t2 = is.boolean(e2) ? e2 : this.config.loop.active;
    this.config.loop.active = t2, this.media.loop = t2;
  }
  get loop() {
    return Boolean(this.media.loop);
  }
  set source(e2) {
    source.change.call(this, e2);
  }
  get source() {
    return this.media.currentSrc;
  }
  get download() {
    const { download: e2 } = this.config.urls;
    return is.url(e2) ? e2 : this.source;
  }
  set download(e2) {
    is.url(e2) && (this.config.urls.download = e2, controls.setDownloadUrl.call(this));
  }
  set poster(e2) {
    this.isVideo ? ui.setPoster.call(this, e2, false).catch(() => {
    }) : this.debug.warn("Poster can only be set for video");
  }
  get poster() {
    return this.isVideo ? this.media.getAttribute("poster") || this.media.getAttribute("data-poster") : null;
  }
  get ratio() {
    if (!this.isVideo)
      return null;
    const e2 = reduceAspectRatio(getAspectRatio.call(this));
    return is.array(e2) ? e2.join(":") : e2;
  }
  set ratio(e2) {
    this.isVideo ? is.string(e2) && validateAspectRatio(e2) ? (this.config.ratio = reduceAspectRatio(e2), setAspectRatio.call(this)) : this.debug.error(`Invalid aspect ratio specified (${e2})`) : this.debug.warn("Aspect ratio can only be set for video");
  }
  set autoplay(e2) {
    this.config.autoplay = is.boolean(e2) ? e2 : this.config.autoplay;
  }
  get autoplay() {
    return Boolean(this.config.autoplay);
  }
  toggleCaptions(e2) {
    captions.toggle.call(this, e2, false);
  }
  set currentTrack(e2) {
    captions.set.call(this, e2, false), captions.setup.call(this);
  }
  get currentTrack() {
    const { toggled: e2, currentTrack: t2 } = this.captions;
    return e2 ? t2 : -1;
  }
  set language(e2) {
    captions.setLanguage.call(this, e2, false);
  }
  get language() {
    return (captions.getCurrentTrack.call(this) || {}).language;
  }
  set pip(e2) {
    if (!support.pip)
      return;
    const t2 = is.boolean(e2) ? e2 : !this.pip;
    is.function(this.media.webkitSetPresentationMode) && this.media.webkitSetPresentationMode(t2 ? pip.active : pip.inactive), is.function(this.media.requestPictureInPicture) && (!this.pip && t2 ? this.media.requestPictureInPicture() : this.pip && !t2 && document.exitPictureInPicture());
  }
  get pip() {
    return support.pip ? is.empty(this.media.webkitPresentationMode) ? this.media === document.pictureInPictureElement : this.media.webkitPresentationMode === pip.active : null;
  }
  setPreviewThumbnails(e2) {
    this.previewThumbnails && this.previewThumbnails.loaded && (this.previewThumbnails.destroy(), this.previewThumbnails = null), Object.assign(this.config.previewThumbnails, e2), this.config.previewThumbnails.enabled && (this.previewThumbnails = new PreviewThumbnails(this));
  }
  static supported(e2, t2, i2) {
    return support.check(e2, t2, i2);
  }
  static loadSprite(e2, t2) {
    return loadSprite(e2, t2);
  }
  static setup(e2, t2 = {}) {
    let i2 = null;
    return is.string(e2) ? i2 = Array.from(document.querySelectorAll(e2)) : is.nodeList(e2) ? i2 = Array.from(e2) : is.array(e2) && (i2 = e2.filter(is.element)), is.empty(i2) ? null : i2.map((e3) => new Plyr(e3, t2));
  }
}
Plyr.defaults = cloneDeep(defaults$5);
var plyr = "";
var VPlyr_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$9 = ["src", "title"];
const _hoisted_2$9 = ["data-poster"];
const _hoisted_3$9 = ["src"];
const _hoisted_4$5 = ["default", "srclang", "src"];
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  props: {
    source: null,
    title: null,
    poster: null,
    captions: { default: () => [] },
    reversed: { type: Boolean },
    embed: { type: Boolean },
    ratio: { default: "16by9" },
    options: { default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const player = ref();
    const videoElement = ref();
    onMounted(() => {
      if (videoElement.value) {
        player.value = new Plyr(videoElement.value, props.options);
      }
    });
    onBeforeUnmount(() => {
      if (player.value) {
        player.value.destroy();
        player.value = void 0;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["video-player-container", [__props.ratio && "is-" + __props.ratio, __props.reversed && "reversed-play"]])
      }, [
        __props.embed ? (openBlock(), createElementBlock("iframe", {
          key: 0,
          src: `${__props.source}`,
          title: props.title,
          allowfullscreen: "",
          allowtransparency: "",
          allow: "autoplay"
        }, null, 8, _hoisted_1$9)) : (openBlock(), createElementBlock("video", {
          key: 1,
          ref_key: "videoElement",
          ref: videoElement,
          controls: "",
          crossorigin: "anonymous",
          playsinline: "",
          "data-poster": __props.poster
        }, [
          createBaseVNode("source", {
            src: __props.source,
            type: "video/mp4"
          }, null, 8, _hoisted_3$9),
          (openBlock(true), createElementBlock(Fragment, null, renderList(props.captions, (caption, key) => {
            return openBlock(), createElementBlock("track", {
              key,
              default: caption.default,
              kind: "captions",
              srclang: caption.srclang,
              src: caption.src
            }, null, 8, _hoisted_4$5);
          }), 128))
        ], 8, _hoisted_2$9))
      ], 2);
    };
  }
});
const _sfc_main$e = {};
const _hoisted_1$8 = { class: "section has-bg-dots" };
const _hoisted_2$8 = { class: "container" };
const _hoisted_3$8 = /* @__PURE__ */ createBaseVNode("div", { class: "section-title has-text-centered py-6" }, [
  /* @__PURE__ */ createBaseVNode("h2", { class: "title is-2" }, "About Us"),
  /* @__PURE__ */ createBaseVNode("h4", null, "Let us tell you the hole story.")
], -1);
const _hoisted_4$4 = { class: "video-section py-12" };
const _hoisted_5$6 = { class: "columns is-vcentered" };
const _hoisted_6$6 = { class: "column is-6 is-relative is-centered-portrait" };
const _hoisted_7$7 = /* @__PURE__ */ createStaticVNode('<div class="column is-6"><div class="columns is-multiline b-columns-half-tablet-p"><div class="column is-6"><div class="py-2 medium:py-4"><h4 class="title is-5 is-narrow">How we started</h4><p class="pt-2 max-w-3 text-medium"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed videbimus. </p></div></div><div class="column is-6"><div class="py-2 medium:py-4"><h4 class="title is-5 is-narrow">Who we are</h4><p class="pt-2 max-w-3 text-medium"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed videbimus. </p></div></div><div class="column is-6"><div class="py-2 medium:py-4"><h4 class="title is-5 is-narrow">What we do</h4><p class="pt-2 max-w-3 text-medium"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed videbimus. </p></div></div><div class="column is-6"><div class="py-2 medium:py-4"><h4 class="title is-5 is-narrow">Our values</h4><p class="pt-2 max-w-3 text-medium"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed videbimus. </p></div></div></div></div>', 1);
function _sfc_render$4(_ctx, _cache) {
  const _component_VPlyr = _sfc_main$f;
  return openBlock(), createElementBlock("div", _hoisted_1$8, [
    createBaseVNode("div", _hoisted_2$8, [
      _hoisted_3$8,
      createBaseVNode("div", _hoisted_4$4, [
        createBaseVNode("div", _hoisted_5$6, [
          createBaseVNode("div", _hoisted_6$6, [
            createVNode(_component_VPlyr, {
              ratio: "square",
              title: "Lorem ipsum dolor sit amet",
              source: "/video/hands.mp4",
              poster: "/video/poster-1c.jpg",
              reversed: ""
            })
          ]),
          _hoisted_7$7
        ])
      ])
    ])
  ]);
}
var __unplugin_components_6 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$4]]);
const CssUnitRe = /(\d*\.?\d+)\s?(cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%)/;
var VPlaceload_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  props: {
    width: { default: "100%" },
    height: { default: "10px" },
    mobileWidth: { default: void 0 },
    mobileHeight: { default: void 0 },
    disabled: { type: Boolean },
    centered: { type: Boolean }
  },
  setup(__props) {
    var _a2, _b2;
    const props = __props;
    useCssVars((_ctx) => ({
      "dd2dd28a": props.width,
      "fc2a725c": props.height,
      "44d1027a": unref(mobileWidthValue),
      "c789998a": unref(mobileHeightValue)
    }));
    const mobileWidthValue = (_a2 = props.mobileWidth) != null ? _a2 : props.width;
    const mobileHeightValue = (_b2 = props.mobileHeight) != null ? _b2 : props.height;
    if (props.width.match(CssUnitRe) === null) {
      console.warn(`VPlaceload: invalid "${props.width}" width. Should be a valid css unit value.`);
    }
    if (props.height.match(CssUnitRe) === null) {
      console.warn(`VPlaceload: invalid "${props.height}" height. Should be a valid css unit value.`);
    }
    if (mobileWidthValue.match(CssUnitRe) === null) {
      console.warn(`VPlaceload: invalid "${mobileWidthValue}" mobileWidth. Should be a valid css unit value.`);
    }
    if (mobileHeightValue.match(CssUnitRe) === null) {
      console.warn(`VPlaceload: invalid "${mobileHeightValue}" mobileHeight. Should be a valid css unit value.`);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["content-shape", [props.centered && "is-centered", !props.disabled && "loads"]])
      }, null, 2);
    };
  }
});
var VPlaceload = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-6922be4e"]]);
var VButton_vue_vue_type_style_index_0_lang = "";
const _sfc_main$c = defineComponent({
  props: {
    to: {
      type: [Object, String],
      default: void 0
    },
    href: {
      type: String,
      default: void 0
    },
    icon: {
      type: String,
      default: void 0
    },
    iconCaret: {
      type: String,
      default: void 0
    },
    placeload: {
      type: String,
      default: void 0,
      validator: (value) => {
        if (value.match(CssUnitRe) === null) {
          console.warn(`VButton: invalid "${value}" placeload. Should be a valid css unit value.`);
        }
        return true;
      }
    },
    color: {
      type: String,
      default: void 0,
      validator: (value) => {
        if ([
          void 0,
          "primary",
          "info",
          "success",
          "warning",
          "danger",
          "white",
          "dark",
          "light"
        ].indexOf(value) === -1) {
          console.warn(`VButton: invalid "${value}" color. Should be primary, info, success, warning, danger, dark, light, white or undefined`);
          return false;
        }
        return true;
      }
    },
    size: {
      type: String,
      default: void 0,
      validator: (value) => {
        if ([void 0, "medium", "big", "huge"].indexOf(value) === -1) {
          console.warn(`VButton: invalid "${value}" size. Should be big, huge, medium or undefined`);
          return false;
        }
        return true;
      }
    },
    dark: {
      type: String,
      default: void 0,
      validator: (value) => {
        if ([void 0, "1", "2", "3", "4", "5", "6"].indexOf(value) === -1) {
          console.warn(`VButton: invalid "${value}" dark. Should be 1, 2, 3, 4, 5, 6 or undefined`);
          return false;
        }
        return true;
      }
    },
    rounded: {
      type: Boolean,
      default: false
    },
    bold: {
      type: Boolean,
      default: false
    },
    fullwidth: {
      type: Boolean,
      default: false
    },
    light: {
      type: Boolean,
      default: false
    },
    raised: {
      type: Boolean,
      default: false
    },
    elevated: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    darkOutlined: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    lower: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    static: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots, attrs }) {
    const classes = computed(() => {
      var _a2;
      const defaultClasses = (_a2 = attrs == null ? void 0 : attrs.class) != null ? _a2 : [];
      return [
        ...defaultClasses,
        "button",
        "v-button",
        props.disabled && "is-disabled",
        props.rounded && "is-rounded",
        props.bold && "is-bold",
        props.size && `is-${props.size}`,
        props.lower && "is-lower",
        props.fullwidth && "is-fullwidth",
        props.outlined && "is-outlined",
        props.dark && `is-dark-bg-${props.dark}`,
        props.darkOutlined && "is-dark-outlined",
        props.raised && "is-raised",
        props.elevated && "is-elevated",
        props.loading && !props.placeload && "is-loading",
        props.color && `is-${props.color}`,
        props.light && "is-light",
        props.static && "is-static"
      ];
    });
    const isIconify = computed(() => props.icon && props.icon.indexOf(":") !== -1);
    const isCaretIconify = computed(() => props.iconCaret && props.iconCaret.indexOf(":") !== -1);
    const getChildrens = () => {
      var _a2;
      const childrens = [];
      let iconWrapper;
      if (isIconify.value) {
        const icon = h("i", {
          "aria-hidden": true,
          class: "iconify",
          "data-icon": props.icon
        });
        iconWrapper = h("span", { class: "icon" }, icon);
      } else if (props.icon) {
        const icon = h("i", { "aria-hidden": true, class: props.icon });
        iconWrapper = h("span", { class: "icon" }, icon);
      }
      let caretWrapper;
      if (isCaretIconify.value) {
        const caret = h("i", {
          "aria-hidden": true,
          class: "iconify",
          "data-icon": props.iconCaret
        });
        caretWrapper = h("span", { class: "caret" }, caret);
      } else if (props.iconCaret) {
        const caret = h("i", { "aria-hidden": true, class: props.iconCaret });
        caretWrapper = h("span", { class: "caret" }, caret);
      }
      if (iconWrapper) {
        childrens.push(iconWrapper);
      }
      if (props.placeload) {
        childrens.push(h(VPlaceload, {
          width: props.placeload
        }));
      } else {
        childrens.push(h("span", (_a2 = slots.default) == null ? void 0 : _a2.call(slots)));
      }
      if (caretWrapper) {
        childrens.push(caretWrapper);
      }
      return childrens;
    };
    return () => {
      if (props.to) {
        return h(RouterLink, __spreadProps(__spreadValues({}, attrs), {
          "aria-hidden": !!props.placeload && true,
          to: props.to,
          class: ["button", ...classes.value]
        }), {
          default: getChildrens
        });
      } else if (props.href) {
        return h("a", __spreadProps(__spreadValues({}, attrs), {
          "aria-hidden": !!props.placeload && true,
          href: props.href,
          class: classes.value
        }), {
          default: getChildrens
        });
      }
      return h("button", __spreadProps(__spreadValues({
        type: "button"
      }, attrs), {
        "aria-hidden": !!props.placeload && true,
        disabled: props.disabled,
        class: ["button", ...classes.value]
      }), {
        default: getChildrens
      });
    };
  }
});
var _imports_0$2 = "/assets/feature-1.24cff14a.png";
var _imports_1$2 = "/assets/feature-1-dark.85758b75.png";
var _imports_2$3 = "/assets/feature-2.ba58c977.svg";
var _imports_3$2 = "/assets/feature-2-dark.1316c4d7.svg";
var _imports_4$1 = "/assets/feature-3.8af0f59b.svg";
var _imports_5$1 = "/assets/feature-3-dark.4f56d90d.svg";
const _sfc_main$b = {};
const _hoisted_1$7 = { class: "section" };
const _hoisted_2$7 = { class: "container" };
const _hoisted_3$7 = /* @__PURE__ */ createStaticVNode('<div class="section-title has-text-centered"><h2 class="title is-2">Top Tier Product</h2><h4>Vuero has been carefully handcrafted.</h4></div><div class="columns is-vcentered side-feature"><div class="column is-6 has-text-centered"><img class="light-image-l featured-image" src="' + _imports_0$2 + '" alt=""><img class="dark-image-l featured-image" src="' + _imports_1$2 + '" alt=""></div><div class="column is-5"><h2 class="title m-b-10 is-centered-tablet-portrait">Incredible UI</h2><p class="section-feature-description is-centered-tablet-portrait"> Vuero&#39;s UI has been carefully thought and designed, and is simply one of the best you&#39;ll find on the market. It&#39;s visual power and its modularity will let you build great apps seamlessly. </p></div></div><div class="columns is-vcentered side-feature"><div class="column is-6 has-text-centered h-hidden-desktop h-hidden-tablet-p h-hidden-tablet-l"><img class="light-image-l featured-image" src="' + _imports_2$3 + '" alt=""><img class="dark-image-l featured-image" src="' + _imports_3$2 + '" alt=""></div><div class="column is-5 is-offset-1"><h2 class="title m-b-10 is-centered-tablet-portrait">Playful Vectors</h2><p class="section-feature-description is-centered-tablet-portrait"> Vuero ships with a lot of svg illustrations representing various elements that can be used in a website, following very high quality standards. </p></div><div class="column is-6 has-text-centered h-hidden-mobile"><img class="light-image-l featured-image" src="' + _imports_2$3 + '" alt=""><img class="dark-image-l featured-image" src="' + _imports_3$2 + '" alt=""></div></div><div class="columns is-vcentered side-feature"><div class="column is-6 has-text-centered"><img class="light-image-l featured-image" src="' + _imports_4$1 + '" alt=""><img class="dark-image-l featured-image" src="' + _imports_5$1 + '" alt=""></div><div class="column is-5"><h2 class="title m-b-10 is-centered-tablet-portrait">Handcrafted UI</h2><p class="section-feature-description is-centered-tablet-portrait"> Vuero ships with it&#39;s own component library based on the Bulma.io CSS framework. Each component has been carefully handcrafted and natively supports dark mode. </p></div></div>', 4);
const _hoisted_7$6 = { class: "cta-block no-border" };
const _hoisted_8$6 = /* @__PURE__ */ createBaseVNode("div", { class: "head-text" }, [
  /* @__PURE__ */ createBaseVNode("h3", null, "Want to learn more?"),
  /* @__PURE__ */ createBaseVNode("p", null, "Check out the Vuero documentation")
], -1);
const _hoisted_9$6 = { class: "head-action" };
const _hoisted_10$6 = { class: "buttons" };
const _hoisted_11$4 = /* @__PURE__ */ createTextVNode(" Read the Docs ");
const _hoisted_12$4 = /* @__PURE__ */ createBaseVNode("a", {
  href: "https://cssninja.io",
  target: "_blank",
  rel: "noopener",
  class: "button chat-button is-secondary"
}, " Chat with us ", -1);
function _sfc_render$3(_ctx, _cache) {
  const _component_VButton = _sfc_main$c;
  return openBlock(), createElementBlock("div", _hoisted_1$7, [
    createBaseVNode("div", _hoisted_2$7, [
      _hoisted_3$7,
      createBaseVNode("div", _hoisted_7$6, [
        _hoisted_8$6,
        createBaseVNode("div", _hoisted_9$6, [
          createBaseVNode("div", _hoisted_10$6, [
            createVNode(_component_VButton, {
              class: "action-button",
              color: "primary",
              rounded: "",
              elevated: "",
              href: "https://docs.cssninja.io/vuero"
            }, {
              default: withCtx(() => [
                _hoisted_11$4
              ]),
              _: 1
            }),
            _hoisted_12$4
          ])
        ])
      ])
    ])
  ]);
}
var __unplugin_components_5 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$3]]);
const _hoisted_1$6 = { class: "v-popover-profile has-loader" };
const _hoisted_2$6 = { class: "profile-popover-block" };
const _hoisted_3$6 = { class: "profile-popover-wrapper" };
const _hoisted_4$3 = {
  key: 0,
  class: "popover-avatar"
};
const _hoisted_5$5 = ["src"];
const _hoisted_6$5 = { class: "popover-meta" };
const _hoisted_7$5 = { class: "stack-meta" };
const _hoisted_8$5 = { class: "stackname dark-inverted" };
const _hoisted_9$5 = {
  key: 0,
  class: "job-title mb-1"
};
const _hoisted_10$5 = { class: "bio" };
const _hoisted_11$3 = { class: "popover-actions" };
const _hoisted_12$3 = ["href"];
const _hoisted_13$3 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "iconify",
  "data-icon": "feather:link"
}, null, -1);
const _hoisted_14$3 = [
  _hoisted_13$3
];
const _hoisted_15$3 = ["href"];
const _hoisted_16$3 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "iconify",
  "data-icon": "feather:github"
}, null, -1);
const _hoisted_17$3 = [
  _hoisted_16$3
];
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  props: {
    stack: null
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$6, [
        createBaseVNode("div", _hoisted_2$6, [
          createBaseVNode("div", _hoisted_3$6, [
            props.stack.logo ? (openBlock(), createElementBlock("div", _hoisted_4$3, [
              createBaseVNode("img", {
                class: "avatar",
                src: props.stack.logo,
                alt: ""
              }, null, 8, _hoisted_5$5)
            ])) : createCommentVNode("", true),
            createBaseVNode("div", _hoisted_6$5, [
              createBaseVNode("span", _hoisted_7$5, [
                createBaseVNode("span", _hoisted_8$5, toDisplayString$1(props.stack.name), 1)
              ]),
              props.stack.subtitle ? (openBlock(), createElementBlock("span", _hoisted_9$5, toDisplayString$1(props.stack.subtitle), 1)) : createCommentVNode("", true),
              createBaseVNode("span", _hoisted_10$5, toDisplayString$1(props.stack.description), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_11$3, [
            props.stack.homepage ? (openBlock(), createElementBlock("a", {
              key: 0,
              class: "popover-icon",
              href: props.stack.homepage
            }, _hoisted_14$3, 8, _hoisted_12$3)) : createCommentVNode("", true),
            props.stack.github ? (openBlock(), createElementBlock("a", {
              key: 1,
              class: "popover-icon",
              href: props.stack.github
            }, _hoisted_17$3, 8, _hoisted_15$3)) : createCommentVNode("", true)
          ])
        ])
      ]);
    };
  }
});
var _imports_2$2 = "/images/icons/hexagons/green.svg";
var _imports_3$1 = "/images/icons/hexagons/green-heavy.svg";
var _imports_2$1 = "/images/icons/hexagons/orange.svg";
var _imports_3 = "/images/icons/hexagons/orange-heavy.svg";
var _imports_0$1 = "/images/icons/hexagons/accent.svg";
var _imports_1$1 = "/images/icons/hexagons/accent-heavy.svg";
var _imports_6$1 = "/assets/app-1.7946e3ec.png";
var _imports_7$1 = "/assets/app-1-dark.58cdfa45.png";
var _imports_8 = "/images/icons/stacks/vuejs.svg";
var _imports_9 = "/images/icons/stacks/vite.svg";
var _imports_10 = "/images/icons/stacks/bulma.svg";
var _imports_11 = "/images/icons/stacks/sass.svg";
var _imports_12 = "/images/icons/stacks/typescript.svg";
const _sfc_main$9 = {};
const _hoisted_1$5 = { class: "section has-bg-dots" };
const _hoisted_2$5 = { class: "container" };
const _hoisted_3$5 = /* @__PURE__ */ createStaticVNode('<div class="section-title has-text-centered"><h2 class="title is-2">Impecable UI/UX</h2><h4>Vuero has been carefully handcrafted.</h4></div><div class="centered-mockup-wrapper"><div class="mockup-container mb-6"><img class="hexagon hexagon-1 light-image-l" src="' + _imports_2$2 + '" alt=""><img class="hexagon hexagon-1 dark-image-l" src="' + _imports_3$1 + '" alt=""><img class="hexagon hexagon-2 light-image-l" src="' + _imports_2$1 + '" alt=""><img class="hexagon hexagon-2 dark-image-l" src="' + _imports_3 + '" alt=""><img class="hexagon hexagon-3 light-image-l" src="' + _imports_0$1 + '" alt=""><img class="hexagon hexagon-3 dark-image-l" src="' + _imports_1$1 + '" alt=""><img class="light-image-l centered-mockup" src="' + _imports_6$1 + '" alt=""><img class="dark-image-l centered-mockup" src="' + _imports_7$1 + '" alt=""></div><div class="columns"><div class="column is-4"><h3 class="title is-4">Bulma 0.9.1</h3><p class="subtitle is-6 light-text"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Summum en\xEDm bonum exposuit vacuitatem. </p></div><div class="column is-4"><h3 class="title is-4">Clean Code</h3><p class="subtitle is-6 light-text"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Summum en\xEDm bonum exposuit vacuitatem. </p></div><div class="column is-4"><h3 class="title is-4">Modern UI</h3><p class="subtitle is-6 light-text"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Summum en\xEDm bonum exposuit vacuitatem. </p></div></div></div>', 2);
const _hoisted_5$4 = { class: "stacks" };
const _hoisted_6$4 = /* @__PURE__ */ createBaseVNode("div", { class: "stack" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    src: _imports_8,
    alt: ""
  })
], -1);
const _hoisted_7$4 = /* @__PURE__ */ createBaseVNode("div", { class: "stack" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    src: _imports_9,
    alt: ""
  })
], -1);
const _hoisted_8$4 = /* @__PURE__ */ createBaseVNode("div", { class: "stack" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    src: _imports_10,
    alt: ""
  })
], -1);
const _hoisted_9$4 = /* @__PURE__ */ createBaseVNode("div", { class: "stack" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    src: _imports_11,
    alt: ""
  })
], -1);
const _hoisted_10$4 = /* @__PURE__ */ createBaseVNode("div", { class: "stack" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    src: _imports_12,
    alt: ""
  })
], -1);
function _sfc_render$2(_ctx, _cache) {
  const _component_StackPopoverContent = _sfc_main$a;
  const _component_Tippy = resolveComponent("Tippy");
  return openBlock(), createElementBlock("div", _hoisted_1$5, [
    createBaseVNode("div", _hoisted_2$5, [
      _hoisted_3$5,
      createBaseVNode("div", _hoisted_5$4, [
        createBaseVNode("div", null, [
          createVNode(_component_Tippy, {
            class: "has-help-cursor",
            interactive: "",
            placement: "top"
          }, {
            content: withCtx(() => [
              createVNode(_component_StackPopoverContent, { stack: {
                name: "Vue 3",
                subtitle: "Composition API",
                logo: "/images/icons/stacks/vuejs.svg",
                description: "The Progressive JavaScript Framework for building user interfaces.",
                homepage: "https://v3.vuejs.org/",
                github: "https://github.com/vuejs/vue-next"
              } }, null, 8, ["stack"])
            ]),
            default: withCtx(() => [
              _hoisted_6$4
            ]),
            _: 1
          })
        ]),
        createBaseVNode("div", null, [
          createVNode(_component_Tippy, {
            class: "has-help-cursor",
            interactive: "",
            placement: "top"
          }, {
            content: withCtx(() => [
              createVNode(_component_StackPopoverContent, { stack: {
                name: "Vite",
                subtitle: "Next Generation Frontend Tooling",
                logo: "/images/icons/stacks/vite.svg",
                description: "Vite is a new breed of frontend build tool that significantly improves the frontend development experience.",
                homepage: "https://vitejs.dev/",
                github: "https://github.com/vitejs/vite"
              } }, null, 8, ["stack"])
            ]),
            default: withCtx(() => [
              _hoisted_7$4
            ]),
            _: 1
          })
        ]),
        createBaseVNode("div", null, [
          createVNode(_component_Tippy, {
            class: "has-help-cursor",
            interactive: "",
            placement: "top"
          }, {
            content: withCtx(() => [
              createVNode(_component_StackPopoverContent, { stack: {
                name: "Bulma",
                subtitle: "The modern CSS framework",
                logo: "/images/icons/stacks/bulma.svg",
                description: "Bulma is a free, open source framework that provides ready-to-use frontend components.",
                homepage: "https://bulma.io/",
                github: "https://github.com/jgthms/bulma"
              } }, null, 8, ["stack"])
            ]),
            default: withCtx(() => [
              _hoisted_8$4
            ]),
            _: 1
          })
        ]),
        createBaseVNode("div", null, [
          createVNode(_component_Tippy, {
            class: "has-help-cursor",
            interactive: "",
            placement: "top"
          }, {
            content: withCtx(() => [
              createVNode(_component_StackPopoverContent, { stack: {
                name: "Sass",
                subtitle: "Makes CSS fun again",
                logo: "/images/icons/stacks/sass.svg",
                description: "Sass is an extension of CSS, adding nested rules, variables, mixins, selector inheritance, and more.",
                homepage: "https://sass-lang.com/",
                github: "https://github.com/sass/sass"
              } }, null, 8, ["stack"])
            ]),
            default: withCtx(() => [
              _hoisted_9$4
            ]),
            _: 1
          })
        ]),
        createBaseVNode("div", null, [
          createVNode(_component_Tippy, {
            class: "has-help-cursor",
            interactive: "",
            placement: "top"
          }, {
            content: withCtx(() => [
              createVNode(_component_StackPopoverContent, { stack: {
                name: "Typescript",
                subtitle: "Javascript enhanced",
                logo: "/images/icons/stacks/typescript.svg",
                description: "TypeScript adds optional types to JavaScript that support tools for large-scale JavaScript applications.",
                homepage: "https://www.typescriptlang.org/",
                github: "https://github.com/microsoft/TypeScript"
              } }, null, 8, ["stack"])
            ]),
            default: withCtx(() => [
              _hoisted_10$4
            ]),
            _: 1
          })
        ])
      ])
    ])
  ]);
}
var __unplugin_components_4 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$2]]);
var _imports_0 = "/images/logos/logo/logo-platinum.svg";
var _imports_1 = "/images/logos/logo/logo-accent.svg";
var _imports_2 = "/images/logos/logo/logo.svg";
const _sfc_main$8 = {};
const _hoisted_1$4 = { class: "section has-bg-dots" };
const _hoisted_2$4 = { class: "container" };
const _hoisted_3$4 = /* @__PURE__ */ createStaticVNode('<div class="section-title has-text-centered"><h2 class="title is-2">Comprehensive Pricing</h2><h4>There&#39;s a right plan for everyone out there.</h4></div><div class="pricing-wrapper"><div class="pricing-plan"><div class="name">Free</div><img src="' + _imports_0 + '" alt=""><div class="price">$0</div><div class="trial">Forever free</div><hr><ul><li><strong>2</strong> team members </li><li><strong>3</strong> team projects </li><li><strong>50GB</strong> of disk storage </li></ul></div><div class="pricing-plan"><div class="name">Business</div><img src="' + _imports_1 + '" alt=""><div class="price">$49</div><div class="trial">Free 14 day trial</div><hr><ul><li><strong>10</strong> team members </li><li><strong>150</strong> team projects </li><li><strong>500GB</strong> of disk storage </li></ul></div><div class="pricing-plan is-featured"><div class="name">Pro</div><img src="' + _imports_2 + '" alt=""><div class="price">$119</div><div class="trial">Free 14 day trial</div><hr><ul><li><strong>Unlimited</strong> team members </li><li><strong>Unlimited</strong> team projects </li><li><strong>Unlimited</strong> disk storage </li><li>Team analytics</li><li>Custom reports</li></ul></div></div>', 2);
const _hoisted_5$3 = { class: "cta-block no-border" };
const _hoisted_6$3 = /* @__PURE__ */ createBaseVNode("div", { class: "head-text" }, [
  /* @__PURE__ */ createBaseVNode("h3", null, "Want to learn more?"),
  /* @__PURE__ */ createBaseVNode("p", null, "Check out the Vuero documentation")
], -1);
const _hoisted_7$3 = { class: "head-action" };
const _hoisted_8$3 = { class: "buttons" };
const _hoisted_9$3 = /* @__PURE__ */ createTextVNode(" Read the Docs ");
const _hoisted_10$3 = /* @__PURE__ */ createBaseVNode("a", {
  href: "https://cssninja.io",
  target: "_blank",
  rel: "noopener",
  class: "button chat-button is-secondary"
}, " Chat with us ", -1);
function _sfc_render$1(_ctx, _cache) {
  const _component_VButton = _sfc_main$c;
  return openBlock(), createElementBlock("div", _hoisted_1$4, [
    createBaseVNode("div", _hoisted_2$4, [
      _hoisted_3$4,
      createBaseVNode("div", _hoisted_5$3, [
        _hoisted_6$3,
        createBaseVNode("div", _hoisted_7$3, [
          createBaseVNode("div", _hoisted_8$3, [
            createVNode(_component_VButton, {
              class: "action-button",
              color: "primary",
              rounded: "",
              elevated: "",
              href: "https://docs.cssninja.io/vuero"
            }, {
              default: withCtx(() => [
                _hoisted_9$3
              ]),
              _: 1
            }),
            _hoisted_10$3
          ])
        ])
      ])
    ])
  ]);
}
var __unplugin_components_3 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$1]]);
var VIconBox_vue_vue_type_style_index_0_lang = "";
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  props: {
    size: { default: void 0 },
    color: { default: void 0 },
    rounded: { type: Boolean },
    bordered: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["v-icon", [
          props.size && "is-" + props.size,
          props.color && "is-" + props.color,
          props.rounded && "is-rounded",
          props.bordered && "is-bordered"
        ]])
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
const _sfc_main$6 = {};
const _hoisted_1$3 = { class: "section has-bg-dots" };
const _hoisted_2$3 = { class: "container" };
const _hoisted_3$3 = /* @__PURE__ */ createBaseVNode("div", { class: "section-title has-text-centered py-6" }, [
  /* @__PURE__ */ createBaseVNode("h2", { class: "title is-2" }, "Awesome Features"),
  /* @__PURE__ */ createBaseVNode("h4", null, "Vuero has been carefully handcrafted.")
], -1);
const _hoisted_4$2 = { class: "py-12" };
const _hoisted_5$2 = { class: "columns is-vcentered is-multiline card-icon-boxes" };
const _hoisted_6$2 = { class: "column is-3" };
const _hoisted_7$2 = { class: "card card-icon-box" };
const _hoisted_8$2 = { class: "card-content" };
const _hoisted_9$2 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-layout-alt-2"
}, null, -1);
const _hoisted_10$2 = /* @__PURE__ */ createBaseVNode("h4", { class: "title is-5" }, "Nice Vectors", -1);
const _hoisted_11$2 = /* @__PURE__ */ createBaseVNode("p", { class: "subtitle is-6 light-text" }, " Lorem ipsum dolor sit amet, consectetur adipiscing elit. ", -1);
const _hoisted_12$2 = { class: "column is-3" };
const _hoisted_13$2 = { class: "card card-icon-box" };
const _hoisted_14$2 = { class: "card-content" };
const _hoisted_15$2 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-layers"
}, null, -1);
const _hoisted_16$2 = /* @__PURE__ */ createBaseVNode("h4", { class: "title is-5" }, "Icon title", -1);
const _hoisted_17$2 = /* @__PURE__ */ createBaseVNode("p", { class: "subtitle is-6 light-text" }, " Lorem ipsum dolor sit amet, consectetur adipiscing elit. ", -1);
const _hoisted_18$1 = { class: "column is-3" };
const _hoisted_19$1 = { class: "card card-icon-box" };
const _hoisted_20$1 = { class: "card-content" };
const _hoisted_21$1 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-grid-alt"
}, null, -1);
const _hoisted_22$1 = /* @__PURE__ */ createBaseVNode("h4", { class: "title is-5" }, "Icon title", -1);
const _hoisted_23 = /* @__PURE__ */ createBaseVNode("p", { class: "subtitle is-6 light-text" }, " Lorem ipsum dolor sit amet, consectetur adipiscing elit. ", -1);
const _hoisted_24 = { class: "column is-3" };
const _hoisted_25 = { class: "card card-icon-box" };
const _hoisted_26 = { class: "card-content" };
const _hoisted_27 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-bulb"
}, null, -1);
const _hoisted_28 = /* @__PURE__ */ createBaseVNode("h4", { class: "title is-5" }, "Icon title", -1);
const _hoisted_29 = /* @__PURE__ */ createBaseVNode("p", { class: "subtitle is-6 light-text" }, " Lorem ipsum dolor sit amet, consectetur adipiscing elit. ", -1);
const _hoisted_30 = { class: "column is-3" };
const _hoisted_31 = { class: "card card-icon-box" };
const _hoisted_32 = { class: "card-content" };
const _hoisted_33 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-cog"
}, null, -1);
const _hoisted_34 = /* @__PURE__ */ createBaseVNode("h4", { class: "title is-5" }, "Icon title", -1);
const _hoisted_35 = /* @__PURE__ */ createBaseVNode("p", { class: "subtitle is-6 light-text" }, " Lorem ipsum dolor sit amet, consectetur adipiscing elit. ", -1);
const _hoisted_36 = { class: "column is-3" };
const _hoisted_37 = { class: "card card-icon-box" };
const _hoisted_38 = { class: "card-content" };
const _hoisted_39 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-plug"
}, null, -1);
const _hoisted_40 = /* @__PURE__ */ createBaseVNode("h4", { class: "title is-5" }, "Icon title", -1);
const _hoisted_41 = /* @__PURE__ */ createBaseVNode("p", { class: "subtitle is-6 light-text" }, " Lorem ipsum dolor sit amet, consectetur adipiscing elit. ", -1);
const _hoisted_42 = { class: "column is-3" };
const _hoisted_43 = { class: "card card-icon-box" };
const _hoisted_44 = { class: "card-content" };
const _hoisted_45 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-folder-alt"
}, null, -1);
const _hoisted_46 = /* @__PURE__ */ createBaseVNode("h4", { class: "title is-5" }, "Icon title", -1);
const _hoisted_47 = /* @__PURE__ */ createBaseVNode("p", { class: "subtitle is-6 light-text" }, " Lorem ipsum dolor sit amet, consectetur adipiscing elit. ", -1);
const _hoisted_48 = { class: "column is-3" };
const _hoisted_49 = { class: "card card-icon-box" };
const _hoisted_50 = { class: "card-content" };
const _hoisted_51 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-timer"
}, null, -1);
const _hoisted_52 = /* @__PURE__ */ createBaseVNode("h4", { class: "title is-5" }, "Icon title", -1);
const _hoisted_53 = /* @__PURE__ */ createBaseVNode("p", { class: "subtitle is-6 light-text" }, " Lorem ipsum dolor sit amet, consectetur adipiscing elit. ", -1);
const _hoisted_54 = { class: "column is-3" };
const _hoisted_55 = { class: "card card-icon-box" };
const _hoisted_56 = { class: "card-content" };
const _hoisted_57 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-pie-chart-alt"
}, null, -1);
const _hoisted_58 = /* @__PURE__ */ createBaseVNode("h4", { class: "title is-5" }, "Icon title", -1);
const _hoisted_59 = /* @__PURE__ */ createBaseVNode("p", { class: "subtitle is-6 light-text" }, " Lorem ipsum dolor sit amet, consectetur adipiscing elit. ", -1);
const _hoisted_60 = { class: "column is-3" };
const _hoisted_61 = { class: "card card-icon-box" };
const _hoisted_62 = { class: "card-content" };
const _hoisted_63 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-licencse"
}, null, -1);
const _hoisted_64 = /* @__PURE__ */ createBaseVNode("h4", { class: "title is-5" }, "Icon title", -1);
const _hoisted_65 = /* @__PURE__ */ createBaseVNode("p", { class: "subtitle is-6 light-text" }, " Lorem ipsum dolor sit amet, consectetur adipiscing elit. ", -1);
const _hoisted_66 = { class: "column is-3" };
const _hoisted_67 = { class: "card card-icon-box" };
const _hoisted_68 = { class: "card-content" };
const _hoisted_69 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-grow"
}, null, -1);
const _hoisted_70 = /* @__PURE__ */ createBaseVNode("h4", { class: "title is-5" }, "Icon title", -1);
const _hoisted_71 = /* @__PURE__ */ createBaseVNode("p", { class: "subtitle is-6 light-text" }, " Lorem ipsum dolor sit amet, consectetur adipiscing elit. ", -1);
const _hoisted_72 = { class: "column is-3" };
const _hoisted_73 = { class: "card card-icon-box" };
const _hoisted_74 = { class: "card-content" };
const _hoisted_75 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-bank"
}, null, -1);
const _hoisted_76 = /* @__PURE__ */ createBaseVNode("h4", { class: "title is-5" }, "Icon title", -1);
const _hoisted_77 = /* @__PURE__ */ createBaseVNode("p", { class: "subtitle is-6 light-text" }, " Lorem ipsum dolor sit amet, consectetur adipiscing elit. ", -1);
const _hoisted_78 = { class: "cta-block no-border" };
const _hoisted_79 = /* @__PURE__ */ createBaseVNode("div", { class: "head-text" }, [
  /* @__PURE__ */ createBaseVNode("h3", null, "Want to learn more?"),
  /* @__PURE__ */ createBaseVNode("p", null, "Check out the Vuero documentation")
], -1);
const _hoisted_80 = { class: "head-action" };
const _hoisted_81 = { class: "buttons" };
const _hoisted_82 = /* @__PURE__ */ createTextVNode(" Read the Docs ");
const _hoisted_83 = /* @__PURE__ */ createBaseVNode("a", {
  href: "https://cssninja.io",
  target: "_blank",
  rel: "noopener",
  class: "button chat-button is-secondary"
}, " Chat with us ", -1);
function _sfc_render(_ctx, _cache) {
  const _component_VIconBox = _sfc_main$7;
  const _component_VButton = _sfc_main$c;
  return openBlock(), createElementBlock("div", _hoisted_1$3, [
    createBaseVNode("div", _hoisted_2$3, [
      _hoisted_3$3,
      createBaseVNode("div", _hoisted_4$2, [
        createBaseVNode("div", _hoisted_5$2, [
          createBaseVNode("div", _hoisted_6$2, [
            createBaseVNode("div", _hoisted_7$2, [
              createBaseVNode("div", _hoisted_8$2, [
                createVNode(_component_VIconBox, {
                  size: "medium",
                  color: "blue"
                }, {
                  default: withCtx(() => [
                    _hoisted_9$2
                  ]),
                  _: 1
                }),
                _hoisted_10$2,
                _hoisted_11$2
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_12$2, [
            createBaseVNode("div", _hoisted_13$2, [
              createBaseVNode("div", _hoisted_14$2, [
                createVNode(_component_VIconBox, {
                  size: "medium",
                  color: "warning"
                }, {
                  default: withCtx(() => [
                    _hoisted_15$2
                  ]),
                  _: 1
                }),
                _hoisted_16$2,
                _hoisted_17$2
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_18$1, [
            createBaseVNode("div", _hoisted_19$1, [
              createBaseVNode("div", _hoisted_20$1, [
                createVNode(_component_VIconBox, {
                  size: "medium",
                  color: "success"
                }, {
                  default: withCtx(() => [
                    _hoisted_21$1
                  ]),
                  _: 1
                }),
                _hoisted_22$1,
                _hoisted_23
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_24, [
            createBaseVNode("div", _hoisted_25, [
              createBaseVNode("div", _hoisted_26, [
                createVNode(_component_VIconBox, {
                  size: "medium",
                  color: "purple"
                }, {
                  default: withCtx(() => [
                    _hoisted_27
                  ]),
                  _: 1
                }),
                _hoisted_28,
                _hoisted_29
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_30, [
            createBaseVNode("div", _hoisted_31, [
              createBaseVNode("div", _hoisted_32, [
                createVNode(_component_VIconBox, {
                  size: "medium",
                  color: "green"
                }, {
                  default: withCtx(() => [
                    _hoisted_33
                  ]),
                  _: 1
                }),
                _hoisted_34,
                _hoisted_35
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_36, [
            createBaseVNode("div", _hoisted_37, [
              createBaseVNode("div", _hoisted_38, [
                createVNode(_component_VIconBox, {
                  size: "medium",
                  color: "yellow"
                }, {
                  default: withCtx(() => [
                    _hoisted_39
                  ]),
                  _: 1
                }),
                _hoisted_40,
                _hoisted_41
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_42, [
            createBaseVNode("div", _hoisted_43, [
              createBaseVNode("div", _hoisted_44, [
                createVNode(_component_VIconBox, {
                  size: "medium",
                  color: "orange"
                }, {
                  default: withCtx(() => [
                    _hoisted_45
                  ]),
                  _: 1
                }),
                _hoisted_46,
                _hoisted_47
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_48, [
            createBaseVNode("div", _hoisted_49, [
              createBaseVNode("div", _hoisted_50, [
                createVNode(_component_VIconBox, {
                  size: "medium",
                  color: "info"
                }, {
                  default: withCtx(() => [
                    _hoisted_51
                  ]),
                  _: 1
                }),
                _hoisted_52,
                _hoisted_53
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_54, [
            createBaseVNode("div", _hoisted_55, [
              createBaseVNode("div", _hoisted_56, [
                createVNode(_component_VIconBox, {
                  size: "medium",
                  color: "blue"
                }, {
                  default: withCtx(() => [
                    _hoisted_57
                  ]),
                  _: 1
                }),
                _hoisted_58,
                _hoisted_59
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_60, [
            createBaseVNode("div", _hoisted_61, [
              createBaseVNode("div", _hoisted_62, [
                createVNode(_component_VIconBox, {
                  size: "medium",
                  color: "purple"
                }, {
                  default: withCtx(() => [
                    _hoisted_63
                  ]),
                  _: 1
                }),
                _hoisted_64,
                _hoisted_65
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_66, [
            createBaseVNode("div", _hoisted_67, [
              createBaseVNode("div", _hoisted_68, [
                createVNode(_component_VIconBox, {
                  size: "medium",
                  color: "green"
                }, {
                  default: withCtx(() => [
                    _hoisted_69
                  ]),
                  _: 1
                }),
                _hoisted_70,
                _hoisted_71
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_72, [
            createBaseVNode("div", _hoisted_73, [
              createBaseVNode("div", _hoisted_74, [
                createVNode(_component_VIconBox, {
                  size: "medium",
                  color: "yellow"
                }, {
                  default: withCtx(() => [
                    _hoisted_75
                  ]),
                  _: 1
                }),
                _hoisted_76,
                _hoisted_77
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_78, [
          _hoisted_79,
          createBaseVNode("div", _hoisted_80, [
            createBaseVNode("div", _hoisted_81, [
              createVNode(_component_VButton, {
                class: "action-button",
                color: "primary",
                rounded: "",
                elevated: "",
                href: "https://docs.cssninja.io/vuero"
              }, {
                default: withCtx(() => [
                  _hoisted_82
                ]),
                _: 1
              }),
              _hoisted_83
            ])
          ])
        ])
      ])
    ])
  ]);
}
var __unplugin_components_2 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render]]);
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function createSharedComposable(composable) {
  let subscribers = 0;
  let state;
  let scope;
  const dispose = () => {
    subscribers -= 1;
    if (scope && subscribers <= 0) {
      scope.stop();
      state = void 0;
      scope = void 0;
    }
  };
  return (...args) => {
    subscribers += 1;
    if (!state) {
      scope = effectScope(true);
      state = scope.run(() => composable(...args));
    }
    tryOnScopeDispose(dispose);
    return state;
  };
}
const isClient = typeof window !== "undefined";
const isString$2 = (val) => typeof val === "string";
const noop = () => {
};
function createFilterWrapper(filter, fn) {
  function wrapper(...args) {
    filter(() => fn.apply(this, args), { fn, thisArg: this, args });
  }
  return wrapper;
}
const bypassFilter = (invoke) => {
  return invoke();
};
function pausableFilter(extendFilter = bypassFilter) {
  const isActive = ref(true);
  function pause() {
    isActive.value = false;
  }
  function resume() {
    isActive.value = true;
  }
  const eventFilter = (...args) => {
    if (isActive.value)
      extendFilter(...args);
  };
  return { isActive, pause, resume, eventFilter };
}
function tryOnBeforeMount(fn, sync = true) {
  if (getCurrentInstance())
    onBeforeMount(fn);
  else if (sync)
    fn();
  else
    nextTick(fn);
}
var __getOwnPropSymbols$5 = Object.getOwnPropertySymbols;
var __hasOwnProp$5 = Object.prototype.hasOwnProperty;
var __propIsEnum$5 = Object.prototype.propertyIsEnumerable;
var __objRest$5 = (source3, exclude) => {
  var target = {};
  for (var prop in source3)
    if (__hasOwnProp$5.call(source3, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source3[prop];
  if (source3 != null && __getOwnPropSymbols$5)
    for (var prop of __getOwnPropSymbols$5(source3)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$5.call(source3, prop))
        target[prop] = source3[prop];
    }
  return target;
};
function watchWithFilter(source3, cb, options = {}) {
  const _a2 = options, {
    eventFilter = bypassFilter
  } = _a2, watchOptions = __objRest$5(_a2, [
    "eventFilter"
  ]);
  return watch(source3, createFilterWrapper(eventFilter, cb), watchOptions);
}
var __defProp$1 = Object.defineProperty;
var __defProps$1 = Object.defineProperties;
var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a2, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a2, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a2, prop, b[prop]);
    }
  return a2;
};
var __spreadProps$1 = (a2, b) => __defProps$1(a2, __getOwnPropDescs$1(b));
var __objRest$1 = (source3, exclude) => {
  var target = {};
  for (var prop in source3)
    if (__hasOwnProp$1.call(source3, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source3[prop];
  if (source3 != null && __getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(source3)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1.call(source3, prop))
        target[prop] = source3[prop];
    }
  return target;
};
function watchPausable(source3, cb, options = {}) {
  const _a2 = options, {
    eventFilter: filter
  } = _a2, watchOptions = __objRest$1(_a2, [
    "eventFilter"
  ]);
  const { eventFilter, pause, resume, isActive } = pausableFilter(filter);
  const stop = watchWithFilter(source3, cb, __spreadProps$1(__spreadValues$1({}, watchOptions), {
    eventFilter
  }));
  return { stop, pause, resume, isActive };
}
function unrefElement(elRef) {
  var _a2;
  const plain = unref(elRef);
  return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
}
const defaultWindow = isClient ? window : void 0;
isClient ? window.document : void 0;
isClient ? window.navigator : void 0;
isClient ? window.location : void 0;
function useEventListener(...args) {
  let target;
  let event;
  let listener;
  let options;
  if (isString$2(args[0])) {
    [event, listener, options] = args;
    target = defaultWindow;
  } else {
    [target, event, listener, options] = args;
  }
  if (!target)
    return noop;
  let cleanup = noop;
  const stopWatch = watch(() => unrefElement(target), (el) => {
    cleanup();
    if (!el)
      return;
    el.addEventListener(event, listener, options);
    cleanup = () => {
      el.removeEventListener(event, listener, options);
      cleanup = noop;
    };
  }, { immediate: true, flush: "post" });
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
function onClickOutside(target, handler, options = {}) {
  const { window: window2 = defaultWindow, ignore, capture = true } = options;
  if (!window2)
    return;
  const shouldListen = ref(true);
  const listener = (event) => {
    const el = unrefElement(target);
    const composedPath = event.composedPath();
    if (!el || el === event.target || composedPath.includes(el) || !shouldListen.value)
      return;
    if (ignore && ignore.length > 0) {
      if (ignore.some((target2) => {
        const el2 = unrefElement(target2);
        return el2 && (event.target === el2 || composedPath.includes(el2));
      }))
        return;
    }
    handler(event);
  };
  const cleanup = [
    useEventListener(window2, "click", listener, { passive: true, capture }),
    useEventListener(window2, "pointerdown", (e2) => {
      const el = unrefElement(target);
      shouldListen.value = !!el && !e2.composedPath().includes(el);
    }, { passive: true })
  ];
  const stop = () => cleanup.forEach((fn) => fn());
  return stop;
}
function useMediaQuery(query, options = {}) {
  const { window: window2 = defaultWindow } = options;
  let mediaQuery;
  const matches2 = ref(false);
  const update = () => {
    if (!window2)
      return;
    if (!mediaQuery)
      mediaQuery = window2.matchMedia(query);
    matches2.value = mediaQuery.matches;
  };
  tryOnBeforeMount(() => {
    update();
    if (!mediaQuery)
      return;
    if ("addEventListener" in mediaQuery)
      mediaQuery.addEventListener("change", update);
    else
      mediaQuery.addListener(update);
    tryOnScopeDispose(() => {
      if ("removeEventListener" in mediaQuery)
        mediaQuery.removeEventListener("change", update);
      else
        mediaQuery.removeListener(update);
    });
  });
  return matches2;
}
const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey = "__vueuse_ssr_handlers__";
_global[globalKey] = _global[globalKey] || {};
const handlers = _global[globalKey];
function getSSRHandler(key, fallback) {
  return handlers[key] || fallback;
}
function guessSerializerType(rawInit) {
  return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : Array.isArray(rawInit) ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
}
const StorageSerializers = {
  boolean: {
    read: (v2) => v2 === "true",
    write: (v2) => String(v2)
  },
  object: {
    read: (v2) => JSON.parse(v2),
    write: (v2) => JSON.stringify(v2)
  },
  number: {
    read: (v2) => Number.parseFloat(v2),
    write: (v2) => String(v2)
  },
  any: {
    read: (v2) => v2,
    write: (v2) => String(v2)
  },
  string: {
    read: (v2) => v2,
    write: (v2) => String(v2)
  },
  map: {
    read: (v2) => new Map(JSON.parse(v2)),
    write: (v2) => JSON.stringify(Array.from(v2.entries()))
  },
  set: {
    read: (v2) => new Set(JSON.parse(v2)),
    write: (v2) => JSON.stringify(Array.from(v2))
  },
  date: {
    read: (v2) => new Date(v2),
    write: (v2) => v2.toISOString()
  }
};
function useStorage(key, initialValue, storage2, options = {}) {
  var _a2;
  const {
    flush = "pre",
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    shallow,
    window: window2 = defaultWindow,
    eventFilter,
    onError = (e2) => {
      console.error(e2);
    }
  } = options;
  const data2 = (shallow ? shallowRef : ref)(initialValue);
  if (!storage2) {
    try {
      storage2 = getSSRHandler("getDefaultStorage", () => {
        var _a22;
        return (_a22 = defaultWindow) == null ? void 0 : _a22.localStorage;
      })();
    } catch (e2) {
      onError(e2);
    }
  }
  if (!storage2)
    return data2;
  const rawInit = unref(initialValue);
  const type = guessSerializerType(rawInit);
  const serializer = (_a2 = options.serializer) != null ? _a2 : StorageSerializers[type];
  const { pause: pauseWatch, resume: resumeWatch } = watchPausable(data2, () => write(data2.value), { flush, deep, eventFilter });
  if (window2 && listenToStorageChanges)
    useEventListener(window2, "storage", update);
  update();
  return data2;
  function write(v2) {
    try {
      if (v2 == null)
        storage2.removeItem(key);
      else
        storage2.setItem(key, serializer.write(v2));
    } catch (e2) {
      onError(e2);
    }
  }
  function read(event) {
    if (event && event.key !== key)
      return;
    pauseWatch();
    try {
      const rawValue = event ? event.newValue : storage2.getItem(key);
      if (rawValue == null) {
        if (writeDefaults && rawInit !== null)
          storage2.setItem(key, serializer.write(rawInit));
        return rawInit;
      } else if (typeof rawValue !== "string") {
        return rawValue;
      } else {
        return serializer.read(rawValue);
      }
    } catch (e2) {
      onError(e2);
    } finally {
      resumeWatch();
    }
  }
  function update(event) {
    if (event && event.key !== key)
      return;
    data2.value = read(event);
  }
}
function usePreferredDark(options) {
  return useMediaQuery("(prefers-color-scheme: dark)", options);
}
function useCssVar(prop, target, { window: window2 = defaultWindow } = {}) {
  const variable = ref("");
  const elRef = computed(() => {
    var _a2;
    return unrefElement(target) || ((_a2 = window2 == null ? void 0 : window2.document) == null ? void 0 : _a2.documentElement);
  });
  watch([elRef, () => unref(prop)], ([el, prop2]) => {
    if (el && window2)
      variable.value = window2.getComputedStyle(el).getPropertyValue(prop2);
  }, { immediate: true });
  watch(variable, (val) => {
    var _a2;
    if ((_a2 = elRef.value) == null ? void 0 : _a2.style)
      elRef.value.style.setProperty(unref(prop), val);
  });
  return variable;
}
var _a, _b;
isClient && (window == null ? void 0 : window.navigator) && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.platform) && /iP(ad|hone|od)/.test((_b = window == null ? void 0 : window.navigator) == null ? void 0 : _b.platform);
function useWindowScroll({ window: window2 = defaultWindow } = {}) {
  if (!window2) {
    return {
      x: ref(0),
      y: ref(0)
    };
  }
  const x = ref(window2.pageXOffset);
  const y = ref(window2.pageYOffset);
  useEventListener("scroll", () => {
    x.value = window2.pageXOffset;
    y.value = window2.pageYOffset;
  }, {
    capture: false,
    passive: true
  });
  return { x, y };
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var vueScrollto = { exports: {} };
/*!
  * vue-scrollto v2.20.0
  * (c) 2019 Randjelovic Igor
  * @license MIT
  */
(function(module, exports) {
  (function(global2, factory) {
    module.exports = factory();
  })(commonjsGlobal, function() {
    function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source3 = arguments[i2];
          for (var key in source3) {
            if (Object.prototype.hasOwnProperty.call(source3, key)) {
              target[key] = source3[key];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var NEWTON_ITERATIONS = 4;
    var NEWTON_MIN_SLOPE = 1e-3;
    var SUBDIVISION_PRECISION = 1e-7;
    var SUBDIVISION_MAX_ITERATIONS = 10;
    var kSplineTableSize = 11;
    var kSampleStepSize = 1 / (kSplineTableSize - 1);
    var float32ArraySupported = typeof Float32Array === "function";
    function A(aA1, aA2) {
      return 1 - 3 * aA2 + 3 * aA1;
    }
    function B(aA1, aA2) {
      return 3 * aA2 - 6 * aA1;
    }
    function C(aA1) {
      return 3 * aA1;
    }
    function calcBezier(aT, aA1, aA2) {
      return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
    }
    function getSlope(aT, aA1, aA2) {
      return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);
    }
    function binarySubdivide(aX, aA, aB, mX1, mX2) {
      var currentX, currentT, i2 = 0;
      do {
        currentT = aA + (aB - aA) / 2;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0) {
          aB = currentT;
        } else {
          aA = currentT;
        }
      } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i2 < SUBDIVISION_MAX_ITERATIONS);
      return currentT;
    }
    function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
      for (var i2 = 0; i2 < NEWTON_ITERATIONS; ++i2) {
        var currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0) {
          return aGuessT;
        }
        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }
      return aGuessT;
    }
    function LinearEasing(x) {
      return x;
    }
    var src = function bezier(mX1, mY1, mX2, mY2) {
      if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
        throw new Error("bezier x values must be in [0, 1] range");
      }
      if (mX1 === mY1 && mX2 === mY2) {
        return LinearEasing;
      }
      var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
      for (var i2 = 0; i2 < kSplineTableSize; ++i2) {
        sampleValues[i2] = calcBezier(i2 * kSampleStepSize, mX1, mX2);
      }
      function getTForX(aX) {
        var intervalStart = 0;
        var currentSample = 1;
        var lastSample = kSplineTableSize - 1;
        for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
          intervalStart += kSampleStepSize;
        }
        --currentSample;
        var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        var guessForT = intervalStart + dist * kSampleStepSize;
        var initialSlope = getSlope(guessForT, mX1, mX2);
        if (initialSlope >= NEWTON_MIN_SLOPE) {
          return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        } else if (initialSlope === 0) {
          return guessForT;
        } else {
          return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
        }
      }
      return function BezierEasing(x) {
        if (x === 0) {
          return 0;
        }
        if (x === 1) {
          return 1;
        }
        return calcBezier(getTForX(x), mY1, mY2);
      };
    };
    var easings = {
      ease: [0.25, 0.1, 0.25, 1],
      linear: [0, 0, 1, 1],
      "ease-in": [0.42, 0, 1, 1],
      "ease-out": [0, 0, 0.58, 1],
      "ease-in-out": [0.42, 0, 0.58, 1]
    };
    var supportsPassive = false;
    try {
      var opts = Object.defineProperty({}, "passive", {
        get: function get2() {
          supportsPassive = true;
        }
      });
      window.addEventListener("test", null, opts);
    } catch (e2) {
    }
    var _2 = {
      $: function $(selector2) {
        if (typeof selector2 !== "string") {
          return selector2;
        }
        return document.querySelector(selector2);
      },
      on: function on2(element, events, handler) {
        var opts2 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
          passive: false
        };
        if (!(events instanceof Array)) {
          events = [events];
        }
        for (var i2 = 0; i2 < events.length; i2++) {
          element.addEventListener(events[i2], handler, supportsPassive ? opts2 : false);
        }
      },
      off: function off2(element, events, handler) {
        if (!(events instanceof Array)) {
          events = [events];
        }
        for (var i2 = 0; i2 < events.length; i2++) {
          element.removeEventListener(events[i2], handler);
        }
      },
      cumulativeOffset: function cumulativeOffset(element) {
        var top = 0;
        var left = 0;
        do {
          top += element.offsetTop || 0;
          left += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);
        return {
          top,
          left
        };
      }
    };
    var abortEvents = ["mousedown", "wheel", "DOMMouseScroll", "mousewheel", "keyup", "touchmove"];
    var defaults2 = {
      container: "body",
      duration: 500,
      lazy: true,
      easing: "ease",
      offset: 0,
      force: true,
      cancelable: true,
      onStart: false,
      onDone: false,
      onCancel: false,
      x: false,
      y: true
    };
    function setDefaults(options) {
      defaults2 = _extends({}, defaults2, options);
    }
    var scroller = function scroller2() {
      var element;
      var container;
      var duration;
      var easing;
      var lazy;
      var offset;
      var force;
      var cancelable;
      var onStart;
      var onDone;
      var onCancel;
      var x;
      var y;
      var initialX;
      var targetX;
      var initialY;
      var targetY;
      var diffX;
      var diffY;
      var abort;
      var cumulativeOffsetContainer;
      var cumulativeOffsetElement;
      var abortEv;
      var abortFn = function abortFn2(e2) {
        if (!cancelable)
          return;
        abortEv = e2;
        abort = true;
      };
      var easingFn;
      var timeStart;
      var timeElapsed;
      var progress;
      function scrollTop(container2) {
        var scrollTop2 = container2.scrollTop;
        if (container2.tagName.toLowerCase() === "body") {
          scrollTop2 = scrollTop2 || document.documentElement.scrollTop;
        }
        return scrollTop2;
      }
      function scrollLeft(container2) {
        var scrollLeft2 = container2.scrollLeft;
        if (container2.tagName.toLowerCase() === "body") {
          scrollLeft2 = scrollLeft2 || document.documentElement.scrollLeft;
        }
        return scrollLeft2;
      }
      function recalculateTargets() {
        cumulativeOffsetContainer = _2.cumulativeOffset(container);
        cumulativeOffsetElement = _2.cumulativeOffset(element);
        if (x) {
          targetX = cumulativeOffsetElement.left - cumulativeOffsetContainer.left + offset;
          diffX = targetX - initialX;
        }
        if (y) {
          targetY = cumulativeOffsetElement.top - cumulativeOffsetContainer.top + offset;
          diffY = targetY - initialY;
        }
      }
      function step(timestamp) {
        if (abort)
          return done();
        if (!timeStart)
          timeStart = timestamp;
        if (!lazy) {
          recalculateTargets();
        }
        timeElapsed = timestamp - timeStart;
        progress = Math.min(timeElapsed / duration, 1);
        progress = easingFn(progress);
        topLeft(container, initialY + diffY * progress, initialX + diffX * progress);
        timeElapsed < duration ? window.requestAnimationFrame(step) : done();
      }
      function done() {
        if (!abort)
          topLeft(container, targetY, targetX);
        timeStart = false;
        _2.off(container, abortEvents, abortFn);
        if (abort && onCancel)
          onCancel(abortEv, element);
        if (!abort && onDone)
          onDone(element);
      }
      function topLeft(element2, top, left) {
        if (y)
          element2.scrollTop = top;
        if (x)
          element2.scrollLeft = left;
        if (element2.tagName.toLowerCase() === "body") {
          if (y)
            document.documentElement.scrollTop = top;
          if (x)
            document.documentElement.scrollLeft = left;
        }
      }
      function scrollTo(target, _duration) {
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        if (_typeof(_duration) === "object") {
          options = _duration;
        } else if (typeof _duration === "number") {
          options.duration = _duration;
        }
        element = _2.$(target);
        if (!element) {
          return console.warn("[vue-scrollto warn]: Trying to scroll to an element that is not on the page: " + target);
        }
        container = _2.$(options.container || defaults2.container);
        duration = options.hasOwnProperty("duration") ? options.duration : defaults2.duration;
        lazy = options.hasOwnProperty("lazy") ? options.lazy : defaults2.lazy;
        easing = options.easing || defaults2.easing;
        offset = options.hasOwnProperty("offset") ? options.offset : defaults2.offset;
        force = options.hasOwnProperty("force") ? options.force !== false : defaults2.force;
        cancelable = options.hasOwnProperty("cancelable") ? options.cancelable !== false : defaults2.cancelable;
        onStart = options.onStart || defaults2.onStart;
        onDone = options.onDone || defaults2.onDone;
        onCancel = options.onCancel || defaults2.onCancel;
        x = options.x === void 0 ? defaults2.x : options.x;
        y = options.y === void 0 ? defaults2.y : options.y;
        if (typeof offset === "function") {
          offset = offset(element, container);
        }
        initialX = scrollLeft(container);
        initialY = scrollTop(container);
        recalculateTargets();
        abort = false;
        if (!force) {
          var containerHeight = container.tagName.toLowerCase() === "body" ? document.documentElement.clientHeight || window.innerHeight : container.offsetHeight;
          var containerTop = initialY;
          var containerBottom = containerTop + containerHeight;
          var elementTop = targetY - offset;
          var elementBottom = elementTop + element.offsetHeight;
          if (elementTop >= containerTop && elementBottom <= containerBottom) {
            if (onDone)
              onDone(element);
            return;
          }
        }
        if (onStart)
          onStart(element);
        if (!diffY && !diffX) {
          if (onDone)
            onDone(element);
          return;
        }
        if (typeof easing === "string") {
          easing = easings[easing] || easings["ease"];
        }
        easingFn = src.apply(src, easing);
        _2.on(container, abortEvents, abortFn, {
          passive: true
        });
        window.requestAnimationFrame(step);
        return function() {
          abortEv = null;
          abort = true;
        };
      }
      return scrollTo;
    };
    var _scroller = scroller();
    var bindings = [];
    function deleteBinding(el) {
      for (var i2 = 0; i2 < bindings.length; ++i2) {
        if (bindings[i2].el === el) {
          bindings.splice(i2, 1);
          return true;
        }
      }
      return false;
    }
    function findBinding(el) {
      for (var i2 = 0; i2 < bindings.length; ++i2) {
        if (bindings[i2].el === el) {
          return bindings[i2];
        }
      }
    }
    function getBinding(el) {
      var binding = findBinding(el);
      if (binding) {
        return binding;
      }
      bindings.push(binding = {
        el,
        binding: {}
      });
      return binding;
    }
    function handleClick(e2) {
      var ctx = getBinding(this).binding;
      if (!ctx.value)
        return;
      e2.preventDefault();
      if (typeof ctx.value === "string") {
        return _scroller(ctx.value);
      }
      _scroller(ctx.value.el || ctx.value.element, ctx.value);
    }
    var directiveHooks = {
      bind: function bind3(el, binding) {
        getBinding(el).binding = binding;
        _2.on(el, "click", handleClick);
      },
      unbind: function unbind(el) {
        deleteBinding(el);
        _2.off(el, "click", handleClick);
      },
      update: function update(el, binding) {
        getBinding(el).binding = binding;
      }
    };
    var VueScrollTo2 = {
      bind: directiveHooks.bind,
      unbind: directiveHooks.unbind,
      update: directiveHooks.update,
      beforeMount: directiveHooks.bind,
      unmounted: directiveHooks.unbind,
      updated: directiveHooks.update,
      scrollTo: _scroller,
      bindings
    };
    var install = function install2(Vue, options) {
      if (options)
        setDefaults(options);
      Vue.directive("scroll-to", VueScrollTo2);
      var properties = Vue.config.globalProperties || Vue.prototype;
      properties.$scrollTo = VueScrollTo2.scrollTo;
    };
    if (typeof window !== "undefined" && window.Vue) {
      window.VueScrollTo = VueScrollTo2;
      window.VueScrollTo.setDefaults = setDefaults;
      window.VueScrollTo.scroller = scroller;
      if (window.Vue.use)
        window.Vue.use(install);
    }
    VueScrollTo2.install = install;
    return VueScrollTo2;
  });
})(vueScrollto);
var VueScrollTo = vueScrollto.exports;
const isLargeScreen = useMediaQuery("(min-width: 1023px)");
useMediaQuery("(min-width: 767px)");
useMediaQuery("(max-width: 767px)");
const DARK_MODE_BODY_CLASS = "is-dark";
const initDarkmode = () => {
  const darkmode = useDarkmode();
  watchEffect(() => {
    const body = document.documentElement;
    if (darkmode.isDark) {
      body.classList.add(DARK_MODE_BODY_CLASS);
    } else {
      body.classList.remove(DARK_MODE_BODY_CLASS);
    }
  });
};
const useDarkmode = defineStore("darkmode", () => {
  const preferredDark = usePreferredDark();
  const colorSchema = useStorage("color-schema", "auto");
  const isDark = computed({
    get() {
      return colorSchema.value === "auto" ? preferredDark.value : colorSchema.value === "dark";
    },
    set(v2) {
      if (v2 === preferredDark.value)
        colorSchema.value = "auto";
      else
        colorSchema.value = v2 ? "dark" : "light";
    }
  });
  const onChange = (event) => {
    const target = event.target;
    isDark.value = !target.checked;
  };
  return {
    isDark,
    onChange
  };
});
var LandingEmptyNavigation_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$2 = { class: "navbar-brand" };
const _hoisted_2$2 = { class: "brand-icon" };
const _hoisted_3$2 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, null, -1);
const _hoisted_4$1 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, null, -1);
const _hoisted_5$1 = /* @__PURE__ */ createBaseVNode("span", { "aria-hidden": "true" }, null, -1);
const _hoisted_6$1 = [
  _hoisted_3$2,
  _hoisted_4$1,
  _hoisted_5$1
];
const _hoisted_7$1 = { class: "navbar-start" };
const _hoisted_8$1 = { class: "navbar-item" };
const _hoisted_9$1 = /* @__PURE__ */ createTextVNode(" Awesome Features ");
const _hoisted_10$1 = { class: "navbar-end" };
const _hoisted_11$1 = { class: "navbar-item is-theme-toggle" };
const _hoisted_12$1 = { class: "theme-toggle" };
const _hoisted_13$1 = /* @__PURE__ */ createStaticVNode('<span class="toggler"><span class="dark"><i aria-hidden="true" class="iconify" data-icon="feather:moon"></i></span><span class="light"><i aria-hidden="true" class="iconify" data-icon="feather:sun"></i></span></span>', 1);
const _hoisted_14$1 = { class: "navbar-item" };
const _hoisted_15$1 = /* @__PURE__ */ createTextVNode(" Login ");
const _hoisted_16$1 = { class: "navbar-item" };
const _hoisted_17$1 = /* @__PURE__ */ createBaseVNode("strong", null, "Sign up", -1);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  setup(__props) {
    const darkmode = useDarkmode();
    const isMobileNavOpen = ref(false);
    const scrollTo = VueScrollTo.scrollTo;
    const { y } = useWindowScroll();
    const isScrolling = computed(() => {
      return y.value > 30;
    });
    watchEffect(() => {
      if (isLargeScreen.value) {
        isMobileNavOpen.value = false;
      }
    });
    return (_ctx, _cache) => {
      const _component_AnimatedLogo = __unplugin_components_0;
      const _component_RouterLink = resolveComponent("RouterLink");
      const _component_VButton = _sfc_main$c;
      return openBlock(), createElementBlock("nav", {
        class: normalizeClass(["navbar is-fixed-top is-transparent", [!unref(isScrolling) && "is-docked", isMobileNavOpen.value && "is-solid"]]),
        "aria-label": "main navigation"
      }, [
        createBaseVNode("div", _hoisted_1$2, [
          createBaseVNode("a", {
            href: "/",
            class: "navbar-item",
            onClick: _cache[0] || (_cache[0] = withModifiers(($event) => unref(scrollTo)("#app", 800), ["prevent"]))
          }, [
            createBaseVNode("div", _hoisted_2$2, [
              createVNode(_component_AnimatedLogo, {
                width: "34px",
                height: "34px"
              })
            ])
          ]),
          createBaseVNode("a", {
            role: "button",
            class: normalizeClass([[isMobileNavOpen.value && "is-active"], "navbar-burger burger"]),
            "aria-label": "menu",
            tabindex: "0",
            "aria-expanded": "false",
            onKeydown: _cache[1] || (_cache[1] = withKeys(withModifiers(($event) => isMobileNavOpen.value = !isMobileNavOpen.value, ["prevent"]), ["space"])),
            onClick: _cache[2] || (_cache[2] = ($event) => isMobileNavOpen.value = !isMobileNavOpen.value)
          }, _hoisted_6$1, 34)
        ]),
        createBaseVNode("div", {
          class: normalizeClass(["navbar-menu", [isMobileNavOpen.value && "is-active"]])
        }, [
          createBaseVNode("div", _hoisted_7$1, [
            createBaseVNode("div", _hoisted_8$1, [
              createVNode(_component_RouterLink, {
                to: {
                  name: "index"
                },
                class: "nav-link",
                onClickPassive: _cache[3] || (_cache[3] = () => {
                  unref(scrollTo)("#features", 800, { offset: -50 });
                  isMobileNavOpen.value = false;
                })
              }, {
                default: withCtx(() => [
                  _hoisted_9$1
                ]),
                _: 1
              })
            ])
          ]),
          createBaseVNode("div", _hoisted_10$1, [
            createBaseVNode("div", _hoisted_11$1, [
              createBaseVNode("label", _hoisted_12$1, [
                withDirectives(createBaseVNode("input", {
                  id: "navbar-night-toggle--daynight",
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(darkmode).isDark = $event),
                  type: "checkbox"
                }, null, 512), [
                  [vModelCheckbox, unref(darkmode).isDark]
                ]),
                _hoisted_13$1
              ])
            ]),
            createBaseVNode("div", _hoisted_14$1, [
              createVNode(_component_RouterLink, {
                to: { name: "auth-login" },
                class: "nav-link"
              }, {
                default: withCtx(() => [
                  _hoisted_15$1
                ]),
                _: 1
              })
            ]),
            createBaseVNode("div", _hoisted_16$1, [
              createVNode(_component_VButton, {
                to: { name: "auth-signup" },
                color: "primary",
                rounded: "",
                raised: ""
              }, {
                default: withCtx(() => [
                  _hoisted_17$1
                ]),
                _: 1
              })
            ])
          ])
        ], 2)
      ], 2);
    };
  }
});
var _imports_4 = "/images/icons/hexagons/purple.svg";
var _imports_5 = "/images/icons/hexagons/purple-heavy.svg";
var _imports_6 = "/assets/app-2.e0bbbcb4.png";
var _imports_7 = "/assets/app-2-dark.8d461e24.png";
var index_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$1 = { class: "landing-page-wrapper" };
const _hoisted_2$1 = {
  id: "Vuero-marketing",
  class: "hero marketing-hero is-left is-fullheight"
};
const _hoisted_3$1 = /* @__PURE__ */ createBaseVNode("img", {
  class: "hexagon hexagon-1 light-image-l",
  src: _imports_0$1,
  alt: ""
}, null, -1);
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("img", {
  class: "hexagon hexagon-1 dark-image-l",
  src: _imports_1$1,
  alt: ""
}, null, -1);
const _hoisted_5 = /* @__PURE__ */ createBaseVNode("img", {
  class: "hexagon hexagon-2 light-image-l",
  src: _imports_0$1,
  alt: ""
}, null, -1);
const _hoisted_6 = /* @__PURE__ */ createBaseVNode("img", {
  class: "hexagon hexagon-2 dark-image-l",
  src: _imports_1$1,
  alt: ""
}, null, -1);
const _hoisted_7 = /* @__PURE__ */ createBaseVNode("img", {
  class: "hexagon hexagon-3 light-image-l",
  src: _imports_2$2,
  alt: ""
}, null, -1);
const _hoisted_8 = /* @__PURE__ */ createBaseVNode("img", {
  class: "hexagon hexagon-3 dark-image-l",
  src: _imports_3$1,
  alt: ""
}, null, -1);
const _hoisted_9 = /* @__PURE__ */ createBaseVNode("img", {
  class: "hexagon hexagon-4 light-image-l",
  src: _imports_4,
  alt: ""
}, null, -1);
const _hoisted_10 = /* @__PURE__ */ createBaseVNode("img", {
  class: "hexagon hexagon-4 dark-image-l",
  src: _imports_5,
  alt: ""
}, null, -1);
const _hoisted_11 = { class: "hero-body" };
const _hoisted_12 = { class: "container" };
const _hoisted_13 = { class: "columns is-vcentered" };
const _hoisted_14 = { class: "column is-5" };
const _hoisted_15 = /* @__PURE__ */ createBaseVNode("h1", { class: "title is-1 is-bold" }, "Easier development. Beautiful projects", -1);
const _hoisted_16 = /* @__PURE__ */ createBaseVNode("h3", { class: "subtitle is-4 pt-2 light-text" }, " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Isto modo ne improbos quidem. ", -1);
const _hoisted_17 = { class: "buttons" };
const _hoisted_18 = /* @__PURE__ */ createTextVNode(" Get Started ");
const _hoisted_19 = /* @__PURE__ */ createTextVNode(" 14-day Trial ");
const _hoisted_20 = /* @__PURE__ */ createBaseVNode("div", { class: "column is-7" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    class: "light-image-l hero-mockup",
    src: _imports_6,
    alt: ""
  }),
  /* @__PURE__ */ createBaseVNode("img", {
    class: "dark-image-l hero-mockup",
    src: _imports_7,
    alt: ""
  })
], -1);
const _hoisted_21 = /* @__PURE__ */ createBaseVNode("a", {
  id: "features",
  name: "features",
  "aria-label": "Features"
}, null, -1);
const _hoisted_22 = /* @__PURE__ */ createBaseVNode("div", { id: "backtotop" }, [
  /* @__PURE__ */ createBaseVNode("a", {
    href: "#",
    "aria-label": "back to top"
  }, [
    /* @__PURE__ */ createBaseVNode("i", {
      "aria-hidden": "true",
      class: "fas fa-angle-up"
    })
  ])
], -1);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  setup(__props) {
    useHead({
      title: "Vuero - A complete Vue 3 design system"
    });
    return (_ctx, _cache) => {
      const _component_LandingEmptyNavigation = _sfc_main$5;
      const _component_VButton = _sfc_main$c;
      const _component_MarketingFeaturesIcons = __unplugin_components_2;
      const _component_MarketingPricings = __unplugin_components_3;
      const _component_MarketingMockup = __unplugin_components_4;
      const _component_MarketingSideFeatures = __unplugin_components_5;
      const _component_MarketingAbout = __unplugin_components_6;
      const _component_LandingFooter = __unplugin_components_7;
      const _component_LandingLayout = _sfc_main$i;
      return openBlock(), createBlock(_component_LandingLayout, { theme: "light" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$1, [
            createBaseVNode("div", _hoisted_2$1, [
              createVNode(_component_LandingEmptyNavigation),
              _hoisted_3$1,
              _hoisted_4,
              _hoisted_5,
              _hoisted_6,
              _hoisted_7,
              _hoisted_8,
              _hoisted_9,
              _hoisted_10,
              createBaseVNode("div", _hoisted_11, [
                createBaseVNode("div", _hoisted_12, [
                  createBaseVNode("div", _hoisted_13, [
                    createBaseVNode("div", _hoisted_14, [
                      _hoisted_15,
                      _hoisted_16,
                      createBaseVNode("div", _hoisted_17, [
                        createVNode(_component_VButton, {
                          color: "primary",
                          bold: "",
                          rounded: "",
                          raised: ""
                        }, {
                          default: withCtx(() => [
                            _hoisted_18
                          ]),
                          _: 1
                        }),
                        createVNode(_component_VButton, {
                          color: "primary",
                          outlined: "",
                          bold: "",
                          rounded: "",
                          raised: ""
                        }, {
                          default: withCtx(() => [
                            _hoisted_19
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    _hoisted_20
                  ])
                ])
              ])
            ]),
            _hoisted_21,
            createVNode(_component_MarketingFeaturesIcons),
            createVNode(_component_MarketingPricings),
            createVNode(_component_MarketingMockup),
            createVNode(_component_MarketingSideFeatures),
            createVNode(_component_MarketingAbout),
            createVNode(_component_LandingFooter),
            _hoisted_22
          ])
        ]),
        _: 1
      });
    };
  }
});
const __pages_import_0__ = () => __vitePreload(() => import("./_...all_.004d837b.js"), true ? ["assets/_...all_.004d837b.js","assets/_...all_.23dbd238.css"] : void 0);
const __pages_import_1__ = () => __vitePreload(() => import("./app.16393eab.js"), true ? ["assets/app.16393eab.js","assets/app.c0fa3b71.css","assets/VDropdown.047f96fc.js","assets/VDropdown.4bffdbfa.css","assets/route-block.b5bad31b.js"] : void 0);
const __pages_import_2__ = () => __vitePreload(() => import("./index.5a35a45b.js"), true ? ["assets/index.5a35a45b.js","assets/index.dbdbb066.css","assets/VControl.725fb454.js","assets/VControl.8223fd89.css","assets/VDropdown.047f96fc.js","assets/VDropdown.4bffdbfa.css"] : void 0);
const __pages_import_3__ = () => __vitePreload(() => import("./auth.a55ee18f.js"), true ? ["assets/auth.a55ee18f.js","assets/auth.4a9d4d8a.css"] : void 0);
const __pages_import_4__ = () => __vitePreload(() => import("./index.119e33a2.js"), true ? ["assets/index.119e33a2.js","assets/route-block.b5bad31b.js"] : void 0);
const __pages_import_5__ = () => __vitePreload(() => import("./login.3f732c83.js"), true ? ["assets/login.3f732c83.js","assets/VControl.725fb454.js","assets/VControl.8223fd89.css","assets/sleep.6f083af3.js","assets/useNotyf.057d9f71.js"] : void 0);
const __pages_import_6__ = () => __vitePreload(() => import("./signup.199ae8a9.js"), true ? ["assets/signup.199ae8a9.js","assets/VControl.725fb454.js","assets/VControl.8223fd89.css","assets/sleep.6f083af3.js","assets/useNotyf.057d9f71.js"] : void 0);
const routes = [{ "name": "all", "path": "/:all(.*)*", "component": __pages_import_0__, "props": true }, { "path": "/app", "component": __pages_import_1__, "children": [{ "name": "app", "path": "", "component": __pages_import_2__, "props": true }], "props": true, "meta": { "requiresAuth": true } }, { "path": "/auth", "component": __pages_import_3__, "children": [{ "name": "auth", "path": "", "component": __pages_import_4__, "props": true, "redirect": { "name": "auth-login" } }, { "name": "auth-login", "path": "login", "component": __pages_import_5__, "props": true }, { "name": "auth-signup", "path": "signup", "component": __pages_import_6__, "props": true }], "props": true }, { "name": "index", "path": "/", "component": _sfc_main$4, "props": true }];
function createRouter() {
  const router = createRouter$1({
    history: createWebHistory(),
    routes
  });
  return router;
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  props: {
    radius: { default: void 0 },
    color: { default: void 0 },
    elevated: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const cardRadius = computed(() => {
      if (props.radius === "smooth") {
        return "s-card";
      } else if (props.radius === "rounded") {
        return "l-card";
      }
      return "r-card";
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([unref(cardRadius), __props.elevated && "is-raised", props.color && `is-${props.color}`])
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  props: {
    align: { default: void 0 },
    addons: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["buttons", [props.addons && "has-addons", props.align && `is-${props.align}`]])
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
try {
  self["workbox:window:6.5.2"] && _();
} catch (n2) {
}
function n(n2, t2) {
  return new Promise(function(r2) {
    var e2 = new MessageChannel();
    e2.port1.onmessage = function(n3) {
      r2(n3.data);
    }, n2.postMessage(t2, [e2.port2]);
  });
}
function t(n2, t2) {
  for (var r2 = 0; r2 < t2.length; r2++) {
    var e2 = t2[r2];
    e2.enumerable = e2.enumerable || false, e2.configurable = true, "value" in e2 && (e2.writable = true), Object.defineProperty(n2, e2.key, e2);
  }
}
function r(n2, t2) {
  (t2 == null || t2 > n2.length) && (t2 = n2.length);
  for (var r2 = 0, e2 = new Array(t2); r2 < t2; r2++)
    e2[r2] = n2[r2];
  return e2;
}
function e(n2, t2) {
  var e2;
  if (typeof Symbol == "undefined" || n2[Symbol.iterator] == null) {
    if (Array.isArray(n2) || (e2 = function(n3, t3) {
      if (n3) {
        if (typeof n3 == "string")
          return r(n3, t3);
        var e3 = Object.prototype.toString.call(n3).slice(8, -1);
        return e3 === "Object" && n3.constructor && (e3 = n3.constructor.name), e3 === "Map" || e3 === "Set" ? Array.from(n3) : e3 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e3) ? r(n3, t3) : void 0;
      }
    }(n2)) || t2 && n2 && typeof n2.length == "number") {
      e2 && (n2 = e2);
      var i2 = 0;
      return function() {
        return i2 >= n2.length ? { done: true } : { done: false, value: n2[i2++] };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  return (e2 = n2[Symbol.iterator]()).next.bind(e2);
}
try {
  self["workbox:core:6.5.2"] && _();
} catch (n2) {
}
var i = function() {
  var n2 = this;
  this.promise = new Promise(function(t2, r2) {
    n2.resolve = t2, n2.reject = r2;
  });
};
function o(n2, t2) {
  var r2 = location.href;
  return new URL(n2, r2).href === new URL(t2, r2).href;
}
var u = function(n2, t2) {
  this.type = n2, Object.assign(this, t2);
};
function a(n2, t2, r2) {
  return r2 ? t2 ? t2(n2) : n2 : (n2 && n2.then || (n2 = Promise.resolve(n2)), t2 ? n2.then(t2) : n2);
}
function c() {
}
var f = { type: "SKIP_WAITING" };
function s(n2, t2) {
  if (!t2)
    return n2 && n2.then ? n2.then(c) : Promise.resolve();
}
var v = function(r2) {
  var e2, c2;
  function v2(n2, t2) {
    var e3, c3;
    return t2 === void 0 && (t2 = {}), (e3 = r2.call(this) || this).nn = {}, e3.tn = 0, e3.rn = new i(), e3.en = new i(), e3.on = new i(), e3.un = 0, e3.an = /* @__PURE__ */ new Set(), e3.cn = function() {
      var n3 = e3.fn, t3 = n3.installing;
      e3.tn > 0 || !o(t3.scriptURL, e3.sn.toString()) || performance.now() > e3.un + 6e4 ? (e3.vn = t3, n3.removeEventListener("updatefound", e3.cn)) : (e3.hn = t3, e3.an.add(t3), e3.rn.resolve(t3)), ++e3.tn, t3.addEventListener("statechange", e3.ln);
    }, e3.ln = function(n3) {
      var t3 = e3.fn, r3 = n3.target, i2 = r3.state, o2 = r3 === e3.vn, a2 = { sw: r3, isExternal: o2, originalEvent: n3 };
      !o2 && e3.mn && (a2.isUpdate = true), e3.dispatchEvent(new u(i2, a2)), i2 === "installed" ? e3.wn = self.setTimeout(function() {
        i2 === "installed" && t3.waiting === r3 && e3.dispatchEvent(new u("waiting", a2));
      }, 200) : i2 === "activating" && (clearTimeout(e3.wn), o2 || e3.en.resolve(r3));
    }, e3.dn = function(n3) {
      var t3 = e3.hn, r3 = t3 !== navigator.serviceWorker.controller;
      e3.dispatchEvent(new u("controlling", { isExternal: r3, originalEvent: n3, sw: t3, isUpdate: e3.mn })), r3 || e3.on.resolve(t3);
    }, e3.gn = (c3 = function(n3) {
      var t3 = n3.data, r3 = n3.ports, i2 = n3.source;
      return a(e3.getSW(), function() {
        e3.an.has(i2) && e3.dispatchEvent(new u("message", { data: t3, originalEvent: n3, ports: r3, sw: i2 }));
      });
    }, function() {
      for (var n3 = [], t3 = 0; t3 < arguments.length; t3++)
        n3[t3] = arguments[t3];
      try {
        return Promise.resolve(c3.apply(this, n3));
      } catch (n4) {
        return Promise.reject(n4);
      }
    }), e3.sn = n2, e3.nn = t2, navigator.serviceWorker.addEventListener("message", e3.gn), e3;
  }
  c2 = r2, (e2 = v2).prototype = Object.create(c2.prototype), e2.prototype.constructor = e2, e2.__proto__ = c2;
  var h2, l, w = v2.prototype;
  return w.register = function(n2) {
    var t2 = (n2 === void 0 ? {} : n2).immediate, r3 = t2 !== void 0 && t2;
    try {
      var e3 = this;
      return function(n3, t3) {
        var r4 = n3();
        if (r4 && r4.then)
          return r4.then(t3);
        return t3(r4);
      }(function() {
        if (!r3 && document.readyState !== "complete")
          return s(new Promise(function(n3) {
            return window.addEventListener("load", n3);
          }));
      }, function() {
        return e3.mn = Boolean(navigator.serviceWorker.controller), e3.yn = e3.pn(), a(e3.bn(), function(n3) {
          e3.fn = n3, e3.yn && (e3.hn = e3.yn, e3.en.resolve(e3.yn), e3.on.resolve(e3.yn), e3.yn.addEventListener("statechange", e3.ln, { once: true }));
          var t3 = e3.fn.waiting;
          return t3 && o(t3.scriptURL, e3.sn.toString()) && (e3.hn = t3, Promise.resolve().then(function() {
            e3.dispatchEvent(new u("waiting", { sw: t3, wasWaitingBeforeRegister: true }));
          }).then(function() {
          })), e3.hn && (e3.rn.resolve(e3.hn), e3.an.add(e3.hn)), e3.fn.addEventListener("updatefound", e3.cn), navigator.serviceWorker.addEventListener("controllerchange", e3.dn), e3.fn;
        });
      });
    } catch (n3) {
      return Promise.reject(n3);
    }
  }, w.update = function() {
    try {
      return this.fn ? s(this.fn.update()) : void 0;
    } catch (n2) {
      return Promise.reject(n2);
    }
  }, w.getSW = function() {
    return this.hn !== void 0 ? Promise.resolve(this.hn) : this.rn.promise;
  }, w.messageSW = function(t2) {
    try {
      return a(this.getSW(), function(r3) {
        return n(r3, t2);
      });
    } catch (n2) {
      return Promise.reject(n2);
    }
  }, w.messageSkipWaiting = function() {
    this.fn && this.fn.waiting && n(this.fn.waiting, f);
  }, w.pn = function() {
    var n2 = navigator.serviceWorker.controller;
    return n2 && o(n2.scriptURL, this.sn.toString()) ? n2 : void 0;
  }, w.bn = function() {
    try {
      var n2 = this;
      return function(n3, t2) {
        try {
          var r3 = n3();
        } catch (n4) {
          return t2(n4);
        }
        if (r3 && r3.then)
          return r3.then(void 0, t2);
        return r3;
      }(function() {
        return a(navigator.serviceWorker.register(n2.sn, n2.nn), function(t2) {
          return n2.un = performance.now(), t2;
        });
      }, function(n3) {
        throw n3;
      });
    } catch (n3) {
      return Promise.reject(n3);
    }
  }, h2 = v2, (l = [{ key: "active", get: function() {
    return this.en.promise;
  } }, { key: "controlling", get: function() {
    return this.on.promise;
  } }]) && t(h2.prototype, l), v2;
}(function() {
  function n2() {
    this.Pn = /* @__PURE__ */ new Map();
  }
  var t2 = n2.prototype;
  return t2.addEventListener = function(n3, t3) {
    this.Sn(n3).add(t3);
  }, t2.removeEventListener = function(n3, t3) {
    this.Sn(n3).delete(t3);
  }, t2.dispatchEvent = function(n3) {
    n3.target = this;
    for (var t3, r2 = e(this.Sn(n3.type)); !(t3 = r2()).done; ) {
      (0, t3.value)(n3);
    }
  }, t2.Sn = function(n3) {
    return this.Pn.has(n3) || this.Pn.set(n3, /* @__PURE__ */ new Set()), this.Pn.get(n3);
  }, n2;
}());
function registerSW(options = {}) {
  const {
    immediate = false,
    onNeedRefresh,
    onOfflineReady,
    onRegistered,
    onRegisterError
  } = options;
  let wb;
  let registration;
  const updateServiceWorker = async (reloadPage = true) => {
    {
      if (reloadPage) {
        wb == null ? void 0 : wb.addEventListener("controlling", (event) => {
          if (event.isUpdate)
            window.location.reload();
        });
      }
      if (registration && registration.waiting) {
        await n(registration.waiting, { type: "SKIP_WAITING" });
      }
    }
  };
  if ("serviceWorker" in navigator) {
    wb = new v("/sw.js", { scope: "/", type: "classic" });
    wb.addEventListener("activated", (event) => {
      if (event.isUpdate)
        ;
      else
        onOfflineReady == null ? void 0 : onOfflineReady();
    });
    {
      const showSkipWaitingPrompt = () => {
        onNeedRefresh == null ? void 0 : onNeedRefresh();
      };
      wb.addEventListener("waiting", showSkipWaitingPrompt);
      wb.addEventListener("externalwaiting", showSkipWaitingPrompt);
    }
    wb.register({ immediate }).then((r2) => {
      registration = r2;
      onRegistered == null ? void 0 : onRegistered(r2);
    }).catch((e2) => {
      onRegisterError == null ? void 0 : onRegisterError(e2);
    });
  }
  return updateServiceWorker;
}
function useRegisterSW(options = {}) {
  const {
    immediate = true,
    onNeedRefresh,
    onOfflineReady,
    onRegistered,
    onRegisterError
  } = options;
  const needRefresh = ref(false);
  const offlineReady = ref(false);
  const updateServiceWorker = registerSW({
    immediate,
    onNeedRefresh() {
      needRefresh.value = true;
      onNeedRefresh == null ? void 0 : onNeedRefresh();
    },
    onOfflineReady() {
      offlineReady.value = true;
      onOfflineReady == null ? void 0 : onOfflineReady();
    },
    onRegistered,
    onRegisterError
  });
  return {
    updateServiceWorker,
    offlineReady,
    needRefresh
  };
}
/*!
  * shared v9.2.0-beta.35
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const inBrowser = typeof window !== "undefined";
const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
const makeSymbol = (name) => hasSymbol ? Symbol(name) : name;
const generateFormatCacheKey = (locale, key, source3) => friendlyJSONstringify({ l: locale, k: key, s: source3 });
const friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
const isNumber$1 = (val) => typeof val === "number" && isFinite(val);
const isDate$1 = (val) => toTypeString(val) === "[object Date]";
const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
const isEmptyObject = (val) => isPlainObject$1(val) && Object.keys(val).length === 0;
function warn(msg, err) {
  if (typeof console !== "undefined") {
    console.warn(`[intlify] ` + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}
const assign = Object.assign;
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function escapeHtml(rawText) {
  return rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty$1.call(obj, key);
}
const isArray$1 = Array.isArray;
const isFunction$1 = (val) => typeof val === "function";
const isString$1 = (val) => typeof val === "string";
const isBoolean = (val) => typeof val === "boolean";
const isObject$2 = (val) => val !== null && typeof val === "object";
const objectToString$1 = Object.prototype.toString;
const toTypeString = (value) => objectToString$1.call(value);
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const toDisplayString = (val) => {
  return val == null ? "" : isArray$1(val) || isPlainObject$1(val) && val.toString === objectToString$1 ? JSON.stringify(val, null, 2) : String(val);
};
/*!
  * message-compiler v9.2.0-beta.35
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const CompileErrorCodes = {
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14,
  __EXTEND_POINT__: 15
};
function createCompileError(code2, loc, options = {}) {
  const { domain, messages, args } = options;
  const msg = code2;
  const error = new SyntaxError(String(msg));
  error.code = code2;
  if (loc) {
    error.location = loc;
  }
  error.domain = domain;
  return error;
}
/*!
  * devtools-if v9.2.0-beta.35
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const IntlifyDevToolsHooks = {
  I18nInit: "i18n:init",
  FunctionTranslate: "function:translate"
};
/*!
  * core-base v9.2.0-beta.35
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const pathStateMachine = [];
pathStateMachine[0] = {
  ["w"]: [0],
  ["i"]: [3, 0],
  ["["]: [4],
  ["o"]: [7]
};
pathStateMachine[1] = {
  ["w"]: [1],
  ["."]: [2],
  ["["]: [4],
  ["o"]: [7]
};
pathStateMachine[2] = {
  ["w"]: [2],
  ["i"]: [3, 0],
  ["0"]: [3, 0]
};
pathStateMachine[3] = {
  ["i"]: [3, 0],
  ["0"]: [3, 0],
  ["w"]: [1, 1],
  ["."]: [2, 1],
  ["["]: [4, 1],
  ["o"]: [7, 1]
};
pathStateMachine[4] = {
  ["'"]: [5, 0],
  ['"']: [6, 0],
  ["["]: [
    4,
    2
  ],
  ["]"]: [1, 3],
  ["o"]: 8,
  ["l"]: [4, 0]
};
pathStateMachine[5] = {
  ["'"]: [4, 0],
  ["o"]: 8,
  ["l"]: [5, 0]
};
pathStateMachine[6] = {
  ['"']: [4, 0],
  ["o"]: 8,
  ["l"]: [6, 0]
};
const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral(exp) {
  return literalValueRE.test(exp);
}
function stripQuotes(str) {
  const a2 = str.charCodeAt(0);
  const b = str.charCodeAt(str.length - 1);
  return a2 === b && (a2 === 34 || a2 === 39) ? str.slice(1, -1) : str;
}
function getPathCharType(ch) {
  if (ch === void 0 || ch === null) {
    return "o";
  }
  const code2 = ch.charCodeAt(0);
  switch (code2) {
    case 91:
    case 93:
    case 46:
    case 34:
    case 39:
      return ch;
    case 95:
    case 36:
    case 45:
      return "i";
    case 9:
    case 10:
    case 13:
    case 160:
    case 65279:
    case 8232:
    case 8233:
      return "w";
  }
  return "i";
}
function formatSubPath(path) {
  const trimmed = path.trim();
  if (path.charAt(0) === "0" && isNaN(parseInt(path))) {
    return false;
  }
  return isLiteral(trimmed) ? stripQuotes(trimmed) : "*" + trimmed;
}
function parse(path) {
  const keys = [];
  let index = -1;
  let mode = 0;
  let subPathDepth = 0;
  let c2;
  let key;
  let newChar;
  let type;
  let transition;
  let action;
  let typeMap;
  const actions = [];
  actions[0] = () => {
    if (key === void 0) {
      key = newChar;
    } else {
      key += newChar;
    }
  };
  actions[1] = () => {
    if (key !== void 0) {
      keys.push(key);
      key = void 0;
    }
  };
  actions[2] = () => {
    actions[0]();
    subPathDepth++;
  };
  actions[3] = () => {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = 4;
      actions[0]();
    } else {
      subPathDepth = 0;
      if (key === void 0) {
        return false;
      }
      key = formatSubPath(key);
      if (key === false) {
        return false;
      } else {
        actions[1]();
      }
    }
  };
  function maybeUnescapeQuote() {
    const nextChar = path[index + 1];
    if (mode === 5 && nextChar === "'" || mode === 6 && nextChar === '"') {
      index++;
      newChar = "\\" + nextChar;
      actions[0]();
      return true;
    }
  }
  while (mode !== null) {
    index++;
    c2 = path[index];
    if (c2 === "\\" && maybeUnescapeQuote()) {
      continue;
    }
    type = getPathCharType(c2);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap["l"] || 8;
    if (transition === 8) {
      return;
    }
    mode = transition[0];
    if (transition[1] !== void 0) {
      action = actions[transition[1]];
      if (action) {
        newChar = c2;
        if (action() === false) {
          return;
        }
      }
    }
    if (mode === 7) {
      return keys;
    }
  }
}
const cache$1 = /* @__PURE__ */ new Map();
function resolveWithKeyValue(obj, path) {
  return isObject$2(obj) ? obj[path] : null;
}
function resolveValue(obj, path) {
  if (!isObject$2(obj)) {
    return null;
  }
  let hit = cache$1.get(path);
  if (!hit) {
    hit = parse(path);
    if (hit) {
      cache$1.set(path, hit);
    }
  }
  if (!hit) {
    return null;
  }
  const len = hit.length;
  let last = obj;
  let i2 = 0;
  while (i2 < len) {
    const val = last[hit[i2]];
    if (val === void 0) {
      return null;
    }
    last = val;
    i2++;
  }
  return last;
}
const DEFAULT_MODIFIER = (str) => str;
const DEFAULT_MESSAGE = (ctx) => "";
const DEFAULT_MESSAGE_DATA_TYPE = "text";
const DEFAULT_NORMALIZE = (values) => values.length === 0 ? "" : values.join("");
const DEFAULT_INTERPOLATE = toDisplayString;
function pluralDefault(choice, choicesLength) {
  choice = Math.abs(choice);
  if (choicesLength === 2) {
    return choice ? choice > 1 ? 1 : 0 : 1;
  }
  return choice ? Math.min(choice, 2) : 0;
}
function getPluralIndex(options) {
  const index = isNumber$1(options.pluralIndex) ? options.pluralIndex : -1;
  return options.named && (isNumber$1(options.named.count) || isNumber$1(options.named.n)) ? isNumber$1(options.named.count) ? options.named.count : isNumber$1(options.named.n) ? options.named.n : index : index;
}
function normalizeNamed(pluralIndex, props) {
  if (!props.count) {
    props.count = pluralIndex;
  }
  if (!props.n) {
    props.n = pluralIndex;
  }
}
function createMessageContext(options = {}) {
  const locale = options.locale;
  const pluralIndex = getPluralIndex(options);
  const pluralRule = isObject$2(options.pluralRules) && isString$1(locale) && isFunction$1(options.pluralRules[locale]) ? options.pluralRules[locale] : pluralDefault;
  const orgPluralRule = isObject$2(options.pluralRules) && isString$1(locale) && isFunction$1(options.pluralRules[locale]) ? pluralDefault : void 0;
  const plural = (messages) => messages[pluralRule(pluralIndex, messages.length, orgPluralRule)];
  const _list = options.list || [];
  const list = (index) => _list[index];
  const _named = options.named || {};
  isNumber$1(options.pluralIndex) && normalizeNamed(pluralIndex, _named);
  const named = (key) => _named[key];
  function message(key) {
    const msg = isFunction$1(options.messages) ? options.messages(key) : isObject$2(options.messages) ? options.messages[key] : false;
    return !msg ? options.parent ? options.parent.message(key) : DEFAULT_MESSAGE : msg;
  }
  const _modifier = (name) => options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER;
  const normalize = isPlainObject$1(options.processor) && isFunction$1(options.processor.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
  const interpolate = isPlainObject$1(options.processor) && isFunction$1(options.processor.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
  const linked = (key, modifier) => {
    const msg = message(key)(ctx);
    return isString$1(modifier) ? _modifier(modifier)(msg) : msg;
  };
  const type = isPlainObject$1(options.processor) && isString$1(options.processor.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;
  const ctx = {
    ["list"]: list,
    ["named"]: named,
    ["plural"]: plural,
    ["linked"]: linked,
    ["message"]: message,
    ["type"]: type,
    ["interpolate"]: interpolate,
    ["normalize"]: normalize
  };
  return ctx;
}
let devtools = null;
function setDevToolsHook(hook) {
  devtools = hook;
}
function initI18nDevTools(i18n2, version2, meta) {
  devtools && devtools.emit(IntlifyDevToolsHooks.I18nInit, {
    timestamp: Date.now(),
    i18n: i18n2,
    version: version2,
    meta
  });
}
const translateDevTools = /* @__PURE__ */ createDevToolsHook(IntlifyDevToolsHooks.FunctionTranslate);
function createDevToolsHook(hook) {
  return (payloads) => devtools && devtools.emit(hook, payloads);
}
const CoreWarnCodes = {
  NOT_FOUND_KEY: 1,
  FALLBACK_TO_TRANSLATE: 2,
  CANNOT_FORMAT_NUMBER: 3,
  FALLBACK_TO_NUMBER_FORMAT: 4,
  CANNOT_FORMAT_DATE: 5,
  FALLBACK_TO_DATE_FORMAT: 6,
  __EXTEND_POINT__: 7
};
function fallbackWithSimple(ctx, fallback, start) {
  return [.../* @__PURE__ */ new Set([
    start,
    ...isArray$1(fallback) ? fallback : isObject$2(fallback) ? Object.keys(fallback) : isString$1(fallback) ? [fallback] : [start]
  ])];
}
function fallbackWithLocaleChain(ctx, fallback, start) {
  const startLocale = isString$1(start) ? start : DEFAULT_LOCALE;
  const context = ctx;
  if (!context.__localeChainCache) {
    context.__localeChainCache = /* @__PURE__ */ new Map();
  }
  let chain = context.__localeChainCache.get(startLocale);
  if (!chain) {
    chain = [];
    let block = [start];
    while (isArray$1(block)) {
      block = appendBlockToChain(chain, block, fallback);
    }
    const defaults2 = isArray$1(fallback) || !isPlainObject$1(fallback) ? fallback : fallback["default"] ? fallback["default"] : null;
    block = isString$1(defaults2) ? [defaults2] : defaults2;
    if (isArray$1(block)) {
      appendBlockToChain(chain, block, false);
    }
    context.__localeChainCache.set(startLocale, chain);
  }
  return chain;
}
function appendBlockToChain(chain, block, blocks) {
  let follow = true;
  for (let i2 = 0; i2 < block.length && isBoolean(follow); i2++) {
    const locale = block[i2];
    if (isString$1(locale)) {
      follow = appendLocaleToChain(chain, block[i2], blocks);
    }
  }
  return follow;
}
function appendLocaleToChain(chain, locale, blocks) {
  let follow;
  const tokens = locale.split("-");
  do {
    const target = tokens.join("-");
    follow = appendItemToChain(chain, target, blocks);
    tokens.splice(-1, 1);
  } while (tokens.length && follow === true);
  return follow;
}
function appendItemToChain(chain, target, blocks) {
  let follow = false;
  if (!chain.includes(target)) {
    follow = true;
    if (target) {
      follow = target[target.length - 1] !== "!";
      const locale = target.replace(/!/g, "");
      chain.push(locale);
      if ((isArray$1(blocks) || isPlainObject$1(blocks)) && blocks[locale]) {
        follow = blocks[locale];
      }
    }
  }
  return follow;
}
const VERSION$2 = "9.2.0-beta.35";
const NOT_REOSLVED = -1;
const DEFAULT_LOCALE = "en-US";
const MISSING_RESOLVE_VALUE = "";
function getDefaultLinkedModifiers() {
  return {
    upper: (val) => isString$1(val) ? val.toUpperCase() : val,
    lower: (val) => isString$1(val) ? val.toLowerCase() : val,
    capitalize: (val) => isString$1(val) ? `${val.charAt(0).toLocaleUpperCase()}${val.substr(1)}` : val
  };
}
let _compiler;
let _resolver;
function registerMessageResolver(resolver) {
  _resolver = resolver;
}
let _fallbacker;
function registerLocaleFallbacker(fallbacker) {
  _fallbacker = fallbacker;
}
let _additionalMeta = null;
const setAdditionalMeta = (meta) => {
  _additionalMeta = meta;
};
const getAdditionalMeta = () => _additionalMeta;
let _fallbackContext = null;
const setFallbackContext = (context) => {
  _fallbackContext = context;
};
const getFallbackContext = () => _fallbackContext;
let _cid = 0;
function createCoreContext(options = {}) {
  const version2 = isString$1(options.version) ? options.version : VERSION$2;
  const locale = isString$1(options.locale) ? options.locale : DEFAULT_LOCALE;
  const fallbackLocale = isArray$1(options.fallbackLocale) || isPlainObject$1(options.fallbackLocale) || isString$1(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : locale;
  const messages = isPlainObject$1(options.messages) ? options.messages : { [locale]: {} };
  const datetimeFormats = isPlainObject$1(options.datetimeFormats) ? options.datetimeFormats : { [locale]: {} };
  const numberFormats = isPlainObject$1(options.numberFormats) ? options.numberFormats : { [locale]: {} };
  const modifiers = assign({}, options.modifiers || {}, getDefaultLinkedModifiers());
  const pluralRules = options.pluralRules || {};
  const missing = isFunction$1(options.missing) ? options.missing : null;
  const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const fallbackFormat = !!options.fallbackFormat;
  const unresolving = !!options.unresolving;
  const postTranslation = isFunction$1(options.postTranslation) ? options.postTranslation : null;
  const processor = isPlainObject$1(options.processor) ? options.processor : null;
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const escapeParameter = !!options.escapeParameter;
  const messageCompiler = isFunction$1(options.messageCompiler) ? options.messageCompiler : _compiler;
  const messageResolver = isFunction$1(options.messageResolver) ? options.messageResolver : _resolver || resolveWithKeyValue;
  const localeFallbacker = isFunction$1(options.localeFallbacker) ? options.localeFallbacker : _fallbacker || fallbackWithSimple;
  const fallbackContext = isObject$2(options.fallbackContext) ? options.fallbackContext : void 0;
  const onWarn = isFunction$1(options.onWarn) ? options.onWarn : warn;
  const internalOptions = options;
  const __datetimeFormatters = isObject$2(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : /* @__PURE__ */ new Map();
  const __numberFormatters = isObject$2(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : /* @__PURE__ */ new Map();
  const __meta = isObject$2(internalOptions.__meta) ? internalOptions.__meta : {};
  _cid++;
  const context = {
    version: version2,
    cid: _cid,
    locale,
    fallbackLocale,
    messages,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation,
    processor,
    warnHtmlMessage,
    escapeParameter,
    messageCompiler,
    messageResolver,
    localeFallbacker,
    fallbackContext,
    onWarn,
    __meta
  };
  {
    context.datetimeFormats = datetimeFormats;
    context.numberFormats = numberFormats;
    context.__datetimeFormatters = __datetimeFormatters;
    context.__numberFormatters = __numberFormatters;
  }
  if (__INTLIFY_PROD_DEVTOOLS__) {
    initI18nDevTools(context, version2, __meta);
  }
  return context;
}
function handleMissing(context, key, locale, missingWarn, type) {
  const { missing, onWarn } = context;
  if (missing !== null) {
    const ret = missing(context, locale, key, type);
    return isString$1(ret) ? ret : key;
  } else {
    return key;
  }
}
function updateFallbackLocale(ctx, locale, fallback) {
  const context = ctx;
  context.__localeChainCache = /* @__PURE__ */ new Map();
  ctx.localeFallbacker(ctx, fallback, locale);
}
let code$1 = CompileErrorCodes.__EXTEND_POINT__;
const inc$1 = () => ++code$1;
const CoreErrorCodes = {
  INVALID_ARGUMENT: code$1,
  INVALID_DATE_ARGUMENT: inc$1(),
  INVALID_ISO_DATE_ARGUMENT: inc$1(),
  __EXTEND_POINT__: inc$1()
};
function createCoreError(code2) {
  return createCompileError(code2, null, void 0);
}
const NOOP_MESSAGE_FUNCTION = () => "";
const isMessageFunction = (val) => isFunction$1(val);
function translate(context, ...args) {
  const { fallbackFormat, postTranslation, unresolving, messageCompiler, fallbackLocale, messages } = context;
  const [key, options] = parseTranslateArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const escapeParameter = isBoolean(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
  const resolvedMessage = !!options.resolvedMessage;
  const defaultMsgOrKey = isString$1(options.default) || isBoolean(options.default) ? !isBoolean(options.default) ? options.default : !messageCompiler ? () => key : key : fallbackFormat ? !messageCompiler ? () => key : key : "";
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey !== "";
  const locale = isString$1(options.locale) ? options.locale : context.locale;
  escapeParameter && escapeParams(options);
  let [formatScope, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [
    key,
    locale,
    messages[locale] || {}
  ];
  let format2 = formatScope;
  let cacheBaseKey = key;
  if (!resolvedMessage && !(isString$1(format2) || isMessageFunction(format2))) {
    if (enableDefaultMsg) {
      format2 = defaultMsgOrKey;
      cacheBaseKey = format2;
    }
  }
  if (!resolvedMessage && (!(isString$1(format2) || isMessageFunction(format2)) || !isString$1(targetLocale))) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let occurred = false;
  const errorDetector = () => {
    occurred = true;
  };
  const msg = !isMessageFunction(format2) ? compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, errorDetector) : format2;
  if (occurred) {
    return format2;
  }
  const ctxOptions = getMessageContextOptions(context, targetLocale, message, options);
  const msgContext = createMessageContext(ctxOptions);
  const messaged = evaluateMessage(context, msg, msgContext);
  const ret = postTranslation ? postTranslation(messaged) : messaged;
  if (__INTLIFY_PROD_DEVTOOLS__) {
    const payloads = {
      timestamp: Date.now(),
      key: isString$1(key) ? key : isMessageFunction(format2) ? format2.key : "",
      locale: targetLocale || (isMessageFunction(format2) ? format2.locale : ""),
      format: isString$1(format2) ? format2 : isMessageFunction(format2) ? format2.source : "",
      message: ret
    };
    payloads.meta = assign({}, context.__meta, getAdditionalMeta() || {});
    translateDevTools(payloads);
  }
  return ret;
}
function escapeParams(options) {
  if (isArray$1(options.list)) {
    options.list = options.list.map((item) => isString$1(item) ? escapeHtml(item) : item);
  } else if (isObject$2(options.named)) {
    Object.keys(options.named).forEach((key) => {
      if (isString$1(options.named[key])) {
        options.named[key] = escapeHtml(options.named[key]);
      }
    });
  }
}
function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
  const { messages, onWarn, messageResolver: resolveValue2, localeFallbacker } = context;
  const locales = localeFallbacker(context, fallbackLocale, locale);
  let message = {};
  let targetLocale;
  let format2 = null;
  const type = "translate";
  for (let i2 = 0; i2 < locales.length; i2++) {
    targetLocale = locales[i2];
    message = messages[targetLocale] || {};
    if ((format2 = resolveValue2(message, key)) === null) {
      format2 = message[key];
    }
    if (isString$1(format2) || isFunction$1(format2))
      break;
    const missingRet = handleMissing(context, key, targetLocale, missingWarn, type);
    if (missingRet !== key) {
      format2 = missingRet;
    }
  }
  return [format2, targetLocale, message];
}
function compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, errorDetector) {
  const { messageCompiler, warnHtmlMessage } = context;
  if (isMessageFunction(format2)) {
    const msg2 = format2;
    msg2.locale = msg2.locale || targetLocale;
    msg2.key = msg2.key || key;
    return msg2;
  }
  if (messageCompiler == null) {
    const msg2 = () => format2;
    msg2.locale = targetLocale;
    msg2.key = key;
    return msg2;
  }
  const msg = messageCompiler(format2, getCompileOptions(context, targetLocale, cacheBaseKey, format2, warnHtmlMessage, errorDetector));
  msg.locale = targetLocale;
  msg.key = key;
  msg.source = format2;
  return msg;
}
function evaluateMessage(context, msg, msgCtx) {
  const messaged = msg(msgCtx);
  return messaged;
}
function parseTranslateArgs(...args) {
  const [arg1, arg2, arg3] = args;
  const options = {};
  if (!isString$1(arg1) && !isNumber$1(arg1) && !isMessageFunction(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const key = isNumber$1(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;
  if (isNumber$1(arg2)) {
    options.plural = arg2;
  } else if (isString$1(arg2)) {
    options.default = arg2;
  } else if (isPlainObject$1(arg2) && !isEmptyObject(arg2)) {
    options.named = arg2;
  } else if (isArray$1(arg2)) {
    options.list = arg2;
  }
  if (isNumber$1(arg3)) {
    options.plural = arg3;
  } else if (isString$1(arg3)) {
    options.default = arg3;
  } else if (isPlainObject$1(arg3)) {
    assign(options, arg3);
  }
  return [key, options];
}
function getCompileOptions(context, locale, key, source3, warnHtmlMessage, errorDetector) {
  return {
    warnHtmlMessage,
    onError: (err) => {
      errorDetector && errorDetector(err);
      {
        throw err;
      }
    },
    onCacheKey: (source4) => generateFormatCacheKey(locale, key, source4)
  };
}
function getMessageContextOptions(context, locale, message, options) {
  const { modifiers, pluralRules, messageResolver: resolveValue2, fallbackLocale, fallbackWarn, missingWarn, fallbackContext } = context;
  const resolveMessage = (key) => {
    let val = resolveValue2(message, key);
    if (val == null && fallbackContext) {
      const [, , message2] = resolveMessageFormat(fallbackContext, key, locale, fallbackLocale, fallbackWarn, missingWarn);
      val = resolveValue2(message2, key);
    }
    if (isString$1(val)) {
      let occurred = false;
      const errorDetector = () => {
        occurred = true;
      };
      const msg = compileMessageFormat(context, key, locale, val, key, errorDetector);
      return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
    } else if (isMessageFunction(val)) {
      return val;
    } else {
      return NOOP_MESSAGE_FUNCTION;
    }
  };
  const ctxOptions = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  };
  if (context.processor) {
    ctxOptions.processor = context.processor;
  }
  if (options.list) {
    ctxOptions.list = options.list;
  }
  if (options.named) {
    ctxOptions.named = options.named;
  }
  if (isNumber$1(options.plural)) {
    ctxOptions.pluralIndex = options.plural;
  }
  return ctxOptions;
}
function datetime(context, ...args) {
  const { datetimeFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __datetimeFormatters } = context;
  const [key, value, options, overrides] = parseDateTimeArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = isString$1(options.locale) ? options.locale : context.locale;
  const locales = localeFallbacker(context, fallbackLocale, locale);
  if (!isString$1(key) || key === "") {
    return new Intl.DateTimeFormat(locale).format(value);
  }
  let datetimeFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "datetime format";
  for (let i2 = 0; i2 < locales.length; i2++) {
    targetLocale = locales[i2];
    datetimeFormat = datetimeFormats[targetLocale] || {};
    format2 = datetimeFormat[key];
    if (isPlainObject$1(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject$1(format2) || !isString$1(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __datetimeFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(targetLocale, assign({}, format2, overrides));
    __datetimeFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
function parseDateTimeArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  let options = {};
  let overrides = {};
  let value;
  if (isString$1(arg1)) {
    const matches2 = arg1.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
    if (!matches2) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
    const dateTime = matches2[3] ? matches2[3].trim().startsWith("T") ? `${matches2[1].trim()}${matches2[3].trim()}` : `${matches2[1].trim()}T${matches2[3].trim()}` : matches2[1].trim();
    value = new Date(dateTime);
    try {
      value.toISOString();
    } catch (e2) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (isDate$1(arg1)) {
    if (isNaN(arg1.getTime())) {
      throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT);
    }
    value = arg1;
  } else if (isNumber$1(arg1)) {
    value = arg1;
  } else {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  if (isString$1(arg2)) {
    options.key = arg2;
  } else if (isPlainObject$1(arg2)) {
    options = arg2;
  }
  if (isString$1(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject$1(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject$1(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearDateTimeFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__datetimeFormatters.has(id)) {
      continue;
    }
    context.__datetimeFormatters.delete(id);
  }
}
function number(context, ...args) {
  const { numberFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __numberFormatters } = context;
  const [key, value, options, overrides] = parseNumberArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = isString$1(options.locale) ? options.locale : context.locale;
  const locales = localeFallbacker(context, fallbackLocale, locale);
  if (!isString$1(key) || key === "") {
    return new Intl.NumberFormat(locale).format(value);
  }
  let numberFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "number format";
  for (let i2 = 0; i2 < locales.length; i2++) {
    targetLocale = locales[i2];
    numberFormat = numberFormats[targetLocale] || {};
    format2 = numberFormat[key];
    if (isPlainObject$1(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject$1(format2) || !isString$1(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __numberFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.NumberFormat(targetLocale, assign({}, format2, overrides));
    __numberFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
function parseNumberArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  let options = {};
  let overrides = {};
  if (!isNumber$1(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const value = arg1;
  if (isString$1(arg2)) {
    options.key = arg2;
  } else if (isPlainObject$1(arg2)) {
    options = arg2;
  }
  if (isString$1(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject$1(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject$1(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearNumberFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__numberFormatters.has(id)) {
      continue;
    }
    context.__numberFormatters.delete(id);
  }
}
{
  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }
}
/*!
  * vue-i18n v9.2.0-beta.35
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const VERSION$1 = "9.2.0-beta.35";
function initFeatureFlags() {
  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }
}
CoreWarnCodes.__EXTEND_POINT__;
let code = CompileErrorCodes.__EXTEND_POINT__;
const inc = () => ++code;
const I18nErrorCodes = {
  UNEXPECTED_RETURN_TYPE: code,
  INVALID_ARGUMENT: inc(),
  MUST_BE_CALL_SETUP_TOP: inc(),
  NOT_INSLALLED: inc(),
  NOT_AVAILABLE_IN_LEGACY_MODE: inc(),
  REQUIRED_VALUE: inc(),
  INVALID_VALUE: inc(),
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: inc(),
  NOT_INSLALLED_WITH_PROVIDE: inc(),
  UNEXPECTED_ERROR: inc(),
  NOT_COMPATIBLE_LEGACY_VUE_I18N: inc(),
  BRIDGE_SUPPORT_VUE_2_ONLY: inc(),
  MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION: inc(),
  NOT_AVAILABLE_COMPOSITION_IN_LEGACY: inc(),
  __EXTEND_POINT__: inc()
};
function createI18nError(code2, ...args) {
  return createCompileError(code2, null, void 0);
}
const TransrateVNodeSymbol = /* @__PURE__ */ makeSymbol("__transrateVNode");
const DatetimePartsSymbol = /* @__PURE__ */ makeSymbol("__datetimeParts");
const NumberPartsSymbol = /* @__PURE__ */ makeSymbol("__numberParts");
const SetPluralRulesSymbol = makeSymbol("__setPluralRules");
makeSymbol("__intlifyMeta");
const InejctWithOption = /* @__PURE__ */ makeSymbol("__injectWithOption");
function handleFlatJson(obj) {
  if (!isObject$2(obj)) {
    return obj;
  }
  for (const key in obj) {
    if (!hasOwn(obj, key)) {
      continue;
    }
    if (!key.includes(".")) {
      if (isObject$2(obj[key])) {
        handleFlatJson(obj[key]);
      }
    } else {
      const subKeys = key.split(".");
      const lastIndex = subKeys.length - 1;
      let currentObj = obj;
      for (let i2 = 0; i2 < lastIndex; i2++) {
        if (!(subKeys[i2] in currentObj)) {
          currentObj[subKeys[i2]] = {};
        }
        currentObj = currentObj[subKeys[i2]];
      }
      currentObj[subKeys[lastIndex]] = obj[key];
      delete obj[key];
      if (isObject$2(currentObj[subKeys[lastIndex]])) {
        handleFlatJson(currentObj[subKeys[lastIndex]]);
      }
    }
  }
  return obj;
}
function getLocaleMessages(locale, options) {
  const { messages, __i18n, messageResolver, flatJson } = options;
  const ret = isPlainObject$1(messages) ? messages : isArray$1(__i18n) ? {} : { [locale]: {} };
  if (isArray$1(__i18n)) {
    __i18n.forEach((custom) => {
      if ("locale" in custom && "resource" in custom) {
        const { locale: locale2, resource } = custom;
        if (locale2) {
          ret[locale2] = ret[locale2] || {};
          deepCopy(resource, ret[locale2]);
        } else {
          deepCopy(resource, ret);
        }
      } else {
        isString$1(custom) && deepCopy(JSON.parse(custom), ret);
      }
    });
  }
  if (messageResolver == null && flatJson) {
    for (const key in ret) {
      if (hasOwn(ret, key)) {
        handleFlatJson(ret[key]);
      }
    }
  }
  return ret;
}
const isNotObjectOrIsArray = (val) => !isObject$2(val) || isArray$1(val);
function deepCopy(src, des) {
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
  for (const key in src) {
    if (hasOwn(src, key)) {
      if (isNotObjectOrIsArray(src[key]) || isNotObjectOrIsArray(des[key])) {
        des[key] = src[key];
      } else {
        deepCopy(src[key], des[key]);
      }
    }
  }
}
function getComponentOptions(instance) {
  return instance.type;
}
function adjustI18nResources(global2, options, componentOptions) {
  let messages = isObject$2(options.messages) ? options.messages : {};
  if ("__i18nGlobal" in componentOptions) {
    messages = getLocaleMessages(global2.locale.value, {
      messages,
      __i18n: componentOptions.__i18nGlobal
    });
  }
  const locales = Object.keys(messages);
  if (locales.length) {
    locales.forEach((locale) => {
      global2.mergeLocaleMessage(locale, messages[locale]);
    });
  }
  {
    if (isObject$2(options.datetimeFormats)) {
      const locales2 = Object.keys(options.datetimeFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          global2.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
        });
      }
    }
    if (isObject$2(options.numberFormats)) {
      const locales2 = Object.keys(options.numberFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          global2.mergeNumberFormat(locale, options.numberFormats[locale]);
        });
      }
    }
  }
}
function createTextNode(key) {
  return createVNode(Text$1, null, key, 0);
}
const DEVTOOLS_META = "__INTLIFY_META__";
let composerID = 0;
function defineCoreMissingHandler(missing) {
  return (ctx, locale, key, type) => {
    return missing(locale, key, getCurrentInstance() || void 0, type);
  };
}
const getMetaInfo = () => {
  const instance = getCurrentInstance();
  let meta = null;
  return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META]) ? { [DEVTOOLS_META]: meta } : null;
};
function createComposer(options = {}, VueI18nLegacy) {
  const { __root } = options;
  const _isGlobal = __root === void 0;
  let _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;
  const _locale = ref(__root && _inheritLocale ? __root.locale.value : isString$1(options.locale) ? options.locale : DEFAULT_LOCALE);
  const _fallbackLocale = ref(__root && _inheritLocale ? __root.fallbackLocale.value : isString$1(options.fallbackLocale) || isArray$1(options.fallbackLocale) || isPlainObject$1(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value);
  const _messages = ref(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = ref(isPlainObject$1(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = ref(isPlainObject$1(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  let _missingWarn = __root ? __root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  let _fallbackWarn = __root ? __root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  let _fallbackRoot = __root ? __root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  let _fallbackFormat = !!options.fallbackFormat;
  let _missing = isFunction$1(options.missing) ? options.missing : null;
  let _runtimeMissing = isFunction$1(options.missing) ? defineCoreMissingHandler(options.missing) : null;
  let _postTranslation = isFunction$1(options.postTranslation) ? options.postTranslation : null;
  let _warnHtmlMessage = __root ? __root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  let _escapeParameter = !!options.escapeParameter;
  const _modifiers = __root ? __root.modifiers : isPlainObject$1(options.modifiers) ? options.modifiers : {};
  let _pluralRules = options.pluralRules || __root && __root.pluralRules;
  let _context;
  function getCoreContext() {
    _isGlobal && setFallbackContext(null);
    const ctxOptions = {
      version: VERSION$1,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? void 0 : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? void 0 : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      messageResolver: options.messageResolver,
      __meta: { framework: "vue" }
    };
    {
      ctxOptions.datetimeFormats = _datetimeFormats.value;
      ctxOptions.numberFormats = _numberFormats.value;
      ctxOptions.__datetimeFormatters = isPlainObject$1(_context) ? _context.__datetimeFormatters : void 0;
      ctxOptions.__numberFormatters = isPlainObject$1(_context) ? _context.__numberFormatters : void 0;
    }
    const ctx = createCoreContext(ctxOptions);
    _isGlobal && setFallbackContext(ctx);
    return ctx;
  }
  _context = getCoreContext();
  updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed({
    get: () => _locale.value,
    set: (val) => {
      _locale.value = val;
      _context.locale = _locale.value;
    }
  });
  const fallbackLocale = computed({
    get: () => _fallbackLocale.value,
    set: (val) => {
      _fallbackLocale.value = val;
      _context.fallbackLocale = _fallbackLocale.value;
      updateFallbackLocale(_context, _locale.value, val);
    }
  });
  const messages = computed(() => _messages.value);
  const datetimeFormats = /* @__PURE__ */ computed(() => _datetimeFormats.value);
  const numberFormats = /* @__PURE__ */ computed(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return isFunction$1(_postTranslation) ? _postTranslation : null;
  }
  function setPostTranslationHandler(handler) {
    _postTranslation = handler;
    _context.postTranslation = handler;
  }
  function getMissingHandler() {
    return _missing;
  }
  function setMissingHandler(handler) {
    if (handler !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler);
    }
    _missing = handler;
    _context.missing = _runtimeMissing;
  }
  function wrapWithDeps(fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) {
    trackReactivityValues();
    let ret;
    if (__INTLIFY_PROD_DEVTOOLS__) {
      try {
        setAdditionalMeta(getMetaInfo());
        if (!_isGlobal) {
          _context.fallbackContext = __root ? getFallbackContext() : void 0;
        }
        ret = fn(_context);
      } finally {
        setAdditionalMeta(null);
        if (!_isGlobal) {
          _context.fallbackContext = void 0;
        }
      }
    } else {
      ret = fn(_context);
    }
    if (isNumber$1(ret) && ret === NOT_REOSLVED) {
      const [key, arg2] = argumentParser();
      return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
    } else if (successCondition(ret)) {
      return ret;
    } else {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE);
    }
  }
  function t2(...args) {
    return wrapWithDeps((context) => Reflect.apply(translate, null, [context, ...args]), () => parseTranslateArgs(...args), "translate", (root2) => Reflect.apply(root2.t, root2, [...args]), (key) => key, (val) => isString$1(val));
  }
  function rt(...args) {
    const [arg1, arg2, arg3] = args;
    if (arg3 && !isObject$2(arg3)) {
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
    }
    return t2(...[arg1, arg2, assign({ resolvedMessage: true }, arg3 || {})]);
  }
  function d(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root2) => Reflect.apply(root2.d, root2, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString$1(val));
  }
  function n2(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root2) => Reflect.apply(root2.n, root2, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString$1(val));
  }
  function normalize(values) {
    return values.map((val) => isString$1(val) ? createTextNode(val) : val);
  }
  const interpolate = (val) => val;
  const processor = {
    normalize,
    interpolate,
    type: "vnode"
  };
  function transrateVNode(...args) {
    return wrapWithDeps((context) => {
      let ret;
      const _context2 = context;
      try {
        _context2.processor = processor;
        ret = Reflect.apply(translate, null, [_context2, ...args]);
      } finally {
        _context2.processor = null;
      }
      return ret;
    }, () => parseTranslateArgs(...args), "translate", (root2) => root2[TransrateVNodeSymbol](...args), (key) => [createTextNode(key)], (val) => isArray$1(val));
  }
  function numberParts(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root2) => root2[NumberPartsSymbol](...args), () => [], (val) => isString$1(val) || isArray$1(val));
  }
  function datetimeParts(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root2) => root2[DatetimePartsSymbol](...args), () => [], (val) => isString$1(val) || isArray$1(val));
  }
  function setPluralRules(rules) {
    _pluralRules = rules;
    _context.pluralRules = _pluralRules;
  }
  function te(key, locale2) {
    const targetLocale = isString$1(locale2) ? locale2 : _locale.value;
    const message = getLocaleMessage(targetLocale);
    return _context.messageResolver(message, key) !== null;
  }
  function resolveMessages(key) {
    let messages2 = null;
    const locales = fallbackWithLocaleChain(_context, _fallbackLocale.value, _locale.value);
    for (let i2 = 0; i2 < locales.length; i2++) {
      const targetLocaleMessages = _messages.value[locales[i2]] || {};
      const messageValue = _context.messageResolver(targetLocaleMessages, key);
      if (messageValue != null) {
        messages2 = messageValue;
        break;
      }
    }
    return messages2;
  }
  function tm(key) {
    const messages2 = resolveMessages(key);
    return messages2 != null ? messages2 : __root ? __root.tm(key) || {} : {};
  }
  function getLocaleMessage(locale2) {
    return _messages.value[locale2] || {};
  }
  function setLocaleMessage(locale2, message) {
    _messages.value[locale2] = message;
    _context.messages = _messages.value;
  }
  function mergeLocaleMessage(locale2, message) {
    _messages.value[locale2] = _messages.value[locale2] || {};
    deepCopy(message, _messages.value[locale2]);
    _context.messages = _messages.value;
  }
  function getDateTimeFormat(locale2) {
    return _datetimeFormats.value[locale2] || {};
  }
  function setDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = format2;
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function mergeDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = assign(_datetimeFormats.value[locale2] || {}, format2);
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function getNumberFormat(locale2) {
    return _numberFormats.value[locale2] || {};
  }
  function setNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = format2;
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  function mergeNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = assign(_numberFormats.value[locale2] || {}, format2);
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  composerID++;
  if (__root && inBrowser) {
    watch(__root.locale, (val) => {
      if (_inheritLocale) {
        _locale.value = val;
        _context.locale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
    watch(__root.fallbackLocale, (val) => {
      if (_inheritLocale) {
        _fallbackLocale.value = val;
        _context.fallbackLocale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
  }
  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale() {
      return _inheritLocale;
    },
    set inheritLocale(val) {
      _inheritLocale = val;
      if (val && __root) {
        _locale.value = __root.locale.value;
        _fallbackLocale.value = __root.fallbackLocale.value;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    },
    get availableLocales() {
      return Object.keys(_messages.value).sort();
    },
    messages,
    get modifiers() {
      return _modifiers;
    },
    get pluralRules() {
      return _pluralRules || {};
    },
    get isGlobal() {
      return _isGlobal;
    },
    get missingWarn() {
      return _missingWarn;
    },
    set missingWarn(val) {
      _missingWarn = val;
      _context.missingWarn = _missingWarn;
    },
    get fallbackWarn() {
      return _fallbackWarn;
    },
    set fallbackWarn(val) {
      _fallbackWarn = val;
      _context.fallbackWarn = _fallbackWarn;
    },
    get fallbackRoot() {
      return _fallbackRoot;
    },
    set fallbackRoot(val) {
      _fallbackRoot = val;
    },
    get fallbackFormat() {
      return _fallbackFormat;
    },
    set fallbackFormat(val) {
      _fallbackFormat = val;
      _context.fallbackFormat = _fallbackFormat;
    },
    get warnHtmlMessage() {
      return _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      _warnHtmlMessage = val;
      _context.warnHtmlMessage = val;
    },
    get escapeParameter() {
      return _escapeParameter;
    },
    set escapeParameter(val) {
      _escapeParameter = val;
      _context.escapeParameter = val;
    },
    t: t2,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [SetPluralRulesSymbol]: setPluralRules
  };
  {
    composer.datetimeFormats = datetimeFormats;
    composer.numberFormats = numberFormats;
    composer.rt = rt;
    composer.te = te;
    composer.tm = tm;
    composer.d = d;
    composer.n = n2;
    composer.getDateTimeFormat = getDateTimeFormat;
    composer.setDateTimeFormat = setDateTimeFormat;
    composer.mergeDateTimeFormat = mergeDateTimeFormat;
    composer.getNumberFormat = getNumberFormat;
    composer.setNumberFormat = setNumberFormat;
    composer.mergeNumberFormat = mergeNumberFormat;
    composer[InejctWithOption] = options.__injectWithOption;
    composer[TransrateVNodeSymbol] = transrateVNode;
    composer[DatetimePartsSymbol] = datetimeParts;
    composer[NumberPartsSymbol] = numberParts;
  }
  return composer;
}
const baseFormatProps = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    validator: (val) => val === "parent" || val === "global",
    default: "parent"
  },
  i18n: {
    type: Object
  }
};
function getInterpolateArg({ slots }, keys) {
  if (keys.length === 1 && keys[0] === "default") {
    const ret = slots.default ? slots.default() : [];
    return ret.reduce((slot, current) => {
      return slot = [
        ...slot,
        ...isArray$1(current.children) ? current.children : [current]
      ];
    }, []);
  } else {
    return keys.reduce((arg, key) => {
      const slot = slots[key];
      if (slot) {
        arg[key] = slot();
      }
      return arg;
    }, {});
  }
}
function getFragmentableTag(tag) {
  return Fragment;
}
const Translation = {
  name: "i18n-t",
  props: assign({
    keypath: {
      type: String,
      required: true
    },
    plural: {
      type: [Number, String],
      validator: (val) => isNumber$1(val) || !isNaN(val)
    }
  }, baseFormatProps),
  setup(props, context) {
    const { slots, attrs } = context;
    const i18n2 = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    const keys = Object.keys(slots).filter((key) => key !== "_");
    return () => {
      const options = {};
      if (props.locale) {
        options.locale = props.locale;
      }
      if (props.plural !== void 0) {
        options.plural = isString$1(props.plural) ? +props.plural : props.plural;
      }
      const arg = getInterpolateArg(context, keys);
      const children = i18n2[TransrateVNodeSymbol](props.keypath, arg, options);
      const assignedAttrs = assign({}, attrs);
      const tag = isString$1(props.tag) || isObject$2(props.tag) ? props.tag : getFragmentableTag();
      return h(tag, assignedAttrs, children);
    };
  }
};
function isVNode(target) {
  return isArray$1(target) && !isString$1(target[0]);
}
function renderFormatter(props, context, slotKeys, partFormatter) {
  const { slots, attrs } = context;
  return () => {
    const options = { part: true };
    let overrides = {};
    if (props.locale) {
      options.locale = props.locale;
    }
    if (isString$1(props.format)) {
      options.key = props.format;
    } else if (isObject$2(props.format)) {
      if (isString$1(props.format.key)) {
        options.key = props.format.key;
      }
      overrides = Object.keys(props.format).reduce((options2, prop) => {
        return slotKeys.includes(prop) ? assign({}, options2, { [prop]: props.format[prop] }) : options2;
      }, {});
    }
    const parts = partFormatter(...[props.value, options, overrides]);
    let children = [options.key];
    if (isArray$1(parts)) {
      children = parts.map((part, index) => {
        const slot = slots[part.type];
        const node = slot ? slot({ [part.type]: part.value, index, parts }) : [part.value];
        if (isVNode(node)) {
          node[0].key = `${part.type}-${index}`;
        }
        return node;
      });
    } else if (isString$1(parts)) {
      children = [parts];
    }
    const assignedAttrs = assign({}, attrs);
    const tag = isString$1(props.tag) || isObject$2(props.tag) ? props.tag : getFragmentableTag();
    return h(tag, assignedAttrs, children);
  };
}
const NUMBER_FORMAT_KEYS = [
  "localeMatcher",
  "style",
  "unit",
  "unitDisplay",
  "currency",
  "currencyDisplay",
  "useGrouping",
  "numberingSystem",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "notation",
  "formatMatcher"
];
const NumberFormat = {
  name: "i18n-n",
  props: assign({
    value: {
      type: Number,
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  setup(props, context) {
    const i18n2 = props.i18n || useI18n({ useScope: "parent", __useComponent: true });
    return renderFormatter(props, context, NUMBER_FORMAT_KEYS, (...args) => i18n2[NumberPartsSymbol](...args));
  }
};
const DATETIME_FORMAT_KEYS = [
  "dateStyle",
  "timeStyle",
  "fractionalSecondDigits",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "localeMatcher",
  "timeZone",
  "hour12",
  "hourCycle",
  "formatMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName"
];
const DatetimeFormat = {
  name: "i18n-d",
  props: assign({
    value: {
      type: [Number, Date],
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  setup(props, context) {
    const i18n2 = props.i18n || useI18n({ useScope: "parent", __useComponent: true });
    return renderFormatter(props, context, DATETIME_FORMAT_KEYS, (...args) => i18n2[DatetimePartsSymbol](...args));
  }
};
function getComposer$2(i18n2, instance) {
  const i18nInternal = i18n2;
  if (i18n2.mode === "composition") {
    return i18nInternal.__getInstance(instance) || i18n2.global;
  } else {
    const vueI18n = i18nInternal.__getInstance(instance);
    return vueI18n != null ? vueI18n.__composer : i18n2.global.__composer;
  }
}
function vTDirective(i18n2) {
  const bind3 = (el, { instance, value, modifiers }) => {
    if (!instance || !instance.$) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const composer = getComposer$2(i18n2, instance.$);
    const parsedValue = parseValue(value);
    el.textContent = Reflect.apply(composer.t, composer, [
      ...makeParams(parsedValue)
    ]);
  };
  return {
    beforeMount: bind3,
    beforeUpdate: bind3
  };
}
function parseValue(value) {
  if (isString$1(value)) {
    return { path: value };
  } else if (isPlainObject$1(value)) {
    if (!("path" in value)) {
      throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, "path");
    }
    return value;
  } else {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
}
function makeParams(value) {
  const { path, locale, args, choice, plural } = value;
  const options = {};
  const named = args || {};
  if (isString$1(locale)) {
    options.locale = locale;
  }
  if (isNumber$1(choice)) {
    options.plural = choice;
  }
  if (isNumber$1(plural)) {
    options.plural = plural;
  }
  return [path, named, options];
}
function apply(app, i18n2, ...options) {
  const pluginOptions = isPlainObject$1(options[0]) ? options[0] : {};
  const useI18nComponentName = !!pluginOptions.useI18nComponentName;
  const globalInstall = isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true;
  if (globalInstall) {
    app.component(!useI18nComponentName ? Translation.name : "i18n", Translation);
    app.component(NumberFormat.name, NumberFormat);
    app.component(DatetimeFormat.name, DatetimeFormat);
  }
  {
    app.directive("t", vTDirective(i18n2));
  }
}
const I18nInjectionKey = /* @__PURE__ */ makeSymbol("global-vue-i18n");
function createI18n(options = {}, VueI18nLegacy) {
  const __globalInjection = isBoolean(options.globalInjection) ? options.globalInjection : true;
  const __allowComposition = true;
  const __instances = /* @__PURE__ */ new Map();
  const [globalScope, __global] = createGlobal(options);
  const symbol = makeSymbol("");
  function __getInstance(component) {
    return __instances.get(component) || null;
  }
  function __setInstance(component, instance) {
    __instances.set(component, instance);
  }
  function __deleteInstance(component) {
    __instances.delete(component);
  }
  {
    const i18n2 = {
      get mode() {
        return "composition";
      },
      get allowComposition() {
        return __allowComposition;
      },
      async install(app, ...options2) {
        app.__VUE_I18N_SYMBOL__ = symbol;
        app.provide(app.__VUE_I18N_SYMBOL__, i18n2);
        if (__globalInjection) {
          injectGlobalFields(app, i18n2.global);
        }
        {
          apply(app, i18n2, ...options2);
        }
        const unmountApp = app.unmount;
        app.unmount = () => {
          i18n2.dispose();
          unmountApp();
        };
      },
      get global() {
        return __global;
      },
      dispose() {
        globalScope.stop();
      },
      __instances,
      __getInstance,
      __setInstance,
      __deleteInstance
    };
    return i18n2;
  }
}
function useI18n(options = {}) {
  const instance = getCurrentInstance();
  if (instance == null) {
    throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP);
  }
  if (!instance.isCE && instance.appContext.app != null && !instance.appContext.app.__VUE_I18N_SYMBOL__) {
    throw createI18nError(I18nErrorCodes.NOT_INSLALLED);
  }
  const i18n2 = getI18nInstance(instance);
  const global2 = getGlobalComposer(i18n2);
  const componentOptions = getComponentOptions(instance);
  const scope = getScope(options, componentOptions);
  if (scope === "global") {
    adjustI18nResources(global2, options, componentOptions);
    return global2;
  }
  if (scope === "parent") {
    let composer2 = getComposer(i18n2, instance, options.__useComponent);
    if (composer2 == null) {
      composer2 = global2;
    }
    return composer2;
  }
  const i18nInternal = i18n2;
  let composer = i18nInternal.__getInstance(instance);
  if (composer == null) {
    const composerOptions = assign({}, options);
    if ("__i18n" in componentOptions) {
      composerOptions.__i18n = componentOptions.__i18n;
    }
    if (global2) {
      composerOptions.__root = global2;
    }
    composer = createComposer(composerOptions);
    setupLifeCycle(i18nInternal, instance);
    i18nInternal.__setInstance(instance, composer);
  }
  return composer;
}
function createGlobal(options, legacyMode, VueI18nLegacy) {
  const scope = effectScope();
  {
    const obj = scope.run(() => createComposer(options));
    if (obj == null) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    return [scope, obj];
  }
}
function getI18nInstance(instance) {
  {
    const i18n2 = inject(!instance.isCE ? instance.appContext.app.__VUE_I18N_SYMBOL__ : I18nInjectionKey);
    if (!i18n2) {
      throw createI18nError(!instance.isCE ? I18nErrorCodes.UNEXPECTED_ERROR : I18nErrorCodes.NOT_INSLALLED_WITH_PROVIDE);
    }
    return i18n2;
  }
}
function getScope(options, componentOptions) {
  return isEmptyObject(options) ? "__i18n" in componentOptions ? "local" : "global" : !options.useScope ? "local" : options.useScope;
}
function getGlobalComposer(i18n2) {
  return i18n2.mode === "composition" ? i18n2.global : i18n2.global.__composer;
}
function getComposer(i18n2, target, useComponent = false) {
  let composer = null;
  const root2 = target.root;
  let current = target.parent;
  while (current != null) {
    const i18nInternal = i18n2;
    if (i18n2.mode === "composition") {
      composer = i18nInternal.__getInstance(current);
    }
    if (composer != null) {
      break;
    }
    if (root2 === current) {
      break;
    }
    current = current.parent;
  }
  return composer;
}
function setupLifeCycle(i18n2, target, composer) {
  {
    onMounted(() => {
    }, target);
    onUnmounted(() => {
      i18n2.__deleteInstance(target);
    }, target);
  }
}
const globalExportProps = [
  "locale",
  "fallbackLocale",
  "availableLocales"
];
const globalExportMethods = ["t", "rt", "d", "n", "tm"];
function injectGlobalFields(app, composer) {
  const i18n2 = /* @__PURE__ */ Object.create(null);
  globalExportProps.forEach((prop) => {
    const desc = Object.getOwnPropertyDescriptor(composer, prop);
    if (!desc) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const wrap2 = isRef(desc.value) ? {
      get() {
        return desc.value.value;
      },
      set(val) {
        desc.value.value = val;
      }
    } : {
      get() {
        return desc.get && desc.get();
      }
    };
    Object.defineProperty(i18n2, prop, wrap2);
  });
  app.config.globalProperties.$i18n = i18n2;
  globalExportMethods.forEach((method) => {
    const desc = Object.getOwnPropertyDescriptor(composer, method);
    if (!desc || !desc.value) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    Object.defineProperty(app.config.globalProperties, `$${method}`, desc);
  });
}
registerMessageResolver(resolveValue);
registerLocaleFallbacker(fallbackWithLocaleChain);
{
  initFeatureFlags();
}
if (__INTLIFY_PROD_DEVTOOLS__) {
  const target = getGlobalThis();
  target.__INTLIFY__ = true;
  setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}
var VReloadPrompt_vue_vue_type_style_index_0_lang = "";
function block0(Component) {
  Component.__i18n = Component.__i18n || [];
  Component.__i18n.push({
    "locale": "",
    "resource": {
      "de": {
        "offline-ready": (ctx) => {
          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
          return _normalize([_interpolate(_named("appName")), " ist bereit, offline zu arbeiten"]);
        },
        "need-refresh": (ctx) => {
          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
          return _normalize(["Eine neue Version von ", _interpolate(_named("appName")), " ist verf\xFCgbar, klicken Sie auf die Schaltfl\xE4che Neu laden, um sie zu aktualisieren."]);
        },
        "reload-button": (ctx) => {
          const { normalize: _normalize } = ctx;
          return _normalize(["Neu laden"]);
        },
        "close-button": (ctx) => {
          const { normalize: _normalize } = ctx;
          return _normalize(["Schlie\xDFen"]);
        }
      },
      "en": {
        "offline-ready": (ctx) => {
          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
          return _normalize([_interpolate(_named("appName")), " is ready to work offline"]);
        },
        "need-refresh": (ctx) => {
          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
          return _normalize(["A new version of ", _interpolate(_named("appName")), " is available, click on reload button to update."]);
        },
        "reload-button": (ctx) => {
          const { normalize: _normalize } = ctx;
          return _normalize(["Reload"]);
        },
        "close-button": (ctx) => {
          const { normalize: _normalize } = ctx;
          return _normalize(["Close"]);
        }
      },
      "es-MX": {
        "offline-ready": (ctx) => {
          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
          return _normalize([_interpolate(_named("appName")), " est\xE1 listo para trabajar sin conexi\xF3n"]);
        },
        "need-refresh": (ctx) => {
          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
          return _normalize(["Una nueva versi\xF3n de ", _interpolate(_named("appName")), " est\xE1 disponible, haga clic en el bot\xF3n Recarga para actualizar."]);
        },
        "reload-button": (ctx) => {
          const { normalize: _normalize } = ctx;
          return _normalize(["Recarga"]);
        },
        "close-button": (ctx) => {
          const { normalize: _normalize } = ctx;
          return _normalize(["Cerrar"]);
        }
      },
      "es": {
        "offline-ready": (ctx) => {
          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
          return _normalize([_interpolate(_named("appName")), " est\xE1 listo para trabajar sin conexi\xF3n"]);
        },
        "need-refresh": (ctx) => {
          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
          return _normalize(["Una nueva versi\xF3n de ", _interpolate(_named("appName")), " est\xE1 disponible, haga clic en el bot\xF3n Recarga para actualizar."]);
        },
        "reload-button": (ctx) => {
          const { normalize: _normalize } = ctx;
          return _normalize(["Recarga"]);
        },
        "close-button": (ctx) => {
          const { normalize: _normalize } = ctx;
          return _normalize(["Cerrar"]);
        }
      },
      "fr": {
        "offline-ready": (ctx) => {
          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
          return _normalize([_interpolate(_named("appName")), " est pr\xEAt \xE0 \xEAtre utilis\xE9 hors ligne"]);
        },
        "need-refresh": (ctx) => {
          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
          return _normalize(["Une nouvelle version de ", _interpolate(_named("appName")), " est disponible, cliquez sur le bouton Recharger pour la mettre \xE0 jour."]);
        },
        "reload-button": (ctx) => {
          const { normalize: _normalize } = ctx;
          return _normalize(["Recharger"]);
        },
        "close-button": (ctx) => {
          const { normalize: _normalize } = ctx;
          return _normalize(["Fermer"]);
        }
      },
      "zh-CN": {
        "offline-ready": (ctx) => {
          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
          return _normalize([_interpolate(_named("appName")), "\u5DF2\u51C6\u5907\u597D\u8131\u673A\u5DE5\u4F5C"]);
        },
        "need-refresh": (ctx) => {
          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
          return _normalize(["\u65B0\u7248\u672C\u7684", _interpolate(_named("appName")), "\u5DF2\u7ECF\u53EF\u7528\uFF0C\u70B9\u51FB\u91CD\u65B0\u52A0\u8F7D\u6309\u94AE\u6765\u66F4\u65B0\u3002"]);
        },
        "reload-button": (ctx) => {
          const { normalize: _normalize } = ctx;
          return _normalize(["\u91CD\u65B0\u52A0\u8F7D"]);
        },
        "close-button": (ctx) => {
          const { normalize: _normalize } = ctx;
          return _normalize(["\u5173\u95ED"]);
        }
      }
    }
  });
}
const _hoisted_1 = { class: "pwa-message" };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = { key: 1 };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  props: {
    appName: null
  },
  setup(__props) {
    const props = __props;
    const loading = ref(false);
    const { t: t2 } = useI18n();
    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();
    const close = async () => {
      loading.value = false;
      offlineReady.value = false;
      needRefresh.value = false;
    };
    const update = async () => {
      loading.value = true;
      await updateServiceWorker();
      loading.value = false;
    };
    return (_ctx, _cache) => {
      const _component_VButton = _sfc_main$c;
      const _component_VButtons = _sfc_main$2;
      const _component_VCard = _sfc_main$3;
      return openBlock(), createBlock(Transition, { name: "from-bottom" }, {
        default: withCtx(() => [
          unref(offlineReady) || unref(needRefresh) ? (openBlock(), createBlock(_component_VCard, {
            key: 0,
            class: "pwa-toast",
            role: "alert",
            radius: "smooth"
          }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_1, [
                unref(offlineReady) ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString$1(unref(t2)("offline-ready", { appName: props.appName })), 1)) : (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString$1(unref(t2)("need-refresh", { appName: props.appName })), 1))
              ]),
              createVNode(_component_VButtons, { align: "right" }, {
                default: withCtx(() => [
                  unref(needRefresh) ? (openBlock(), createBlock(_component_VButton, {
                    key: 0,
                    color: "primary",
                    icon: "ion:reload-outline",
                    loading: loading.value,
                    onClick: _cache[0] || (_cache[0] = () => update())
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString$1(unref(t2)("reload-button")), 1)
                    ]),
                    _: 1
                  }, 8, ["loading"])) : createCommentVNode("", true),
                  createVNode(_component_VButton, {
                    icon: "feather:x",
                    onClick: close
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString$1(unref(t2)("close-button")), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
});
if (typeof block0 === "function")
  block0(_sfc_main$1);
const _sfc_main = /* @__PURE__ */ defineComponent({
  setup(__props) {
    initDarkmode();
    return (_ctx, _cache) => {
      const _component_RouterView = resolveComponent("RouterView");
      const _component_VReloadPrompt = _sfc_main$1;
      return openBlock(), createElementBlock("div", null, [
        (openBlock(), createBlock(Suspense, null, {
          default: withCtx(() => [
            createVNode(_component_RouterView, null, {
              default: withCtx(({ Component }) => [
                createVNode(Transition, {
                  name: "fade-slow",
                  mode: "out-in"
                }, {
                  default: withCtx(() => [
                    (openBlock(), createBlock(resolveDynamicComponent(Component)))
                  ]),
                  _: 2
                }, 1024)
              ]),
              _: 1
            })
          ]),
          _: 1
        })),
        createVNode(_component_VReloadPrompt, { "app-name": "Vuero" })
      ]);
    };
  }
});
var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var canUseDom = canUseDOM;
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i2 = 0; i2 < props.length; i2++) {
    var descriptor = props[i2];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  return Constructor;
}
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal$1 = freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal$1 || freeSelf || Function("return this")();
var root$1 = root;
var Symbol$1 = root$1.Symbol;
var Symbol$2 = Symbol$1;
var objectProto$1 = Object.prototype;
var hasOwnProperty = objectProto$1.hasOwnProperty;
var nativeObjectToString$1 = objectProto$1.toString;
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e2) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
var reWhitespace = /\s/;
function trimmedEndIndex(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {
  }
  return index;
}
var reTrimStart = /^\s+/;
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject$1(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject$1(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var now = function() {
  return root$1.Date.now();
};
var now$1 = now;
var FUNC_ERROR_TEXT$1 = "Expected a function";
var nativeMax = Math.max, nativeMin = Math.min;
function debounce(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber(wait) || 0;
  if (isObject$1(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now$1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now$1());
  }
  function debounced() {
    var time = now$1(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
var FUNC_ERROR_TEXT = "Expected a function";
function throttle(func, wait, options) {
  var leading = true, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject$1(options)) {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    "leading": leading,
    "maxWait": wait,
    "trailing": trailing
  });
}
var cachedScrollbarWidth = null;
var cachedDevicePixelRatio = null;
if (canUseDom) {
  window.addEventListener("resize", function() {
    if (cachedDevicePixelRatio !== window.devicePixelRatio) {
      cachedDevicePixelRatio = window.devicePixelRatio;
      cachedScrollbarWidth = null;
    }
  });
}
function scrollbarWidth() {
  if (cachedScrollbarWidth === null) {
    if (typeof document === "undefined") {
      cachedScrollbarWidth = 0;
      return cachedScrollbarWidth;
    }
    var body = document.body;
    var box = document.createElement("div");
    box.classList.add("simplebar-hide-scrollbar");
    body.appendChild(box);
    var width = box.getBoundingClientRect().right;
    body.removeChild(box);
    cachedScrollbarWidth = width;
  }
  return cachedScrollbarWidth;
}
function getElementWindow(element) {
  if (!element || !element.ownerDocument || !element.ownerDocument.defaultView) {
    return window;
  }
  return element.ownerDocument.defaultView;
}
function getElementDocument(element) {
  if (!element || !element.ownerDocument) {
    return document;
  }
  return element.ownerDocument;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i2 = 1; i2 < arguments.length; i2++) {
    var source3 = arguments[i2] != null ? arguments[i2] : {};
    if (i2 % 2) {
      ownKeys(Object(source3), true).forEach(function(key) {
        _defineProperty(target, key, source3[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source3));
    } else {
      ownKeys(Object(source3)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source3, key));
      });
    }
  }
  return target;
}
var SimpleBar = /* @__PURE__ */ function() {
  function SimpleBar2(element) {
    var _this = this;
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    _classCallCheck(this, SimpleBar2);
    this.onScroll = function() {
      var elWindow = getElementWindow(_this.el);
      if (!_this.scrollXTicking) {
        elWindow.requestAnimationFrame(_this.scrollX);
        _this.scrollXTicking = true;
      }
      if (!_this.scrollYTicking) {
        elWindow.requestAnimationFrame(_this.scrollY);
        _this.scrollYTicking = true;
      }
      if (!_this.isScrolling) {
        _this.isScrolling = true;
        _this.el.classList.add(_this.classNames.scrolling);
      }
      _this.onStopScrolling();
    };
    this.scrollX = function() {
      if (_this.axis.x.isOverflowing) {
        _this.positionScrollbar("x");
      }
      _this.scrollXTicking = false;
    };
    this.scrollY = function() {
      if (_this.axis.y.isOverflowing) {
        _this.positionScrollbar("y");
      }
      _this.scrollYTicking = false;
    };
    this.onStopScrolling = function() {
      _this.el.classList.remove(_this.classNames.scrolling);
      _this.isScrolling = false;
    };
    this.onMouseEnter = function() {
      if (!_this.isMouseEntering) {
        _this.el.classList.add(_this.classNames.mouseEntered);
        _this.isMouseEntering = true;
      }
      _this.onMouseEntered();
    };
    this.onMouseEntered = function() {
      _this.el.classList.remove(_this.classNames.mouseEntered);
      _this.isMouseEntering = false;
    };
    this.onMouseMove = function(e2) {
      _this.mouseX = e2.clientX;
      _this.mouseY = e2.clientY;
      if (_this.axis.x.isOverflowing || _this.axis.x.forceVisible) {
        _this.onMouseMoveForAxis("x");
      }
      if (_this.axis.y.isOverflowing || _this.axis.y.forceVisible) {
        _this.onMouseMoveForAxis("y");
      }
    };
    this.onMouseLeave = function() {
      _this.onMouseMove.cancel();
      if (_this.axis.x.isOverflowing || _this.axis.x.forceVisible) {
        _this.onMouseLeaveForAxis("x");
      }
      if (_this.axis.y.isOverflowing || _this.axis.y.forceVisible) {
        _this.onMouseLeaveForAxis("y");
      }
      _this.mouseX = -1;
      _this.mouseY = -1;
    };
    this.onWindowResize = function() {
      _this.scrollbarWidth = SimpleBar2.getScrollbarWidth();
      _this.hideNativeScrollbar();
    };
    this.onPointerEvent = function(e2) {
      var isWithinTrackXBounds, isWithinTrackYBounds;
      _this.axis.x.track.rect = _this.axis.x.track.el.getBoundingClientRect();
      _this.axis.y.track.rect = _this.axis.y.track.el.getBoundingClientRect();
      if (_this.axis.x.isOverflowing || _this.axis.x.forceVisible) {
        isWithinTrackXBounds = _this.isWithinBounds(_this.axis.x.track.rect);
      }
      if (_this.axis.y.isOverflowing || _this.axis.y.forceVisible) {
        isWithinTrackYBounds = _this.isWithinBounds(_this.axis.y.track.rect);
      }
      if (isWithinTrackXBounds || isWithinTrackYBounds) {
        e2.stopPropagation();
        if (e2.type === "pointerdown" && e2.pointerType !== "touch") {
          if (isWithinTrackXBounds) {
            _this.axis.x.scrollbar.rect = _this.axis.x.scrollbar.el.getBoundingClientRect();
            if (_this.isWithinBounds(_this.axis.x.scrollbar.rect)) {
              _this.onDragStart(e2, "x");
            } else {
              _this.onTrackClick(e2, "x");
            }
          }
          if (isWithinTrackYBounds) {
            _this.axis.y.scrollbar.rect = _this.axis.y.scrollbar.el.getBoundingClientRect();
            if (_this.isWithinBounds(_this.axis.y.scrollbar.rect)) {
              _this.onDragStart(e2, "y");
            } else {
              _this.onTrackClick(e2, "y");
            }
          }
        }
      }
    };
    this.drag = function(e2) {
      var eventOffset;
      var track2 = _this.axis[_this.draggedAxis].track;
      var trackSize = track2.rect[_this.axis[_this.draggedAxis].sizeAttr];
      var scrollbar = _this.axis[_this.draggedAxis].scrollbar;
      var contentSize = _this.contentWrapperEl[_this.axis[_this.draggedAxis].scrollSizeAttr];
      var hostSize = parseInt(_this.elStyles[_this.axis[_this.draggedAxis].sizeAttr], 10);
      e2.preventDefault();
      e2.stopPropagation();
      if (_this.draggedAxis === "y") {
        eventOffset = e2.pageY;
      } else {
        eventOffset = e2.pageX;
      }
      var dragPos = eventOffset - track2.rect[_this.axis[_this.draggedAxis].offsetAttr] - _this.axis[_this.draggedAxis].dragOffset;
      var dragPerc = dragPos / (trackSize - scrollbar.size);
      var scrollPos = dragPerc * (contentSize - hostSize);
      if (_this.draggedAxis === "x") {
        scrollPos = _this.isRtl && SimpleBar2.getRtlHelpers().isScrollOriginAtZero ? scrollPos - (trackSize + scrollbar.size) : scrollPos;
      }
      _this.contentWrapperEl[_this.axis[_this.draggedAxis].scrollOffsetAttr] = scrollPos;
    };
    this.onEndDrag = function(e2) {
      var elDocument = getElementDocument(_this.el);
      var elWindow = getElementWindow(_this.el);
      e2.preventDefault();
      e2.stopPropagation();
      _this.el.classList.remove(_this.classNames.dragging);
      elDocument.removeEventListener("mousemove", _this.drag, true);
      elDocument.removeEventListener("mouseup", _this.onEndDrag, true);
      _this.removePreventClickId = elWindow.setTimeout(function() {
        elDocument.removeEventListener("click", _this.preventClick, true);
        elDocument.removeEventListener("dblclick", _this.preventClick, true);
        _this.removePreventClickId = null;
      });
    };
    this.preventClick = function(e2) {
      e2.preventDefault();
      e2.stopPropagation();
    };
    this.el = element;
    this.minScrollbarWidth = 20;
    this.stopScrollDelay = 175;
    this.options = _objectSpread(_objectSpread({}, SimpleBar2.defaultOptions), options);
    this.classNames = _objectSpread({
      contentEl: "simplebar-content",
      contentWrapper: "simplebar-content-wrapper",
      offset: "simplebar-offset",
      mask: "simplebar-mask",
      wrapper: "simplebar-wrapper",
      placeholder: "simplebar-placeholder",
      scrollbar: "simplebar-scrollbar",
      track: "simplebar-track",
      heightAutoObserverWrapperEl: "simplebar-height-auto-observer-wrapper",
      heightAutoObserverEl: "simplebar-height-auto-observer",
      visible: "simplebar-visible",
      horizontal: "simplebar-horizontal",
      vertical: "simplebar-vertical",
      hover: "simplebar-hover",
      dragging: "simplebar-dragging",
      scrolling: "simplebar-scrolling",
      scrollable: "simplebar-scrollable",
      mouseEntered: "simplebar-mouse-entered"
    }, this.options.classNames);
    this.axis = {
      x: {
        scrollOffsetAttr: "scrollLeft",
        sizeAttr: "width",
        scrollSizeAttr: "scrollWidth",
        offsetSizeAttr: "offsetWidth",
        offsetAttr: "left",
        overflowAttr: "overflowX",
        dragOffset: 0,
        isOverflowing: true,
        isVisible: false,
        forceVisible: false,
        track: {},
        scrollbar: {}
      },
      y: {
        scrollOffsetAttr: "scrollTop",
        sizeAttr: "height",
        scrollSizeAttr: "scrollHeight",
        offsetSizeAttr: "offsetHeight",
        offsetAttr: "top",
        overflowAttr: "overflowY",
        dragOffset: 0,
        isOverflowing: true,
        isVisible: false,
        forceVisible: false,
        track: {},
        scrollbar: {}
      }
    };
    this.removePreventClickId = null;
    this.isScrolling = false;
    this.isMouseEntering = false;
    if (SimpleBar2.instances.has(this.el)) {
      return;
    }
    if (options.classNames) {
      console.warn("simplebar: classNames option is deprecated. Please override the styles with CSS instead.");
    }
    if (options.autoHide) {
      console.warn("simplebar: autoHide option is deprecated. Please use CSS instead: '.simplebar-scrollbar::before { opacity: 0.5 };' for autoHide: false");
    }
    this.onMouseMove = throttle(this.onMouseMove, 64);
    this.onWindowResize = debounce(this.onWindowResize, 64, {
      leading: true
    });
    this.onStopScrolling = debounce(this.onStopScrolling, this.stopScrollDelay);
    this.onMouseEntered = debounce(this.onMouseEntered, this.stopScrollDelay);
    this.init();
  }
  _createClass(SimpleBar2, [{
    key: "init",
    value: function init() {
      SimpleBar2.instances.set(this.el, this);
      if (canUseDom) {
        this.initDOM();
        this.rtlHelpers = SimpleBar2.getRtlHelpers();
        this.scrollbarWidth = SimpleBar2.getScrollbarWidth();
        this.recalculate();
        this.initListeners();
      }
    }
  }, {
    key: "initDOM",
    value: function initDOM() {
      var _this2 = this;
      if (Array.prototype.filter.call(this.el.children, function(child) {
        return child.classList.contains(_this2.classNames.wrapper);
      }).length) {
        this.wrapperEl = this.el.querySelector(".".concat(this.classNames.wrapper));
        this.contentWrapperEl = this.options.scrollableNode || this.el.querySelector(".".concat(this.classNames.contentWrapper));
        this.contentEl = this.options.contentNode || this.el.querySelector(".".concat(this.classNames.contentEl));
        this.offsetEl = this.el.querySelector(".".concat(this.classNames.offset));
        this.maskEl = this.el.querySelector(".".concat(this.classNames.mask));
        this.placeholderEl = this.findChild(this.wrapperEl, ".".concat(this.classNames.placeholder));
        this.heightAutoObserverWrapperEl = this.el.querySelector(".".concat(this.classNames.heightAutoObserverWrapperEl));
        this.heightAutoObserverEl = this.el.querySelector(".".concat(this.classNames.heightAutoObserverEl));
        this.axis.x.track.el = this.findChild(this.el, ".".concat(this.classNames.track, ".").concat(this.classNames.horizontal));
        this.axis.y.track.el = this.findChild(this.el, ".".concat(this.classNames.track, ".").concat(this.classNames.vertical));
      } else {
        this.wrapperEl = document.createElement("div");
        this.contentWrapperEl = document.createElement("div");
        this.offsetEl = document.createElement("div");
        this.maskEl = document.createElement("div");
        this.contentEl = document.createElement("div");
        this.placeholderEl = document.createElement("div");
        this.heightAutoObserverWrapperEl = document.createElement("div");
        this.heightAutoObserverEl = document.createElement("div");
        this.wrapperEl.classList.add(this.classNames.wrapper);
        this.contentWrapperEl.classList.add(this.classNames.contentWrapper);
        this.offsetEl.classList.add(this.classNames.offset);
        this.maskEl.classList.add(this.classNames.mask);
        this.contentEl.classList.add(this.classNames.contentEl);
        this.placeholderEl.classList.add(this.classNames.placeholder);
        this.heightAutoObserverWrapperEl.classList.add(this.classNames.heightAutoObserverWrapperEl);
        this.heightAutoObserverEl.classList.add(this.classNames.heightAutoObserverEl);
        while (this.el.firstChild) {
          this.contentEl.appendChild(this.el.firstChild);
        }
        this.contentWrapperEl.appendChild(this.contentEl);
        this.offsetEl.appendChild(this.contentWrapperEl);
        this.maskEl.appendChild(this.offsetEl);
        this.heightAutoObserverWrapperEl.appendChild(this.heightAutoObserverEl);
        this.wrapperEl.appendChild(this.heightAutoObserverWrapperEl);
        this.wrapperEl.appendChild(this.maskEl);
        this.wrapperEl.appendChild(this.placeholderEl);
        this.el.appendChild(this.wrapperEl);
      }
      if (!this.axis.x.track.el || !this.axis.y.track.el) {
        var track2 = document.createElement("div");
        var scrollbar = document.createElement("div");
        track2.classList.add(this.classNames.track);
        scrollbar.classList.add(this.classNames.scrollbar);
        track2.appendChild(scrollbar);
        this.axis.x.track.el = track2.cloneNode(true);
        this.axis.x.track.el.classList.add(this.classNames.horizontal);
        this.axis.y.track.el = track2.cloneNode(true);
        this.axis.y.track.el.classList.add(this.classNames.vertical);
        this.el.appendChild(this.axis.x.track.el);
        this.el.appendChild(this.axis.y.track.el);
      }
      this.axis.x.scrollbar.el = this.axis.x.track.el.querySelector(".".concat(this.classNames.scrollbar));
      this.axis.y.scrollbar.el = this.axis.y.track.el.querySelector(".".concat(this.classNames.scrollbar));
      if (!this.options.autoHide) {
        this.axis.x.scrollbar.el.classList.add(this.classNames.visible);
        this.axis.y.scrollbar.el.classList.add(this.classNames.visible);
      }
      this.el.setAttribute("data-simplebar", "init");
    }
  }, {
    key: "initListeners",
    value: function initListeners() {
      var _this3 = this;
      var elWindow = getElementWindow(this.el);
      this.el.addEventListener("mouseenter", this.onMouseEnter);
      this.el.addEventListener("pointerdown", this.onPointerEvent, true);
      this.el.addEventListener("mousemove", this.onMouseMove);
      this.el.addEventListener("mouseleave", this.onMouseLeave);
      this.contentWrapperEl.addEventListener("scroll", this.onScroll);
      elWindow.addEventListener("resize", this.onWindowResize);
      if (window.ResizeObserver) {
        var resizeObserverStarted = false;
        var resizeObserver = elWindow.ResizeObserver || ResizeObserver;
        this.resizeObserver = new resizeObserver(function() {
          if (!resizeObserverStarted)
            return;
          elWindow.requestAnimationFrame(function() {
            _this3.recalculate();
          });
        });
        this.resizeObserver.observe(this.el);
        this.resizeObserver.observe(this.contentEl);
        elWindow.requestAnimationFrame(function() {
          resizeObserverStarted = true;
        });
      }
      this.mutationObserver = new elWindow.MutationObserver(function() {
        elWindow.requestAnimationFrame(function() {
          _this3.recalculate();
        });
      });
      this.mutationObserver.observe(this.contentEl, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }, {
    key: "recalculate",
    value: function recalculate() {
      var elWindow = getElementWindow(this.el);
      this.elStyles = elWindow.getComputedStyle(this.el);
      this.isRtl = this.elStyles.direction === "rtl";
      var contentElOffsetWidth = this.contentEl.offsetWidth;
      var isHeightAuto = this.heightAutoObserverEl.offsetHeight <= 1;
      var isWidthAuto = this.heightAutoObserverEl.offsetWidth <= 1 || contentElOffsetWidth > 0;
      var contentWrapperElOffsetWidth = this.contentWrapperEl.offsetWidth;
      var elOverflowX = this.elStyles.overflowX;
      var elOverflowY = this.elStyles.overflowY;
      this.contentEl.style.padding = "".concat(this.elStyles.paddingTop, " ").concat(this.elStyles.paddingRight, " ").concat(this.elStyles.paddingBottom, " ").concat(this.elStyles.paddingLeft);
      this.wrapperEl.style.margin = "-".concat(this.elStyles.paddingTop, " -").concat(this.elStyles.paddingRight, " -").concat(this.elStyles.paddingBottom, " -").concat(this.elStyles.paddingLeft);
      var contentElScrollHeight = this.contentEl.scrollHeight;
      var contentElScrollWidth = this.contentEl.scrollWidth;
      this.contentWrapperEl.style.height = isHeightAuto ? "auto" : "100%";
      this.placeholderEl.style.width = isWidthAuto ? "".concat(contentElOffsetWidth || contentElScrollWidth, "px") : "auto";
      this.placeholderEl.style.height = "".concat(contentElScrollHeight, "px");
      var contentWrapperElOffsetHeight = this.contentWrapperEl.offsetHeight;
      this.axis.x.isOverflowing = contentElOffsetWidth !== 0 && contentElScrollWidth > contentElOffsetWidth;
      this.axis.y.isOverflowing = contentElScrollHeight > contentWrapperElOffsetHeight;
      this.axis.x.isOverflowing = elOverflowX === "hidden" ? false : this.axis.x.isOverflowing;
      this.axis.y.isOverflowing = elOverflowY === "hidden" ? false : this.axis.y.isOverflowing;
      this.axis.x.forceVisible = this.options.forceVisible === "x" || this.options.forceVisible === true;
      this.axis.y.forceVisible = this.options.forceVisible === "y" || this.options.forceVisible === true;
      this.hideNativeScrollbar();
      var offsetForXScrollbar = this.axis.x.isOverflowing ? this.scrollbarWidth : 0;
      var offsetForYScrollbar = this.axis.y.isOverflowing ? this.scrollbarWidth : 0;
      this.axis.x.isOverflowing = this.axis.x.isOverflowing && contentElScrollWidth > contentWrapperElOffsetWidth - offsetForYScrollbar;
      this.axis.y.isOverflowing = this.axis.y.isOverflowing && contentElScrollHeight > contentWrapperElOffsetHeight - offsetForXScrollbar;
      this.axis.x.scrollbar.size = this.getScrollbarSize("x");
      this.axis.y.scrollbar.size = this.getScrollbarSize("y");
      this.axis.x.scrollbar.el.style.width = "".concat(this.axis.x.scrollbar.size, "px");
      this.axis.y.scrollbar.el.style.height = "".concat(this.axis.y.scrollbar.size, "px");
      this.positionScrollbar("x");
      this.positionScrollbar("y");
      this.toggleTrackVisibility("x");
      this.toggleTrackVisibility("y");
    }
  }, {
    key: "getScrollbarSize",
    value: function getScrollbarSize() {
      var axis = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "y";
      if (!this.axis[axis].isOverflowing) {
        return 0;
      }
      var contentSize = this.contentEl[this.axis[axis].scrollSizeAttr];
      var trackSize = this.axis[axis].track.el[this.axis[axis].offsetSizeAttr];
      var scrollbarSize;
      var scrollbarRatio = trackSize / contentSize;
      scrollbarSize = Math.max(~~(scrollbarRatio * trackSize), this.options.scrollbarMinSize);
      if (this.options.scrollbarMaxSize) {
        scrollbarSize = Math.min(scrollbarSize, this.options.scrollbarMaxSize);
      }
      return scrollbarSize;
    }
  }, {
    key: "positionScrollbar",
    value: function positionScrollbar() {
      var axis = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "y";
      if (!this.axis[axis].isOverflowing) {
        return;
      }
      var contentSize = this.contentWrapperEl[this.axis[axis].scrollSizeAttr];
      var trackSize = this.axis[axis].track.el[this.axis[axis].offsetSizeAttr];
      var hostSize = parseInt(this.elStyles[this.axis[axis].sizeAttr], 10);
      var scrollbar = this.axis[axis].scrollbar;
      var scrollOffset = this.contentWrapperEl[this.axis[axis].scrollOffsetAttr];
      scrollOffset = axis === "x" && this.isRtl && SimpleBar2.getRtlHelpers().isScrollOriginAtZero ? -scrollOffset : scrollOffset;
      var scrollPourcent = scrollOffset / (contentSize - hostSize);
      var handleOffset = ~~((trackSize - scrollbar.size) * scrollPourcent);
      handleOffset = axis === "x" && this.isRtl && SimpleBar2.getRtlHelpers().isScrollingToNegative ? -handleOffset + (trackSize - scrollbar.size) : handleOffset;
      scrollbar.el.style.transform = axis === "x" ? "translate3d(".concat(handleOffset, "px, 0, 0)") : "translate3d(0, ".concat(handleOffset, "px, 0)");
    }
  }, {
    key: "toggleTrackVisibility",
    value: function toggleTrackVisibility() {
      var axis = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "y";
      var track2 = this.axis[axis].track.el;
      var scrollbar = this.axis[axis].scrollbar.el;
      if (this.axis[axis].isOverflowing || this.axis[axis].forceVisible) {
        track2.style.visibility = "visible";
        this.contentWrapperEl.style[this.axis[axis].overflowAttr] = "scroll";
        this.el.classList.add("".concat(this.classNames.scrollable, "-").concat(axis));
      } else {
        track2.style.visibility = "hidden";
        this.contentWrapperEl.style[this.axis[axis].overflowAttr] = "hidden";
        this.el.classList.remove("".concat(this.classNames.scrollable, "-").concat(axis));
      }
      if (this.axis[axis].isOverflowing) {
        scrollbar.style.display = "block";
      } else {
        scrollbar.style.display = "none";
      }
    }
  }, {
    key: "hideNativeScrollbar",
    value: function hideNativeScrollbar() {
      this.offsetEl.style[this.isRtl ? "left" : "right"] = this.axis.y.isOverflowing || this.axis.y.forceVisible ? "-".concat(this.scrollbarWidth, "px") : 0;
      this.offsetEl.style.bottom = this.axis.x.isOverflowing || this.axis.x.forceVisible ? "-".concat(this.scrollbarWidth, "px") : 0;
    }
  }, {
    key: "onMouseMoveForAxis",
    value: function onMouseMoveForAxis() {
      var axis = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "y";
      this.axis[axis].track.rect = this.axis[axis].track.el.getBoundingClientRect();
      this.axis[axis].scrollbar.rect = this.axis[axis].scrollbar.el.getBoundingClientRect();
      var isWithinScrollbarBoundsX = this.isWithinBounds(this.axis[axis].scrollbar.rect);
      if (isWithinScrollbarBoundsX) {
        this.axis[axis].scrollbar.el.classList.add(this.classNames.hover);
      } else {
        this.axis[axis].scrollbar.el.classList.remove(this.classNames.hover);
      }
      if (this.isWithinBounds(this.axis[axis].track.rect)) {
        this.axis[axis].track.el.classList.add(this.classNames.hover);
      } else {
        this.axis[axis].track.el.classList.remove(this.classNames.hover);
      }
    }
  }, {
    key: "onMouseLeaveForAxis",
    value: function onMouseLeaveForAxis() {
      var axis = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "y";
      this.axis[axis].track.el.classList.remove(this.classNames.hover);
      this.axis[axis].scrollbar.el.classList.remove(this.classNames.hover);
    }
  }, {
    key: "onDragStart",
    value: function onDragStart(e2) {
      var axis = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "y";
      var elDocument = getElementDocument(this.el);
      var elWindow = getElementWindow(this.el);
      var scrollbar = this.axis[axis].scrollbar;
      var eventOffset = axis === "y" ? e2.pageY : e2.pageX;
      this.axis[axis].dragOffset = eventOffset - scrollbar.rect[this.axis[axis].offsetAttr];
      this.draggedAxis = axis;
      this.el.classList.add(this.classNames.dragging);
      elDocument.addEventListener("mousemove", this.drag, true);
      elDocument.addEventListener("mouseup", this.onEndDrag, true);
      if (this.removePreventClickId === null) {
        elDocument.addEventListener("click", this.preventClick, true);
        elDocument.addEventListener("dblclick", this.preventClick, true);
      } else {
        elWindow.clearTimeout(this.removePreventClickId);
        this.removePreventClickId = null;
      }
    }
  }, {
    key: "onTrackClick",
    value: function onTrackClick(e2) {
      var _this4 = this;
      var axis = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "y";
      if (!this.options.clickOnTrack)
        return;
      e2.preventDefault();
      var elWindow = getElementWindow(this.el);
      this.axis[axis].scrollbar.rect = this.axis[axis].scrollbar.el.getBoundingClientRect();
      var scrollbar = this.axis[axis].scrollbar;
      var scrollbarOffset = scrollbar.rect[this.axis[axis].offsetAttr];
      var hostSize = parseInt(this.elStyles[this.axis[axis].sizeAttr], 10);
      var scrolled = this.contentWrapperEl[this.axis[axis].scrollOffsetAttr];
      var t2 = axis === "y" ? this.mouseY - scrollbarOffset : this.mouseX - scrollbarOffset;
      var dir = t2 < 0 ? -1 : 1;
      var scrollSize = dir === -1 ? scrolled - hostSize : scrolled + hostSize;
      var speed = 40;
      var scrollTo = function scrollTo2() {
        if (dir === -1) {
          if (scrolled > scrollSize) {
            scrolled -= speed;
            _this4.contentWrapperEl[_this4.axis[axis].scrollOffsetAttr] = scrolled;
            elWindow.requestAnimationFrame(scrollTo2);
          }
        } else {
          if (scrolled < scrollSize) {
            scrolled += speed;
            _this4.contentWrapperEl[_this4.axis[axis].scrollOffsetAttr] = scrolled;
            elWindow.requestAnimationFrame(scrollTo2);
          }
        }
      };
      scrollTo();
    }
  }, {
    key: "getContentElement",
    value: function getContentElement() {
      return this.contentEl;
    }
  }, {
    key: "getScrollElement",
    value: function getScrollElement() {
      return this.contentWrapperEl;
    }
  }, {
    key: "removeListeners",
    value: function removeListeners() {
      var elWindow = getElementWindow(this.el);
      this.el.removeEventListener("mouseenter", this.onMouseEnter);
      this.el.removeEventListener("pointerdown", this.onPointerEvent, true);
      this.el.removeEventListener("mousemove", this.onMouseMove);
      this.el.removeEventListener("mouseleave", this.onMouseLeave);
      if (this.contentWrapperEl) {
        this.contentWrapperEl.removeEventListener("scroll", this.onScroll);
      }
      elWindow.removeEventListener("resize", this.onWindowResize);
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
      }
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      this.onMouseMove.cancel();
      this.onWindowResize.cancel();
      this.onStopScrolling.cancel();
      this.onMouseEntered.cancel();
    }
  }, {
    key: "unMount",
    value: function unMount() {
      this.removeListeners();
      SimpleBar2.instances.delete(this.el);
    }
  }, {
    key: "isWithinBounds",
    value: function isWithinBounds(bbox) {
      return this.mouseX >= bbox.left && this.mouseX <= bbox.left + bbox.width && this.mouseY >= bbox.top && this.mouseY <= bbox.top + bbox.height;
    }
  }, {
    key: "findChild",
    value: function findChild(el, query) {
      var matches2 = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
      return Array.prototype.filter.call(el.children, function(child) {
        return matches2.call(child, query);
      })[0];
    }
  }], [{
    key: "getRtlHelpers",
    value: function getRtlHelpers() {
      if (SimpleBar2.rtlHelpers) {
        return SimpleBar2.rtlHelpers;
      }
      var dummyDiv = document.createElement("div");
      dummyDiv.innerHTML = '<div class="simplebar-dummy-scrollbar-size"><div></div></div>';
      var scrollbarDummyEl = dummyDiv.firstElementChild;
      var dummyChild = scrollbarDummyEl.firstElementChild;
      document.body.appendChild(scrollbarDummyEl);
      scrollbarDummyEl.scrollLeft = 0;
      var dummyContainerOffset = SimpleBar2.getOffset(scrollbarDummyEl);
      var dummyChildOffset = SimpleBar2.getOffset(dummyChild);
      scrollbarDummyEl.scrollLeft = -999;
      var dummyChildOffsetAfterScroll = SimpleBar2.getOffset(dummyChild);
      document.body.removeChild(scrollbarDummyEl);
      SimpleBar2.rtlHelpers = {
        isScrollOriginAtZero: dummyContainerOffset.left !== dummyChildOffset.left,
        isScrollingToNegative: dummyChildOffset.left !== dummyChildOffsetAfterScroll.left
      };
      return SimpleBar2.rtlHelpers;
    }
  }, {
    key: "getScrollbarWidth",
    value: function getScrollbarWidth() {
      try {
        if (getComputedStyle(this.contentWrapperEl, "::-webkit-scrollbar").display === "none" || "scrollbarWidth" in document.documentElement.style || "-ms-overflow-style" in document.documentElement.style) {
          return 0;
        } else {
          return scrollbarWidth();
        }
      } catch (e2) {
        return scrollbarWidth();
      }
    }
  }, {
    key: "getOffset",
    value: function getOffset(el) {
      var rect = el.getBoundingClientRect();
      var elDocument = getElementDocument(el);
      var elWindow = getElementWindow(el);
      return {
        top: rect.top + (elWindow.pageYOffset || elDocument.documentElement.scrollTop),
        left: rect.left + (elWindow.pageXOffset || elDocument.documentElement.scrollLeft)
      };
    }
  }]);
  return SimpleBar2;
}();
SimpleBar.defaultOptions = {
  autoHide: true,
  forceVisible: false,
  clickOnTrack: true,
  scrollbarMinSize: 25,
  scrollbarMaxSize: 0
};
SimpleBar.instances = /* @__PURE__ */ new WeakMap();
var SimpleBar$1 = SimpleBar;
var getOptions = function getOptions2(obj) {
  var options = Array.prototype.reduce.call(obj, function(acc, attribute) {
    var option = attribute.name.match(/data-simplebar-(.+)/);
    if (option) {
      var key = option[1].replace(/\W+(.)/g, function(x, chr) {
        return chr.toUpperCase();
      });
      switch (attribute.value) {
        case "true":
          acc[key] = true;
          break;
        case "false":
          acc[key] = false;
          break;
        case void 0:
          acc[key] = true;
          break;
        default:
          acc[key] = attribute.value;
      }
    }
    return acc;
  }, {});
  return options;
};
SimpleBar$1.initDOMLoadedElements = function() {
  document.removeEventListener("DOMContentLoaded", this.initDOMLoadedElements);
  window.removeEventListener("load", this.initDOMLoadedElements);
  Array.prototype.forEach.call(document.querySelectorAll("[data-simplebar]"), function(el) {
    if (el.getAttribute("data-simplebar") !== "init" && !SimpleBar$1.instances.has(el))
      new SimpleBar$1(el, getOptions(el.attributes));
  });
};
SimpleBar$1.removeObserver = function() {
  this.globalObserver.disconnect();
};
SimpleBar$1.initHtmlApi = function() {
  this.initDOMLoadedElements = this.initDOMLoadedElements.bind(this);
  if (typeof MutationObserver !== "undefined") {
    this.globalObserver = new MutationObserver(SimpleBar$1.handleMutations);
    this.globalObserver.observe(document, {
      childList: true,
      subtree: true
    });
  }
  if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {
    window.setTimeout(this.initDOMLoadedElements);
  } else {
    document.addEventListener("DOMContentLoaded", this.initDOMLoadedElements);
    window.addEventListener("load", this.initDOMLoadedElements);
  }
};
SimpleBar$1.handleMutations = function(mutations) {
  mutations.forEach(function(mutation) {
    Array.prototype.forEach.call(mutation.addedNodes, function(addedNode) {
      if (addedNode.nodeType === 1) {
        if (addedNode.hasAttribute("data-simplebar")) {
          !SimpleBar$1.instances.has(addedNode) && new SimpleBar$1(addedNode, getOptions(addedNode.attributes));
        } else {
          Array.prototype.forEach.call(addedNode.querySelectorAll("[data-simplebar]"), function(el) {
            if (el.getAttribute("data-simplebar") !== "init" && !SimpleBar$1.instances.has(el))
              new SimpleBar$1(el, getOptions(el.attributes));
          });
        }
      }
    });
    Array.prototype.forEach.call(mutation.removedNodes, function(removedNode) {
      if (removedNode.nodeType === 1) {
        if (removedNode.hasAttribute("data-simplebar")) {
          SimpleBar$1.instances.has(removedNode) && SimpleBar$1.instances.get(removedNode).unMount();
        } else {
          Array.prototype.forEach.call(removedNode.querySelectorAll('[data-simplebar="init"]'), function(el) {
            SimpleBar$1.instances.has(el) && SimpleBar$1.instances.get(el).unMount();
          });
        }
      }
    });
  });
};
SimpleBar$1.getOptions = getOptions;
SimpleBar$1.default = SimpleBar$1;
if (canUseDom) {
  SimpleBar$1.initHtmlApi();
}
/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt or license.gpl.txt
* files at https://github.com/iconify/iconify
*
* Licensed under Apache 2.0 or GPL 2.0 at your option.
* If derivative product is not compatible with one of licenses, you can pick one of licenses.
*
* @license Apache 2.0
* @license GPL 2.0
* @version 2.2.1
*/
const matchName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const iconDefaults = Object.freeze({
  left: 0,
  top: 0,
  width: 16,
  height: 16,
  rotate: 0,
  vFlip: false,
  hFlip: false
});
function fullIcon(data2) {
  return __spreadValues(__spreadValues({}, iconDefaults), data2);
}
function mergeIconData(icon, alias) {
  const result = __spreadValues({}, icon);
  for (const key in iconDefaults) {
    const prop = key;
    if (alias[prop] !== void 0) {
      const value = alias[prop];
      if (result[prop] === void 0) {
        result[prop] = value;
        continue;
      }
      switch (prop) {
        case "rotate":
          result[prop] = (result[prop] + value) % 4;
          break;
        case "hFlip":
        case "vFlip":
          result[prop] = value !== result[prop];
          break;
        default:
          result[prop] = value;
      }
    }
  }
  return result;
}
function getIconData$1(data2, name, full = false) {
  function getIcon2(name2, iteration) {
    if (data2.icons[name2] !== void 0) {
      return Object.assign({}, data2.icons[name2]);
    }
    if (iteration > 5) {
      return null;
    }
    const aliases = data2.aliases;
    if (aliases && aliases[name2] !== void 0) {
      const item = aliases[name2];
      const result2 = getIcon2(item.parent, iteration + 1);
      if (result2) {
        return mergeIconData(result2, item);
      }
      return result2;
    }
    const chars = data2.chars;
    if (!iteration && chars && chars[name2] !== void 0) {
      return getIcon2(chars[name2], iteration + 1);
    }
    return null;
  }
  const result = getIcon2(name, 0);
  if (result) {
    for (const key in iconDefaults) {
      if (result[key] === void 0 && data2[key] !== void 0) {
        result[key] = data2[key];
      }
    }
  }
  return result && full ? fullIcon(result) : result;
}
function isVariation(item) {
  for (const key in iconDefaults) {
    if (item[key] !== void 0) {
      return true;
    }
  }
  return false;
}
function parseIconSet(data2, callback2, options) {
  options = options || {};
  const names = [];
  if (typeof data2 !== "object" || typeof data2.icons !== "object") {
    return names;
  }
  if (data2.not_found instanceof Array) {
    data2.not_found.forEach((name) => {
      callback2(name, null);
      names.push(name);
    });
  }
  const icons = data2.icons;
  Object.keys(icons).forEach((name) => {
    const iconData = getIconData$1(data2, name, true);
    if (iconData) {
      callback2(name, iconData);
      names.push(name);
    }
  });
  const parseAliases = options.aliases || "all";
  if (parseAliases !== "none" && typeof data2.aliases === "object") {
    const aliases = data2.aliases;
    Object.keys(aliases).forEach((name) => {
      if (parseAliases === "variations" && isVariation(aliases[name])) {
        return;
      }
      const iconData = getIconData$1(data2, name, true);
      if (iconData) {
        callback2(name, iconData);
        names.push(name);
      }
    });
  }
  return names;
}
const optionalProperties = {
  provider: "string",
  aliases: "object",
  not_found: "object"
};
for (const prop in iconDefaults) {
  optionalProperties[prop] = typeof iconDefaults[prop];
}
function quicklyValidateIconSet(obj) {
  if (typeof obj !== "object" || obj === null) {
    return null;
  }
  const data2 = obj;
  if (typeof data2.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
    return null;
  }
  for (const prop in optionalProperties) {
    if (obj[prop] !== void 0 && typeof obj[prop] !== optionalProperties[prop]) {
      return null;
    }
  }
  const icons = data2.icons;
  for (const name in icons) {
    const icon = icons[name];
    if (!name.match(matchName) || typeof icon.body !== "string") {
      return null;
    }
    for (const prop in iconDefaults) {
      if (icon[prop] !== void 0 && typeof icon[prop] !== typeof iconDefaults[prop]) {
        return null;
      }
    }
  }
  const aliases = data2.aliases;
  if (aliases) {
    for (const name in aliases) {
      const icon = aliases[name];
      const parent = icon.parent;
      if (!name.match(matchName) || typeof parent !== "string" || !icons[parent] && !aliases[parent]) {
        return null;
      }
      for (const prop in iconDefaults) {
        if (icon[prop] !== void 0 && typeof icon[prop] !== typeof iconDefaults[prop]) {
          return null;
        }
      }
    }
  }
  return data2;
}
const stringToIcon = (value, validate, allowSimpleName, provider = "") => {
  const colonSeparated = value.split(":");
  if (value.slice(0, 1) === "@") {
    if (colonSeparated.length < 2 || colonSeparated.length > 3) {
      return null;
    }
    provider = colonSeparated.shift().slice(1);
  }
  if (colonSeparated.length > 3 || !colonSeparated.length) {
    return null;
  }
  if (colonSeparated.length > 1) {
    const name2 = colonSeparated.pop();
    const prefix = colonSeparated.pop();
    const result = {
      provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
      prefix,
      name: name2
    };
    return validate && !validateIcon(result) ? null : result;
  }
  const name = colonSeparated[0];
  const dashSeparated = name.split("-");
  if (dashSeparated.length > 1) {
    const result = {
      provider,
      prefix: dashSeparated.shift(),
      name: dashSeparated.join("-")
    };
    return validate && !validateIcon(result) ? null : result;
  }
  if (allowSimpleName && provider === "") {
    const result = {
      provider,
      prefix: "",
      name
    };
    return validate && !validateIcon(result, allowSimpleName) ? null : result;
  }
  return null;
};
const validateIcon = (icon, allowSimpleName) => {
  if (!icon) {
    return false;
  }
  return !!((icon.provider === "" || icon.provider.match(matchName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchName)) && icon.name.match(matchName));
};
const storageVersion = 1;
let storage$1 = /* @__PURE__ */ Object.create(null);
try {
  const w = window || self;
  if (w && w._iconifyStorage.version === storageVersion) {
    storage$1 = w._iconifyStorage.storage;
  }
} catch (err) {
}
function shareStorage() {
  try {
    const w = window || self;
    if (w && !w._iconifyStorage) {
      w._iconifyStorage = {
        version: storageVersion,
        storage: storage$1
      };
    }
  } catch (err) {
  }
}
function newStorage(provider, prefix) {
  return {
    provider,
    prefix,
    icons: /* @__PURE__ */ Object.create(null),
    missing: /* @__PURE__ */ Object.create(null)
  };
}
function getStorage(provider, prefix) {
  if (storage$1[provider] === void 0) {
    storage$1[provider] = /* @__PURE__ */ Object.create(null);
  }
  const providerStorage = storage$1[provider];
  if (providerStorage[prefix] === void 0) {
    providerStorage[prefix] = newStorage(provider, prefix);
  }
  return providerStorage[prefix];
}
function addIconSet(storage2, data2) {
  if (!quicklyValidateIconSet(data2)) {
    return [];
  }
  const t2 = Date.now();
  return parseIconSet(data2, (name, icon) => {
    if (icon) {
      storage2.icons[name] = icon;
    } else {
      storage2.missing[name] = t2;
    }
  });
}
function addIconToStorage(storage2, name, icon) {
  try {
    if (typeof icon.body === "string") {
      storage2.icons[name] = Object.freeze(fullIcon(icon));
      return true;
    }
  } catch (err) {
  }
  return false;
}
function getIconFromStorage(storage2, name) {
  const value = storage2.icons[name];
  return value === void 0 ? null : value;
}
function listIcons(provider, prefix) {
  let allIcons = [];
  let providers2;
  if (typeof provider === "string") {
    providers2 = [provider];
  } else {
    providers2 = Object.keys(storage$1);
  }
  providers2.forEach((provider2) => {
    let prefixes2;
    if (typeof provider2 === "string" && typeof prefix === "string") {
      prefixes2 = [prefix];
    } else {
      prefixes2 = storage$1[provider2] === void 0 ? [] : Object.keys(storage$1[provider2]);
    }
    prefixes2.forEach((prefix2) => {
      const storage2 = getStorage(provider2, prefix2);
      const icons = Object.keys(storage2.icons).map((name) => (provider2 !== "" ? "@" + provider2 + ":" : "") + prefix2 + ":" + name);
      allIcons = allIcons.concat(icons);
    });
  });
  return allIcons;
}
let simpleNames = false;
function allowSimpleNames(allow) {
  if (typeof allow === "boolean") {
    simpleNames = allow;
  }
  return simpleNames;
}
function getIconData(name) {
  const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
  return icon ? getIconFromStorage(getStorage(icon.provider, icon.prefix), icon.name) : null;
}
function addIcon(name, data2) {
  const icon = stringToIcon(name, true, simpleNames);
  if (!icon) {
    return false;
  }
  const storage2 = getStorage(icon.provider, icon.prefix);
  return addIconToStorage(storage2, icon.name, data2);
}
function addCollection(data2, provider) {
  if (typeof data2 !== "object") {
    return false;
  }
  if (typeof provider !== "string") {
    provider = typeof data2.provider === "string" ? data2.provider : "";
  }
  if (simpleNames && provider === "" && (typeof data2.prefix !== "string" || data2.prefix === "")) {
    let added = false;
    if (quicklyValidateIconSet(data2)) {
      data2.prefix = "";
      parseIconSet(data2, (name, icon) => {
        if (icon && addIcon(name, icon)) {
          added = true;
        }
      });
    }
    return added;
  }
  if (typeof data2.prefix !== "string" || !validateIcon({
    provider,
    prefix: data2.prefix,
    name: "a"
  })) {
    return false;
  }
  const storage2 = getStorage(provider, data2.prefix);
  return !!addIconSet(storage2, data2);
}
function iconExists(name) {
  return getIconData(name) !== null;
}
function getIcon(name) {
  const result = getIconData(name);
  return result ? __spreadValues({}, result) : null;
}
const defaults$4 = Object.freeze({
  inline: false,
  width: null,
  height: null,
  hAlign: "center",
  vAlign: "middle",
  slice: false,
  hFlip: false,
  vFlip: false,
  rotate: 0
});
function mergeCustomisations(defaults2, item) {
  const result = {};
  for (const key in defaults2) {
    const attr = key;
    result[attr] = defaults2[attr];
    if (item[attr] === void 0) {
      continue;
    }
    const value = item[attr];
    switch (attr) {
      case "inline":
      case "slice":
        if (typeof value === "boolean") {
          result[attr] = value;
        }
        break;
      case "hFlip":
      case "vFlip":
        if (value === true) {
          result[attr] = !result[attr];
        }
        break;
      case "hAlign":
      case "vAlign":
        if (typeof value === "string" && value !== "") {
          result[attr] = value;
        }
        break;
      case "width":
      case "height":
        if (typeof value === "string" && value !== "" || typeof value === "number" && value || value === null) {
          result[attr] = value;
        }
        break;
      case "rotate":
        if (typeof value === "number") {
          result[attr] += value;
        }
        break;
    }
  }
  return result;
}
const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size2, ratio, precision) {
  if (ratio === 1) {
    return size2;
  }
  precision = precision === void 0 ? 100 : precision;
  if (typeof size2 === "number") {
    return Math.ceil(size2 * ratio * precision) / precision;
  }
  if (typeof size2 !== "string") {
    return size2;
  }
  const oldParts = size2.split(unitsSplit);
  if (oldParts === null || !oldParts.length) {
    return size2;
  }
  const newParts = [];
  let code2 = oldParts.shift();
  let isNumber2 = unitsTest.test(code2);
  while (true) {
    if (isNumber2) {
      const num = parseFloat(code2);
      if (isNaN(num)) {
        newParts.push(code2);
      } else {
        newParts.push(Math.ceil(num * ratio * precision) / precision);
      }
    } else {
      newParts.push(code2);
    }
    code2 = oldParts.shift();
    if (code2 === void 0) {
      return newParts.join("");
    }
    isNumber2 = !isNumber2;
  }
}
function preserveAspectRatio(props) {
  let result = "";
  switch (props.hAlign) {
    case "left":
      result += "xMin";
      break;
    case "right":
      result += "xMax";
      break;
    default:
      result += "xMid";
  }
  switch (props.vAlign) {
    case "top":
      result += "YMin";
      break;
    case "bottom":
      result += "YMax";
      break;
    default:
      result += "YMid";
  }
  result += props.slice ? " slice" : " meet";
  return result;
}
function iconToSVG(icon, customisations) {
  const box = {
    left: icon.left,
    top: icon.top,
    width: icon.width,
    height: icon.height
  };
  let body = icon.body;
  [icon, customisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) {
      if (vFlip) {
        rotation += 2;
      } else {
        transformations.push("translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")");
        transformations.push("scale(-1 1)");
        box.top = box.left = 0;
      }
    } else if (vFlip) {
      transformations.push("translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")");
      transformations.push("scale(1 -1)");
      box.top = box.left = 0;
    }
    let tempValue;
    if (rotation < 0) {
      rotation -= Math.floor(rotation / 4) * 4;
    }
    rotation = rotation % 4;
    switch (rotation) {
      case 1:
        tempValue = box.height / 2 + box.top;
        transformations.unshift("rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")");
        break;
      case 2:
        transformations.unshift("rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")");
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift("rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")");
        break;
    }
    if (rotation % 2 === 1) {
      if (box.left !== 0 || box.top !== 0) {
        tempValue = box.left;
        box.left = box.top;
        box.top = tempValue;
      }
      if (box.width !== box.height) {
        tempValue = box.width;
        box.width = box.height;
        box.height = tempValue;
      }
    }
    if (transformations.length) {
      body = '<g transform="' + transformations.join(" ") + '">' + body + "</g>";
    }
  });
  let width, height;
  if (customisations.width === null && customisations.height === null) {
    height = "1em";
    width = calculateSize(height, box.width / box.height);
  } else if (customisations.width !== null && customisations.height !== null) {
    width = customisations.width;
    height = customisations.height;
  } else if (customisations.height !== null) {
    height = customisations.height;
    width = calculateSize(height, box.width / box.height);
  } else {
    width = customisations.width;
    height = calculateSize(width, box.height / box.width);
  }
  if (width === "auto") {
    width = box.width;
  }
  if (height === "auto") {
    height = box.height;
  }
  width = typeof width === "string" ? width : width.toString() + "";
  height = typeof height === "string" ? height : height.toString() + "";
  const result = {
    attributes: {
      width,
      height,
      preserveAspectRatio: preserveAspectRatio(customisations),
      viewBox: box.left.toString() + " " + box.top.toString() + " " + box.width.toString() + " " + box.height.toString()
    },
    body
  };
  if (customisations.inline) {
    result.inline = true;
  }
  return result;
}
function buildIcon(icon, customisations) {
  return iconToSVG(fullIcon(icon), customisations ? mergeCustomisations(defaults$4, customisations) : defaults$4);
}
const regex = /\sid="(\S+)"/g;
const randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
let counter = 0;
function replaceIDs(body, prefix = randomPrefix) {
  const ids = [];
  let match;
  while (match = regex.exec(body)) {
    ids.push(match[1]);
  }
  if (!ids.length) {
    return body;
  }
  ids.forEach((id) => {
    const newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
    const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"), "$1" + newID + "$3");
  });
  return body;
}
const cacheVersion = "iconify2";
const cachePrefix = "iconify";
const countKey = cachePrefix + "-count";
const versionKey = cachePrefix + "-version";
const hour = 36e5;
const cacheExpiration = 168;
const config = {
  local: true,
  session: true
};
let loaded = false;
const count = {
  local: 0,
  session: 0
};
const emptyList = {
  local: [],
  session: []
};
let _window = typeof window === "undefined" ? {} : window;
function getGlobal(key) {
  const attr = key + "Storage";
  try {
    if (_window && _window[attr] && typeof _window[attr].length === "number") {
      return _window[attr];
    }
  } catch (err) {
  }
  config[key] = false;
  return null;
}
function setCount(storage2, key, value) {
  try {
    storage2.setItem(countKey, value.toString());
    count[key] = value;
    return true;
  } catch (err) {
    return false;
  }
}
function getCount(storage2) {
  const count2 = storage2.getItem(countKey);
  if (count2) {
    const total = parseInt(count2);
    return total ? total : 0;
  }
  return 0;
}
function initCache(storage2, key) {
  try {
    storage2.setItem(versionKey, cacheVersion);
  } catch (err) {
  }
  setCount(storage2, key, 0);
}
function destroyCache(storage2) {
  try {
    const total = getCount(storage2);
    for (let i2 = 0; i2 < total; i2++) {
      storage2.removeItem(cachePrefix + i2.toString());
    }
  } catch (err) {
  }
}
const loadCache = () => {
  if (loaded) {
    return;
  }
  loaded = true;
  const minTime = Math.floor(Date.now() / hour) - cacheExpiration;
  function load(key) {
    const func = getGlobal(key);
    if (!func) {
      return;
    }
    const getItem = (index) => {
      const name = cachePrefix + index.toString();
      const item = func.getItem(name);
      if (typeof item !== "string") {
        return false;
      }
      let valid = true;
      try {
        const data2 = JSON.parse(item);
        if (typeof data2 !== "object" || typeof data2.cached !== "number" || data2.cached < minTime || typeof data2.provider !== "string" || typeof data2.data !== "object" || typeof data2.data.prefix !== "string") {
          valid = false;
        } else {
          const provider = data2.provider;
          const prefix = data2.data.prefix;
          const storage2 = getStorage(provider, prefix);
          valid = addIconSet(storage2, data2.data).length > 0;
        }
      } catch (err) {
        valid = false;
      }
      if (!valid) {
        func.removeItem(name);
      }
      return valid;
    };
    try {
      const version2 = func.getItem(versionKey);
      if (version2 !== cacheVersion) {
        if (version2) {
          destroyCache(func);
        }
        initCache(func, key);
        return;
      }
      let total = getCount(func);
      for (let i2 = total - 1; i2 >= 0; i2--) {
        if (!getItem(i2)) {
          if (i2 === total - 1) {
            total--;
          } else {
            emptyList[key].push(i2);
          }
        }
      }
      setCount(func, key, total);
    } catch (err) {
    }
  }
  for (const key in config) {
    load(key);
  }
};
const storeCache = (provider, data2) => {
  if (!loaded) {
    loadCache();
  }
  function store(key) {
    if (!config[key]) {
      return false;
    }
    const func = getGlobal(key);
    if (!func) {
      return false;
    }
    let index = emptyList[key].shift();
    if (index === void 0) {
      index = count[key];
      if (!setCount(func, key, index + 1)) {
        return false;
      }
    }
    try {
      const item = {
        cached: Math.floor(Date.now() / hour),
        provider,
        data: data2
      };
      func.setItem(cachePrefix + index.toString(), JSON.stringify(item));
    } catch (err) {
      return false;
    }
    return true;
  }
  if (!Object.keys(data2.icons).length) {
    return;
  }
  if (data2.not_found) {
    data2 = Object.assign({}, data2);
    delete data2.not_found;
  }
  if (!store("local")) {
    store("session");
  }
};
const cache = {};
function toggleBrowserCache(storage2, value) {
  switch (storage2) {
    case "local":
    case "session":
      config[storage2] = value;
      break;
    case "all":
      for (const key in config) {
        config[key] = value;
      }
      break;
  }
}
const storage = /* @__PURE__ */ Object.create(null);
function setAPIModule(provider, item) {
  storage[provider] = item;
}
function getAPIModule(provider) {
  return storage[provider] || storage[""];
}
function createAPIConfig(source3) {
  let resources2;
  if (typeof source3.resources === "string") {
    resources2 = [source3.resources];
  } else {
    resources2 = source3.resources;
    if (!(resources2 instanceof Array) || !resources2.length) {
      return null;
    }
  }
  const result = {
    resources: resources2,
    path: source3.path === void 0 ? "/" : source3.path,
    maxURL: source3.maxURL ? source3.maxURL : 500,
    rotate: source3.rotate ? source3.rotate : 750,
    timeout: source3.timeout ? source3.timeout : 5e3,
    random: source3.random === true,
    index: source3.index ? source3.index : 0,
    dataAfterTimeout: source3.dataAfterTimeout !== false
  };
  return result;
}
const configStorage = /* @__PURE__ */ Object.create(null);
const fallBackAPISources = [
  "https://api.simplesvg.com",
  "https://api.unisvg.com"
];
const fallBackAPI = [];
while (fallBackAPISources.length > 0) {
  if (fallBackAPISources.length === 1) {
    fallBackAPI.push(fallBackAPISources.shift());
  } else {
    if (Math.random() > 0.5) {
      fallBackAPI.push(fallBackAPISources.shift());
    } else {
      fallBackAPI.push(fallBackAPISources.pop());
    }
  }
}
configStorage[""] = createAPIConfig({
  resources: ["https://api.iconify.design"].concat(fallBackAPI)
});
function addAPIProvider(provider, customConfig) {
  const config2 = createAPIConfig(customConfig);
  if (config2 === null) {
    return false;
  }
  configStorage[provider] = config2;
  return true;
}
function getAPIConfig(provider) {
  return configStorage[provider];
}
function listAPIProviders() {
  return Object.keys(configStorage);
}
const mergeParams = (base2, params) => {
  let result = base2, hasParams = result.indexOf("?") !== -1;
  function paramToString(value) {
    switch (typeof value) {
      case "boolean":
        return value ? "true" : "false";
      case "number":
        return encodeURIComponent(value);
      case "string":
        return encodeURIComponent(value);
      default:
        throw new Error("Invalid parameter");
    }
  }
  Object.keys(params).forEach((key) => {
    let value;
    try {
      value = paramToString(params[key]);
    } catch (err) {
      return;
    }
    result += (hasParams ? "&" : "?") + encodeURIComponent(key) + "=" + value;
    hasParams = true;
  });
  return result;
};
const maxLengthCache = {};
const pathCache = {};
const detectFetch = () => {
  let callback2;
  try {
    callback2 = fetch;
    if (typeof callback2 === "function") {
      return callback2;
    }
  } catch (err) {
  }
  return null;
};
let fetchModule = detectFetch();
function setFetch(fetch2) {
  fetchModule = fetch2;
}
function getFetch() {
  return fetchModule;
}
function calculateMaxLength(provider, prefix) {
  const config2 = getAPIConfig(provider);
  if (!config2) {
    return 0;
  }
  let result;
  if (!config2.maxURL) {
    result = 0;
  } else {
    let maxHostLength = 0;
    config2.resources.forEach((item) => {
      const host = item;
      maxHostLength = Math.max(maxHostLength, host.length);
    });
    const url = mergeParams(prefix + ".json", {
      icons: ""
    });
    result = config2.maxURL - maxHostLength - config2.path.length - url.length;
  }
  const cacheKey = provider + ":" + prefix;
  pathCache[provider] = config2.path;
  maxLengthCache[cacheKey] = result;
  return result;
}
function shouldAbort(status) {
  return status === 404;
}
const prepare = (provider, prefix, icons) => {
  const results = [];
  let maxLength = maxLengthCache[prefix];
  if (maxLength === void 0) {
    maxLength = calculateMaxLength(provider, prefix);
  }
  const type = "icons";
  let item = {
    type,
    provider,
    prefix,
    icons: []
  };
  let length = 0;
  icons.forEach((name, index) => {
    length += name.length + 1;
    if (length >= maxLength && index > 0) {
      results.push(item);
      item = {
        type,
        provider,
        prefix,
        icons: []
      };
      length = name.length;
    }
    item.icons.push(name);
  });
  results.push(item);
  return results;
};
function getPath(provider) {
  if (typeof provider === "string") {
    if (pathCache[provider] === void 0) {
      const config2 = getAPIConfig(provider);
      if (!config2) {
        return "/";
      }
      pathCache[provider] = config2.path;
    }
    return pathCache[provider];
  }
  return "/";
}
const send = (host, params, callback2) => {
  if (!fetchModule) {
    callback2("abort", 424);
    return;
  }
  let path = getPath(params.provider);
  switch (params.type) {
    case "icons": {
      const prefix = params.prefix;
      const icons = params.icons;
      const iconsList = icons.join(",");
      path += mergeParams(prefix + ".json", {
        icons: iconsList
      });
      break;
    }
    case "custom": {
      const uri = params.uri;
      path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
      break;
    }
    default:
      callback2("abort", 400);
      return;
  }
  let defaultError = 503;
  fetchModule(host + path).then((response) => {
    const status = response.status;
    if (status !== 200) {
      setTimeout(() => {
        callback2(shouldAbort(status) ? "abort" : "next", status);
      });
      return;
    }
    defaultError = 501;
    return response.json();
  }).then((data2) => {
    if (typeof data2 !== "object" || data2 === null) {
      setTimeout(() => {
        callback2("next", defaultError);
      });
      return;
    }
    setTimeout(() => {
      callback2("success", data2);
    });
  }).catch(() => {
    callback2("next", defaultError);
  });
};
const fetchAPIModule = {
  prepare,
  send
};
function sortIcons(icons) {
  const result = {
    loaded: [],
    missing: [],
    pending: []
  };
  const storage2 = /* @__PURE__ */ Object.create(null);
  icons.sort((a2, b) => {
    if (a2.provider !== b.provider) {
      return a2.provider.localeCompare(b.provider);
    }
    if (a2.prefix !== b.prefix) {
      return a2.prefix.localeCompare(b.prefix);
    }
    return a2.name.localeCompare(b.name);
  });
  let lastIcon = {
    provider: "",
    prefix: "",
    name: ""
  };
  icons.forEach((icon) => {
    if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
      return;
    }
    lastIcon = icon;
    const provider = icon.provider;
    const prefix = icon.prefix;
    const name = icon.name;
    if (storage2[provider] === void 0) {
      storage2[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerStorage = storage2[provider];
    if (providerStorage[prefix] === void 0) {
      providerStorage[prefix] = getStorage(provider, prefix);
    }
    const localStorage = providerStorage[prefix];
    let list;
    if (localStorage.icons[name] !== void 0) {
      list = result.loaded;
    } else if (prefix === "" || localStorage.missing[name] !== void 0) {
      list = result.missing;
    } else {
      list = result.pending;
    }
    const item = {
      provider,
      prefix,
      name
    };
    list.push(item);
  });
  return result;
}
const callbacks = /* @__PURE__ */ Object.create(null);
const pendingUpdates = /* @__PURE__ */ Object.create(null);
function removeCallback(sources, id) {
  sources.forEach((source3) => {
    const provider = source3.provider;
    if (callbacks[provider] === void 0) {
      return;
    }
    const providerCallbacks = callbacks[provider];
    const prefix = source3.prefix;
    const items = providerCallbacks[prefix];
    if (items) {
      providerCallbacks[prefix] = items.filter((row) => row.id !== id);
    }
  });
}
function updateCallbacks(provider, prefix) {
  if (pendingUpdates[provider] === void 0) {
    pendingUpdates[provider] = /* @__PURE__ */ Object.create(null);
  }
  const providerPendingUpdates = pendingUpdates[provider];
  if (!providerPendingUpdates[prefix]) {
    providerPendingUpdates[prefix] = true;
    setTimeout(() => {
      providerPendingUpdates[prefix] = false;
      if (callbacks[provider] === void 0 || callbacks[provider][prefix] === void 0) {
        return;
      }
      const items = callbacks[provider][prefix].slice(0);
      if (!items.length) {
        return;
      }
      const storage2 = getStorage(provider, prefix);
      let hasPending = false;
      items.forEach((item) => {
        const icons = item.icons;
        const oldLength = icons.pending.length;
        icons.pending = icons.pending.filter((icon) => {
          if (icon.prefix !== prefix) {
            return true;
          }
          const name = icon.name;
          if (storage2.icons[name] !== void 0) {
            icons.loaded.push({
              provider,
              prefix,
              name
            });
          } else if (storage2.missing[name] !== void 0) {
            icons.missing.push({
              provider,
              prefix,
              name
            });
          } else {
            hasPending = true;
            return true;
          }
          return false;
        });
        if (icons.pending.length !== oldLength) {
          if (!hasPending) {
            removeCallback([
              {
                provider,
                prefix
              }
            ], item.id);
          }
          item.callback(icons.loaded.slice(0), icons.missing.slice(0), icons.pending.slice(0), item.abort);
        }
      });
    });
  }
}
let idCounter = 0;
function storeCallback(callback2, icons, pendingSources) {
  const id = idCounter++;
  const abort = removeCallback.bind(null, pendingSources, id);
  if (!icons.pending.length) {
    return abort;
  }
  const item = {
    id,
    icons,
    callback: callback2,
    abort
  };
  pendingSources.forEach((source3) => {
    const provider = source3.provider;
    const prefix = source3.prefix;
    if (callbacks[provider] === void 0) {
      callbacks[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerCallbacks = callbacks[provider];
    if (providerCallbacks[prefix] === void 0) {
      providerCallbacks[prefix] = [];
    }
    providerCallbacks[prefix].push(item);
  });
  return abort;
}
function listToIcons(list, validate = true, simpleNames2 = false) {
  const result = [];
  list.forEach((item) => {
    const icon = typeof item === "string" ? stringToIcon(item, false, simpleNames2) : item;
    if (!validate || validateIcon(icon, simpleNames2)) {
      result.push({
        provider: icon.provider,
        prefix: icon.prefix,
        name: icon.name
      });
    }
  });
  return result;
}
var defaultConfig = {
  resources: [],
  index: 0,
  timeout: 2e3,
  rotate: 750,
  random: false,
  dataAfterTimeout: false
};
function sendQuery(config2, payload, query, done) {
  const resourcesCount = config2.resources.length;
  const startIndex = config2.random ? Math.floor(Math.random() * resourcesCount) : config2.index;
  let resources2;
  if (config2.random) {
    let list = config2.resources.slice(0);
    resources2 = [];
    while (list.length > 1) {
      const nextIndex = Math.floor(Math.random() * list.length);
      resources2.push(list[nextIndex]);
      list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
    }
    resources2 = resources2.concat(list);
  } else {
    resources2 = config2.resources.slice(startIndex).concat(config2.resources.slice(0, startIndex));
  }
  const startTime = Date.now();
  let status = "pending";
  let queriesSent = 0;
  let lastError;
  let timer = null;
  let queue2 = [];
  let doneCallbacks = [];
  if (typeof done === "function") {
    doneCallbacks.push(done);
  }
  function resetTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function abort() {
    if (status === "pending") {
      status = "aborted";
    }
    resetTimer();
    queue2.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue2 = [];
  }
  function subscribe2(callback2, overwrite) {
    if (overwrite) {
      doneCallbacks = [];
    }
    if (typeof callback2 === "function") {
      doneCallbacks.push(callback2);
    }
  }
  function getQueryStatus() {
    return {
      startTime,
      payload,
      status,
      queriesSent,
      queriesPending: queue2.length,
      subscribe: subscribe2,
      abort
    };
  }
  function failQuery() {
    status = "failed";
    doneCallbacks.forEach((callback2) => {
      callback2(void 0, lastError);
    });
  }
  function clearQueue() {
    queue2.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue2 = [];
  }
  function moduleResponse(item, response, data2) {
    const isError = response !== "success";
    queue2 = queue2.filter((queued) => queued !== item);
    switch (status) {
      case "pending":
        break;
      case "failed":
        if (isError || !config2.dataAfterTimeout) {
          return;
        }
        break;
      default:
        return;
    }
    if (response === "abort") {
      lastError = data2;
      failQuery();
      return;
    }
    if (isError) {
      lastError = data2;
      if (!queue2.length) {
        if (!resources2.length) {
          failQuery();
        } else {
          execNext();
        }
      }
      return;
    }
    resetTimer();
    clearQueue();
    if (!config2.random) {
      const index = config2.resources.indexOf(item.resource);
      if (index !== -1 && index !== config2.index) {
        config2.index = index;
      }
    }
    status = "completed";
    doneCallbacks.forEach((callback2) => {
      callback2(data2);
    });
  }
  function execNext() {
    if (status !== "pending") {
      return;
    }
    resetTimer();
    const resource = resources2.shift();
    if (resource === void 0) {
      if (queue2.length) {
        timer = setTimeout(() => {
          resetTimer();
          if (status === "pending") {
            clearQueue();
            failQuery();
          }
        }, config2.timeout);
        return;
      }
      failQuery();
      return;
    }
    const item = {
      status: "pending",
      resource,
      callback: (status2, data2) => {
        moduleResponse(item, status2, data2);
      }
    };
    queue2.push(item);
    queriesSent++;
    timer = setTimeout(execNext, config2.rotate);
    query(resource, payload, item.callback);
  }
  setTimeout(execNext);
  return getQueryStatus;
}
function setConfig(config2) {
  if (typeof config2 !== "object" || typeof config2.resources !== "object" || !(config2.resources instanceof Array) || !config2.resources.length) {
    throw new Error("Invalid Reduncancy configuration");
  }
  const newConfig = /* @__PURE__ */ Object.create(null);
  let key;
  for (key in defaultConfig) {
    if (config2[key] !== void 0) {
      newConfig[key] = config2[key];
    } else {
      newConfig[key] = defaultConfig[key];
    }
  }
  return newConfig;
}
function initRedundancy(cfg) {
  const config2 = setConfig(cfg);
  let queries = [];
  function cleanup() {
    queries = queries.filter((item) => item().status === "pending");
  }
  function query(payload, queryCallback, doneCallback) {
    const query2 = sendQuery(config2, payload, queryCallback, (data2, error) => {
      cleanup();
      if (doneCallback) {
        doneCallback(data2, error);
      }
    });
    queries.push(query2);
    return query2;
  }
  function find(callback2) {
    const result = queries.find((value) => {
      return callback2(value);
    });
    return result !== void 0 ? result : null;
  }
  const instance = {
    query,
    find,
    setIndex: (index) => {
      config2.index = index;
    },
    getIndex: () => config2.index,
    cleanup
  };
  return instance;
}
function emptyCallback$1() {
}
const redundancyCache = /* @__PURE__ */ Object.create(null);
function getRedundancyCache(provider) {
  if (redundancyCache[provider] === void 0) {
    const config2 = getAPIConfig(provider);
    if (!config2) {
      return;
    }
    const redundancy = initRedundancy(config2);
    const cachedReundancy = {
      config: config2,
      redundancy
    };
    redundancyCache[provider] = cachedReundancy;
  }
  return redundancyCache[provider];
}
function sendAPIQuery(target, query, callback2) {
  let redundancy;
  let send2;
  if (typeof target === "string") {
    const api2 = getAPIModule(target);
    if (!api2) {
      callback2(void 0, 424);
      return emptyCallback$1;
    }
    send2 = api2.send;
    const cached = getRedundancyCache(target);
    if (cached) {
      redundancy = cached.redundancy;
    }
  } else {
    const config2 = createAPIConfig(target);
    if (config2) {
      redundancy = initRedundancy(config2);
      const moduleKey = target.resources ? target.resources[0] : "";
      const api2 = getAPIModule(moduleKey);
      if (api2) {
        send2 = api2.send;
      }
    }
  }
  if (!redundancy || !send2) {
    callback2(void 0, 424);
    return emptyCallback$1;
  }
  return redundancy.query(query, send2, callback2)().abort;
}
function emptyCallback() {
}
const pendingIcons = /* @__PURE__ */ Object.create(null);
const iconsToLoad = /* @__PURE__ */ Object.create(null);
const loaderFlags = /* @__PURE__ */ Object.create(null);
const queueFlags = /* @__PURE__ */ Object.create(null);
function loadedNewIcons(provider, prefix) {
  if (loaderFlags[provider] === void 0) {
    loaderFlags[provider] = /* @__PURE__ */ Object.create(null);
  }
  const providerLoaderFlags = loaderFlags[provider];
  if (!providerLoaderFlags[prefix]) {
    providerLoaderFlags[prefix] = true;
    setTimeout(() => {
      providerLoaderFlags[prefix] = false;
      updateCallbacks(provider, prefix);
    });
  }
}
const errorsCache = /* @__PURE__ */ Object.create(null);
function loadNewIcons(provider, prefix, icons) {
  function err() {
    const key = (provider === "" ? "" : "@" + provider + ":") + prefix;
    const time = Math.floor(Date.now() / 6e4);
    if (errorsCache[key] < time) {
      errorsCache[key] = time;
      console.error('Unable to retrieve icons for "' + key + '" because API is not configured properly.');
    }
  }
  if (iconsToLoad[provider] === void 0) {
    iconsToLoad[provider] = /* @__PURE__ */ Object.create(null);
  }
  const providerIconsToLoad = iconsToLoad[provider];
  if (queueFlags[provider] === void 0) {
    queueFlags[provider] = /* @__PURE__ */ Object.create(null);
  }
  const providerQueueFlags = queueFlags[provider];
  if (pendingIcons[provider] === void 0) {
    pendingIcons[provider] = /* @__PURE__ */ Object.create(null);
  }
  const providerPendingIcons = pendingIcons[provider];
  if (providerIconsToLoad[prefix] === void 0) {
    providerIconsToLoad[prefix] = icons;
  } else {
    providerIconsToLoad[prefix] = providerIconsToLoad[prefix].concat(icons).sort();
  }
  if (!providerQueueFlags[prefix]) {
    providerQueueFlags[prefix] = true;
    setTimeout(() => {
      providerQueueFlags[prefix] = false;
      const icons2 = providerIconsToLoad[prefix];
      delete providerIconsToLoad[prefix];
      const api2 = getAPIModule(provider);
      if (!api2) {
        err();
        return;
      }
      const params = api2.prepare(provider, prefix, icons2);
      params.forEach((item) => {
        sendAPIQuery(provider, item, (data2, error) => {
          const storage2 = getStorage(provider, prefix);
          if (typeof data2 !== "object") {
            if (error !== 404) {
              return;
            }
            const t2 = Date.now();
            item.icons.forEach((name) => {
              storage2.missing[name] = t2;
            });
          } else {
            try {
              const parsed = addIconSet(storage2, data2);
              if (!parsed.length) {
                return;
              }
              const pending = providerPendingIcons[prefix];
              parsed.forEach((name) => {
                delete pending[name];
              });
              if (cache.store) {
                cache.store(provider, data2);
              }
            } catch (err2) {
              console.error(err2);
            }
          }
          loadedNewIcons(provider, prefix);
        });
      });
    });
  }
}
const isPending = (icon) => {
  const provider = icon.provider;
  const prefix = icon.prefix;
  return pendingIcons[provider] && pendingIcons[provider][prefix] && pendingIcons[provider][prefix][icon.name] !== void 0;
};
const loadIcons = (icons, callback2) => {
  const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
  const sortedIcons = sortIcons(cleanedIcons);
  if (!sortedIcons.pending.length) {
    let callCallback = true;
    if (callback2) {
      setTimeout(() => {
        if (callCallback) {
          callback2(sortedIcons.loaded, sortedIcons.missing, sortedIcons.pending, emptyCallback);
        }
      });
    }
    return () => {
      callCallback = false;
    };
  }
  const newIcons = /* @__PURE__ */ Object.create(null);
  const sources = [];
  let lastProvider, lastPrefix;
  sortedIcons.pending.forEach((icon) => {
    const provider = icon.provider;
    const prefix = icon.prefix;
    if (prefix === lastPrefix && provider === lastProvider) {
      return;
    }
    lastProvider = provider;
    lastPrefix = prefix;
    sources.push({
      provider,
      prefix
    });
    if (pendingIcons[provider] === void 0) {
      pendingIcons[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerPendingIcons = pendingIcons[provider];
    if (providerPendingIcons[prefix] === void 0) {
      providerPendingIcons[prefix] = /* @__PURE__ */ Object.create(null);
    }
    if (newIcons[provider] === void 0) {
      newIcons[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerNewIcons = newIcons[provider];
    if (providerNewIcons[prefix] === void 0) {
      providerNewIcons[prefix] = [];
    }
  });
  const time = Date.now();
  sortedIcons.pending.forEach((icon) => {
    const provider = icon.provider;
    const prefix = icon.prefix;
    const name = icon.name;
    const pendingQueue = pendingIcons[provider][prefix];
    if (pendingQueue[name] === void 0) {
      pendingQueue[name] = time;
      newIcons[provider][prefix].push(name);
    }
  });
  sources.forEach((source3) => {
    const provider = source3.provider;
    const prefix = source3.prefix;
    if (newIcons[provider][prefix].length) {
      loadNewIcons(provider, prefix, newIcons[provider][prefix]);
    }
  });
  return callback2 ? storeCallback(callback2, sortedIcons, sources) : emptyCallback;
};
const loadIcon = (icon) => {
  return new Promise((fulfill, reject) => {
    const iconObj = typeof icon === "string" ? stringToIcon(icon) : icon;
    loadIcons([iconObj || icon], (loaded2) => {
      if (loaded2.length && iconObj) {
        const storage2 = getStorage(iconObj.provider, iconObj.prefix);
        const data2 = getIconFromStorage(storage2, iconObj.name);
        if (data2) {
          fulfill(data2);
          return;
        }
      }
      reject(icon);
    });
  });
};
const elementFinderProperty = "iconifyFinder" + Date.now();
const elementDataProperty = "iconifyData" + Date.now();
function renderIconInPlaceholder(placeholder, customisations, iconData, returnString) {
  let span;
  try {
    span = document.createElement("span");
  } catch (err) {
    return returnString ? "" : null;
  }
  const data2 = iconToSVG(iconData, mergeCustomisations(defaults$4, customisations));
  const placeholderElement = placeholder.element;
  const finder2 = placeholder.finder;
  const name = placeholder.name;
  const placeholderClassName = placeholderElement ? placeholderElement.getAttribute("class") : "";
  const filteredClassList = finder2 ? finder2.classFilter(placeholderClassName ? placeholderClassName.split(/\s+/) : []) : [];
  const className = "iconify iconify--" + name.prefix + (name.provider === "" ? "" : " iconify--" + name.provider) + (filteredClassList.length ? " " + filteredClassList.join(" ") : "");
  const html = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="' + className + '">' + replaceIDs(data2.body) + "</svg>";
  span.innerHTML = html;
  const svg = span.childNodes[0];
  const svgStyle = svg.style;
  const svgAttributes = data2.attributes;
  Object.keys(svgAttributes).forEach((attr) => {
    svg.setAttribute(attr, svgAttributes[attr]);
  });
  if (data2.inline) {
    svgStyle.verticalAlign = "-0.125em";
  }
  if (placeholderElement) {
    const placeholderAttributes = placeholderElement.attributes;
    for (let i2 = 0; i2 < placeholderAttributes.length; i2++) {
      const item = placeholderAttributes.item(i2);
      if (item) {
        const name2 = item.name;
        if (name2 !== "class" && name2 !== "style" && svgAttributes[name2] === void 0) {
          try {
            svg.setAttribute(name2, item.value);
          } catch (err) {
          }
        }
      }
    }
    const placeholderStyle = placeholderElement.style;
    for (let i2 = 0; i2 < placeholderStyle.length; i2++) {
      const attr = placeholderStyle[i2];
      svgStyle[attr] = placeholderStyle[attr];
    }
  }
  if (finder2) {
    const elementData = {
      name,
      status: "loaded",
      customisations
    };
    svg[elementDataProperty] = elementData;
    svg[elementFinderProperty] = finder2;
  }
  const result = returnString ? span.innerHTML : svg;
  if (placeholderElement && placeholderElement.parentNode) {
    placeholderElement.parentNode.replaceChild(svg, placeholderElement);
  } else {
    span.removeChild(svg);
  }
  return result;
}
let nodes = [];
function findRootNode(node) {
  for (let i2 = 0; i2 < nodes.length; i2++) {
    const item = nodes[i2];
    const root2 = typeof item.node === "function" ? item.node() : item.node;
    if (root2 === node) {
      return item;
    }
  }
}
function addRootNode(root2, autoRemove = false) {
  let node = findRootNode(root2);
  if (node) {
    if (node.temporary) {
      node.temporary = autoRemove;
    }
    return node;
  }
  node = {
    node: root2,
    temporary: autoRemove
  };
  nodes.push(node);
  return node;
}
function addBodyNode() {
  if (document.documentElement) {
    return addRootNode(document.documentElement);
  }
  nodes.push({
    node: () => {
      return document.documentElement;
    }
  });
}
function removeRootNode(root2) {
  nodes = nodes.filter((node) => {
    const element = typeof node.node === "function" ? node.node() : node.node;
    return root2 !== element;
  });
}
function listRootNodes() {
  return nodes;
}
function onReady(callback2) {
  const doc2 = document;
  if (doc2.readyState === "complete" || doc2.readyState !== "loading" && !doc2.documentElement.doScroll) {
    callback2();
  } else {
    doc2.addEventListener("DOMContentLoaded", callback2);
    window.addEventListener("load", callback2);
  }
}
let callback = null;
const observerParams = {
  childList: true,
  subtree: true,
  attributes: true
};
function queueScan(node) {
  if (!node.observer) {
    return;
  }
  const observer = node.observer;
  if (!observer.pendingScan) {
    observer.pendingScan = setTimeout(() => {
      delete observer.pendingScan;
      if (callback) {
        callback(node);
      }
    });
  }
}
function checkMutations(node, mutations) {
  if (!node.observer) {
    return;
  }
  const observer = node.observer;
  if (!observer.pendingScan) {
    for (let i2 = 0; i2 < mutations.length; i2++) {
      const item = mutations[i2];
      if (item.addedNodes && item.addedNodes.length > 0 || item.type === "attributes" && item.target[elementFinderProperty] !== void 0) {
        if (!observer.paused) {
          queueScan(node);
        }
        return;
      }
    }
  }
}
function continueObserving(node, root2) {
  node.observer.instance.observe(root2, observerParams);
}
function startObserver(node) {
  let observer = node.observer;
  if (observer && observer.instance) {
    return;
  }
  const root2 = typeof node.node === "function" ? node.node() : node.node;
  if (!root2) {
    return;
  }
  if (!observer) {
    observer = {
      paused: 0
    };
    node.observer = observer;
  }
  observer.instance = new MutationObserver(checkMutations.bind(null, node));
  continueObserving(node, root2);
  if (!observer.paused) {
    queueScan(node);
  }
}
function startObservers() {
  listRootNodes().forEach(startObserver);
}
function stopObserver(node) {
  if (!node.observer) {
    return;
  }
  const observer = node.observer;
  if (observer.pendingScan) {
    clearTimeout(observer.pendingScan);
    delete observer.pendingScan;
  }
  if (observer.instance) {
    observer.instance.disconnect();
    delete observer.instance;
  }
}
function initObserver(cb) {
  const isRestart = callback !== null;
  if (callback !== cb) {
    callback = cb;
    if (isRestart) {
      listRootNodes().forEach(stopObserver);
    }
  }
  if (isRestart) {
    startObservers();
    return;
  }
  onReady(startObservers);
}
function pauseObservingNode(node) {
  (node ? [node] : listRootNodes()).forEach((node2) => {
    if (!node2.observer) {
      node2.observer = {
        paused: 1
      };
      return;
    }
    const observer = node2.observer;
    observer.paused++;
    if (observer.paused > 1 || !observer.instance) {
      return;
    }
    const instance = observer.instance;
    instance.disconnect();
  });
}
function pauseObserver(root2) {
  if (root2) {
    const node = findRootNode(root2);
    if (node) {
      pauseObservingNode(node);
    }
  } else {
    pauseObservingNode();
  }
}
function resumeObservingNode(observer) {
  (observer ? [observer] : listRootNodes()).forEach((node) => {
    if (!node.observer) {
      startObserver(node);
      return;
    }
    const observer2 = node.observer;
    if (observer2.paused) {
      observer2.paused--;
      if (!observer2.paused) {
        const root2 = typeof node.node === "function" ? node.node() : node.node;
        if (!root2) {
          return;
        } else if (observer2.instance) {
          continueObserving(node, root2);
        } else {
          startObserver(node);
        }
      }
    }
  });
}
function resumeObserver(root2) {
  if (root2) {
    const node = findRootNode(root2);
    if (node) {
      resumeObservingNode(node);
    }
  } else {
    resumeObservingNode();
  }
}
function observe(root2, autoRemove = false) {
  const node = addRootNode(root2, autoRemove);
  startObserver(node);
  return node;
}
function stopObserving(root2) {
  const node = findRootNode(root2);
  if (node) {
    stopObserver(node);
    removeRootNode(root2);
  }
}
const finders = [];
function addFinder(finder2) {
  if (finders.indexOf(finder2) === -1) {
    finders.push(finder2);
  }
}
function cleanIconName(name) {
  if (typeof name === "string") {
    name = stringToIcon(name);
  }
  return name === null || !validateIcon(name) ? null : name;
}
function compareCustomisations(list1, list2) {
  const keys1 = Object.keys(list1);
  const keys2 = Object.keys(list2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let i2 = 0; i2 < keys1.length; i2++) {
    const key = keys1[i2];
    if (list2[key] !== list1[key]) {
      return false;
    }
  }
  return true;
}
function findPlaceholders(root2) {
  const results = [];
  finders.forEach((finder2) => {
    const elements2 = finder2.find(root2);
    Array.prototype.forEach.call(elements2, (item) => {
      const element = item;
      if (element[elementFinderProperty] !== void 0 && element[elementFinderProperty] !== finder2) {
        return;
      }
      const name = cleanIconName(finder2.name(element));
      if (name === null) {
        return;
      }
      element[elementFinderProperty] = finder2;
      const placeholder = {
        element,
        finder: finder2,
        name
      };
      results.push(placeholder);
    });
  });
  const elements = root2.querySelectorAll("svg.iconify");
  Array.prototype.forEach.call(elements, (item) => {
    const element = item;
    const finder2 = element[elementFinderProperty];
    const data2 = element[elementDataProperty];
    if (!finder2 || !data2) {
      return;
    }
    const name = cleanIconName(finder2.name(element));
    if (name === null) {
      return;
    }
    let updated = false;
    let customisations;
    if (name.prefix !== data2.name.prefix || name.name !== data2.name.name) {
      updated = true;
    } else {
      customisations = finder2.customisations(element);
      if (!compareCustomisations(data2.customisations, customisations)) {
        updated = true;
      }
    }
    if (updated) {
      const placeholder = {
        element,
        finder: finder2,
        name,
        customisations
      };
      results.push(placeholder);
    }
  });
  return results;
}
let scanQueued = false;
function checkPendingIcons() {
  if (!scanQueued) {
    scanQueued = true;
    setTimeout(() => {
      if (scanQueued) {
        scanQueued = false;
        scanDOM();
      }
    });
  }
}
const compareIcons = (icon1, icon2) => {
  return icon1 !== null && icon2 !== null && icon1.name === icon2.name && icon1.prefix === icon2.prefix;
};
function scanElement(root2) {
  const node = findRootNode(root2);
  if (!node) {
    scanDOM({
      node: root2,
      temporary: true
    }, true);
  } else {
    scanDOM(node);
  }
}
function scanDOM(node, addTempNode = false) {
  scanQueued = false;
  const iconsToLoad2 = /* @__PURE__ */ Object.create(null);
  (node ? [node] : listRootNodes()).forEach((node2) => {
    const root2 = typeof node2.node === "function" ? node2.node() : node2.node;
    if (!root2 || !root2.querySelectorAll) {
      return;
    }
    let hasPlaceholders = false;
    let paused = false;
    findPlaceholders(root2).forEach((item) => {
      const element = item.element;
      const iconName = item.name;
      const provider = iconName.provider;
      const prefix = iconName.prefix;
      const name = iconName.name;
      let data2 = element[elementDataProperty];
      if (data2 !== void 0 && compareIcons(data2.name, iconName)) {
        switch (data2.status) {
          case "missing":
            return;
          case "loading":
            if (isPending({
              provider,
              prefix,
              name
            })) {
              hasPlaceholders = true;
              return;
            }
        }
      }
      const storage2 = getStorage(provider, prefix);
      if (storage2.icons[name] !== void 0) {
        if (!paused && node2.observer) {
          pauseObservingNode(node2);
          paused = true;
        }
        const customisations = item.customisations !== void 0 ? item.customisations : item.finder.customisations(element);
        renderIconInPlaceholder(item, customisations, getIconFromStorage(storage2, name));
        return;
      }
      if (storage2.missing[name]) {
        data2 = {
          name: iconName,
          status: "missing",
          customisations: {}
        };
        element[elementDataProperty] = data2;
        return;
      }
      if (!isPending({ provider, prefix, name })) {
        if (iconsToLoad2[provider] === void 0) {
          iconsToLoad2[provider] = /* @__PURE__ */ Object.create(null);
        }
        const providerIconsToLoad = iconsToLoad2[provider];
        if (providerIconsToLoad[prefix] === void 0) {
          providerIconsToLoad[prefix] = /* @__PURE__ */ Object.create(null);
        }
        providerIconsToLoad[prefix][name] = true;
      }
      data2 = {
        name: iconName,
        status: "loading",
        customisations: {}
      };
      element[elementDataProperty] = data2;
      hasPlaceholders = true;
    });
    if (node2.temporary && !hasPlaceholders) {
      stopObserving(root2);
    } else if (addTempNode && hasPlaceholders) {
      observe(root2, true);
    } else if (paused && node2.observer) {
      resumeObservingNode(node2);
    }
  });
  Object.keys(iconsToLoad2).forEach((provider) => {
    const providerIconsToLoad = iconsToLoad2[provider];
    Object.keys(providerIconsToLoad).forEach((prefix) => {
      loadIcons(Object.keys(providerIconsToLoad[prefix]).map((name) => {
        const icon = {
          provider,
          prefix,
          name
        };
        return icon;
      }), checkPendingIcons);
    });
  });
}
function rotateFromString(value, defaultValue = 0) {
  const units = value.replace(/^-?[0-9.]*/, "");
  function cleanup(value2) {
    while (value2 < 0) {
      value2 += 4;
    }
    return value2 % 4;
  }
  if (units === "") {
    const num = parseInt(value);
    return isNaN(num) ? 0 : cleanup(num);
  } else if (units !== value) {
    let split = 0;
    switch (units) {
      case "%":
        split = 25;
        break;
      case "deg":
        split = 90;
    }
    if (split) {
      let num = parseFloat(value.slice(0, value.length - units.length));
      if (isNaN(num)) {
        return 0;
      }
      num = num / split;
      return num % 1 === 0 ? cleanup(num) : 0;
    }
  }
  return defaultValue;
}
const separator = /[\s,]+/;
function flipFromString(custom, flip) {
  flip.split(separator).forEach((str) => {
    const value = str.trim();
    switch (value) {
      case "horizontal":
        custom.hFlip = true;
        break;
      case "vertical":
        custom.vFlip = true;
        break;
    }
  });
}
function alignmentFromString(custom, align) {
  align.split(separator).forEach((str) => {
    const value = str.trim();
    switch (value) {
      case "left":
      case "center":
      case "right":
        custom.hAlign = value;
        break;
      case "top":
      case "middle":
      case "bottom":
        custom.vAlign = value;
        break;
      case "slice":
      case "crop":
        custom.slice = true;
        break;
      case "meet":
        custom.slice = false;
    }
  });
}
function hasAttribute(element, key) {
  return element.hasAttribute(key);
}
function getAttribute(element, key) {
  return element.getAttribute(key);
}
function getBooleanAttribute(element, key) {
  const value = element.getAttribute(key);
  if (value === key || value === "true") {
    return true;
  }
  if (value === "" || value === "false") {
    return false;
  }
  return null;
}
const booleanAttributes = [
  "inline",
  "hFlip",
  "vFlip"
];
const stringAttributes = [
  "width",
  "height"
];
const mainClass = "iconify";
const inlineClass = "iconify-inline";
const selector = "i." + mainClass + ", span." + mainClass + ", i." + inlineClass + ", span." + inlineClass;
const finder = {
  find: (root2) => root2.querySelectorAll(selector),
  name: (element) => {
    if (hasAttribute(element, "data-icon")) {
      return getAttribute(element, "data-icon");
    }
    return null;
  },
  customisations: (element, defaultValues = {
    inline: false
  }) => {
    const result = defaultValues;
    const className = element.getAttribute("class");
    const classList = className ? className.split(/\s+/) : [];
    if (classList.indexOf(inlineClass) !== -1) {
      result.inline = true;
    }
    if (hasAttribute(element, "data-rotate")) {
      const value = rotateFromString(getAttribute(element, "data-rotate"));
      if (value) {
        result.rotate = value;
      }
    }
    if (hasAttribute(element, "data-flip")) {
      flipFromString(result, getAttribute(element, "data-flip"));
    }
    if (hasAttribute(element, "data-align")) {
      alignmentFromString(result, getAttribute(element, "data-align"));
    }
    booleanAttributes.forEach((attr) => {
      if (hasAttribute(element, "data-" + attr)) {
        const value = getBooleanAttribute(element, "data-" + attr);
        if (typeof value === "boolean") {
          result[attr] = value;
        }
      }
    });
    stringAttributes.forEach((attr) => {
      if (hasAttribute(element, "data-" + attr)) {
        const value = getAttribute(element, "data-" + attr);
        if (value !== "") {
          result[attr] = value;
        }
      }
    });
    return result;
  },
  classFilter: (classList) => {
    const result = [];
    classList.forEach((className) => {
      if (className !== "iconify" && className !== "" && className.slice(0, 9) !== "iconify--") {
        result.push(className);
      }
    });
    return result;
  }
};
function generateIcon(name, customisations, returnString) {
  const iconData = getIconData(name);
  if (!iconData) {
    return null;
  }
  const iconName = stringToIcon(name);
  const changes = mergeCustomisations(defaults$4, typeof customisations === "object" ? customisations : {});
  return renderIconInPlaceholder({
    name: iconName
  }, changes, iconData, returnString);
}
function getVersion() {
  return "2.2.1";
}
function renderSVG(name, customisations) {
  return generateIcon(name, customisations, false);
}
function renderHTML(name, customisations) {
  return generateIcon(name, customisations, true);
}
function renderIcon(name, customisations) {
  const iconData = getIconData(name);
  if (!iconData) {
    return null;
  }
  const changes = mergeCustomisations(defaults$4, typeof customisations === "object" ? customisations : {});
  return iconToSVG(iconData, changes);
}
function scan(root2) {
  if (root2) {
    scanElement(root2);
  } else {
    scanDOM();
  }
}
if (typeof document !== "undefined" && typeof window !== "undefined") {
  addBodyNode();
  addFinder(finder);
  const _window2 = window;
  if (_window2.IconifyPreload !== void 0) {
    const preload2 = _window2.IconifyPreload;
    const err = "Invalid IconifyPreload syntax.";
    if (typeof preload2 === "object" && preload2 !== null) {
      (preload2 instanceof Array ? preload2 : [preload2]).forEach((item) => {
        try {
          if (typeof item !== "object" || item === null || item instanceof Array || typeof item.icons !== "object" || typeof item.prefix !== "string" || !addCollection(item)) {
            console.error(err);
          }
        } catch (e2) {
          console.error(err);
        }
      });
    }
  }
  setTimeout(() => {
    initObserver(scanDOM);
    scanDOM();
  });
}
function enableCache(storage2, enable) {
  toggleBrowserCache(storage2, enable !== false);
}
function disableCache(storage2) {
  toggleBrowserCache(storage2, true);
}
setAPIModule("", fetchAPIModule);
if (typeof document !== "undefined" && typeof window !== "undefined") {
  cache.store = storeCache;
  loadCache();
  const _window2 = window;
  if (_window2.IconifyProviders !== void 0) {
    const providers2 = _window2.IconifyProviders;
    if (typeof providers2 === "object" && providers2 !== null) {
      for (const key in providers2) {
        const err = "IconifyProviders[" + key + "] is invalid.";
        try {
          const value = providers2[key];
          if (typeof value !== "object" || !value || value.resources === void 0) {
            continue;
          }
          if (!addAPIProvider(key, value)) {
            console.error(err);
          }
        } catch (e2) {
          console.error(err);
        }
      }
    }
  }
}
const _api = {
  getAPIConfig,
  setAPIModule,
  sendAPIQuery,
  setFetch,
  getFetch,
  listAPIProviders,
  mergeParams
};
const Iconify$1 = {
  _api,
  addAPIProvider,
  loadIcons,
  loadIcon,
  iconExists,
  getIcon,
  listIcons,
  addIcon,
  addCollection,
  shareStorage,
  replaceIDs,
  calculateSize,
  buildIcon,
  getVersion,
  renderSVG,
  renderHTML,
  renderIcon,
  scan,
  observe,
  stopObserving,
  pauseObserver,
  resumeObserver,
  enableCache,
  disableCache
};
try {
  if (self.Iconify === void 0) {
    self.Iconify = Iconify$1;
  }
} catch (err) {
}
const Iconify = Iconify$1.default || Iconify$1;
const collections = JSON.parse('[{"prefix":"feather","width":24,"height":24,"icons":{"activity":{"body":"<path fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\" d=\\"M22 12h-4l-3 9L9 3l-3 9H2\\"/>"},"bell":{"body":"<path fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\" d=\\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9m-4.27 13a2 2 0 0 1-3.46 0\\"/>"},"calendar":{"body":"<g fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\"><rect width=\\"18\\" height=\\"18\\" x=\\"3\\" y=\\"4\\" rx=\\"2\\" ry=\\"2\\"/><path d=\\"M16 2v4M8 2v4m-5 4h18\\"/></g>"},"check":{"body":"<path fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\" d=\\"M20 6L9 17l-5-5\\"/>"},"chevron-down":{"body":"<path fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\" d=\\"m6 9l6 6l6-6\\"/>"},"chevron-left":{"body":"<path fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\" d=\\"m15 18l-6-6l6-6\\"/>"},"chevron-right":{"body":"<path fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\" d=\\"m9 18l6-6l-6-6\\"/>"},"github":{"body":"<path fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\" d=\\"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77A5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22\\"/>"},"home":{"body":"<g fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\"><path d=\\"m3 9l9-7l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\\"/><path d=\\"M9 22V12h6v10\\"/></g>"},"link":{"body":"<g fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\"><path d=\\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\\"/><path d=\\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\\"/></g>"},"lock":{"body":"<g fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\"><rect width=\\"18\\" height=\\"11\\" x=\\"3\\" y=\\"11\\" rx=\\"2\\" ry=\\"2\\"/><path d=\\"M7 11V7a5 5 0 0 1 10 0v4\\"/></g>"},"log-out":{"body":"<path fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\" d=\\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5l-5-5m5 5H9\\"/>"},"mail":{"body":"<g fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\"><path d=\\"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z\\"/><path d=\\"m22 6l-10 7L2 6\\"/></g>"},"moon":{"body":"<path fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\" d=\\"M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79z\\"/>"},"more-vertical":{"body":"<g fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"1\\"/><circle cx=\\"12\\" cy=\\"5\\" r=\\"1\\"/><circle cx=\\"12\\" cy=\\"19\\" r=\\"1\\"/></g>"},"plus":{"body":"<path fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\" d=\\"M12 5v14m-7-7h14\\"/>"},"search":{"body":"<g fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\"><circle cx=\\"11\\" cy=\\"11\\" r=\\"8\\"/><path d=\\"m21 21l-4.35-4.35\\"/></g>"},"settings":{"body":"<g fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"3\\"/><path d=\\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2a2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2a2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\\"/></g>"},"sun":{"body":"<g fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"5\\"/><path d=\\"M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42\\"/></g>"},"user":{"body":"<g fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\"><path d=\\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\\"/><circle cx=\\"12\\" cy=\\"7\\" r=\\"4\\"/></g>"},"x":{"body":"<path fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\" d=\\"M18 6L6 18M6 6l12 12\\"/>"}}},{"prefix":"fa-brands","width":448,"height":512,"icons":{"amazon":{"body":"<path fill=\\"currentColor\\" d=\\"M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5c0 109.5 138.3 114 183.5 43.2c6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32C140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5c40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2c0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31c-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2c-10.8 1-13 2-14-.3c-2.3-5.7 21.7-15.5 37.5-17.5c15.7-1.8 41-.8 46 5.7c3.7 5.1 0 27.1-6.5 43.1z\\"/>"},"dribbble":{"body":"<path fill=\\"currentColor\\" d=\\"M256 8C119.252 8 8 119.252 8 256s111.252 248 248 248s248-111.252 248-248S392.748 8 256 8zm163.97 114.366c29.503 36.046 47.369 81.957 47.835 131.955c-6.984-1.477-77.018-15.682-147.502-6.818c-5.752-14.041-11.181-26.393-18.617-41.614c78.321-31.977 113.818-77.482 118.284-83.523zM396.421 97.87c-3.81 5.427-35.697 48.286-111.021 76.519c-34.712-63.776-73.185-116.168-79.04-124.008c67.176-16.193 137.966 1.27 190.061 47.489zm-230.48-33.25c5.585 7.659 43.438 60.116 78.537 122.509c-99.087 26.313-186.36 25.934-195.834 25.809C62.38 147.205 106.678 92.573 165.941 64.62zM44.17 256.323c0-2.166.043-4.322.108-6.473c9.268.19 111.92 1.513 217.706-30.146c6.064 11.868 11.857 23.915 17.174 35.949c-76.599 21.575-146.194 83.527-180.531 142.306C64.794 360.405 44.17 310.73 44.17 256.323zm81.807 167.113c22.127-45.233 82.178-103.622 167.579-132.756c29.74 77.283 42.039 142.053 45.189 160.638c-68.112 29.013-150.015 21.053-212.768-27.882zm248.38 8.489c-2.171-12.886-13.446-74.897-41.152-151.033c66.38-10.626 124.7 6.768 131.947 9.055c-9.442 58.941-43.273 109.844-90.795 141.978z\\"/>","width":512},"facebook-f":{"body":"<path fill=\\"currentColor\\" d=\\"m279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z\\"/>","width":320},"github-alt":{"body":"<path fill=\\"currentColor\\" d=\\"M186.1 328.7c0 20.9-10.9 55.1-36.7 55.1s-36.7-34.2-36.7-55.1s10.9-55.1 36.7-55.1s36.7 34.2 36.7 55.1zM480 278.2c0 31.9-3.2 65.7-17.5 95c-37.9 76.6-142.1 74.8-216.7 74.8c-75.8 0-186.2 2.7-225.6-74.8c-14.6-29-20.2-63.1-20.2-95c0-41.9 13.9-81.5 41.5-113.6c-5.2-15.8-7.7-32.4-7.7-48.8c0-21.5 4.9-32.3 14.6-51.8c45.3 0 74.3 9 108.8 36c29-6.9 58.8-10 88.7-10c27 0 54.2 2.9 80.4 9.2c34-26.7 63-35.2 107.8-35.2c9.8 19.5 14.6 30.3 14.6 51.8c0 16.4-2.6 32.7-7.7 48.2c27.5 32.4 39 72.3 39 114.2zm-64.3 50.5c0-43.9-26.7-82.6-73.5-82.6c-18.9 0-37 3.4-56 6c-14.9 2.3-29.8 3.2-45.1 3.2c-15.2 0-30.1-.9-45.1-3.2c-18.7-2.6-37-6-56-6c-46.8 0-73.5 38.7-73.5 82.6c0 87.8 80.4 101.3 150.4 101.3h48.2c70.3 0 150.6-13.4 150.6-101.3zm-82.6-55.1c-25.8 0-36.7 34.2-36.7 55.1s10.9 55.1 36.7 55.1s36.7-34.2 36.7-55.1s-10.9-55.1-36.7-55.1z\\"/>","width":480},"google-plus-g":{"body":"<path fill=\\"currentColor\\" d=\\"M386.061 228.496c1.834 9.692 3.143 19.384 3.143 31.956C389.204 370.205 315.599 448 204.8 448c-106.084 0-192-85.915-192-192s85.916-192 192-192c51.864 0 95.083 18.859 128.611 50.292l-52.126 50.03c-14.145-13.621-39.028-29.599-76.485-29.599c-65.484 0-118.92 54.221-118.92 121.277c0 67.056 53.436 121.277 118.92 121.277c75.961 0 104.513-54.745 108.965-82.773H204.8v-66.009h181.261zm185.406 6.437V179.2h-56.001v55.733h-55.733v56.001h55.733v55.733h56.001v-55.733H627.2v-56.001h-55.733z\\"/>","width":640},"instagram":{"body":"<path fill=\\"currentColor\\" d=\\"M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9S287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7s74.7 33.5 74.7 74.7s-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8c-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8s26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9c-26.2-26.2-58-34.4-93.9-36.2c-37-2.1-147.9-2.1-184.9 0c-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9c1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0c35.9-1.7 67.7-9.9 93.9-36.2c26.2-26.2 34.4-58 36.2-93.9c2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6c-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6c-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6c29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6c11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z\\"/>"},"invision":{"body":"<path fill=\\"currentColor\\" d=\\"M407.4 32H40.6C18.2 32 0 50.2 0 72.6v366.8C0 461.8 18.2 480 40.6 480h366.8c22.4 0 40.6-18.2 40.6-40.6V72.6c0-22.4-18.2-40.6-40.6-40.6zM176.1 145.6c.4 23.4-22.4 27.3-26.6 27.4c-14.9 0-27.1-12-27.1-27c.1-35.2 53.1-35.5 53.7-.4zM332.8 377c-65.6 0-34.1-74-25-106.6c14.1-46.4-45.2-59-59.9.7l-25.8 103.3H177l8.1-32.5c-31.5 51.8-94.6 44.4-94.6-4.3c.1-14.3.9-14 23-104.1H81.7l9.7-35.6h76.4c-33.6 133.7-32.6 126.9-32.9 138.2c0 20.9 40.9 13.5 57.4-23.2l19.8-79.4h-32.3l9.7-35.6h68.8l-8.9 40.5c40.5-75.5 127.9-47.8 101.8 38c-14.2 51.1-14.6 50.7-14.9 58.8c0 15.5 17.5 22.6 31.8-16.9L386 325c-10.5 36.7-29.4 52-53.2 52z\\"/>"},"linkedin-in":{"body":"<path fill=\\"currentColor\\" d=\\"M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2c-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3c94 0 111.28 61.9 111.28 142.3V448z\\"/>"},"reddit-alien":{"body":"<path fill=\\"currentColor\\" d=\\"M440.3 203.5c-15 0-28.2 6.2-37.9 15.9c-35.7-24.7-83.8-40.6-137.1-42.3L293 52.3l88.2 19.8c0 21.6 17.6 39.2 39.2 39.2c22 0 39.7-18.1 39.7-39.7s-17.6-39.7-39.7-39.7c-15.4 0-28.7 9.3-35.3 22l-97.4-21.6c-4.9-1.3-9.7 2.2-11 7.1L246.3 177c-52.9 2.2-100.5 18.1-136.3 42.8c-9.7-10.1-23.4-16.3-38.4-16.3c-55.6 0-73.8 74.6-22.9 100.1c-1.8 7.9-2.6 16.3-2.6 24.7c0 83.8 94.4 151.7 210.3 151.7c116.4 0 210.8-67.9 210.8-151.7c0-8.4-.9-17.2-3.1-25.1c49.9-25.6 31.5-99.7-23.8-99.7zM129.4 308.9c0-22 17.6-39.7 39.7-39.7c21.6 0 39.2 17.6 39.2 39.7c0 21.6-17.6 39.2-39.2 39.2c-22 .1-39.7-17.6-39.7-39.2zm214.3 93.5c-36.4 36.4-139.1 36.4-175.5 0c-4-3.5-4-9.7 0-13.7c3.5-3.5 9.7-3.5 13.2 0c27.8 28.5 120 29 149 0c3.5-3.5 9.7-3.5 13.2 0c4.1 4 4.1 10.2.1 13.7zm-.8-54.2c-21.6 0-39.2-17.6-39.2-39.2c0-22 17.6-39.7 39.2-39.7c22 0 39.7 17.6 39.7 39.7c-.1 21.5-17.7 39.2-39.7 39.2z\\"/>","width":512},"tumblr":{"body":"<path fill=\\"currentColor\\" d=\\"M309.8 480.3c-13.6 14.5-50 31.7-97.4 31.7c-120.8 0-147-88.8-147-140.6v-144H17.9c-5.5 0-10-4.5-10-10v-68c0-7.2 4.5-13.6 11.3-16c62-21.8 81.5-76 84.3-117.1c.8-11 6.5-16.3 16.1-16.3h70.9c5.5 0 10 4.5 10 10v115.2h83c5.5 0 10 4.4 10 9.9v81.7c0 5.5-4.5 10-10 10h-83.4V360c0 34.2 23.7 53.6 68 35.8c4.8-1.9 9-3.2 12.7-2.2c3.5.9 5.8 3.4 7.4 7.9l22 64.3c1.8 5 3.3 10.6-.4 14.5z\\"/>","width":320},"twitter":{"body":"<path fill=\\"currentColor\\" d=\\"M459.37 151.716c.325 4.548.325 9.097.325 13.645c0 138.72-105.583 298.558-298.558 298.558c-59.452 0-114.68-17.219-161.137-47.106c8.447.974 16.568 1.299 25.34 1.299c49.055 0 94.213-16.568 130.274-44.832c-46.132-.975-84.792-31.188-98.112-72.772c6.498.974 12.995 1.624 19.818 1.624c9.421 0 18.843-1.3 27.614-3.573c-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319c-28.264-18.843-46.781-51.005-46.781-87.391c0-19.492 5.197-37.36 14.294-52.954c51.655 63.675 129.3 105.258 216.365 109.807c-1.624-7.797-2.599-15.918-2.599-24.04c0-57.828 46.782-104.934 104.934-104.934c30.213 0 57.502 12.67 76.67 33.137c23.715-4.548 46.456-13.32 66.599-25.34c-7.798 24.366-24.366 44.833-46.132 57.827c21.117-2.273 41.584-8.122 60.426-16.243c-14.292 20.791-32.161 39.308-52.628 54.253z\\"/>","width":512},"youtube":{"body":"<path fill=\\"currentColor\\" d=\\"M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597c-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821c11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205l-142.739 81.201z\\"/>","width":576}}},{"prefix":"fa","width":1536,"height":1536,"icons":{"angle-down":{"body":"<path fill=\\"currentColor\\" d=\\"M1011 480q0 13-10 23L535 969q-10 10-23 10t-23-10L23 503q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393l393-393q10-10 23-10t23 10l50 50q10 10 10 23z\\"/>","width":1024,"height":1280},"angle-up":{"body":"<path fill=\\"currentColor\\" d=\\"M1011 928q0 13-10 23l-50 50q-10 10-23 10t-23-10L512 608l-393 393q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l466 466q10 10 10 23z\\"/>","width":1024,"height":1280},"sort":{"body":"<path fill=\\"currentColor\\" d=\\"M1024 896q0 26-19 45l-448 448q-19 19-45 19t-45-19L19 941Q0 922 0 896t19-45t45-19h896q26 0 45 19t19 45zm0-384q0 26-19 45t-45 19H64q-26 0-45-19T0 512t19-45L467 19q19-19 45-19t45 19l448 448q19 19 19 45z\\"/>","width":1024,"height":1408},"sort-asc":{"body":"<path fill=\\"currentColor\\" d=\\"M1024 512q0 26-19 45t-45 19H64q-26 0-45-19T0 512t19-45L467 19q19-19 45-19t45 19l448 448q19 19 19 45z\\"/>","width":1024,"height":1344}}},{"prefix":"ion","width":512,"height":512,"icons":{"reload-outline":{"body":"<path fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-miterlimit=\\"10\\" stroke-width=\\"32\\" d=\\"m400 148l-21.12-24.57A191.43 191.43 0 0 0 240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 0 0 181.07-128\\"/><path fill=\\"currentColor\\" d=\\"M464 97.42V208a16 16 0 0 1-16 16H337.42c-14.26 0-21.4-17.23-11.32-27.31L436.69 86.1C446.77 76 464 83.16 464 97.42Z\\"/>"}}}]');
collections.forEach((c2) => Iconify.addCollection(c2));
var nprogress = "";
var _default$1 = "";
var _default = "";
var simplebar = "";
var tinySlider = "";
var notyf_min = "";
var tippy = "";
var svgArrow = "";
var border = "";
var backdrop = "";
var light = "";
var main = "";
var axios$2 = { exports: {} };
var bind$2 = function bind(fn, thisArg) {
  return function wrap2() {
    var args = new Array(arguments.length);
    for (var i2 = 0; i2 < args.length; i2++) {
      args[i2] = arguments[i2];
    }
    return fn.apply(thisArg, args);
  };
};
var bind$1 = bind$2;
var toString = Object.prototype.toString;
function isArray(val) {
  return Array.isArray(val);
}
function isUndefined(val) {
  return typeof val === "undefined";
}
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
}
function isArrayBuffer(val) {
  return toString.call(val) === "[object ArrayBuffer]";
}
function isFormData(val) {
  return toString.call(val) === "[object FormData]";
}
function isArrayBufferView(val) {
  var result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
function isString(val) {
  return typeof val === "string";
}
function isNumber(val) {
  return typeof val === "number";
}
function isObject(val) {
  return val !== null && typeof val === "object";
}
function isPlainObject(val) {
  if (toString.call(val) !== "[object Object]") {
    return false;
  }
  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}
function isDate(val) {
  return toString.call(val) === "[object Date]";
}
function isFile(val) {
  return toString.call(val) === "[object File]";
}
function isBlob(val) {
  return toString.call(val) === "[object Blob]";
}
function isFunction(val) {
  return toString.call(val) === "[object Function]";
}
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}
function isURLSearchParams(val) {
  return toString.call(val) === "[object URLSearchParams]";
}
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
}
function isStandardBrowserEnv() {
  if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
    return false;
  }
  return typeof window !== "undefined" && typeof document !== "undefined";
}
function forEach(obj, fn) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (var i2 = 0, l = obj.length; i2 < l; i2++) {
      fn.call(null, obj[i2], i2, obj);
    }
  } else {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
function merge() {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }
  for (var i2 = 0, l = arguments.length; i2 < l; i2++) {
    forEach(arguments[i2], assignValue);
  }
  return result;
}
function extend(a2, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === "function") {
      a2[key] = bind$1(val, thisArg);
    } else {
      a2[key] = val;
    }
  });
  return a2;
}
function stripBOM(content) {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
}
var utils$e = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isFunction,
  isStream,
  isURLSearchParams,
  isStandardBrowserEnv,
  forEach,
  merge,
  extend,
  trim,
  stripBOM
};
var utils$d = utils$e;
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
var buildURL$2 = function buildURL(url, params, paramsSerializer) {
  if (!params) {
    return url;
  }
  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils$d.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];
    utils$d.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === "undefined") {
        return;
      }
      if (utils$d.isArray(val)) {
        key = key + "[]";
      } else {
        val = [val];
      }
      utils$d.forEach(val, function parseValue2(v2) {
        if (utils$d.isDate(v2)) {
          v2 = v2.toISOString();
        } else if (utils$d.isObject(v2)) {
          v2 = JSON.stringify(v2);
        }
        parts.push(encode(key) + "=" + encode(v2));
      });
    });
    serializedParams = parts.join("&");
  }
  if (serializedParams) {
    var hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
};
var utils$c = utils$e;
function InterceptorManager$1() {
  this.handlers = [];
}
InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled,
    rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};
InterceptorManager$1.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
InterceptorManager$1.prototype.forEach = function forEach2(fn) {
  utils$c.forEach(this.handlers, function forEachHandler(h2) {
    if (h2 !== null) {
      fn(h2);
    }
  });
};
var InterceptorManager_1 = InterceptorManager$1;
var utils$b = utils$e;
var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
  utils$b.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};
var enhanceError$2 = function enhanceError(error, config2, code2, request2, response) {
  error.config = config2;
  if (code2) {
    error.code = code2;
  }
  error.request = request2;
  error.response = response;
  error.isAxiosError = true;
  error.toJSON = function toJSON() {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};
var transitional = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
var enhanceError$1 = enhanceError$2;
var createError$2 = function createError(message, config2, code2, request2, response) {
  var error = new Error(message);
  return enhanceError$1(error, config2, code2, request2, response);
};
var createError$1 = createError$2;
var settle$1 = function settle(resolve2, reject, response) {
  var validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve2(response);
  } else {
    reject(createError$1("Request failed with status code " + response.status, response.config, null, response.request, response));
  }
};
var utils$a = utils$e;
var cookies$1 = utils$a.isStandardBrowserEnv() ? function standardBrowserEnv() {
  return {
    write: function write(name, value, expires, path, domain, secure) {
      var cookie = [];
      cookie.push(name + "=" + encodeURIComponent(value));
      if (utils$a.isNumber(expires)) {
        cookie.push("expires=" + new Date(expires).toGMTString());
      }
      if (utils$a.isString(path)) {
        cookie.push("path=" + path);
      }
      if (utils$a.isString(domain)) {
        cookie.push("domain=" + domain);
      }
      if (secure === true) {
        cookie.push("secure");
      }
      document.cookie = cookie.join("; ");
    },
    read: function read(name) {
      var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove: function remove2(name) {
      this.write(name, "", Date.now() - 864e5);
    }
  };
}() : function nonStandardBrowserEnv() {
  return {
    write: function write() {
    },
    read: function read() {
      return null;
    },
    remove: function remove2() {
    }
  };
}();
var isAbsoluteURL$1 = function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};
var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
};
var isAbsoluteURL2 = isAbsoluteURL$1;
var combineURLs2 = combineURLs$1;
var buildFullPath$1 = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL2(requestedURL)) {
    return combineURLs2(baseURL, requestedURL);
  }
  return requestedURL;
};
var utils$9 = utils$e;
var ignoreDuplicateOf = [
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
];
var parseHeaders$1 = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i2;
  if (!headers) {
    return parsed;
  }
  utils$9.forEach(headers.split("\n"), function parser(line) {
    i2 = line.indexOf(":");
    key = utils$9.trim(line.substr(0, i2)).toLowerCase();
    val = utils$9.trim(line.substr(i2 + 1));
    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === "set-cookie") {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    }
  });
  return parsed;
};
var utils$8 = utils$e;
var isURLSameOrigin$1 = utils$8.isStandardBrowserEnv() ? function standardBrowserEnv2() {
  var msie = /(msie|trident)/i.test(navigator.userAgent);
  var urlParsingNode = document.createElement("a");
  var originURL;
  function resolveURL(url) {
    var href = url;
    if (msie) {
      urlParsingNode.setAttribute("href", href);
      href = urlParsingNode.href;
    }
    urlParsingNode.setAttribute("href", href);
    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
    };
  }
  originURL = resolveURL(window.location.href);
  return function isURLSameOrigin2(requestURL) {
    var parsed = utils$8.isString(requestURL) ? resolveURL(requestURL) : requestURL;
    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
  };
}() : function nonStandardBrowserEnv2() {
  return function isURLSameOrigin2() {
    return true;
  };
}();
function Cancel$3(message) {
  this.message = message;
}
Cancel$3.prototype.toString = function toString2() {
  return "Cancel" + (this.message ? ": " + this.message : "");
};
Cancel$3.prototype.__CANCEL__ = true;
var Cancel_1 = Cancel$3;
var utils$7 = utils$e;
var settle2 = settle$1;
var cookies = cookies$1;
var buildURL$1 = buildURL$2;
var buildFullPath2 = buildFullPath$1;
var parseHeaders2 = parseHeaders$1;
var isURLSameOrigin = isURLSameOrigin$1;
var createError2 = createError$2;
var transitionalDefaults$1 = transitional;
var Cancel$2 = Cancel_1;
var xhr = function xhrAdapter(config2) {
  return new Promise(function dispatchXhrRequest(resolve2, reject) {
    var requestData = config2.data;
    var requestHeaders = config2.headers;
    var responseType = config2.responseType;
    var onCanceled;
    function done() {
      if (config2.cancelToken) {
        config2.cancelToken.unsubscribe(onCanceled);
      }
      if (config2.signal) {
        config2.signal.removeEventListener("abort", onCanceled);
      }
    }
    if (utils$7.isFormData(requestData)) {
      delete requestHeaders["Content-Type"];
    }
    var request2 = new XMLHttpRequest();
    if (config2.auth) {
      var username = config2.auth.username || "";
      var password = config2.auth.password ? unescape(encodeURIComponent(config2.auth.password)) : "";
      requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
    }
    var fullPath = buildFullPath2(config2.baseURL, config2.url);
    request2.open(config2.method.toUpperCase(), buildURL$1(fullPath, config2.params, config2.paramsSerializer), true);
    request2.timeout = config2.timeout;
    function onloadend() {
      if (!request2) {
        return;
      }
      var responseHeaders = "getAllResponseHeaders" in request2 ? parseHeaders2(request2.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === "text" || responseType === "json" ? request2.responseText : request2.response;
      var response = {
        data: responseData,
        status: request2.status,
        statusText: request2.statusText,
        headers: responseHeaders,
        config: config2,
        request: request2
      };
      settle2(function _resolve(value) {
        resolve2(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request2 = null;
    }
    if ("onloadend" in request2) {
      request2.onloadend = onloadend;
    } else {
      request2.onreadystatechange = function handleLoad() {
        if (!request2 || request2.readyState !== 4) {
          return;
        }
        if (request2.status === 0 && !(request2.responseURL && request2.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request2.onabort = function handleAbort() {
      if (!request2) {
        return;
      }
      reject(createError2("Request aborted", config2, "ECONNABORTED", request2));
      request2 = null;
    };
    request2.onerror = function handleError2() {
      reject(createError2("Network Error", config2, null, request2));
      request2 = null;
    };
    request2.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config2.timeout ? "timeout of " + config2.timeout + "ms exceeded" : "timeout exceeded";
      var transitional3 = config2.transitional || transitionalDefaults$1;
      if (config2.timeoutErrorMessage) {
        timeoutErrorMessage = config2.timeoutErrorMessage;
      }
      reject(createError2(timeoutErrorMessage, config2, transitional3.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED", request2));
      request2 = null;
    };
    if (utils$7.isStandardBrowserEnv()) {
      var xsrfValue = (config2.withCredentials || isURLSameOrigin(fullPath)) && config2.xsrfCookieName ? cookies.read(config2.xsrfCookieName) : void 0;
      if (xsrfValue) {
        requestHeaders[config2.xsrfHeaderName] = xsrfValue;
      }
    }
    if ("setRequestHeader" in request2) {
      utils$7.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
          delete requestHeaders[key];
        } else {
          request2.setRequestHeader(key, val);
        }
      });
    }
    if (!utils$7.isUndefined(config2.withCredentials)) {
      request2.withCredentials = !!config2.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request2.responseType = config2.responseType;
    }
    if (typeof config2.onDownloadProgress === "function") {
      request2.addEventListener("progress", config2.onDownloadProgress);
    }
    if (typeof config2.onUploadProgress === "function" && request2.upload) {
      request2.upload.addEventListener("progress", config2.onUploadProgress);
    }
    if (config2.cancelToken || config2.signal) {
      onCanceled = function(cancel) {
        if (!request2) {
          return;
        }
        reject(!cancel || cancel && cancel.type ? new Cancel$2("canceled") : cancel);
        request2.abort();
        request2 = null;
      };
      config2.cancelToken && config2.cancelToken.subscribe(onCanceled);
      if (config2.signal) {
        config2.signal.aborted ? onCanceled() : config2.signal.addEventListener("abort", onCanceled);
      }
    }
    if (!requestData) {
      requestData = null;
    }
    request2.send(requestData);
  });
};
var utils$6 = utils$e;
var normalizeHeaderName2 = normalizeHeaderName$1;
var enhanceError2 = enhanceError$2;
var transitionalDefaults = transitional;
var DEFAULT_CONTENT_TYPE = {
  "Content-Type": "application/x-www-form-urlencoded"
};
function setContentTypeIfUnset(headers, value) {
  if (!utils$6.isUndefined(headers) && utils$6.isUndefined(headers["Content-Type"])) {
    headers["Content-Type"] = value;
  }
}
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== "undefined") {
    adapter = xhr;
  } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
    adapter = xhr;
  }
  return adapter;
}
function stringifySafely(rawValue, parser, encoder) {
  if (utils$6.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$6.trim(rawValue);
    } catch (e2) {
      if (e2.name !== "SyntaxError") {
        throw e2;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
var defaults$3 = {
  transitional: transitionalDefaults,
  adapter: getDefaultAdapter(),
  transformRequest: [function transformRequest(data2, headers) {
    normalizeHeaderName2(headers, "Accept");
    normalizeHeaderName2(headers, "Content-Type");
    if (utils$6.isFormData(data2) || utils$6.isArrayBuffer(data2) || utils$6.isBuffer(data2) || utils$6.isStream(data2) || utils$6.isFile(data2) || utils$6.isBlob(data2)) {
      return data2;
    }
    if (utils$6.isArrayBufferView(data2)) {
      return data2.buffer;
    }
    if (utils$6.isURLSearchParams(data2)) {
      setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
      return data2.toString();
    }
    if (utils$6.isObject(data2) || headers && headers["Content-Type"] === "application/json") {
      setContentTypeIfUnset(headers, "application/json");
      return stringifySafely(data2);
    }
    return data2;
  }],
  transformResponse: [function transformResponse(data2) {
    var transitional3 = this.transitional || defaults$3.transitional;
    var silentJSONParsing = transitional3 && transitional3.silentJSONParsing;
    var forcedJSONParsing = transitional3 && transitional3.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
    if (strictJSONParsing || forcedJSONParsing && utils$6.isString(data2) && data2.length) {
      try {
        return JSON.parse(data2);
      } catch (e2) {
        if (strictJSONParsing) {
          if (e2.name === "SyntaxError") {
            throw enhanceError2(e2, this, "E_JSON_PARSE");
          }
          throw e2;
        }
      }
    }
    return data2;
  }],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*"
    }
  }
};
utils$6.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
  defaults$3.headers[method] = {};
});
utils$6.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  defaults$3.headers[method] = utils$6.merge(DEFAULT_CONTENT_TYPE);
});
var defaults_1 = defaults$3;
var utils$5 = utils$e;
var defaults$2 = defaults_1;
var transformData$1 = function transformData(data2, headers, fns) {
  var context = this || defaults$2;
  utils$5.forEach(fns, function transform(fn) {
    data2 = fn.call(context, data2, headers);
  });
  return data2;
};
var isCancel$1 = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};
var utils$4 = utils$e;
var transformData2 = transformData$1;
var isCancel2 = isCancel$1;
var defaults$1 = defaults_1;
var Cancel$1 = Cancel_1;
function throwIfCancellationRequested(config2) {
  if (config2.cancelToken) {
    config2.cancelToken.throwIfRequested();
  }
  if (config2.signal && config2.signal.aborted) {
    throw new Cancel$1("canceled");
  }
}
var dispatchRequest$1 = function dispatchRequest(config2) {
  throwIfCancellationRequested(config2);
  config2.headers = config2.headers || {};
  config2.data = transformData2.call(config2, config2.data, config2.headers, config2.transformRequest);
  config2.headers = utils$4.merge(config2.headers.common || {}, config2.headers[config2.method] || {}, config2.headers);
  utils$4.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function cleanHeaderConfig(method) {
    delete config2.headers[method];
  });
  var adapter = config2.adapter || defaults$1.adapter;
  return adapter(config2).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config2);
    response.data = transformData2.call(config2, response.data, response.headers, config2.transformResponse);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel2(reason)) {
      throwIfCancellationRequested(config2);
      if (reason && reason.response) {
        reason.response.data = transformData2.call(config2, reason.response.data, reason.response.headers, config2.transformResponse);
      }
    }
    return Promise.reject(reason);
  });
};
var utils$3 = utils$e;
var mergeConfig$2 = function mergeConfig(config1, config2) {
  config2 = config2 || {};
  var config3 = {};
  function getMergedValue(target, source3) {
    if (utils$3.isPlainObject(target) && utils$3.isPlainObject(source3)) {
      return utils$3.merge(target, source3);
    } else if (utils$3.isPlainObject(source3)) {
      return utils$3.merge({}, source3);
    } else if (utils$3.isArray(source3)) {
      return source3.slice();
    }
    return source3;
  }
  function mergeDeepProperties(prop) {
    if (!utils$3.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils$3.isUndefined(config1[prop])) {
      return getMergedValue(void 0, config1[prop]);
    }
  }
  function valueFromConfig2(prop) {
    if (!utils$3.isUndefined(config2[prop])) {
      return getMergedValue(void 0, config2[prop]);
    }
  }
  function defaultToConfig2(prop) {
    if (!utils$3.isUndefined(config2[prop])) {
      return getMergedValue(void 0, config2[prop]);
    } else if (!utils$3.isUndefined(config1[prop])) {
      return getMergedValue(void 0, config1[prop]);
    }
  }
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(void 0, config1[prop]);
    }
  }
  var mergeMap = {
    "url": valueFromConfig2,
    "method": valueFromConfig2,
    "data": valueFromConfig2,
    "baseURL": defaultToConfig2,
    "transformRequest": defaultToConfig2,
    "transformResponse": defaultToConfig2,
    "paramsSerializer": defaultToConfig2,
    "timeout": defaultToConfig2,
    "timeoutMessage": defaultToConfig2,
    "withCredentials": defaultToConfig2,
    "adapter": defaultToConfig2,
    "responseType": defaultToConfig2,
    "xsrfCookieName": defaultToConfig2,
    "xsrfHeaderName": defaultToConfig2,
    "onUploadProgress": defaultToConfig2,
    "onDownloadProgress": defaultToConfig2,
    "decompress": defaultToConfig2,
    "maxContentLength": defaultToConfig2,
    "maxBodyLength": defaultToConfig2,
    "transport": defaultToConfig2,
    "httpAgent": defaultToConfig2,
    "httpsAgent": defaultToConfig2,
    "cancelToken": defaultToConfig2,
    "socketPath": defaultToConfig2,
    "responseEncoding": defaultToConfig2,
    "validateStatus": mergeDirectKeys
  };
  utils$3.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge2 = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge2(prop);
    utils$3.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config3[prop] = configValue);
  });
  return config3;
};
var data = {
  "version": "0.26.1"
};
var VERSION = data.version;
var validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i2) {
  validators$1[type] = function validator2(thing) {
    return typeof thing === type || "a" + (i2 < 1 ? "n " : " ") + type;
  };
});
var deprecatedWarnings = {};
validators$1.transitional = function transitional2(validator2, version2, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return function(value, opt, opts) {
    if (validator2 === false) {
      throw new Error(formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")));
    }
    if (version2 && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(formatMessage(opt, " has been deprecated since v" + version2 + " and will be removed in the near future"));
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new TypeError("options must be an object");
  }
  var keys = Object.keys(options);
  var i2 = keys.length;
  while (i2-- > 0) {
    var opt = keys[i2];
    var validator2 = schema[opt];
    if (validator2) {
      var value = options[opt];
      var result = value === void 0 || validator2(value, opt, options);
      if (result !== true) {
        throw new TypeError("option " + opt + " must be " + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error("Unknown option " + opt);
    }
  }
}
var validator$1 = {
  assertOptions,
  validators: validators$1
};
var utils$2 = utils$e;
var buildURL2 = buildURL$2;
var InterceptorManager = InterceptorManager_1;
var dispatchRequest2 = dispatchRequest$1;
var mergeConfig$1 = mergeConfig$2;
var validator = validator$1;
var validators = validator.validators;
function Axios$1(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
Axios$1.prototype.request = function request(configOrUrl, config2) {
  if (typeof configOrUrl === "string") {
    config2 = config2 || {};
    config2.url = configOrUrl;
  } else {
    config2 = configOrUrl || {};
  }
  config2 = mergeConfig$1(this.defaults, config2);
  if (config2.method) {
    config2.method = config2.method.toLowerCase();
  } else if (this.defaults.method) {
    config2.method = this.defaults.method.toLowerCase();
  } else {
    config2.method = "get";
  }
  var transitional3 = config2.transitional;
  if (transitional3 !== void 0) {
    validator.assertOptions(transitional3, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config2) === false) {
      return;
    }
    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });
  var promise;
  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest2, void 0];
    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);
    promise = Promise.resolve(config2);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }
    return promise;
  }
  var newConfig = config2;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }
  try {
    promise = dispatchRequest2(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }
  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }
  return promise;
};
Axios$1.prototype.getUri = function getUri(config2) {
  config2 = mergeConfig$1(this.defaults, config2);
  return buildURL2(config2.url, config2.params, config2.paramsSerializer).replace(/^\?/, "");
};
utils$2.forEach(["delete", "get", "head", "options"], function forEachMethodNoData2(method) {
  Axios$1.prototype[method] = function(url, config2) {
    return this.request(mergeConfig$1(config2 || {}, {
      method,
      url,
      data: (config2 || {}).data
    }));
  };
});
utils$2.forEach(["post", "put", "patch"], function forEachMethodWithData2(method) {
  Axios$1.prototype[method] = function(url, data2, config2) {
    return this.request(mergeConfig$1(config2 || {}, {
      method,
      url,
      data: data2
    }));
  };
});
var Axios_1 = Axios$1;
var Cancel = Cancel_1;
function CancelToken(executor) {
  if (typeof executor !== "function") {
    throw new TypeError("executor must be a function.");
  }
  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve2) {
    resolvePromise = resolve2;
  });
  var token = this;
  this.promise.then(function(cancel) {
    if (!token._listeners)
      return;
    var i2;
    var l = token._listeners.length;
    for (i2 = 0; i2 < l; i2++) {
      token._listeners[i2](cancel);
    }
    token._listeners = null;
  });
  this.promise.then = function(onfulfilled) {
    var _resolve;
    var promise = new Promise(function(resolve2) {
      token.subscribe(resolve2);
      _resolve = resolve2;
    }).then(onfulfilled);
    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };
    return promise;
  };
  executor(function cancel(message) {
    if (token.reason) {
      return;
    }
    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};
CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }
  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};
CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};
CancelToken.source = function source2() {
  var cancel;
  var token = new CancelToken(function executor(c2) {
    cancel = c2;
  });
  return {
    token,
    cancel
  };
};
var CancelToken_1 = CancelToken;
var spread = function spread2(callback2) {
  return function wrap2(arr) {
    return callback2.apply(null, arr);
  };
};
var utils$1 = utils$e;
var isAxiosError = function isAxiosError2(payload) {
  return utils$1.isObject(payload) && payload.isAxiosError === true;
};
var utils = utils$e;
var bind2 = bind$2;
var Axios = Axios_1;
var mergeConfig2 = mergeConfig$2;
var defaults = defaults_1;
function createInstance(defaultConfig2) {
  var context = new Axios(defaultConfig2);
  var instance = bind2(Axios.prototype.request, context);
  utils.extend(instance, Axios.prototype, context);
  utils.extend(instance, context);
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig2(defaultConfig2, instanceConfig));
  };
  return instance;
}
var axios$1 = createInstance(defaults);
axios$1.Axios = Axios;
axios$1.Cancel = Cancel_1;
axios$1.CancelToken = CancelToken_1;
axios$1.isCancel = isCancel$1;
axios$1.VERSION = data.version;
axios$1.all = function all(promises) {
  return Promise.all(promises);
};
axios$1.spread = spread;
axios$1.isAxiosError = isAxiosError;
axios$2.exports = axios$1;
axios$2.exports.default = axios$1;
var axios = axios$2.exports;
const useUserSession = defineStore("userSession", () => {
  const token = useStorage("token", "");
  const user = ref();
  const loading = ref(true);
  const isLoggedIn = computed(() => token.value !== void 0 && token.value !== "");
  function setUser(newUser) {
    user.value = newUser;
  }
  function setToken(newToken) {
    token.value = newToken;
  }
  function setLoading(newLoading) {
    loading.value = newLoading;
  }
  async function logoutUser() {
    token.value = void 0;
    user.value = void 0;
  }
  return {
    user,
    token,
    isLoggedIn,
    loading,
    logoutUser,
    setUser,
    setToken,
    setLoading
  };
});
let api;
function createApi() {
  api = axios.create({
    baseURL: "http://localhost:8080"
  });
  api.interceptors.request.use((config2) => {
    const userSession = useUserSession();
    if (userSession.isLoggedIn) {
      config2.headers = __spreadProps(__spreadValues({}, config2.headers), {
        Authorization: `Bearer ${userSession.token}`
      });
    }
    return config2;
  });
  return api;
}
const plugins = { "./plugins/directives.ts": () => true ? __vitePreload(() => import("./directives.3025c27f.js"), []) : null, "./plugins/i18n.ts": () => true ? __vitePreload(() => import("./i18n.ceff1229.js"), []) : null, "./plugins/naviguation-guards.ts": () => true ? __vitePreload(() => import("./naviguation-guards.aa4c10f3.js"), ["assets/naviguation-guards.aa4c10f3.js","assets/useNotyf.057d9f71.js"]) : null, "./plugins/nprogress.ts": () => true ? __vitePreload(() => import("./nprogress.e9f302a4.js"), []) : null, "./plugins/v-calendar.ts": () => true ? __vitePreload(() => import("./v-calendar.15aa7c3c.js"), ["assets/v-calendar.15aa7c3c.js","assets/v-calendar.639d3d78.css"]) : null, "./plugins/vue-tippy.ts": () => true ? __vitePreload(() => import("./vue-tippy.093c1b80.js"), []) : null, "./plugins/vueform.ts": () => true ? __vitePreload(() => import("./vueform.075ca24c.js"), []) : null };
function definePlugin(plugin) {
  return plugin;
}
async function createApp() {
  const app = createApp$1(_sfc_main);
  const router = createRouter();
  const api2 = createApi();
  const head = createHead();
  app.use(head);
  const pinia = createPinia();
  app.use(pinia);
  const vuero = {
    app,
    api: api2,
    router,
    head,
    pinia
  };
  app.provide("vuero", vuero);
  for (const path in plugins) {
    try {
      const { default: plugin } = await plugins[path]();
      await plugin(vuero);
    } catch (error) {
      console.error(`Error while loading plugin "${path}".`);
      console.error(error);
    }
  }
  app.use(vuero.router);
  return vuero;
}
createApp().then(async (vuero) => {
  await vuero.router.isReady();
  vuero.app.mount("#app");
});
export { vModelRadio as $, defineComponent as A, ref as B, onMounted as C, nextTick as D, watch as E, Fragment as F, unref as G, onUnmounted as H, isRef as I, isReactive as J, getCurrentInstance as K, isVNode$1 as L, render as M, defineAsyncComponent as N, useRoute as O, useI18n as P, useHead as Q, _sfc_main$c as R, START_LOCATION_NORMALIZED as S, Transition as T, _sfc_main$i as U, _export_sfc as V, defineStore as W, useDarkmode as X, withKeys as Y, withDirectives as Z, __vitePreload as _, useUserSession as a, __unplugin_components_0 as a0, createStaticVNode as a1, watchPostEffect as a2, resolveDynamicComponent as a3, onClickOutside as a4, watchEffect as a5, normalizeProps as a6, guardReactiveProps as a7, toHandlers as a8, toRef as a9, warn$1 as aa, provide as ab, inject as ac, onBeforeUnmount as ad, markRaw as ae, readonly as af, vModelCheckbox as ag, pushScopeId as ah, popScopeId as ai, useRouter as aj, useSlots as ak, vModelText as al, toRefs as am, createSharedComposable as b, createI18n as c, definePlugin as d, useCssVar as e, computed as f, commonjsGlobal as g, h, createBlock as i, renderSlot as j, createElementBlock as k, createBaseVNode as l, normalizeClass as m, normalizeStyle as n, openBlock as o, createCommentVNode as p, createTextVNode as q, reactive as r, resolveComponent as s, toDisplayString$1 as t, useStorage as u, createVNode as v, withCtx as w, renderList as x, withModifiers as y, mergeProps as z };
