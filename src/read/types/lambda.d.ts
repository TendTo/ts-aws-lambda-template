import { ContentType } from "/opt/nodejs/types/ddb";

export type LambdaEvent = { headers: string, body: string, pathParameters: { type: ContentType, id: string } };
export type LambdaResult = { statusCode: number, body: string };
export type LambdaHandler = (event: LambdaEvent) => Promise<LambdaResult>;