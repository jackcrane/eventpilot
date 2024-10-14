import React from "react";
import { createContext, useState } from "react";
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
import {
  NewOrganization,
  OrganizationBasics,
} from "./routes/dashboard/organizations/New";
import { OrganizationLegal } from "./routes/dashboard/organizations/[organizationId]/Legal";
import { OrganizationMarketing } from "./routes/dashboard/organizations/[organizationId]/Marketing";
import { Events } from "./routes/dashboard/events";
import { OrganizationHome } from "./routes/dashboard/organizations/[organizationId]";
import { Toaster } from "react-hot-toast";
import { Logs } from "./routes/dashboard/organizations/[organizationId]/Logs";
import { TodoPage } from "./routes/dashboard/organizations/[organizationId]/Todos/index";
import { TodoDetails } from "./routes/dashboard/organizations/[organizationId]/Todos/[todoId]";
import { Events as OrgEvents } from "./routes/dashboard/organizations/[organizationId]/events/index";
import { Billing } from "./routes/dashboard/organizations/[organizationId]/Billing";

const Layout = ({ children, showHeaderFooter = true }) => (
  <>
    {showHeaderFooter && <Header />}
    <Toaster />
    <div>{children}</div>
    {showHeaderFooter && <Footer />}
  </>
);

export default () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout showHeaderFooter={false}>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout showHeaderFooter={true}>
                <About />
              </Layout>
            }
          />

          <Route
            path="/auth/login"
            element={
              <Layout showHeaderFooter={false}>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <Layout showHeaderFooter={false}>
                <Signup />
              </Layout>
            }
          />
          <Route
            path="/auth/otp"
            element={
              <Layout showHeaderFooter={false}>
                <Otp />
              </Layout>
            }
          />

          <Route
            path="/dashboard"
            element={
              <Layout showHeaderFooter={true}>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/dashboard/organizations"
            element={
              <Layout showHeaderFooter={true}>
                <Organizations />
              </Layout>
            }
          />
          <Route
            path="/dashboard/organizations/new"
            element={
              <Layout showHeaderFooter={true}>
                <NewOrganization />
              </Layout>
            }
          />
          <Route
            path="/dashboard/organizations/:organizationId"
            element={
              <Layout showHeaderFooter={true}>
                <OrganizationHome />
              </Layout>
            }
          />
          <Route
            path="/dashboard/organizations/:organizationId/basics"
            element={
              <Layout showHeaderFooter={true}>
                <OrganizationBasics />
              </Layout>
            }
          />
          <Route
            path="/dashboard/organizations/:organizationId/legal"
            element={
              <Layout showHeaderFooter={true}>
                <OrganizationLegal />
              </Layout>
            }
          />
          <Route
            path="/dashboard/organizations/:organizationId/marketing"
            element={
              <Layout showHeaderFooter={true}>
                <OrganizationMarketing />
              </Layout>
            }
          />
          <Route
            path="/dashboard/organizations/:organizationId/logs"
            element={
              <Layout showHeaderFooter={true}>
                <Logs />
              </Layout>
            }
          />
          <Route
            path="/dashboard/organizations/:organizationId/todos"
            element={
              <Layout showHeaderFooter={true}>
                <TodoPage />
              </Layout>
            }
          />
          <Route
            path="/dashboard/organizations/:organizationId/todos/:todoId"
            element={
              <Layout showHeaderFooter={true}>
                <TodoDetails />
              </Layout>
            }
          />
          <Route
            path="/dashboard/organizations/:organizationId/billing"
            element={
              <Layout showHeaderFooter={true}>
                <Billing />
              </Layout>
            }
          />
          <Route
            path="/dashboard/organizations/:organizationId/events"
            element={
              <Layout showHeaderFooter={true}>
                <OrgEvents />
              </Layout>
            }
          />

          <Route
            path="/dashboard/events"
            element={
              <Layout showHeaderFooter={true}>
                <Events />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};
