import { useEffect, useRef, useState } from "react";
import { _API_URL_ } from "../../utils/globals";
import { Form, InputNumber } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Select } from "antd";

const EditTransaction = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const fetchData = async () => {
    try {
      const [transactionResponse, category] = await Promise.all([
        fetch(`${_API_URL_}/transactions/${id}`),
        fetch(`${_API_URL_}/categories`, {
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      const transactionData = await transactionResponse.json();
      const categoryData = await category.json();

      setCategories(categoryData.rows);

      formRef.current.setFieldsValue({
        title: transactionData.TITLE,
        category: transactionData.ID_CATEGORY,
        date: transactionData.DATE,
        amount: transactionData.AMOUNT,
        description: transactionData.DESCRIPTION,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    const { title, category, date, amount, description } = values;
    const transactionData = {
      TITLE: title,
      ID_CATEGORY: category,
      DATE: date,
      AMOUNT: amount,
      DESCRIPTION: description,
    };

    try {
      const response = await fetch(`${_API_URL_}/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        navigate(-1);
      } else {
        console.error("Nie udało się zaktualizować transakcji");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="profileContainer mod add">
        <div className="form">
          <h2 className="title">Edycja wydatku</h2>
          <Form ref={formRef} onFinish={handleSubmit}>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "Wpisz nazwę wydatku!" }]}
            >
              <Input placeholder="Nazwa wydatku" />
            </Form.Item>
            <Form.Item
              name="category"
              rules={[{ required: true, message: "Wybierz kategorię!" }]}
            >
              <Select placeholder="Wybierz kategorię">
                {categories.map((category) => (
                  <Select.Option
                    key={category.ID_CATEGORY}
                    value={category.ID_CATEGORY}
                  >
                    {category.NAME}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="date"
              rules={[{ required: true, message: "Wpisz datę!" }]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              name="amount"
              rules={[{ required: true, message: "Wpisz kwotę!" }]}
            >
              <InputNumber min={0.01} placeholder="Kwota" />
            </Form.Item>
            <Form.Item name="description">
              <Input.TextArea rows={4} placeholder="Opis" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              {">"} Edytuj {"<"}
            </Button>
            <Button htmlType="reset" onClick={() => navigate(-1)}>
              Wstecz
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default EditTransaction;
