import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb';
import { v4 } from "uuid";
import { handler } from "../../src/delete/app";
import { MockedDynamoDB } from "../types";


describe('Delete endpoint', function () {

    const mockedDynamoDB = global.mockDBClient as MockedDynamoDB;

    test('successful response', async () => {
        const event = {
            pathParameters: {
                id: v4()
            },
            headers: null,
            body: undefined
        }
        const result = await handler(event);
        const input = mockedDynamoDB.send.getCall(0).args[0].input as DeleteCommandInput;

        expect(mockedDynamoDB.send.callCount).toEqual(1);
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify({
            ok: true,
            pk: input.Key.pk
        }));
    });
});