import React, { useEffect, useState } from "react";
import { NewOrganizationSkeleton } from "../../../components/newOrganizationSkeleton.jsx";
import { IconArrowRight, IconResize } from "@tabler/icons-react";
import {
  Alert,
  Typography,
  Util,
  Input,
  DropdownInput,
  Switch,
  Button,
} from "tabler-react-2";
import styles from "./new.module.css";
import classNames from "classnames";
import { validateEmail } from "../../../util/validateEmail.js";
import { useOrg } from "../../../hooks/useOrg.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { switchForHighlight } from "./Legal.content.jsx";

const { H2, Text, B } = Typography;

export const NewOrganizationLegal = () => {
  return (
    <NewOrganizationSkeleton activeStep={1}>
      <Legal />
    </NewOrganizationSkeleton>
  );
};

const Legal = () => {
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get("orgId");
  const { error, loading, update, org } = useOrg(orgId);
  const navigate = useNavigate();

  const [currentlyHighlighted, setCurrentlyHighlighted] = useState("none");
  const [shouldDangerEmptyFields, setShouldDangerEmptyFields] = useState(false);

  const initialState = {
    orgLegalName: "",
    tin: "",
    orgCategory: "",
    streetAddress1: "",
    streetAddress2: "",
    addressCity: "",
    addressState: "",
    addressZip: "",
    makeAddressPublic: false,
    legalContact: "",
  };

  const [formState, setFormState] = useState(initialState);

  useEffect(() => {
    if (org.id) {
      setFormState({
        orgLegalName: org.legalName || "",
        tin: org.taxId || "",
        orgCategory: org.type ? { id: org.type, label: org.type } : null,
        streetAddress1: org.addressLine1 || "",
        streetAddress2: org.addressLine2 || "",
        addressCity: org.city || "",
        addressState: org.state ? { id: org.state, label: org.state } : null,
        addressZip: org.zip || "",
        makeAddressPublic: org.addressPublic || false,
        legalContact: org.legalContactEmail || "",
      });
    }
  }, [org]);

  const handleInputChange = (field) => (value) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleNext = async () => {
    const {
      orgLegalName,
      tin,
      orgCategory,
      streetAddress1,
      streetAddress2,
      addressCity,
      addressState,
      addressZip,
      makeAddressPublic,
      legalContact,
    } = formState;
    const data = {
      legalName: orgLegalName,
      taxId: tin,
      type: orgCategory?.id,
      addressLine1: streetAddress1,
      addressLine2: streetAddress2,
      city: addressCity,
      state: addressState?.id,
      zip: addressZip,
      addressPublic: makeAddressPublic,
      legalContactEmail: legalContact,
    };

    const [response, error] = await update(data);

    if (response?.id) {
      navigate(`/dashboard/organizations/marketing?orgId=${org.id}`);
    }
    if (error) {
      console.error("Error updating org", error);
    }
  };

  const renderInput = ({
    label,
    value,
    onChange,
    placeholder = "",
    type = "text",
    validator = () => true,
    className = "",
    style = {},
  }) => (
    <Input
      label={label}
      placeholder={placeholder}
      value={value}
      onInput={onChange}
      type={type}
      variant={validator(value) ? "default" : "danger"}
      className={className}
      style={style}
    />
  );


  const renderAddressFields = () => (
    <>
      {renderInput({
        label: "Street Address line 1",
        value: formState.streetAddress1,
        onChange: handleInputChange("streetAddress1"),
      })}
      {renderInput({
        label: "Street Address line 2",
        value: formState.streetAddress2,
        onChange: handleInputChange("streetAddress2"),
      })}
      <Util.Row gap={1} style={{alignItems: "flex-end"}}>
        {renderInput({
          label: "City",
          value: formState.addressCity,
          onChange: handleInputChange("addressCity"),
          style: { flex: 1 },
          className:"mb-0"
        })}
        <StateDropdown
          value={formState.addressState}
          onChange={handleInputChange("addressState")}
        />
        {renderInput({
          label: "Zip",
          value: formState.addressZip,
          onChange: handleInputChange("addressZip"),
          validator: (zip) => zip.length === 5,
          style: { width: 80 },
          className: "mb-0",
        })}
      </Util.Row>
    </>
  );

  return (
    <div>
      <Alert
        variant="warning"
        title="Notice"
        icon={<IconResize />}
        className={styles.sos}
      >
        We <B>strongly recommend</B> using a computer or large device to create
        your organization...
      </Alert>
      <Alert variant="info" title="Optional">
        Each of these fields are optional, and can all be updated later.
      </Alert>

      <H2>Legal Information</H2>
      <Text>Enter the legal information for your organization.</Text>
      {error && (
        <Alert variant="danger" title="Error" icon={<IconResize />}>
          {error}
        </Alert>
      )}

      <Util.Row gap={2} style={{ alignItems: "flex-start", height: "100%" }}>
        <Util.Col className={styles.gos}>
          <div onMouseOver={() => setCurrentlyHighlighted("orglegalname")}>
            {renderInput(
              {
                label: "Organization Legal Name",
                value: formState.orgLegalName,
                onChange: handleInputChange("orgLegalName"),
                placeholder: "Your legal organization name",
              }
            )}
          </div>
          <div onMouseOver={() => setCurrentlyHighlighted("tin")}>
            {renderInput(
              {
                label: "Tax Identification Number",
                value: formState.tin,
                onChange: handleInputChange("tin"),
                placeholder: "TIN, EIN, or other relevant tax ID",
              }
            )}
          </div>
          <div onMouseOver={() => setCurrentlyHighlighted("orgtype")}>
            <label className="form-label">Type of organization</label>
            <DropdownInput
              style={{ width: "100%" }}
              prompt="Category"
              values={[
                { id: "Nonprofit", label: "Nonprofit" },
                { id: "LLC", label: "LLC" },
                { id: "Corporation", label: "Corporation" },
                { id: "Government", label: "Government" },
                { id: "Other", label: "Other" },
              ]}
              value={formState.orgCategory}
              onChange={handleInputChange("orgCategory")}
            />
          </div>
          <Util.Spacer size={2} />
          <div onMouseOver={() => setCurrentlyHighlighted("address")}>
            <label className="form-label">Address of registration</label>
            {renderAddressFields()}
            <Util.Spacer size={1} />
            <Switch
              value={formState.makeAddressPublic}
              onChange={handleInputChange("makeAddressPublic")}
              label="Make address public"
            />
          </div>
          <Util.Spacer size={2} />
          <div onMouseOver={() => setCurrentlyHighlighted("legalcontact")}>
            {renderInput(
              {
                label: "Legal Contact Email",
                value: formState.legalContact,
                onChange: handleInputChange("legalContact"),
                placeholder: "Email address for legal contact",
                type: "email",
                validator: (email) => validateEmail(email, true),
              }
            )}
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
