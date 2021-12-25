import type { GetCommandInput } from '@aws-sdk/lib-dynamodb';
import { v4 } from "uuid";
import article from "../../events/article.json";
import { handler } from "../../src/read/app";
import { MockedDynamoDB } from "../types";

describe('Read endpoint', function () {

    const mockedDynamoDB = global.mockDBClient as MockedDynamoDB;

    test('successful response - read all', async () => {
        const event = {
            headers: null,
            body: JSON.stringify(article)
        }
        const result = await handler(event);

        expect(mockedDynamoDB.send.callCount).toEqual(1);
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify({
            ok: true,
            result: [global.mockArticle, global.mockArticle]
        }));
    });

    test('successful response - read single', async () => {
        const event = {
            pathParameters: {
                id: v4()
            },
            headers: null,
            body: JSON.stringify(article)
        }
        const result = await handler(event);
        const input = mockedDynamoDB.send.getCall(0).args[0].input as GetCommandInput;

        expect(mockedDynamoDB.send.callCount).toEqual(1);
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify({
            ok: true,
            result: global.mockArticle
        }));
    });
});