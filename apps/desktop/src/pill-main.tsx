import React from "react";
import ReactDOM from "react-dom/client";
import { PillApp } from "./PillApp";
import "./pill-styles.css";

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <PillApp />
    </React.StrictMode>,
  );
}
