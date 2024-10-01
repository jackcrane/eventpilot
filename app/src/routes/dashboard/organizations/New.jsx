import React, { useEffect, useState } from "react";
import { Typography, Util, Input, DropdownInput } from "tabler-react-2";
import { Button } from "tabler-react-2/dist/button";
import Steps from "tabler-react-2/dist/steps";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { IconArrowLeft, IconArrowRight, IconResize } from "@tabler/icons-react";
const { H1, H2, H3, H4, Text, I, B } = Typography;
import styles from "./new.module.css";
import classNames from "classnames";
import { Alert } from "tabler-react-2/dist/alert";
import { validateEmail } from "../../../util/validateEmail.js";
import { useOrg } from "../../../hooks/useOrg.js";
import { NewOrganizationSkeleton } from "../../../components/newOrganizationSkeleton.jsx";
import { switchForHighlight } from "./New.Content.jsx";
import { sidenavItems } from "./[organizationId]/index.jsx";
import { Page } from "../../../components/page.jsx";
import { Loading } from "../../../components/loading.jsx";
import toast from "react-hot-toast";

export const NewOrganization = () => {
  return <BasicInformation />;
};

export const OrganizationBasics = () => {
  const { organizationId } = useParams();

  return (
    <Page sidenavItems={sidenavItems(organizationId, "Basic Information")}>
      <BasicInformation />
    </Page>
  );
};

