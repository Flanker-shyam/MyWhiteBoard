import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fabric } from "fabric";
import "../styles/whiteBoard.css";
import RectangleDrawer from "../components/addObjectComponents/rectangleDrawer";
import CircleDrawer from "../components/addObjectComponents/circleDrawer";
import TriangleDrawer from "../components/addObjectComponents/triangleDrawer";
import LineDrawer from "../components/addObjectComponents/lineDrawer";
import TextDrawer from "../components/addObjectComponents/textDrawer";
import { saveAsImage, saveAsPDF } from "../functions/saveCanvas";
import {
  saveState,
  handleUndo,
  handleRedo,
} from "../functions/undoRedoHandler";
import handleColorChange from "../functions/colorChangeHandler";
import { webpackConfig } from "../config/webpackConfig";

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
  const [ws, setWs] = useState<WebSocket>(new WebSocket(webpackConfig.WEBSOCKET_URL));
  const [brushColor, setBrushColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [drawingMode, setDrawingMode] = useState<boolean>(true);

  useEffect(() => {
    // Initialize WebSocket client
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
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
        ws.send(message);
      } else {
        console.log("WebSocket connection is not open");
      }
    };
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

  useEffect(() => {
    if (canvasRef.current) {
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "#fff",
        height: window.innerHeight * 0.9,
        width: window.innerWidth,
        isDrawingMode: drawingMode,
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
    const handleCanvasEvents = () => {
      if (!canvas) return;

      const mouseDownHandler = () => {
        saveState(canvas, undoStack, setUndoStack, redoStack, setRedoStack);
        handleCanvasChange();
      };

      const mouseUpHandler = () => {
        saveState(canvas, undoStack, setUndoStack, redoStack, setRedoStack);
        handleCanvasChange();
      };

      canvas.on("mouse:down", mouseDownHandler);
      canvas.on("mouse:up", mouseUpHandler);

      return () => {
        canvas.off("mouse:down", mouseDownHandler);
        canvas.off("mouse:up", mouseUpHandler);
      };
    };

    if (canvas) {
      handleCanvasEvents();
    }
  }, [canvas]);

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
      const sendToServer = JSON.stringify({
        type: sessionId.sessionId,
        data: canvasState,
      });
      ws.send(sendToServer);
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

  const handleBrushColorChange = (color: string) => {
    setBrushColor(color);
    canvas && (canvas.freeDrawingBrush.color = color);
    canvas?.renderAll();
  };

  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size);
    canvas && (canvas.freeDrawingBrush.width = size);
    canvas?.renderAll();
  };

  const toggleDrawingMode = () => {
    setDrawingMode((prevMode) => {
      if (canvas) {
        canvas.isDrawingMode = !prevMode;
      }
      return !prevMode;
    });
  };

  const removeSelectedShape = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
        saveState(canvas, undoStack, setUndoStack, redoStack, setRedoStack);
        handleCanvasChange();
      }
    }
  };

  return (
    <div className="whiteboard-container">
      <div className="canvas-container">
        <canvas ref={canvasRef} className="canvas" />
        <div className="save-buttons">
          <button onClick={() => saveAsImage(canvas!)}>Save as Image</button>
          <button onClick={() => saveAsPDF(canvas!)}>Save as PDF</button>
        </div>
      </div>
      <div className="toolbar-container">
        <div className="btn-group" role="group">
          <RectangleDrawer canvas={canvas} addShape={addShape} />
          <CircleDrawer canvas={canvas} addShape={addShape} />
          <TriangleDrawer canvas={canvas} addShape={addShape} />
          <LineDrawer canvas={canvas} addShape={addShape} />
          <TextDrawer canvas={canvas} addShape={addShape} />
        </div>
        <div>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => handleBrushColorChange(e.target.value)}
          />
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => handleBrushSizeChange(parseInt(e.target.value))}
          />
          <button onClick={toggleDrawingMode}>
            {drawingMode ? "Disable Drawing" : "Enable Drawing"}
          </button>
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
        <div className="action-buttons">
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
