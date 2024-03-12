import React, { FunctionComponent } from "react";
import { fabric } from "fabric";

interface TextDrawerProps {
  canvas: fabric.Canvas | null;
  addShape: (shape: fabric.Object) => void;
}

const TextDrawer: React.FC<TextDrawerProps> = ({ canvas, addShape }) => {
  const addText = () => {
    if (canvas) {
      const text = new fabric.Textbox("Hello World", {
        left: 150,
        top: 160,
        fill: "black",
        width: 100,
        fontSize: 20,
        selectable: true,
      });
      addShape(text);
    }
  };

  return (
    <div>
      <button type="button" className="btn btn-outline-dark" onClick={addText}>
        Add Text
      </button>
    </div>
  );
};

export default TextDrawer;
