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
} from "reactstrap";
import Link from "next/link";
import { Bell } from "react-feather";

function Example(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const toggle = () => setIsOpen(!isOpen);

  const handleNotificationClick = () => {
    // Logic to handle notification click, e.g., show a notification
    // For simplicity, increment the count here
    setNotificationCount(notificationCount + 1);
    // You can add further logic here, like displaying a notification
    // using a library or browser's Notification API
  };

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
          <div style={{ position: "relative" }}>
            <Bell className="" onClick={handleNotificationClick} />
            {notificationCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "red",
                  borderRadius: "50%",
                  padding: "3px",
                  color: "white",
                  fontSize: "12px",
                  height: "20px",
                  width: "20px",
                }}
                className="text-center align-items-center"
              >
                {notificationCount}
              </span>
            )}
          </div>
          <LoginButton />
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Example;
