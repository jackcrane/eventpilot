import React, { useEffect, useState } from "react";
import { Card, Typography, Input, Button, Util } from "tabler-react-2";
const { H1 } = Typography;
import styles from "./login.module.css";
import { IconMail, IconMoodSad, IconSquareAsterisk } from "@tabler/icons-react";
import useAuth from "../../hooks/useAuth";
import { Alert } from "tabler-react-2/dist/alert";
import CryptoJS from "crypto-js";
import { Page } from "../../components/page";
import { useNavigate } from "react-router-dom";

export const Login = (props) => {
  const { login, wantsOTP, error, loading, isLoggedIn } = useAuth();

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

  const handleLogin = async () => {
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
    return await login(email, password);
  };

  return (
    <Page>
      <div className={styles.container}>
        <Card>
          <H1>Login</H1>
          {error && (
            <Alert variant="danger" title="Login failed" icon={<IconMoodSad />}>
              {error}
            </Alert>
          )}
          {formError && (
            <Alert variant="danger" title="Login failed" icon={<IconMoodSad />}>
              {formError}
            </Alert>
          )}
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            icon={<IconMail />}
            variant={email.length > 0 && !emailValid && "danger"}
            value={email}
            onInput={(value) => setEmail(value)}
          />
          <Input
            label="Password"
            name="password"
            placeholder="Enter your password"
            type="password"
            icon={<IconSquareAsterisk />}
            variant={password.length > 0 && !passwordValid && "danger"}
            value={password}
            onInput={(value) => setPassword(value)}
          />
          <Util.Row align="between">
            <Typography.Link href="/auth/signup">
              Create an account
            </Typography.Link>
            <Button
              onClick={async () => {
                if (await handleLogin()) {
                  window.location.href = `/auth/otp?e=${encodeURIComponent(
                    encrypt(email),
                  )}&x=${encodeURIComponent(encrypt(new Date().toISOString()))}`;
                }
              }}
              loading={loading}
              disabled={loading}
            >
              Log in
            </Button>
          </Util.Row>
        </Card>
      </div>
    </Page>
  );
};
