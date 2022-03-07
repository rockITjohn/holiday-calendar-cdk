import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
// import {CalendarReadLambda} from './calendar_read_lambda';
import { CalendarTableLambdaStack } from './calendar-table-lambda-stack'

export class LambdaCalendarStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CalendarTableLambdaStack(this, "CalendarTableLambdaStack");
  }
}
