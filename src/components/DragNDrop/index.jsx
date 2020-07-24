// Drag And Drop With React Hooks From Scratch https://youtu.be/Q1PYQPK9TaM?t=1235

import React, { useRef, useState } from "react";

import "./DragNDrop.css";

export default function DragNDrop({ data }) {
  const [list, setList] = useState(data);
  const [dragging, setDragging] = useState(false);
  const draggedItem = useRef();
  const draggedNode = useRef();

  const handleDragStart = (e, targetItem) => {
    console.log("drag starting...", targetItem, e.target);
    draggedItem.current = targetItem;
    draggedNode.current = e.target;
    //According to tutorial author, using the HTML/JSX prop 'onDragEnd' is buggy in React, so using JS instead to add listener 'dragend'
    draggedNode.current.addEventListener("dragend", handleDragend);

    //This is a neat little trick to delay the effect of changing dragging=true.  It is useful in this case so that when an item is dragged, it's 'ghost' is the item without the ".current" CSS style
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnter = (e, targetItem) => {
    const dragdItem = draggedItem.current;
    if (e.target !== draggedNode.current) {
      console.log("entering drag...", e.target, targetItem);

      setList((oldList) => {
        //Making a 'deep'copy of list object (spread operator seems to handle only 'shallow' copies)
        let newList = JSON.parse(JSON.stringify(oldList));
        //One liner to place the 'dragged' item right before the 'drop-target' using nested 'Array.splice()'
        newList[targetItem.grpI].items.splice(
          targetItem.itemI,
          0,
          newList[dragdItem.grpI].items.splice(dragdItem.itemI, 1)[0] //Step 1 => remove dragdItem from its own items list //Step 2 => get [0] of this nested splice, to use it as the 3rd argument of the greater splice, which simply inserts the 'dragged' value at the index corresponding to the target's value
        );
        draggedItem.current = targetItem;
        return newList;
      });
    }
  };

  const handleDragend = () => {
    console.log("drag ending...");
    draggedNode.current.removeEventListener("dragend", handleDragend);
    draggedItem.current = null;
    draggedNode.current = null;
    setDragging(false);
  };

  const setDraggingClass = (dragdItem) => {
    const currItem = draggedItem.current;
    if (
      currItem.grpI === dragdItem.grpI &&
      currItem.itemI === dragdItem.itemI
    ) {
      return "dnd_item current";
    }
    return "dnd_item";
  };

  return (
    <div className="dnd_canvas">
      {list.map((grp, grpI) => (
        <div
          onDragEnter={
            dragging && !grp.items.length
              ? (e) => handleDragEnter(e, { grpI, itemI: 0 })
              : null
          }
          key={grp.title}
          className="dnd_group"
        >
          <h1 className="dnd_group-title">{grp.title}</h1>
          {grp.items.map((item, itemI) => (
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, { grpI, itemI })}
              onDragEnter={
                dragging ? (e) => handleDragEnter(e, { grpI, itemI }) : null
              }
              key={item}
              className={
                dragging ? setDraggingClass({ grpI, itemI }) : "dnd_item"
              }
            >
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
