import { LambdaHandler } from './types/lambda';

export const handler: LambdaHandler = async (event) => {
    console.log(event.pathParameters.id);
    console.log(event.body);
    return {
        "statusCode": 200,
        "body": "Delete article"
    };
};
