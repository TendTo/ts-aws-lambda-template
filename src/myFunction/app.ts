import { LambdaHandler } from './types/lambda';

export const handler: LambdaHandler = async (event) => {
    return {
        "statusCode": 200,
        "body": JSON.stringify({
            message: "Hello World from function!"
        })
    };
};
