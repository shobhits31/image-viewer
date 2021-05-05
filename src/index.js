import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ImageViewerController from "./screens/ImageViewerController";

ReactDOM.render(
  // <span>
  //     Image Viewer
  // </span>
  <React.StrictMode>
    <ImageViewerController />
  </React.StrictMode>,
  document.getElementById("root")
);
