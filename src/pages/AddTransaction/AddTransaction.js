import { useEffect, useState } from "react";
import { _API_URL_ } from "../../utils/globals";
import "./AddTransaction.css";
import { Form, InputNumber } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Select } from "antd";

const AddTransaction = () => {
  const { id } = useParams();
  const [categories, setCategory] = useState([]);
  const navigate = useNavigate();

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
      const response = await fetch(`${_API_URL_}/profiles/${id}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        navigate(`/profiles/${id}/transactions`);
      } else {
        console.error("Nie udało się dodać transakcji");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchData = async () => {
    const [category] = await Promise.all([
      fetch(`${_API_URL_}/categories`, {
        headers: { "Content-Type": "application/json" },
      }),
    ]);

    const json = await category.json();
    setCategory(json.rows);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="profileContainer mod add">
        <div className="form">
          <h2 className="title">Dodawanie rekordu</h2>
          <Form onFinish={handleSubmit}>
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
              {">"} Dodaj {"<"}
            </Button>
            <Button
              htmlType="reset"
              onClick={() => navigate(`/profiles/${id}/transactions`)}
            >
              Wstecz
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddTransaction;
