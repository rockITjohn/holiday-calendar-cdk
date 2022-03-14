import { RemovalPolicy } from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources'
import { Construct } from 'constructs'

export class CalendarTableLambdaStack extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create a table
    const tableName = "HolidayCalendar";
    const table = new dynamodb.Table(this, "CalendarTable", {
      tableName,
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Auto populate table using custom resource
    new AwsCustomResource(this, `initDBResource-holidays`, {
      onCreate: {
        service: "DynamoDB",
        action: "batchWriteItem",
        parameters: {
          RequestItems: {
            HolidayCalendar: [
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOLIDAY_NEW_YEARS" },
                    dateStart: { N: "1640926800" },
                    dateEnd: { N: "1641013199" },
                    holiday: { S: "New Year's Day" },
                    message: { S: "Sorry, we are closed for New Year's Day" },
                    "excludedDepartments:": { S: "[]" },
                    includedDepartments: { S: "[*]" },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOLIDAY_MLK" },
                    dateStart: { N: "1642395600" },
                    dateEnd: { N: "1642481999" },
                    holiday: { S: "Martin Luther King Day" },
                    message: {
                      S: "Sorry, we are closed for Martin Luther King Day",
                    },
                    "excludedDepartments:": { S: "[]" },
                    includedDepartments: { S: "[*]" },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOLIDAY_WASHINGTON" },
                    dateStart: { N: "1645419600" },
                    dateEnd: { N: "1645505999" },
                    holiday: { S: "Washington's Birthday" },
                    message: {
                      S: "Sorry, we are closed for Washington's Birthday",
                    },
                    "excludedDepartments:": { S: "[]" },
                    includedDepartments: { S: "[*]" },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOLIDAY_MEMORIAL" },
                    dateStart: { N: "1653883200" },
                    dateEnd: { N: "1653969599" },
                    holiday: { S: "Memorial Day" },
                    message: { S: "Sorry, we are closed for Memorial Day" },
                    "excludedDepartments:": { S: "[]" },
                    includedDepartments: { S: "[*]" },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOLIDAY_JUNETEENTH" },
                    dateStart: { N: "1655697600" },
                    dateEnd: { N: "1655783999" },
                    holiday: { S: "Juneteenth Indepedence Day" },
                    message: {
                      S: "Sorry, we are closed for Juneteenth Indepedence Day",
                    },
                    "excludedDepartments:": { S: "[]" },
                    includedDepartments: { S: "[*]" },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOLIDAY_INDEPENDENCE" },
                    dateStart: { N: "1656907200" },
                    dateEnd: { N: "1656993599" },
                    holiday: { S: "Independence Day" },
                    message: { S: "Sorry, we are closed for Independence Day" },
                    "excludedDepartments:": { S: "[]" },
                    includedDepartments: { S: "[*]" },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOLIDAY_LABOR" },
                    dateStart: { N: "1662350400" },
                    dateEnd: { N: "1662436799" },
                    holiday: { S: "Labor Day" },
                    message: { S: "Sorry, we are closed for Labor Day" },
                    "excludedDepartments:": { S: "[]" },
                    includedDepartments: { S: "[*]" },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOLIDAY_COLUMBUS" },
                    dateStart: { N: "1665374400" },
                    dateEnd: { N: "1665460799" },
                    holiday: { S: "Columbus Day" },
                    message: { S: "Sorry, we are closed for Columbus Day" },
                    "excludedDepartments:": { S: "[]" },
                    includedDepartments: { S: "[*]" },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOLIDAY_VETERANS" },
                    dateStart: { N: "1668142800" },
                    dateEnd: { N: "1668229199" },
                    holiday: { S: "Veterans Day" },
                    message: { S: "Sorry, we are closed for Veterans Day" },
                    "excludedDepartments:": { S: "[]" },
                    includedDepartments: { S: "[*]" },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOLIDAY_THANKSGIVING" },
                    dateStart: { N: "1669266000" },
                    dateEnd: { N: "1669352399" },
                    holiday: { S: "Thanksgiving Day" },
                    message: { S: "Sorry, we are closed for Thanksgiving Day" },
                    "excludedDepartments:": { S: "[]" },
                    includedDepartments: { S: "[*]" },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOLIDAY_CHRISTMAS" },
                    dateStart: { N: "1672030800" },
                    dateEnd: { N: "1672117199" },
                    holiday: { S: "Christmas Day" },
                    message: { S: "Sorry, we are closed for Christmas Day" },
                    "excludedDepartments:": { S: "[]" },
                    includedDepartments: { S: "[*]" },
                  },
                },
              },
            ],
          },
        },
        physicalResourceId: PhysicalResourceId.of(`initDBData-holidays`),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [table.tableArn],
      }),
    });

    new AwsCustomResource(this, `initDBResource-hour-schedule-1`, {
      onCreate: {
        service: "DynamoDB",
        action: "batchWriteItem",
        parameters: {
          RequestItems: {
            HolidayCalendar: [
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_I2S" },
                    intake_2_standard: {
                      S: "9f6cd07b-aab5-4831-8753-07a9ee7bebf3",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_I3S" },
                    intake_3_standard: {
                      S: "59260d01-8997-4a59-98ae-377bbd2ec0f3",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_I5S" },
                    intake_5_standard: {
                      S: "c8136708-2bd4-40ac-a981-67b2a3243f3c",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_I7S" },
                    intake_7_standard: {
                      S: "2f1cfb7e-ff17-4070-ae1f-18d0b5ae29f3",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_I9S" },
                    intake_9_standard: {
                      S: "175f45f1-4bd7-4422-92a3-18be1016cf78",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_I2H" },
                    intake_2_holiday: {
                      S: "99478b89-a30b-491a-9817-78f3dfe36b48",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_I3H" },
                    intake_3_holiday: {
                      S: "db3e0f9f-220a-424b-883e-d9af0a27b9e1",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_I5H" },
                    intake_5_holiday: {
                      S: "26fa7bdf-8c60-4d02-b54a-dcec73f02522",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_I7H" },
                    intake_7_holiday: {
                      S: "6447c1c4-ce15-404a-8113-700b66fc491a",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_I9H" },
                    intake_9_holiday: {
                      S: "7ca01ba8-cfb0-486b-a8c4-36e3d77079d2",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_Q2S" },
                    quality_2_standard: {
                      S: "d7a116e7-07fc-42ed-a4c5-69986f7dabca",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_Q3S" },
                    quality_3_standard: {
                      S: "a2f34fc3-1486-413f-a907-c10ea8636f5c",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_Q5S" },
                    quality_5_standard: {
                      S: "8186e657-3ec6-4338-907c-c8787c200eaf",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_Q7S" },
                    quality_7_standard: {
                      S: "4ceaefef-af35-4e94-9391-48e9b4a6974b",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_Q9S" },
                    quality_9_standard: {
                      S: "711719b-b0f0-4830-830d-ad8fd20b26ec",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_Q2H" },
                    quality_2_holiday: {
                      S: "d7a116e7-07fc-42ed-a4c5-69986f7dabca",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_Q3H" },
                    quality_3_holiday: {
                      S: "a2f34fc3-1486-413f-a907-c10ea8636f5c",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_Q5H" },
                    quality_5_holiday: {
                      S: "8186e657-3ec6-4338-907c-c8787c200eaf",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_Q7H" },
                    quality_7_holiday: {
                      S: "4ceaefef-af35-4e94-9391-48e9b4a6974b",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_Q9H" },
                    quality_9_holiday: {
                      S: "6711719b-b0f0-4830-830d-ad8fd20b26ec",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_A2S" },
                    appeals_2_standard: {
                      S: "5b2cab3e-40a8-4b0f-8f43-fabb66e5c42d",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_A3S" },
                    appeals_3_standard: {
                      S: "f18428f1-a586-4af0-a9fc-1cf356acb9be",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_A5S" },
                    appeals_5_standard: {
                      S: "75c1ce9a-31f0-4460-a032-fd065fb09b23",
                    },
                  },
                },
              },
            ],
          },
        },
        physicalResourceId: PhysicalResourceId.of(`initDBData-hour-schedule-1`),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [table.tableArn],
      }),
    });

    new AwsCustomResource(this, `initDBResource-hour-schedule-2`, {
      onCreate: {
        service: "DynamoDB",
        action: "batchWriteItem",
        parameters: {
          RequestItems: {
            HolidayCalendar: [
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_A7S" },
                    appeals_7_standard: {
                      S: "2e9d3679-c3b8-4579-9558-425b74128052",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_A9S" },
                    appeals_9_standard: {
                      S: "7fa40467-842a-4258-8591-de7f3ad6dc69",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_A2H" },
                    appeals_2_holiday: {
                      S: "9f683f1a-4ff0-404a-b986-7cccbc8a33e0",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_A3H" },
                    appeals_3_holiday: {
                      S: "6d07bb75-76cd-4009-8d30-a9d4d1bfdf00",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_A5H" },
                    appeals_5_holiday: {
                      S: "06e045e1-c9a1-4f5d-a363-2df7dcabe1ff",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_A7H" },
                    appeals_7_holiday: {
                      S: "61c1a624-fb5f-4f03-9503-36dfed075ebb",
                    },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "HOUR_SCHEDULE_MAPPING_A9H" },
                    appeals_9_holiday: {
                      S: "fa5380b8-35ed-49a1-b10b-547d359c2709",
                    },
                  },
                },
              },
            ],
          },
        },
        physicalResourceId: PhysicalResourceId.of(`initDBData-hour-schedule-2`),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [table.tableArn],
      }),
    });

    // Lambda function
    const handler = new lambda.Function(this, "CalendarReadHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("./lambdas"),
      handler: "calendar_read.handler",
    });

    const lambdaPolicy = new Policy(this, "lambda-policy", {
      statements: [
        new PolicyStatement({
          actions: ["connect:DescribeHoursOfOperation"],
          resources: [
            "arn:aws:connect:us-east-1:280369178200:instance/4cf1ddaa-39f5-40a3-96d0-5e0d8e3a5680",
            "arn:aws:connect:us-east-1:280369178200:instance/4cf1ddaa-39f5-40a3-96d0-5e0d8e3a5680/operating-hours/*",
          ],
        }),
      ],
    });

    const role = handler.role;
    role?.attachInlinePolicy(lambdaPolicy);

    // Grants handler read privilege
    table.grantReadData(handler);
  }
}
