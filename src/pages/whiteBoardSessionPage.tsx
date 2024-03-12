import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
    <div className="container mt-5">
      <div className="col-md-3 text-end">
        {/* <button
          type="button"
          className="btn btn-outline-primary me-2"
          onClick={logout}
        >
          Logout
        </button> */}
      </div>
      <h1 className="text-center mb-5">Whiteboard Session</h1>
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary me-3" onClick={handleCreateSession}>
          Create Session
        </button>
        <input
          type="text"
          className="form-control me-3"
          placeholder="Enter Session Key"
          value={sessionKey}
          onChange={(e) => setSessionKey(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleJoinSession}>
          Join Session
        </button>
      </div>
    </div>
  );
};

export default WhiteBoardSessionPage;
