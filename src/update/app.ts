import { LambdaHandler } from './types/lambda';
import isodd from 'is-odd';
/* 
 * To import some custom classes or functions from a layer, 
 * use the following syntax:
 * import { MyFunction } from '/opt/nodejs/<path>';
 * Make sure it is mapped correctly both in the tsconfig.json 
 * and in the jest.config.json files
 */
import { MyClass } from '/opt/nodejs/utility';

export const handler: LambdaHandler = async (event) => {
    return {
        "statusCode": 200,
        "body": JSON.stringify({
            message: `The number is ${isodd(event.val) ? "odd" : "even"}!`,
            class: new MyClass(event.val).isOdd
        })
    };
};
