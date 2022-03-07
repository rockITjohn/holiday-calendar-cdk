import { RemovalPolicy } from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources'
import { Construct } from 'constructs'
import * as holidayList from '../data/2022_holidays.json'

interface IHoliday {
  dateStart: number;
  dateEnd: number;
  holiday: string;
  message: string;
}

export class CalendarTableLambdaStack extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create a table
    const tableName = "HolidayCalendar";
    const table = new dynamodb.Table(this, "CalendarTable", {
      tableName,
      partitionKey: { name: "dateStart", type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Auto populate table using custom resource
    new AwsCustomResource(this, `initDBResource`, {
      onCreate: {
        service: "DynamoDB",
        action: "batchWriteItem",
        parameters: {
          RequestItems: holidayList,
        },
        physicalResourceId: PhysicalResourceId.of(`initDBData`),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [table.tableArn],
      }),
    });

    // Lambda function
    const handler = new lambda.Function(this, "CalendarReadHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "calendar_read.handler",
    });

    const lambdaPolicy = new PolicyStatement();
    lambdaPolicy.addActions("");
    lambdaPolicy.addResources(table.tableArn);

    // Grants handler read privilege
    table.grantReadData(handler);
  }
}
