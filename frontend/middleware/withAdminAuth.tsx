import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

const withAdminAuth = (WrappedComponent: any) => {
  const Wrapper = (props: any) => <WrappedComponent {...props} />;

  Wrapper.getInitialProps = async (context: NextPageContext) => {
    const session: Session | null = await getSession(context);

    console.log("Session data: ", session);

    if (!session || !session.user || !session.user.admin) {
      if (context.res) {
        context.res.writeHead(302, { Location: "/login" });
        context.res.end();
      } else {
        window.location.href = "/login";
      }
      return { props: {} };
    }

    let pageProps = {};
    if (WrappedComponent.getInitialProps) {
      pageProps = await WrappedComponent.getInitialProps(context);
    }

    return { ...pageProps, session };
  };

  return Wrapper;
};

export default withAdminAuth;
