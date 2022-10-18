import type { NextPage } from "next";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("../components/LoginForm"), { ssr: false })

const Login: NextPage = () => {
  return (
    <>
      <LoginForm />
    </>
  )
}

export default Login;
