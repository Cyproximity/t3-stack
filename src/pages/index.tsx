import Link from "next/link";
import React from "react";
import { useUserContext } from "../context/user.context";

const Home = (props: any) => {
  const user = useUserContext();

  if (!user) {
    return (
      <>
        <Link href="/register">Register</Link>
        <Link href="/login">Login</Link>
      </>
    );
  }

  return <>{JSON.stringify(user)}</>;
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <main>{page}</main>;
};

export default Home;
