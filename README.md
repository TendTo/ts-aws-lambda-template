# Typescript AWS Lambda template

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. It includes the following files and folders:

```yaml
.
├── dist                 # folder that stores the compiled typescript
├── events               # json events used with 'sam local invoke'
├── src                  # code that will be deployed to aws Lambda
├── tests                # unit tests to run with jest
├── .gitignore           # .gitignore file
├── .jest.config.js      # jest configuration file
├── template.yaml        # template used by sam to deploy the serverless architecture
├── LICENSE              # Licence of the project
└── README.md            # This file
```

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

If you prefer to use an integrated development environment (IDE) to build and test your application, you can use the AWS Toolkit.

The AWS Toolkit is an open source plug-in for popular IDEs that uses the SAM CLI to build and deploy serverless applications on AWS. The AWS Toolkit also adds a simplified step-through debugging experience for Lambda function code. See the following links to get started.

- [CLion](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
- [GoLand](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
- [IntelliJ](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
- [WebStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
- [Rider](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
- [PhpStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
- [PyCharm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
- [RubyMine](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
- [DataGrip](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
- [VS Code](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/welcome.html)
- [Visual Studio](https://docs.aws.amazon.com/toolkit-for-visual-studio/latest/user-guide/welcome.html)

## Requirements

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux
environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Node.js 10](https://nodejs.org/en/), including [npm](https://www.npmjs.com/)
- [Docker](https://hub.docker.com/search/?type=edition&offering=community)

You will also need an [AWS](https://aws.amazon.com/) account and a [IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html) with the right access policy you can use to connect from the console.

## SAM configuration

The configuration is specified in the _samconfig.toml_ file. You can change it freely, or add some more environments. Some of the settings include:

- **Profile**: name of the aws profile you saved the console credentials for.
- **Confirm changeset**: whether to ask for manual confirmation after showing the change set sam will produce
- **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region, and a good starting point would be something matching your project name.
- **AWS Region**: The AWS region you want to deploy your app to.
- **Capabilities**: Many AWS SAM templates, including this example, create AWS IAM roles required for the AWS Lambda function(s) included to access AWS services. By default, these are scoped down to minimum required permissions. To deploy an AWS CloudFormation stack which creates or modifies IAM roles, the `CAPABILITY_IAM` value for `capabilities` must be provided. If permission isn't provided through the config file, to deploy this example you must explicitly pass `--capabilities CAPABILITY_IAM` to the `sam deploy` command.
- **s3 bucket**: name of the bucket used to upload the code. Must be globally unique.
- **s3 prefix**: folder inside the bucket that contains the uploaded code.
- **Parameter overrides**: key="value" pairs used to override the values of the parameters specified in the _template.yaml_ file

Here's an example of a _samconfig.toml_:

```toml
version = 0.1                                 # needed

[dev.deploy.parameters]                       # used by sam deploy --config-env dev
profile = "default"                           # aws profile
confirm_changeset = true 
capabilities = "CAPABILITY_IAM"               # needed to manage IAM roles
stack_name = "my-function-stack"              # name of the stack that will be deployed
s3_prefix = "my-function-folder"              # code folder in the S3 bucket
s3_bucket = "my-function-bucket-for-lambda"   # S3 bucket
region = "eu-west-1"
# should not include sensitive tokens. Overrides the parameters "apiStage" and "token"
parameter_overrides = "apiStage=\"dev\" token=\"not-important-token-deploy\"" 

[dev.local_invoke.parameters]                 # used by sam local invoke --config-env dev
env_vars = "env.json"                         # file that stores the environment variables
```

## Utility scripts

Some utility scripts have been provided:
- `npm test`: run jest's tests
- `npm run watch`: keep watching for changes in the _src_ folder and update the _.js_ files in the _dist_ folder
- `npm run build`: makes sure the _dist_ folder is updated and builds everything with `sam build`
- `npm run clean`: removes the _dist_ and _.aws-sam_ folders
- `npm run invoke`: calls `sam local invoke` with the flags 
  - `--config-file samconfig.toml`
  - `--config-env dev`
  - `--template-file template.yaml`
- `npm run deploy`: calls `npm run build` and then `sam deploy` with the flags 
  - `--config-file samconfig.toml `
  - `--config-env dev`

The deploy command will refer to the _.aws-sam_ folder, its template and its source code, if present. Otherwise, it will fallback on the _template.yaml_ file in the root folder and the code in the _dist_ folder.  
The invoke command, on the other hand, will use the default _template.yaml_ file.

## Use the SAM CLI to build and test locally

Build your application:

```bash
ts-aws-lambda$ npm run build
```

The SAM CLI installs dependencies defined in `package.json`, creates
a deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a
JSON document that represents the input that the function receives from the
event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them:

```bash
ts-aws-lambda$ npm run invoke -- --event events/event.json
```

The SAM CLI can also emulate your application's API. Use the
`sam local start-api` to run the API locally on port 3000.

```bash
ts-aws-lambda$ sam local start-api
ts-aws-lambda$ curl http://localhost:3000/
```

The SAM CLI reads the application template to determine the API's routes and the
functions that they invoke. The `Events` property on each function's definition
includes the route and method for each path.

```yaml
Events:
        MyEvent:
          Type: Api
          Properties:
            Path: /func
            Method: get
```

## Deploy on AWS

Deploy your application:

```bash
ts-aws-lambda$ npm run deploy # you can add -- -g to use the guided procedure
```

Here's an example of what this template would produce:

![aws-schema](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/TendTo/ts-aws-lambda-template/master/docs/schema.puml)

## Add a resource to your application

The application template uses AWS Serverless Application Model (AWS SAM) to define application resources. AWS SAM is an extension of AWS CloudFormation with a simpler syntax for configuring common serverless application resources such as functions, triggers, and APIs. For resources not included in [the SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md), you can use standard [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) resource types.

## Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs generated by your deployed Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.

`NOTE`: This command works for all AWS Lambda functions; not just the ones you deploy using SAM.

```bash
ts-aws-lambda$ sam logs -n HelloWorldFunction --stack-name ts-aws-lambda --tail
```

You can find more information and examples about filtering Lambda function logs in the [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Unit tests

Tests are defined in the `hello-world/tests` folder in this project. Use NPM to install the [jest test framework](https://jestjs.io/) and run unit tests.

```bash
ts-aws-lambda$ npm install
ts-aws-lambda$ npm test
```

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you
used your project name for the stack name, you can run the following:

```bash
aws cloudformation delete-stack --stack-name ts-aws-lambda
```

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless
application concepts.

Next, you can use AWS Serverless Application Repository to deploy ready to use Apps that go beyond hello world samples and learn how authors developed their applications: [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
