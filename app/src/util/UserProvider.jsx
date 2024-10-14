import React, { createContext, useContext } from "react";
import useAuth from "../hooks/useAuth";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { user, isLoggedIn, loading } = useAuth(false);

  return (
    <UserContext.Provider value={{ user, isLoggedIn, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (optionallyRequiresUserToBeLoggedIn) => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  if (
    optionallyRequiresUserToBeLoggedIn &&
    !context.loading &&
    !context.isLoggedIn
  ) {
    document.location.href = "/auth/login";
  }

  return context;
};
