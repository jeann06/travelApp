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
            {/* <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> */}
          </Nav>
          <LoginButton />
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Example;
