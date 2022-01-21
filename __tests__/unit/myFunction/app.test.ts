import { handler } from "../../../src/myFunction/app";

describe('App module', function () {

    test('successful response', async () => {
        const result = await handler(null);
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify({
            message: "Hello World from function!"
        }));
    });
});