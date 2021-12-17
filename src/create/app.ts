import { Article, LambdaHandler } from './types/lambda';
import { DynamoDB } from 'aws-sdk';

export const handler: LambdaHandler = async (event) => {
    console.log(event.body);
    const db = new DynamoDB({ region: process.env.REGION ?? 'eu-west-1' });

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

    const res = await db.putItem({
        TableName: process.env.TABLE_NAME ?? '',
        Item: {
            pk: { S: newArticle.id },
            sk: { S: newArticle.title },
        },
        ReturnValues: 'ALL_OLD'
    }).promise();
    console.log(res.Attributes);

    return {
        "statusCode": 200,
        "body": JSON.stringify({
            ok: true,
            pk: res.Attributes.pk.S,
        })
    };
};
