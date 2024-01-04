import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "reactstrap";

const LoginButton = () => {
  const { data: session } = useSession();
  return (
    <div className="ml-auto flex gap-2">
      {session?.user ? (
        <>
          <p className=""> {session.user.name}</p>
          <Button onClick={() => signOut()}>Logout</Button>
        </>
      ) : (
        <Button color="warning" onClick={() => signIn()}>
          Login
        </Button>
      )}
    </div>
  );
};

export default LoginButton;