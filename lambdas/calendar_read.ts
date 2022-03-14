import 'dotenv/config'
import momentTz from 'moment-timezone'
import {
  ConnectClient,
  DescribeHoursOfOperationCommand,
  HoursOfOperation,
} from '@aws-sdk/client-connect'
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'

const scheduleIds: { [key: string]: string } = {
  intake_2_standard: "9f6cd07b-aab5-4831-8753-07a9ee7bebf3",
  intake_3_standard: "59260d01-8997-4a59-98ae-377bbd2ec0f3",
  intake_5_standard: "c8136708-2bd4-40ac-a981-67b2a3243f3c",
  intake_7_standard: "2f1cfb7e-ff17-4070-ae1f-18d0b5ae29f3",
  intake_9_standard: "175f45f1-4bd7-4422-92a3-18be1016cf78",
  intake_2_holiday: "99478b89-a30b-491a-9817-78f3dfe36b48",
  intake_3_holiday: "db3e0f9f-220a-424b-883e-d9af0a27b9e1",
  intake_5_holiday: "26fa7bdf-8c60-4d02-b54a-dcec73f02522",
  intake_7_holiday: "6447c1c4-ce15-404a-8113-700b66fc491a",
  intake_9_holiday: "7ca01ba8-cfb0-486b-a8c4-36e3d77079d2",
  quality_2_standard: "d7a116e7-07fc-42ed-a4c5-69986f7dabca",
  quality_3_standard: "a2f34fc3-1486-413f-a907-c10ea8636f5c",
  quality_5_standard: "8186e657-3ec6-4338-907c-c8787c200eaf",
  quality_7_standard: "4ceaefef-af35-4e94-9391-48e9b4a6974b",
  quality_9_standard: "6711719b-b0f0-4830-830d-ad8fd20b26ec",
  quality_2_holiday: "d7a116e7-07fc-42ed-a4c5-69986f7dabca",
  quality_3_holiday: "a2f34fc3-1486-413f-a907-c10ea8636f5c",
  quality_5_holiday: "8186e657-3ec6-4338-907c-c8787c200eaf",
  quality_7_holiday: "4ceaefef-af35-4e94-9391-48e9b4a6974b",
  quality_9_holiday: "6711719b-b0f0-4830-830d-ad8fd20b26ec",
  appeals_2_standard: "5b2cab3e-40a8-4b0f-8f43-fabb66e5c42d",
  appeals_3_standard: "f18428f1-a586-4af0-a9fc-1cf356acb9be",
  appeals_5_standard: "75c1ce9a-31f0-4460-a032-fd065fb09b23",
  appeals_7_standard: "2e9d3679-c3b8-4579-9558-425b74128052",
  appeals_9_standard: "7fa40467-842a-4258-8591-de7f3ad6dc69",
  appeals_2_holiday: "9f683f1a-4ff0-404a-b986-7cccbc8a33e0",
  appeals_3_holiday: "6d07bb75-76cd-4009-8d30-a9d4d1bfdf00",
  appeals_5_holiday: "06e045e1-c9a1-4f5d-a363-2df7dcabe1ff",
  appeals_7_holiday: "61c1a624-fb5f-4f03-9503-36dfed075ebb",
  appeals_9_holiday: "fa5380b8-35ed-49a1-b10b-547d359c2709",
};

const AWS_CONNECT_INSTANCE_ID = "4cf1ddaa-39f5-40a3-96d0-5e0d8e3a5680";

type CallApiForHours = (
  hoursOfOperationId: string
) => Promise<HoursOfOperation>;

interface CheckHourStatusParams {
  isHoliday: boolean;
  regionCode: number;
  departmentName: string;
}

interface CheckHourStatusOutput {
  inHours: boolean;
  hoursOfOperationScheduleName: string;
}

type CheckHourStatus = (
  params: CheckHourStatusParams
) => Promise<CheckHourStatusOutput>;

// if (!process.env.AWS_CONNECT_INSTANCE_ID)
//   throw new Error("Missing Amazon Connect instance ID in .env (dotenv lib)");
if (!AWS_CONNECT_INSTANCE_ID)
  throw new Error("Missing Amazon Connect instance ID");

const instanceId: string = AWS_CONNECT_INSTANCE_ID;

const connectClient = new ConnectClient({});
const ddbClient = new DynamoDBClient({});

const callApiForHours: CallApiForHours = async (hoursOfOperationId) => {
  const command = new DescribeHoursOfOperationCommand({
    InstanceId: instanceId,
    HoursOfOperationId: hoursOfOperationId,
  });
  const response = await connectClient.send(command);
  if (!response?.HoursOfOperation)
    throw "Invalid API response:" + JSON.stringify(response);
  const item: HoursOfOperation = response?.HoursOfOperation;
  return item;
};

const scheduleId = "1f66f893-8b66-4611-b98f-8d824e48883d";

