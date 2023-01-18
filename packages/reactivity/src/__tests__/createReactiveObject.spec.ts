import { createReactiveObject } from "..";

describe('ReactiveObject', () => {
    it('test createReactiveObject', () => {
        const obj = createReactiveObject({ a: 1, b: 1 });
        console.log(obj.a);
    });
});