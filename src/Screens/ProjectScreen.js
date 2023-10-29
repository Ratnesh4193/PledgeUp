import React, { useEffect, useState } from "react";
import compiledProject from "../ethereum/build/Project.json";
import web3 from "../ethereum/web3";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Button, Card, Col, Form, ListGroup, Row } from "react-bootstrap";
import ProjectCard from "../components/ProjectCard";
import Project from "../ethereum/Project";

const defaultProject = {
  manager: "",
  balance: 0,
  title: "",
  description: "",
  category: "",
  targetAmount: 0,
  minimumContribution: 0,
  backersCount: 0,
  targetDate: "",
  fundingReceived: "",
  pendingRequests: "",
  finalizedRequests: "",
};
const projectHeader = {
  manager: "Address of Manager",
  balance: "Balance(in Wei)",
  category: "Category",
  targetAmount: "Target Amount(in Wei)",
  minimumContribution: "Minimum Contribution(in Wei)",
  backersCount: "Total Backers",
  targetDate: "Due Date",
  fundingReceived: "Funding Received(in Wei)",
  totalRequests: "Total Requests",
};
const projectDescription = {
  manager:
    "The manager created this project and can create requests to withdraw money",
  balance: "The balance is how much money this project has left to spend.",
  title: "The title of the project.",
  description: "A brief objective of the project.",
  category: "Categorize the project for easy classification.",
  targetAmount: "The fundraising goal for the project in Wei.",
  minimumContribution:
    "You must contribute at least this much wei to become an approver.",
  backersCount: "The number of project supporters",
  targetDate: "The project's target date or deadline.",
  fundingReceived: "The total funds raised in Wei.",
  totalRequests: "The number of approved and completed withdrawal requests.",
};

