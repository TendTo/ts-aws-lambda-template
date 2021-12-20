import { LambdaHandler } from './types/lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

export const handler: LambdaHandler = async (event) => {
    console.log(event.pathParameters.id);
    console.log(event.body);

    const client = new DynamoDBClient({ region: process.env.REGION ?? 'eu-west-1' });
    const dbDocument = DynamoDBDocumentClient.from(client, {
        marshallOptions: { convertClassInstanceToMap: true },
        unmarshallOptions: { wrapNumbers: true }
    });
    const getCommand = new GetCommand({
        TableName: process.env.TABLE_NAME ?? '',
        Key: {
            pk: event.pathParameters.id,
            sk: "article",
        }
    });
    const res = await dbDocument.send(getCommand);
    console.log(res.Item);

    return {
        "statusCode": 200,
        "body": JSON.stringify({
            ok: true,
            result: res.Item,
        })
    };
};
