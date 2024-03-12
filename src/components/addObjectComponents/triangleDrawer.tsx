import React, { FunctionComponent } from "react";
import { fabric } from "fabric";

interface TriangleDrawerProps {
  canvas: fabric.Canvas | null;
  addShape: (shape: fabric.Object) => void;
}

const TriangleDrawer: React.FC<TriangleDrawerProps> = ({
  canvas,
  addShape,
}) => {
  const addTriangle = () => {
    if (canvas) {
      const triangle = new fabric.Triangle({
        left: 160,
        top: 200,
        fill: "blue",
        width: 40,
        height: 40,
        selectable: true,
      });
      addShape(triangle);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-dark"
        onClick={addTriangle}
      >
        Add Triangle
      </button>
    </div>
  );
};

export default TriangleDrawer;
