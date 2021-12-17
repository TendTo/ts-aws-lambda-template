import { LambdaHandler } from './types/lambda';

export const handler: LambdaHandler = async (event) => {
    console.log(event);
    return {
        "statusCode": 200,
        "body": "Read article"
    };
};
