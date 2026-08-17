import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./v5-avatar.css";
import "./v5-focus.css";
import "./v45-game.css";
import App from "./App.jsx";

// V4.5 production release entrypoint — single-hero game experience.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
