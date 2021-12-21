export type DdbUpdateExpression = {
    UpdateExpression: string,
    ExpressionAttributeNames: {
        [x: string]: string;
    },
    ExpressionAttributeValues: {
        [x: string]: any;
    },
    ConditionExpression?: string,
}