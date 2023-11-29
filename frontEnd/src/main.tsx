import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./route.tsx";
import "./index.css";
import Provider from "./state/Provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <Provider store={store}>
  <React.StrictMode>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
  // </Provider>
);
