import { useRouter } from "next/router";
import { appRoutes } from "../../constants";
import { useUserContext } from "../../context/user.context";

interface IProtectedRoute {
  router: any;
  children?: JSX.Element;
}

const isBrowser = () => typeof window !== undefined;

const ProtectedRoute = ({ router, children }: IProtectedRoute): JSX.Element => {
  const user = useUserContext();
  const routerhook = useRouter();
  const unprotectedRoutes = [appRoutes.LOGIN, appRoutes.REGISTER];

  const isPathUnProtected = unprotectedRoutes.includes(router.pathname);

  if (isBrowser() && isPathUnProtected && user) {
    routerhook.replace("/");
  }

  return <>{children}</>;
};
export default ProtectedRoute;
