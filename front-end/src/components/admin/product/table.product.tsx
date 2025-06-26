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

import DetailProduct from "./detail.product";
import CreateProduct from "./create.product";
import UpdateProduct from "./update.product";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  fetchListProducts,
  deleteProduct,
  resetDelete,
} from "@/redux/product/productSlice";

const TableProduct = () => {
  const dispatch = useAppDispatch();
  const actionRef = useRef<ActionType>();

  const { listProducts, total, loading, isDeleteSuccess, error } = useAppSelector(
    (state) => state.product
  );

  const { message, notification } = App.useApp();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IProductTable | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IProductTable | null>(null);

  // Fetch Redux data
  const fetchData = () => {
    const query: Record<string, any> = {
      _page: currentPage,
      _per_page: pageSize,
    };

    if (sortField) query._sort = sortField;
    if (searchName) query.name = searchName;
    if (searchCategory) query.category = searchCategory;

    dispatch(fetchListProducts(query));
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, sortField, searchName, searchCategory]);

  useEffect(() => {
    if (isDeleteSuccess) {
      message.success("Deleted product successfully");
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

  const handleDeleteProduct = (id: number) => {
    dispatch(deleteProduct(id));
  };

  const columns: ProColumns<IProductTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
      responsive: ["sm"],
    },
    {
      title: "Product ID",
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
            title="Confirm delete product"
            description="Are you sure to delete this product?"
            onConfirm={() => {
              if (entity.id !== undefined) {
                handleDeleteProduct(entity.id);
              } else {
                notification.error({
                  message: "Invalid product",
                  description: "Cannot delete product with missing ID",
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
      <ProTable<IProductTable>
        columns={columns}
        actionRef={actionRef}
        dataSource={listProducts}
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
          setSearchCategory(values.category || "");
          setCurrentPage(1);
        }}
        onReset={() => {
          setSearchName("");
          setSearchCategory("");
          setCurrentPage(1);
        }}
        headerTitle="Products Table"
        toolBarRender={() => [
          <CSVLink data={listProducts} filename="products.csv">
            <Button icon={<ExportOutlined />} type="primary">
              Export
            </Button>
          </CSVLink>,
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
          >
            Add New Product
          </Button>,
        ]}
      />

      <DetailProduct
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <CreateProduct
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={fetchData}
      />

      <UpdateProduct
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={fetchData}
        setDataUpdate={setDataUpdate}
        dataUpdate={dataUpdate}
      />
    </>
  );
};

export default TableProduct;
