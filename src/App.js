import React, { useState, useEffect } from "react";
import {
  Profiles,
  AddProfile,
  Transactions,
  AddTransaction,
  EditTransaction,
} from "./pages";
import { MenuTop, Preloader } from "./components";
import { _API_URL_ } from "./utils/globals";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

function App() {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const data = await fetch(`${_API_URL_}/profiles`, {
      headers: { "Content-Type": "application/json" },
    });
    const json = await data.json();
    setData(json.rows);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="App">
        <MenuTop />
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Preloader />
                  <Profiles data={data} />
                </>
              }
            />
            <Route
              path="/profiles/:id/transactions"
              element={<Transactions />}
            />
            <Route path="/addprofile" element={<AddProfile />} />
            <Route
              path="/profiles/:id/addtransaction"
              element={<AddTransaction />}
            />
            <Route path="/edittransaction/:id" element={<EditTransaction />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
