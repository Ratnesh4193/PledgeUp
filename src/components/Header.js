import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { FaCirclePlus, FaRightToBracket } from "react-icons/fa6";
import web3 from "../ethereum/web3";

const Header = () => {
  const [userInfo, setUserInfo] = useState("");
  useEffect(() => {
    const loadData = async () => {
      if (window.web3 != undefined) {
        const accounts = await web3.eth.getAccounts();
        setUserInfo(accounts[0]);
      }
    };
    loadData();
  }, []);

  return (
    <>
      <Navbar bg="light" expand="lg" variant="light" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>PledgeUp</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Container>
              <Nav className="ml-auto justify-content-end">
                <LinkContainer to="/project/new">
                  <Nav.Link>
                    <Navbar.Text className="me-1 font-weight-bold">
                      Create Project
                    </Navbar.Text>
                    <FaCirclePlus />
                  </Nav.Link>
                </LinkContainer>

                {userInfo ? (
                  <NavDropdown title="User" id="nav-dropdown">
                    <NavDropdown.Item>
                      <div
                        className="word-break-text"
                        style={{ width: "50px" }}
                      >
                        {userInfo}
                      </div>
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Navbar.Text>Log In</Navbar.Text>
                )}
              </Nav>
            </Container>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
