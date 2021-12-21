import { Article, LambdaHandler } from './types/lambda';
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 } from 'uuid';
import { Ddb } from '/opt/nodejs/utility';

export const handler: LambdaHandler = async (event) => {
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
    delete newArticle.pk;
    delete newArticle.sk;

    const articleId = v4();
    const dbDocument = Ddb.getDBDocumentClient();
    const putCommand = new UpdateCommand({
        TableName: process.env.TABLE_NAME ?? '',
        Key: {
            pk: articleId,
            sk: "article",
        },
        ...Ddb.getPutExpression(newArticle),
    });
    await dbDocument.send(putCommand);

    // Return the id of the article
    return {
        "statusCode": 200,
        "body": JSON.stringify({
            ok: true,
            pk: articleId,
        })
    };
};
