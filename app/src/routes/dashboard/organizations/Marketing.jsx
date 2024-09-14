import React, { useEffect, useState } from "react";
import { NewOrganizationSkeleton } from "../../../components/newOrganizationSkeleton.jsx";
import { IconArrowRight, IconResize } from "@tabler/icons-react";
import { Alert } from "tabler-react-2/dist/alert/index.js";
import {
  Typography,
  Util,
  Input,
  DropdownInput,
  Switch,
  Button,
} from "tabler-react-2";
const { H1, H2, Text, B } = Typography;
import styles from "./new.module.css";
import { switchForHighlight } from "./Legal.content.jsx";
import classNames from "classnames";
import { validateEmail } from "../../../util/validateEmail.js";
import { useOrg } from "../../../hooks/useOrg.js";
import { useSearchParams } from "react-router-dom";

export const NewOrganizationMarketing = () => {
  return (
    <NewOrganizationSkeleton activeStep={1}>
      <Marketing />
    </NewOrganizationSkeleton>
  );
};

const Markteting = () => {
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get("orgId");
  const { error, loading, update, org } = useOrg(orgId);

  const stringIsValid = (str) => {
    if (!shouldDangerEmptyFields) return true;
    return str && str.length > 0;
  };
  const urlIsValid = (url, allowEmpty = false) => {
    if (allowEmpty && url.length === 0) return true;
    return url && url.includes(".");
  };
  const phoneIsValid = (phone, allowEmpty = false) => {
    if (allowEmpty && phone.length === 0) return true;
    return phone && phone.length > 9;
  };

  const [currentlyHighlighted, setCurrentlyHighlighted] = useState("none");
  const [shouldDangerEmptyFields, setShouldDangerEmptyFields] = useState(false);

  useEffect(() => {
    if (org.id) {
    }
  }, [org]);

  const handleNext = async () => {
    const data = {};

    const [response, error] = await update(data);

    if (response) {
      console.log("Successfully updated org", response);
    }
    if (error) {
      console.error("Error updating org", error);
    }
  };

  return (
    <div>
      <Alert
        variant="warning"
        title="Notice"
        icon={<IconResize />}
        className={styles.sos}
      >
        We <B>strongly recommend</B> using a computer or large device to create
        your organization. We provide a lot of additional information and
        directions on optimizing your organization profile that will not be
        visible on a mobile device.
      </Alert>
      <H2>Marketing Content</H2>
      <Text>Enter the marketing information for your organization.</Text>
      {error && (
        <Alert variant="danger" title="Error" icon={<IconResize />}>
          {error}
        </Alert>
      )}
      <Util.Row gap={2} style={{ alignItems: "flex-start", height: "100%" }}>
        <Util.Col className={styles.gos}>
          <div onMouseOver={() => setCurrentlyHighlighted("orglegalname")}>
            <Input
              label="Organization Legal Name"
              placeholder="Your legal organization name"
              value={orgLegalName}
              onInput={setOrgLegalName}
              variant={stringIsValid(orgLegalName) ? "default" : "danger"}
            />
          </div>
        </Util.Col>
        <Util.Col
          style={{ width: "50%", maxHeight: 450, overflowY: "auto" }}
          className={classNames(styles.scg, styles.hos)}
        >
          {switchForHighlight(currentlyHighlighted)}
          <br />
          <br />
          <br />
          <br />
        </Util.Col>
      </Util.Row>
      <Util.Spacer size={4} />
      <Util.Row align="between">
        {new Array(10).fill(0).map((_, i) => (
          <IconArrowRight size={16} style={{ color: "#9ba9be" }} key={i} />
        ))}
        {new Array(10).fill(0).map((_, i) => (
          <IconArrowRight
            size={16}
            style={{ color: "#9ba9be" }}
            className={styles.hos}
            key={i}
          />
        ))}
        <Button
          onClick={handleNext}
          variant={"primary"}
          loading={loading}
          disabled={loading}
        >
          <Util.Row gap={1}>
            Save & Next Step
            <IconArrowRight size={16} />
          </Util.Row>
        </Button>
      </Util.Row>
    </div>
  );
};

const StateDropdown = ({ value, onChange }) => {
  return (
    <DropdownInput
      prompt="State"
      values={[
        { id: "Alabama", label: "Alabama" },
        { id: "Alaska", label: "Alaska" },
        { id: "Arizona", label: "Arizona" },
        { id: "Arkansas", label: "Arkansas" },
        { id: "California", label: "California" },
        { id: "Colorado", label: "Colorado" },
        { id: "Connecticut", label: "Connecticut" },
        { id: "Delaware", label: "Delaware" },
        { id: "Florida", label: "Florida" },
        { id: "Georgia", label: "Georgia" },
        { id: "Hawaii", label: "Hawaii" },
        { id: "Idaho", label: "Idaho" },
        { id: "Illinois", label: "Illinois" },
        { id: "Indiana", label: "Indiana" },
        { id: "Iowa", label: "Iowa" },
        { id: "Kansas", label: "Kansas" },
        { id: "Kentucky", label: "Kentucky" },
        { id: "Louisiana", label: "Louisiana" },
        { id: "Maine", label: "Maine" },
        { id: "Maryland", label: "Maryland" },
        { id: "Massachusetts", label: "Massachusetts" },

        { id: "Michigan", label: "Michigan" },
        { id: "Minnesota", label: "Minnesota" },
        { id: "Mississippi", label: "Mississippi" },
        { id: "Missouri", label: "Missouri" },
        { id: "Montana", label: "Montana" },
        { id: "Nebraska", label: "Nebraska" },
        { id: "Nevada", label: "Nevada" },
        { id: "New Hampshire", label: "New Hampshire" },
        { id: "New Jersey", label: "New Jersey" },
        { id: "New Mexico", label: "New Mexico" },
        { id: "New York", label: "New York" },
        { id: "North Carolina", label: "North Carolina" },
        { id: "North Dakota", label: "North Dakota" },
        { id: "Ohio", label: "Ohio" },
        { id: "Oklahoma", label: "Oklahoma" },
        { id: "Oregon", label: "Oregon" },
        { id: "Pennsylvania", label: "Pennsylvania" },
        { id: "Rhode Island", label: "Rhode Island" },
        { id: "South Carolina", label: "South Carolina" },
        { id: "South Dakota", label: "South Dakota" },
        { id: "Tennessee", label: "Tennessee" },
        { id: "Texas", label: "Texas" },
        { id: "Utah", label: "Utah" },
        { id: "Vermont", label: "Vermont" },
        { id: "Virginia", label: "Virginia" },
        { id: "Washington", label: "Washington" },
        { id: "West Virginia", label: "West Virginia" },
        { id: "Wisconsin", label: "Wisconsin" },
        { id: "Wyoming", label: "Wyoming" },
        {
          id: "District of Columbia",
          label: "District of Columbia",
        },
        { id: "Puerto Rico", label: "Puerto Rico" },
        { id: "Guam", label: "Guam" },
        { id: "American Samoa", label: "American Samoa" },
        { id: "U.S. Virgin Islands", label: "U.S. Virgin Islands" },
        { id: "Northern Mariana Islands", label: "Northern Mariana Islands" },
      ]}
      value={value}
      onChange={onChange}
    />
  );
};
