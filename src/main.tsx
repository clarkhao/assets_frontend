import React from "react";
import ReactDOM from "react-dom/client";
import App from "./page/app/App";
import "./style/index.css";
import { ThemeProvider } from "@mui/material/styles";
import { useThemeStore } from "./store";

const theme = useThemeStore((state) => state.theme);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
