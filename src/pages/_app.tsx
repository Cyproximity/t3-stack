// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { UserContextProvider } from "../context/user.context";

const MyApp: AppType = ({ Component, pageProps }) => {
  const { data, isLoading, error } = trpc.users.me.useQuery()

  if(isLoading) {
    return <>Loading...</>
  }

  return (
    <UserContextProvider value={data}>
      <Component {...pageProps} />
    </UserContextProvider>
  );
};

export default trpc.withTRPC(MyApp);
