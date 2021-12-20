import { Article, LambdaHandler } from './types/lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 } from 'uuid';

export const handler: LambdaHandler = async (event) => {
    console.log(event.body);

    // Create an object with the article che user wants to create
    let newArticle: Article;
    try {
        newArticle = JSON.parse(event.body);
    } catch (e) {
        console.error(e);
        return {
            statusCode: 400,
            body: JSON.stringify({
                ok: false,
                message: 'Invalid JSON'
            })
        }
    }

    const articleId = v4();
    const client = new DynamoDBClient({ region: process.env.REGION ?? 'eu-west-1' });
    const dbDocument = DynamoDBDocumentClient.from(client, {
        marshallOptions: { convertClassInstanceToMap: true },
        unmarshallOptions: { wrapNumbers: true }
    });
    const putCommand = new PutCommand({
        TableName: process.env.TABLE_NAME ?? '',
        Item: {
            ...newArticle,
            pk: articleId,
            sk: "article",
        },
        ReturnValues: "ALL_OLD"
    });
    const res = await dbDocument.send(putCommand);
    console.log(res.Attributes);

    // Return the id of the article
    return {
        "statusCode": 200,
        "body": JSON.stringify({
            ok: true,
            pk: articleId,
        })
    };
};
