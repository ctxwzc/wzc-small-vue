import { isArray } from "@vue/shared";
import { createDep, Dep } from "./dep";

/**
 * 1. targetMap存储{target -> key -> dep}的关系。
 * 2. 这里使用weakmap应该是用到weakmap弱引用特性:
 * 只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。
 * 也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，
 * 不用手动删除引用，参考阮一峰ES6指南
 */
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

//当前正在激活的effect
export let activeEffect: ReactiveEffect | undefined

//effect类
export class ReactiveEffect<T = any>{
    deps: Dep[] = [] //依赖数组
    constructor(
        public fn: () => T
    ) {

    }
    run() {
        activeEffect = this
        try {
            return this.fn()
        } finally {
            activeEffect = undefined
        }
    }
}

export function effect<T = any>(fn: () => T) {
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}
//追踪依赖
export function track(target: object, key: unknown) {
    //没有激活的effect，跳过
    if (activeEffect) {
        let depsMap = targetMap.get(target)
        //没收集过的依赖，就收集起来
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()))
        }
        let dep = depsMap.get(key)
        if (!dep) {
            depsMap.set(key, (dep = createDep()))
        }
        trackEffects(dep)
    }
}

export function trackEffects(dep: Dep) {
    //给当前激活的effect设置订阅者
    //如果一个变量在当前运行的副作用中被读取了，就将该副作用设为此变量的一个订阅者
    dep.add(activeEffect!)
    activeEffect!.deps.push(dep)
}

export function trigger(target: object, key: unknown) {
    const depsMap = targetMap.get(target)
    let deps: (Dep | undefined)[] = []
    if (!depsMap) {
        // never been tracked
        return
    }
    if (key != void 0) {
        deps.push(depsMap.get(key))
    }
    if (deps.length === 1) {
        if (deps[0]) {
            triggerEffects(deps[0])
        }
    }
}
export function triggerEffects(
    dep: Dep | ReactiveEffect[],
) {
    // spread into array for stabilization
    const effects = isArray(dep) ? dep : [...dep]
    for (const effect of effects) {
        triggerEffect(effect)
    }
}
function triggerEffect(
    effect: ReactiveEffect,
) {
    if (effect !== activeEffect) {
        effect.run()
    }
}