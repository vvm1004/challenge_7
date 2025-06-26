import { useEffect, useRef, useState } from "react";
import { App, Button, Popconfirm } from "antd";
import {
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { CSVLink } from "react-csv";
import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";

import DetailBook from "./detail.book";
import CreateBook from "./create.book";
import UpdateBook from "./update.book";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  fetchListBooks,
  deleteBook,
  resetDelete,
} from "@/redux/book/bookSlice";

const TableBook = () => {
  const dispatch = useAppDispatch();
  const actionRef = useRef<ActionType>();

  const { listBooks, total, loading, isDeleteSuccess, error } = useAppSelector(
    (state) => state.book
  );

  const { message, notification } = App.useApp();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);

  // Fetch Redux data
  const fetchData = () => {
    const query: Record<string, any> = {
      _page: currentPage,
      _per_page: pageSize,
    };

    if (sortField) query._sort = sortField;
    if (searchName) query.name = searchName;
    if (searchAuthor) query.author = searchAuthor;
    if (searchCategory) query.category = searchCategory;

    dispatch(fetchListBooks(query));
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, sortField, searchName, searchAuthor, searchCategory]);

  useEffect(() => {
    if (isDeleteSuccess) {
      message.success("Deleted book successfully");
      dispatch(resetDelete());
      fetchData();
    }
  }, [isDeleteSuccess]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Error",
        description: error,
      });
    }
  }, [error]);

  const handleDeleteBook = (id: number) => {
    dispatch(deleteBook(id));
  };

  const columns: ProColumns<IBookTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
      responsive: ["sm"],
    },
    {
      title: "Book ID",
      dataIndex: "id",
      hideInSearch: true,
      render: (_, entity) => (
        <a
          onClick={() => {
            setDataViewDetail(entity);
            setOpenViewDetail(true);
          }}
        >
          {entity.id}
        </a>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      // responsive: ["md"],
    },
    {
      title: "Author",
      dataIndex: "author",
      // responsive: ["md"],
    },
    {
      title: "Category",
      dataIndex: "category",
      responsive: ["md"],
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (_, record) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record.price),
      sorter: true,
      sortDirections: ["ascend"],
      hideInSearch: true,
      responsive: ["sm"],

    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "dateTime",
      sorter: true,
      hideInSearch: true,
      sortDirections: ["ascend"],
      responsive: ["lg"],

    },
    {
      title: "Actions",
      hideInSearch: true,
      render: (_, entity) => (
        <>
          <EditTwoTone
            twoToneColor="#f57800"
            style={{ cursor: "pointer", marginRight: 10 }}
            onClick={() => {
              setOpenModalUpdate(true);
              setDataUpdate(entity);
            }}
          />
          <Popconfirm
            placement="leftTop"
            title="Confirm delete book"
            description="Are you sure to delete this book?"
            onConfirm={() => {
              if (entity.id !== undefined) {
                handleDeleteBook(entity.id);
              } else {
                notification.error({
                  message: "Invalid book",
                  description: "Cannot delete book with missing ID",
                });
              }
            }}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: loading }}
          >
            <DeleteTwoTone twoToneColor="#ff4d4f" style={{ cursor: "pointer" }} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<IBookTable>
        columns={columns}
        actionRef={actionRef}
        dataSource={listBooks}
        loading={loading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        onChange={(_, __, sorter: any) => {
          if (sorter?.field) {
            setSortField(sorter.field);
          } else {
            setSortField("");
          }
        }}
        onSubmit={(values) => {
          setSearchName(values.name || "");
          setSearchAuthor(values.author || "");
          setSearchCategory(values.category || "");
          setCurrentPage(1);
        }}
        onReset={() => {
          setSearchName("");
          setSearchAuthor("");
          setSearchCategory("");
          setCurrentPage(1);
        }}
        headerTitle="Books Table"
        toolBarRender={() => [
          <CSVLink data={listBooks} filename="books.csv">
            <Button icon={<ExportOutlined />} type="primary">
              Export
            </Button>
          </CSVLink>,
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
          >
            Add New Book
          </Button>,
        ]}
      />

      <DetailBook
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <CreateBook
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={fetchData}
      />

      <UpdateBook
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={fetchData}
        setDataUpdate={setDataUpdate}
        dataUpdate={dataUpdate}
      />
    </>
  );
};

export default TableBook;
