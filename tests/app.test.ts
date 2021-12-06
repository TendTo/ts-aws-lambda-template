import { handler } from "../src/app";

describe('App module', function () {
    test('successful response', async () => {
        const result = await handler(null);
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual("Hello world!");
    });
});