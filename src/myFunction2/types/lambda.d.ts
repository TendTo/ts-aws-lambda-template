import type { APIGatewayEvent } from "aws-lambda";

export type LambdaEvent = APIGatewayEvent & {val: number};
export type LambdaResult = { statusCode: number, body: string };
export type LambdaHandler = (event: LambdaEvent) => Promise<LambdaResult>;