import type { ServiceInputTypes, ServiceOutputTypes } from '@aws-sdk/lib-dynamodb';
import type { AwsStub } from "aws-sdk-client-mock";

export type MockedDynamoDB = AwsStub<ServiceInputTypes, ServiceOutputTypes>;