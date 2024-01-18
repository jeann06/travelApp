import React, { useState } from "react";
import LoginButton from "./LoginButton";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Dropdown,
  Badge,
} from "reactstrap";
import Link from "next/link";
import { Bell } from "react-feather";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "react-query";
import fetcher from "@/utils/fetcher";
import moment from "moment";
import { useRouter } from "next/router";

const NotificationButton = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const toggle = () => setDropdownOpen((prev) => !prev);

  const { data: session, status } = useSession();
  const query = useQuery(
    ["notifications", "0", "10"],
    async () => {
      const res = await fetcher.get(
        "/notification/notifications/get?page=0&size=10",
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );
      return res.data;
    },
    {
      enabled: status === "authenticated",
    }
  );

  const readAll = useMutation(
    ["readAllNotifications"],
    async () => {
      const res = await fetcher.get("/notification/notifications/readAll", {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });

      return res.data;
    },
    {
      onSuccess: () => {
        query.refetch();
      },
    }
  );

  if (query.isLoading || status !== "authenticated") {
    return null;
  }

  return (
    <div>
      <Dropdown
        className="text-end ms-auto"
        isOpen={dropdownOpen}
        toggle={toggle}
        direction="down"
      >
        <DropdownToggle className="position-relative" caret={false} tag="div">
          <Bell className="" role="button" />
          {query.data.data.content.filter((n) => !n.read).length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {query.data.data.content.filter((n) => !n.read).length}
            </span>
          )}
        </DropdownToggle>
        <DropdownMenu
          className="mt-1 p-2 rounded-3 mx-0 shadow"
          style={{
            maxHeight: "450px",
            overflow: "scroll",
            overflowX: "hidden",
          }}
        >
          <div className="d-grid gap-1">
            {query.data.data.content.map((notification) => (
              <DropdownItem
                key={notification.id}
                className={`rounded-2 p-3 ${
                  notification.read ? "" : "bg-danger-subtle"
                }`}
                onClick={async () => {
                  const response = await fetcher.get(
                    `/notification/read/${notification.id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${session.user.token}`,
                      },
                    }
                  );
                  query.refetch();
                  router.push(`/places/${notification.postId}`);
                }}
              >
                <div
                  className="d-flex gap-2 align-items-center"
                  style={{ fontSize: 14 }}
                >
                  <span className="badge badge-sm bg-primary">
                    {notification.category}
                  </span>
                  &middot;
                  <span>{moment(notification.createdDate).fromNow()}</span>
                </div>
                <strong>{notification.title}</strong>
                <div>{notification.message}</div>
              </DropdownItem>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center py-2">
            <button className="btn btn-sm btn-primary">See More</button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => readAll.mutate()}
            >
              Read All
            </button>
          </div>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

function Example(args) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar expand>
        <NavbarBrand href="/">TravelApp</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto " navbar>
            <NavItem>
              <NavLink tag={Link} href="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href={`/places/`}>Places to Visit</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/">About Us</NavLink>
            </NavItem>
          </Nav>
          <NotificationButton />
          <LoginButton />
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Example;
