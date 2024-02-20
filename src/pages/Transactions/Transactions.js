import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { _API_URL_ } from "../../utils/globals";
import TransactionContainer from "./TransactionsContainer";
import "./Transactions.css";
import { Button } from "antd";
import { Preloader } from "../../components";

const TotalSummary = ({ data }) => {
  const totalNumberOfExpense = data.length;
  const totalValueExpense = data.reduce(
    (total, item) => total + item.AMOUNT,
    0
  );

  return {
    totalValueExpense: Math.round(totalValueExpense * 100) / 100,
    totalNumberOfExpense,
  };
};

const Transactions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const profileResponse = await fetch(`${_API_URL_}/profiles/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    const profileJson = await profileResponse.json();
    setProfileData(profileJson.profile);

    const transactionsResponse = await fetch(
      `${_API_URL_}/profiles/${id}/transactions`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const transactionsJson = await transactionsResponse.json();
    setData(transactionsJson.transactions);
  };

  const profileName = profileData.NAME;
  const { totalValueExpense, totalNumberOfExpense } = TotalSummary({ data });

  const deleteItem = async (itemId) => {
    try {
      await fetch(`${_API_URL_}/transactions/${itemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
    fetchData();
  };

  return (
    <>
      <Preloader />
      <TransactionContainer
        totalValueExpense={totalValueExpense}
        totalNumberOfExpense={totalNumberOfExpense}
        profileName={profileName}
        data={data}
        fetchData={fetchData}
        deleteItem={deleteItem}
      />
      <Button
        className="addExpenseButton"
        type="primary"
        onClick={() => navigate(`/profiles/${id}/addtransaction`)}
      >
        Dodaj wydatek
      </Button>
    </>
  );
};

export default Transactions;
