import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import App from "./App";
import "./rtl.css"; // must load after App so it can override the LTR styles

// react router
import { HashRouter } from "react-router-dom";
import { store } from "./redux/app/store";
import { LanguageProvider } from "./i18n/LanguageContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </Provider>
    </HashRouter>
  </React.StrictMode>
);
