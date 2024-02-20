import React, { useRef, useState } from "react";
import EmptyTransactionList from "./EmptyTransactionList";
import { ExpenseChart, Summary } from "../../components";
import { Link } from "react-router-dom";
import { Button, Input, Space, Table } from "antd";
import "./Transactions.css";
import {
  CarOutlined,
  CoffeeOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  HeartOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const TransactionContainer = ({
  totalValueExpense,
  totalNumberOfExpense,
  profileName,
  data,
  deleteItem,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const filters = [
    {
      text: "TRANSPORT",
      value: "TRANSPORT",
      icon: <CarOutlined />,
    },
    {
      text: "ZDROWIE I URODA",
      value: "ZDROWIE I URODA",
      icon: <HeartOutlined />,
    },
    {
      text: "RACHUNKI",
      value: "RACHUNKI",
      icon: <CreditCardOutlined />,
    },
    {
      text: "POZOSTAŁE",
      value: "POZOSTAŁE",
      icon: <QuestionCircleOutlined />,
    },
    {
      text: "FINANSE",
      value: "FINANSE",
      icon: <WalletOutlined />,
    },
    {
      text: "ROZRYWKA I PODRÓŻE",
      value: "ROZRYWKA I PODRÓŻE",
      icon: <CoffeeOutlined />,
    },
    {
      text: "WYDATKI PODSTAWOWE",
      value: "WYDATKI PODSTAWOWE",
      icon: <DollarCircleOutlined />,
    },
  ];

  const IconCategory = ({ type }) => {
    const filter = filters.find((filter) => filter.value === type);
    return filter ? filter.icon : null;
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "ID_TRANSACTION",
      key: "ID_TRANSACTION",
      width: "5%",
      sorter: (a, b) => a.ID_TRANSACTION - b.ID_TRANSACTION,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Tytuł wydatku",
      dataIndex: "TITLE",
      key: "TITLE",
      ...getColumnSearchProps("TITLE"),
    },
    {
      title: "Kwota (PLN)",
      dataIndex: "AMOUNT",
      key: "AMOUNT",
      width: "10%",
      sorter: (a, b) => a.AMOUNT - b.AMOUNT,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Data",
      dataIndex: "DATE",
      key: "DATE",
      sorter: (a, b) => new Date(a.DATE) - new Date(b.DATE),
      width: "10%",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Kategoria",
      dataIndex: "CATEGORY_NAME",
      key: "CATEGORY_NAME",
      width: "15%",
      filters: filters.map((filter) => ({
        text: filter.text,
        value: filter.value,
      })),
      render: (text, record) => (
        <span>
          <IconCategory type={record.CATEGORY_NAME} />
          {<span style={{ marginLeft: 8 }}>{text}</span>}
        </span>
      ),
      onFilter: (value, record) => record.CATEGORY_NAME.indexOf(value) === 0,
    },
    {
      title: "",
      dataIndex: "",
      key: "x",
      width: "2%",
      render: (_, record) => (
        <Link
          onClick={() => {
            if (window.confirm("Czy chcesz usunąć ten rekord?")) {
              deleteItem(record.ID_TRANSACTION);
            }
          }}
        >
          Usuń
        </Link>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "x",
      width: "2%",
      render: (_, record) => (
        <Link to={`/edittransaction/${record.ID_TRANSACTION}`}>Edycja</Link>
      ),
    },
  ];

  return (
    <div className="transactionContainer">
      <Summary
        totalValueExpense={totalValueExpense}
        totalNumberOfExpense={totalNumberOfExpense}
        profileName={profileName}
      />
      <div className="transactionList">
        {data.length > 0 ? (
          <>
            <ExpenseChart totalExpense={totalValueExpense} data={data} />
            <div className="list">
              <h2>Historia</h2>
              <Table
                columns={columns}
                dataSource={data.map((item) => ({
                  ...item,
                  key: item.ID_TRANSACTION,
                }))}
                expandable={{
                  expandedRowRender: (record) =>
                    record.DESCRIPTION ? (
                      <p style={{ margin: 0 }}>{record.DESCRIPTION}</p>
                    ) : null,
                  rowExpandable: (record) => !!record.DESCRIPTION,
                }}
                size="middle"
                pagination={{ pageSize: 8 }}
              />
            </div>
          </>
        ) : (
          <EmptyTransactionList />
        )}
      </div>
    </div>
  );
};

export default TransactionContainer;
