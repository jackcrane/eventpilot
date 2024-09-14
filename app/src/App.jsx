import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./routes/Home";
import { Login } from "./routes/auth/Login";
import { Signup } from "./routes/auth/Signup";
import { Otp } from "./routes/auth/Otp";
import { About } from "./routes/About";
import useAuth from "./hooks/useAuth";
import { UserProvider } from "./util/UserProvider";
import { Header } from "./components/header";
import { Dashboard } from "./routes/dashboard/Index";
import { Footer } from "./components/footer";
import { Organizations } from "./routes/dashboard/organizations/Index";
import { NewOrganization } from "./routes/dashboard/organizations/New";
import { NewOrganizationLegal } from "./routes/dashboard/organizations/Legal";

export default () => {
  return (
    <UserProvider>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/otp" element={<Otp />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/organizations" element={<Organizations />} />
          <Route
            path="/dashboard/organizations/new"
            element={<NewOrganization />}
          />
          <Route
            path="/dashboard/organizations/legal"
            element={<NewOrganizationLegal />}
          />
        </Routes>
      </Router>
      <Footer />
    </UserProvider>
  );
};
