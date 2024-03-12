import { fabric } from "fabric";

export const saveState = (
  canvas: fabric.Canvas | null,
  undoStack: string[],
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>,
  redoStack: string[],
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (canvas) {
    const currentState = JSON.stringify(canvas);
    setUndoStack((prevUndoStack) => [...prevUndoStack, currentState]);
    setRedoStack([]); // Clear the redo stack when a new state is saved
    // console.log("Undo stack after save:", undoStack.length);
    // console.log("Redo stack after save:", redoStack.length);
  }
};

export const handleUndo = (
  canvas: fabric.Canvas | null,
  undoStack: string[],
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>,
  redoStack: string[],
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>,
  handleCanvasChange: () => void
) => {
  if (undoStack.length >= 2) {
    const prevState = undoStack[undoStack.length - 2];
    // console.log("Undo stack before undo:", undoStack.length);
    // console.log("Redo stack before undo:", redoStack.length);
    setRedoStack((prevRedoStack) => [
      ...prevRedoStack,
      undoStack[undoStack.length - 1],
    ]);
    canvas?.loadFromJSON(prevState, canvas.renderAll.bind(canvas));
    setUndoStack(undoStack.slice(0, -1));
    handleCanvasChange();
    // console.log("Undo stack after undo:", undoStack.length);
    // console.log("Redo stack after undo:", redoStack.length);
  }
};

export const handleRedo = (
  canvas: fabric.Canvas | null,
  undoStack: string[],
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>,
  redoStack: string[],
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>,
  handleCanvasChange: () => void
) => {
  if (redoStack.length > 0) {
    const nextState = redoStack[redoStack.length - 1];
    // console.log("Undo stack before redo:", undoStack.length);
    // console.log("Redo stack before redo:", redoStack.length);
    setUndoStack((prevUndoStack) => [...prevUndoStack, nextState]);
    canvas?.loadFromJSON(nextState, canvas.renderAll.bind(canvas));
    setRedoStack(redoStack.slice(0, -1));
    handleCanvasChange();
    // console.log("Undo stack after redo:", undoStack.length);
    // console.log("Redo stack after redo:", redoStack.length);
  }
};
