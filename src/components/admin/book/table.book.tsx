import { useRef, useState } from "react";
import { Popconfirm, Button, App } from "antd";
import {
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import DetailBook from "./detail.book";
import { CSVLink } from "react-csv";
import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { deleteBookAPI, getBooksAPI } from "@/services/api";
import CreateBook from "./create.book";
import UpdateBook from "./update.book";


type TSearch = {
  name: string;
  author: string;
  category: string;
};

const TableBook = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);
  const [isDeleteBook, setIsDeleteBook] = useState(false);
  const { message, notification } = App.useApp();

  const handleDeleteBook = async (id: number) => {
    setIsDeleteBook(true);
    const res = await deleteBookAPI(id);
    if (res && res.success) {
      message.success("Deleted book successfully");
      refreshTable();
    } else {
      notification.error({
        message: "Error occurred",
        description: res.message,
      });
    }
    setIsDeleteBook(false);
  };

  const refreshTable = () => {
    actionRef.current?.reload();
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
    responsive: ["xs"],
  },
  {
    title: "Author",
    dataIndex: "author",
    responsive: ["md"],
  },
  {
    title: "Category",
    dataIndex: "category",
    responsive: ["md"],
  },
  {
    title: "Price",
    dataIndex: "price",
    hideInSearch: true,
    render: (_, record) =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(record.price),
    sorter: true,
    sortDirections: ["ascend"],
    responsive: ["sm"],
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    valueType: "dateTime",
    hideInSearch: true,
    sorter: true,
    sortDirections: ["ascend"],
    responsive: ["lg"],
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    valueType: "dateTime",
    hideInSearch: true,
    hideInTable: true,
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
          okButtonProps={{ loading: isDeleteBook }}
        >
          <span style={{ cursor: "pointer" }}>
            <DeleteTwoTone twoToneColor="#ff4d4f" />
          </span>
        </Popconfirm>
      </>
    ),
    // responsive: ["xs"],
  },
];


  return (
    <>
      <ProTable<IBookTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          const query: Record<string, any> = {
            _page: params.current,
            _per_page: params.pageSize,
          };

          if (params.name) query.name = params.name;
          if (params.author) query.author = params.author;
          if (params.category) query.category = params.category;

          if (sort?.createdAt) query._sort = "createdAt";
          if (sort?.price) query._sort = "price";

          const res = await getBooksAPI(query);

          setCurrentDataTable(res.result);
          setMeta({
            current: params.current || 1,
            pageSize: params.pageSize || 5,
            total: res.total || 0,
          });

          return {
            data: res.result,
            total: res.total,
            success: true,
          };
        }}

        rowKey="id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} rows`,
        }}
        headerTitle="Books Table"
        toolBarRender={() => [
          <CSVLink data={currentDataTable} filename="books.csv">
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
        refreshTable={refreshTable}
      />
      <UpdateBook
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableBook;
