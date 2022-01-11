import { LambdaHandler } from './types/lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { Author } from '../dependencies/content';

export const handler: LambdaHandler = async (event) => {
    const client = new DynamoDBClient({ region: process.env.REGION ?? 'eu-west-1' });
    const dbDocument = DynamoDBDocumentClient.from(client, {
        marshallOptions: { convertClassInstanceToMap: true },
        unmarshallOptions: { wrapNumbers: true }
    });
    const getCommand = new DeleteCommand({
        TableName: process.env.TABLE_NAME ?? '',
        Key: {
            pk: event.pathParameters.id,
            sk: "article",
        }
    });
    await dbDocument.send(getCommand);
    await Author.delete();

    return {
        statusCode: 200,
        body: JSON.stringify({
            ok: true,
            pk: event.pathParameters.id
        })
    };
};
