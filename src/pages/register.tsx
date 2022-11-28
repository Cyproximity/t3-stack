import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";
import { CreateUserInput } from "../schema/user.schema";
import {
  Button,
  Center,
  Group,
  LoadingOverlay,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";

const Register: NextPage = () => {
  const {
    register,
    resetField,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUserInput>();
  const { mutate, error, isLoading } = trpc.users.create.useMutation({
    onSuccess() {
      router.push("/login");
    },
  });
  const router = useRouter();
  const onSubmit = (data: CreateUserInput) => {
    mutate(data);
  };

  const findErrors = (fieldName: string) => {
    let message;
    if (errors.name && fieldName == "name") {
      message = errors.name?.message;
    }
    if (errors.username && fieldName == "username") {
      message = errors.username?.message;
    }
    if (errors && fieldName == "email") {
      message = errors.email?.message;
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
      <Center py="lg" px="md">
        <Paper shadow="xs" p="md" style={{ width: 400, position: "relative" }}>
          <LoadingOverlay visible={isLoading} overlayBlur={2} />
          <Title mb="lg" fw={700} order={3}>
            Register new account
          </Title>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextInput
              label="Your Name"
              placeholder="Gerald Agstn"
              mb="md"
              error={findErrors("name")}
              {...register("name", { required: "Name is required" })}
            />
            <TextInput
              type="email"
              label="Your Email"
              placeholder="gerald@agstn.xyz"
              mb="md"
              error={findErrors("email")}
              {...register("email", { required: "Email is required" })}
            />
            <TextInput
              label="Your Username"
              placeholder="grald.agstn"
              mb="md"
              error={findErrors("username")}
              {...register("username", { required: "Username is required" })}
            />
            <PasswordInput
              label="Your Password"
              placeholder="secret"
              mb="md"
              error={findErrors("password")}
              {...register("password", { required: "Password is required" })}
            />
            <Group>
              <Button type="submit">Create User</Button>
            </Group>
          </form>
        </Paper>
      </Center>
      <Center>
        <Link href="/login">I have an Account</Link>
      </Center>
    </>
  );
};

export default Register;
