import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./v5-focus.css";
import "./v47-reference.css";
import "./v47-stage.css";
import "./v47-extras.css";
import "./v48-wardrobe.css";
import V47App from "./V47App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <V47App />
  </StrictMode>
);
