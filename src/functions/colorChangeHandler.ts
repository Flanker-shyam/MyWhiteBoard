import { fabric } from "fabric";
import { saveState } from "./undoRedoHandler";

const handleColorChange = (
  color: string,
  canvas: fabric.Canvas | null,
  setSelectedColor: (color: string) => void,
  undoStack: string[],
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>,
  redoStack: string[],
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>,
  handleCanvasChange: () => void
) => {
  setSelectedColor(color);
  let activeObject = canvas?.getActiveObject();
  if (activeObject) {
    updateColorChange(
      activeObject,
      color,
      canvas,
      undoStack,
      setUndoStack,
      redoStack,
      setRedoStack,
      handleCanvasChange
    );
  }
};

const updateColorChange = (
  object: fabric.Object,
  color: string,
  canvas: fabric.Canvas | null,
  undoStack: string[],
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>,
  redoStack: string[],
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>,
  handleCanvasChange: () => void
) => {
  if (object instanceof fabric.Text) {
    object.set("fill", color);
  } else if (
    object instanceof fabric.Rect ||
    object instanceof fabric.Circle ||
    object instanceof fabric.Triangle
  ) {
    (object as fabric.Object).set("fill", color);
    (object as fabric.Object).set("stroke", color);
  }
  saveState(canvas, undoStack, setUndoStack, redoStack, setRedoStack);
  canvas?.renderAll();
  handleCanvasChange();
};

export default handleColorChange;
