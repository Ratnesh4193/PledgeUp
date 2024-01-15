import React from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

const Project = ({ project }) => {
  return (
    <Card className="my-3 p-3 rounded card-hover">
      <Card.Body>
        <Card.Title as="h4">
          <strong className="text-capitalize">{project.title}</strong>
        </Card.Title>
        <Card.Text as="h6">
          <div className="my-1">
            <strong className="h6">Category: </strong>
            {project.category}
          </div>
        </Card.Text>
        <Card.Text as="h6">
          <div className="my-1">
            <strong className="h6">Min. Contribution: </strong>
            {project.minimumContribution} wei
          </div>
        </Card.Text>
        <Card.Text as="h6">
          <div className="my-1">
            <strong className="h6">Target Amount: </strong>
            {project.targetAmount} wei
          </div>
        </Card.Text>
        <Card.Text as="h6">
          <div className="my-1">
            <strong className="h6">Manager: </strong>
            {project.manager}
          </div>
        </Card.Text>
        <Card.Text as="h6">
          <div className="my-1">
            {" "}
            <strong className="h6">Project Address:</strong>
            {project.projectAddress}
          </div>
        </Card.Text>
        <Card.Text as="div" className="mt-3">
          <Link to={`/project/${project.projectAddress}`}>
            <Button variant="danger">View Project</Button>
          </Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Project;
