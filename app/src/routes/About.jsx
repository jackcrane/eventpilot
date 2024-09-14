import React from "react";
import { useUser } from "../util/UserProvider";

export const About = () => {
  const { user } = useUser();
  return (
    <div>
      <h1>About</h1>
      {JSON.stringify(user)}
    </div>
  );
};
