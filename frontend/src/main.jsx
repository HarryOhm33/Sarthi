import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      style={{ top: "80px" }} // Adjust based on navbar height
      toastClassName="max-w-[80%] w-auto min-w-0 text-sm p-2 m-2 rounded-md" // Tailwind classes for toast
      className="z-[9999] w-11/12 md:w-auto mx-auto md:mx-0 mt-2" // Tailwind classes for container
    />
  </StrictMode>
);
