import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./v5-avatar.css";
import "./v5-focus.css";
import "./v45-game.css";
import "./v45-master.css";
import "./v45-live-rig.css";
import App from "./App.jsx";

// V4.5 production release entrypoint — one live wearable master hero everywhere.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);