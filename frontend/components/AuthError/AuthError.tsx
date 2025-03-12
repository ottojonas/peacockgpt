import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AuthError = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (router.query.error) {
      setError(router.query.error as string);
    }
  }, [router.query.error]);

  return (
    <div>
      <h1>Authentication Error</h1>
      {error ? <p>{error}</p> : <p>No error message available.</p>}
    </div>
  );
};

export default AuthError;