const ProjectScreen = () => {
  const [currentProject, setCurrentProject] = useState(defaultProject);
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(0);
  const [isContributeLoading, setIsContributeLoading] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updateUI, setUpdateUI] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const { projectAddress } = useParams();

  const submitHandler = async (e) => {
    setMessage("");
    setSuccess("");
    setError("");
    e.preventDefault();
    setIsContributeLoading(1);
    console.log(currentProject);
    try {
      if (amount < currentProject["minimumContribution"]) {
        throw new Error(
          "Amount must be greater than or equal to the minimum contribution."
        );
      }
      if (window.web3 == undefined) {
        throw new Error(
          "Please Login with a metamask account to make a transaction."
        );
      }
      const accounts = await web3.eth.getAccounts();
      const project = Project(projectAddress);
      await project.methods.contribute().send({
        from: accounts[0],
        gas: "1400000",
        value: amount.toString(),
      });
      setAmount(0);
      setSuccess("Contribution made successfully!!");
      setError("");
      setUpdateUI(!updateUI);
    } catch (err) {
      setSuccess("");
      setError(err.message);
    }
    setIsContributeLoading(0);
  };
  const fromBigIntToNumber = (num) => {
    return web3.utils.toNumber(web3.utils.toBN(num));
  };
  const toBigInt = (num) => {
    return web3.utils.toBN(num);
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setIsLoading(1);
      const newProject = await new web3.eth.Contract(
        compiledProject.abi,
        projectAddress
      );

      const data = await newProject.methods.getSummary().call();
      const {
        0: manager,
        1: balance,
        2: title,
        3: description,
        4: category,
        5: targetAmount,
        6: minimumContribution,
        7: backersCount,
        8: targetDate,
        9: imageLink,
        10: fundingReceived,
        11: pendingRequestsTmp,
      } = data;
      setPendingRequests(pendingRequestsTmp);
      const totalRequests = await newProject.methods.getRequestsCount().call();

      setCurrentProject({
        manager,
        balance: fromBigIntToNumber(balance),
        title,
        description,
        category,
        targetAmount: fromBigIntToNumber(targetAmount),
        minimumContribution: fromBigIntToNumber(minimumContribution),
        backersCount: fromBigIntToNumber(backersCount),
        targetDate,
        imageLink,
        fundingReceived: fromBigIntToNumber(fundingReceived),
        pendingRequests: fromBigIntToNumber(pendingRequests),
        totalRequests: fromBigIntToNumber(totalRequests),
      });

      setIsLoading(0);
    };
    fetchProjectDetails();
  }, [updateUI]);

  return (
    <>
      {isLoading ? (
        <h2>
          <Loader />
        </h2>
      ) : message ? (
        <h3>
          <Message variant="danger">{message}</Message>
        </h3>
      ) : (
        <>
          <Row>
            <Col sm={12} md={12} lg={9} xl={9}>
              <Row>
                <div>
                  <h3 className="display-6 mb-4 d-flex justify-content-center align-items-center ">
                    <strong className="text-capitalize">
                      {currentProject.title}
                    </strong>
                  </h3>
                  <h5 className="text-capitalize fw-light d-flex  justify-content-center align-items-center ">
                    {currentProject.description}
                  </h5>
                  <h5 className="text-capitalize fw-light d-flex  justify-content-center align-items-center ">
                    {projectAddress}
                  </h5>
                </div>
              </Row>
              <Row>
                {Object.keys(projectHeader).map((key, id) => {
                  return (
                    // <p> {key}</p>
                    <Col key={id} sm={12} md={12} lg={6} xl={6}>
                      <ProjectCard
                        data={{
                          variant: "light",
                          header: projectHeader[key],
                          value: currentProject[key],
                          description: projectDescription[key],
                        }}
                      />
                    </Col>
                  );
                })}
              </Row>
            </Col>
            <Col sm={12} md={12} lg={3} xl={3}>
              <Row>
                <Form onSubmit={submitHandler}>
                  <Card
                    bg={"White"}
                    key={"White"}
                    text={"black"}
                    className="my-1 p-4 rounded"
                  >
                    <h5 className="mb-4 d-flex justify-content-center  flex-column">
                      <div className="display-6 text-success text-capitalize">
                        {currentProject.fundingReceived} Wei
                      </div>
                      <div className=" fw-light text-capitalize">
                        pleged of {currentProject.targetAmount} Wei target
                      </div>
                    </h5>
                    <h5 className="mb-4 d-flex justify-content-center  flex-column">
                      <div className="display-6">
                        {currentProject.backersCount}
                      </div>
                      <div className=" fw-light">backers</div>
                    </h5>
                    <Card.Title className="my-1 p-1 rounded">
                      Contribute to this Project!
                    </Card.Title>
                    <Card.Header>
                      <Form.Floating>
                        <Form.Control
                          id="amount"
                          type="number"
                          pattern="[0-9]"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <label htmlFor="amount">Amount (in Wei)</label>
                      </Form.Floating>
                      {error !== "" && (
                        <div className="my-2 p-1 rounded">
                          <Message variant="danger">{error}</Message>
                        </div>
                      )}
                      {success !== "" && (
                        <div className="my-2 p-1 rounded">
                          <Message variant="success">{success}</Message>
                        </div>
                      )}
                      {isContributeLoading ? (
                        <h2>
                          <Loader />
                        </h2>
                      ) : (
                        <Button
                          type="submit"
                          variant="danger"
                          style={{ marginTop: "10px" }}
                        >
                          Contribue!
                        </Button>
                      )}
                    </Card.Header>
                  </Card>
                </Form>
              </Row>
              <Row>
                <Link to={`/project/${projectAddress}/request/new`}>
                  <Card
                    bg={"White"}
                    key={"White"}
                    text={"black"}
                    className="my-1 p-1 rounded"
                  >
                    <Card.Title className="my-1 p-1 rounded">
                      Create a new request!!
                    </Card.Title>
                  </Card>
                </Link>
              </Row>
              <Row>
                <Link
                  to={`/project/${projectAddress}/request`}
                  className="my-3 p-3 rounded"
                >
                  <ProjectCard
                    data={{
                      variant: "light",
                      header: "",
                      value: `View all pending requests(${pendingRequests})`,
                      description: "",
                    }}
                  />
                </Link>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProjectScreen;
