import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Footer from "../components/footer";

const WhiteBoardSessionPage = () => {
  const [sessionKey, setSessionKey] = useState<string>("");

  const handleJoinSession = () => {
    const path = `/whiteboard/${sessionKey}`;
    window.location.href = path;
  };

  const handleCreateSession = () => {
    const session = uuidv4();
    setSessionKey(session);
    localStorage.setItem(`session${session}`, session);
    window.location.href = `/whiteboard/${session}`;
  };

  //   const logout = () =>{
  //     window.location.href = "/";
  //   }

  return (
    <div>
    <div className="container mt-5">
      <div className="col-md-3 text-end">
        {/* You can add a decorative element or icon here */}
        <svg className="bi" width="50" height="50" fill="currentColor">
          <use xlinkHref="/path/to/icon.svg" />
        </svg>
      </div>
      <h1 className="text-center mb-5">Whiteboard Session</h1>
      <div className="d-flex justify-content-center">
        <div className="input-group mb-3 me-3">
          <button className="btn btn-primary" onClick={handleCreateSession}>
            Create Session
          </button>
          {/* You can add a tooltip or helper text to provide additional information */}
          <span className="input-group-text">Start a new session</span>
        </div>
        <div className="input-group mb-3 me-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Session Key"
            value={sessionKey}
            onChange={(e) => setSessionKey(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleJoinSession}>
            Join Session
          </button>
          {/* You can add a tooltip or helper text to provide additional information */}
          <span className="input-group-text">Join an existing session</span>
        </div>
      </div>
      {/* Additional content or information below the buttons */}
      <div style={{marginTop:'150px'}}>
      <p className="text-center mt-3">
       <strong> Connect and collaborate in real-time with your team! Learn how it works: </strong>
      </p>
      <div className="text-center">
        <p>1. Start by creating a new session or joining an existing one.</p>
        <p>
          2. Collaborate with your team members using the interactive
          whiteboard.
        </p>
        <p>
          3. Share ideas, draw diagrams, and brainstorm together in real-time.
        </p>
        {/* You can add more creative and engaging content here */}
      </div>
      </div>
    </div>
    <div style={{marginTop:'200px'}}>
    <Footer/>
    </div>
    </div>
  );
};

export default WhiteBoardSessionPage;
