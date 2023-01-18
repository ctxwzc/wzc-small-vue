import { track, trigger } from "./effect"

//返回一个对象的响应式代理。
export function reactive(target: object) {
    return createReactiveObject(
        target,
    )
}

//vue3使用proxy拦截
export function createReactiveObject(
    target: any,
) {
    return new Proxy(target, {
        //get方法
        get: function (target, key, receiver) {
            //追踪依赖
            track(target, key)
            return Reflect.get(target, key, receiver)
        },
        set: function (target, key, value, receiver) {
            const result =  Reflect.set(target, key, value, receiver)
            //触发依赖
            trigger(target,key)
            return result
        }
        //...还有其他的proxy可以拦截的操作
    })
}