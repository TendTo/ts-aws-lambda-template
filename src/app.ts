import { LambdaHandler } from './types/lambda';

export const handler: LambdaHandler = async (event) => {
    return {
        "statusCode": 200,
        "body": "Hello world!"
    };
};
