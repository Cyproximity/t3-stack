import Link from "next/link";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";
import { LoginUserInput } from "../schema/user.schema";
import {
  Group,
  Button,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  LoadingOverlay,
  Center,
} from "@mantine/core";

const LoginForm: FC = () => {
  const router = useRouter();
  const [loginErr, setLoginErr] = useState("");
  const {
    register,
    resetField,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginUserInput>();
  const { mutate, error, isLoading } = trpc.users.access.useMutation({
    onSuccess(data) {
      router.push(data.redirect.includes("login") ? "/" : data.redirect);
    },
    onError(error, variables, context) {
      if (error?.data?.httpStatus === 403) {
        resetField("password");
        setLoginErr(error?.message);
      }
    },
  });

  const onSubmit = (data: LoginUserInput) => {
    setLoginErr("");
    mutate({ ...data, redirect: router.asPath });
  };

  const findErrors = (fieldName: string) => {
    let message;
    if (errors && fieldName == "email") {
      message = errors?.email?.message;
    }
    if (errors && fieldName == "password") {
      message = errors?.password?.message;
    }
    if (error?.data?.zodError) {
      const fieldErrors = error?.data?.zodError.fieldErrors;
      if (fieldErrors[fieldName]) {
        message = fieldErrors[fieldName]
          ? fieldErrors[fieldName]?.[0]
          : undefined;
      }
    }
    return message;
  };

  return (
    <>
      <Center py="lg">
        <Paper shadow="xs" p="md" style={{ width: 400, position: "relative" }}>
          <LoadingOverlay visible={isLoading} overlayBlur={2} />
          <Title mb="lg" fw={700} order={3}>
            Login
          </Title>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextInput
              type="email"
              label="Your Email"
              error={findErrors("email")}
              mb="md"
              placeholder="email@example.com"
              {...register("email", { required: "Email is required." })}
            />
            <PasswordInput
              label="Your Password"
              error={findErrors("password") || loginErr}
              mb="md"
              placeholder="secret"
              {...register("password", { required: "Password is required." })}
            />
            <Group>
              <Button type="submit">Login</Button>
            </Group>
          </form>
        </Paper>
      </Center>
      <Center>
        <Link href="/register">Create an Account</Link>
      </Center>
    </>
  );
};

export default LoginForm;
