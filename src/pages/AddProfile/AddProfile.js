import { Button, Form, Input } from "antd";
import { _API_URL_ } from "../../utils/globals";
import "./AddProfile.css";
import { useNavigate } from "react-router-dom";

const AddProfile = () => {
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`${_API_URL_}/profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ NAME: values.name }),
      });

      if (response.status === 409) {
        alert("Nazwa profilu już występuje");
      } else if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Nie udało się dodać profilu");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="profileContainer mod add">
        <div className="form">
          <h2 className="title">Dodawanie profilu</h2>
          <Form onFinish={handleSubmit}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Wpisz nazwę profilu!" }]}
            >
              <Input placeholder="Nazwa profilu" />
            </Form.Item>
            <Button
              className="addProfile"
              type="primary"
              value="Dodaj"
              htmlType="submit"
            >
              {">"} Dodaj {"<"}
            </Button>
            <Button htmlType="reset" onClick={() => navigate("/")}>
              Wstecz
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddProfile;
