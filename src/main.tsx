import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeData } from "./data/seed";

initializeData();

createRoot(document.getElementById("root")!).render(<App />);
