import React, { useState, useEffect } from "react";
import factory from "../ethereum/factory";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import Project from "../components/Project";
import { FaPlus } from "react-icons/fa6";
import Loader from "../components/Loader";
import { LinkContainer } from "react-router-bootstrap";
import web3 from "../ethereum/web3";
const HomeScreen = () => {
  const [projectList, setProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(0);
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(1);
      try {
        const newProjectList = await factory.methods
          .getDeployedProjects()
          .call();
        console.log(newProjectList);
        setProjectList(newProjectList);
      } catch (err) {
        console.log(err.message);
      }
      setIsLoading(0);
    };
    loadData();
  }, []);

  return (
    <>
      <Navbar expand="lg" collapseOnSelect>
        <Container className="shadow-sm p-2 mb-2 bg-white rounded display-7 d-flex justify-content-center align-items-center">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {categories.map((category) => {
              return (
                <Container>
                  <Nav className="ml-auto justify-content-center on-hover">
                    <LinkContainer to="/">
                      <Nav.Link>{category}</Nav.Link>
                    </LinkContainer>
                  </Nav>
                </Container>
              );
            })}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div>
        <h3 className="display-6 mb-4 d-flex justify-content-center align-items-center ">
          <strong>Transform your creative vision into reality</strong>
        </h3>
        <h5 className="fw-light d-flex  justify-content-center align-items-center ">
          By PledgeUp
        </h5>
      </div>

      <Container className="shadow-sm p-2 mb-2 bg-white display-7 d-flex flex-column justify-content-center align-items-center">
        <div className="display-6 text-success">{projectList.length}</div>
        <div>projects funded</div>
      </Container>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Row className="d-flex align-items-center justify-content-center">
            {projectList.map((project, id) => {
              return (
                <Col key={id} sm={12} md={6} lg={3} xl={3}>
                  <Project project={project} />
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
