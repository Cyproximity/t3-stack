import Link from "next/link";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";
import { LoginUserInput } from "../schema/user.schema";


const LoginForm: FC = () => {
  const router = useRouter()
  const { register, handleSubmit } = useForm<LoginUserInput>();
  const { mutate, error, isLoading } = trpc.users.access.useMutation({
    onSuccess(data) {
      router.push(data.redirect.includes("login")? "/": data.redirect)
    }
  });
  
  const onSubmit = (data:LoginUserInput) => {
    mutate({...data, redirect: router.asPath })
  }

  if(isLoading) {
    return (<>Loading...</>)
  }

  return (
    <>
      {error && error.message}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="email" {...register("email")}/>
        <input type="password" placeholder="password" {...register("password")}/>
        <button type="submit">Login</button>
      </form>
      <Link href="/register">Create an Account</Link>
    </>
  )
}

export default LoginForm;
