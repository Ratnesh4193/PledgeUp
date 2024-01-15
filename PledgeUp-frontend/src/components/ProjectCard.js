import React from "react";
import { Card } from "react-bootstrap";

const ProjectCard = ({ data }) => {
  return (
    <Card
      style={{ backgroundColor: "white", opacity: "0.6", shadowOpacity: 0.5 }}
      key={data.variant}
      text={data.variant.toLowerCase() === "light" ? "dark" : "white"}
      className="my-1 p-1 rounded"
    >
      <Card.Header>{data.header}</Card.Header>
      <Card.Body>
        <Card.Title>{data.value} </Card.Title>
        <Card.Text>{data.description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProjectCard;
