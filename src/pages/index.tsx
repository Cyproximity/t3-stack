import type { NextPage } from "next";

import Link from "next/link";
import { useUserContext } from "../context/user.context";

const Home: NextPage = () => {
  const user = useUserContext()

  if(!user) {
    return (
      <>
        <Link href="/register">Register</Link>
        <Link href="/login">Login</Link>
      </>
    )
  }

  return (
   <>
    {JSON.stringify(user)}
   </>
  );  
};

export default Home;
