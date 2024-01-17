import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const UserCircle = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prev) => !prev);

  return (
    <Dropdown
      className="text-end ms-auto"
      isOpen={dropdownOpen}
      toggle={toggle}
      direction="down"
    >
      <DropdownToggle
        className="d-block border rounded-circle"
        tag="span"
        style={{
          cursor: "pointer",
        }}
      >
        <img
          src={`http://localhost:8080/${user.profileUrl}`}
          alt=""
          width="32"
          height="32"
          className="rounded-circle"
        />
      </DropdownToggle>
      <DropdownMenu className="mt-1 rounded-3 mx-0 shadow" end>
        <div className="d-grid gap-1">
          <DropdownItem header className="mb-0">
            {user.email}
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={() => signOut()}>Logout</DropdownItem>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

const LoginButton = () => {
  const { data: session } = useSession();
  console.log(session, "SESSION!");
  return (
    <div className="ms-3 flex gap-2">
      {!session && (
        <button
          type="button"
          className="ms-auto btn btn-outline-primary"
          onClick={() => signIn()}
        >
          Login
        </button>
      )}
      {session?.user && <UserCircle user={session?.user} />}
    </div>
  );
};

export default LoginButton;
