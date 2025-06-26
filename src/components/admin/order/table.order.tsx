import { useEffect, useRef, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import { EditTwoTone } from "@ant-design/icons";
import { App } from "antd";
import type { ActionType, ProColumns } from "@ant-design/pro-components";

import DetailOrder from "./detail.order";
import UpdateOrder from "./update.order";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchListOrders } from "@/redux/order/orderSlice";

const TableOrder = () => {
  const actionRef = useRef<ActionType>();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();

  const { listOrders, loading, total, error } = useAppSelector(
    (state) => state.order
  );

  const [meta, setMeta] = useState({ current: 1, pageSize: 5 });
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IOrderWithUser | null>(null);

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IOrderWithUser | null>(null);

  const fetchData = () => {
    const params: Record<string, any> = {
      _page: meta.current,
      _per_page: meta.pageSize,
    };
    if (sortField) {
      params._sort = sortField;
    }
    if (statusFilter) {
      params.status = statusFilter;
    }

    dispatch(fetchListOrders(params));
  };

  useEffect(() => {
    fetchData();
  }, [meta.current, meta.pageSize, sortField, statusFilter]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);


  const columns: ProColumns<IOrderWithUser>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
      responsive: ["sm"],

    },
    {
      title: "Order ID",
      dataIndex: "id",
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
      hideInSearch: true,
    },
    {
      title: "Full Name",
      dataIndex: "userFullName",
      hideInSearch: true,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (_, record) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record.totalPrice || 0),
      hideInSearch: true,
      responsive: ["md"],

    },
    {
      title: "Status",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        pending: { text: "Pending", status: "Warning" },
        processing: { text: "Processing", status: "Processing" },
        shipped: { text: "Shipped", status: "Default" },
        delivered: { text: "Delivered", status: "Success" },
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "dateTime",
      sorter: true,
      hideInSearch: true,
      sortDirections: ["ascend"],
      responsive: ["md"],

    },
    {
      title: "Action",
      hideInSearch: true,
      render: (_, entity) => (
        <EditTwoTone
          twoToneColor="#f57800"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setDataUpdate(entity);
            setOpenModalUpdate(true);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <ProTable<IOrderWithUser>
        columns={columns}
        actionRef={actionRef}
        dataSource={listOrders}
        loading={loading}
        rowKey="id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} rows`,
          onChange: (page, pageSize) => setMeta({ current: page, pageSize }),
        }}
        onChange={(_, __, sorter: any) => {
          if (sorter?.field) {
            setSortField(sorter.field);
          } else {
            setSortField(undefined);
          }
        }}
        onSubmit={(values) => {
          setStatusFilter(values.status || undefined);
          setMeta({ ...meta, current: 1 });
        }}
        onReset={() => {
          setStatusFilter(undefined);
          setMeta({ ...meta, current: 1 });
        }}
        headerTitle="Orders Table"
      />

      <DetailOrder
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <UpdateOrder
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={fetchData}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableOrder;
