import { createRoot } from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";

import App from "./App";
import "./styles/index.scss";
import "./styles/fonts.scss";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <StyledEngineProvider injectFirst>
    <App />
  </StyledEngineProvider>,
);
