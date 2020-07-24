import React, { useEffect, useState } from "react";
import "./App.css";

import DragNDrop from "./components/DragNDrop";

const defaultData = [
  { title: "group 1", items: ["1", "2", "3"] },
  { title: "group 2", items: ["4", "5"] },
  { title: "group 3", items: ["6", "7"] },
];

function App() {
  return (
    <div className="App">
      <div className="wrapper">
        <DragNDrop data={defaultData} />
      </div>
    </div>
  );
}

export default App;
