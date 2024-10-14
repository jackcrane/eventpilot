import React, { useState } from "react";
import "./home.global.css";
import styles from "./home.module.css";
import logo from "../assets/logo-horizontal-100.png";
import classNames from "classnames";
import Marquee from "react-fast-marquee";
import {
  IconBuilding,
  IconBuildingChurch,
  IconCircleCheck,
  IconCircleX,
  IconConfetti,
  IconCopyCheck,
  IconCurrencyDollar,
  IconDirections,
  IconFlare,
  IconGift,
  IconHandLoveYou,
  IconHandStop,
  IconHeartHandshake,
  IconLine,
  IconLogs,
  IconMail,
  IconPlayerSkipForward,
  IconPodium,
  IconPoint,
  IconPointFilled,
  IconRun,
  IconSchool,
  IconSignature,
  IconTicket,
  IconUsersGroup,
} from "@tabler/icons-react";
import { EPMarquee } from "./marquee";
import { useUser } from "../util/UserProvider";
import useAuth from "../hooks/useAuth";
import { Util } from "tabler-react-2";

const r = (arr) => arr.sort(() => Math.random() - 0.5);

const features = [
  [
    "Organization Administration",
    "All the tools you need to help run your organization. Keep track of a shared todo list, manage volunteers, event participants, mailing list contacts, and more.",
    IconBuilding,
  ],
  [
    "Event Organization",
    "Manage all aspects of your event, from registration to analytics. Create and manage events, track participants, and more.",
    IconLine,
  ],
  [
    "Todo Tracking",
    "Keep track of what needs to be done on a shared todo list. Assign tasks to team members, set due dates, track the history of each todo card, and more.",
    IconCopyCheck,
  ],
  [
    "Advanced Analytics",
    "Get insights into your organization's performance. Track event attendance, donation amounts, volunteer hours, and more. Track performance time over time and compare to historical data.",
    IconLogs,
  ],
  [
    "CRM",
    "Manage your contacts and keep track of all your interactions with them. Keep track of donations, event attendance, volunteerism, correspondance, and more.",
    IconDirections,
  ],
  [
    "Volunteer Recruitment",
    "Recruit volunteers for your events. Allow volunteers to sign up for shifts that work for them, and keep track of their hours.",
    IconHeartHandshake,
  ],
  [
    "Donation Management",
    "Accept donations online. Keep track of donation amounts through our secure donation portal, donor information, and more.",
    IconCurrencyDollar,
  ],
  [
    "Email Marketing",
    "Send out emails to your mailing list. Keep track of who opens your emails, who clicks on links, and more. Recieve automated suggestions on email content and timing.",
    IconMail,
  ],
  [
    "Volunteer Management",
    "Manage your volunteers. Keep track of their hours, assign them to shifts, check them in and out, understand workforce and more.",
    IconHeartHandshake,
  ],
  [
    "Participant Registration",
    "Allow participants to register for your events. Keep track of their registration information, send them reminders, keep track of waivers, provide upsells, and more.",
    IconSignature,
  ],
  [
    "Ticketing",
    "Sell tickets to your events. Keep track of ticket sales, provide discounts, track ticket usage, and more.",
    IconTicket,
  ],
];

const eventTypes = [
  ["Conferences", IconPodium],
  ["Concerts", IconHandLoveYou],
  ["Festivals", IconConfetti],
  ["5K's", IconRun],
  ["Marathons", IconRun],
  ["Charity Events", IconGift],
  ["Church Festivals", IconBuildingChurch],
  ["School Events", IconSchool],
  ["Fundraisers", IconCurrencyDollar],
  ["Political Events", IconHandStop],
  ["Community Events", IconUsersGroup],
];

