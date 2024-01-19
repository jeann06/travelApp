import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import { LogOut } from "react-feather";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useRouter } from "next/router";

const UserCircle = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prev) => !prev);
  const router = useRouter();
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
          <DropdownItem header className="mb-0" style={{ fontSize: "16px" }}>
            @{user.username}
          </DropdownItem>
          <DropdownItem onClick={() => router.push(`/profile`)}>
            Profile
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem
            className="text-danger"
            onClick={() => signOut()}
            style={{ fontSize: "14px" }}
          >
            <LogOut style={{ width: "15px" }} className="me-1" />
            Logout
          </DropdownItem>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

const LoginButton = () => {
  const { data: session } = useSession();
  console.log(session, "SESSION!");
  return (
    <div className="ms-3 flex gap-2 user-select-none">
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
