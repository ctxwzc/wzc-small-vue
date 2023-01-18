# vue3源码核心代码

项目目录和vue3源码目录一样,方便查看,暂时只有dev模式

## 运行
 
- node >=16.11.0 
- 使用pnpm

```
pnpm install
pnpm run dev

```
## 调试

- 引用package/dist/vue.global.js

```js
const { reactive, effect } = Vue
    {
        let obj = reactive({ A0: 1, A1: 1 })
        let A2
        console.log(obj.A0)
        const update = ()=>{
            A2 = obj.A0 + obj.A1
        }
        effect(() =>update())
        console.log(A2)
        obj.A0++;
        console.log(A2)

    }

```