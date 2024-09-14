import React, { useEffect, useState } from "react";
import { Card, Typography, Input, Button, Util } from "tabler-react-2";
const { H2 } = Typography;
import styles from "./login.module.css";
import {
  IconSquareAsterisk,
  IconMoodSad,
  IconAuth2fa,
} from "@tabler/icons-react";
import { Alert } from "tabler-react-2/dist/alert";
import useAuth from "../../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import { Page } from "../../components/page";

export const Otp = () => {
  const decrypt = (text) => {
    return CryptoJS.AES.decrypt(
      text,
      "p9syfd8asd9fa8psd9fy8asdp9fgy8ads",
    ).toString(CryptoJS.enc.Utf8);
  };

  const { verifyOTP, error, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState(decrypt(searchParams.get("o") || ""));
  const email = decrypt(decodeURIComponent(searchParams.get("e")));
  const createdAt = new Date(
    decrypt(decodeURIComponent(searchParams.get("x"))),
  );
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const otp = decrypt(searchParams.get("o") || "");
    // See if otp is a 6 digit number
    if (/^\d{6}$/.test(otp)) {
      console.log("Automatically verifying OTP", otp, email);
      handleVerify(); // Directly call the handleVerify function
    }
  }, [searchParams]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setExpired(true);
    }

    const now = new Date().getTime();
    const fifteenMinutes = 15 * 60 * 1000;
    if (now - createdAt > fifteenMinutes) {
      setExpired(true);
    }
  }, [email, createdAt]);

  const handleVerify = async () => {
    if (!otp) {
      return;
    }
    const v = await verifyOTP(email, otp);
    if (v) {
      document.location.href = "/";
    }
  };

  return (
    <Page>
      <div className={styles.container}>
        <Card>
          <H2>Check your email</H2>
          {error && (
            <Alert
              variant="danger"
              title="Verification Failed"
              icon={<IconMoodSad />}
            >
              {error}
            </Alert>
          )}
          {!expired ? (
            <>
              <Typography.Text>
                We've sent a verification code to your email address ({email}).
                Please enter it below.
              </Typography.Text>
              <Input
                label="Verification Code"
                placeholder="Enter the code"
                type="otp"
                value={otp}
                onInput={(e) => setOtp(e)}
                icon={<IconAuth2fa />}
              />
              <Util.Spacer size={2} />
              <Util.Row align="right">
                <Button
                  onClick={handleVerify}
                  loading={loading}
                  disabled={loading}
                >
                  Verify
                </Button>
              </Util.Row>
            </>
          ) : (
            <>
              <Alert
                variant="danger"
                title="Verification Code Expired"
                icon={<IconMoodSad />}
              >
                The verification code has expired. Please request a new one from
                the{" "}
                <Typography.Link href="/auth/login">login page</Typography.Link>
                .
              </Alert>
            </>
          )}
        </Card>
      </div>
    </Page>
  );
};
