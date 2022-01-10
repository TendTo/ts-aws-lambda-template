import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DdbOperation, DdbQueryExpression, DdbUpdateExpression, KeyValue } from './types/ddb';

export namespace Ddb {

    /**
     * Utility function that creates a new DynamoDB client
     * @returns {DynamoDBDocumentClient} DynamoDB utility document client
     */
    export function getDBDocumentClient(): DynamoDBDocumentClient {
        const client = new DynamoDBClient({ region: process.env.REGION ?? 'eu-west-1' });
        return DynamoDBDocumentClient.from(client, {
            marshallOptions: { convertClassInstanceToMap: true },
            unmarshallOptions: { wrapNumbers: true }
        });
    }

    function buildUpdateExpression(item: object, override: boolean): DdbUpdateExpression {
        const arr = Object.entries(item).map(([key, value]) => {
            const setExpression = !override ? `if_not_exists(#${key}, :${key})` : `:${key}`;
            return {
                UpdateExpression:
                    `#${key} = ${setExpression}`,
                ExpressionAttributeNames: {
                    [`#${key}`]: key
                },
                ExpressionAttributeValues: {
                    [`:${key}`]: value
                }
            };
        });
        const out = arr.reduce((acc, curr) => {
            acc.UpdateExpression += `${acc.UpdateExpression ? ',' : 'SET'} ${curr.UpdateExpression}`;
            acc.ExpressionAttributeNames = Object.assign(acc.ExpressionAttributeNames, curr.ExpressionAttributeNames)
            acc.ExpressionAttributeValues = Object.assign(acc.ExpressionAttributeValues, curr.ExpressionAttributeValues)
            return acc;
        }, {
            UpdateExpression: '',
            ExpressionAttributeNames: {},
            ExpressionAttributeValues: {}
        });
        return out;
    }

    /**
     * Generates the put-like expression for a DynamoDB UpdateItem operation
     * @param item item to insert
     * @param checkNotExisting whether to make sure the item does not exist
     * @returns {DdbUpdateExpression} the put expression to use in the put command
     */
    export function getPutExpression(
        item: object,
        checkNotExisting: boolean = true): DdbUpdateExpression {
        const out = buildUpdateExpression(item, true);
        out.UpdateExpression += `${out.UpdateExpression ? ',' : 'SET'} #created = :created`;
        out.ExpressionAttributeNames['#created'] = 'created';
        out.ExpressionAttributeValues[':created'] = new Date().toISOString();
        if (checkNotExisting) {
            out.ConditionExpression = 'attribute_not_exists(created)';
        }
        return out;
    }

    /**
     * Generates the update expression for a DynamoDB UpdateItem operation
     * @param item item to update
     * @param checkExisting whether the item must exist before updating
     * @param override whether to override existing values
     * @returns {DdbUpdateExpression} the update expression to use in the update command
     */
    export function getUpdateExpression(
        item: object,
        checkExisting: boolean = true,
        override: boolean = true): DdbUpdateExpression {
        const out = buildUpdateExpression(item, override);
        out.UpdateExpression += `${out.UpdateExpression ? ',' : 'SET'} #last_updated = :last_updated`;
        out.ExpressionAttributeNames['#last_updated'] = 'last_updated';
        out.ExpressionAttributeValues[':last_updated'] = new Date().toISOString();
        if (checkExisting) {
            out.ConditionExpression = "attribute_exists(created)";
        }
        return out;
    }

    /**
     * Generates the query expression for a DynamoDB Query operation
     * @param primaryKey primary key of the item to query
     * @param sortKey sort key of the item to query
     * @param gsi the name of the GSI to use
     * @returns {DdbQueryExpression} the query expression to use in the query command
     */
    export function getQueryExpression(primaryKey?: KeyValue, sortKey?: KeyValue, gsi?: string): DdbQueryExpression {
        const sortExpression = sortKey && sortKey.conditionExpression ? sortKey.conditionExpression.replace("%#", `#${sortKey.key}`).replace("%:", `:${sortKey.key}`) : '';
        let KeyConditionExpression = primaryKey ? `#${primaryKey.key} = :${primaryKey.key} ` : "";
        KeyConditionExpression += `${KeyConditionExpression ? " AND" : ""} ${sortExpression}`;
        const out = {
            IndexName: gsi ?? process.env.INDEX_NAME,
            KeyConditionExpression,
            ExpressionAttributeNames: {
                ...primaryKey && { [`#${primaryKey.key}`]: primaryKey.key },
                ...sortKey && { [`#${sortKey.key}`]: sortKey.key }
            },
            ExpressionAttributeValues: {
                ...primaryKey && { [`:${primaryKey.key}`]: primaryKey.value },
                ...sortKey && { [`:${sortKey.key}`]: sortKey.value }
            }
        }
        return out;
    }

}