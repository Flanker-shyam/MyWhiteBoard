import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/home.css"; // Import custom CSS for Home component

const Home: React.FC = () => {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <div className="jumbotron jumbotron-fluid bg-dark text-light text-center mb-0">
          <div className="container">
            <h1 className="display-4">Welcome to the Whiteboard Application</h1>
            <p className="lead">
              Let's collaborate and unleash your creativity!
            </p>
          </div>
        </div>
        <div className="container feature-body">
          <div className="row">
            <div className="col-md-6">
              <h2>Features</h2>
              <ul>
                <li>Real-time collaboration</li>
                <li>Interactive whiteboard</li>
                <li>Undo/redo functionality</li>
                <li>Save as image or PDF</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h2>About Us</h2>
              <p className="about-text">
                Whiteboard App is dedicated to providing a platform for seamless
                collaboration and creativity. Our mission is to empower
                individuals and teams to express their ideas and work together
                in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
