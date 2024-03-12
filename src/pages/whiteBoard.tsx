import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fabric } from "fabric";
import "../styles/whiteBoard.css";
import RectangleDrawer from "../components/addObjectComponents/rectangleDrawer";
import CircleDrawer from "../components/addObjectComponents/circleDrawer";
import TriangleDrawer from "../components/addObjectComponents/triangleDrawer";
import LineDrawer from "../components/addObjectComponents/lineDrawer";
import TextDrawer from "../components/addObjectComponents/textDrawer";
import {
  saveState,
  handleUndo,
  handleRedo,
} from "../functions/undoRedoHandler";
import handleColorChange from "../functions/colorChangeHandler";

const WhiteBoard = () => {
  const sessionId = useParams();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedShape, setSelectedShape] = useState<fabric.Object | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket>(new WebSocket("ws://localhost:8083"));

  useEffect(() => {
    // Initialize WebSocket client
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      // setWs(socket); // Set WebSocket reference when connection is open
      console.log("ws:::::::::::::", ws);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (!data || !data.objects || !Array.isArray(data.objects)) return; // Corrected condition

      var newCanvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "#fff",
        height: window.innerHeight * 0.9,
        width: window.innerWidth,
      });
      // newCanvas.clear();
      newCanvas.loadFromJSON(data, canvas?.renderAll.bind(canvas)!);
      console.log("newwwwww:", newCanvas);

      setCanvas(newCanvas);
      // Update canvas rendering
      canvas?.requestRenderAll();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(); // Close WebSocket connection when component unmounts
      }
    };
  }, []);

  useEffect(() => {
    const sendSessionKey = () => {
      if (ws.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({
          type: "sessionKey",
          key: sessionId.sessionId,
        });
        console.log("Sending message to server:", message);
        ws.send(message);
      } else {
        console.log("WebSocket connection is not open");
      }
    };

    // Call sendSessionKey function immediately if WebSocket is already open
    sendSessionKey();

    // Subscribe to WebSocket events
    const handleWebSocketOpen = () => {
      console.log("WebSocket connection opened");
      sendSessionKey(); // Call sendSessionKey when WebSocket opens
    };

    const handleWebSocketClose = () => {
      console.log("WebSocket connection closed");
    };

    const handleWebSocketError = (error: any) => {
      console.error("WebSocket error:", error);
    };

    // Add event listeners for WebSocket events
    ws.addEventListener("open", handleWebSocketOpen);
    ws.addEventListener("close", handleWebSocketClose);
    ws.addEventListener("error", handleWebSocketError);

    // Cleanup function to remove event listeners
    return () => {
      ws.removeEventListener("open", handleWebSocketOpen);
      ws.removeEventListener("close", handleWebSocketClose);
      ws.removeEventListener("error", handleWebSocketError);
    };
  }, [ws, sessionId]);

  // useEffect(() => {
  //   // Track mouse events and send data to WebSocket server
  //   canvas?.on('mouse:move', (event) => {
  //     const { e } = event;
  //     const mousePosition = {
  //       x: e.clientX,
  //       y: e.clientY,
  //     };
  //     const data = {
  //       type: 'mouseMove',
  //       position: mousePosition,
  //     };
  //     ws.send(JSON.stringify(data));
  //   });

  //   // Clean up
  //   return () => {
  //     // ws.close();
  //     canvas?.dispose();
  //   };
  // }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "#fff",
        height: window.innerHeight * 0.9,
        width: window.innerWidth,
      });
      setCanvas(newCanvas);

      newCanvas.on("selection:cleared", () => {
        setSelectedShape(null);
      });

      newCanvas.on("object:selected", (e) => {
        if (e.target) {
          setSelectedShape(e.target);
        }
      });

      return () => {
        newCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.on("object:modified", handleObjectModification);
      canvas.on("text:changed", handleTextChange);
    }

    return () => {
      canvas?.off("object:modified", handleObjectModification);
      canvas?.off("text:changed", handleTextChange);
    };
  }, [canvas]);

  const handleCanvasChange = () => {
    if (ws && ws.readyState === WebSocket.OPEN && canvas) {
      // Get the current state of the canvas
      const canvasState = JSON.stringify(canvas);

      // Send canvas state to WebSocket server
      console.log("handleCanvasChange called !!", canvasState);
      console.log("Tyep:  ", typeof canvasState);
      const sendToServer = JSON.stringify({
        type: sessionId.sessionId,
        data: canvasState,
      });
      ws.send(sendToServer);
    } else {
      console.log("handleCanvasChange called in elseeeeeee!!");
    }
  };

  // Function to handle movement and resize of objects
  const handleObjectModification = (e: fabric.IEvent) => {
    const modifiedObject = e.target as fabric.Object;
    const prevState = JSON.stringify(modifiedObject.toObject()); // Save previous state
    const currentState = JSON.stringify(canvas?.toObject());
    if (prevState !== currentState) {
      saveState(canvas, undoStack, setUndoStack, redoStack, setRedoStack);
      handleCanvasChange();
    }
  };

  // Function to handle text changes
  const handleTextChange = (e: fabric.IEvent) => {
    const modifiedObject = e.target as fabric.Object;
    const prevState = JSON.stringify(modifiedObject.toObject()); // Save previous state
    const currentState = JSON.stringify(canvas?.toObject());
    if (prevState !== currentState) {
      saveState(canvas, undoStack, setUndoStack, redoStack, setRedoStack);
      handleCanvasChange();
    }
  };

  const callColorChangeHandler = (color: string) => {
    handleColorChange(
      color,
      canvas,
      setSelectedColor,
      undoStack,
      setUndoStack,
      redoStack,
      setRedoStack,
      handleCanvasChange
    );
  };

  const callUndoHandler = () => {
    handleUndo(
      canvas,
      undoStack,
      setUndoStack,
      redoStack,
      setRedoStack,
      handleCanvasChange
    );
  };

  const callRedoHandler = () => {
    handleRedo(
      canvas,
      undoStack,
      setUndoStack,
      redoStack,
      setRedoStack,
      handleCanvasChange
    );
  };

  const addShape = (shape: fabric.Object) => {
    if (canvas) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      setSelectedShape(shape);
      saveState(canvas, undoStack, setUndoStack, redoStack, setRedoStack);
      handleCanvasChange();
    }
  };

  useEffect(() => {
    console.log("canvas: ", canvas);
  }, [canvas]);

  const removeSelectedShape = () => {
    console.log("giot hitttttt", canvas);
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      console.log("actibeeeL ", activeObject);
      if (activeObject) {
        canvas.remove(activeObject);
        saveState(canvas, undoStack, setUndoStack, redoStack, setRedoStack);
        handleCanvasChange();
      }
    }
  };

  return (
    <div
      className="whiteboard-container"
    >
      <div className="canvas-container">
        <canvas ref={canvasRef} className="canvas" />
      </div>
      <div
        className="toolbar-container"
      >
        <div className="btn-group" role="group">
          <RectangleDrawer canvas={canvas} addShape={addShape} />
          <CircleDrawer canvas={canvas} addShape={addShape} />
          <TriangleDrawer canvas={canvas} addShape={addShape} />
          <LineDrawer canvas={canvas} addShape={addShape} />
          <TextDrawer canvas={canvas} addShape={addShape} />
        </div>
        <div>
          <button
            type="button"
            className="btn btn-danger btn-circle"
            onClick={() => callColorChangeHandler("red")}
          ></button>
          <button
            type="button"
            className="btn btn-primary btn-circle"
            onClick={() => callColorChangeHandler("blue")}
          ></button>
          <button
            type="button"
            className="btn btn-success btn-circle"
            onClick={() => callColorChangeHandler("green")}
          ></button>
        </div>
        <div
          className="action-buttons">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={removeSelectedShape}
          >
            Remove Shape
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={callUndoHandler}
          >
            undo
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={callRedoHandler}
          >
            redo
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhiteBoard;
