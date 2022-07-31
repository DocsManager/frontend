import React from "react";
import ReactDOM from "react-dom";
import App from "./page/documentWriter/DocumentWriter";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Route, Routes } from "react-router-dom";

ReactDOM.render(
 <BrowserRouter>
  <Routes>
   <Route path="/" element={<App />} />
  </Routes>
 </BrowserRouter>,
 document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
