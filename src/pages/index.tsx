import { Button, Center, Divider, Group, Paper, Title } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useUserContext } from "../context/user.context";

const Home = (props: any) => {
  const user = useUserContext();
  const router = useRouter();

  if (!user) {
    return (
      <>
        <Center>
          <Paper
            style={{ height: "100%", maxWidth: "600px", width: "100%" }}
            p="lg"
            m="xl"
            shadow="xs"
          >
            <Title order={1} mb="lg">
              Events Ticketing App
            </Title>
            <Divider my="sm" variant="dashed" />
            <Group position="center">
              <Link href="/login" passHref>
                <Button variant="light" size="md" color="orange">
                  Log In
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button
                  size="md"
                  variant="gradient"
                  gradient={{ from: "orange", to: "red" }}
                >
                  Register
                </Button>
              </Link>
            </Group>
          </Paper>
        </Center>
      </>
    );
  }

  return <>{JSON.stringify(user)}</>;
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <main style={{ minHeight: "100vh" }}>{page}</main>;
};

export default Home;
