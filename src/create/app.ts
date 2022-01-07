import { LambdaHandler } from './types/lambda';
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 } from 'uuid';
import { Ddb } from '/opt/nodejs/utility';
import { Content } from '/opt/nodejs/types/ddb';

export const handler: LambdaHandler = async (event) => {
    let content: Content["author"];
    try {
        content = JSON.parse(event.body);
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
    delete content.pk;
    delete content.sk;

    const newId = `${event.pathParameters.type}#${v4()}`;
    const dbDocument = Ddb.getDBDocumentClient();
    const putCommand = new UpdateCommand({
        TableName: process.env.TABLE_NAME ?? '',
        Key: {
            pk: newId,
            sk: event.pathParameters.type,
        },
        ...Ddb.getPutExpression(content),
    });
    await dbDocument.send(putCommand);

    // Return the id of the article
    return {
        statusCode: 200,
        body: JSON.stringify({
            ok: true,
            pk: newId,
        })
    };
};
