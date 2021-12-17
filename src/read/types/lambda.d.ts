export type LambdaEvent = { headers: string, body: string, pathParameters: { id: number } };
export type LambdaResult = { statusCode: number, body: string };
export type LambdaHandler = (event: LambdaEvent) => Promise<LambdaResult>;