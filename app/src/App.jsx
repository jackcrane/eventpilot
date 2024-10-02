import React, { createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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

export default () => {
  return (
    <UserProvider>
      <Header />
      <Toaster />
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
            path="/dashboard/organizations/:organizationId"
            element={<OrganizationHome />}
          />
          <Route
            path="/dashboard/organizations/:organizationId/basics"
            element={<OrganizationBasics />}
          />
          <Route
            path="/dashboard/organizations/:organizationId/legal"
            element={<OrganizationLegal />}
          />
          <Route
            path="/dashboard/organizations/:organizationId/marketing"
            element={<OrganizationMarketing />}
          />

          <Route
            path="/dashboard/organizations/:organizationId/logs"
            element={<Logs />}
          />
          <Route
            path="/dashboard/organizations/:organizationId/todos"
            element={<TodoPage />}
          />
          <Route
            path="/dashboard/organizations/:organizationId/todos/:todoId"
            element={<TodoDetails />}
          />

          <Route path="/dashboard/events" element={<Events />} />
        </Routes>
      </Router>
      <Footer />
    </UserProvider>
  );
};
