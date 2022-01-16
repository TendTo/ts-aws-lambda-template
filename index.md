# <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/typescript-white.svg#gh-dark-mode-only" alt="Typescript" align=left width=35 height=35 style="padding-right: 20px"> Typescript AWS Lambda template

This project contains source code and supporting files for creating a serverless
application that you can deploy with the SAM CLI.\
It uses the Typescript language and targets the node 14.x runtime provided by
AWS.

## Usage

To use this template in a brand new project run
```bash
sam init --location gh:TendTo/ts-aws-lambda-template-cookiecutter
```

## 🗂 Project structure

```yaml
.
├── .devcontainer        # used by VsCode to launch a devcontainer with SAM and node installed
├── dist                 # folder that stores the compiled typescript. Created by tsc compilation
├── events               # json events used with 'sam local invoke' or for testing
├── src                  # code that will be deployed to AWS Lambda
├── tests                # unit tests to run with jest
├── .gitignore           # .gitignore file
├── env.json.dist        # example env file that defines the env variables for 'sam local invoke'
├── jest.config.js       # jest configuration file
├── LICENSE              # open license of the project
├── package-lock.json    # file describing in detail the dependency tree of the node modules dependencies
├── package.json         # file listing the project's dependencies and utility scripts
├── README.md            # THIS FILE
├── samconfig.toml.dist  # example of a SAM configuration file
├── template.yaml        # template used by SAM to deploy the serverless architecture
└── tsconfig.json        # typescript configuration file
```

The application uses a few AWS resources, including Lambda functions and an API
Gateway API. These resources are defined in the `template.yaml` file in this
project.\
You can easily extend the template to add any AWS resource you may need.

Here's an example of what this template would produce:

![aws-schema](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/TendTo/ts-aws-lambda-template/master/docs/schema.puml)

## 🧾 Requirements

The Serverless Application Model Command Line Interface (SAM CLI) is an
extension of the AWS CLI that adds functionality for building and testing Lambda
applications. It uses Docker to run your functions in an Amazon Linux
environment that matches Lambda. It can also emulate your application's build
environment and API.

To use the SAM CLI, you need the following tools.

- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Node.js 14](https://nodejs.org/en/)
- [npm 7.x](https://www.npmjs.com/)
- [Docker](https://hub.docker.com/search/?type=edition&offering=community)
  (_optional_, for local testing or image deployement)
- [AWS CLI](https://aws.amazon.com/cli/) (_optional_, for more control)

> `NOTE:` npm needs to be version 7 or higher to support workspaces.\
> You can check the current version with `npm -v`.\
> npm can easily be updated with `npm install -g npm@7` or
> `npm install -g npm@latest`

You will also need an [AWS](https://aws.amazon.com/) account and a
[IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html) with
the right access policy you can use to connect from the console.\
The file storing the credentials should be in the default location
`~/.aws/credentials`, unless otherwise specified.

Optionally, you can install also the [AWS CLI](https://aws.amazon.com/cli/) for
more fine-tuned control over your operations, like deleting an already deployed
stack.

### 🐳 Use the DevContainer

If you are using VsCode, you could take advantage of its DevContainer
functionalities. In that case, you would just need to have
[Docker](https://docs.docker.com/get-docker/) installed.

You still need the credentials of an account with enough permissions to perform
the deployment.\
The credentials file will be fetched from `~/.aws/credentials`, unless otherwise
specified.

## ⚙️ SAM configuration

The configuration is specified in the _samconfig.toml_ file. Rename the
_samconfig.toml.dist_ file or create your own.\
You can change it freely, or add some more environments. Some of the settings
include:

- **Profile**: name of the AWS profile you saved the console credentials for
- **Confirm changeset**: whether to ask for manual confirmation after showing
  the changeset SAM will produce
- **Stack Name**: The name of the stack to deploy to CloudFormation. This should
  be unique to your account and region, and a good starting point would be
  something matching your project name
- **AWS Region**: The AWS region you want to deploy your app to
- **Capabilities**: Many AWS SAM templates, including this example, create AWS
  IAM roles required for the AWS Lambda function(s) required to access AWS
  services. By default, these are scoped down to minimum required permissions.
  To deploy an AWS CloudFormation stack that creates or modifies IAM roles, the
  `CAPABILITY_IAM` value for `capabilities` must be provided. If permission
  isn't provided through the config file, to deploy this example you must
  explicitly pass `--capabilities CAPABILITY_IAM` to the `sam deploy` command
- **s3 bucket**: name of the bucket used to upload the code. Must be globally
  unique
- **s3 prefix**: folder inside the bucket that contains the uploaded code.
- **Parameter overrides**: key="value" pairs used to override the values of the
  parameters specified in the _template.yaml_ file

Here's an example of a _samconfig.toml_:

```toml
version = 0.1                                 # needed

[dev.deploy.parameters]                       # specified with SAM deploy --config-env dev
profile = "default"                           # aws profile
confirm_changeset = true 
capabilities = "CAPABILITY_IAM"               # needed to manage IAM roles
stack_name = "my-function-stack"              # name of the stack that will be deployed
s3_prefix = "my-function-folder"              # code folder in the S3 bucket
s3_bucket = "my-function-bucket-for-lambda"   # S3 bucket
region = "eu-west-1"
# should not include sensitive tokens
# overrides the parameters "apiStage" and "token"
# it is required if default values are not provided in the template
parameter_overrides = "apiStage=\"dev\" token=\"not-secret-token\"" 

[dev.local_invoke.parameters]                 # used by SAM local invoke --config-env dev
env_vars = "env.json"                         # file that stores the environment variables
```

## ▶️ Build, deploy and delete

### Build

First of all, install all the required dependencies with

```bash
npm install
```

To build the stack, you can run

```bash
# to compile all the .ts files and create the dist folder
npm run compile

sam build
```

### Deploy

Once the stack has been built and the _.aws-sam_ folder is present, to deploy
the stack with Cloudformation, you can run

```bash
sam deploy --config-file samconfig.toml --config-env dev
```

### Delete

If a Stack happens to be in a ROLLBACK state, preventing you from doing any more
deployments or you simply want to delete it, you can do so from the AWS console
or, if you have the AWS CLI installed, you can run

```bash
aws cloudformation delete-stack --stack-name my-function-stack
```

## ➕ Add a resource to your application

The application template uses AWS Serverless Application Model (AWS SAM) to
define application resources. AWS SAM is an extension of AWS CloudFormation with
a simpler syntax for configuring common serverless application resources such as
functions, triggers, and APIs. For resources not included in
[the SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md),
you can use standard
[AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html)
resource types.

There are 3 main types of resource addition:

1. **Generic resource** (non function - non layer):
   - Just update the _template.yaml_ file. Add the resource and its properties
2. **Lambda function** (no dependencies):
   - Update the _template.yaml_ file. Add the lambda function and its properties
   - Create a new folder under _src_ that the _CodeUri_ property will point to
3. **Lambda layer** (or function with self-contained dependencies):
   - Update the _template.yaml_ file. Add the lambda function and its properties
   - Use `npm run newLayer -- <layer_name>` to create a new folder the
     _ContentUri_ property will point to. You can leave everything as default
   - To install the layer's dependencies, run
     `npm i -w src/<layer_name> <package>`
   - If you need to be able to reference your own **.ts** files in the layer
     from any other lambda:
     - Add the following in the _tsconfig.json_:
     ```json
     {
     "compilerOptions": {
         "paths": {
             "/opt/nodejs/*": [
                 "./<layer_name>/*"
             ]
         }
     },
     ```
     - Import the modules as `import * from '/opt/nodejs/<file_name>'`

> `NOTE:` you may need to reload your editor for it to notice the new
> dependencies

## 🛠 Utility scripts

Some utility scripts have been provided:

- `npm test`: run jest's tests
- `npm run watch`: keep watching for changes in the _src_ folder and update the
  _.js_ files in the _dist_ folder
- `npm run compile`: compile **.ts** code with tsc
- `npm run build`: makes sure the _dist_ folder is updated and builds everything
  with `sam build`
- `npm run invoke`: calls `sam local invoke` with the flags
  - `--config-file samconfig.toml`
  - `--config-env dev`
- `npm run deploy`: calls `npm run build` and then `sam deploy` with the flags
  - `--config-file samconfig.toml`
  - `--config-env dev`
- `npm run delete -- <stack_name>`: calls `aws cloudformation delete-stack`
- `npm run clean`: removes both the _dist_ and _.aws-sam_ folders
- `npm run newLayer -- src/<layer_name>`: create the folder and package.json for
  a new layer

> `NOTE:` To use these scripts you have to run `npm install` first. You may also
> need to reload your editor for it to notice the newly installed dependencies

> `NOTE:` Both the _local invoke_ and the _deploy_ command will refer to the
> _.aws-sam_ folder, its template, and its source code, if present.\
> Otherwise, they will fall back on the _template.yaml_ file in the root folder
> and the code in the _dist_ folder.

## ⌨️ Examples

Start compiling the typescript source in watch mode

```bash
npm run watch
```

Start the jest tests. Make sure the _jest.config.js_'s mappings are configured
correctly

```bash
npm test
```

Build all the lambda functions and install their dependencies. It is a good idea
to tun this before any other SAM command

```bash
npm run build
```

Invoke the _MyFunction_ function locally in a specialized docker container

```bash
npm run invoke -- MyFunction
```

Invoke the _MyFunction2_ function locally in a specialized docker container,
passing as the event parameter of the handle the values of _events/event.json_

```bash
npm run invoke -- MyFunction2 --e events/event.json
```

Deploy all the infrastructure to AWS

```bash
npm run deploy
```

## 🧪 Testing

### Using Jest

Make sure the _jest.config.js_ is configured correctly.

```js
{
  ...
  moduleNameMapper : {
    "^/opt/nodejs/(.*)$": "<rootDir>/src/<layer_name>/$1"
  }
  ...
}
```

Then just run

```bash
npm test
```

### Using SAM

First, build your application, because SAM needs a compiled _dist_ folder.

```bash
npm run build
```

#### Local Invoke

The SAM CLI installs dependencies defined in `package.json`, creates a
deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a
JSON document that represents the input that the function receives from the
event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them:

```bash
npm run invoke -- --event events/event.json
```

#### Start API

The SAM CLI can also emulate your application's API. Use the
`sam local start-api` to run the API locally on port 3000.

```bash
sam local start-api
curl http://localhost:3000/
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

## ♻️ Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, SAM CLI has a command called `sam logs`. `sam logs`
lets you fetch logs generated by your deployed Lambda function from the command
line. In addition to printing the logs on the terminal, this command has several
nifty features to help you quickly find the bug.

```bash
sam logs -n HelloWorldFunction --stack-name ts-aws-lambda --tail
```

> `NOTE:` This command works for all AWS Lambda functions; not just the ones you
> deploy using SAM.

## 📚 Resources

- [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
- [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).
- [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
- AWS Toolkit plug-in list for popular IDEs for SAM CLI
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

## ❤️ Credit

Inspired by
[aws-sam-typescript-layers-example](https://github.com/Envek/aws-sam-typescript-layers-example/)
