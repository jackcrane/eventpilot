import React from "react";
import { useUser } from "../util/UserProvider";
import { Link } from "react-router-dom";
import { Button } from "tabler-react-2/dist/button";

export const Home = () => {
  const { user } = useUser();
  return (
    <div>
      <h1>Home</h1>
      {JSON.stringify(user)}
      <Link to="/dashboard">About</Link>
      <Button href="/dashboard">Dashboard</Button>
    </div>
  );
};
