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
  const categories = [
    "Arts",
    "Comics & Illustration",
    "Design & Tech",
    "Film",
    "Food & Craft",
    "Games",
    "Music",
    "Publishing",
  ];
  const SampleData = [
    {
      title: "Artistic Creations",
      minimumContribution: 50,
      targetAmount: 5000,
      description: "Support the creation of unique artistic pieces.",
      targetDate: "2023-12-31",
      imageLink: "https://example.com/artistic-creations.jpg",
      category: "Arts",
    },
    {
      title: "Comic Book Adventure",
      minimumContribution: 25,
      targetAmount: 10000,
      description: "Help fund an exciting comic book project.",
      targetDate: "2023-11-15",
      imageLink: "https://example.com/comic-book-adventure.jpg",
      category: "Comics & Illustration",
    },
    {
      title: "Tech Innovation",
      minimumContribution: 100,
      targetAmount: 75000,
      description: "Support groundbreaking tech innovation.",
      targetDate: "2024-05-20",
      imageLink: "https://example.com/tech-innovation.jpg",
      category: "Design & Tech",
    },
    {
      title: "Indie Film Production",
      minimumContribution: 30,
      targetAmount: 30000,
      description: "Fund an independent film with a unique story.",
      targetDate: "2023-09-10",
      imageLink: "https://example.com/indie-film-production.jpg",
      category: "Film",
    },
    {
      title: "Gourmet Food Experience",
      minimumContribution: 20,
      targetAmount: 2000,
      description: "Explore the world of gourmet food and flavors.",
      targetDate: "2023-10-01",
      imageLink: "https://example.com/gourmet-food-experience.jpg",
      category: "Food & Craft",
    },
    {
      title: "Virtual Reality Game",
      minimumContribution: 50,
      targetAmount: 60000,
      description: "Join the adventure in a VR gaming world.",
      targetDate: "2024-02-28",
      imageLink: "https://example.com/vr-game.jpg",
      category: "Games",
    },
    {
      title: "Music Album Production",
      minimumContribution: 10,
      targetAmount: 15000,
      description: "Help create a new music album with unique melodies.",
      targetDate: "2023-12-15",
      imageLink: "https://example.com/music-album-production.jpg",
      category: "Music",
    },
    {
      title: "Publishing a Novel",
      minimumContribution: 15,
      targetAmount: 12000,
      description: "Support the publishing of an intriguing novel.",
      targetDate: "2024-04-05",
      imageLink: "https://example.com/novel-publishing.jpg",
      category: "Publishing",
    },
    {
      title: "Artistic Creations II",
      minimumContribution: 40,
      targetAmount: 4500,
      description: "Continuation of unique artistic pieces project.",
      targetDate: "2023-11-30",
      imageLink: "https://example.com/artistic-creations-2.jpg",
      category: "Arts",
    },
    {
      title: "Board Game Design",
      minimumContribution: 30,
      targetAmount: 8000,
      description: "Contribute to the creation of an exciting board game.",
      targetDate: "2023-10-20",
      imageLink: "https://example.com/board-game-design.jpg",
      category: "Games",
    },
  ];

  const fillSampleData = async () => {
    setIsLoading(1);
    for (let i = 0; i < SampleData.length; i++) {
      const accounts = await web3.eth.getAccounts();

      await factory.methods
        .createProject(
          SampleData[i].title,
          SampleData[i].minimumContribution,
          SampleData[i].targetAmount,
          SampleData[i].description,
          SampleData[i].targetDate,
          SampleData[i].imageLink,
          SampleData[i].category
        )
        .send({
          from: accounts[0],
          gas: "10000000",
        });
    }
    setIsLoading(0);
  };
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
      <Button onClick={fillSampleData}>Fill Sample data</Button>
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
