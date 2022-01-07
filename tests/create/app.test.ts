import type { UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import article from "../../events/article.json";
import { handler } from "../../src/create/app";
import { MockedDynamoDB } from "../types";


describe('Create endpoint', function () {

    const mockedDynamoDB = global.mockDBClient as MockedDynamoDB;

    test('successful response', async () => {
        const event = {
            pathParameters: {
                type: ""
            },
            headers: null,
            body: JSON.stringify(article)
        }
        const result = await handler(event);
        const input = mockedDynamoDB.send.getCall(0).args[0].input as UpdateCommandInput;

        expect(mockedDynamoDB.send.callCount).toEqual(1);
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify({
            ok: true,
            pk: input.Key.pk
        }));
    });

    test('invalid JSON', async () => {
        const mockError = jest.spyOn(console, 'error').mockImplementation();
        const event = {
            headers: null,
            body: "Invalid JSON"
        }
        const result = await handler(event);

        expect(mockedDynamoDB.send.callCount).toEqual(0);
        expect(console.error).toHaveBeenCalled();
        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(JSON.stringify({
            ok: false,
            message: "Invalid JSON"
        }));

        mockError.mockRestore();
    });
});