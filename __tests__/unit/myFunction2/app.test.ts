import { handler } from "../../../src/myFunction2/app";

describe('App module', function () {

    test('successful response odd', async () => {
        const result = await handler({ val: 5 } as any);
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify({
            message: "The number 5 is odd!",
            class: true
        }));
    });

    test('successful response even', async () => {
        const result = await handler({ val: 4 } as any);
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify({
            message: "The number 4 is even!",
            class: false
        }));
    });

    test('successful response without value', async () => {
        const result = await handler({} as any);
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify({
            message: "The number 0 is even!",
            class: false
        }));
    });
});