const BasicInformation = () => {
  const [currentlyHighlighted, setCurrentlyHighlighted] = useState("");

  const { organizationId: orgId } = useParams();

  const { loading, create, org, error: orgError, upsert } = useOrg(orgId);

  const [orgName, setOrgName] = useState(org?.name || "");
  const [orgWebsite, setOrgWebsite] = useState(org?.website || "");
  const [orgPublicEmail, setOrgPublicEmail] = useState(
    org?.publicContactEmail || ""
  );
  const [orgPrivateEmail, setOrgPrivateEmail] = useState(
    org?.privateContactEmail || ""
  );
  const [orgPhone, setOrgPhone] = useState(org?.privateContactPhone || "");
  const [orgCategory, setOrgCategory] = useState(
    { id: org?.category } || {
      id: "",
      label: "Select",
    }
  );

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

  useEffect(() => {
    if (org.id) {
      setOrgName(org.name);
      setOrgWebsite(org.website);
      setOrgPublicEmail(org.publicContactEmail);
      setOrgPrivateEmail(org.privateContactEmail);
      setOrgPhone(org.privateContactPhone);
      setOrgCategory({ id: org.category, label: org.category });
    }
  }, [org]);

  const [shouldDangerEmptyFields, setShouldDangerEmptyFields] = useState(false);

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleNext = async () => {
    const invalidFields = [];
    if (!stringIsValid(orgName)) invalidFields.push("Organization Name");
    if (!urlIsValid(orgWebsite)) invalidFields.push("Website");
    if (!validateEmail(orgPublicEmail)) invalidFields.push("Public Email");
    if (!validateEmail(orgPrivateEmail)) invalidFields.push("Private Email");
    if (!phoneIsValid(orgPhone)) invalidFields.push("Phone Number");
    if (!orgCategory) invalidFields.push("Category");

    if (invalidFields.length > 0) {
      setError(
        `The following fields are invalid: ${invalidFields.join(
          ", "
        )}. Please fix them before continuing.`
      );
      setShouldDangerEmptyFields(true);
      return;
    }
    setError(null);

    const [org, error] = await upsert({
      name: orgName,
      website: orgWebsite,
      publicContactEmail: orgPublicEmail,
      privateContactEmail: orgPrivateEmail,
      privateContactPhone: orgPhone,
      category: orgCategory,
    });

    if (org?.id) {
      if (orgId) {
        toast.success("Organization updated successfully");
      } else {
        navigate(`/dashboard/organizations/${org.id}`);
      }
    } else {
      setError(error);
    }
  };

  if (orgId && loading) {
    return <Loading />;
  }

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
      <H2>Basic Information</H2>
      <Text>Enter the basic information for your organization.</Text>
      {error && (
        <Alert variant="danger" title="Error" icon={<IconResize />}>
          {error}
        </Alert>
      )}
      <Util.Row gap={2} style={{ alignItems: "flex-start", height: "100%" }}>
        <Util.Col className={styles.gos}>
          <div onMouseOver={() => setCurrentlyHighlighted("orgname")}>
            <Input
              label="Organization Name"
              placeholder="Your outward-facing organization name"
              value={orgName}
              onInput={setOrgName}
              variant={stringIsValid(orgName) ? "default" : "danger"}
            />
          </div>
          <div onMouseOver={() => setCurrentlyHighlighted("orgwebsite")}>
            <Input
              label="Organization Website"
              placeholder="Your website URL"
              value={orgWebsite}
              onInput={setOrgWebsite}
              variant={
                stringIsValid(orgWebsite) && urlIsValid(orgWebsite, true)
                  ? "default"
                  : "danger"
              }
            />
          </div>
          <div onMouseOver={() => setCurrentlyHighlighted("publicemail")}>
            <Input
              label="Public Contact Email"
              placeholder="An email address that the public can use"
              type="email"
              value={orgPublicEmail}
              onInput={setOrgPublicEmail}
              variant={
                stringIsValid(orgPublicEmail) &&
                validateEmail(orgPublicEmail, true)
                  ? "default"
                  : "danger"
              }
            />
          </div>
          <div onMouseOver={() => setCurrentlyHighlighted("privatemail")}>
            <Input
              label="Private Contact Email"
              placeholder="An email address that EventPilot can use to contact you"
              type="email"
              value={orgPrivateEmail}
              onInput={setOrgPrivateEmail}
              variant={
                stringIsValid(orgPrivateEmail) &&
                validateEmail(orgPrivateEmail, true)
                  ? "default"
                  : "danger"
              }
            />
          </div>
          <div onMouseOver={() => setCurrentlyHighlighted("phonenum")}>
            <Input
              label="Private Contact Phone"
              placeholder="A phone number that EventPilot can use to contact you"
              type="phone"
              value={orgPhone}
              onInput={setOrgPhone}
              variant={
                stringIsValid(orgPhone) && phoneIsValid(orgPhone, true)
                  ? "default"
                  : "danger"
              }
            />
          </div>
          <div onMouseOver={() => setCurrentlyHighlighted("category")}>
            <label className="form-label">Category</label>
            <DropdownInput
              style={{ width: "100%" }}
              aprops={{ style: { width: "100%" } }}
              prompt="Category"
              values={[
                {
                  id: "political_advocacy",
                  label: "Political Advocacy Organization",
                },
                { id: "environment", label: "Environmental Organization" },
                { id: "service", label: "Service-based Organization" },
                { id: "arts_culture", label: "Arts & Culture Organization" },
                { id: "education", label: "Educational Organization" },
                { id: "health", label: "Health-related Organization" },
                { id: "religious", label: "Religious Organization" },
                { id: "international", label: "International Organization" },
                { id: "animal_welfare", label: "Animal Welfare Organization" },
                {
                  id: "foundation",
                  label: "Foundation & Grant-Making Organization",
                },
                {
                  id: "youth_development",
                  label: "Youth Development Organization",
                },
                { id: "social_justice", label: "Social Justice Organization" },
                { id: "other", label: "Other" },
              ]}
              value={
                orgCategory.id ? orgCategory : { id: "", label: "Category" }
              }
              onChange={setOrgCategory}
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
            Save{!orgId && " & Continue to dashboard"}
            <IconArrowRight size={16} />
          </Util.Row>
        </Button>
      </Util.Row>
      <Util.Spacer size={1} />
    </div>
  );
};
