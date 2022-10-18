import { inferProcedureOutput } from "@trpc/server"
import React, { createContext, useContext } from "react"
import { AppRouter } from "../server/trpc/router/_app"

type inferQueryOut = inferProcedureOutput<AppRouter['users']['me']>

const UserContext = createContext<inferQueryOut>(null)

const UserContextProvider = ({ children, value }: {
  children: React.ReactNode,
  value: inferQueryOut | undefined
}) => <UserContext.Provider value={value||null}>{children}</UserContext.Provider>;

const useUserContext = () => useContext(UserContext);

export { useUserContext, UserContextProvider }
