import { handler } from "../../src/myFunction/app";

describe('App module', function () {

    test('successful response even', async () => {
        const result = await handler();
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify({
            message: "The class that returns always true has returned true.",
        }));
    });
});
