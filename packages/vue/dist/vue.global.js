"use strict";
var Vue = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/vue/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    ReactiveEffect: () => ReactiveEffect,
    activeEffect: () => activeEffect,
    createReactiveObject: () => createReactiveObject,
    effect: () => effect,
    reactive: () => reactive,
    track: () => track,
    trackEffects: () => trackEffects,
    trigger: () => trigger,
    triggerEffects: () => triggerEffects
  });

  // packages/shared/src/index.ts
  var isArray = Array.isArray;

  // packages/reactivity/src/dep.ts
  var createDep = (effects) => {
    const dep = new Set(effects);
    return dep;
  };

  // packages/reactivity/src/effect.ts
  var targetMap = /* @__PURE__ */ new WeakMap();
  var activeEffect;
  var ReactiveEffect = class {
    constructor(fn) {
      this.fn = fn;
      this.deps = [];
    }
    run() {
      activeEffect = this;
      try {
        return this.fn();
      } finally {
        activeEffect = void 0;
      }
    }
  };
  function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
  }
  function track(target, key) {
    if (activeEffect) {
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
  function trackEffects(dep) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
  function trigger(target, key) {
    const depsMap = targetMap.get(target);
    let deps = [];
    if (!depsMap) {
      return;
    }
    if (key != void 0) {
      deps.push(depsMap.get(key));
    }
    if (deps.length === 1) {
      if (deps[0]) {
        triggerEffects(deps[0]);
      }
    }
  }
  function triggerEffects(dep) {
    const effects = isArray(dep) ? dep : [...dep];
    for (const effect2 of effects) {
      triggerEffect(effect2);
    }
  }
  function triggerEffect(effect2) {
    if (effect2 !== activeEffect) {
      effect2.run();
    }
  }

  // packages/reactivity/src/reactive.ts
  function reactive(target) {
    return createReactiveObject(
      target
    );
  }
  function createReactiveObject(target) {
    return new Proxy(target, {
      get: function(target2, key, receiver) {
        track(target2, key);
        return Reflect.get(target2, key, receiver);
      },
      set: function(target2, key, value, receiver) {
        const result = Reflect.set(target2, key, value, receiver);
        trigger(target2, key);
        return result;
      }
    });
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=vue.global.js.map
