import React, { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Dropdown, Form } from "react-bootstrap";
import web3 from "../ethereum/web3";
import factory from "../ethereum/factory";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [minimumContribution, setMinimumContribution] = useState(0);
  const [targetAmount, setTargetAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [isLoading, setIsLoading] = useState(0);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const submitHandler = async (e) => {
    setMessage("");
    e.preventDefault();
    setIsLoading(1);

    try {
      if (minimumContribution < 0) {
        throw new Error("Minimum Contribtion must be positive.");
      }
      if (targetAmount <= 0) {
        throw new Error("Target Amount must be greater than zero.");
      }
      if (window.web3 == undefined) {
        throw new Error(
          "Please Login with a metamask account to make a transaction."
        );
      }

      const accounts = await web3.eth.getAccounts();

      await factory.methods
        .createProject(
          title,
          minimumContribution,
          targetAmount,
          description,
          targetDate,
          imageLink,
          category
        )
        .send({
          from: accounts[0],
          gas: "10000000",
        });
      setMinimumContribution(0);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    }

    setIsLoading(0);
  };
  return (
    <FormContainer>
      <h1>Create Project</h1>
      <Form onSubmit={submitHandler}>
        <Form.Floating className="mb-3">
          <Form.Control
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label htmlFor="title">Title</label>
        </Form.Floating>

        <Form.Floating className="mb-3">
          <Form.Control
            id="minimumContribution"
            type="number"
            pattern="[0-9]"
            value={minimumContribution}
            onChange={(e) => setMinimumContribution(e.target.value)}
          />
          <label htmlFor="minimumContribution">
            Minimum Contribution (in Wei)
          </label>
        </Form.Floating>

        <Form.Floating className="mb-3">
          <Form.Control
            id="targetAmount"
            type="number"
            pattern="[0-9]"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />
          <label htmlFor="minimumContribution">Target Amount (in Wei)</label>
        </Form.Floating>

        <Form.Floating className="mb-3">
          <Form.Control
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label htmlFor="description">Description</label>
        </Form.Floating>

        <Form.Group className="mb-3" controlId="targetDate">
          <Form.Label>Target Date</Form.Label>
          <Form.Control
            type="date"
            name="targetDate"
            placeholder="Target Date"
            onChange={(e) => setTargetDate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Floating className="mb-3">
          <Form.Control
            id="imageLink"
            type="text"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            required
          />
          <label htmlFor="imageLink">Image Link</label>
        </Form.Floating>
        <Form.Group className="mb-3">
          <Form.Label>Select Category</Form.Label>
          <Form.Select
            id="category"
            type="text"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            required
          >
            <option></option>
            <option>Arts</option>
            <option>Comics & Illustration</option>
            <option>Design & Tech</option>
            <option>Film</option>
            <option>Food & Craft</option>
            <option>Games</option>
            <option>Music</option>
            <option>Publishing</option>
          </Form.Select>
        </Form.Group>
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

export default CreateProject;
