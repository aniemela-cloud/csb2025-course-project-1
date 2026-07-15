import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary
    fallbackRender={({ error, resetErrorBoundary }) => (
      <div role="alert">
        <p>Error encountered in App:</p>
        <pre>{getErrorMessage(error)}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    )}
  >
    <Router>
      <App />
    </Router>
  </ErrorBoundary>,
);
