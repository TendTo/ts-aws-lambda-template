import { Article, LambdaHandler } from './types/lambda';
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Ddb } from '/opt/nodejs/utility';

export const handler: LambdaHandler = async (event) => {
    // Create an object with the article che user wants to update
    let article: Article;
    try {
        article = JSON.parse(event.body);
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

    // Remove any fields that are not allowed to be updated
    delete article.pk;
    delete article.sk;

    const dbDocument = Ddb.getDBDocumentClient();
    const putCommand = new UpdateCommand({
        TableName: process.env.TABLE_NAME ?? '',
        Key: {
            pk: event.pathParameters.id,
            sk: "article",
        },
        ...Ddb.getUpdateExpression(article),
    });

    try {
        await dbDocument.send(putCommand);
    } catch (e) {
        console.error(e);
        return {
            statusCode: 404,
            body: JSON.stringify({
                ok: false,
                message: 'Item not found'
            })
        }
    }

    // Return the id of the article
    return {
        "statusCode": 200,
        "body": JSON.stringify({
            ok: true,
            pk: event.pathParameters.id
        })
    };
};
