import React, { useState, useEffect } from "react";
import { Button, Menu } from "antd";
import { Link } from "react-router-dom";
import "./Profiles.css";
import { PlusCircleOutlined } from "@ant-design/icons";
import { _API_URL_ } from "../../utils/globals";
import { FaTrash } from "react-icons/fa";

const Profiles = ({ data }) => {
  const [profilesData, setProfilesData] = useState([]);

  useEffect(() => {
    setProfilesData(data);
  }, [data]);

  const deleteItem = async (itemId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten profil?")) {
      return;
    }

    if (
      !window.confirm(
        "To usunięcie będzie nieodwracalne. Utracisz listę wydatków w tym profilu. Czy na pewno chcesz kontynuować?"
      )
    ) {
      return;
    }

    try {
      await fetch(`${_API_URL_}/profiles/${itemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      setProfilesData(
        profilesData.filter((profile) => profile.ID_PROFILE !== itemId)
      );
    } catch (error) {
      console.error("Error deleting profile:", error);
    }

    window.location.reload();
  };

  return (
    <>
      <div className="profileContainer">
        <div className="blob">
          <img src="/blob.svg" alt="" />
        </div>
        <div className="list">
          {profilesData.length === 0 ? (
            <>
              <Menu mode="vertical">
                <Menu.ItemGroup title="Brak profili. Kliknij poniżej, aby dodać.">
                  <Menu.Item className="newProfile">
                    <Link to={`/addprofile`}>
                      <PlusCircleOutlined />
                    </Link>
                  </Menu.Item>
                </Menu.ItemGroup>
              </Menu>
            </>
          ) : (
            <Menu mode="vertical">
              <Menu.ItemGroup title="Wybierz profil:">
                {profilesData.map((item) => (
                  <Menu.Item key={item.ID_PROFILE}>
                    <Link to={`/profiles/${item.ID_PROFILE}/transactions`}>
                      {item.NAME + " >"}
                    </Link>
                    <Button
                      icon={<FaTrash />}
                      onClick={() => {
                        deleteItem(item.ID_PROFILE);
                      }}
                    ></Button>
                  </Menu.Item>
                ))}
                <Menu.Item>
                  <Link className="newProfile" to={`/addprofile`}>
                    <PlusCircleOutlined />
                  </Link>
                </Menu.Item>
              </Menu.ItemGroup>
            </Menu>
          )}
        </div>
      </div>
    </>
  );
};

export default Profiles;
