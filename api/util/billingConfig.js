import { prisma } from "./prisma.js";

const DEFAULTS = {
  ESSENTIALS: {
    org: {
      orgWideCRM: false,
      orgTeammates: 0,
      readOnlyTeammates: 0,
      fundraising: false,
      emailMarketing: 0,
      smsMarketing: false,
    },
    event: {
      eventPrice: 3.0,
      maxParticipants: 75,
      eventWideCRM: 150,
      teammates: 0,
      readOnlyTeammates: 0,
      fundraising: false,
      emailMarketing: 0,
      smsMarketing: false,
      volunteerLimit: 25,
      readOnlyParticipantPortal: false,
      participantSelfServicePortal: false,
    },
  },
  STANDARD: {
    org: {
      orgWideCRM: true,
      orgTeammates: 2,
      readOnlyTeammates: 0,
      fundraising: true,
      emailMarketing: 5000,
      smsMarketing: false,
    },
    event: {
      eventPrice: 10.0,
      maxParticipants: 250,
      eventWideCRM: 750,
      teammates: 10,
      readOnlyTeammates: 0,
      fundraising: true,
      emailMarketing: 5000,
      smsMarketing: false,
      volunteerLimit: 100,
      readOnlyParticipantPortal: true,
      participantSelfServicePortal: false,
    },
  },
  PREMIUM: {
    org: {
      orgWideCRM: true,
      orgTeammates: 5,
      readOnlyTeammates: 9999999,
      fundraising: true,
      emailMarketing: 10000,
      smsMarketing: true,
    },
    event: {
      eventPrice: 20.0,
      maxParticipants: 9999999,
      eventWideCRM: 9999999,
      teammates: 20,
      readOnlyTeammates: 9999999,
      fundraising: true,
      emailMarketing: 10000,
      smsMarketing: true,
      volunteerLimit: 300,
      readOnlyParticipantPortal: true,
      participantSelfServicePortal: true,
    },
  },
  ULTIMATE: {
    org: {
      orgWideCRM: true,
      orgTeammates: 10,
      readOnlyTeammates: 9999999,
      fundraising: true,
      emailMarketing: 20000,
      smsMarketing: true,
    },
    event: {
      eventPrice: 100.0,
      maxParticipants: 9999999,
      eventWideCRM: 9999999,
      teammates: 9999999,
      readOnlyTeammates: 9999999,
      fundraising: true,
      emailMarketing: 9999999,
      smsMarketing: true,
      volunteerLimit: 9999999,
      readOnlyParticipantPortal: true,
      participantSelfServicePortal: true,
    },
  },
};

