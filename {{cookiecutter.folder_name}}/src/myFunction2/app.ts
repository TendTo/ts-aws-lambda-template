import { LambdaHandler } from "./types/lambda";

/**
* You can freely import any of the dependencies you add to the "myLayer" package.
*/
// import * from 'is-odd';

/*
* To import some custom classes or functions from a layer,
* use the following syntax:
* import { MyFunction } from '/opt/nodejs/<path>';
* Make sure it is mapped correctly both in the tsconfig.json
* and in the jest.config.json files
*/
import { MyUtilityClass } from "/opt/nodejs/utility";

export const handler: LambdaHandler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `The class that returns always true has returned ${new MyUtilityClass().alwaysTrue}.`,
        }),
    };
};
