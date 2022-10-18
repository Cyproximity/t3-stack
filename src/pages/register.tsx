import type { NextPage } from "next";
import {useForm} from "react-hook-form";
import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";
import { CreateUserInput } from "../schema/user.schema";

const Register: NextPage = () => {
  const { register, handleSubmit } = useForm<CreateUserInput>();
  const {mutate, error, isLoading} = trpc.users.create.useMutation({
    onSuccess() {
      router.push("/login");
    }
  })
  const router = useRouter()
  const onSubmit = (data: CreateUserInput) => {
    mutate(data)
  }

  if(isLoading) {
    return (<>Loading...</>)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        <h1>Sign up</h1>
        <input type="text" placeholder="name" {...register("name")}/>
        <br />
        <input type="email" placeholder="email"  {...register("email")} />
        <br />
        <input type="text" placeholder="username"  {...register("username")} />
        <br />
        <input type="password" placeholder="password"  {...register("password")} />
        <br />
        <button type="submit"> create user</button>
      </form>
    </>
  );
}

export default Register;
