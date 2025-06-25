import { useRef, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { EditTwoTone } from "@ant-design/icons";
import { Tag, App } from "antd";
import { getBookByIdAPI, getOrdersAPI, getUserByIdAPI } from "@/services/api";
import UpdateOrder from "./update.order";
import DetailOrder from "./detail.order"; // nếu chưa có thì tạo 1 component modal đơn giản

interface TSearchOrder {
  userFullName?: string;
  status?: OrderStatus;
}

const TableOrder = () => {
  const actionRef = useRef<ActionType>();
  const { message } = App.useApp();

  const [meta, setMeta] = useState({ current: 1, pageSize: 5, total: 0 });
  const [loading, setLoading] = useState(false);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IOrderWithUser | null>(null);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IOrderWithUser | null>(null);

  const columns: ProColumns<IOrderWithUser>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
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
    },
      {
      title: "Updated At",
      dataIndex: "updatedAt",
      valueType: "dateTime",
      sorter: true,
      hideInSearch: true,
      sortDirections: ["ascend"],
      hideInTable: true, 
    }, 
    {
      title: "Actions",
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
      <ProTable<IOrderWithUser, TSearchOrder>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        loading={loading}
        request={async (params, sort) => {
          setLoading(true);
          try {
            const query: Record<string, any> = {
              _page: params.current || 1,
              _per_page: params.pageSize || 5,
            };

            if (sort?.createdAt) {
              query._sort = sort.createdAt === "ascend" ? "createdAt" : "-createdAt";
            }
            if (params.status) {
              query.status = params.status;
            }

            const res = await getOrdersAPI(query);
            const ordersRaw: IOrder[] = res.result || [];

            const enrichedOrders: IOrderWithUser[] = await Promise.all(
              ordersRaw.map(async (order) => {
                // 1. Lấy thông tin user
                let userFullName = "Unknown";
                try {
                  const userRes = await getUserByIdAPI(order.userId);
                  userFullName = userRes?.data?.name || "Unknown";
                } catch { }

                // 2. Lấy thông tin sách và tính tổng tiền
                let totalPrice = 0;
                try {
                  const bookPromises = order.productIds.map((bookId) =>
                    getBookByIdAPI(bookId)
                  );
                  const bookResults = await Promise.all(bookPromises);
                  totalPrice = bookResults.reduce(
                    (acc, res) => acc + (res.data?.price || 0),
                    0
                  );
                } catch (e) {
                  console.error("Error loading book info", e);
                }

                return {
                  ...order,
                  userFullName,
                  totalPrice,
                };
              })
            );

            setMeta({ current: query._page, pageSize: query._per_page, total: res.total || 0 });

            return {
              data: enrichedOrders,
              success: true,
              total: res.total,
            };
          } catch (err) {
            message.error("Failed to fetch orders");
            return {
              data: [],
              success: false,
              total: 0,
            };
          } finally {
            setLoading(false);
          }
        }}

        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} rows`,
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
        refreshTable={() => actionRef.current?.reload()}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />

    </>
  );
};

export default TableOrder;
