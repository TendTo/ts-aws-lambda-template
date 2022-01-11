import { LambdaHandler } from './types/lambda';
import { Content } from '/opt/nodejs/types/ddb';
import { Author } from '../dependencies/content';

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

    const newAuthor = await Author.create(content);

    // Return the id of the article
    return {
        statusCode: 200,
        body: JSON.stringify({
            ok: true,
            pk: newAuthor.pk,
        })
    };
};
