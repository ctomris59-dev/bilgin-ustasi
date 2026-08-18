import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./v5-avatar.css";
import "./v5-focus.css";
import "./v45-game.css";
import "./v45-master.css";
import "./v45-live-rig.css";
import "./v46-layered-rig.css";
import App from "./App.jsx";

// V4.6 production release entrypoint — neutral master + anchor based layered equipment.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);