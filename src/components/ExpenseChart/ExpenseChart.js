import React, { useEffect, useState } from "react";
import { _API_URL_ } from "../../utils/globals";
import ChartDoughnut from "./ChartDoughnut/ChartDoughnut";
import "./ExpenseChart.css";

const ExpenseChart = ({ totalExpense, data }) => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const category = await fetch(`${_API_URL_}/categories`, {
      headers: { "Content-Type": "application/json" },
    });

    const json_2 = await category.json();
    setCategories(json_2.rows);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoriesExpense = [];

  categories.forEach((category) => {
    const expenseTotal = data.reduce((accumulator, transaction) => {
      if (transaction.ID_CATEGORY === category.ID_CATEGORY)
        return accumulator + transaction.AMOUNT;
      else return accumulator;
    }, 0);
    categoriesExpense.push(expenseTotal);
  });

  const filteredCategoriesE = categories.filter(
    (category, index) => categoriesExpense[index] > 0
  );
  const filteredCategoriesLabelsExpense = filteredCategoriesE.map(
    (category) => category.NAME
  );
  const filteredCategoriesExpense = categoriesExpense.filter(
    (expense) => expense > 0
  );

  return (
    <div className="chartContainer">
      <div className="chart">
        <ChartDoughnut
          labels={filteredCategoriesLabelsExpense}
          data={filteredCategoriesExpense}
          title="Wydatki"
        />
      </div>
    </div>
  );
};

export default ExpenseChart;
