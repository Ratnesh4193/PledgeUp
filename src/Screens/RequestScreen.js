import React, { useEffect, useState } from "react";
import Project from "../ethereum/Project";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import web3 from "../ethereum/web3";

const tableHeading = [
  "ID",
  "Description",
  "Amount",
  "Recipient",
  "Approval Count",
  "Approve",
  "Finalize",
];
const RequestScreen = () => {
  const { projectAddress } = useParams();
  const [requests, setRequests] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [manager, setManager] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updateUI, setUpdateUI] = useState(0);
  const [isLoading, setIsLoading] = useState(0);
  const [requestLoading, setRequestLoading] = useState([]);
  const [finalizeLoading, setFinalizeLoading] = useState([]);
  const fromBigIntToNumber = (num) => {
    return web3.utils.toNumber(web3.utils.toBN(num));
  };
  const toBigInt = (num) => {
    return web3.utils.toBN(num);
  };
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(1);

      const project = Project(projectAddress);

      const currentManager = await project.methods.manager().call();
      setManager(currentManager);

      const currentAccounts = await web3.eth.getAccounts();
      setAccounts(currentAccounts);

      const currentRequestCount = await project.methods
        .getRequestsCount()
        .call();
      setRequestCount(fromBigIntToNumber(currentRequestCount));

      const zeroArray = Array.from({ length: currentRequestCount }, () => 0);
      setRequestLoading(zeroArray);
      setFinalizeLoading(zeroArray);

      let newRequests = [];
      for (let i = 0; i < currentRequestCount; i++) {
        const currentRequest = await project.methods.requests(i).call();
        const backersCount = await project.methods.backersCount().call();
        newRequests.push({
          id: i + 1,
          description: currentRequest["description"],
          amount: currentRequest["amount"],
          recipient: currentRequest["recipient"],
          approvalCount: currentRequest["approvalCount"],
          backersCount: backersCount,
          complete: currentRequest["complete"],
          readyToFinalize: currentRequest["approvalCount"] * 2 > backersCount,
        });
      }
      setRequests(newRequests);
      setIsLoading(0);
    };
    fetchRequests();
  }, [updateUI]);
  const onApprove = async (e) => {
    setError("");
    setRequestLoading((prev) => {
      return prev.map((ele, key) => {
        if (key == e.target.id) {
          return 1;
        }
        return ele;
      });
    });
    try {
      if (window.web3 == undefined) {
        throw new Error(
          "Please Login with a metamask account to make a transaction."
        );
      }
      const project = Project(projectAddress);

      await project.methods.approveRequest(e.target.id).send({
        from: accounts[0],
        gas: "1400000",
      });
      setUpdateUI(!updateUI);
    } catch (err) {
      setError(err.message);
    }
    setRequestLoading((prev) => {
      return prev.map((ele, key) => {
        if (key == e.target.id) {
          return 0;
        }
        return ele;
      });
    });
  };

  const onFinalize = async (e) => {
    setError("");
    setFinalizeLoading((prev) => {
      return prev.map((ele, key) => {
        if (key == e.target.id) {
          return 1;
        }
        return ele;
      });
    });
    try {
      if (window.web3 == undefined) {
        throw new Error(
          "Please Login with a metamask account to make a transaction."
        );
      }
      const project = Project(projectAddress);

      await project.methods.finalizeRequest(e.target.id).send({
        from: accounts[0],
        gas: "1400000",
      });
      setUpdateUI(!updateUI);
    } catch (err) {
      setError(err.message);
    }

    setFinalizeLoading((prev) => {
      return prev.map((ele, key) => {
        if (key == e.target.id) {
          return 0;
        }
        return ele;
      });
    });
  };
  return isLoading ? (
    <h2>
      <Loader />
    </h2>
  ) : (
    <>
      <Row>
        <Col sm={12} md={12} lg={9} xl={9}>
          {error && (
            <h3>
              <Message variant="danger">{error}</Message>
            </h3>
          )}

          <Table
            responsive
            style={{ backgroundColor: "transparent", shadowOpacity: 0 }}
          >
            <thead>
              <tr>
                {tableHeading.map((_, index) => (
                  <th key={index}>{tableHeading[index]}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {requests.map((req, i) => {
                console.log(req);
                return (
                  <tr key={i}>
                    <th>{req.id}</th>
                    <td>{req.description}</td>
                    <td>{req.value}</td>
                    <td>{req.recipient}</td>
                    <td>
                      {req.approvalCount}/{req.backersCount}
                    </td>
                    <td>
                      {!req.complete && (
                        <Button
                          id={i}
                          variant="success"
                          onClick={onApprove}
                          disabled={requestLoading[i]}
                        >
                          Approve
                        </Button>
                      )}
                    </td>
                    <td>
                      {manager === accounts[0] && !req.complete && (
                        <Button
                          id={i}
                          variant="danger"
                          onClick={onFinalize}
                          disabled={finalizeLoading[i] || !req.readyToFinalize}
                        >
                          Finalize
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
        <Col sm={12} md={12} lg={3} xl={3}>
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
        </Col>
      </Row>
    </>
  );
};

export default RequestScreen;