export const getBillingConfig = async (orgId) => {
  let org = await prisma.organization.findFirst({
    where: {
      id: orgId,
    },
    include: {
      billingConfig: true,
      events: {
        include: {
          billingConfig: true,
        },
      },
    },
  });

  if (!org) {
    return null;
  }

  // Make sure the org has a billingConfig. If not, create one.
  if (!org.billingConfig) {
    await prisma.organizationBillingConfig.create({
      data: {
        organizationId: org.id,
      },
    });
  }

  // Make sure each event has a billingConfig. If not, create one.
  for (let event of org.events) {
    if (!event.billingConfig) {
      await prisma.eventBillingConfig.create({
        data: {
          eventId: event.id,
        },
      });
    }
  }

  org = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    include: {
      billingConfig: true,
      events: {
        include: {
          billingConfig: true,
        },
      },
    },
  });

  const orgBillingConfig = {
    org: [
      {
        lineItem: "tier",
        lineItemHr: "Tier",
        description:
          "The tier of your organization's subscription. This can only be modified by changing your overall subscription tier.",
        defaultValue: org.billingConfig.tier,
        overwrittenValue: null,
        net: org.billingConfig.tier,
        type: "modifiable.tier",
        upgradeAvailable: false,
        cta: "Change tier",
      },
      {
        lineItem: "orgWideCRM",
        lineItemHr: "Organization-wide CRM",
        description:
          "This feature allows you to track and manage your organization's relationships with donors, volunteers, and other stakeholders. When active, it supports unlimited contacts.",
        defaultValue: DEFAULTS[org.billingConfig.tier].org.orgWideCRM,
        overwrittenValue: org.billingConfig.override__orgWideCRM,
        net:
          org.billingConfig.override__orgWideCRM ||
          DEFAULTS[org.billingConfig.tier].org.orgWideCRM,
        type: "modifiable.boolean",
        addOnPrice: 10,
        addOnPricePer: "month",
        upgradeAvailable: true,
        alreadyMaxed:
          org.billingConfig.override__orgWideCRM ||
          DEFAULTS[org.billingConfig.tier].org.orgWideCRM,
        cta: "Add to plan",
      },
      {
        lineItem: "orgTeammates",
        lineItemHr: "Organization teammates",
        description:
          "The number of teammates who can access your organization's account and contribute to events. Teammates can be assigned different roles and permissions.",
        defaultValue: DEFAULTS[org.billingConfig.tier].org.orgTeammates,
        overwrittenValue: org.billingConfig.override__orgTeammates,
        net:
          org.billingConfig.override__orgTeammates +
          DEFAULTS[org.billingConfig.tier].org.orgTeammates,
        type: "modifiable.number",
        addOnPrice: 5,
        addOnPricePer: "month per additional teammate",
        upgradeAvailable: true,
        cta: "Increase limit",
      },
      {
        lineItem: "readOnlyTeammates",
        lineItemHr: "Read-only teammates",
        description:
          "The number of teammates who can access your organization's account in a read-only capacity. Read-only teammates can view data but cannot make changes.",
        defaultValue: DEFAULTS[org.billingConfig.tier].org.readOnlyTeammates,
        overwrittenValue: org.billingConfig.override__readOnlyTeammates,
        net:
          org.billingConfig.override__readOnlyTeammates +
          DEFAULTS[org.billingConfig.tier].org.readOnlyTeammates,
        type: "modifiable.number",
        addOnPrice: 2.5,
        addOnPricePer: "month per additional teammate",
        upgradeAvailable: true,
        cta: "Increase limit",
      },
      {
        lineItem: "fundraising",
        lineItemHr: "Fundraising",
        description:
          "This feature allows you to create and manage fundraising campaigns.",
        defaultValue: DEFAULTS[org.billingConfig.tier].org.fundraising,
        overwrittenValue: org.billingConfig.override__fundraising,
        net:
          org.billingConfig.override__fundraising ||
          DEFAULTS[org.billingConfig.tier].org.fundraising,
        type: "modifiable.boolean",
        addOnPrice: 10,
        addOnPricePer: "month",
        upgradeAvailable: true,
        alreadyMaxed:
          org.billingConfig.override__fundraising ||
          DEFAULTS[org.billingConfig.tier].org.fundraising,
        cta: "Add to plan",
      },
      {
        lineItem: "emailMarketing",
        lineItemHr: "Email marketing",
        description:
          "This feature allows you to send marketing emails to your organization's contacts.",
        defaultValue: DEFAULTS[org.billingConfig.tier].org.emailMarketing,
        overwrittenValue: org.billingConfig.override__emailMarketing,
        net:
          org.billingConfig.override__emailMarketing +
          DEFAULTS[org.billingConfig.tier].org.emailMarketing,
        type: "modifiable.number",
        addOnPrice: 5,
        addOnPricePer: "month per 1,000 emails",
        upgradeAvailable: true,
        alreadyMaxed: false,
        cta: "Increase limit",
      },
      {
        lineItem: "smsMarketing",
        lineItemHr: "SMS marketing",
        description:
          "This feature allows you to send marketing text messages to your organization's contacts.",
        defaultValue: DEFAULTS[org.billingConfig.tier].org.smsMarketing,
        overwrittenValue: org.billingConfig.override__smsMarketing,
        net:
          org.billingConfig.override__smsMarketing ||
          DEFAULTS[org.billingConfig.tier].org.smsMarketing,
        type: "modifiable.boolean",
        addOnPrice: 10,
        addOnPricePer: "month + 1 cent per message",
        upgradeAvailable: true,
        alreadyMaxed:
          org.billingConfig.override__smsMarketing ||
          DEFAULTS[org.billingConfig.tier].org.smsMarketing,
        cta: "Add to plan",
      },
    ],

    events: org.events.map((event) => {
      return {
        eventId: event.id,
        eventName: event.name,
        lineItems: [
          {
            lineItem: "eventPrice",
            lineItemHr: "Event price",
            description:
              "The price of participating in this event. This price is charged to each participant.",
            defaultValue: DEFAULTS[org.billingConfig.tier].event.eventPrice,
            overwrittenValue: event.billingConfig.override__eventPrice,
            net:
              event.billingConfig.override__eventPrice ||
              DEFAULTS[org.billingConfig.tier].event.eventPrice,
            type: "modifiable.number",
            upgradeAvailable: false,
          },
          {
            lineItem: "maxParticipants",
            lineItemHr: "Maximum participants",
            description:
              "The maximum number of participants who can register for this event.",
            defaultValue:
              DEFAULTS[org.billingConfig.tier].event.maxParticipants,
            overwrittenValue: event.billingConfig.override__maxParticipants,
            net:
              event.billingConfig.override__maxParticipants +
              DEFAULTS[org.billingConfig.tier].event.maxParticipants,
            type: "modifiable.number",
            addOnPrice: 1,
            addOnPricePer: "month per 50 additional participants",
            upgradeAvailable: true,
          },
          {
            lineItem: "eventWideCRM",
            lineItemHr: "Event-wide CRM",
            description:
              "This feature allows you to track and manage your event's relationships with participants, donors, volunteers, and other stakeholders. When active, it supports unlimited contacts.",
            defaultValue: DEFAULTS[org.billingConfig.tier].event.eventWideCRM,
            overwrittenValue: event.billingConfig.override__eventWideCRM,
            net:
              event.billingConfig.override__eventWideCRM +
              DEFAULTS[org.billingConfig.tier].event.eventWideCRM,
            type: "modifiable.number",
            addOnPrice: 10,
            addOnPricePer: "month per 1,000 additional contacts",
            upgradeAvailable: true,
          },
          {
            lineItem: "teammates",
            lineItemHr: "Event teammates",
            description:
              "The number of teammates who can access this event's account and contribute to the event. Teammates can be assigned different roles and permissions.",
            defaultValue: DEFAULTS[org.billingConfig.tier].event.teammates,
            overwrittenValue: event.billingConfig.override__eventTeammates,
            net:
              event.billingConfig.override__eventTeammates +
              DEFAULTS[org.billingConfig.tier].event.teammates,
            type: "modifiable.number",
            addOnPrice: 5,
            addOnPricePer: "month per additional teammate",
            upgradeAvailable: true,
          },
          {
            lineItem: "readOnlyTeammates",
            lineItemHr: "Read-only teammates",
            description:
              "The number of teammates who can access this event's account in a read-only capacity. Read-only teammates can view data but cannot make changes.",
            defaultValue:
              DEFAULTS[org.billingConfig.tier].event.readOnlyTeammates,
            overwrittenValue: event.billingConfig.override__readOnlyTeammates,
            net:
              event.billingConfig.override__readOnlyTeammates +
              DEFAULTS[org.billingConfig.tier].event.readOnlyTeammates,
            type: "modifiable.number",
            addOnPrice: 2.5,
            addOnPricePer: "month per additional teammate",
            upgradeAvailable: true,
          },
          {
            lineItem: "fundraising",
            lineItemHr: "Fundraising",
            description:
              "This feature allows you to create and manage fundraising campaigns for this event.",
            defaultValue: DEFAULTS[org.billingConfig.tier].event.fundraising,
            overwrittenValue: event.billingConfig.override__fundraising,
            net:
              event.billingConfig.override__fundraising ||
              DEFAULTS[org.billingConfig.tier].event.fundraising,
            type: "modifiable.boolean",
            addOnPrice: 10,
            addOnPricePer: "month",
            upgradeAvailable: true,
            alreadyMaxed:
              event.billingConfig.override__fundraising ||
              DEFAULTS[org.billingConfig.tier].event.fundraising,
          },
          {
            lineItem: "emailMarketing",
            lineItemHr: "Email marketing",
            description:
              "This feature allows you to send marketing emails to your event's contacts.",
            defaultValue: DEFAULTS[org.billingConfig.tier].event.emailMarketing,
            overwrittenValue: event.billingConfig.override__emailMarketing,
            net:
              event.billingConfig.override__emailMarketing +
              DEFAULTS[org.billingConfig.tier].event.emailMarketing,
            type: "modifiable.number",
            addOnPrice: 5,
            addOnPricePer: "month per 1,000 emails",
            upgradeAvailable: true,
          },
          {
            lineItem: "smsMarketing",
            lineItemHr: "SMS marketing",
            description:
              "This feature allows you to send marketing text messages to your event's contacts.",
            defaultValue: DEFAULTS[org.billingConfig.tier].event.smsMarketing,
            overwrittenValue: event.billingConfig.override__smsMarketing,
            net:
              event.billingConfig.override__smsMarketing ||
              DEFAULTS[org.billingConfig.tier].event.smsMarketing,
            type: "modifiable.boolean",
            addOnPrice: 10,
            addOnPricePer: "month + 1 cent per message",
            upgradeAvailable: true,
            alreadyMaxed:
              event.billingConfig.override__smsMarketing ||
              DEFAULTS[org.billingConfig.tier].event.smsMarketing,
          },
          {
            lineItem: "volunteerLimit",
            lineItemHr: "Volunteer limit",
            description:
              "The maximum number of volunteers who can register for this event.",
            defaultValue: DEFAULTS[org.billingConfig.tier].event.volunteerLimit,
            overwrittenValue: event.billingConfig.override__volunteerLimit,
            net:
              event.billingConfig.override__volunteerLimit +
              DEFAULTS[org.billingConfig.tier].event.volunteerLimit,
            type: "modifiable.number",
            addOnPrice: 1,
            addOnPricePer: "month per 50 additional volunteers",
            upgradeAvailable: true,
          },
          {
            lineItem: "readOnlyParticipantPortal",
            lineItemHr: "Read-only participant portal",
            description:
              "This feature allows participants to view their registration details and event information but not make changes.",
            defaultValue:
              DEFAULTS[org.billingConfig.tier].event.readOnlyParticipantPortal,
            overwrittenValue: event.billingConfig.override__participantPortal,
            net:
              event.billingConfig.override__participantPortal ||
              DEFAULTS[org.billingConfig.tier].event.readOnlyParticipantPortal,
            type: "modifiable.boolean",
            addOnPrice: 10,
            addOnPricePer: "month",
            upgradeAvailable: true,
            alreadyMaxed:
              event.billingConfig.override__participantPortal ||
              DEFAULTS[org.billingConfig.tier].event.readOnlyParticipantPortal,
          },
          {
            lineItem: "participantSelfServicePortal",
            lineItemHr: "Participant self-service portal",
            description:
              "This feature allows participants to view and update their registration details and event information.",
            defaultValue:
              DEFAULTS[org.billingConfig.tier].event
                .participantSelfServicePortal,
            overwrittenValue:
              event.billingConfig.override__participantSelfServicePortal,
            net:
              event.billingConfig.override__participantSelfServicePortal ||
              DEFAULTS[org.billingConfig.tier].event
                .participantSelfServicePortal,
            type: "modifiable.boolean",
            addOnPrice: 10,
            addOnPricePer: "month",
            upgradeAvailable: true,
            alreadyMaxed:
              event.billingConfig.override__participantSelfServicePortal ||
              DEFAULTS[org.billingConfig.tier].event
                .participantSelfServicePortal,
          },
        ],
      };
    }),
  };

  return orgBillingConfig;
};
