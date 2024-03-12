import React, { FunctionComponent } from "react";
import { fabric } from "fabric";

interface LineDrawerProps {
  canvas: fabric.Canvas | null;
  addShape: (shape: fabric.Object) => void;
}

const LineDrawer: React.FC<LineDrawerProps> = ({ canvas, addShape }) => {
  const addLine = () => {
    if (canvas) {
      const line = new fabric.Line([50, 100, 200, 200], {
        left: 100,
        top: 200,
        stroke: "black",
        strokeWidth: 2,
        selectable: true,
      });
      addShape(line);
    }
  };

  return (
    <div>
      <button type="button" className="btn btn-outline-dark" onClick={addLine}>
        Add Line
      </button>
    </div>
  );
};

export default LineDrawer;
