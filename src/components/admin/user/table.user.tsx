import { getUsersAPI, deleteUserAPI } from "@/services/api";
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { App, Avatar, Button, Popconfirm, Tag } from "antd";
import { useRef, useState } from "react";
import DetailUser from "./detail.user";
import CreateUser from "./create.user";
import UpdateUser from "./update.user";
import { CSVLink } from "react-csv";

const TableUser = () => {
  const actionRef = useRef<ActionType>();
  const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const { message, notification } = App.useApp();
  

  const handleDeleteUser = async (id: number) => {
    setIsDeleteUser(true);
    const res = await deleteUserAPI(id);
    if (res.success) {
      message.success("Delete user successfully");
      refreshTable();
    } else {
      notification.error({
        message: "An error occurred.",
        description: res.message,
      });
    }
    setIsDeleteUser(false);
  };

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "ID",
      dataIndex: "id",
      hideInSearch: true,
      render(dom, entity) {
        return (
          <a
            onClick={() => {
              setDataViewDetail(entity);
              setOpenViewDetail(true);
            }}
            href="#"
          >
            {entity.id}
          </a>
        );
      },
    },

  {
    title: "Avatar",
    dataIndex: "avatar",
    render: (_, record) => {
      const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(record.name || "User")}&background=random`;

      return (
        <Avatar
          size={40}
          src={record.avatar || defaultAvatar}
          style={{ objectFit: "cover" }}
        />
      );
    },
    hideInSearch: true,
    hideInTable: false,
  },
    {
      title: "Full Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      valueType: "select",
      valueEnum: {
        admin: { text: "Admin", status: "Processing" },
        customer: { text: "Customer", status: "Success" },
      },
      render: (_, record) => (
        <Tag color={record.role === "admin" ? "geekblue" : "green"}>
          {record.role.toUpperCase()}
        </Tag>
      ),
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "dateTime",
      sorter: true,
      sortDirections: ["ascend"],
      hideInSearch: true,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      valueType: "dateTime",
      sorter: true,
      sortDirections: ["ascend"],
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: "Action",
      hideInSearch: true,
      render: (_, entity) => (
        <>
          <EditTwoTone
            twoToneColor="#f57800"
            style={{ cursor: "pointer", marginRight: 15 }}
            onClick={() => {
              setDataUpdate(entity);
              setOpenModalUpdate(true);
            }}
          />
          <Popconfirm
            title="Confirm user deletion"
            description="Are you sure you want to delete this user?"
            onConfirm={() => {
              if (entity.id !== undefined) {
                handleDeleteUser(entity.id);
              } else {
                notification.error({
                  message: "Invalid user",
                  description: "Cannot delete user with missing ID",
                });
              }
            }}
            okText="Confirm"
            cancelText="Cancel"
            okButtonProps={{ loading: isDeleteUser }}
          >
            <DeleteTwoTone twoToneColor="#ff4d4f" style={{ cursor: "pointer" }} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<IUserTable>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          const query: Record<string, any> = {
            _page: params.current,
            _per_page: params.pageSize,
          };

          if (params.name) query.name = params.name;
          if (params.email) query.email = params.email;

          if (sort?.createdAt) {
            query._sort = "createdAt";
          }
          if (sort?.updatedAt) {
            query._sort = "updatedAt";
          }

          const res = await getUsersAPI(query);

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
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} rows`,
        }}
        headerTitle="User Management"
        toolBarRender={() => [
          <CSVLink data={currentDataTable} filename="export-user.csv">
            <Button icon={<ExportOutlined />} type="primary">
              Export
            </Button>
          </CSVLink>,
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
          >
            Add New
          </Button>,
        ]}
      />

      <DetailUser
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <CreateUser
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />

      <UpdateUser
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        setDataUpdate={setDataUpdate}
        dataUpdate={dataUpdate}
      />
    </>
  );
};

export default TableUser;