export const HomeComponent = () => {
  const { isLoggedIn, user } = useAuth();
  return (
    <div className={styles.allContainer}>
      <header className={styles.header}>
        <div className={styles.row}>
          <div className={styles.ic}>
            <img src={logo} alt="logo" className={styles.headerImage} />
          </div>
          {isLoggedIn ? (
            <a href="/dashboard" className={styles.headerButton}>
              Dashboard
            </a>
          ) : (
            <a href="/auth/login" className={styles.headerButton}>
              Login
            </a>
          )}
        </div>
      </header>
      <hr className={styles.hr} />
      <Marquee>
        {r(features).map((feature) => (
          <div key={feature} className={styles.feature}>
            <span className={styles.featureIcon}>
              <IconFlare />
            </span>
            {feature[0]}
          </div>
        ))}
      </Marquee>
      <hr className={styles.hr} />
      <div className={styles.ic}>
        <h1 className={styles.hugeTitle}>
          The{" "}
          <span style={{ fontStyle: "italic" }} className={styles.highlight}>
            best
          </span>{" "}
          events run on <span className={styles.highlight}>EventPilot</span>.
        </h1>
      </div>
      <hr className={styles.hr} />
      <div className={styles.row} style={{ height: 300 }}>
        <div className={styles.splitLeft}>
          <EPMarquee direction="up">
            {r(eventTypes).map(([eventType, Icon]) => (
              <div key={eventType} className={styles.eventType}>
                <span className={styles.eventTypeIcon}>
                  <Icon size={32} />
                </span>
                {eventType}
              </div>
            ))}
          </EPMarquee>
        </div>
        <div className={styles.splitRight}>
          <span className={classNames(styles.highlight, styles.mini)}>
            A flexible platform for all your event needs.
          </span>
          <h2 className={styles.hugeTitle}>
            Host{" "}
            <i>
              <span className={styles.highlight}>everything</span>
            </i>
          </h2>
        </div>
      </div>
      <hr className={styles.hr} />
      <h3 className={styles.hugeTitle}>
        <div className={styles.ic}>
          <span className={styles.highlight}>All your tools</span>, all in one
          place.
        </div>
      </h3>
      <hr className={styles.hr} />
      <div>
        <div className="hightFixedMarquee">
          <Marquee pauseOnHover>
            {r(features).map(([title, description, Icon]) => (
              <div key={title} className={styles.featureCard}>
                <div className={styles.featureCardIcon}>
                  {Icon && <Icon size={64} />}
                </div>
                <h4 className={styles.hugeTitle}>{title}</h4>
                <p>{description}</p>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
      <hr className={styles.hr} />
      <div>
        <div className={styles.ic}>
          <h2 className={styles.hugeTitle}>
            Priced for{" "}
            <span className={styles.highlight}>your organization</span>.
          </h2>
          <div className={styles.pricingTable}>
            {/* Top Row */}
            <>
              <div />
              <div className={styles.pricingTablePlan}>
                <h4 className={styles.hugeTitle}>Essentials</h4>
                <p>
                  Our most basic plan for small events and small organizations
                </p>
                <p>
                  <h5 className={styles.price}>$10</h5>/month
                </p>
              </div>
              <div className={styles.pricingTablePlan}>
                <h4 className={styles.hugeTitle}>Standard</h4>
                <p>
                  Our most popular plan for medium-sized events and
                  organizations
                </p>
                <p>
                  <h5 className={styles.price}>$50</h5>/month
                </p>
              </div>
              <div className={styles.pricingTablePlan}>
                <h4 className={styles.hugeTitle}>Premium</h4>
                <p>
                  An advanced plan for large events and organizations with
                  complex needs
                </p>
                <p>
                  <h5 className={styles.price}>$100</h5>/month
                </p>
              </div>
              <div className={styles.pricingTablePlan}>
                <h4 className={styles.hugeTitle}>Ultimate</h4>
                <p>
                  Our most advanced plan for the largest events and
                  organizations
                </p>
                <p>
                  <h5 className={styles.price}>Contact</h5>
                </p>
              </div>
            </>

            {/* Features */}
            {FEATURES.map((feature) => (
              <FeatureRow key={feature.header} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureRow = ({ feature }) => {
  const __ = (level, last) => {
    return (
      <div
        className={styles.pricingTableInclusion}
        style={{
          borderBottom: !last ? "none" : "1px solid #000",
        }}
      >
        {level === true ? (
          <IconCircleCheck size={24} className={styles.green} />
        ) : level === false ? (
          <IconCircleX size={24} className={styles.red} />
        ) : (
          <span className={styles.gray}>{level}</span>
        )}
      </div>
    );
  };

  if (feature.type === "section") {
    return (
      <div
        className={styles.pricingTableSection}
        style={{
          gridColumn: "span 5",
        }}
      >
        <h2>{feature.header}</h2>
      </div>
    );
  }

  return (
    <>
      <div
        className={styles.pricingTableFeature}
        style={{
          borderBottom: !feature.last ? "none" : "1px solid #000",
        }}
      >
        <h3>{feature.header}</h3>
        {/* <p>{feature.description}</p> */}
      </div>

      {__(feature.essentials, feature.last)}
      {__(feature.standard, feature.last)}
      {__(feature.premium, feature.last)}
      {__(feature.ultimate, feature.last)}
    </>
  );
};

const FEATURES = [
  {
    type: "section",
    header: "Organization Tools",
  },
  {
    header: "Organization Administration",
    description: "The basic tools configure your organization.",
    essentials: true,
    standard: true,
    premium: true,
    ultimate: true,
  },
  {
    header: "Organization Todo List Management",
    description: "Keep track of what needs to be done on a shared todo list.",
    essentials: true,
    standard: true,
    premium: true,
    ultimate: true,
  },
  {
    header: "Organization-wide log-based Analytics",
    description: "See everything that happens in your organization and events.",
    essentials: "Critical logs only †",
    standard: true,
    premium: true,
    ultimate: true,
  },
  {
    header: "Organization-wide CRM",
    description:
      "Keep track of all your contacts and interactions with them across different events.",
    essentials: false,
    standard: true,
    premium: true,
    ultimate: true,
  },
  {
    header: "Organization Teammates",
    description:
      "Add teammates to your organization and automatically add them to events.",
    essentials: false,
    standard: "2 team members ‡",
    premium: "5 team members ‡",
    ultimate: true,
  },
  {
    header: "Read-only Teammates",
    description:
      "Add read-only teammates to your organization and automatically add them to events.",
    essentials: false,
    standard: false,
    premium: true,
    ultimate: true,
  },
  {
    header: "Organizational fundraising §",
    description: "Accept donations online.",
    essentials: false,
    standard: true,
    premium: true,
    ultimate: true,
  },
  {
    header: "Transactional emails",
    description: "Send out transactional emails to your mailing list.",
    essentials: true,
    standard: true,
    premium: true,
    ultimate: true,
  },
  {
    header: "Organizational email marketing",
    description: "Send out emails to your mailing list.",
    essentials: false,
    standard: "5000 emails/month ¶",
    premium: "10000 emails/month ¶",
    ultimate: true,
  },
  {
    header: "Organizational SMS marketing",
    description: "Send out SMS messages to your mailing list.",
    essentials: false,
    standard: false,
    premium: "1 cent per message",
    ultimate: "1 cent per message",
  },
  {
    header: "Unlimited events",
    description: "Create as many events as you want.",
    essentials: "$3/month per event",
    standard: "$10/month per event",
    premium: "$20/month per event",
    ultimate: "Contact",
    last: true,
  },
  {
    type: "section",
    header: "Event Tools",
  },
  {
    header: "Event Administration",
    description: "The basic tools configure your event.",
    essentials: true,
    standard: true,
    premium: true,
    ultimate: true,
  },
  {
    header: "Unlimited event participants",
    description: "Host as many event particiapnts as you want.",
    essentials: "75 Participants",
    standard: "250 Participants",
    premium: true,
    ultimate: true,
  },
  {
    header: "Event Todo List Management",
    description: "Keep track of what needs to be done on a shared todo list.",
    essentials: true,
    standard: true,
    premium: true,
    ultimate: true,
  },
  {
    header: "Event-level log-based Analytics",
    description: "See everything that happens in your event.",
    essentials: "Critical logs only †",
    standard: true,
    premium: true,
    ultimate: true,
  },
  {
    header: "Event-wide CRM",
    description:
      "Keep track of all your contacts and interactions with them in a single event.",
    essentials: "150 Contacts",
    standard: "750 Contacts",
    premium: true,
    ultimate: true,
  },
  {
    header: "Event Teammates",
    description:
      "Add teammates to your event and automatically add them to shifts.",
    essentials: false,
    standard: "10 team members ‡",
    premium: "20 team members ‡",
    ultimate: true,
  },
  {
    header: "Read-only Teammates",
    description:
      "Add read-only teammates to your event and automatically add them to shifts.",
    essentials: false,
    standard: false,
    premium: true,
    ultimate: true,
  },
  {
    header: "Event fundraising §",
    description: "Accept donations online.",
    essentials: false,
    standard: true,
    premium: true,
    ultimate: true,
  },
  {
    header: "Transactional emails",
    description: "Send out transactional emails to your event participants.",
    essentials: true,
    standard: true,
    premium: true,
    ultimate: true,
  },
  {
    header: "Event email marketing",
    description: "Send out emails to your event participants.",
    essentials: false,
    standard: "5000 emails/month ¶",
    premium: "10000 emails/month ¶",
    ultimate: true,
  },
  {
    header: "Event SMS marketing",
    description: "Send out SMS messages to your event participants.",
    essentials: false,
    standard: false,
    premium: "1 cent per message",
    ultimate: "1 cent per message",
  },
  {
    header: "Unlimited Volunteer Registration",
    description: "Allow volunteers to register for your event.",
    essentials: "25 Volunteers",
    standard: "100 Volunteers",
    premium: "300 Volunteers",
    ultimate: true,
    last: true,
  },
  {
    type: "section",
    header: "Participant Tools",
  },
  {
    header: "Read-Only Participant Portal",
    description:
      "Allow your participants to view information about their registration.",
    essentials: false,
    standard: true,
    premium: true,
    ultimate: true,
  },
  {
    header: "Participant Self-Service Portal",
    description:
      "Allow your participants to edit their registration information.",
    essentials: false,
    standard: false,
    premium: true,
    ultimate: true,
  },
];
