import React, { FunctionComponent } from "react";
import { fabric } from "fabric";

interface RectangleDrawerProps {
  canvas: fabric.Canvas | null;
  addShape: (shape: fabric.Object) => void;
}

const RectangleDrawer: React.FC<RectangleDrawerProps> = ({
  canvas,
  addShape,
}) => {
  const addRectangle = () => {
    if (canvas) {
      const rect = new fabric.Rect({
        left: 200,
        top: 200,
        fill: "red",
        width: 40,
        height: 40,
        selectable: true,
      });
      addShape(rect);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-dark"
        onClick={addRectangle}
      >
        Add Rectangle
      </button>
    </div>
  );
};

export default RectangleDrawer;
