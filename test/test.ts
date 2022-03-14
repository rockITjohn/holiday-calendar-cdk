const { handler } = require("../lambdas/calendar_read");
const event = {
  Details: {
    ContactData: {
      Attributes: {
        _regionCode: "_",
        _stateAbbreviation: "_",
        _stateName: "_",
        chosenUserType: "provider",
        regionCode: "2",
        stateAbbreviation: "NY",
        stateName: "New York",
        targetDepartment: "intake",
      },
      Channel: "VOICE",
      ContactId: "75452c37-8897-4e3f-9612-37b5a5ccc60c",
      CustomerEndpoint: {
        Address: "+19562440957",
        Type: "TELEPHONE_NUMBER",
      },
      CustomerId: null,
      Description: null,
      InitialContactId: "75452c37-8897-4e3f-9612-37b5a5ccc60c",
      InitiationMethod: "INBOUND",
      InstanceARN:
        "arn:aws:connect:us-east-1:280369178200:instance/4cf1ddaa-39f5-40a3-96d0-5e0d8e3a5680",
      LanguageCode: "en-US",
      MediaStreams: {
        Customer: {
          Audio: null,
        },
      },
      Name: null,
      PreviousContactId: "75452c37-8897-4e3f-9612-37b5a5ccc60c",
      Queue: null,
      References: {},
      SystemEndpoint: {
        Address: "+18665501452",
        Type: "TELEPHONE_NUMBER",
      },
    },
    Parameters: {},
  },
  Name: "ContactFlowEvent",
};

handler(event);
