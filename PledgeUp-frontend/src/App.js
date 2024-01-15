import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./Screens/HomeScreen";
import CreateProject from "./Screens/CreateProject";
import ProjectScreen from "./Screens/ProjectScreen";
import RequestScreen from "./Screens/RequestScreen";
import CreateRequest from "./Screens/CreateRequest";
import BackGround from "./homePage.jpg";
const App = () => {
  return (
    <Router>
      <div
        className="py-3 min-vh-100"
        style={{
          background: `url(${BackGround})`,
        }}
      >
        <Header />
        <main className="py-3">
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/project/new" element={<CreateProject />} />
              <Route
                path="/project/:projectAddress"
                element={<ProjectScreen />}
              />
              <Route
                path="/project/:projectAddress/request"
                element={<RequestScreen />}
              />
              <Route
                path="/project/:projectAddress/request/new"
                element={<CreateRequest />}
              />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
