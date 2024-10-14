import React from "react";
import { Page } from "../../../../components/page";
import { useParams } from "react-router-dom";
import { sidenavItems } from ".";
import { usePayment } from "../../../../hooks/usePayment";
import { Loading } from "../../../../components/loading";
import { Card, Typography, Util } from "tabler-react-2";
import { Table } from "tabler-react-2/dist/table";
import { useModal } from "tabler-react-2/dist/modal";
import {
  IconCheck,
  IconPencil,
  IconPencilDollar,
  IconX,
} from "@tabler/icons-react";
import { Button } from "tabler-react-2/dist/button";
const { H1, H2, Text } = Typography;

String.prototype.toSentenceCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

export const Billing = () => {
  const { organizationId } = useParams();
  const { data, loading } = usePayment(organizationId);

  const { modal, ModalElement } = useModal();

  const Q = ({ r }) => {
    return (
      <a
        style={{
          borderBottom: "1px dotted #393939",
          cursor: "pointer",
        }}
        onClick={() => modal({ text: r.x, title: r.t })}
      >
        ?
      </a>
    );
  };

  if (loading) {
    return (
      <Page sidenavItems={sidenavItems(organizationId, "Billing")}>
        <Loading />
      </Page>
    );
  }

  return (
    <Page sidenavItems={sidenavItems(organizationId, "Billing")}>
      <H1>Billing</H1>
      <Text>
        This page details your billing information across your entire
        organization.
      </Text>
      <Util.Row gap={1} style={{ alignItems: "flex-start" }}>
        <Card title="Invoices" style={{ width: "30%" }}>
          {data.invoices.length === 0 ? (
            <Text>No invoices found</Text>
          ) : (
            invoices.map((invoice) => <Text>Invoice {invoice.id}</Text>)
          )}
        </Card>
        <Card title="This Period" style={{ width: "30%" }}></Card>
        <Card title="Payment Information" style={{ width: "40%" }}>
          {data.paymentInfo.paymentMethod?.brand ? (
            <Text>
              <strong>Payment Method:</strong>{" "}
              {data.paymentInfo.paymentMethod.brand} ****
              {data.paymentInfo.paymentMethod.last4}
            </Text>
          ) : (
            <Text>No payment method on file</Text>
          )}
          <Button
            href={data.paymentInfo.portalLink}
            variant={
              data.paymentInfo.requiresPaymentMethod ? "primary" : "default"
            }
          >
            Manage Payment Methods
          </Button>
        </Card>
      </Util.Row>
      <Util.Hr />
      <H1>Customize Billing</H1>
      <H2>Your entire event</H2>
      {AddOnTable(Q, modal, data.billingConfig.org)}
      <Util.Spacer size={2} />
      <H2>Per event</H2>
      {data.billingConfig.events.map((event) => (
        <div key={event.id}>
          <h3>{event.eventName || event.eventId}</h3>
          {AddOnTable(Q, modal, event.lineItems)}
          <Util.Spacer size={2} />
        </div>
      ))}
      {ModalElement}
    </Page>
  );
};

function AddOnTable(Q, modal, data) {
  return (
    <Table
      columns={[
        {
          label: "Line Item",
          accessor: "lineItemHr",
          render: (_, row) => (
            <span>
              {row.lineItemHr}{" "}
              <Q r={{ t: row.lineItemHr, x: row.description }} />
            </span>
          ),
        },
        {
          label: (
            <span>
              Default Value{" "}
              <Q
                r={{
                  t: "Default Value",
                  x: "The default value is the value of each attribute that is specified by your subscription tier.",
                }}
              />
            </span>
          ),
          accessor: "defaultValue",
          render: (cell) =>
            typeof cell === "number" ? (
              `${cell}`
            ) : typeof cell === "string" ? (
              cell.toSentenceCase()
            ) : typeof cell === "boolean" ? (
              cell ? (
                <IconCheck size={16} />
              ) : (
                <IconX size={16} />
              )
            ) : (
              JSON.stringify(cell)
            ),
        },
        {
          label: (
            <span>
              Modified Value{" "}
              <Q
                r={{
                  t: "Modified Value",
                  x: 'The modified value reflects any modifications made to the default value. These modifications can be made by you purchasing additional credits, or by a member of the EventPilot team. On some fields, the modified value serves as a replacement for the default value, while on others, it serves as an addition to the default value. Check the "net value" column to see the final value that will be used in calculations.',
                }}
              />
            </span>
          ),
          accessor: "overwrittenValue",
          render: (cell) =>
            typeof cell === "number" ? (
              `${cell}`
            ) : typeof cell === "string" ? (
              cell.toSentenceCase()
            ) : typeof cell === "boolean" ? (
              cell ? (
                <IconCheck size={16} />
              ) : (
                <IconX size={16} />
              )
            ) : // Null:
            cell === null ? (
              <span style={{ color: "gray" }}>
                N/A{" "}
                <Q
                  r={{
                    t: "Null fields",
                    x: "Some fields cannot be overwritten, like the tier. Changes to these fields will apply at the highest level and will not be considered a modification to the existing plan.",
                  }}
                />
              </span>
            ) : (
              JSON.stringify(cell)
            ),
        },
        {
          label: (
            <span>
              Net Value{" "}
              <Q
                r={{
                  t: "Net Value",
                  x: "The net value is the final value that will be used in calculations. It is calculated by applying the modified value to the default value.",
                }}
              />
            </span>
          ),
          accessor: "net",
          render: (cell) =>
            typeof cell === "number" ? (
              `${cell}`
            ) : typeof cell === "string" ? (
              cell.toSentenceCase()
            ) : typeof cell === "boolean" ? (
              cell ? (
                <IconCheck size={16} />
              ) : (
                <IconX size={16} />
              )
            ) : // Null:
            cell === null ? (
              <span style={{ color: "gray" }}>
                N/A{" "}
                <Q
                  r={{
                    t: "Null fields",
                    x: "Some fields cannot be overwritten, like the tier. Changes to these fields will apply at the highest level and will not be considered a modification to the existing plan.",
                  }}
                />
              </span>
            ) : (
              JSON.stringify(cell)
            ),
        },
        {
          label: (
            <span>
              Add-on price{" "}
              <Q
                r={{
                  t: "Add-on price",
                  x: "The price of each add-on to the selected tier.",
                }}
              />
            </span>
          ),
          accessor: "addOnPrice",
          render: (cell, row) =>
            row.upgradeAvailable ? (
              <span>
                ${cell.toFixed(2)} per {row.addOnPricePer}
              </span>
            ) : (
              <i style={{ color: "grey" }}>Not available</i>
            ),
        },
        {
          label: "Modify",
          accessor: "cta",
          render: (cell, row) => (
            <Button
              onClick={() => {
                modal({
                  text: "This is a modal",
                  title: "This is a modal",
                });
              }}
              size="sm"
              outline
              variant="primary"
            >
              {/* {cell || "Modify"} */}
              <IconPencilDollar size={16} />
            </Button>
          ),
        },
      ]}
      data={data}
    />
  );
}
