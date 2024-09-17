import React, { createRef, useEffect, useState } from "react";
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
  Card,
} from "tabler-react-2";
const { H1, H2, Text, B } = Typography;
import styles from "./new.module.css";
import { switchForHighlight } from "./Marketing.content.jsx";
import classNames from "classnames";
import { validateEmail } from "../../../util/validateEmail.js";
import { useOrg } from "../../../hooks/useOrg.js";
import { useSearchParams } from "react-router-dom";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { compressImage } from "../../../util/image.js";

export const NewOrganizationMarketing = () => {
  return (
    <NewOrganizationSkeleton activeStep={2}>
      <Marketing />
    </NewOrganizationSkeleton>
  );
};

const Marketing = () => {
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get("orgId");
  const { error, loading, update, org } = useOrg(orgId);

  const [mainBannerImage, setMainBannerImage] = useState(
    org?.marketingPrimaryBannerImage ? org.marketingPrimaryBannerImage : null
  );
  const [logoImage, setLogoImage] = useState(
    org?.marketingLogo ? org.marketingLogo : null
  );
  const [squareLogoImage, setSquareLogoImage] = useState(
    org?.marketingSquareLogo ? org.marketingSquareLogo : null
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

  const [currentlyHighlighted, setCurrentlyHighlighted] = useState("none");
  const [shouldDangerEmptyFields, setShouldDangerEmptyFields] = useState(false);

  useEffect(() => {
    if (org?.id) {
      setMainBannerImage(org.marketingPrimaryBannerImage);
      setLogoImage(org.marketingLogo);
      setSquareLogoImage(org.marketingSquareLogo);
    }
  }, [org]);

  const handleNext = async () => {
    const data = {
      mainBannerImage: {
        key: mainBannerImage?.key,
        name: mainBannerImage?.name,
        url: mainBannerImage?.url,
      },
      logoImage: {
        key: logoImage?.key,
        name: logoImage?.name,
        url: logoImage?.url,
      },
      squareLogoImage: {
        key: squareLogoImage?.key,
        name: squareLogoImage?.name,
        url: squareLogoImage?.url,
      },
    };

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
          <div onMouseOver={() => setCurrentlyHighlighted("mainbannerimg")}>
            <label className="form-label">Main Banner Image</label>
            <Util.Row gap={2}>
              {mainBannerImage?.url ? (
                <Card
                  title={
                    <Util.Row
                      style={{ justifyContent: "space-between", width: "100%" }}
                      wrap
                    >
                      <Typography.H3
                        style={{ textOverflow: "ellipsis", maxWidth: "100%" }}
                      >
                        {mainBannerImage.name}
                      </Typography.H3>
                      <ConsumedUploadBox
                        onClientUploadComplete={(rec) =>
                          setMainBannerImage(rec[0])
                        }
                        onUploadError={console.error}
                        onBeforeUploadBegin={async (d) => {
                          console.log(d[0]);
                          const c = await compressImage(d[0], 1);
                          return [c];
                        }}
                      />
                    </Util.Row>
                  }
                  style={{ width: "100%", maxWidth: 400 }}
                >
                  <img
                    src={mainBannerImage.url}
                    style={{
                      maxWidth: "unset",
                      width: "calc(100% + 2rem)",
                      margin: "-1rem",
                    }}
                  />
                </Card>
              ) : (
                <ConsumedUploadBox
                  onClientUploadComplete={(rec) => setMainBannerImage(rec[0])}
                  onUploadError={console.error}
                />
              )}
            </Util.Row>
          </div>
          <Util.Spacer size={2} />
          <div onMouseOver={() => setCurrentlyHighlighted("mainlogoimg")}>
            <label className="form-label">Main Logo Image</label>
            <Util.Row gap={2}>
              {logoImage?.url ? (
                <Card
                  title={
                    <Util.Row
                      style={{ justifyContent: "space-between", width: "100%" }}
                      wrap
                    >
                      <Typography.H3
                        style={{ textOverflow: "ellipsis", maxWidth: "100%" }}
                      >
                        {logoImage.name}
                      </Typography.H3>
                      <ConsumedUploadBox
                        onClientUploadComplete={(rec) => setLogoImage(rec[0])}
                        onUploadError={console.error}
                        onBeforeUploadBegin={async (d) => {
                          console.log(d[0]);
                          const c = await compressImage(d[0], 1, 800, 400);
                          return [c];
                        }}
                      />
                    </Util.Row>
                  }
                  style={{ width: "100%", maxWidth: 400 }}
                >
                  <img
                    src={logoImage.url}
                    style={{
                      maxWidth: "unset",
                      width: "calc(100% + 2rem)",
                      margin: "-1rem",
                    }}
                  />
                </Card>
              ) : (
                <ConsumedUploadBox
                  onClientUploadComplete={(rec) => setLogoImage(rec[0])}
                  onUploadError={console.error}
                />
              )}
            </Util.Row>
          </div>
          <Util.Spacer size={2} />
          <div onMouseOver={() => setCurrentlyHighlighted("squarelogoimg")}>
            <label className="form-label">Square Logo Image</label>
            <Util.Row gap={2}>
              {squareLogoImage?.url ? (
                <Card
                  title={
                    <Util.Row
                      style={{ justifyContent: "space-between", width: "100%" }}
                      wrap
                    >
                      <Typography.H3
                        style={{ textOverflow: "ellipsis", maxWidth: "100%" }}
                      >
                        {squareLogoImage.name}
                      </Typography.H3>
                      <ConsumedUploadBox
                        onClientUploadComplete={(rec) =>
                          setSquareLogoImage(rec[0])
                        }
                        onUploadError={console.error}
                        onBeforeUploadBegin={async (d) => {
                          console.log(d[0]);
                          const c = await compressImage(d[0], 1);
                          return [c];
                        }}
                      />
                    </Util.Row>
                  }
                  style={{ width: "100%", maxWidth: 400 }}
                >
                  <img
                    src={squareLogoImage.url}
                    style={{
                      maxWidth: "unset",
                      width: "calc(100% + 2rem)",
                      margin: "-1rem",
                    }}
                  />
                </Card>
              ) : (
                <ConsumedUploadBox
                  onClientUploadComplete={(rec) => setSquareLogoImage(rec[0])}
                  onUploadError={console.error}
                />
              )}
            </Util.Row>
          </div>
        </Util.Col>
        <Util.Col
          style={{
            width: "50%",
            maxHeight: 450,
            overflowY: "auto",
            position: "sticky",
            top: 30,
          }}
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

const ConsumedUploadBox = ({
  onClientUploadComplete,
  onUploadError,
  onBeforeUploadBegin,
  onUploadBegin,
}) => {
  return (
    <UploadBox
      endpoint="imageUploader"
      onClientUploadComplete={onClientUploadComplete}
      onUploadError={onUploadError}
      onBeforeUploadBegin={onBeforeUploadBegin}
      onUploadBegin={onUploadBegin}
      className={styles.uploadBox}
      appearance={{
        button: `${styles.button}`,
        allowedContent: `${styles.reset}`,
      }}
    />
  );
};

const UploadBox = generateUploadButton({
  url: "http://localhost:2000/fs/upload",
});
