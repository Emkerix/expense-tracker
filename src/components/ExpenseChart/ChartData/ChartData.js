const calculateExpense = (data, categories) => {
  const categoriesExpense = [];

  categories.forEach((category) => {
    const expenseTotal = data.reduce((accumulator, transaction) => {
      if (transaction.ID_CATEGORY === category.ID_CATEGORY) {
        return accumulator + transaction.AMOUNT;
      } else {
        return accumulator;
      }
    }, 0);
    categoriesExpense.push(expenseTotal);
  });

  const filteredCategories = categories.filter(
    (category, index) => categoriesExpense[index] !== 0
  );
  const filteredCategoriesLabels = filteredCategories.map(
    (category) => category.NAME
  );
  const filteredCategoriesExpense = categoriesExpense.filter(
    (expense) => expense !== 0
  );

  return { filteredCategoriesLabels, filteredCategoriesExpense };
};

export { calculateExpense };
