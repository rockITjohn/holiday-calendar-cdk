# Welcome to your CDK TypeScript project!

## Information

This CDK stack integrates with Amazon Connect. The lambda function can be used in a Connect contact block and be invoked directly from a contact flow. A department can be attached as a contact attribute to the call flow that invokes the lambda. The lambda takes the department contact attribute to determinw which dynamodb table it should query. The lambda takes the current date, converts it to unix time, and scans the dynamodb table. The scan will return a holiday if the current unix date falls between the dateStart and dateEnd values in the table.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
