import type { NextPage } from "next";
import Head from "next/head";
import { useRef, FC } from "react";
import { useForm } from "react-hook-form";

import { trpc } from "../utils/trpc";
import { CreateUserInput } from "../schema/user.schema";

import styles from "./index.module.css";
import Link from "next/link";

const Home: NextPage = () => {
  const {data, error, isLoading} = trpc.users.me.useQuery()

  if(isLoading) {
    return <>Loading...</>
  }

  if(error) {
    return <div>{JSON.stringify(error)}</div>
  }

  if(data) {
    return <div>{JSON.stringify(data, null, 2)}</div>
  }

  return (
    <>
      <Link href="/register">Register</Link>
      <Link href="/login">Login</Link>
    </>
  )
};

export default Home;
