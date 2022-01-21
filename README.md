# Template for Typescript AWS Lambda template

This is a [Cookiecutter](https://github.com/audreyr/cookiecutter) template to create a Serverless application using [Serverless Application Model (SAM)](https://aws.amazon.com/serverless/sam/) on Node.js 14 runtime using TypeScript for Lambda functions source code and shared layers for runtime dependencies.

Resulted application will be the one you can find in this repository: [ts-aws-lambda-template](https://github.com/TendTo/ts-aws-lambda-template)

## Usage

[Install AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) and run following command:

```sh
sam init --location gh:TendTo/ts-aws-lambda-template-cookiecutter
```

You'll be prompted a few questions to help this template to scaffold this project and after its completion you should see a new folder at your current path with the name of the project you gave as input.

## Credits
Inspired by [cookiecutter-aws-sam-typescript-layers](https://github.com/Envek/cookiecutter-aws-sam-typescript-layers)
