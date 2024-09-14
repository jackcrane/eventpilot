import React, { useEffect, useState } from "react";
import { Card, Typography, Input, Button, Util } from "tabler-react-2";
const { H1 } = Typography;
import styles from "./login.module.css";
import {
  IconCircleDashedCheck,
  IconCircleDashedX,
  IconMail,
  IconMoodSad,
  IconSignature,
  IconSquareAsterisk,
} from "@tabler/icons-react";
import useAuth from "../../hooks/useAuth";
import { Alert } from "tabler-react-2/dist/alert";
import CryptoJS from "crypto-js";
import { Page } from "../../components/page";
import { useNavigate } from "react-router-dom";

const random10digit = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

export const Signup = (props) => {
  const { signup, wantsOTP, error, loading, isLoggedIn } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn]);

  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);
  const [formError, setFormError] = useState("");
  const [name, setName] = useState("");

  const encrypt = (data) => {
    return CryptoJS.AES.encrypt(
      data,
      "p9syfd8asd9fa8psd9fy8asdp9fgy8ads",
    ).toString();
  };

  useEffect(() => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    // Password validation
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,255}$/;
    setPasswordValid(passwordRegex.test(password));
  }, [password]);

  const handleSignup = async () => {
    if (name.length < 1) {
      setFormError("Please enter your name.");
      return;
    }
    if (!emailValid) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!passwordValid) {
      setFormError(
        "Password must be 8-255 characters long, include at least one capital letter, one number, and one special character.",
      );
      return;
    }
    setFormError(""); // Clear any previous errors
    if (await signup(name, email, password)) {
      window.location.href = `/auth/otp?e=${encodeURIComponent(
        encrypt(email),
      )}&x=${encodeURIComponent(encrypt(new Date().toISOString()))}`;
    }
  };

  return (
    <Page>
      <div className={styles.container}>
        <Card>
          <H1>Register</H1>
          {error && (
            <Alert
              variant="danger"
              title="Signup Failed"
              icon={<IconMoodSad />}
            >
              {error}
            </Alert>
          )}
          {formError && (
            <Alert variant="danger" title="Error" icon={<IconMoodSad />}>
              {formError}
            </Alert>
          )}
          <>
            <Input
              name="name"
              label="Your name"
              placeholder="What should we call you?"
              icon={<IconSignature />}
              value={name}
              onInput={setName}
            />
            <Input
              label="Email"
              name="email"
              placeholder="Enter your email"
              icon={<IconMail />}
              value={email}
              onInput={(e) => setEmail(e)}
              variant={email.length > 0 && !emailValid && "danger"}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              icon={<IconSquareAsterisk />}
              value={password}
              onInput={(e) => setPassword(e)}
              variant={password.length > 0 && !passwordValid && "danger"}
            />
            <div style={{ fontSize: "0.8em", marginTop: -10 }}>
              <Validation
                regex={/^.{8,255}$/}
                field={password}
                success={"Password contains 8-255 characters"}
                failure={"Password must contain 8-255 characters"}
              />
              <Validation
                regex={/(?=.*[A-Z])/}
                field={password}
                success={"Password contains a capital letter"}
                failure={"Password does not contain a capital letter"}
              />
              <Validation
                regex={/(?=.*\d)/}
                field={password}
                success={"Password contains a number"}
                failure={"Password does not contain a number"}
              />
              <Validation
                regex={/(?=.*[!@#$%^&*])/}
                field={password}
                success={"Password contains a special character"}
                failure={
                  "Password does not contain a special character (!@#$%^&*)"
                }
              />
            </div>
            <Util.Spacer size={2} />
            <Typography.Text>
              By continuing, you agree to our Terms and Conditions and Privacy
              Policy.
            </Typography.Text>
            <Util.Hr />
            <Util.Row align="between">
              <Typography.Link href="/auth/login">
                Already have an account?
              </Typography.Link>
              <Button
                onClick={async () => {
                  handleSignup();
                }}
                loading={loading}
              >
                Sign Up
              </Button>
            </Util.Row>
          </>
        </Card>
      </div>
    </Page>
  );
};

const Validation = ({ regex, field, success, failure }) => {
  const valid = regex.test(field);
  return (
    <span className={valid ? "text-success" : "text-danger"}>
      <Util.Row gap={0.5}>
        {valid ? (
          <>
            <IconCircleDashedCheck size={16} />
            <span>{success}</span>
          </>
        ) : (
          <>
            <IconCircleDashedX size={16} />
            <span>{failure}</span>
          </>
        )}
      </Util.Row>
    </span>
  );
};
