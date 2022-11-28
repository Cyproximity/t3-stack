import { Flex } from "@mantine/core";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";
import Public from "../components/layouts/Public";

const LoginForm = dynamic(() => import("../components/LoginForm"), {
  ssr: false,
});

const Login = () => {
  return <LoginForm />;
};

Login.getLayout = function getLayout(page: React.ReactElement) {
  return <Public>{page}</Public>;
};

export default Login;
