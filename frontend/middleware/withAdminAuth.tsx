import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

const withAdminAuth = (WrappedComponent: any) => {
  return async (context: NextPageContext) => {
    const session: Session | null = await getSession(context);

    if (!session || !session.user || !session.user.admin) {
      if (context.res) {
        context.res.writeHead(302, { Location: "/login" });
        context.res.end();
      } else {
        window.location.href = "/login";
      }
      return { props: {} };
    }

    return { props: { session } };
  };
};

export default withAdminAuth;
