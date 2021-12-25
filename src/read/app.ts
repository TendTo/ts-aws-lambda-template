import { LambdaHandler } from './types/lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export const handler: LambdaHandler = async (event) => {
    const client = new DynamoDBClient({ region: process.env.REGION ?? 'eu-west-1' });
    const dbDocument = DynamoDBDocumentClient.from(client, {
        marshallOptions: { convertClassInstanceToMap: true },
        unmarshallOptions: { wrapNumbers: true }
    });

    // Only a single item is returned
    if (event.pathParameters?.id) {
        const getCommand = new GetCommand({
            TableName: process.env.TABLE_NAME ?? '',
            Key: {
                pk: event.pathParameters.id,
                sk: "article",
            }
        });
        const res = await dbDocument.send(getCommand);
        return {
            "statusCode": 200,
            "body": JSON.stringify({
                ok: true,
                result: res.Item,
            })
        };
    }

    // All articles are returned
    const queryCommand = new QueryCommand({
        TableName: process.env.TABLE_NAME ?? '',
        IndexName: process.env.INDEX_NAME ?? 'GSI_1',
        KeyConditionExpression: '#sk = :sk',
        ExpressionAttributeNames: {
            '#sk': 'sk'
        },
        ExpressionAttributeValues: {
            ':sk': 'article'
        }
    });
    const res = await dbDocument.send(queryCommand);
    return {
        statusCode: 200,
        body: JSON.stringify({
            ok: true,
            result: res.Items,
        })
    };
};
