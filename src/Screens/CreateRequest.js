import React, { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Form } from "react-bootstrap";
import web3 from "../ethereum/web3";
import Project from "../ethereum/Project";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useNavigate, useParams } from "react-router-dom";

const CreateRequest = () => {
  const { projectAddress } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(0);
  const [message, setMessage] = useState("");
  const submitHandler = async (e) => {
    setMessage("");
    e.preventDefault();
    setIsLoading(1);
    try {
      if (value < 0) {
        throw new Error("Minimum Contribtion must be positive.");
      }
      if (window.web3 == undefined) {
        throw new Error(
          "Please Login with a metamask account to make a transaction."
        );
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const project = Project(projectAddress);
      await project.methods.createRequest(description, value, recipient).send({
        from: accounts[0],
        gas: "10000000",
      });
      setDescription("");
      setValue(0);
      setRecipient("");
      navigate(`/project/${projectAddress}/request`);
    } catch (err) {
      setMessage(err.message);
    }

    setIsLoading(0);
  };
  return (
    <FormContainer>
      <h1>Create Request </h1>
      <Form onSubmit={submitHandler}>
        <Form.Floating className="mb-3">
          <Form.Control
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="description">Description for new request.</label>
        </Form.Floating>

        <Form.Floating className="mb-3">
          <Form.Control
            id="value"
            type="number"
            pattern="[0-9]"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <label htmlFor="value">Amount (in Wei)</label>
        </Form.Floating>

        <Form.Floating className="mb-3">
          <Form.Control
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <label htmlFor="recipient">Recipient Address</label>
        </Form.Floating>
        {message !== "" && <Message variant="danger">{message}</Message>}
        {isLoading ? (
          <Loader />
        ) : (
          <Button type="submit" variant="dark" style={{ marginTop: "10px" }}>
            Create
          </Button>
        )}
      </Form>
    </FormContainer>
  );
};

export default CreateRequest;
