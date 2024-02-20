import { BsArrowLeftSquareFill } from "react-icons/bs";
import "./Summary.css";
import { Button } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Summary = ({ totalValueExpense, totalNumberOfExpense, profileName }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <>
      <div className="summary profileName">
        <div className="title profileName">
          <div
            className="title profileName"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {isHovered ? (
              <Button onClick={handleNavigate}>Wybierz inny profil</Button>
            ) : (
              <Button>Nazwa profilu: {profileName}</Button>
            )}
          </div>
        </div>
      </div>
      <div className="summary">
        <div className="title">
          <BsArrowLeftSquareFill />
          <span>Ilość zaplanowanych wydatków: {totalNumberOfExpense}</span>
        </div>
        <div className="title">
          <span>Wydatki łącznie: {totalValueExpense} zł</span>
        </div>
      </div>
    </>
  );
};

export default Summary;