const checkHourStatus: CheckHourStatus = async (params) => {
  // build the access key for the SSM param
  let relevantHourlyScheduleKey = `${params.departmentName}_${
    params.regionCode
  }_${params.isHoliday ? "holiday" : "standard"}`;

  // now try to read this object key from the dictionary object
  const hoursOfOperationId = scheduleIds[relevantHourlyScheduleKey];
  if (!hoursOfOperationId)
    throw new Error(
      `${relevantHourlyScheduleKey} is not a valid business schedule key in the lambda mapping when determining the appropriate AWS hours of operation ID. This key was built from the lambda parameters: "regionCode" and "departmentName"`
    );

  const relevantHourlySchedule = await callApiForHours(hoursOfOperationId);
  console.log(
    "Result of callApiForHours",
    JSON.stringify(relevantHourlySchedule)
  );

  if (
    !relevantHourlySchedule ||
    !relevantHourlySchedule.Name ||
    !relevantHourlySchedule.Config
  )
    throw new Error(
      `AWS Connect is missing the requested schedule  ${relevantHourlyScheduleKey} (AWS ID ${scheduleId})`
    );

  if (!relevantHourlySchedule.TimeZone)
    throw new Error(
      `Missing timezone in hourly schedule ${relevantHourlyScheduleKey} (AWS ID ${scheduleId})`
    );
  const moment = momentTz.tz(relevantHourlySchedule.TimeZone); // standardized timezone code from Connect hour schedule

  // Calculate numbers for comparison to the time periods in this Connect hourly schedule.
  const thisDate = {
    /** @example MONDAY */
    day:
      process.env.TEST_DAY ||
      momentTz(moment, "YYYY-MM-DD HH:mm:ss").format("dddd").toUpperCase(),
    /** @example 9 or 13 */
    hour: process.env.TEST_HOUR || moment.hour(),
    /** @example 59 */
    minute: process.env.TEST_MINUTE || moment.minute(),
  };
  console.log("thisDate in checkHourStatus", JSON.stringify(thisDate));

  const scheduledDay = relevantHourlySchedule.Config.find(
    (dailySched) => dailySched.Day == thisDate.day
  );

  const inHours = ((sd, d, sn) => {
    console.log("sd", JSON.stringify(sd));
    console.log("d", JSON.stringify(d));
    if (
      /* ^ -> is valid api response */
      sd &&
      sd.StartTime &&
      sd.EndTime &&
      typeof sd.StartTime === "object" &&
      typeof sd.StartTime.Hours === "number" &&
      typeof sd.StartTime.Minutes === "number" &&
      typeof sd.EndTime === "object" &&
      typeof sd.EndTime.Hours === "number" &&
      typeof sd.EndTime.Minutes === "number"
    ) {
      if (
        // TODO: Need to test this for 24 hour schedules
        sd.StartTime.Hours === 0 &&
        sd.EndTime.Hours === 0 &&
        sd.StartTime.Minutes === 0 &&
        sd.EndTime.Minutes === 0
      ) {
        return true; // 24 hour schedule
      } else if (
        // If hour lands between start and end hour
        d.hour > sd.StartTime.Hours &&
        d.hour < sd.EndTime.Hours
      ) {
        return true;
      } else if (
        // If d.Hour lands on sd.StartTime.Hours
        d.hour == sd.StartTime.Hours
      ) {
        return d.minute >= sd.StartTime.Minutes;
      } else if (
        // Check if hour lands on sd.EndTime.Hours
        d.hour == sd.EndTime.Hours
      ) {
        return d.minute < sd.EndTime.Minutes;
      } else {
        return false;
      }
    } else {
      // failed validation on scheduled day object from API response
      console.info(
        `${relevantHourlyScheduleKey} (AWS ID ${scheduleId}) is missing an hourly definition for ${d.day}, and will be marked as CLOSED`
      );
      console.info(sd, d);
      return false;
    }
    return false;
  })(scheduledDay, thisDate);

  return {
    inHours,
    hoursOfOperationScheduleName: relevantHourlySchedule.Name,
  };
};

const checkHolidayCalendar = async () => {
  const dateNow = Math.floor(Date.now() / 1000.0);
  const scanningParams = {
    TableName: "HolidayCalendar",
    Limit: 100,
    FilterExpression: ":dateNow between dateStart and dateEnd",
    ExpressionAttributeValues: {
      ":dateNow": {
        N: dateNow.toString(),
      },
    },
    ReturnConsumedCapacity: "TOTAL",
  };

  let data = await ddbClient.send(new ScanCommand(scanningParams));
  console.log("Return from DB scan", data);

  // @ts-ignore
  let ddbOutput = data.Items[0];
  if (!ddbOutput) {
    return {
      isHoliday: false,
      message: "Not a holiday",
    };
  } else {
    return {
      isHoliday: true,
      message: ddbOutput.message,
    };
  }
};

exports.handler = async (event: any) => {
  const { targetDepartment, regionCode } = event.Details.ContactData.Attributes;
  const departmentName = targetDepartment;

  try {
    const { isHoliday, message } = await checkHolidayCalendar();
    console.log(
      "Results from checkHolidayCalendar",
      { isHoliday },
      { message }
    );

    const { inHours, hoursOfOperationScheduleName } = await checkHourStatus({
      isHoliday,
      regionCode,
      departmentName,
    });
    console.log(
      "Results from checkHourStatus",
      { inHours },
      { hoursOfOperationScheduleName }
    );

    return {
      isHoliday,
      message,
      inHours,
      hoursOfOperationScheduleName,
    };
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};
