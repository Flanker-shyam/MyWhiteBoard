import React, { FunctionComponent } from "react";
import { fabric } from "fabric";

interface CircleDrawerProps {
  canvas: fabric.Canvas | null;
  addShape: (shape: fabric.Object) => void;
}

const CircleDrawer: React.FC<CircleDrawerProps> = ({
  canvas,
  addShape,
}) => {
    const addCircle = () => {
        if (canvas) {
          const circle = new fabric.Circle({
            left: 200,
            top: 100,
            fill: "green",
            radius: 40,
            selectable: true,
          });
          addShape(circle);
        }
      };

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-dark"
        onClick={addCircle}
      >
        Add Circle
      </button>
    </div>
  );
};

export default CircleDrawer;
