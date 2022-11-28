// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps, AppType } from "next/app";
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { UserContextProvider } from "../context/user.context";
import ProtectedRoute from "../components/wrappers/ProtectedRoutes";
import { MantineProvider } from "@mantine/core";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App: AppType = (props: AppPropsWithLayout) => {
  const { Component, pageProps, router } = props;
  const { data, isLoading, error } = trpc.users.me.useQuery();

  const getLayout = Component.getLayout ?? ((page: any) => page);
  const layout = getLayout(<Component {...pageProps} />);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
          fontFamily: "Open Sans",
        }}
      >
        <UserContextProvider value={data}>
          <ProtectedRoute router={router}>{layout}</ProtectedRoute>
        </UserContextProvider>
      </MantineProvider>
    </>
  );
};

export default trpc.withTRPC(App);
